import { Queue } from 'bullmq'

// Prevent multiple instances of Queue in development
declare const global: NodeJS.Global & { spotifyQueue?: Queue, youtubeQueue?: Queue };

const spotifyQueue = global.spotifyQueue || new Queue('spotify worker');
if (process.env.NODE_ENV === "development") global.spotifyQueue = spotifyQueue;


const youtubeQueue = global.youtubeQueue || new Queue('youtube worker');
if (process.env.NODE_ENV === "development") global.youtubeQueue = youtubeQueue;

export {spotifyQueue, youtubeQueue};