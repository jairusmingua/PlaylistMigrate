import { Row, Col, Container, Navbar, Button } from 'react-bootstrap';
import { AuthType, OAuthType, Profile, SpotifyProfile } from '../services/types';
import { useEffect, useState } from 'react';
export default function SpotifyTray() {
    const [profile, setProfile] = useState<SpotifyProfile>();
    useEffect(() => {
        if (window.localStorage.getItem("spotify_access_token")) {
            fetch('/api/spotify/profile', {
                headers: {
                    "Authorization": `Bearer ${window.localStorage.getItem("spotify_access_token")}`
                }
            }).then(async (response) => {
                const data = await response.json();
                setProfile(
                  data
                );
            });

        }
    }, [])
    return (<>
        {profile!=null && profile.name}
        {profile!=null&&<img alt=""src={profile.profilePic_url.toString()}></img>}

    </>
    )
}
