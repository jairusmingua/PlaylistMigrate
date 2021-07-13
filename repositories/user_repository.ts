import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from "@prisma/client";
import prisma from '../db/prisma'
import { Playlist } from "../services/types";

// export async function getPlaylist(session: Session): Promise<User>{
//     const user: User = await prisma.user.findUnique({
//         where: {
//             email: session.user.email,
//         },
//         select:{
            
//         }
//     })
//     return user
// }

// export async function getPlaylist(user: User) : Promise<Playlist>{
//     const playlist: Playlist = await prisma.playlist.
//     return 
// }

