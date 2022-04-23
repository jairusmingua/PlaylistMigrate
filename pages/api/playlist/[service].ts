//redirects user to respective auth sites
import { Playlist } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, GetSessionOptions } from 'next-auth/client';
import { prisma } from '../../../db/prisma';
import { getOauthAccount, getUser } from '../../../repositories/UserRepository';
import { services } from '../../../services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let { service } = req.query
        let user = await getUser({ req: req })
        const credentials = getOauthAccount(user.accounts, service.toString())
        if (!credentials) {
            return res.status(404)
        }
        const dbplaylist = await prisma.playlist.findMany({
            where: {
                userId: user.id,
                platform: service == 'spotify'? 'SPOTIFY':'YOUTUBE'
            }
        })

        const playlist: Playlist[] = await services[service.toString()].getPlaylists(credentials)
        if(dbplaylist.length == 0){
            await prisma.playlist.createMany({
                data: [...playlist]
            })
            return res.status(200).json({
                items: playlist
            })
        }
        if (playlist.length > dbplaylist.length) {
            let _ = playlist.filter((p) => {
                if (dbplaylist.find((db) => db.external_id == p.external_id)) {
                    return p
                }

            })
            await prisma.playlist.createMany({
                data: [..._]
            })
            let _dbplaylist = await prisma.playlist.findMany({
                where: {
                    userId: user.id,
                    platform: service == 'spotify'? 'SPOTIFY':'YOUTUBE'
                }
            })
            return res.status(200).json({
                items: _dbplaylist
            })
            

        }
        return res.status(200).json({
            items: playlist
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: error
        })
    }
}