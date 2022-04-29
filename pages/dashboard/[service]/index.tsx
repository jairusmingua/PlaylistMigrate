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
import { prisma } from '../../../db/prisma'
import { Navbar, Image, Container, Col, Row, Spinner, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap'
import PageNavigation from '../../../components/PageNavigation'
import axios from 'axios'
import PlaylistItem from '../../../components/PlaylistItem'
import { spotifyQueue } from '../../../queue'
import { getUser } from '../../../repositories/UserRepository'
import Linking from '../../../components/setting/Linking'
import { getPrimaryAccount } from '../../../util'
import { getOauthAccount } from '../../../@client'
import { UIImg, UIName } from '../../../@client/types'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const user = await getUser({ req: req })
  if (!user) {
    return {
      redirect: {
        permanent: true,
        destination: '/login'
      }
    }
  }
  if (user.accounts.length < 2) {
    return {
      redirect: {
        permanent: true,
        destination: '/onboard'
      }
    }
  }
  if (user.accounts.filter((account) => account.primary == true).length == 0) {
    return {
      redirect: {
        permanent: true,
        destination: '/primary-select'
      }
    }
  }
  return { props: { user: user } }
};

export default function Dashboard({ user }: { user: User & { accounts: Account[] } }) {
  const router = useRouter()
  const { service } = router.query
  let accounts = user.accounts
  let currentAccount = getOauthAccount(accounts, service.toString())

  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/playlist/${currentAccount.providerId}`).then((res) => {
      setPlaylist(res.data.items)
      setLoading(false)
    }).catch((error) => {
      console.log(error.response)
    })
  }, []);

  return (
    <>
      <Head>
        <title>PlaylistMigrate | Dashboard</title>
      </Head>
      {user ? (

        <div className="container">
          <PageNavigation user={user}></PageNavigation>
          <div className="row px-3 pb-5">
            <div className="d-flex">

              <DropdownButton
                title={
                  <>
                    <img className="p-1" src={UIImg[currentAccount.providerId]} height="30px" width="30px" />
                    <span className="px-2">
                      {

                        UIName[currentAccount.providerId]
                      }
                    </span>

                  </>
                }
                variant="secondary"
                id="input-group-dropdown-1"
                menuAlign="left"
              >
                {
                  accounts.filter((account) => account.primary == true).map((account, i) =>
                    <>
                      <Dropdown.Item key={account.providerId} href={`/dashboard/${account.providerId}`} active={account.providerId == currentAccount.providerId}>{UIName[account.providerId]}</Dropdown.Item>
                    </>)

                }
                {
                  accounts.filter((account) => account.primary != true).map((account, i) =>
                    <>
                      <Dropdown.Item key={account.providerId} href={`/dashboard/${account.providerId}`} active={account.providerId == currentAccount.providerId}>{UIName[account.providerId]}</Dropdown.Item>
                    </>
                  )
                }
              </DropdownButton>


            </div>
          </div>
          {loading ? (
            <>
              <div className="d-flex justify-content-center align-items-center loading">
                <Spinner animation="border" role="status">
                </Spinner>
              </div>
            </>
          ) : (
            <div className="container-fluid m-0 px-0 pt-0 grid" style={{ paddingBottom: "200px" }}>
              {playlist.map((item: Playlist & {Playlist: Playlist, playlistOrigin: Playlist[]}, i) =>
                <PlaylistItem account={currentAccount} key={i} item={item}></PlaylistItem>
              )}
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