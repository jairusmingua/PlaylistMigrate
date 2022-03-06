import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NextPage } from 'next'
import { AppProps } from 'next/app';
import { Provider, providers } from 'next-auth/client'
import { AuthGuard } from '../components/AuthGuard';
import { Footer } from '../components/Footer';
export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean
}

function MyApp(props: AppProps) {
  const {
    Component,
    pageProps,
  }: { Component: NextApplicationPage; pageProps: any } = props

  return (

    <Provider>
      {Component.requireAuth ? (
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>) : (
        <Component {...pageProps} />
      )}
    </Provider>
  );
}

export default MyApp
