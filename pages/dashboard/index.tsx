import { signOut, useSession, getSession } from 'next-auth/client'
import { NextApiRequest, NextApiResponse } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AppProps } from 'next/app';
import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next";
import { IncomingMessage, ServerResponse } from 'http'
import prisma from '../../db/prisma'

type User = {
  id: string;
  name: string;
  image: string;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  
  const session = await getSession({ req });
  if (!session) {
    res.writeHead(302,{
      Location: "/dashboard",
    });
  }
  const user = await prisma.user.findUnique({
    where:{
      email: session.user.email,
    }
  })
  return {props:{user:user}}
   
};

export default function Dashboard({props}) {
  const user : User = props.user
  return (
    <>
          <div>
            Hello {user.name}
          </div>
          <img src={user.image}/>
          <button onClick={()=>signOut({callbackUrl:"/login"})}>SignOut</button>
    </>
  )
}
Dashboard.requireAuth = true