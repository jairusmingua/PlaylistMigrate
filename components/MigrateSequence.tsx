import { useEffect, useState } from 'react';
import { Navbar, Container, Button, Spinner } from 'react-bootstrap';

import axios from 'axios'

function MigrateSequence({ source, destination, playlistName, playlistId, start, onStart, onCancel, onFinish, credentials }) {
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
    useEffect(() => {
        if (source == 'SPOTIFY') {
            if (playlistId != undefined) {
                const songs = async () => {
                    let { data } = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                        headers: {
                            'Authorization': `Bearer ${credentials.accessToken}`,
                            'Accept': 'application/json'
                        }
                    })
                    setSongs(data.items)
                    setPlaylistSize(data.total)
                }
                songs().then(() => {
                    setLoading(false)
                }).catch((err) => console.log(err))
            }
        }
    }, []);
    useEffect(() => {
        if (songs != undefined) {
            setCurrentIndex(0)
            setStatusMsg('Collecting Songs from Database...')
        }
    }, [songs]);
    useEffect(() => {
        if (currentSourceSong != undefined && !isCollected) {
            if (songs[currentIndex].track.id != null) {

                const title = currentSourceSong.title
                const artist = currentSourceSong.artist
                const _source = source
                setCurrentDestinationSong(currentSourceSong)
                axios.get(`http://192.168.1.23:8000/api/v1/search?artist=${artist}&title=${title}&source=${_source}`)
                    .then((response) => {
                        if (currentIndex < songs.length - 1) {
                            // setInterval(()=>{
                            setCurrentIndex(currentIndex + 1)
                            setFoundSongs([...foundSongs, response.data.result])
                            // }, 2000)
                        } else {
                            setIsCollected(true)
                            // alert('Done Migrating!')
                            if (notFoundCount != 0) {
                                setShowReport(true)
                            } else {
                                onFinish()

                            }
                        }

                    }).catch((response) => {
                        // alert(response.response.data.message)
                        if (currentIndex < songs.length - 1) {
                            setNotFoundSongs([...notFoundSongs, currentSourceSong])
                            setNotFoundCount(notFoundCount + 1)
                            setCurrentIndex(currentIndex + 1)
                            console.log(currentSourceSong)
                        } else {
                            setNotFoundSongs([...notFoundSongs, currentSourceSong])
                            setNotFoundCount(notFoundCount + 1)
                            setIsCollected(true)
                            console.log(currentSourceSong)
                            // alert('Done Migrating!')
                            if (notFoundCount != 0) {
                                setShowReport(true)
                            } else {
                                onFinish()

                            }
                        }
                    })
            }
        }
    }, [currentSourceSong]);
    useEffect(() => {
        if (currentIndex != undefined && !isCollected) {
            if (songs[currentIndex].track.id != null) {

                const title = source == 'SPOTIFY' ? songs[currentIndex]['track']['name'] : ''
                const artist = source == 'SPOTIFY' ? songs[currentIndex]['track']['artists'][0]['name'] : ''
                const thumbnail_src = source == 'SPOTIFY' ? songs[currentIndex]['track']['album']['images'][0]['url'] : ''
                const _source = source == 'SPOTIFY' ? 'SPOTIFY' : ''
                const url = source == 'SPOTIFY' ? songs[currentIndex]['track']['external_urls']['spotify'] : ''
                const external_id = source == 'SPOTIFY' ? songs[currentIndex]['track']['external_ids']['isrc'] : ''
                setCurrentSourceSong({
                    'title': title,
                    'artist': artist,
                    'thumbnail_src': thumbnail_src,
                    'source': _source,
                    'url': url,
                    'external_id': external_id
                })
            } else {
                setCurrentIndex(currentIndex + 1)
            }
        }
    }, [currentIndex]);
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
                <>
                    {
                        !showReport ?
                            <div className="container-fluid d-flex flex-column py-5">
                                <div className="d-flex w-100 justify-content-center py-5">
                                    <h6>{statusMsg}</h6>
                                </div>

                                <div className="row pt-5">
                                    {/* <div className="col-12 col-lg-5 col-sm-12 py-5 d-flex justify-content-center align-items-center">

                            {
                                currentSourceSong &&
                                <>
                                    <div className="d-flex flex-column align-items-center">
                                        <img src={currentSourceSong.thumbnail_src} alt="currentSong" height={50} width={50} />
                                        <h3>{currentSourceSong.title}</h3>
                                        <span>{currentSourceSong.artist}</span>
                                    </div>
                                </>
                            }

                        </div> */}

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