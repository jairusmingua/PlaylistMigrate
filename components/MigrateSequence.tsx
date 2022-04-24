import { useEffect, useState } from 'react';
import { Navbar, Container, Button, Spinner } from 'react-bootstrap';
import { Account } from '@prisma/client';
import axios from 'axios'
import Head from 'next/head';
import { PMAPI, services } from '../@client';
import { Song, SongAPIResult } from '../@client/types';
import { OAuthProviderType } from 'next-auth/providers';

let isContinue = true
let mfoundSongs: SongAPIResult[] = []
let pmapi = new PMAPI()
interface MigrateSequenceProps {
    playlistName: string,
    playlistId: string,
    onStart: VoidFunction,
    onCancel: VoidFunction,
    onFinish: VoidFunction,
    sourceCredentials: Account,
    destinationCredentials: Account,
    playlistThumbnail: string
}

function MigrateSequence({
    playlistName, playlistId, playlistThumbnail,
    onStart, onCancel, onFinish,
    sourceCredentials, destinationCredentials
}: MigrateSequenceProps) {
    const [currentDestinationSong, setCurrentDestinationSong] = useState<Song>(null);
    const [currentIndex, setCurrentIndex] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [playlistSize, setPlaylistSize] = useState(null);
    const [statusMsg, setStatusMsg] = useState(null);
    const [notFoundSongs, setNotFoundSongs] = useState<Song[]>([]);
    const [foundSongs, setFoundSongs] = useState<SongAPIResult[]>([]);
    const [showReport, setShowReport] = useState(false);
    const [_isContinue, setIsContinue] = useState(true);
    const [isDone, setIsDone] = useState(false);

    async function insertPlaylist(playlistId) {
        try {
            if (!isContinue) {
                return false;
            }
            const service = services[destinationCredentials.providerId]
            return await service.insertItemsToPlaylist(destinationCredentials, playlistId, mfoundSongs, 'private', 0)
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async function createPlaylist() {
        try {
            if (!isContinue) {
                return null;
            }
            return await services[destinationCredentials.providerId]
                .createPlaylist(destinationCredentials, playlistName, 'private')
        } catch (error) {
            return null
        }

    }
    async function searchSong(songs: Song[], i) {
        if (!isContinue) {
            return false;
        }
        if (!(i < songs.length)) {
            return true
        }
        setCurrentIndex(i)
        setCurrentDestinationSong(songs[i])
        try {
            let result = await pmapi.searchSong(songs[i], sourceCredentials.providerId)
            mfoundSongs.push(result[0])
            setFoundSongs((foundSongs) => [...foundSongs, result[0]])
            return await searchSong(songs, i + 1)
        } catch (error) {
            setNotFoundSongs((notFoundSongs) => [...notFoundSongs, songs[i]])
            return await searchSong(songs, i + 1)

        }

    }
    async function collectSongs() {
        setLoading(false)
        try {
            if (!isContinue) {
                return false;
            }
            const { songs, totalSongs } = await services[sourceCredentials.providerId].getPlaylistSongs(sourceCredentials, playlistId)
            setPlaylistSize(totalSongs)
            return await searchSong(songs, 0)
        } catch (error) {
            return false
        }

    }
    async function startMigrate() {
        setStatusMsg('Collecting Songs from Database...')
        collectSongs().then(() => {
            setStatusMsg('Creating Playlist...')
            createPlaylist().then((playlist) => {
                setStatusMsg('Inserting Items to Playlist...')
                insertPlaylist(playlist.id).then((result) => {
                    if (result) {
                        setIsDone(true)
                    }
                })
            })

        })
    }

    function handleCancel() {
        isContinue = false
        onFinish()
    }
    useEffect(() => {
        const _startMigrate = async () => {
            await startMigrate()
        }
        if (playlistId != undefined && playlistName != undefined && playlistThumbnail) {
            _startMigrate()
        }
    }, []);
    useEffect(() => {
        if (isDone) {
            isContinue = false
            if (notFoundSongs.length > 0) {
                setShowReport(true)
            } else {
                onFinish()

            }
        }
    }, [isDone]);
    return (
        <>
            <Head>
                <title>PlaylistMigrate {statusMsg ? `| ${statusMsg}` : ''}</title>
            </Head>
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
                        !showReport ?
                            <div className="container-fluid d-flex flex-column py-5">
                                <div className="d-flex w-100 justify-content-center py-5">
                                    <h6>{statusMsg}</h6>
                                </div>

                                <div className="row pt-5">
                                    <div className="col-12 py-5 d-flex justify-content-center align-items-center">


                                        {
                                            currentDestinationSong &&
                                            <>
                                                <div className="d-flex flex-column align-items-center">
                                                    <img className="pb-2" src={currentDestinationSong.imageSrc} alt="currentSong" style={{ aspectRatio: "1", width: "50vw", maxWidth: "200px" }} />
                                                    <h3 className="text-center">{currentDestinationSong.name}</h3>
                                                    <span>{currentDestinationSong.artists[0].name}</span>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <div className="col-12 py-5">
                                        <div className="d-flex justify-content-center align-items-center loading p-5">
                                            <Spinner animation="border" role="status">
                                            </Spinner>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex w-100 justify-content-center align-items-center flex-column pt-5">
                                    <span>Song {currentIndex + 1} out of {playlistSize}</span>
                                    <span className="text-danger">Failed to Collect Songs: {notFoundSongs.length}</span>
                                </div>
                                <div className="d-flex w-100 justify-content-center flex-column pt-5">
                                    <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                                </div>

                            </div> :
                            <div className="container d-flex flex-column py-5">
                                <div className="row">
                                    <div className="d-flex w-100 justify-content-center align-items-center py-5 flex-column">
                                        <h6>Migration Summary</h6>
                                        <p className="text-danger">Out of <b>{playlistSize}</b>, <b>{notFoundSongs.length}</b> we're not found.</p>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col d-flex w-100">

                                        <ul className="w-100 p-0 m-0">
                                            {
                                                notFoundSongs.map((song, i) =>
                                                    <li key={i} style={{ listStyle: 'none', backgroundColor: 'black' }} className="playlistSongItem mb-3 p-3">
                                                        <div className="d-flex gap-3">
                                                            <img className="mx-3" height={50} width={50} src={song.imageSrc} alt={song.name} />
                                                            <div className="d-flex flex-column">
                                                                <h4>{song.name}</h4>
                                                                <span>
                                                                    {song.artists[0].name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className="row p-5">
                                    <button className="btn btn-danger" onClick={onFinish}>Done</button>
                                </div>
                            </div>
                    }

                </>
            )
            }
        </>)
}

export default MigrateSequence