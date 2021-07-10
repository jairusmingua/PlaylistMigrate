import { signOut, useSession, getSession } from 'next-auth/client'
import { NextApiRequest, NextApiResponse } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AppProps } from 'next/app';
import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next";
import { IncomingMessage, ServerResponse } from 'http'
import prisma from '../db/prisma'

function Home({ props }) {
  return (


    <div>
      <Link href="/dashboard">Dashboard</Link>
    </div>
  

      )
   
}

export default Home