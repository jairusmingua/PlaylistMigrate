import { useEffect, useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'

import { GetServerSideProps } from "next";
import Head from 'next/head';
import { useRouter } from 'next/router';

import MigrateSequence from '../../../components/MigrateSequence';

import { getOauthAccount, getUser } from '../../../repositories/UserRepository';
import { Account, User, Playlist } from '@prisma/client';
import { prisma } from '../../../db/prisma'
import { platformProviderMap, Playlist as P, Song, UIImg, UIName } from '../../../@client/types';
import { services } from '../../../@client';
import { services as backendservice } from '../../../services'

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const { service, playlistId } = query
  const user = await getUser({ req: req })
  if (!user) {
    return {
      redirect: {
        permanent: true,
        destination: '/login'
      }
    }
  }
  const credential = getOauthAccount(user.accounts, service.toString())
  if (!credential) {
    return {
      redirect: {
        permanent: true,
        destination: '/dashboard'
      }
    }
  }
  let sourcePlaylist = await prisma.playlist.findFirst({
    where: {
      external_id: playlistId.toString()
    },
    include: {
      Playlist: true,
      playlistOrigin: true
    }
  })
  if (!sourcePlaylist) {
    return {
      redirect: {
        permanent: true,
        destination: '/dashboard'
      }
    }
  }
  const playlistApi = await backendservice[credential.providerId].getPlaylist(credential, playlistId)
  console.log(playlistApi)
  if (!playlistApi) {
    return {
      redirect: {
        permanent: true,
        destination: '/dashboard'
      }
    }
  }
  if (sourcePlaylist.image != playlistApi.image) {
    const date = sourcePlaylist.updatedAt
    sourcePlaylist = await prisma.playlist.update({
      where:{
        external_id: sourcePlaylist.external_id
      },
      data:{
        image: playlistApi.image,
        updatedAt: date
      },
      include:{
        Playlist: true,
        playlistOrigin: true
      },
    })
  }
  return {
    props: {
      user: user,
      accounts: user.accounts,
      currentCredentials: credential,
      sourcePlaylist: sourcePlaylist
    }
  }

};

interface PlaylistViewProps {
  user: User,
  accounts: Account[],
  currentCredentials: Account,
  sourcePlaylist: Playlist & { Playlist: Playlist, playlistOrigin: Playlist[] }
}


export default function PlaylistView({ user, accounts, currentCredentials, sourcePlaylist }: PlaylistViewProps) {
  const router = useRouter()
  const { playlistId } = router.query
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false);
  const [doneMigrating, setDoneMigrating] = useState(false);
  const [destinationCredentials, setDestinationCredentials] = useState(null);
  const [option, setOption] = useState(null);

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
    if (option != null) {
      setDestinationCredentials(accounts.filter((account) => account.providerId == option)[0])
    }
  }, [option]);
  useEffect(() => {
    if (playlistId != undefined) {
      services[currentCredentials.providerId].getPlaylistSongs(currentCredentials, playlistId)
        .then(({ songs, totalSongs }) => {
          setSongs(songs)
          setLoading(false)
        }).catch((err) => {
          console.log(err)
        })
    }
  }, [playlistId]);
  return (
    <>
      <Head>
        <title>PlaylistMigrate {sourcePlaylist?.title ? `| ${sourcePlaylist?.title}` : ''}</title>
      </Head>
      <div className="position-absolute d-flex justify-content-between container-fluid pt-5 px-5" style={{ top: 0, left: 0, right: 0, zIndex: 60 }}>
        <a className="btn-outline-light" href={`/dashboard?service=${platformProviderMap[sourcePlaylist.platform]}`}>
          <i className="bi bi-arrow-left"></i>
        </a>
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

                        <img src={sourcePlaylist.image} style={{ aspectRatio: '1', height: '10vw', minHeight: '90px', objectFit: 'cover' }} alt="" />
                        <h1 className="py-4 text-center">{sourcePlaylist.title}</h1>
                        <Button disabled={(sourcePlaylist.playlistOrigin.length != 0 || sourcePlaylist.Playlist) ? true : false} onClick={handleOpen} className="spotifyMigrateBtn mb-4" variant="dark" size="lg">
                          Migrate
                        </Button>
                        {
                          sourcePlaylist.Playlist ? <>
                            <div>
                              <span>
                                PlaylistMigrated from {' '}
                              </span>
                              <a href={`/playlist/${platformProviderMap[sourcePlaylist.Playlist.platform]}/${sourcePlaylist.Playlist.external_id}`}>
                                <img src={UIImg[platformProviderMap[sourcePlaylist.Playlist.platform]]} alt={sourcePlaylist.Playlist.id} height={20} width={20} />
                                <span>

                                  {UIName[platformProviderMap[sourcePlaylist.Playlist.platform]]}
                                </span>
                              </a>
                            </div>
                          </> : <>
                            {
                              sourcePlaylist.playlistOrigin.length != 0 ? <>
                                <div className="d-flex flex-column justify-content-center align-items-center">
                                  <span>This Playlist is migrated to</span>
                                  {
                                    sourcePlaylist.playlistOrigin.map((playlist, i) =>
                                      <a href={`/playlist/${platformProviderMap[playlist.platform]}/${playlist.external_id}`} key={i} className="d-flex gap-3 align-items-center">
                                        <img src={UIImg[platformProviderMap[playlist.platform]]} alt={playlist.title} height={20} width={20} />
                                        <span>

                                          {UIName[platformProviderMap[playlist.platform]]}
                                        </span>
                                      </a>
                                    )
                                  }
                                </div>
                              </> : <>

                              </>
                            }
                          </>
                        }
                        <span></span>
                      </div>
                      <img src={sourcePlaylist?.image} className="position-absolute" style={{ top: 0, left: 0, width: '100%', height: '100%', filter: 'blur(50px)', opacity: '0.5', zIndex: 0 }} alt="" />

                    </div>

                  </div>
                  <div className="col-12 d-lg-block d-none col-lg-8 p-0 m-0">
                    <ul className="px-0 pt-0 m-0" style={{ overflowY: 'scroll', height: '100vh' }}>
                      {
                        songs.map((song, i) => <>{
                          song.id != null &&
                          <li key={i} style={{ listStyle: 'none', backgroundColor: 'black' }} className="playlistSongItem mb-3 p-3">
                            <div className="d-flex gap-3">
                              <img className="mx-3" height={50} width={50} src={song?.imageSrc} alt={song?.name} style={{objectFit:'cover'}} />
                              <div className="d-flex flex-column">
                                <h4>{song.name}</h4>
                                <span>
                                  {
                                    song.artists.map((artist, i) => <span key={i}>{artist.name}{song.artists.length == i + 1 ? '' : ','}  </span>)
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
                          song.id != null &&
                          <li key={i} style={{ listStyle: 'none', backgroundColor: 'black' }} className="playlistSongItem mb-3 p-3">
                            <div className="d-flex gap-3">
                              <img className="mx-3" height={50} width={50} src={song?.imageSrc} alt={song?.name} style={{objectFit:'cover'}} />
                              <div className="d-flex flex-column">
                                <h4>{song.name}</h4>
                                <span>
                                  {
                                    song.artists.map((artist, i) => <span key={i}>{artist.name}{song.artists.length == i + 1 ? '' : ','}  </span>)
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
                        <Modal.Title>Migrate {sourcePlaylist.title}</Modal.Title>
                      </Modal.Header>

                      <Modal.Body>
                        <p>Select <b>Platform</b> to Migrate your playlist: </p>
                        <form>

                          {
                            accounts.filter((account) => account.providerId != currentCredentials.providerId).map((account, i) =>
                              <>
                                <div className="form-check d-flex align-items-center">
                                  <input onClick={() => setOption(account.providerId)} type="radio" className="form-check-input" value={account.providerId} id={account.providerId} name={account.providerId} checked={option == account.providerId} />
                                  <label className="form-check-label d-flex align-items-center" htmlFor={account.providerId}>
                                    <img src={UIImg[account.providerId]} height="30px" width="30px" />
                                    <span>{UIName[account.providerId]}</span>
                                  </label>
                                </div>
                              </>
                            )
                          }
                        </form>


                      </Modal.Body>

                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button className="spotifyMigrateBtn" variant="primary" onClick={handleMigration} disabled={option == null}>Migrate</Button>
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
                sourceCredentials={currentCredentials}
                destinationCredentials={destinationCredentials}
                onCancel={handleStopMigration}
                onFinish={handleFinishMigration}
                onStart={() => console.log('starting')}
                playlistName={sourcePlaylist?.title}
                playlistId={playlistId.toString()}
                playlistThumbnail={sourcePlaylist.image}
                user={user}
                sourcePlaylist={sourcePlaylist}

              />
            )
          }
        </>
      )}
    </>
  )
}
PlaylistView.requireAuth = true