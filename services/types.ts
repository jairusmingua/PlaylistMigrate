import { Account, Playlist as P } from "@prisma/client";

export class Profile {
    name: string;
    profilePic_url: Object;
}
export class Playlist {
    name: string;
    id: string;
    image: string;
    description: string
}

export enum AuthType {
    spotify = "spotify",
    youtube = "youtube",
    queryString = "authType"
}
export enum TokenType {
    spotify = "spotify",
    youtube = "youtube",
    queryString = "tokenType"
}

export type ServiceType = 'SPOTIFY' | 'YT'
export interface OAuthType {
    access_token?: String;
    refresh_token?: String;
    token_type?: String;
    scope?: String;
    expires_in?: Number;
    auth_type: AuthType;
}
export interface Credentials {
    client_id: string,
    client_secret: string,
    redirect_uri: string,
}
export class Song {
    title: String;
    image: String;
}

export type CallBackStatus = 'ERROR' | 'SUCCESS'

export abstract class Service {
    constructor() { }
    abstract refreshToken(account: Account): Promise<Account>
    abstract getPlaylists(account: Account, dbplaylist: P[], playlist?: P[], next?: string | null)
    abstract getPlaylist(account: Account, playlistId: string | string[]): Promise<P>
}

export const providerPlatformMap = {
    'spotify': 'SPOTIFY',
    'google': 'YOUTUBE'
}