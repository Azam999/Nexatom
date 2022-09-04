// @ts-nocheck

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import styles from '../../styles/LobbySpace.module.css';
import { Stage, Layer, Image, Group, Label, Shape } from 'react-konva';
import useImage from 'use-image';
import { useChannelMessage, useReadChannelState } from '@onehop/react';
import { Modal, Button } from 'react-bootstrap';

const LobbySpace: React.FC = ({}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [id, setId] = useState<string>('');

    // Modal stuff
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [recommendations, setRecommendations] = useState<string[]>([]);

    const width = 890;
    const height = 500;

    const realm = 'ml';

    const [atoms, setAtoms] = useState<any[]>([]);
    const [x, setX] = useState(width / 2);
    const [y, setY] = useState(height / 2);
    const [smallIdx, setsmallIdx] = useState<int>(x);
    const [smallIdy, setsmallIdy] = useState<int>(y);
    const [smallid, smallsetId] = useState<string>('');

    // Get the user's token from local storage and image source
    useEffect(() => {
        if (localStorage.getItem('token')) {
            const jwtToken = localStorage.getItem('token') as string;
            const decoded = jwt_decode(jwtToken);
            const fetchedId = (decoded as any)._id;
            setId(fetchedId);
            setImageSrc(localStorage.getItem('image') as string);

            axios
                .get(
                    'https://nexatom-us.herokuapp.com/api/algo/rec?id1=' +
                        fetchedId +
                        '&id2=' +
                        smallid
                )
                .then((res) => {
                    setRecommendations(res.data.ids);
                });
        }
    }, []);

    useChannelMessage('messages', 'MESSAGE_CREATE', (data) => {
        setAtoms([data, ...atoms]);
        // console.log('atoms',atoms);
    });

    const { state } = useReadChannelState('messages');

    useEffect(() => {
        if (atoms.length === 0 && state && state.atoms.length > 0) {
            setAtoms(state.atoms);
        }
    }, [state, atoms]);

    const imageSize = 225;

    const DefaultUserImage = () => {
        const [image] = useImage('data:image/png;base64,' + imageSrc);

        return <Image image={image} alt='image' />;
    };

    const OtherUserImage = () => {
        const [image] = useImage('/yellow.jpeg');

        return <Image image={image} alt='image' />;
    };

    function getDis() {
        var smallDis = 100000;
        var smallIdxx = 1000;
        var smallIdyy = 1000;
        var smallidd = '';
        state?.atoms?.map((atom, index) => {
            if (atom.id != id) {
                const dis = Math.sqrt(
                    (x - atom.x) * (x - atom.x) + (y - atom.y) * (y - atom.y)
                );
                if (dis < 70 && smallDis > dis) {
                    smallIdxx = atom.x;
                    smallIdyy = atom.y;
                    smallDis = dis;
                    smallidd = atom.id;
                }
            }
        });
        if (smallDis > 70) {
            smallIdxx = 1000;
            smallIdyy = 1000;
        }
        smallsetId(smallidd);
        setsmallIdx(smallIdxx);
        setsmallIdy(smallIdyy);
        return [smallDis];
    }

    useEffect(() => {
        const timerID = setInterval(function () {
            const info = getDis();
            const smallDis = info[0];
            console.log(smallDis, smallIdx, smallIdy, smallid, x, y);
        }, 1000);

        const submit = async (e) => {
            e.preventDefault();

            await fetch('/api/move', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ id, x, y, realm }),
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

        console.log(state);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            clearTimeout(timerID);
        };
    }, [id, x, y]);

    async function createBond() {
        await axios
            .patch(`/api/users/${id}?bond=${smallid}`)
            .catch((err) => console.log(err));
        await axios
            .patch(`/api/users/${smallid}?bond=${id}`)
            .catch((err) => console.log(err));
    }

    function AtomModal() {
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Bond with other atom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button
                        variant='primary'
                        onClick={() =>
                            window.open(
                                `http://localhost:3000/profile/${smallid}`,
                                '_blank'
                            )
                        }
                        style={{ width: '100%', marginBottom: '20px' }}
                    >
                        View Atom
                    </Button>
                    <br />
                    <ol>
                        {recommendations.map((recommendedId) => (
                            <li key={recommendedId}>
                                <a
                                    href={`http://localhost:3000/profile/${recommendedId}`}
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    View Recommendation
                                </a>
                            </li>
                        ))}
                    </ol>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={createBond}>
                        Bond
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <>
            <Stage width={width} height={height}>
                <Layer>
                    <Shape
                        x={10}
                        y={10}
                        //fill={'#000000'}
                        stroke={'black'}
                        sceneFunc={function (context, shape) {
                            context.beginPath();
                            context.arc(
                                smallIdx,
                                smallIdy,
                                50,
                                0,
                                Math.PI * 2,
                                false
                            );
                            // (!) Konva specific method, it is very important
                            context.fillStrokeShape(shape);
                        }}
                    ></Shape>

                    {state?.atoms?.length > 0 ? (
                        state.atoms.map((atom) =>
                            atom.realm == realm ? (
                                <Label
                                    key={atom.id}
                                    // x={x}
                                    // y={y}
                                    // onMouseEnter={this.onMouseEnterHandler}
                                    // onMouseLeave={this.onMouseLeaveHandler}
                                    onClick={(e) =>
                                        atom.id == smallid
                                            ? handleShow()
                                            : window.open(
                                                  `http://localhost:3000/profile/${atom.id}`,
                                                  '_blank'
                                              )
                                    }
                                    // className={this.state.zoom ? 'zoom' : ''}
                                >
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
                                        scaleX={0.3}
                                        scaleY={0.3}
                                        x={atom.x}
                                        y={atom.y}
                                    >
                                        {atom.id == id ? (
                                            <DefaultUserImage />
                                        ) : (
                                            // <DefaultUserImage />
                                            <OtherUserImage />
                                        )}
                                    </Group>
                                </Label>
                            ) : (
                                <Group></Group>
                            )
                        )
                    ) : (
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
                            scaleX={0.3}
                            scaleY={0.3}
                            x={x}
                            y={y}
                        >
                            <DefaultUserImage />
                        </Group>
                    )}
                </Layer>
            </Stage>
            <AtomModal />
        </>
    );
};

export default LobbySpace;
