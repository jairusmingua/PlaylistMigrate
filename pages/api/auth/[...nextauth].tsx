
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, getProviders } from 'next-auth/client'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient, User, Account } from "@prisma/client"

const prisma = new PrismaClient()

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
                clientSecret: process.env.YOUTUBE_CLIENT_SECRET
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
                        where:{
                            userId: account.id
                        }
                    }
                )

                if (_account) {
                    return '/settings?linking-success=false'
                }

                return true;
            },
            async session(session, user) {
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
        },
        adapter: PrismaAdapter(prisma)


    });
