import Head from 'next/head'
import Link from 'next/link';
import { Row, Col, Container, Navbar, Button } from 'react-bootstrap';
import { AuthType, OAuthType } from '../services/types';
import { NextRouter, useRouter } from 'next/router';
import { storeToken } from './_app';
import SpotifyTray from '../components/SpotifyTray';
import YoutubeTray from '../components/YoutubeTray';
export default function Home() {
  const router: NextRouter = useRouter();
  if (router.query["token"]) {
    const decoded_token = decodeURIComponent(router.query["token"].toString());
    const token: OAuthType = JSON.parse(decoded_token);
    storeToken(token);
    router.push("/")
  }
  return (
    <>
      <Head>
        <title>PlaylistMigrate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="p-2">
        <Navbar variant="dark" style={{ height: "auto" }} >
          <Navbar.Brand>
            <img
              src="logo.svg"
              width="40"
              height="40"
              className="d-inline-block pr-2 align-top"
              alt="React Bootstrap logo"
            />
            PlaylistMigrate
          </Navbar.Brand>
        </Navbar>
        <Row style={{ height: "90%", width: "100%", maxWidth: "100%", margin: 0 }}>

          <Col xs={12} sm={12} md={12} lg={6} className="p-2">
            <SpotifyTray />
          </Col>
          <Button className="d-lg-none d-xl-none d-xs-block d-sm-block d-md-block position-fixed align-self-center migrate-btn">Migrate</Button>
          <Col xs={12} sm={12} md={12} lg={6} className="p-2">
            <YoutubeTray />
          </Col>
        </Row>
      </Container>
    </>
  )
}
