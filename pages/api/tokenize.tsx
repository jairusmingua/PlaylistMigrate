//generates tokens from auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import { TokenType, OAuthType, AuthType } from '../../services/types';
import {YoutubeService,SpotifyService} from '../../services/PlaylistMigrate';
export default async (_: NextApiRequest, res: NextApiResponse) => {
    if (_.query[TokenType.queryString] == TokenType.spotify) {
        const auth_code:string = _.query["code"].toString();
        const spotify_token_encoded = await SpotifyService.getToken(auth_code);
        res.redirect(`/?token=${spotify_token_encoded}`);
    } else if (_.query[TokenType.queryString] == TokenType.youtube) {
        const auth_code:string = _.query["code"].toString();
        const youtube_token_encoded = await YoutubeService.getToken(auth_code);
        res.redirect(`/?token=${youtube_token_encoded}`);
    } else {
        res.status(500).send({ request: "Bad Request" })
    }

}