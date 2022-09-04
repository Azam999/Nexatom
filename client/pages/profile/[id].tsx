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
                    <p>
                        Languages:{' '}
                        {`${user.languages.length > 0 ? Object.keys(user.languages[0])[0] : 'Loading'}, ${user.languages.length > 0 ? Object.keys(user.languages[1])[0] : 'Loading'}, ${user.languages.length > 0 ? Object.keys(user.languages[2])[0] : 'Loading'}`}
                    </p>
                </div>
            </div>
            <hr />
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
            </div>
        </Container>
    );
};

export default MyProfile;
