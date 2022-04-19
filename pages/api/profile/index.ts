//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, GetSessionOptions } from 'next-auth/client';
import { prisma } from '../../../db/prisma';
import { getOauthAccount } from '../../../repositories/UserRepository';
import spotify from '../../../services/Spotify'

export default async (_: NextApiRequest, res: NextApiResponse) => {
    const prefix = 'api/profile'
    const session = await getSession({ req: _ })
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            include: {
                playlists: true,
                accounts: true,
            }

        })
        const spotifyCredentials = getOauthAccount(user.accounts, 'Spotify')
        if (!spotifyCredentials) {
            return res.status(200).json(user)
        }
        const playlist = await spotify.getPlaylists(spotifyCredentials);
        if (playlist.length > user.playlists.length) {
            playlist.map((item) => {
                prisma.playlist.upsert({
                    update: {
                        title: item.title,
                        image: item.image,
                        description: item.description.toString(),
                        platform: 'SPOTIFY',
                        url: '',
                        updatedAt: new Date()
                    },
                    create: item,
                    where: {
                        external_id: item.external_id
                    }
                }).then((item) => { return item }).catch((err) => { throw err });
            })
        }
        if (!playlist) {
            throw "Playlist Error"
        }
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}