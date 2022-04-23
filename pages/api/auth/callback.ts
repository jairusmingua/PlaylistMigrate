//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, GetSessionOptions } from 'next-auth/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const status = req.query['status'].toString()
    const message = req.query['message'].toString()
    const url = new URL(req.cookies['next-auth.callback-url'])
    try {
        const params = new URLSearchParams({
            message: message,
            status: status
        })
        res.redirect(url.origin + url.pathname + '?'+params)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}