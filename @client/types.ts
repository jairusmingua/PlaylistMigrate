import { Account } from "@prisma/client";

export interface SongAPIResult{
    title: string,
    source: string,
    artist: string,
    external_id: string,
    thumbnail_src: string,
    url: string
}

export interface Song {
    id: string,
    name: string,
    artists: Artist[],
    imageSrc: string,
    isrc?: string
}
export interface Artist {
    name: string
}

export type privacy = 'private' | 'public'

export interface Playlist {
    id: string,
    name: string,
    imageSrc: string,
    privacy: privacy | any
}
export interface ServiceConfig{
    allowsBulk: boolean
}
export abstract class Service {
    public allowsBulk
    constructor({allowsBulk}: ServiceConfig) { 
        this.allowsBulk = allowsBulk
    }
    abstract getPlaylist(account: Account, playlistId: string | string[]): Promise<Playlist>
    abstract getPlaylistSongs(account: Account, playlistId: string | string[]): Promise<{songs: Song[], totalSongs: number}>
    abstract createPlaylist(account: Account, playlistName: string, privacy: privacy): Promise<Playlist>
    abstract insertItemsToPlaylist(account: Account, playlistId: string, song: SongAPIResult[], privacy: privacy, position: number): Promise<boolean>
    abstract config(account: Account): any
}

export type Source = 'spotify' | 'google'

export const apiMap = {
    'spotify': 'SPOTIFY',
    'google': 'YT'
}