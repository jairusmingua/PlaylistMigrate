import { IncomingMessage, ServerResponse } from 'http'

import { prisma } from '../db/prisma'
import { Account, User } from "@prisma/client";

import { getSession, GetSessionOptions } from "next-auth/client";
import { OAuthProviderType } from "next-auth/providers";
import { Source } from '../@client/types';
import { NextApiRequest, NextApiResponse } from 'next';


export async function getUser(options?: GetSessionOptions){
    const session = await getSession(options)
    if (!session) {
        return null
    }
    return await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
        include: {
            accounts: true,
        }
    })
}
export function getOauthAccount(accounts : Account[], providerId: Source | string): Account{
    const account = accounts.filter((account)=> account.providerId == providerId.toLowerCase())
    if(account.length == 0){
        return null
    }
    return account[0]
}