import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { Session } from 'next-auth'
import { AppProps } from 'next/app';
import { Spinner } from 'react-bootstrap';
export function AuthGuard({ children }: { children: JSX.Element }) {
  const router = useRouter()
  const [session, loading] = useSession()
  useEffect(() => {
    if (!loading) {
      if (!session) {
        // redirect
        router.push("/login")
      }
    }
  }, [session, loading])
  if (loading) {
    return <div className="d-flex justify-content-center h-100 w-100">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  }
  // if auth initialized with a valid user show protected page
  if (!loading && session) {
    return <>{children}</>
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null
}

