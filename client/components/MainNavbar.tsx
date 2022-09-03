import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Link from 'next/link';
import styles from '../styles/MainNavbar.module.css';
import jwt_decode from 'jwt-decode';
import  { useRouter } from "next/router";

const MainNavbar: React.FC = () => {
    const [id, setId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            const jwtToken = localStorage.getItem('token') as string;
            const decoded = jwt_decode(jwtToken);
            const id = (decoded as any)._id;
            setId(id);
        }
    }, [router.asPath]);


    return (
        <Container>
            <Navbar bg='light' variant='light' className={styles.mainNavbar}>
                <Container>
                    <Link href='/'>
                        <Navbar.Brand className={styles.brand}>
                            Nexatom
                        </Navbar.Brand>
                    </Link>
                    <Nav className='ms-auto'>
                        <Link href='/lobby'>
                            <div className={styles.navbarButton}>Lobby</div>
                        </Link>
                        <Link href={`/profile/${id}`}>
                            <div className={styles.navbarButton}>Profile</div>
                        </Link>
                        <Link href='/auth/login'>
                            <div
                                className={`${styles.navbarButton} ${styles.loginButton}`}
                            >
                                Log in
                            </div>
                        </Link>
                        <Link href='/auth/register'>
                            <div
                                className={`${styles.navbarButton} ${styles.loginButton}`}
                            >
                                Get Started
                            </div>
                        </Link>
                    </Nav>
                </Container>
            </Navbar>
        </Container>
    );
};

export default MainNavbar;
