import Head from 'next/head'
import Link from 'next/link';
import { Row, Col, Container, Navbar,Button } from 'react-bootstrap';
import {AuthType,OAuthType} from '../services/types';
import {NextRouter, useRouter} from 'next/router';
import { storeToken } from './_app';
export default function Home() {
  const router:NextRouter = useRouter();
  if(router.query["token"]){
    const decoded_token = decodeURIComponent(router.query["token"].toString());
    const token:OAuthType = JSON.parse(decoded_token);
    storeToken(token);
    router.push("/")
  }
  return (
    <div>
      <Head>
        <title>PlaylistMigrate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <h1>PlaylistMigrate</h1>
        <br></br>
        <Row>
          <Col>
            <Row>
              Login to Spotify
              <Link href={`/api/login?${AuthType.queryString}=${AuthType.spotify}`}>Login</Link>
            </Row>
          </Col>
          <Col>
            <Row>
              Login to Youtube
              <Link href={`/api/login?${AuthType.queryString}=${AuthType.youtube}`}>Login</Link>
            </Row>
          </Col>
         
        </Row>
      </Container>
    </div>
  )
}
