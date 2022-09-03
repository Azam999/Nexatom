import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainNavbar from '../components/MainNavbar';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <MainNavbar />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;