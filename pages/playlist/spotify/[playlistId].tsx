import { signOut, useSession, getSession } from 'next-auth/client'
import { Container, Card, Row, Col, Button, Modal } from 'react-bootstrap'

import { useEffect, useState } from 'react'
import { Playlist, PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next";
import { prisma } from '../../../db/prisma'
import { User } from '.prisma/client'
import { useRouter } from 'next/router';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import MigrateSequence from '../../../components/MigrateSequence';
import Head from 'next/head';
import { getOauthAccount, getUser } from '../../../repositories/UserRepository';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const user = await getUser(req, res)
  const spotifyCredentials = getOauthAccount(user.accounts, 'Spotify')
  const youtubeCredentials = getOauthAccount(user.accounts, 'Google')
  return { props: { user: user, spotifyCredentials, youtubeCredentials } }

};

export default function PlaylistView({ user, spotifyCredentials, youtubeCredentials }) {
  const router = useRouter()
  const { playlistId } = router.query
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [doneMigrating, setDoneMigrating] = useState(false);

  function handleClose() {
    setShowModal(false)
    setIsMigrating(false)
  }
  function handleOpen() {
    setShowModal(true)
  }
  function handleMigration() {
    setShowModal(false)
    setIsMigrating(true)
  }
  function handleFinishMigration() {
    setLoading(false)
    setDoneMigrating(true)
    setShowModal(true)
    setIsMigrating(false)
  }
  function handleStopMigration() {
    setLoading(false)
    setIsMigrating(false)
  }

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
      <Head>
        <title>PlayistMigrate | {playlist?.name}</title>
      </Head>
      <div className="position-absolute d-flex justify-content-between container-fluid pt-5 px-5" style={{ top: 0, left: 0, right: 0, zIndex: 60 }}>
        <a className="btn-outline-light" href="/dashboard">
          <i className="bi bi-arrow-left"></i>
        </a>
        {/* <button>Profile</button> */}
      </div>
      {loading ? (
        <>
          <div className="d-flex justify-content-center align-items-center loading">
            <Spinner animation="border" role="status">
            </Spinner>
          </div>
        </>
      ) : (
        <>
          {
            !isMigrating ? (
              <div className="container-fluid p-0 m-0" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
                <div className="row position-relative p-0 m-0 w-100" style={{ zIndex: 5 }}>
                  <div className="col-12 col-lg-4 p-0 m-0" style={{ overflow: 'hidden' }}>
                    <div className="p-4">
                      <div className="d-flex flex-column align-items-center w-100 pt-5 position-relative" style={{ zIndex: 50 }}>

                        <img src={playlist.image} style={{ aspectRatio: '1', height: '10vw', minHeight: '90px' }} alt="" />
                        <h1 className="py-4 text-center">{playlist.name}</h1>

                        <Button onClick={handleOpen} className="spotifyMigrateBtn" variant="dark" size="lg">
                          Migrate
                        </Button>
                      </div>
                      <img src={playlist.image} className="position-absolute" style={{ top: 0, left: 0, width: '100%', height: '100%', filter: 'blur(50px)', opacity: '0.5', zIndex: 0 }} alt="" />

                    </div>

                  </div>
                  <div className="col-12 d-lg-block d-none col-lg-8 p-0 m-0">
                    <ul className="px-0 pt-0 m-0" style={{ overflowY: 'scroll', height: '100vh' }}>
                      {
                        songs.map((song, i) => <>{
                          song.track.id != null &&
                          <li key={i} style={{ listStyle: 'none', backgroundColor: 'black' }} className="playlistSongItem mb-3 p-3">
                            <div className="d-flex gap-3">
                              <img className="mx-3" height={50} width={50} src={song.track.album.images[0].url} alt={song.track.name} />
                              <div className="d-flex flex-column">
                                <h4>{song.track.name}</h4>
                                <span>
                                  {
                                    song.track.artists.map((artist, i) => <span key={i}>{artist.name}{song.track.artists.length == i + 1 ? '' : ','}  </span>)
                                  }
                                </span>
                              </div>
                            </div>

                          </li>
                        }</>
                        )
                      }
                    </ul>
                  </div>
                </div>
                <ul className="px-0 pt-0 m-0 position-absolute d-lg-none d-block w-100" style={{ height: '100%', width: '100%', zIndex: 0 }}>
                  {
                    songs.map((song, i) =>
                      <>
                        {
                          song.track.id != null &&
                          <li key={i} style={{ listStyle: 'none', backgroundColor: 'black' }} className="playlistSongItem mb-3 p-3">
                            <div className="d-flex gap-3">
                              <img className="mx-3" height={50} width={50} src={song.track.album.images[0]?.url} alt={song.track?.name} />
                              <div className="d-flex flex-column">
                                <h4>{song.track.name}</h4>
                                <span>
                                  {
                                    song.track.artists.map((artist, i) => <span key={i}>{artist.name}{song.track.artists.length == i + 1 ? '' : ','}  </span>)
                                  }
                                </span>
                              </div>
                            </div>

                          </li>
                        }
                      </>
                    )
                  }
                </ul>
                <Modal show={showModal} onHide={handleClose} centered className="text-dark">
                  {
                    doneMigrating ? <>
                      <Modal.Header closeButton>
                        <Modal.Title>Migration Success</Modal.Title>
                      </Modal.Header>

                      <Modal.Body>
                        <p>Selected playlist has been successfully migrated to another platform!</p>
                      </Modal.Body>

                      <Modal.Footer>
                        <Button className="spotifyMigrateBtn" variant="primary" onClick={handleClose}>Done</Button>
                      </Modal.Footer>
                    </> : <>
                      <Modal.Header closeButton>
                        <Modal.Title>Migrate {playlist.name}</Modal.Title>
                      </Modal.Header>

                      <Modal.Body>
                        <p>Select <b>Platform</b> to Migrate your playlist: </p>
                        <form>
                          <div className="form-check d-flex align-items-center">
                            <input type="checkbox" className="form-check-input" checked />
                            <label className="form-check-label d-flex align-items-center">
                              <img src="/youtube.png" height="30px" width="30px" />
                              <span>Youtube Music</span>

                            </label>
                          </div>
                        </form>
                      </Modal.Body>

                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button className="spotifyMigrateBtn" variant="primary" onClick={handleMigration}>Migrate</Button>
                      </Modal.Footer>
                    </>
                  }
                </Modal>
                <style jsx global>{
                  `
                .spotifyMigrateBtn{
                  background-color: green !important;
                }
                `
                }</style>
              </div>
            ) : (
              <MigrateSequence
                credentials={spotifyCredentials}
                onCancel={handleStopMigration}
                onFinish={handleFinishMigration}
                onStart={() => console.log('starting')}
                source='SPOTIFY'
                destination='YT'
                playlistName='SAMPLE'
                playlistId={playlistId}
                start={isMigrating}

              />
            )
          }
        </>
      )}
    </>
  )
}
PlaylistView.requireAuth = true