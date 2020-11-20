import { Credentials, Profile } from "./types";
export default abstract class Service{
    credentials: Credentials;
    token_uri:string;
    abstract getToken(auth_code:string);
    abstract generateUrl();
    abstract refreshToken(refreshToken:string);
    abstract getPlaylists(token:string);
    abstract getUserProfile(token:string):Promise<Profile>;
    constructor(credentials:Credentials,token_uri:string) 
    {
        this.credentials = {
            client_id:credentials.client_id,
            client_secret: credentials.client_secret,
            redirect_uri: credentials.redirect_uri,
        }
        this.token_uri = token_uri;
    }
}