
import { google, GoogleApis } from 'googleapis'
import { OAuth2Client } from 'google-auth-library';
import {Credentials,AuthType,OAuthType, YoutubeProfile, YoutubePlaylist} from './types';
import Service from './Service';
export class Youtube extends Service{
    private ouath2client:OAuth2Client;
    constructor(credentials:Credentials,token_uri:string) 
    {
        super(credentials,token_uri);
        this.ouath2client = new google.auth.OAuth2(
            credentials.client_id,
            credentials.client_secret,
            credentials.redirect_uri
        )
    }
    generateUrl() {
        google.youtube
        const scopes: Array<string> = [
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.readonly'

        ]
        const url = this.ouath2client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        })
        return url;
    }
    async getToken(auth_code: string) {
        const { tokens } = await this.ouath2client.getToken(auth_code);
        const youtube_token_modified: OAuthType = {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_type: tokens.token_type,
            expires_in: tokens.expiry_date,
            scope: tokens.scope,
            auth_type: AuthType.youtube
        };
        const youtube_token_encoded = encodeURIComponent(JSON.stringify(youtube_token_modified));

        return youtube_token_encoded;
    }
    async refreshToken(refreshToken: string) {

        return null;
    }
    async getPlaylists(token:string){
        try {
            const youtube = google.youtube('v3');
            const result = await youtube.playlists.list(
                {
                    oauth_token:token,
                    part:[
                        "snippet,contentDetails"
                    ],
                    mine:true,
                    maxResults:50 //temporary
                }
            )
            const playlists = Array.from(result.data.items).map((playlist)=>{
                return new YoutubePlaylist(playlist);
            });
            return playlists;
        } catch (error) {
            throw error;
        }
    }
    async getUserProfile(token:string){
        try {
            const youtube = google.youtube('v3');
            
            const result = await youtube.channels.list(
                {
                    oauth_token:token,
                    part:[
                        "snippet,contentDetails,statistics"
                    ],
                    mine:true
                }
            )
            const profile = new YoutubeProfile(result.data);
            return profile;
            
        } catch (error) {
            throw error;
        }
    }
}
