import { Row, Col, Container, Navbar, Button } from 'react-bootstrap';
import { AuthType, OAuthType, Profile, YoutubeProfile } from '../services/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function YoutubeTray() {
    const [profile, setProfile] = useState<YoutubeProfile>();
    useEffect(() => {
        if (window.localStorage.getItem("youtube_access_token")) {
            fetch('/api/youtube/profile', {
                headers: {
                    "Authorization": `Bearer ${window.localStorage.getItem("youtube_access_token")}`
                }
            }).then(async (response) => {
                const data = await response.json();
                setProfile(data);
            });

        }
    }, [])
    return (<Container className="h-100 tray">
        {profile ?
            <>
                <Row className="p-3">
                    <Col className="p-0 m-0">
                        <img src="youtube.png" className="ml-0 float-left rounded-circle profile-pic"></img>
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
                Login to Youtube
          <Link href={`/api/login?${AuthType.queryString}=${AuthType.youtube}`}>Login</Link>
            </Row>
        }
    </Container>)
}
