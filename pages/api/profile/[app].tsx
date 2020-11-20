//redirects user to respective auth sites
import { NextApiRequest, NextApiResponse } from 'next'
import {SpotifyService,YoutubeService} from '../../../services/PlaylistMigrate';
import {AuthType, Profile, TokenType} from '../../../services/types';

export default async (_: NextApiRequest, res: NextApiResponse) => {
    const{
        query:{app}
    }= _;
    try {
      if(app){
          const token = _.headers.authorization.replace("Bearer ","");
          console.log(token);
          const profile = app=="spotify"?await SpotifyService.getUserProfile(token):await YoutubeService.getUserProfile(token);
          res.send(profile);
      }else{
          throw "Bad Request";
      }
    } catch (error) {
        console.log(error)
        res.status(500).send({request:"Bad Request"})
    }
}