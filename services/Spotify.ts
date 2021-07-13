import {Credentials,AuthType,OAuthType, SpotifyPlaylist} from './types';
import Service from './Service';
import { Account, Playlist, User } from '@prisma/client';
import {secondDifference} from '../util'
import prisma from '../db/prisma';
import cuid from 'cuid'
export class Spotify {

    async refreshToken(account: Account): Promise<Account> {
        try {
            console.log('refresshing tokens')
            const url = `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${account.refreshToken}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            let spotify_token = await response.json();
            let spotify_token_modified: OAuthType = {
                access_token: spotify_token["access_token"],
                token_type: spotify_token["token_type"],
                expires_in: spotify_token["expires_in"],
                scope: spotify_token["scope"],
                auth_type: AuthType.spotify
            };
            return await prisma.account.update({
                where:{
                    id:account.id
                },
                data:{
                    accessToken:spotify_token_modified.access_token.toString()
                }
            });
        } catch (error) {
            throw error
        }
       
    }
    async getPlaylists(account: Account):Promise<Array<Playlist>>{
        try {
            console.log(secondDifference(account.updatedAt))
            if (secondDifference(account.updatedAt)>3600){
                account = await this.refreshToken(account)   
            }
            const url = "https://api.spotify.com/v1/me/playlists";
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${account.accessToken}`,
                    "Accept": "application/json",
                }
            });
            if (response.status == 401){
                throw response.json()
            }
            const data = await response.json();
            const playlist : Array<Playlist> = []
            Array.from(data.items).map((item)=>{
                let i = new SpotifyPlaylist(item)
                console.log(i)
                playlist.push({
                    title:i.name,
                    image:i.image['url'],
                    userId:account.userId,
                    id:cuid(),
                    description:i.description,
                    platform:"SPOTIFY",
                    url:"",
                    external_id:i.id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                    
                })
            })
            return playlist
            
        } catch (error) {
            throw error;
        }
    }
    // async getUserProfile(token:string):Promise<SpotifyProfile>{
    //     try {
    //         const url = 'https://api.spotify.com/v1/me';
    //         const response = await fetch(url, {
    //             method: 'GET',
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Accept": "application/json",
    //             }
    //         });
    //         const data = await response.json()
    //         const profile = new SpotifyProfile(data);
    //         return profile;
            
    //     } catch (error) {
    //         throw error
    //     }
      
    // }
}

declare const global: NodeJS.Global & { spotify: Spotify };

const spotify = global.spotify || new Spotify();
if (process.env.NODE_ENV === "development") global.spotify = spotify;

export default spotify;