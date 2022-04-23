import axios from "axios";

import { Account } from "@prisma/client";

import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from 'next/router'
import { signOut } from "next-auth/client";

import { generateCallback } from "../../util";
import { getUser } from "../../repositories/UserRepository";

import AlertBox from "../../components/AlertBox";


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const user = await getUser({req: req})
    if (!user) {
        return {
            redirect: {
                permanent: true,
                destination: '/login'
            }
        }
    }
    if (user.accounts.filter((account) => account.primary == true)?.length != 0) {
        return {
            redirect: {
                permanent: true,
                destination: '/dashboard'
            }
        }
    }

    return { props: { accounts: user.accounts } }
};

export default function PrimarySelect({ accounts }: { accounts: Account[] }) {
    const router = useRouter()
    function handlePrimary(account) {
        axios.post('/api/set-primary', account).then((response) => {
            if (response.status == 200) {
                router.push('/dashboard')
            }
        }).catch((error) => {
            const url = generateCallback('/primary-select', 'ERROR', error.response.data.error)
            router.push(url)
        })
    }
    return (<>
        <Head>
            <title>PlaylistMigrate | Select Primary</title>
        </Head>
        <div className="container" style={{ height: "100vh" }}>
            <div className="d-flex flex-column align-items-center justify-content-center h-100">

                <div className="row pb-3 text-center">
                    <h1>Welcome to PlaylistMigrate!</h1>
                </div>
                <div className="row pb-3">
                    <p>In order to use PlaylistMigrate, select primary account.</p>
                </div>
                <div className="row pt-2 m-0">
                    <AlertBox />
                </div>
                <div className="row">
                    <div className="col-12">
                        {
                            accounts.map((account) =>
                                <button className="card col-12 btn-dark m-2" style={{ width: "250px" }} onClick={() => { handlePrimary(account) }}>
                                    <div className="card-body d-flex flex-column align-items-center w-100">

                                        <img src={`/${account.providerId == 'spotify' ? 'spotify' : 'youtube'}.png`} alt={`${account.providerType == 'spotify' ? 'spotify' : 'youtube'}`} height={30} />

                                        <span className="text-center">
                                            {account.providerId == 'spotify' ? 'Spotify' : 'Youtube Music'}
                                        </span>

                                    </div>
                                </button>
                            )
                        }
                    </div>
                </div>
                <div className="row pt-5">
                    <button className="btn btn-danger px-4" onClick={() => signOut()}>Logout</button>
                </div>
            </div>

        </div>
    </>);
}
PrimarySelect.requireAuth = true