//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import {YoutubeService} from '../../../services/PlaylistMigrate';
import {AuthType, Profile, TokenType} from '../../../services/types';

export default async (_: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = _.headers.authorization;
      console.log(token);
      const profile = await YoutubeService.getUserProfile(token.replace("Bearer ",""));
      res.send(profile);
    } catch (error) {
        console.log(error)
        res.status(500).send({request:"Bad Request"})
    }
}