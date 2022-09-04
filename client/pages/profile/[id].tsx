import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import styles from '../../styles/Profile.module.css';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';

const MyProfile: React.FC = ({}) => {
    const router = useRouter();

    interface stackOverflowBadges {
        1: string;
        2: string;
        3: string;
    }

    const [badges, setBadges] = useState<stackOverflowBadges>({
        1: '',
        2: '',
        3: '',
    });

    const [languages, setLanguages] = useState<string[]>([]);

    // const [soTags, setSoTags] = useState<Array<Object>>([]);

    const [user, setUser] = useState({
        _id: '',
        name: '',
        email: '',
        image: '',
        githubUsername: '',
        stackoverflowUrl: '',
        experience: '',
        languages: [],
        timezone: '',
        majors: [],
        bonds: [],
    });

    useEffect(() => {
        if (!router.isReady) return;

        const id = router.query.id as string;

        async function getUser() {
            await axios
                .get(`/api/users/${id}`)
                .then((res) => {
                    setUser(res.data);
                    console.log(res.data);

                    const badgeUrl = `https://nexatom-us.herokuapp.com/api/stackoverflow/getBadges?userurl=${res.data.stackoverflowUrl}`;

                    axios
                        .get(badgeUrl)
                        .then((badgeRes) => {
                            setBadges(badgeRes.data);
                            const tagsUrl = `https://nexatom-us.herokuapp.com/api/stackoverflow/getBadges?userurl=${res.data.stackoverflowUrl}`;

                            // axios.get(tagsUrl).then((tagsRes) => {
                            //     setSoTags(tagsRes.data);
                            //     console.log(tagsRes.data)
                            // });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        getUser();
    }, [router.isReady, router.query.id]);

    return (
        <Container className={styles.container}>
            <div className={styles.profileHeader}>
                <Image
                    className={styles.profileImage}
                    src={`data:image/png;base64,${user.image}`}
                    alt='profile image'
                    width={200}
                    height={200}
                />
                <div className={styles.profileText}>
                    <h2>{user.name}</h2>
                </div>
            </div>
            <hr />
            <div className='d-flex flex-row justify-content-between'>
                <div className={styles.stackOverflowInformation}>
                    <h3>Stack Overflow</h3>
                    <p>Badges</p>
                    <div className={styles.badges}>
                        <div
                            className={styles.badge}
                            style={{ backgroundColor: '#FFD700' }}
                        >
                            {badges['1'] ? badges['1'] : 0}
                        </div>
                        <div
                            className={styles.badge}
                            style={{ backgroundColor: '#C0C0C0' }}
                        >
                            {badges['2'] ? badges['2'] : 0}
                        </div>
                        <div
                            className={styles.badge}
                            style={{ backgroundColor: '#CD7F32' }}
                        >
                            {badges['3'] ? badges['3'] : 0}
                        </div>
                    </div>
                    {/* <p>Tags</p>
                    <div className={styles.tags}>
                        {soTags.length > 0 ? soTags.map((tag: any) => (
                            <div key={tag.name} className={styles.tag}>{tag}</div>
                        )) : null}
                    </div> */}
                </div>
                <div className={styles.stackOverflowInformation}>
                    <h3>Quick Info</h3>
                    <p>Top 3 Languages</p>
                    <div className={styles.badges}>
                        <div
                            className={styles.languageBadge}
                            style={{ backgroundColor: '#f14d4d' }}
                        >
                            {user.languages.length > 0
                                ? Object.keys(user.languages[0])[0]
                                : 'Loading'}
                        </div>
                        <div
                            className={styles.languageBadge}
                            style={{ backgroundColor: '#76ffa1' }}
                        >
                            {user.languages.length > 0
                                ? Object.keys(user.languages[1])[0]
                                : 'Loading'}
                        </div>
                        <div
                            className={styles.languageBadge}
                            style={{ backgroundColor: '#3683ff' }}
                        >
                            {user.languages.length > 0
                                ? Object.keys(user.languages[2])[0]
                                : 'Loading'}
                        </div>
                    </div>
                    <br />
                    <p style={{ fontSize: 20 }}>
                        Has been coding for{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {user.experience} years
                        </span>
                    </p>
                    <br />
                    <p style={{ fontSize: 20 }}>
                        Lives in{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {user.timezone}
                        </span>
                    </p>
                </div>
            </div>
            <h1>Bonds</h1>
            {user.bonds.map((bond: any) => (
                <span key={bond} className={styles.bondItem}>
                    <a
                        href={`http://localhost:3000/profile/${bond}`}
                        target='_blank'
                        rel='noreferrer'
                    >
                        View Bond
                    </a>
                </span>
            ))}
            <br />
            <br />
        </Container>
    );
};

export default MyProfile;
