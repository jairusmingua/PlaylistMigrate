import { IncomingMessage, ServerResponse } from 'http'

import { prisma } from '../db/prisma'
import { Account, User } from "@prisma/client";

import { getSession } from "next-auth/client";
import { OAuthProviderType } from "next-auth/providers";


export async function getUser(req: IncomingMessage, res: ServerResponse){
    const session = await getSession({ req: req })
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
export function getOauthAccount(accounts : Account[], providerType: OAuthProviderType): Account{
    const account = accounts.filter((account)=> account.providerId == providerType.toLowerCase())
    if(account.length == 0){
        return null
    }
    return account[0]
}