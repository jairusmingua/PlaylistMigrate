import { Account } from "@prisma/client";
import { FunctionComponent, useState, useEffect } from "react";
import { getSession, providers, signIn, signOut, useSession } from 'next-auth/client'
import axios from "axios";
import { generateCallback } from "../../util";
import { useRouter } from "next/router";

interface LinkingProps {
    accounts: Array<Account>;
}

const Linking: FunctionComponent<LinkingProps> = ({ accounts }) => {
    const [_accounts, set_accounts] = useState(accounts);
    const router = useRouter()
    function handleSignin(provider: string, account: Account) {
        if (!account) {
            signIn(provider, {
                callbackUrl: generateCallback(
                    '/settings',
                    'SUCCESS',
                    `${provider == 'spotify'?'Spotify':'Youtube Music'} was Successfully Linked`,
                    null
                ),
            })
        }
    }
    function handleUnlinkAccount(provider) {
        const account = accounts.filter((account) => account.providerId == provider.toLowerCase())[0]
        axios.post('/api/unlink', account).then((response) => {
            if (response.status == 200) {
                set_accounts(response.data)
            }
        }).catch((error) => {
            const url = generateCallback('/settings','ERROR', error.response.data.error)
            router.push(url)
        })
    }
    function handlePrimary(provider) {
        const account = accounts.filter((account) => account.providerId == provider.toLowerCase())[0]
        axios.post('/api/set-primary', account).then((response) => {
            if (response.status == 200) {
                set_accounts(response.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    return (
        <>
            <div className="container p-5">
                <div className="row pb-3">
                    <p>In order to use PlaylistMigrate, link two or more accounts.</p>
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

                        {
                            (_accounts.filter((val) => val.providerId == 'spotify')
                                .length != 0 && _accounts.length > 1) &&
                            <>
                                {
                                    !_accounts.filter((val) => val.providerId == 'spotify')[0].primary ?
                                        <div className="d-flex">
                                            <button className="btn btn-link" onClick={() => handleUnlinkAccount('spotify')}>Unlink</button>
                                            <button className="btn btn-link" onClick={() => handlePrimary('spotify')} >Set As Primary</button>
                                        </div> :
                                        <button className="btn btn-link" disabled>Primary</button>

                                }
                            </>

                        }

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
                        {
                            (_accounts.filter((val) => val.providerId == 'google')
                                .length != 0 && _accounts.length > 1) &&
                            <>
                                {
                                    !_accounts.filter((val) => val.providerId == 'google')[0].primary ?
                                        <div className="d-flex">
                                            <button className="btn btn-link" onClick={() => handleUnlinkAccount('google')}>Unlink</button>
                                            <button className="btn btn-link" onClick={() => handlePrimary('google')} >Set As Primary</button>
                                        </div> :
                                        <button className="btn btn-link" disabled>Primary</button>


                                }
                            </>

                        }
                    </div>
                </div>
            </div>
        </>

    );
}

export default Linking;