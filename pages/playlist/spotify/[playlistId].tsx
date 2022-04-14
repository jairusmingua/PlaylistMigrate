import { signOut, useSession, getSession } from 'next-auth/client'
import { Container, Card, Row, Col, Button } from 'react-bootstrap'

import { useEffect, useState } from 'react'
import { Playlist, PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next";
import prisma from '../../../db/prisma'
import { User } from '.prisma/client'
import { useRouter } from 'next/router';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 302
    res.setHeader('Location', `/login`)
    return { props: {} }
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      accounts: true,
    }
  })
  const spotifyCredentials = user.accounts.filter(accounts => accounts.providerId == "spotify")[0]
  return { props: { user: user, spotifyCredentials: spotifyCredentials } }

};

export default function PlaylistView({ user, session, spotifyCredentials }) {
  const router = useRouter()
  const { playlistId } = router.query
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (playlistId != undefined) {
      const songs = async () => {
        let { data } = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            'Authorization': `Bearer ${spotifyCredentials.accessToken}`,
            'Accept': 'application/json'
          }
        })
        setSongs(data.items)

      }
      const playlist = async () => {
        let { data } = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: {
            'Authorization': `Bearer ${spotifyCredentials.accessToken}`,
            'Accept': 'application/json'
          }
        })
        setPlaylist({
          name: data.name,
          image: data.images[0].url
        })

      }
      songs().then(() => {
        playlist().then(() => {
          setLoading(false)

        }).catch((err) => console.log(err))

      }).catch((err) => console.log(err))
    }
  }, [playlistId]);
  return (
    <>
      {loading ? (
        <>
          <div className="d-flex justify-content-center align-items-center loading">
            <Spinner animation="border" role="status">
            </Spinner>
          </div>
        </>
      ) : (
        <div className="container-fluid p-0 m-0" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
          <div className="row position-relative p-0 m-0 w-100" style={{zIndex:5}}>
            <div className="col-12 col-lg-4 p-0 m-0" style={{ overflow: 'hidden' }}>
              <div className="p-4">
                <div className="d-flex flex-column align-items-center w-100 pt-5 position-relative" style={{ zIndex: 50 }}>

                  <img src={playlist.image} style={{ aspectRatio: '1', height: '10vw', minHeight: '90px' }} alt="" />
                  <h1 className="py-4 text-center">{playlist.name}</h1>

                  <Button className="spotifyMigrateBtn" variant="dark" size="lg">
                    Migrate
                  </Button>
                </div>
                <img src={playlist.image} className="position-absolute" style={{ top: 0, left: 0, width: '100%', height: '100%', filter: 'blur(50px)', opacity: '0.5', zIndex: 0 }} alt="" />

              </div>

            </div>
            <div className="col-12 d-lg-block d-none col-lg-8 p-0 m-0">
              <ul className="px-0 pt-0 m-0" style={{ overflowY: 'scroll', height: '100vh' }}>
                {
                  songs.map((song, i) =>
                    <li key={i} style={{ listStyle: 'none', backgroundColor: 'black' }} className="my-3 p-3">
                      <div className="d-flex gap-3">
                        <img className="mx-3" height={50} width={50} src={song.track.album.images[0].url} alt={song.track.name} />
                        <div className="d-flex flex-column">
                          <h4>{song.track.name}</h4>
                          <span>
                            {
                              song.track.artists.map((artist, i) => <>{artist.name}{song.track.artists.length == i + 1 ? '' : ','}  </>)
                            }
                          </span>
                        </div>
                      </div>

                    </li>
                  )
                }
              </ul>
            </div>
          </div>
          <ul className="px-0 pt-0 m-0 position-absolute d-lg-none d-block w-100" style={{ height: '100%', width:'100%', zIndex: 0}}>
            {
              songs.map((song, i) =>
                <li key={i} style={{ listStyle: 'none', backgroundColor: 'black' }} className="mb-3 p-3">
                  <div className="d-flex gap-3">
                    <img className="mx-3" height={50} width={50} src={song.track.album.images[0].url} alt={song.track.name} />
                    <div className="d-flex flex-column">
                      <h4>{song.track.name}</h4>
                      <span>
                        {
                          song.track.artists.map((artist, i) => <>{artist.name}{song.track.artists.length == i + 1 ? '' : ','}  </>)
                        }
                      </span>
                    </div>
                  </div>

                </li>
              )
            }
          </ul>
          <style jsx global>{
            `
                .spotifyMigrateBtn{
                  background-color: green !important;
                }
                `
          }</style>
        </div>
      )}
    </>
  )
}
PlaylistView.requireAuth = true