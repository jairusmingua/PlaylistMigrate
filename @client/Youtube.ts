import { Artist, Playlist, privacy, Service, Song, SongAPIResult } from "./types";

import axios from "axios";

import { Account } from "@prisma/client";

export class Youtube extends Service {
    baseUrl = 'https://youtube.googleapis.com/youtube/v3'
    constructor() { super({ allowsBulk: false }) }
    async getPlaylist(account: Account, playlistId: string | string[]): Promise<Playlist> {
        try {
            let params = new URLSearchParams({
                part: 'snippet,status',
                id: playlistId.toString()
            })
            let response = await axios.get(`${this.baseUrl}/playlists/?${params}`,
                this.config(account))
            if (response.status != 200) {
                throw response.data
            }
            if (response.data.items.length == 0) {
                return null
            }
            return {
                'id': response.data.items[0].id,
                'name': response.data.items[0].title,
                'imageSrc': response.data.items[0].thumbnails['default'].url,
                'privacy': response.data.items[0].status.privacyStatus
            }
        } catch (error) {
            return null
        }
    }
    async getPlaylistSongs(account: Account, playlistId: string | string[]): Promise<Song[]> {
        try {
            let params = new URLSearchParams({
                part: 'snippet',
                playlistId: playlistId.toString(),
                maxResults: '50'
            })
            let response = await axios.get(`${this.baseUrl}/playlistsItems/?${params}`,
                this.config(account))
            if (response.status != 200) {
                throw response.data
            }
            let songs: Song[] = []
            let items: [] = response.data.items
            items.forEach((item: any) => {
                songs.push({
                    id: item.snippet.resourceId.videoId,
                    name: item.snippet.title,
                    artists: [{
                        name: item.snippet.videoOwnerChannelTitle.replace(' - Topic', '')
                    }],
                    imageSrc: item.snippet.thumbnails['default'].url
                })
            })
            return songs
        } catch (error) {
            return []
        }
    }
    async createPlaylist(account: Account, playlistName: string, privacy: privacy): Promise<Playlist> {
        try {

            const payload = {
                'snippet': {
                    'title': playlistName,
                    'description': `This is migrated playlist from PlaylistMigrate`,
                    'tags': [
                        'playlistmigrate',
                        playlistName
                    ],
                    'defaultLanguage': 'en'
                },
                'status': {
                    'privacyStatus': privacy
                }
            }
            let response = await axios.post(`${this.baseUrl}/playlists?part=snippet%2Cstatus`,
                payload, this.config(account))

            if (response.status != 200) {
                throw response.data
            }
            return {
                'id': response.data.id,
                'name': response.data.snippet.title,
                'imageSrc': response.data.snippet.thumbnails['default'].url,
                'privacy': response.data.status.privacyStatus
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async insertItemsToPlaylist(account: Account, playlistId: string, song: SongAPIResult[], privacy: privacy = 'private', position: number = 0): Promise<boolean> {
        try {
            let payload = {
                'snippet': {
                    'playlistId': playlistId,
                    'position': 0,
                    'resourceId': {
                        'kind': 'youtube#video',
                        'videoId': song[0].external_id
                    }
                }
            }
            let response = await axios.post(`${this.baseUrl}/playlistItems?part=snippet`,
                payload, this.config(account))
            if (response.status != 200) {
                throw response.data
            }
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
    config(account: Account) {
        return {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${account.accessToken}`
            }
        }
    }
}