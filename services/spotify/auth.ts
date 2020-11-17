import {AuthType,OAuthType, TokenType} from '../authTypes';
export default class SpotifyOAuth{
    client_id:string;
    client_secret:string;
    redirect_uri:string;
    constructor(){
        this.client_id = process.env.SPOTIFY_CLIENT_ID ;
        this.client_secret = process.env.SPOTIFY_CLIENT_SECRET;
        this.redirect_uri = (`${process.env.REDIRECT_URI}?${TokenType.queryString}=${TokenType.spotify}`);
    }
    async getToken(auth_code:string){
        const url = process.env.SPOTIFY_TOKEN_URI +
            `?grant_type=authorization_code&code=${auth_code}&redirect_uri=${this.redirect_uri}`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": `Basic ${Buffer.from(this.client_id + ":"
                    + this.client_secret).toString('base64')}`,
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        let spotify_token = await response.json();
        let spotify_token_modified: OAuthType = { 
            access_token: spotify_token["access_token"],
            refresh_token:spotify_token["refresh_token"], 
            token_type: spotify_token["token_type"], 
            expires_in: spotify_token["expires_in"],
            scope:spotify_token["scope"],
            auth_type:AuthType.spotify 
        };
        const spotify_token_encoded = encodeURIComponent(JSON.stringify(spotify_token_modified));
        return spotify_token_encoded;
    }
    generateUrl(){
        const scopes = 'user-read-private user-read-email'
        const url ='https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI + `?${TokenType.queryString}=${TokenType.spotify}`);
        return url
    }
    async refreshToken(refreshToken:string){
        const url = process.env.SPOTIFY_TOKEN_URI +
            `?grant_type=refresh_token&refresh_token=${refreshToken}`
        console.log(url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": `Basic ${Buffer.from(this.client_id + ":"
                    + this.client_secret).toString('base64')}`,
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        let spotify_token = await response.json();
        let spotify_token_modified: OAuthType = { 
            access_token: spotify_token["access_token"],
            token_type: spotify_token["token_type"], 
            expires_in: spotify_token["expires_in"],
            scope:spotify_token["scope"],
            auth_type:AuthType.spotify 
        };
        const spotify_token_encoded = encodeURIComponent(JSON.stringify(spotify_token_modified));
        return spotify_token_encoded;
    }
}