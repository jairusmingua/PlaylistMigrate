import { Spotify } from "./Spotify";
import { Service } from "./types";

export const services: { [provider: string]: Service } = {
    'spotify': new Spotify()
}