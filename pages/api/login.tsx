//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import {YoutubeService,SpotifyService} from '../../services/PlaylistMigrate';
import {AuthType, TokenType} from '../../services/types'

export default async (_: NextApiRequest, res: NextApiResponse) => {
    if (_.query[AuthType.queryString] == AuthType.spotify) {
        const url = SpotifyService.generateUrl();
        res.redirect(url);
    } else if (_.query[AuthType.queryString] == AuthType.youtube) {
        const url = YoutubeService.generateUrl();
        res.redirect(url);
    } else {
        res.status(500).send({ request: "BadRequest" })
    }
}