import { Spotify } from "./Spotify";
import { Service } from "./types";
import { Youtube } from "./Youtube";

export const services: { [provider: string]: Service } = {
    'spotify': new Spotify(),
    'google': new Youtube()
}