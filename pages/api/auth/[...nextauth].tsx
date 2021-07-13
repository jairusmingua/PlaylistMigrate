
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

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