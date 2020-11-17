import Head from 'next/head'
import Link from 'next/link';
import { Row, Col, Container, Navbar,Button } from 'react-bootstrap';
import {AuthType,OAuthType} from '../services/authTypes';
import {NextRouter, useRouter} from 'next/router';
export default function Home() {
  const router:NextRouter = useRouter();
  if(router.query["token"]){
    const decoded_token = decodeURIComponent(router.query["token"].toString());
    const token:OAuthType = JSON.parse(decoded_token);
    storeToken(token);
    router.push("/")
  }
  function storeToken(token:OAuthType){
    window.localStorage.setItem(`${token.auth_type}_access_token`,token.access_token.toString());
    if(token.refresh_token){
      window.localStorage.setItem(`${token.auth_type}_refresh_token`,token.refresh_token.toString());
    }
    window.localStorage.setItem(`${token.auth_type}_token_type`,token.token_type.toString());
    window.localStorage.setItem(`${token.auth_type}_scope`,token.scope.toString());
    window.localStorage.setItem(`${token.auth_type}_expires_in`,token.expires_in.toString());
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
