//generates tokens from auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import { TokenType, OAuthType, AuthType } from '../../services/authTypes';
import SpotifyOAuth from '../../services/spotify/auth';
import YoutubeOAuth from '../../services/youtube/auth';
export default async (_: NextApiRequest, res: NextApiResponse) => {
    if (_.query[TokenType.queryString] == TokenType.spotify) {
        const auth_code:string = _.query["code"].toString();
        const spotify_token_encoded = await new SpotifyOAuth().getToken(auth_code);
        res.redirect(`/?token=${spotify_token_encoded}`);
    } else if (_.query[TokenType.queryString] == TokenType.youtube) {
        const auth_code:string = _.query["code"].toString();
        const youtube_token_encoded = await new YoutubeOAuth().getToken(auth_code);
        res.redirect(`/?token=${youtube_token_encoded}`);
    } else {
        res.status(500).send({ request: "Bad Request" })
    }

}