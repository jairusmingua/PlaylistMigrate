import { useRouter } from "next/router";
import { signOut, useSession, getSession } from 'next-auth/client'
import { Container, Card, Row, Col, Button, Modal, Alert } from 'react-bootstrap'

import { useEffect, useState } from 'react'
import { Playlist, PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next";
import prisma from '../../db/prisma'
import PageNavigation from '../../components/PageNavigation';
import Linking from '../../components/setting/Linking';
import Preference from '../../components/setting/Preference';
import Privacy from '../../components/setting/Privacy';


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 302
        res.setHeader('Location', `/login`)
        return { props: {} }
    }
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
        include: {
            accounts: true,
        }
    })
    return { props: { user: user } }

};

export default function Settings({ user }) {
    const { query } = useRouter()
    const [page, setPage] = useState(0);
    const [show, setShow] = useState(query['linking-success'] ? true : false);

    return (
        <>
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
                        {
                            show &&
                            <Alert variant={query['linking-success'] == 'true' ? 'success':'warning'} onClose={() => setShow(false)} dismissible>
                                <strong>{query['linking-success'] == 'true' ? 'Great!':'Oh No!'}</strong> {query['linking-success'] == 'true' ? 'Account was successfully Linked.':'Account linking failed.'}
                            </Alert>
                        }
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