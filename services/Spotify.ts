import { Credentials, AuthType, OAuthType, Song, Service, Profile } from './types';
import { Account, Platform, Playlist, User } from '@prisma/client';
import { prisma } from '../db/prisma';
import cuid from 'cuid'
import 'dotenv/config'

export class Spotify extends Service {
    constructor() { super() }
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
            return null
        }

    }
    async getPlaylists(account: Account, dbplaylist: Playlist[], playlist: Playlist[] = [], next: string = null) {
        try {
            let url = `${process.env.SPOTIFY_BASE_URL}/v1/me/playlists?offset=0&limit=50`;
            if (next) {
                url = next
            }
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
            const _next = data.next
            const playlistCount = data.total
            if (dbplaylist.length == playlistCount && dbplaylist) {
                return dbplaylist
            }
            const items: [] = data.items
            const _playlist: Playlist[] = items.map((item: any) => {
                return {
                    title: item.name,
                    image: item.images[0].url,
                    userId: account.userId,
                    id: cuid(),
                    description: item.description,
                    platform: 'SPOTIFY',
                    playlistId: null,
                    external_id: item.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            })
            playlist.push(..._playlist)
            if (_next) {
                return await this.getPlaylists(account, [], playlist, _next)
            }
            return playlist
        } catch (error) {
            return []
        }

    }
    async getPlaylist(account: Account, playlistId: string | string []){
        try {
            let url = `${process.env.SPOTIFY_BASE_URL}/v1/playlists/${playlistId}`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${account.accessToken}`,
                    "Accept": "application/json",
                }
            });
            if (response.status != 200) {
                throw response.json()
            }
            let data = await response.json()
            return {
                title: data.name,
                image: data.images[0].url,
                userId: '',
                id: cuid(),
                description: data.description,
                platform: Platform.SPOTIFY,
                playlistId: null,
                external_id: data.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        } catch (error) {
            return null
        }
    }
}
