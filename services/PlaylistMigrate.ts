import {Credentials, TokenType}from './types';
export {YoutubeOAuth} from './youtube/auth';
export {SpotifyOAuth} from './spotify/auth';
class PlaylistMigrate{
    private spotify:Credentials;
    private youtube:Credentials;
    constructor(spotify:Credentials,youtube:Credentials){
        this.spotify = spotify,
        this.youtube = youtube
    }
    get YoutubeCredentials(){
        return this.youtube;
    }
    get SpotifyCredentials(){
        return this.spotify;
    }
}
export const service = new PlaylistMigrate(
    {
      client_id:  process.env.SPOTIFY_CLIENT_ID,
      client_secret:process.env.SPOTIFY_CLIENT_SECRET,
      redirect_uri: (`${process.env.REDIRECT_URI}?${TokenType.queryString}=${TokenType.spotify}`),
    },
    {
        client_id:  process.env.YOUTUBE_CLIENT_ID,
        client_secret:process.env.YOUTUBE_CLIENT_SECRET,
        redirect_uri: (`${process.env.REDIRECT_URI}?${TokenType.queryString}=${TokenType.youtube}`),
    }
)