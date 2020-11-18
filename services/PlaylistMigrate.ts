import {Credentials, TokenType}from './types';
import {Youtube} from './Youtube';
import {Spotify} from './Spotify';
export const YoutubeService = new Youtube(
    {
        client_id:  process.env.YOUTUBE_CLIENT_ID,
        client_secret:process.env.YOUTUBE_CLIENT_SECRET,
        redirect_uri: (`${process.env.REDIRECT_URI}?${TokenType.queryString}=${TokenType.youtube}`),
    },
    ""
)
export const SpotifyService = new Spotify(
    {
        client_id:  process.env.SPOTIFY_CLIENT_ID,
        client_secret:process.env.SPOTIFY_CLIENT_SECRET,
        redirect_uri: (`${process.env.REDIRECT_URI}?${TokenType.queryString}=${TokenType.spotify}`),
    },
    process.env.SPOTIFY_TOKEN_URI
)
