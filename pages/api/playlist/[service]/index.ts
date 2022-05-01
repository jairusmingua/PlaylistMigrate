//redirects user to respective auth sites
import { Playlist } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, GetSessionOptions } from 'next-auth/client';
import { prisma } from '../../../../db/prisma';
import { getOauthAccount, getUser } from '../../../../repositories/UserRepository';
import { services } from '../../../../services'

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
                platform: service == 'spotify' ? 'SPOTIFY' : 'YOUTUBE'
            },
            include:{
                playlistOrigin: true,
                Playlist: true
            },
            orderBy:{
                createdAt: 'desc'
            }
        })

        const playlist: Playlist[] = await services[service.toString()].getPlaylists(credentials, dbplaylist)
        if (dbplaylist.length == 0) {
            await prisma.playlist.createMany({
                data: [...playlist],
                skipDuplicates: true
            })
            return res.status(200).json({
                items: playlist
            })
        }
        if (playlist.length != dbplaylist.length) {
            const inserts = []
            const deletions = []
            playlist.forEach((n) => {
                if (!dbplaylist.find((o) => o.external_id == n.external_id)) {
                    inserts.push(n)
                }
            })
            dbplaylist.forEach((n) => {
                if (!playlist.find((o) => o.external_id == n.external_id)) {
                    deletions.push(n)
                }
            })
            deletions.forEach(async (d) => {
                const deleted = await prisma.playlist.delete({
                    where: {
                        id: d.id
                    },
                    select: {
                        playlistOrigin: true,
                        Playlist: true
                    }
                })
                if (deleted && deleted.playlistOrigin.length != 0) {
                    const newOriginPlaylist = deleted.playlistOrigin[0]
                    for (let i = 0; i < deleted.playlistOrigin.length; i++) {
                        if (i == 0) {
                            await prisma.playlist.update({
                                where: {
                                    id: deleted.playlistOrigin[i].id
                                },
                                data: {
                                    playlistId: null
                                }
                            })
                        } else {
                            await prisma.playlist.update({
                                where: {
                                    id: deleted.playlistOrigin[i].id
                                },
                                data: {
                                    playlistId: newOriginPlaylist.id
                                }
                            })

                        }
                    }
                }
            })
            inserts.forEach(async (d) => {
                await prisma.playlist.createMany({
                    data: [...inserts],
                    skipDuplicates: true
                })
            })
            const p = await prisma.playlist.findMany({
                where: {
                    userId: user.id,
                    platform: service == 'spotify' ? 'SPOTIFY' : 'YOUTUBE'
                },
                orderBy:{
                    createdAt: 'desc'
                }
            })
            return res.status(200).json({
                items: p
            })

        }
        return res.status(200).json({
            items: dbplaylist
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: error
        })
    }
}