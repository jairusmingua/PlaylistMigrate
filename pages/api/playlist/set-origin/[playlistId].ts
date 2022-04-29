import { Playlist } from '@prisma/client';
import cuid from 'cuid';
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, GetSessionOptions } from 'next-auth/client';
import { prisma } from '../../../../db/prisma'
import { getOauthAccount, getUser } from '../../../../repositories/UserRepository';
import { services } from '../../../../services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let { playlistId } = req.query

        let user = await getUser({ req: req })

        let playlist: Playlist = req.body
        playlist.id = cuid()
        playlist.userId = user.id
        playlist.playlistId = playlistId.toString()

        const dbplaylist = await prisma.playlist.create({
            data: {
                id: playlist.id,
                user:{
                    connect:{
                        id: user.id
                    }
                },
                Playlist:{
                    connect:{
                        external_id: playlistId.toString()
                    }
                },
                external_id: playlist.external_id,
                title: playlist.title,
                description: playlist.description,
                image: playlist.image,
                platform: playlist.platform,
                createdAt: playlist.createdAt,
                updatedAt: playlist.updatedAt
            }
        })
        
        if(!dbplaylist){
            throw  'Unabled to Create Playlist Origin'
        }
        return res.status(200).send({})
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: error
        })
    }
}