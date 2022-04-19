import { Account } from "@prisma/client";
import { FunctionComponent } from "react";
import { getSession, providers, signIn, signOut, useSession } from 'next-auth/client'

interface LinkingProps {
    accounts: Array<Account>;
}

const Linking: FunctionComponent<LinkingProps> = ({accounts}) => {
    function handleSignin(provider, account: Account) {
        if (!account) {
            signIn(provider, { callbackUrl: callbackUrl})
        }
    }
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/settings?linking-success=true`

    return (
        <>
            <div className="container p-5">
                <div className="row pb-3">
                    <p>In order to use PlaylistMigrate, link two or more accounts.</p>
                    {callbackUrl}
                </div>
                <div className="row">
                    <div className="col py-2">
                        <button className="btn btn-dark" onClick={() => handleSignin('spotify', accounts.filter(val => val.providerId == 'spotify')[0])}>
                            <div className="d-flex justify-content-between">

                                <div className="d-flex justify-content-start align-items-center">

                                    <img src="/spotify.png" alt="spotify" height={30} />
                                    <span className="px-2">
                                        {
                                            accounts.filter((val) => val.providerId == 'spotify')
                                                .length == 0 ? 'Link to Spotify' : 'Spotify Linked'

                                        }
                                    </span>
                                </div>
                                {
                                    accounts.filter((val) => val.providerId == 'spotify')
                                        .length == 0 ? <i className="bi bi-check" style={{ opacity: '0' }}></i> : <i className="bi bi-check"></i>

                                }
                            </div>
                        </button>
                    </div>
                    <div className="col py-2">
                        <button className="btn btn-dark" onClick={() => handleSignin('google', accounts.filter(val => val.providerId == 'google')[0])}>
                            <div className="d-flex justify-content-between p-0 m-0">
                                <div className="d-flex justify-content-start align-items-center">

                                    <img src="/youtube.png" alt="google" height={30} />
                                    <span className="px-2">
                                        {
                                            accounts.filter((val) => val.providerId == 'google')
                                                .length == 0 ? 'Link to Youtube Music' : 'Youtube Music Linked'

                                        }
                                    </span>
                                </div>
                                {
                                    accounts.filter((val) => val.providerId == 'google')
                                        .length == 0 ? <i className="bi bi-check" style={{ opacity: '0' }}></i> : <i className="bi bi-check"></i>

                                }
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Linking;