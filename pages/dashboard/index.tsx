import { signOut, useSession, getSession } from 'next-auth/client'
import { NextApiRequest, NextApiResponse } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AppProps } from 'next/app';
import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next";
import { IncomingMessage, ServerResponse } from 'http'
import prisma from '../../db/prisma'
import { User } from '.prisma/client'
import { Navbar, Image, Container, Col, Row, Spinner } from 'react-bootstrap'
import PageNavigation from '../../components/PageNavigation'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 302
    res.setHeader('Location', `/login`)
    return { props: {} }
  }
  const user: User = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    }
  })

  return { props: { user: user } }

};

export default function Dashboard({ user }: { user: User }) {

  return (
    <>
      <PageNavigation user={user}></PageNavigation>
      <div className="d-flex justify-content-center loading">
        <Spinner animation="border" role="status">
        </Spinner>
      </div>
    </>
  )
}
Dashboard.requireAuth = true