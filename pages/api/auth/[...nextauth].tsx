
import { prisma } from '../../../db/prisma'
import { Account } from "@prisma/client"

import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, getProviders } from 'next-auth/client'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import spotify from '../../../services/Spotify'
import youtube from '../../../services/Youtube'
import { Service } from '../../../services/types'
import { tokenExpiration } from '../../../util'

const services : {[provider: string]: Service} = {
    'spotify': spotify,
    'google': youtube
}

export default async (_: NextApiRequest, res: NextApiResponse) =>
    NextAuth(_, res, {
        providers: [
            Providers.Spotify({
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                scope: 'user-read-private user-read-email'
            }),
            Providers.Google({
                clientId: process.env.YOUTUBE_CLIENT_ID,
                clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
                scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.force-ssl',
                authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code'
            })
        ],
        callbacks: {
            async signIn(user, account, profile) {
                const session = await getSession({ req: _ })
                if (!session) {
                    return true
                }
                const _account: Account = await prisma.account.findFirst(
                    {
                        where: {
                            providerAccountId: account.id
                        }
                    }
                )
                if (_account) {
                    return '/api/auth/callback/?status=ERROR&message=Failed to Link Account'
                }

                return true;
            },
            async session(session, user) {
                const { accounts } = await prisma.user.findUnique({
                    where: {
                        email: user.email
                    },
                    include: {
                        accounts: true
                    }
                })
                accounts.map((account) => {
                    if (tokenExpiration(account.updatedAt) > 1000) {
                        services[account.providerId].refreshToken(account)
                    }
                })
                return session
            }
        },
        debug: process.env.NODE_ENV === 'development',
        secret: process.env.AUTH_SECRET,
        jwt: {
            secret: process.env.JWT_SECRET
        },
        pages: {
            signIn: '/login', 
            newUser: '/auth/new-user' 
        },
        adapter: PrismaAdapter(prisma)


    });
