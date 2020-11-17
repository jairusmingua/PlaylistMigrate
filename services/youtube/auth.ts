import {AuthType,OAuthType, TokenType} from '../authTypes';
import {google,GoogleApis} from 'googleapis'
import {OAuth2Client} from 'google-auth-library';
export default class YoutubeOAuth{
    client_id:string;
    client_secret:string;
    redirect_uri:string;
    ouath2client:OAuth2Client;
    constructor(){
        this.client_id = process.env.YOUTUBE_CLIENT_ID ;
        this.client_secret = process.env.YOUTUBE_CLIENT_SECRET;
        this.redirect_uri = (`${process.env.REDIRECT_URI}?${TokenType.queryString}=${TokenType.youtube}`);
        this.ouath2client = new google.auth.OAuth2(this.client_id,this.client_secret,this.redirect_uri);
    }
    generateUrl(){
        google.youtube
        const scopes:Array<string> =[
            'https://www.googleapis.com/auth/youtube'
        
        ]
        const url= this.ouath2client.generateAuthUrl({
            access_type:'offline',
            scope:scopes
        })
        return url;
    }
    async getToken(auth_code:string){
        const {tokens} = await this.ouath2client.getToken(auth_code);
        const youtube_token_modified:OAuthType = {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_type: tokens.token_type,
            expires_in: tokens.expiry_date,
            scope:tokens.scope,
            auth_type:AuthType.youtube 
        };
        const youtube_token_encoded = encodeURIComponent(JSON.stringify(youtube_token_modified));

        return youtube_token_encoded;
    }
    async refreshToken(refreshToken:string){
        return null;
    }
}