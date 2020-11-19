import { Row, Col, Container, Media } from 'react-bootstrap';
import { AuthType, OAuthType, Playlist, Profile, SpotifyProfile } from '../services/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
// import { AppProps } from 'next/dist/next-server/lib/router/router';
type AppProps ={playlist:Playlist};
export default function PlaylistItem({playlist}:AppProps) {
 
    return (
        <Row className="playlist-item m-0">
            <Col xs={2}>
                <img height={50} width={50} src={playlist.images.toString()} className="rounded"></img>
            </Col>
            <Col xs={10}>
                <h4>{playlist.name}</h4>
            </Col>

        </Row>
    )
}
