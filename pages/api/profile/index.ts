//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import { SpotifyService, YoutubeService } from '../../../services/PlaylistMigrate';
import { getSession, GetSessionOptions } from 'next-auth/client';
import prisma from '../../../db/prisma';
import spotify from '../../../services/Spotify'
import { Account, Playlist } from '@prisma/client';
export default async (_: NextApiRequest, res: NextApiResponse) => {
    const prefix = 'api/profile'
    const session = await getSession({ req: _ })
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
        // const playlist = user.playlists
        // console.log(spotifyCredentials)
        // console.log(await spotify.getPlaylists(spotifyCredentials))
        // console.log(`${prefix} ${session}`)
        // const playlist = await prisma.playlist.upsert({
        //     update:await spotify.getPlaylists(spotifyCredentials),
        // })
        const playlist = await spotify.getPlaylists(spotifyCredentials);
        if (playlist.length>user.playlists.length){
            playlist.map((item)=>{
                prisma.playlist.upsert({
                    update:{
                        title:item.title,
                        image:item.image,
                        description:item.description.toString(),
                        platform:"SPOTIFY",
                        url:"",
                        updatedAt: new Date()
                    },
                    create:item,
                    where:{
                        external_id:item.external_id
                    }
                }).then((item)=>{return item}).catch((err)=>{throw err});
            })
        }
        if (!playlist){
            throw "Playlist Error"
        }
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}