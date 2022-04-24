import axios from "axios";

import { Spotify } from "./Spotify";
import { Youtube } from "./Youtube";
import { apiMap, Service, Song, SongAPIResult, Source } from "./types";
import { Account } from "@prisma/client";



export const services: { [provider: string]: Service } = {
    'spotify': new Spotify(),
    'google': new Youtube()
}

export class PMAPI {
    constructor() { }
    async searchSong(song: Song, source: string | Source): Promise<SongAPIResult[]> {
        var p = {}
        if (source == 'spotify')
            p = {
                'isrc': song.isrc
            }
        if (source == 'google') {
            p = {
                'external_id': song.id
            }
        }
        p = {...p, 'source': apiMap[source]}
        let params = new URLSearchParams({...p})
        let { data } = await axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API_URL}/api/v1/search?${params}`)
        let result: SongAPIResult[] = await data.result
        console.log(result)
        return result
    }
}

export function getOauthAccount(accounts : Account[], providerId: Source | string): Account{
    const account = accounts.filter((account)=> account.providerId == providerId.toLowerCase())
    if(account.length == 0){
        return null
    }
    return account[0]
}