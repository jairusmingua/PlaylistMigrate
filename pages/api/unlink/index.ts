//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, GetSessionOptions } from 'next-auth/client';
import { prisma } from '../../../db/prisma';

export default async (_: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req: _ })
    const account = _.body
    try {
        await prisma.account.delete({
            where:{
                id: account.id
            }
        })
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            include: {
                playlists: true,
                accounts: true,
            }

        })
        res.status(200).json(user.accounts)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Failed Linking Account'
        })
    }
}