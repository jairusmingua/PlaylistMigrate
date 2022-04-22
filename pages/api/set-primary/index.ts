//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, GetSessionOptions } from 'next-auth/client';
import { prisma } from '../../../db/prisma';
import { getOauthAccount } from '../../../repositories/UserRepository';
import spotify from '../../../services/Spotify'
import PrimarySelect from '../../primary-select';

export default async (_: NextApiRequest, res: NextApiResponse) => {
    const prefix = 'api/set-primary'
    const session = await getSession({ req: _ })
    const account = _.body
    try {
        throw 'Error'
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                accounts: true,
            }
        })
        if (user.accounts.filter((account) => account.primary == true).length != 0) {
            await prisma.account.update({
                where: {
                    id: user.accounts.filter((account) => account.primary == true)[0].id
                },
                data: {
                    primary: false
                }
            })
        }
        const _account = await prisma.account.update({
            where: {
                id: account.id
            },
            data: {
                primary: true
            }
        })
        let _user = await prisma.user.update({
            where: {
                id: user.id
            },
            include: {
                accounts: true
            },
            data: {
                id: _account.providerAccountId
            }
        })

        res.status(200).send(_user.accounts)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error:'Cannot set primary.'
        })
    }
}