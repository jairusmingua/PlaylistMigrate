import { Container, Card, Row, Col, Button } from 'react-bootstrap'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Session } from 'next-auth'
import { getSession, providers, signIn, signOut, useSession } from 'next-auth/client'
import { useEffect } from 'react';
import { GetServerSideProps } from "next";
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

    const session = await getSession({ req });
    if (session) {
        res.statusCode = 302
        res.setHeader('Location', `/dashboard`)
        return { props: {} }
    }

    return { props: {} }

};
export default function Login({ props }) {
    return <>
        <Container className="d-flex mt-5 justify-content-center p-5">
            <Card className="text-center p-4">
                <Card.Body className="pb-5">
                    <Col className="d-flex flex-column pb-5 pt-4 w-100">
                        <img src="logo.svg" className="dark" height="40px" />
                    </Col>
                    <Col className="p-0 gap-2">

                        <Button variant="dark" size="lg" className="my-1" onClick={() => signIn("spotify")}>
                            <div className="d-flex">
                                <div className="w-75">
                                    Login with Spotify
                                </div>
                                <div className="flex-shrink-1">
                                    <img src="spotify.png" height="30px" width="30px" />

                                </div>

                            </div>
                        </Button>

                        <Button variant="dark" size="lg" className="my-1" onClick={() => signIn("google")}>
                            <div className="d-flex">
                                <div className="w-75">
                                    Login with Youtube
                                </div>
                                <div className="flex-shrink-1">
                                    <img src="youtube.png" height="30px" width="30px" />
                                </div>

                            </div>
                        </Button>

                    </Col>
                </Card.Body>
            </Card>
        </Container>
    </>
}

Login.getInitialProps = async (context) => {
    const { req, res } = context;
    const session = await getSession({ req });
    if (session) {

        console.log(session)
        console.log('redirecting')
        res.statusCode = 302
        res.setHeader('Location', `/dashboard`)
        return { providers: await providers }
    }
    return {
        session: undefined,
        providers: await providers
    };
}
