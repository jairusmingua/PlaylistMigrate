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
export class Playlist{
    name:string;
    id:string;
    image:string;
    description:string
}
export class SpotifyPlaylist extends Playlist{
    constructor(playlist:any){
        super();
        console.log(playlist)
        this.name = playlist.name;
        this.id = playlist.id;
        this.image = playlist.images[0];
        this.description = playlist.description
    }
}
export class YoutubePlaylist extends Playlist{
    constructor(playlist:any){
        super();
        this.name = playlist.snippet.title;
        this.id = playlist.id;
        this.image = playlist.snippet.thumbnails.medium.url;
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
