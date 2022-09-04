// @ts-nocheck

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import styles from '../styles/LobbySpace.module.css';
import { Stage, Layer, Text, Image, Group, Rect } from 'react-konva';
import useImage from 'use-image';
import { useChannelMessage, useReadChannelState } from '@onehop/react';

const LobbySpace: React.FC = ({}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [id, setId] = useState<string>('');

    // Get the user's token from local storage and image source
    useEffect(() => {
        if (localStorage.getItem('token')) {
            const jwtToken = localStorage.getItem('token') as string;
            const decoded = jwt_decode(jwtToken);
            setId((decoded as any)._id);
            setImageSrc(localStorage.getItem('image') as string);
        }
    }, []);

    const [atoms, setAtoms] = useState<any[]>([]);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    // useChannelMessage('messages', 'MESSAGE_CREATE', (data) => {
    //     setAtoms([data, ...atoms]);
    //     console.log('atoms',atoms);
    // });

    const { state } = useReadChannelState('atoms');

    useEffect(() => {
        if (atoms.length === 0 && state && state.atoms.length > 0) {
            setAtoms(state.atoms);
        }
    }, [state, atoms]);

    const width = 890;
    const height = 500;

    const imageSize = 225;

    const DefaultUserImage = () => {
        const [image] = useImage('data:image/png;base64,' + imageSrc);

        return <Image image={image} alt='image' />;
    };

    useEffect(() => {
        const submit = async (e) => {
            e.preventDefault();
    
            await fetch('/api/move', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ id, x, y }),
            });
        };

        const keyDownHandler = (e) => {
            if (e.key === 'ArrowUp') {
                setY((old) => old - 10);
                submit(e);
            } else if (e.key === 'ArrowDown') {
                setY((old) => old + 10);
                submit(e);
            } else if (e.key === 'ArrowLeft') {
                setX((old) => old - 10);
                submit(e);
            } else if (e.key === 'ArrowRight') {
                setX((old) => old + 10);
                submit(e);
            }
        };
        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [id, x, y]);

    return (
        <Stage width={width} height={height}>
            <Layer>
                {/* <Rect
                    x={100}
                    y={100}
                    width={100}
                    height={50}
                    fill={'green'}
                    cornerRadius={10}
                    draggable
                ></Rect> */}

                <Group
                    clipFunc={function (ctx) {
                        ctx.arc(
                            imageSize / 2,
                            imageSize / 2,
                            100,
                            0,
                            Math.PI * 2,
                            false
                        );
                    }}
                    //draggable
                    scaleX={0.3}
                    scaleY={0.3}
                    x={x}
                    y={y}
                >
                    <DefaultUserImage />
                </Group>
            </Layer>
        </Stage>
    );
};

export default LobbySpace;
