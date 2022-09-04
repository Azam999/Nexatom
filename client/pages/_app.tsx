import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainNavbar from '../components/MainNavbar';
import { useEffect } from "react";
import { project } from "../config";
import { hop } from "@onehop/client";

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		hop.init({
			projectId: project,
		});
	}, []);

    return (
        <>
            <MainNavbar />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;