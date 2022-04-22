import { Account, User } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps } from "next";
import { signIn, signOut } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import AlertBox from "../../components/AlertBox";
import { getUser } from "../../repositories/UserRepository";
import { generateCallback } from "../../util";


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const user = await getUser(req, res)
    if (user.accounts.length >= 2) {
        return {
            redirect: {
                permanent: true,
                destination: '/dashboard'
            }
        }
    }
    return { props: { accounts: user.accounts } }
};

export default function Onboard({ accounts }: { accounts: Account[] }) {
    const { query } = useRouter()
    const { status } = query
    const { message } = query
    const show = message ? true : false

    const [_accounts, set_accounts] = useState(accounts);
    function handleSignin(provider, account: Account) {
        if (!account) {
            signIn(provider, {
                callbackUrl: generateCallback(
                    '/onboard'
                )
            })
        }
    }
    return (<>
        <Head>
            <title>PlaylistMigrate | Onboarding</title>
        </Head>
        <div className="container" style={{ height: "100vh" }}>
            <div className="d-flex flex-column align-items-center justify-content-center h-100">

                <div className="row pb-3 text-center">
                    <h1>Welcome to PlaylistMigrate!</h1>
                </div>
                <div className="row pb-3">
                    <p>In order to use PlaylistMigrate, link two or more accounts.</p>
                </div>
                <div className="row pt-2 m-0">

                    <AlertBox />
                </div>
                <div className="row">
                    <div className="col py-2 text-center">
                        <button className="btn btn-dark" onClick={() => handleSignin('spotify', _accounts.filter(val => val.providerId == 'spotify')[0])}>
                            <div className="d-flex justify-content-between">

                                <div className="d-flex justify-content-start align-items-center">

                                    <img src="/spotify.png" alt="spotify" height={30} />
                                    <span className="px-2">
                                        {
                                            _accounts.filter((val) => val.providerId == 'spotify')
                                                .length == 0 ? 'Link to Spotify' : 'Spotify Linked'

                                        }
                                    </span>
                                </div>
                                {
                                    _accounts.filter((val) => val.providerId == 'spotify')
                                        .length == 0 ? <i className="bi bi-check" style={{ opacity: '0' }}></i> : <i className="bi bi-check"></i>

                                }
                            </div>
                        </button>
                    </div>
                    <div className="col py-2 text-center">
                        <button className="btn btn-dark" onClick={() => handleSignin('google', _accounts.filter(val => val.providerId == 'google')[0])}>
                            <div className="d-flex justify-content-between p-0 m-0">
                                <div className="d-flex justify-content-start align-items-center">

                                    <img src="/youtube.png" alt="google" height={30} />
                                    <span className="px-2">
                                        {
                                            _accounts.filter((val) => val.providerId == 'google')
                                                .length == 0 ? 'Link to Youtube Music' : 'Youtube Music Linked'

                                        }
                                    </span>
                                </div>
                                {
                                    _accounts.filter((val) => val.providerId == 'google')
                                        .length == 0 ? <i className="bi bi-check" style={{ opacity: '0' }}></i> : <i className="bi bi-check"></i>

                                }
                            </div>
                        </button>
                    </div>
                </div>
                <div className="row pt-5">
                    <button className="btn btn-danger px-4" onClick={() => signOut()}>Logout</button>
                </div>
            </div>

        </div>
    </>);
}
Onboard.requireAuth = true