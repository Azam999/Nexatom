import React from 'react';
import { Container, Button } from 'react-bootstrap';
import styles from '../styles/Lobby.module.css';
import Link from 'next/link';
// import LobbySpace from '../components/LobbySpace';
import dynamic from 'next/dynamic';
const LobbySpace = dynamic(() => import("../components/LobbySpace"), {
    ssr: false,
});


const Lobby: React.FC = ({}) => {
    return (
        <Container>
            <div className={styles.portal}>
                <h3>Portal</h3>
                <p>Select which Atom Realm you would like to enter</p>
                <div className={styles.buttonWrapper}>
                    <Link href="/atom-realm/web-development">
                        <div className={styles.atomRealmButton}>Website Development</div>
                    </Link>
                    <Link href="/atom-realm/app-development">
                        <div className={styles.atomRealmButton}>App Development</div>
                    </Link>
                    <Link href="/atom-realm/ml">
                        <div className={styles.atomRealmButton}>Machine Learning</div>
                    </Link>
                    <Link href="/atom-realm/desktop-applications">
                        <div className={styles.atomRealmButton}>Desktop Applications</div>
                    </Link>
                    <Link href="/atom-realm/find-cofounder">
                        <div className={styles.atomRealmButton}>Find Co-founder</div>
                    </Link>
                </div>
            </div>
            <div className={styles.lobby}>
                <h3>Lobby</h3>
                {/* <div className={styles.lobbySpace}> */}
                    <LobbySpace/>
                {/* </div> */}
            </div>
        </Container>
    );
};

export default Lobby;