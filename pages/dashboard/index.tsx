import { signOut, useSession, getSession } from 'next-auth/client'
import { InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AppProps } from 'next/app';
import { Playlist, PrismaClient, User, Account } from "@prisma/client"
import { GetServerSideProps } from "next";
import { IncomingMessage, ServerResponse } from 'http'
import { prisma } from '../../db/prisma'
import { Navbar, Image, Container, Col, Row, Spinner, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap'
import PageNavigation from '../../components/PageNavigation'
import axios from 'axios'
import PlaylistItem from '../../components/PlaylistItem'
import { spotifyQueue } from '../../queue'
import { getUser } from '../../repositories/UserRepository'
import Linking from '../../components/setting/Linking'
import { getPrimaryAccount } from '../../util'
import { getOauthAccount } from '../../@client'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const user = await getUser({ req: req })
  if (!user) {
    return {
      redirect: {
        permanent: true,
        destination: '/login'
      }
    }
  }
  if (user.accounts.length < 2) {
    return {
      redirect: {
        permanent: true,
        destination: '/onboard'
      }
    }
  }
  if (user.accounts.filter((account) => account.primary == true).length == 0) {
    return {
      redirect: {
        permanent: true,
        destination: '/primary-select'
      }
    }
  }
  let primaryAccount = getPrimaryAccount(user.accounts)
  return {
    redirect: {
      permanent: true,
      destination: `/dashboard/${primaryAccount.providerId}`
    },
    props:{}
  }
};
export default function Dashboard({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
}
