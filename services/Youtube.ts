import { Credentials, AuthType, OAuthType, YoutubePlaylist, Song, Service } from './types';
import { Account, Playlist, User } from '@prisma/client';
import { prisma } from '../db/prisma';
import cuid from 'cuid'
import 'dotenv/config'

export class Youtube extends Service {

    async refreshToken(account: Account): Promise<Account> {
        try {
            const url =
                "https://oauth2.googleapis.com/token?" +
                new URLSearchParams({
                    client_id: process.env.YOUTUBE_CLIENT_ID,
                    client_secret: process.env.YOUTUBE_CLIENT_SECRET,
                    grant_type: "refresh_token",
                    refresh_token: account.refreshToken,
                })
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                method: "POST",
            })
            const refreshedTokens = await response.json()
            if (!response.ok) {
                throw refreshedTokens
            }
            let youtube_token_modified: OAuthType = {
                access_token: refreshedTokens["access_token"],
                token_type: refreshedTokens["token_type"],
                expires_in: refreshedTokens["expires_in"],
                scope: refreshedTokens["scope"],
                auth_type: AuthType.youtube
            };
            return await prisma.account.update({
                where: {
                    id: account.id
                },
                data: {
                    accessToken: youtube_token_modified.access_token.toString()
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
                let i = new YoutubePlaylist(item)
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
            throw error;
        }
    }
}

declare const global: NodeJS.Global & { youtube: Youtube };

const youtube = global.youtube || new Youtube();
if (process.env.NODE_ENV === 'development') global.youtube = youtube;

export default youtube;