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
import { Navbar, Image, Container, Col, Row, Spinner, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap'
import PageNavigation from '../../components/PageNavigation'
import axios from 'axios'
import PlaylistItem from '../../components/PlaylistItem'
import { spotifyQueue } from '../../queue'
import { getUser } from '../../repositories/UserRepository'
import Linking from '../../components/setting/Linking'
import { getPrimaryAccount } from '../../util'

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
  return { props: { user } }
};

export default function Dashboard({ user }: { user: User & { accounts: Account[] } }) {

  let primaryAccount = getPrimaryAccount(user.accounts)
  let accounts = user.accounts

  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentAccount, setCurrentAccount] = useState<Account>(primaryAccount);

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/playlist/${currentAccount.providerId}`).then((res) => {
      setPlaylist(res.data.items)
      setLoading(false)
    }).catch((error) => {
      console.log(error.response)
    })
  }, []);

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/playlist/${currentAccount.providerId}`).then((res) => {
      setPlaylist(res.data.items)
      setLoading(false)
    }).catch((error) => {
      console.log(error.response)
    })
  }, [currentAccount]);

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
                    <img className="p-1" src={`/${currentAccount.providerId == 'spotify' ? 'spotify' : 'youtube'}.png`} height="30px" width="30px" />
                    {

                      currentAccount.providerId == 'google' ? 'Youtube Music' : 'Spotify'
                    }

                  </>
                }
                variant="secondary"
                id="input-group-dropdown-1"
                menuAlign="left"
              >
                {
                  accounts.filter((account) => account.primary == true).map((account, i) =>
                    <>
                      <Dropdown.Item key={account.providerId} onClick={() => setCurrentAccount(account)} active={account.providerId == currentAccount.providerId}>{account.providerId == 'google' ? 'Youtube Music' : 'Spotify'}</Dropdown.Item>
                    </>)

                }
                {
                  accounts.filter((account) => account.primary != true).map((account, i) =>
                    <>
                      <Dropdown.Item key={account.providerId} onClick={() => setCurrentAccount(account)} active={account.providerId == currentAccount.providerId}>{account.providerId == 'google' ? 'Youtube Music' : 'Spotify'}</Dropdown.Item>
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
              {playlist.map((item: Playlist, i) =>
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