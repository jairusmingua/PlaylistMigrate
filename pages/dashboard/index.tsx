import { signOut, useSession, getSession } from 'next-auth/client'
import { NextApiRequest, NextApiResponse } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AppProps } from 'next/app';
import { Playlist, PrismaClient, User, Account } from "@prisma/client"
import { GetServerSideProps } from "next";
import { IncomingMessage, ServerResponse } from 'http'
import { prisma } from '../../db/prisma'
import { Navbar, Image, Container, Col, Row, Spinner } from 'react-bootstrap'
import PageNavigation from '../../components/PageNavigation'
import axios from 'axios'
import { SpotifyPlaylist } from '../../services/types'
import PlaylistItem from '../../components/PlaylistItem'
import { spotifyQueue } from '../../queue'
import { getUser } from '../../repositories/UserRepository'
import Linking from '../../components/setting/Linking'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const user = await getUser(req, res)
  if (user.accounts.length < 2) {
    return {
      redirect: {
        permanent: true,
        destination: '/onboard'
      }
    }
  }
  if (user.accounts.filter((account)=>account.primary == true).length == 0) {
    return {
      redirect: {
        permanent: true,
        destination: '/primary-select'
      }
    }
  }
  return { props: { user: await getUser(req, res) } }
};

export default function Dashboard({ user }: { user: User & { accounts: Account[] } }) {
  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/profile').then((res) => {
      setPlaylist(res.data['playlists'])
      setLoading(false)
    })
  }, []);
  return (
    <>
      <Head>
        <title>PlayistMigrate | Dashboard</title>
      </Head>
      {user ? (

        <div className="container">
          <PageNavigation user={user}></PageNavigation>
          {loading ? (
            <>
              <div className="d-flex justify-content-center align-items-center loading">
                <Spinner animation="border" role="status">
                </Spinner>
              </div>
            </>
          ) : (
            <div className="container-fluid m-0 px-0 pt-0 grid" style={{ paddingBottom: "200px" }}>
              {playlist.map((item: Playlist) => {
                return (

                  <PlaylistItem item={item}></PlaylistItem>

                )
              })}
            </div>
          )}

        </div>


      ) : (<></>)}
      <style jsx>
        {
          `.grid{
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(157px, 1fr));
        }`
        }
      </style>
    </>
  )
}
Dashboard.requireAuth = true