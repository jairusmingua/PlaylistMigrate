import { signOut, useSession, getSession } from 'next-auth/client'
import { Container, Card, Row, Col, Button, Modal } from 'react-bootstrap'

import { useEffect, useState } from 'react'
import { Playlist, PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next";
import prisma from '../../db/prisma'
import PageNavigation from '../../components/PageNavigation';
import Linking from '../../components/setting/Linking';


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
    return (
        <>
            <div className="container">
                <PageNavigation user={user}></PageNavigation>
                <div className="row">
                    <div className="col-4">
                        <ul>
                            <li className="mb-4 p-3 settingsList">
                                <i className="bi bi-link"></i> Linking
                            </li>
                            <li className="mb-4 p-3  settingsList">
                                <i className="bi bi-sliders"></i> Preference
                            </li>
                            <li className="mb-4 p-3  settingsList">
                                <i className="bi bi-people-fill"></i> Privacy
                            </li>
                        </ul>
                    </div>
                    <div className="col-8 settingsPanel shadow-sm">
                        <Linking accounts={user.accounts}></Linking>
                    </div>
                </div>
            </div>
        </>
    )
}
Settings.requireAuth = true