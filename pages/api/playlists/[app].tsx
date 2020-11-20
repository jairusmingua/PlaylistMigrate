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
          const playlist = app=="spotify"?await SpotifyService.getPlaylists(token):await YoutubeService.getPlaylists(token);
          res.send(playlist);
      }else{
          throw "Bad Request";
      }
    } catch (error) {
        console.log(error)
        res.status(500).send({request:"Bad Request"})
    }
}