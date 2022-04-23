import { Credentials, AuthType, OAuthType, Song, Service, Profile } from './types';
import { Account, Playlist, User } from '@prisma/client';
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
    async getPlaylists(account: Account) {
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
        const items: [] = data.items
        const playlist: Playlist[] = items.map((item: any) => {
            return {
                title: item.name,
                image: item.images[0].url,
                userId: account.userId,
                id: cuid(),
                description: item.description,
                platform: 'SPOTIFY',
                url: '',
                external_id: item.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })
        return playlist
    } catch(error) {
        console.log(error)
        return []
    }

}
