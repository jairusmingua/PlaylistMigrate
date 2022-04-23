import { Credentials, AuthType, OAuthType, Song, Service, Profile, Playlist as P } from './types';
import { Account, Playlist, User } from '@prisma/client';
import { prisma } from '../db/prisma';
import cuid from 'cuid'
import 'dotenv/config'

class SpotifyProfile extends Profile {
    constructor(profile: any) {
        super();
        this.name = profile['display_name'];
        this.profilePic_url = profile['images'][0].url;
    }
}

class SpotifyPlaylist extends P {
    constructor(playlist: any) {
        super();
        this.name = playlist.name;
        this.id = playlist.id;
        this.image = playlist.images[0];
        this.description = playlist.description
    }
}
export class Spotify extends Service {
    constructor() {
        super()
    }
    async refreshToken(account: Account): Promise<Account> {
        try {
            const url = `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${account.refreshToken}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            let spotify_token = await response.json();
            let spotify_token_modified: OAuthType = {
                access_token: spotify_token["access_token"],
                token_type: spotify_token["token_type"],
                expires_in: spotify_token["expires_in"],
                scope: spotify_token["scope"],
                auth_type: AuthType.spotify
            };
            return await prisma.account.update({
                where: {
                    id: account.id
                },
                data: {
                    accessToken: spotify_token_modified.access_token.toString()
                }
            });
        } catch (error) {
            throw error
        }

    }
    async getPlaylists(account: Account): Promise<Playlist[] | any> {
        try {
            const url = `${process.env.SPOTIFY_BASE_URL}/v1/me/playlists?offset=0&limit=50`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${account.accessToken}`,
                    "Accept": "application/json",
                }
            });
            if (response.status == 401) {
                throw response.json()
            }
            const data = await response.json();
            const playlist: Array<Playlist> = []
            Array.from(data.items).map((item) => {
                let i = new SpotifyPlaylist(item)
                playlist.push({
                    title: i.name,
                    image: i.image['url'],
                    userId: account.userId,
                    id: cuid(),
                    description: i.description,
                    platform: 'SPOTIFY',
                    url: '',
                    external_id: i.id,
                    createdAt: new Date(),
                    updatedAt: new Date()

                })
            })
            return playlist

        } catch (error) {
            console.log(error)
            return error;
        }
    }
}

declare const global: NodeJS.Global & { spotify: Spotify };

const spotify = global.spotify || new Spotify();
if (process.env.NODE_ENV === 'development') global.spotify = spotify;

export default spotify;