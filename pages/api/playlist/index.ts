//redirects user to respective auth sites
import { Playlist } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, GetSessionOptions } from 'next-auth/client';
import { prisma } from '../../../db/prisma';
import { getOauthAccount, getUser } from '../../../repositories/UserRepository';
import { services } from '../../../services'
import { providerPlatformMap } from '../../../services/types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let user = await getUser({ req: req })
        const credentials = user.accounts
        if (!credentials) {
            return res.status(404).send('No Credentials Found')
        }
        for (let i = 0; i < credentials.length; i++) {
            const c = credentials[i];

            const dbplaylist = await prisma.playlist.findMany({
                where: {
                    userId: user.id,
                    platform: providerPlatformMap[c.providerId]
                },
                include: {
                    playlistOrigin: true,
                    Playlist: true
                }
            })

            const playlist: Playlist[] = await services[c.providerId].getPlaylists(c, dbplaylist)
            if (dbplaylist.length == 0) {
                await prisma.playlist.createMany({
                    data: [...playlist],
                    skipDuplicates: true
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
            }
        }
        let allplaylist = await prisma.playlist.findMany({
            where:{
                userId: user.id,
                playlistId: null
            },
            include: {
                playlistOrigin: true,
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
        return res.status(200).json({
            items: allplaylist
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: error
        })
    }
}