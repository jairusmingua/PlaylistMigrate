import {Credentials, TokenType}from './types';
import {Youtube} from './Youtube';
import {Spotify} from './Spotify';
import os from 'os';
const development = 'http://localhost:3000/api/tokenize';
const production = `https://playlist-migrate.vercel.app/api/tokenize`
console.log(process.env.NODE_ENV)
export const YoutubeService = new Youtube(
    {
        client_id:  process.env.YOUTUBE_CLIENT_ID,
        client_secret:process.env.YOUTUBE_CLIENT_SECRET,
        redirect_uri: (`${process.env.NODE_ENV=="production" ? production : development}?${TokenType.queryString}=${TokenType.youtube}`),
    },
    ""
)
export const SpotifyService = new Spotify(
    {
        client_id:  process.env.SPOTIFY_CLIENT_ID,
        client_secret:process.env.SPOTIFY_CLIENT_SECRET,
        redirect_uri: (`${process.env.NODE_ENV=="production" ? production : development}?${TokenType.queryString}=${TokenType.spotify}`),
    },
    process.env.SPOTIFY_TOKEN_URI
)
