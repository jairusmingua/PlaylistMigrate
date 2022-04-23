import axios from "axios";

import { Spotify } from "./Spotify";
import { Youtube } from "./Youtube"; 
import { apiMap, Service, Song, SongAPIResult, Source } from "./types";


export const services: { [provider: string]: Service } = {
    'spotify': new Spotify(),
    'google': new Youtube()
}

export class PMAPI{
    constructor(){}
    async searchSong(song: Song, source: string | Source): Promise<SongAPIResult>{
        let { data } = await axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API_URL}/api/v1/search?artist=${song.artists[0].name}&title=${song.name}&source=${apiMap[source]}&isrc=${song.isrc}`)
        let result: SongAPIResult = await data.result
        return result
    }
}