import {Credentials,AuthType,OAuthType, TokenType,SpotifyProfile, SpotifyPlaylist} from './types';
import Service from './Service';
export class Spotify extends Service {
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
    async getPlaylists(token:string):Promise<Array<SpotifyPlaylist>>{
        try {
            const url = "https://api.spotify.com/v1/me/playlists";
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                }
            });
            const data = await response.json();
            const playlists = Array.from(data.items).map((playlist)=>{
                return new SpotifyPlaylist(playlist);
            });
            return playlists;
            
        } catch (error) {
            throw error;
        }
    }
    async getUserProfile(token:string):Promise<SpotifyProfile>{
        try {
            const url = 'https://api.spotify.com/v1/me';
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                }
            });
            const data = await response.json()
            const profile = new SpotifyProfile(data);
            return profile;
            
        } catch (error) {
            throw error
        }
      
    }
}
