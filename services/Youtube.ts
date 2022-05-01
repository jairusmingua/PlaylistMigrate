import { Credentials, AuthType, OAuthType, Song, Service, Profile, Playlist as P } from './types';
import { Account, Platform, Playlist, User } from '@prisma/client';
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
    async getPlaylists(account: Account, dbplaylist: Playlist[], playlist: Playlist[] = [], next: string = null) {
        let _params = {
            pageToken: next
        }
        let __params = {
            part: 'snippet',
            maxResults: '25',
            mine: 'true',

        }
        if (next) {
            __params = {
                ...__params,
                ..._params
            }
        }
        const params = new URLSearchParams(__params)
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
        const _next = data.nextPageToken
        const playlistCount = data.pageInfo.totalResults - 1
        if (dbplaylist.length == playlistCount && dbplaylist) {
            return dbplaylist
        }
        const items: [] = data.items
        const _playlist: Playlist[] = items.map((item: any) => {
            return {
                title: item.snippet.title,
                image: item.snippet.thumbnails['default'].url,
                userId: account.userId,
                id: cuid(),
                description: item.snippet.description,
                platform: 'YOUTUBE',
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
    } catch(error) {
        console.log(error)
        return []
    }
    async getPlaylist(account: Account, playlistId: string | string []){
        try {
            let params = new URLSearchParams({
                part: 'snippet,status',
                id: playlistId.toString()
            })
            let url = `${process.env.YOUTUBE_BASE_URL}/playlists?${params}`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${account.accessToken}`,
                    "Accept": "application/json",
                }
            });
            if (response.status != 200) {
                throw await response.json()
            }

            let data = await response.json()
            if(data.items.length == 0){
                return null
            }
            const imageSrc = data.items[0].snippet.thumbnails['standard']?.url

            return {
                title: data.items[0].snippet.title,
                image:  imageSrc,
                userId: '',
                id: cuid(),
                description: data.description,
                platform: Platform.YOUTUBE,
                playlistId: null,
                external_id: data.items[0].id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }
}