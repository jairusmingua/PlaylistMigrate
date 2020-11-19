import { Row, Col, Container, Media } from 'react-bootstrap';
import { AuthType, OAuthType, Profile, Playlist, SpotifyProfile } from '../services/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PlaylistItem from './PlaylistItem';
type AppProps={
    trayType:'spotify'|'youtube'
};
export default function Tray({trayType}:AppProps) {
    const [profile, setProfile] = useState<SpotifyProfile>();
    const [playlistItems, setPlaylistItems] = useState<Array<Playlist>>([]);
    const app_type =trayType;
    function clearStorage(){
        console.log("cleaning storage");
        window.localStorage.removeItem(`${app_type}_access_token`);
        window.localStorage.removeItem(`${app_type}_refresh_token`);
        window.localStorage.removeItem(`${app_type}_token_type`);
        window.localStorage.removeItem(`${app_type}_scope`);
        window.localStorage.removeItem(`${app_type}_expires_in`);
    }
    useEffect(() => {
        if (window.localStorage.getItem(`${trayType}_access_token`)) {
            fetch(`/api/${trayType}/profile`, {
                headers: {
                    "Authorization": `Bearer ${window.localStorage.getItem(`${trayType}_access_token`)}`
                }
            }).then(async (response) => {
                const data = await response.json();
                setProfile(
                    data
                );
                fetch(`/api/${trayType}/playlists`, {
                    headers: {
                        "Authorization": `Bearer ${window.localStorage.getItem(`${trayType}_access_token`)}`
                    }
                }).then(async (response) => {
                    const data: Array<Playlist> = await response.json();
                    setPlaylistItems(
                        data
                    );
                });
            }).catch((err)=>clearStorage());


        }
    }, [])
    return (<>
        {profile ?
            <>
                <Row className="p-3 h-25">
                    <Col className="p-0 m-0">
                        <img src={`${trayType}.png`} className="ml-0 float-left rounded-circle profile-pic"></img>
                    </Col>
                    <Col>
                        <Row className="float-right">

                            <h6>{profile.name}</h6>
                            <img className="rounded-circle profile-pic" src={profile.profilePic_url.toString()} />

                        </Row>
                    </Col>
                </Row>
                <Row className="h-75">
                    { playlistItems!=[]&&
                        <ul className="list-unstyled w-100 h-100 playlist-list">
                            {playlistItems.map((items)=>{
                                return <PlaylistItem key={items.id} playlist={items}></PlaylistItem>
                            })}
                        </ul>

                    }
                </Row>
            </>
            :
            <Row>
                {`Login to ${trayType=="spotify"?'Spotify':'Youtube'}`}
              <Link href={`/api/login?${AuthType.queryString}=${trayType}`}>Login</Link>
            </Row>
        }
    </>
    )
}
