import { Credentials, AuthType, OAuthType, Song, Service, Profile, Playlist as P } from './types';
import { Account, Playlist, User } from '@prisma/client';
import { prisma } from '../db/prisma';
import cuid from 'cuid'
import 'dotenv/config'

class YoutubeProfile extends Profile {
    constructor(profile: any) {
        super();
        this.name = profile.items[0].snippet.title;
        this.profilePic_url = profile.items[0].snippet.thumbnails.default.url
    }
}
class YoutubePlaylist extends P {
    constructor(playlist: any) {
        super();
        this.name = playlist.snippet.title;
        this.id = playlist.id;
        this.image = playlist.snippet.thumbnails.medium.url;
    }
}
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
    async getPlaylists(account: Account) {
        const params = new URLSearchParams({
            part: 'snippet',
            maxResults: '25',
            mine: 'true'
        })
        const url = `${process.env.YOUTUBE_BASE_URL}/playlists?${params}`;
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
                title: item.snippet.title,
                image: item.snippet.thumbnails['default'].url,
                userId: account.userId,
                id: cuid(),
                description: item.snippet.description,
                platform: 'YOUTUBE',
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