import { Account } from "@prisma/client";
import { FunctionComponent, useState, useEffect } from "react";
import { getSession, providers, signIn, signOut, useSession } from 'next-auth/client'
import axios from "axios";
import { generateCallback } from "../../util";
import { useRouter } from "next/router";
import { supportedProviders, UIImg, UIName } from "../../@client/types";

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
                    `${provider == 'spotify' ? 'Spotify' : 'Youtube Music'} was Successfully Linked`,
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
            const url = generateCallback('/settings', 'ERROR', error.response.data.error)
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
                    {
                        supportedProviders.map((providerId, i) => 
                            <div key={i} className="col py-2 text-center">
                                <button className="btn btn-dark" onClick={() => handleSignin(providerId, _accounts.find(val => val.providerId == providerId))}>
                                    <div className="d-flex justify-content-between">

                                        <div className="d-flex justify-content-start align-items-center">

                                            <img src={UIImg[providerId]} alt={providerId} height={30} />
                                            <span className="px-2">
                                                {
                                                    _accounts.filter((val) => val.providerId == providerId)
                                                        .length == 0 ? `Link to ${UIName[providerId]} `: `${UIName[providerId]} Linked`

                                                }
                                            </span>
                                        </div>
                                        {
                                            _accounts.filter((val) => val.providerId == providerId)
                                                .length == 0 ? <i className="bi bi-check" style={{ opacity: '0' }}></i> : <i className="bi bi-check"></i>

                                        }
                                    </div>
                                </button>

                                {
                                    (_accounts.filter((val) => val.providerId == providerId)
                                        .length != 0 && _accounts.length > 1) &&
                                    <>
                                        {
                                            !_accounts.filter((val) => val.providerId == providerId)[0].primary ?
                                                <div className="d-flex">
                                                    {/* <button className="btn btn-link" onClick={() => handleUnlinkAccount(providerId)}>Unlink</button> */}
                                                    <button className="btn btn-link" onClick={() => handlePrimary(providerId)} >Set As Primary</button>
                                                </div> :
                                                <button className="btn btn-link" disabled>Primary</button>

                                        }
                                    </>

                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </>

    );
}

export default Linking;