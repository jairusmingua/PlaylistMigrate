//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import {YoutubeOAuth,SpotifyOAuth} from '../../services/PlaylistMigrate';
import {AuthType, TokenType} from '../../services/types'
import {service} from '../../services/PlaylistMigrate';

export default async (_: NextApiRequest, res: NextApiResponse) => {
    if (_.query[AuthType.queryString] == AuthType.spotify) {
        const url = new SpotifyOAuth(service.SpotifyCredentials,process.env.SPOTIFY_TOKEN_URI).generateUrl();
        res.redirect(url);
    } else if (_.query[AuthType.queryString] == AuthType.youtube) {
        const url = new YoutubeOAuth(service.YoutubeCredentials).generateUrl();
        res.redirect(url);
    } else {
        res.status(500).send({ request: "BadRequest" })
    }
}