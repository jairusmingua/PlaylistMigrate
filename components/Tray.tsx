import { Row, Col, Container, Media,Button } from 'react-bootstrap';
import { AuthType, OAuthType, Profile, Playlist, SpotifyProfile } from '../services/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PlaylistItem from './PlaylistItem';
type AppProps = {
    trayType: 'spotify' | 'youtube'
};
export default function Tray({ trayType }: AppProps) {
    const [profile, setProfile] = useState<SpotifyProfile>();
    const [playlistItems, setPlaylistItems] = useState<Array<Playlist>>([]);
    const app_type = trayType;
    function clearStorage() {
        console.log("cleaning storage");
        window.localStorage.removeItem(`${app_type}_access_token`);
        window.localStorage.removeItem(`${app_type}_refresh_token`);
        window.localStorage.removeItem(`${app_type}_token_type`);
        window.localStorage.removeItem(`${app_type}_scope`);
        window.localStorage.removeItem(`${app_type}_expires_in`);
    }
    useEffect(() => {
        if (window.localStorage.getItem(`${trayType}_access_token`)) {
            fetch(`/api/profile/${trayType}`, {
                headers: {
                    "Authorization": `Bearer ${window.localStorage.getItem(`${trayType}_access_token`)}`
                }
            }).then(async (response) => {
                if (response.status == 500) {
                    clearStorage();
                } else {
                    const _profile = await response.json();
                    setProfile(
                        _profile
                    );
                    console.log(_profile);
                    fetch(`/api/playlists/${trayType}`, {
                        headers: {
                            "Authorization": `Bearer ${window.localStorage.getItem(`${trayType}_access_token`)}`
                        }
                    }).then(async (response) => {
                        if (response.status == 500) {
                            clearStorage();
                        } else {
                            const _playlist: Array<Playlist> = await response.json();
                            setPlaylistItems(
                                _playlist
                            );

                        }
                    });
                }
            }).catch((err) => clearStorage());


        }
    }, [])
    return (<>
        {profile ?
            <>
                {/* <Row className="p-3 h-25">
                    <Col className="p-0 m-0">
                        <img src={`${trayType}.png`} className="ml-0 float-left rounded-circle profile-pic"></img>
                    </Col>
                    <Col>
                        <Row className="float-right">

                            <h6>{profile.name}</h6>
                            <img className="rounded-circle profile-pic" src={profile.profilePic_url.toString()} />

                        </Row>
                    </Col>
                </Row> */}
                <Row className="h-50 tray w-100 mt-1 m-0 p-0">
                    <Row xs={12} className="h-auto m-0" style={{ width: "100%" }}>
                        <div className="p-3 w-100">

                            <Col className="p-0 m-0">
                                <img src={`${trayType}.png`} className="ml-0 float-left rounded-circle profile-pic"></img>
                            </Col>
                            <Col className="pr-2">
                                <Row className="float-right">

                                    <h6>{profile.name}</h6>
                                    <img className="rounded-circle profile-pic" src={profile.profilePic_url.toString()} />

                                </Row>
                            </Col>

                        </div>
                    </Row>
                    <Row xs={12} className="w-100 m-0 pb-3" style={{ height: "75%" }}>
                        {playlistItems != [] &&

                            <ul className="mx-2 py-0 px-2 list-unstyled w-100 h-100 playlist-list">
                                {playlistItems.map((items) => {
                                    return <PlaylistItem key={items.id} playlist={items}></PlaylistItem>
                                })}
                            </ul>

                        }

                    </Row>
                </Row>
            </>
            :
            <Row className="h-50 tray w-100 mt-1 m-0 p-0">
                <div className="align-self-center position-fixed" style={{left:"50%",transform:"translate(-50%,0%)"}}>

                    <Link href={`/api/login?${AuthType.queryString}=${trayType}`}><Button>{`Login to ${trayType == "spotify" ? 'Spotify' : 'Youtube'}`}</Button></Link>

                </div>
            </Row>
        }
    </>
    )
}
