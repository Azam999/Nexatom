import React from 'react';
import { Container, Button } from 'react-bootstrap';
import styles from '../styles/Lobby.module.css';
import Link from 'next/link';
// import LobbySpace from '../components/LobbySpace';
import dynamic from 'next/dynamic';
const LobbySpace = dynamic(() => import("../components/LobbySpace"), {
    ssr: false,
});
import jwt_decode from 'jwt-decode';

const deleteUser = async (e: any) => {
    const jwtToken = localStorage.getItem('token') as string;
    const decoded = jwt_decode(jwtToken);
    const id = (decoded as any)._id;

    e.preventDefault();

    await fetch('/api/delete', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ id }),
    });
};

function logOut(e: any) {
    deleteUser(e);

    localStorage.removeItem('token');
    localStorage.removeItem('image');
}


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
            <Button variant="primary" onClick={(e) => logOut(e)}>
                Log out
            </Button>
        </Container>
    );
};

export default Lobby;