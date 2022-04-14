//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, GetSessionOptions } from 'next-auth/client';
import prisma from '../../../../db/prisma';
import spotify from '../../../../services/Spotify'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const prefix = 'api/playlist/spotify'
    const session = await getSession({ req: req })
    const {playlistId} = req.query
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            include:{
                playlists:true,
                accounts:true,
            }
            
        })
        const spotifyCredentials = user.accounts.filter(accounts=> accounts.providerId=="spotify")[0]
        const songs = await spotify.getPlaylistSongs(playlistId, spotifyCredentials)
        res.status(200).send(songs)
    } catch (error) {
        console.log(error)
    }
}