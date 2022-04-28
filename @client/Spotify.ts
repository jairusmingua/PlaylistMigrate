import { Artist, Playlist, privacy, Service, Song, SongAPIResult } from "./types";

import axios from "axios";

import { Account } from "@prisma/client";

export class Spotify extends Service {
    baseUrl = 'https://api.spotify.com/v1'
    constructor() { super({ allowsBulk: true }) }
    async getPlaylist(account: Account, playlistId: string | string[]): Promise<Playlist> {
        try {

            let response = await axios.get(`${this.baseUrl}/playlists/${playlistId}`,
                this.config(account))
            if (response.status != 200) {
                throw response.data
            }
            return {
                'id': response.data.id,
                'name': response.data.name,
                'imageSrc': response.data.images[0].url,
                'privacy': null
            }
        } catch (error) {
            return null
        }
    }
    async getPlaylistSongs(account: Account, playlistId: string | string[]): Promise<{ songs: Song[], totalSongs: number }> {
        try {
            let response = await axios.get(`${this.baseUrl}/playlists/${playlistId}/tracks`,
                this.config(account))
            if (response.status != 200) {
                throw response.data
            }
            let songs: Song[] = []
            let items: [] = response.data.items
            items.forEach((item: any) => {
                let artist: Artist[] = item.track.artists
                songs.push({
                    id: item.track.id,
                    name: item.track.name,
                    artists: artist,
                    imageSrc: item.track.album.images[0].url,
                    isrc: item.track.external_ids.isrc
                })
            })
            return {
                songs: songs,
                totalSongs: response.data.total
            }
        } catch (error) {
            return {
                songs: [],
                totalSongs: 0
            }
        }
    }
    async createPlaylist(account: Account, playlistName: string, privacy: privacy): Promise<Playlist> {
        try {

            const payload = {
                name: playlistName,
                description: 'This is migrated playlist from PlaylistMigrate',
                public: privacy == 'private' ? false : true
            }
            let response = await axios.post(`${this.baseUrl}/users/${account.userId}/playlists`,
                payload, this.config(account))
            if (response.status != 201) {
                throw response.data
            }
            return {
                'id': response.data.id,
                'name': response.data.name,
                'imageSrc': null,
                'privacy': response.data.public == 'true' ? 'public' : 'private'
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async insertItemsToPlaylist(account: Account, playlistId: string, song: SongAPIResult[], privacy: privacy = 'private', position: number = 0): Promise<boolean> {
        try {
            const payload = {
                uris: song.map((song) => {
                    return `spotify:track:${song.external_id}`
                })
            }
            let response = await axios.post(`${this.baseUrl}/playlists/${playlistId}/tracks?position=0`,
                payload, {
                headers: {
                    'Authorization': `Bearer ${account.accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            if (response.status != 201) {
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
                'Authorization': `Bearer ${account.accessToken}`,
                'Accept': 'application/json'
            }
        }
    }
}