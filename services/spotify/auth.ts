import {Credentials,AuthType,OAuthType, TokenType} from '../types';
export class SpotifyOAuth {
    private credentials: Credentials;
    private token_uri:string;
    constructor(credentials:Credentials,token_uri:string) 
    {
        this.credentials = {
            client_id:credentials.client_id,
            client_secret: credentials.client_secret,
            redirect_uri: credentials.redirect_uri,
        }
        this.token_uri = token_uri;
    }
    async getToken(auth_code: string) {
        const url = this.token_uri +
            `?grant_type=authorization_code&code=${auth_code}&redirect_uri=${encodeURIComponent(this.credentials.redirect_uri)}`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": `Basic ${Buffer.from(this.credentials.client_id + ":"
                    + this.credentials.client_secret).toString('base64')}`,
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        let spotify_token = await response.json();
        let spotify_token_modified: OAuthType = {
            access_token: spotify_token["access_token"],
            refresh_token: spotify_token["refresh_token"],
            token_type: spotify_token["token_type"],
            expires_in: spotify_token["expires_in"],
            scope: spotify_token["scope"],
            auth_type: AuthType.spotify
        };
        const spotify_token_encoded = encodeURIComponent(JSON.stringify(spotify_token_modified));
        return spotify_token_encoded;
    }
    generateUrl() {
        const scopes = 'user-read-private user-read-email'
        const url = 'https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + this.credentials.client_id +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            `&redirect_uri=${encodeURIComponent(this.credentials.redirect_uri)}`;
        return url
    }
    async refreshToken(refreshToken: string) {
        const url = this.token_uri +
            `?grant_type=refresh_token&refresh_token=${refreshToken}`
        console.log(url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": `Basic ${Buffer.from(this.credentials.client_id + ":"
                    + this.credentials.client_secret).toString('base64')}`,
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
        const spotify_token_encoded = encodeURIComponent(JSON.stringify(spotify_token_modified));
        return spotify_token_encoded;
    }
}
