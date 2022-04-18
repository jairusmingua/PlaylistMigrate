
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient, User } from "@prisma/client"

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
                const _user: User = await prisma.user.findUnique({
                    where: {
                        email: session.user.email,
                    }
                })
                if (account.id == _user.id) {
                    return true
                }
                return '/settings?linking-success=false';
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
