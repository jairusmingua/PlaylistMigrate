import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {AppProps} from 'next/app';
import { OAuthType, TokenType } from '../services/types';
function MyApp({ Component, pageProps }:AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
export function storeToken(token:OAuthType){
  window.localStorage.setItem(`${token.auth_type}_access_token`,token.access_token.toString());
  if(token.refresh_token){
    window.localStorage.setItem(`${token.auth_type}_refresh_token`,token.refresh_token.toString());
  }
  window.localStorage.setItem(`${token.auth_type}_token_type`,token.token_type.toString());
  window.localStorage.setItem(`${token.auth_type}_scope`,token.scope.toString());
  window.localStorage.setItem(`${token.auth_type}_expires_in`,token.expires_in.toString());
}

export function clearToken(app_type:string){
  window.localStorage.removeItem(`${app_type}_access_token`);
  window.localStorage.removeItem(`${app_type}_refresh_token`);
  window.localStorage.removeItem(`${app_type}_token_type`);
  window.localStorage.removeItem(`${app_type}_scope`);
  window.localStorage.removeItem(`${app_type}_expires_in`);
}
