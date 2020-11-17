//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthType, TokenType } from '../../services/authTypes';
import SpotifyOAuth from '../../services/spotify/auth';
import YoutubeOAuth from '../../services/youtube/auth';
export default async (_: NextApiRequest, res: NextApiResponse) => {
    if (_.query[AuthType.queryString] == AuthType.spotify) {
        const url = new SpotifyOAuth().generateUrl();
        res.redirect(url);
    } else if (_.query[AuthType.queryString] == AuthType.youtube) {
        const url = new YoutubeOAuth().generateUrl();
        res.redirect(url);
    } else {
        res.status(500).send({ request: "BadRequest" })
    }

}