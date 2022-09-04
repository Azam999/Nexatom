//@ts-nocheck
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import DesignedButton from '../components/DesignedButton';
import InformationSection from '../components/InformationSection';
import dynamic from 'next/dynamic';
const TypeWriterEffect = dynamic(() => import('react-typewriter-effect'), {
    ssr: false,
});

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Nexatom</title>
                <meta name='description' content='Nexatom' />
                <link rel='icon' href='/logo.svg' />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    <TypeWriterEffect
                        startDelay={300}
                        cursorColor='#3F3D56'
                        multiText={[
                            'Develop with collaborators',
                            'Find your next co-founder',
                            'Bond with new people',
                        ]}
                        multiTextDelay={1000}
                        typeSpeed={100}
                    />
                </h1>

                <p className={styles.description}>Nexatom</p>

                <Link href='/auth/register' passHref>
                    <div className='mb-5'>
                        <DesignedButton text='Get Started!' />
                    </div>
                </Link>

                <InformationSection
                    title='Interact with other developers'
                    description='With hop and channels, we are able to create a real-time system that allows you to interact with other developers.'
                    image='/interaction.png'
                    toRight={true}
                />
                <InformationSection
                    title='Establish new bonds'
                    description='With our custom unsupervised machine learning algorithm, we form atomic-recommendations after a bond between two atoms is formed'
                    image='/bond.png'
                    toRight={false}
                />
            </main>
        </div>
    );
};

export default Home;
