
import { google, GoogleApis } from 'googleapis'
import { OAuth2Client } from 'google-auth-library';
import {Credentials,AuthType,OAuthType} from '../types';
export class YoutubeOAuth {
    private credentials: Credentials;
    private ouath2client:OAuth2Client;
    constructor(credentials:Credentials) 
    {
        this.credentials = {
            client_id:credentials.client_id,
            client_secret: credentials.client_secret,
            redirect_uri: credentials.redirect_uri,
        }
        this.ouath2client = new google.auth.OAuth2(
            credentials.client_id,
            credentials.client_secret,
            credentials.redirect_uri
        )
    }
    generateUrl() {
        google.youtube
        const scopes: Array<string> = [
            'https://www.googleapis.com/auth/youtube'

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
}
