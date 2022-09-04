import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Dropdown } from 'react-bootstrap';
import styles from '../../styles/Auth.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const LogIn: React.FC = () => {
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [githubUsername, setGithubUsername] = useState<string | null>(null);
    const [stackoverflowUrl, setStackoverflowUrl] = useState<string | null>(
        null
    );
    const [experience, setExperience] = useState<string | null>(null);
    const [timezone, setTimezone] = useState<string | null>(null);
    const [languages, setLanguages] = useState<string[]>([]);
    const [majors, setMajors] = useState<string[]>([]);

    const [image, setImage] = useState({
        code: '',
        image: '',
    });

    const router = useRouter();

    function handleRegister(e: React.SyntheticEvent) {
        e.preventDefault();

        const imageUrl = `https://nexatom-us.herokuapp.com/api/github/pfp?username=${githubUsername}`;
        const langsUrl = `https://nexatom-us.herokuapp.com/api/github/langs?username=${githubUsername}`;

        axios
            .get(imageUrl)
            .then(async (imageRes) => {
                axios
                    .get(langsUrl)
                    .then(async (langsRes) => {
                        setLanguages(langsRes.data);
                        const payload = {
                            name: name,
                            email: email?.toLowerCase(),
                            password: password,
                            githubUsername: githubUsername,
                            stackoverflowUrl: stackoverflowUrl,
                            image: imageRes.data.image,
                            experience: experience,
                            timezone: timezone,
                            languages: (langsRes.data as any).slice(0,3),
                            majors: majors,
                        };

                        console.log(payload);

                        const res = await axios
                            .post('/api/auth/register', payload)
                            .then(async (userRes) => {
                                localStorage.setItem('image', imageRes.data.image);


                                localStorage.setItem('token', userRes.data.accessToken);
                                router.push(`/profile/${userRes.data.user._id}`);
                                
                                await axios.get(
                                    `https://nexatom-us.herokuapp.com/api/algo/storeData?exp=${experience}&tz=${timezones[timezone!]}&lang1=${JSON.stringify(langsRes.data[0])}&lang2=${JSON.stringify(langsRes.data[1])}&lang3=${JSON.stringify(langsRes.data[2])}&majors=${JSON.stringify(majors)}&id=${userRes.data.user._id}`
                                );
                            })
                            .catch((err: any) => console.log(err));

                        
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    let timezones: any = {};
    timezones['(GMT -12:00) Eniwetok, Kwajalein'] = 'GMT-12';
    timezones['(GMT -11:00) Midway Island, Samoa'] = 'GMT-11';
    timezones['(GMT -10:00) Hawaii'] = 'GMT-10';
    timezones['(GMT -9:00) Alaska'] = 'GMT-9';
    timezones['(GMT -8:00) Pacific Time (US & Canada)'] = 'GMT-8';
    timezones['(GMT -7:00) Mountain Time (US & Canada)'] = 'GMT-7';
    timezones['(GMT -6:00) Central Time (US & Canada), Mexico City'] = 'GMT-6';
    timezones['(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima'] = 'GMT-5';
    timezones['(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz'] = 'GMT-4';
    timezones['(GMT -3:30) Newfoundland'] = 'GMT-3.5';
    timezones['(GMT -3:00) Brazil, Buenos Aires, Georgetown'] = 'GMT-3';
    timezones['(GMT -2:00) Mid-Atlantic'] = 'GMT-2';
    timezones['(GMT -1:00 hour) Azores, Cape Verde Islands'] = 'GMT-1';
    timezones['(GMT) Western Europe Time, London, Lisbon, Casablanca'] = 'GMT0';
    timezones['(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris'] = 'GMT1';
    timezones['(GMT +2:00) Kaliningrad, South Africa'] = 'GMT2';
    timezones['(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg'] = 'GMT3';
    timezones['(GMT +3:30) Tehran'] = 'GMT3.5';
    timezones['(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi'] = 'GMT4';
    timezones['(GMT +4:30) Kabul'] = 'GMT4.5';
    timezones['(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent'] =
        'GMT5';
    timezones['(GMT +5:30) Bombay, Calcutta, Madras, New Delhi'] = 'GMT5.5';
    timezones['(GMT +6:00) Almaty, Dhaka, Colombo'] = 'GMT6';
    timezones['(GMT +7:00) Bangkok, Hanoi, Jakarta'] = 'GMT7';
    timezones['(GMT +8:00) Beijing, Perth, Singapore, Hong Kong'] = 'GMT8';
    timezones['(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk'] = 'GMT9';
    timezones['(GMT +9:30) Adelaide, Darwin'] = 'GMT9.5';
    timezones['(GMT +10:00) Eastern Australia, Guam, Vladivostok'] = 'GMT10';
    timezones['(GMT +11:00) Magadan, Solomon Islands, New Caledonia'] = 'GMT11';
    timezones['(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka'] = 'GMT12';

    const timezonesList = [...Object.keys(timezones)];

    return (
        <Container>
            <div className={styles.outline}>
                <div style={{ width: '60%' }}>
                    <h2 className={`${styles.title} mb-4`}>Create Your Atom</h2>
                    <Form>
                        <Form.Group controlId='name' className='mb-4'>
                            <Form.Label style={{ color: 'grey' }}>
                                Name
                            </Form.Label>
                            <Form.Control
                                type='text'
                                className={styles.formInput}
                                onChange={(
                                    e: React.SyntheticEvent<EventTarget>
                                ) =>
                                    setName(
                                        (e.target as HTMLInputElement).value
                                    )
                                }
                            />
                        </Form.Group>
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
                        <Form.Group
                            controlId='GitHub username'
                            className='mb-4'
                        >
                            <Form.Label style={{ color: 'grey' }}>
                                GitHub Username
                            </Form.Label>
                            <Form.Control
                                type='text'
                                className={styles.formInput}
                                onChange={(
                                    e: React.SyntheticEvent<EventTarget>
                                ) =>
                                    setGithubUsername(
                                        (e.target as HTMLInputElement).value
                                    )
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId='Stack Overflow' className='mb-4'>
                            <Form.Label style={{ color: 'grey' }}>
                                Stack Overflow URL
                            </Form.Label>
                            <Form.Control
                                type='text'
                                className={styles.formInput}
                                onChange={(
                                    e: React.SyntheticEvent<EventTarget>
                                ) =>
                                    setStackoverflowUrl(
                                        (e.target as HTMLInputElement).value
                                    )
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId='Experience' className='mb-4'>
                            <Form.Label style={{ color: 'grey' }}>
                                Experience (Years)
                            </Form.Label>
                            <Form.Control
                                type='text'
                                className={styles.formInput}
                                onChange={(
                                    e: React.SyntheticEvent<EventTarget>
                                ) =>
                                    setExperience(
                                        (e.target as HTMLInputElement).value
                                    )
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId='Majors' className='mb-4'>
                            <Form.Label style={{ color: 'grey' }}>
                                Majors (separate with commas)
                            </Form.Label>
                            <Form.Control
                                type='text'
                                className={styles.formInput}
                                onChange={(
                                    e: React.SyntheticEvent<EventTarget>
                                ) => {
                                    const majorsList = (
                                        e.target as HTMLInputElement
                                    ).value.split(',');
                                    setMajors(majorsList);
                                }}
                            />
                        </Form.Group>
                        <Form.Group controlId='Timezone' className='mb-4'>
                            <Form.Label style={{ color: 'grey' }}>
                                Timezone
                            </Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant='success'
                                    id='dropdown-autoclose-true'
                                >
                                    {timezone ? timezone : 'Select Timezone'}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {timezonesList.map((selection: string) => {
                                        return (
                                            <Dropdown.Item
                                                key={selection}
                                                onClick={() => {
                                                    setTimezone(selection);
                                                }}
                                            >
                                                {selection}
                                            </Dropdown.Item>
                                        );
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                        <Button
                            variant='primary'
                            type='submit'
                            className={`${styles.submitButton} shadow-none`}
                            onClick={(
                                e: React.SyntheticEvent<Element, Event>
                            ) => handleRegister(e)}
                        >
                            Create Atom
                        </Button>
                        <Link href='/auth/register'>
                            <p className={styles.registerLink}>
                                Already have an account? Log in!
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
