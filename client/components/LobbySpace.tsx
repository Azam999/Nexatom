// @ts-nocheck

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import styles from '../styles/LobbySpace.module.css';
import { Stage, Layer, Text, Image, Group } from 'react-konva';
import useImage from 'use-image';
import io from 'Socket.IO-client';
let socket;

const LobbySpace: React.FC = ({}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const router = useRouter();

    // Get the user's token from local storage and image source
    useEffect(() => {
        if (localStorage.getItem('token')) {
            const jwtToken = localStorage.getItem('token') as string;
            const decoded = jwt_decode(jwtToken);
            const id = (decoded as any)._id;

            axios
                .get(`/api/users/${id}`)
                .then((res) => {
                    setImageSrc(res.data.image);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [router.asPath]);

    // Socket.io websockets
    useEffect(() => {
        const socketInitializer = async () => {
            await fetch('/api/socket');
            socket = io();

            socket.on('connect', () => {
                console.log('connected');
            });

            socket.on('update-atom', (coordinates) => {
                setX(coordinates.x);
                setY(coordinates.y);
            });
        };

        socketInitializer();
    }, []);

    // Konva canvas
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const imageSize = 225;

    const UserImage = () => {
        const [image] = useImage('data:image/png;base64,' + imageSrc);

        return <Image image={image} alt='image' />;
    };

    // const UserGroup = (props) => {
    //     return (
    //         <Group
    //             clipFunc={function (ctx) {
    //                 ctx.arc(
    //                     imageSize / 2,
    //                     imageSize / 2,
    //                     100,
    //                     0,
    //                     Math.PI * 2,
    //                     false
    //                 );
    //             }}
    //             draggable
    //             scaleX={0.3}
    //             scaleY={0.3}
    //             x={x}
    //             y={y}
    //             onDragMove={(e) => {
    //                 socket.emit('atom-moved', {
    //                     x: e.target.x(),
    //                     y: e.target.y(),
    //                 });
    //             }}
    //         >
    //             {props.children}
    //         </Group>
    //     );
    // };

    {/*
    
    */}

    return (
        <Stage width={1000} height={1000}>
            <Layer>
                {/* <UserGroup>
                    <UserImage />
                </UserGroup> */}

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
                    draggable
                    scaleX={0.3}
                    scaleY={0.3}
                    x={x}
                    y={y}
                    onDragMove={(e) => {
                        console.log(e.target.x(), e.target.y());
                        socket.emit('atom-moved', {
                            x: e.target.x(),
                            y: e.target.y(),
                        });
                    }}
                >
                    <UserImage />
                </Group>
            </Layer>
        </Stage>
    );

    // const canvasRef = useRef(null);

    // const drawCircleImage = (ctx) => {
    //     const size = 50;

    //     let moveX = 100;
    //     let moveY = 0;
    //     var image = new Image();
    //     image.onload = function () {
    //         ctx.save();
    //         ctx.beginPath();
    //         ctx.arc(
    //             size / 2 + moveX,
    //             size / 2 + moveY,
    //             size / 2,
    //             0,
    //             Math.PI * 2,
    //             true
    //         );
    //         ctx.closePath();
    //         ctx.clip();

    //         ctx.drawImage(image, moveX, moveY, size, size);

    //         ctx.beginPath();
    //         ctx.arc(moveX, moveY, size / 2, 0, Math.PI * 2, true);
    //         ctx.clip();
    //         ctx.closePath();
    //         ctx.restore();
    //     };
    //     image.src = 'data:image/png;base64,' + imageSrc;
    //     image.className = styles.circleImage;
    // };

    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     const context = canvas?.getContext('2d');
    //     drawCircleImage(context);
    // });

    // return <canvas ref={canvasRef} width={400} height={400}></canvas>;
};

export default LobbySpace;
