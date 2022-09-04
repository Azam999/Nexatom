import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import styles from '../../styles/Auth.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const LogIn: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const router = useRouter();

    async function handleLogin(e: React.SyntheticEvent) {
        e.preventDefault();
        const res = await axios
            .post('/api/auth/login', {
                email: email?.toLowerCase(),
                password: password,
            })
            .catch((err: any) => console.log(err));

        localStorage.setItem('image', res?.data.user.image);
        if (res?.data.accessToken) {
            localStorage.setItem('token', res.data.accessToken);
            router.push(`/profile/${res.data.user._id}`);
        }
    }

    return (
        <Container>
            <div className={styles.outline}>
                <div style={{ width: '60%' }}>
                    <h2 className={`${styles.title} mb-4`}>Log In</h2>
                    <Form>
                        <Form.Group className='mb-4' controlId='email'>
                            <Form.Label style={{ color: 'grey' }}>
                                Email
                            </Form.Label>
                            <Form.Control
                                type='email'
                                className={styles.formInput}
                                onChange={(
                                    e: React.SyntheticEvent<EventTarget>
                                ) =>
                                    setEmail(
                                        (e.target as HTMLInputElement).value
                                    )
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId='password' className='mb-4'>
                            <Form.Label style={{ color: 'grey' }}>
                                Password
                            </Form.Label>
                            <Form.Control
                                type='password'
                                className={styles.formInput}
                                onChange={(
                                    e: React.SyntheticEvent<EventTarget>
                                ) =>
                                    setPassword(
                                        (e.target as HTMLInputElement).value
                                    )
                                }
                            />
                        </Form.Group>
                        <Button
                            variant='primary'
                            type='submit'
                            className={`${styles.submitButton} shadow-none`}
                            onClick={(
                                e: React.SyntheticEvent<Element, Event>
                            ) => handleLogin(e)}
                        >
                            Log In
                        </Button>
                        <Link href='/auth/register'>
                            <p className={styles.registerLink}>
                                Don&apos;t have an account? Sign up!
                            </p>
                        </Link>
                    </Form>
                </div>
                <div className={styles.nexatomSvg}>
                    <Image
                        src='/nexatom.svg'
                        alt='nexatom logo'
                        width='350'
                        height='350'
                    />
                </div>
            </div>
        </Container>
    );
};

export default LogIn;
