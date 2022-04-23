import { useState } from 'react'

import { GetServerSideProps } from "next";
import Head from "next/head";

import { getUser } from "../../repositories/UserRepository";

import PageNavigation from '../../components/PageNavigation';
import Linking from '../../components/setting/Linking';
import Preference from '../../components/setting/Preference';
import Privacy from '../../components/setting/Privacy';
import AlertBox from "../../components/AlertBox";


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const user = await getUser(req, res)
    if (!user) {
        return {
            redirect: {
                permanent: true,
                destination: '/login'
            }
        }
    }
    return { props: { user: user} }
};

export default function Settings({ user }) {
    const [page, setPage] = useState(0);
    return (
        <>
            <Head>
                <title>PlaylistMigrate | Settings</title>
            </Head>
            <div className="container">
                <PageNavigation user={user}></PageNavigation>
                <div className="row p-4">
                    <div className="col-12 col-sm-12 col-lg-4">
                        <div className="row p-lg-3 p-0">
                            <div className={`col-4 col-lg-12 col-sm-4 mb-4 p-3 settingsList d-flex align-items-center ${page == 0 ? 'active' : ''}`} onClick={() => setPage(0)}>
                                <i className="bi bi-link"></i>
                                <span className="px-2">Linking</span>
                            </div>
                            <div className={`col-4 col-lg-12 col-sm-4 mb-4 p-3 settingsList d-flex align-items-center ${page == 1 ? 'active' : ''}`} onClick={() => setPage(1)}>
                                <i className="bi bi-sliders"></i>
                                <span className="px-2">Preference</span>
                            </div>
                            <div className={`col-4 col-lg-12 col-sm-4 mb-4 p-3 settingsList d-flex align-items-center ${page == 2 ? 'active' : ''}`} onClick={() => setPage(2)}>
                                <i className="bi bi-people-fill"></i>
                                <span className="px-2 fs-5">Privacy</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-12 col-lg-8">
                        <AlertBox />
                        <div className="settingsPanel shadow-sm">

                            {
                                page == 0 &&
                                <Linking accounts={user.accounts}></Linking>
                            }
                            {
                                page == 1 &&
                                <Preference></Preference>
                            }
                            {
                                page == 2 &&
                                <Privacy></Privacy>
                            }
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
Settings.requireAuth = true