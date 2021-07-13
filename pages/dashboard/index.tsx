import { signOut, useSession, getSession } from 'next-auth/client'
import { NextApiRequest, NextApiResponse } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AppProps } from 'next/app';
import { Playlist, PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next";
import { IncomingMessage, ServerResponse } from 'http'
import prisma from '../../db/prisma'
import { User } from '.prisma/client'
import { Navbar, Image, Container, Col, Row, Spinner } from 'react-bootstrap'
import PageNavigation from '../../components/PageNavigation'
import axios from 'axios'
import { SpotifyPlaylist } from '../../services/types'
import PlaylistItem from '../../components/PlaylistItem'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 302
    res.setHeader('Location', `/login`)
    return { props: {} }
  }
  const user: User = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    }
  })

  return { props: { user: user } }

};

export default function Dashboard({ user }: { user: User }) {
  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    axios.get('api/profile').then((res) => {
      setPlaylist(res.data['playlists'])
      setLoading(false)
    })
  }, []);
  return (
    <>
      {user ? (
        <>
          <PageNavigation user={user}></PageNavigation>
          {loading ? (
            <>
              <div className="d-flex justify-content-center loading">
                <Spinner animation="border" role="status">
                </Spinner>
              </div>
            </>
          ) : (
            <div className="container d-flex flex-wrap">
              {playlist.map((item:Playlist)=>{
                return(
                  <PlaylistItem item={item}></PlaylistItem>
                )
              })}
            </div>
        )}

        </>

      ) : (<></>)}
    </>
  )
}
Dashboard.requireAuth = true