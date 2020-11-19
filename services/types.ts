export class Profile{
    name:string;
    profilePic_url:Object;
}
export class SpotifyProfile extends Profile{
    constructor(profile:any){
        super();
        this.name = profile['display_name'];
        this.profilePic_url = profile['images'][0].url;
    }
}
export class YoutubeProfile extends Profile{
    constructor(profile:any){
        super();
        this.name = profile.items[0].snippet.title;
        this.profilePic_url = profile.items[0].snippet.thumbnails.default.url
    }
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
