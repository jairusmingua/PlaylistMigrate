
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next'
import { getSession, getProviders } from 'next-auth/client'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient, User, Account } from "@prisma/client"
import { getUser } from '../../repositories/UserRepository'
const prisma = new PrismaClient()

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const user = await getUser(req, res)
    if(!user){
        return {
            redirect: {
                permanent: true,
                destination: '/login'
            }
        }
    }
    const account = await prisma.account.update({
        where: {
            id: user.accounts[0].id
        },
        data: {
            primary: true
        }
    })
    return {
        redirect: {
            permanent: true,
            destination: '/dashboard'
        }
    }

}
function NewUser({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
}

export default NewUser