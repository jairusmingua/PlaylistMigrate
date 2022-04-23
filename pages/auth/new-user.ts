
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getUser } from '../../repositories/UserRepository'
import { prisma } from '../../db/prisma'

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