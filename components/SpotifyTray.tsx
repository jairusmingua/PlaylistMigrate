import { Row, Col, Container, Navbar, Button } from 'react-bootstrap';
import { AuthType, OAuthType, Profile, SpotifyProfile } from '../services/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppProps } from 'next/dist/next-server/lib/router/router';
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
    return (<Container className="h-100 tray">
        {profile ?
            <>
                <Row className="p-3">
                    <Col className="p-0 m-0">
                        <img src="spotify.png" className="ml-0 float-left rounded-circle profile-pic"></img>
                    </Col>
                    <Col>
                        <Row className="float-right">

                            <h6>{profile.name}</h6>
                            <img className="rounded-circle profile-pic" src={profile.profilePic_url.toString()} />

                        </Row>
                    </Col>
                </Row>
                <Row>
                    <div>

                    </div>
                </Row>
            </>
            :
            <Row>
                Login to Spotify
              <Link href={`/api/login?${AuthType.queryString}=${AuthType.spotify}`}>Login</Link>
            </Row>
        }
    </Container>
    )
}
