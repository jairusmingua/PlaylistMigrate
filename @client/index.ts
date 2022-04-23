import { Spotify } from "./Spotify";
import { Youtube } from "./Youtube"; 
import { Service } from "./types";

export const services: { [provider: string]: Service } = {
    'spotify': new Spotify(),
    'google': new Youtube()
}