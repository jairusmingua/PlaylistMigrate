import { useEffect, useState } from 'react';
import { Navbar, Container, Button, Spinner } from 'react-bootstrap';

import axios from 'axios'
import Head from 'next/head';

function MigrateSequence({ source, destination, playlistName, playlistId, start, onStart, onCancel, onFinish, sourceCredentials, destinationCredentials, playlistThumbnail }) {
    const [songs, setSongs] = useState(undefined);
    const [currentSourceSong, setCurrentSourceSong] = useState(undefined);
    const [currentDestinationSong, setCurrentDestinationSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [isCollected, setIsCollected] = useState(false);
    const [playlistSize, setPlaylistSize] = useState(null);
    const [statusMsg, setStatusMsg] = useState(null);
    const [notFoundCount, setNotFoundCount] = useState(0);
    const [notFoundSongs, setNotFoundSongs] = useState([]);
    const [foundSongs, setFoundSongs] = useState([]);
    const [showReport, setShowReport] = useState(false);
    async function youtubeInsert(playlistId, songs, index) {
        console.log(index)
        if (index < songs.length) {
            let payload = {
                "snippet": {
                    "playlistId": playlistId,
                    "position": 0,
                    "resourceId": {
                        "kind": "youtube#video",
                        "videoId": songs[index].external_id
                    }
                }
            }
            try {
                let { data } = await axios.post(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`, payload, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${destinationCredentials.accessToken}`
                    }
                })

            } catch (error) {
                return false
            }
            let _index = index + 1
            return await youtubeInsert(playlistId, songs, _index)
        }
        return true

    }
    async function insertPlaylist(playlistId, foundSongs) {
        console.log('insertPlaylist')
        console.log(source, destination)
        if (source == 'SPOTIFY' && destination == 'YT') {
            console.log(`Inserting ${playlistId}`)
            try {
                return await youtubeInsert(playlistId, foundSongs, 0)
                
            } catch (error) {
                console.log(error);

            }

        }

    }
    async function createPlaylist() {
        console.log('createPlaylist')
        if (source == 'SPOTIFY' && destination == 'YT') {
            const payload = {
                "snippet": {
                    "title": playlistName,
                    "description": `This is migrated playlist from ${source}`,
                    "tags": [
                        "playlistmigrate",
                        playlistName
                    ],
                    "defaultLanguage": "en"
                },
                "status": {
                    "privacyStatus": "private"
                }
            }

            try {
                let { data } = await axios.post(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus`, payload, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${destinationCredentials.accessToken}`
                    }
                })
                return data.id

            } catch (error) {
                console.log(error)
            }
        }

    }
    async function collectSongs() {
        console.log('collectSongs')
        let _notFoundCount = 0
        let _foundCount = 0
        let _foundSongs = []
        let _notFoundSongs = []
        if (source == 'SPOTIFY') {
            let { data } = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: {
                    'Authorization': `Bearer ${sourceCredentials.accessToken}`,
                    'Accept': 'application/json'
                }
            })
            let songs = data.items
            setPlaylistSize(data.total)

            setLoading(false)
            for (let i = 0; i < songs.length; i++) {
                setCurrentIndex(i)
                const title = source == 'SPOTIFY' ? songs[i]['track']['name'] : ''
                const artist = source == 'SPOTIFY' ? songs[i]['track']['artists'][0]['name'] : ''
                const thumbnail_src = source == 'SPOTIFY' ? songs[i]['track']['album']['images'][0]['url'] : ''
                const _source = source == 'SPOTIFY' ? 'SPOTIFY' : ''
                const url = source == 'SPOTIFY' ? songs[i]['track']['external_urls']['spotify'] : ''
                const isrc = source == 'SPOTIFY' ? songs[i]['track']['external_ids']['isrc'] : ''
                setCurrentDestinationSong({
                    'title': title,
                    'artist': artist,
                    'thumbnail_src': thumbnail_src,
                    'source': _source,
                    'url': url,
                    'isrc': isrc
                })
                await axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API_URL}/api/v1/search?artist=${artist}&title=${title}&source=${_source}&isrc=${isrc}`)
                    .then((response) => {
                        _foundSongs.push(response.data.result)
                        setFoundSongs(_foundSongs)
                        _foundCount += 1
                    }).catch((response) => {
                        _notFoundSongs.push({
                            'title': title,
                            'artist': artist,
                            'thumbnail_src': thumbnail_src,
                            'source': _source,
                            'url': url,
                            'isrc': isrc
                        })
                        setNotFoundSongs(_notFoundSongs)
                        _notFoundCount += 1
                        setNotFoundCount(_notFoundCount)
                    })

            }
        }
        return _foundSongs

    }
    async function startMigrate() {
        console.log('startMigrate')
        setStatusMsg('Collecting Songs from Database...')
        let foundSongs = await collectSongs()
        setStatusMsg('Creating Playlist...')
        let playlistId = await createPlaylist()
        setStatusMsg('Inserting Songs to Playlist...')
        let result = await insertPlaylist(playlistId, foundSongs)
    }

    useEffect(() => {
        if (source == 'SPOTIFY' && playlistId != undefined && playlistName != undefined && playlistThumbnail) {
            startMigrate().then(() => {
                onFinish()
            })
        }
    }, []);

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
                                                    <img className="pb-2" src={currentDestinationSong.thumbnail_src} alt="currentSong" style={{ aspectRatio: "1", width: "50vw", maxWidth: "200px" }} />
                                                    <h3 className="text-center">{currentDestinationSong.title}</h3>
                                                    <span>{currentDestinationSong.artist}</span>
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
                                    <span className="text-danger">Failed to Collect Songs: {notFoundCount}</span>
                                </div>
                                <div className="d-flex w-100 justify-content-center flex-column pt-5">
                                    <button className="btn btn-danger" onClick={onCancel}>Cancel</button>
                                </div>

                            </div> :
                            <div className="container d-flex flex-column py-5">
                                <div className="row">
                                    <div className="d-flex w-100 justify-content-center align-items-center py-5 flex-column">
                                        <h6>Migration Summary</h6>
                                        <p className="text-danger">Out of <b>{playlistSize}</b>, <b>{notFoundCount}</b> we're not found.</p>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col d-flex w-100">

                                        <ul className="w-100 p-0 m-0">
                                            {
                                                notFoundSongs.map((song, i) =>
                                                    <li key={i} style={{ listStyle: 'none', backgroundColor: 'black' }} className="playlistSongItem mb-3 p-3">
                                                        <div className="d-flex gap-3">
                                                            <img className="mx-3" height={50} width={50} src={song.thumbnail_src} alt={song.title} />
                                                            <div className="d-flex flex-column">
                                                                <h4>{song.title}</h4>
                                                                <span>
                                                                    {song.artist}
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