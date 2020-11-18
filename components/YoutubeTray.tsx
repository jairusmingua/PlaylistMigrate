import { Row, Col, Container, Navbar, Button } from 'react-bootstrap';
import { AuthType, OAuthType, Profile, YoutubeProfile } from '../services/types';
import { useEffect, useState } from 'react';
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
    return (<>
        {profile!=null && profile.name
        
        }
        {profile!=null&&<img alt=""src={profile.profilePic_url.toString()}></img>}
    </>
    )
}
