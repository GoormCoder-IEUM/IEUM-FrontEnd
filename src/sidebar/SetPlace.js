import React, { useRef, useState, useEffect } from "react";
import { axiosInstance } from '../axiosinstance/Axiosinstance';
import { Client as StompClient } from '@stomp/stompjs';
import "../style/SetPlace.css";

const SetPlace = ({ selectedDates, krName, planId, selectedPlace }) => {
    const [places, setPlaces] = useState([]);
    const [placeName, setPlaceName] = useState('');
    const [address, setAddress] = useState('');
    const [categoryId, setCategoryId] = useState(1);
    const [hasFetchedPlaces, setHasFetchedPlaces] = useState(false);

    const stompClient = useRef(null);
    const [wsConnected, setWsConnected] = useState(false);
    const [wsError, setWsError] = useState(false);
    const [sharedPlace, setSharedPlace] = useState([]);
    const [showWsError, setShowWsError] = useState('');
    const [memberUUID, setMemberUUID] = useState('');

    useEffect(() => {
        setPlaceName(selectedPlace.name);
        setAddress(selectedPlace.address);
    }, [selectedPlace]);

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axiosInstance.get(`/plans/${planId}/places`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setPlaces(response.data);
                setHasFetchedPlaces(true);

                console.log("장소 리스트", response);
            } catch (error) {
                console.error("요청 중 오류 발생:", error);
            }
        };

        if (!hasFetchedPlaces) {
            fetchPlaces();
        }
    }, [hasFetchedPlaces, planId]);

    const handleAddPlaceClick = async () => {
        try {
            const response = await axiosInstance.post(`/plans/${planId}/places`, {
                placeName: placeName,
                address: address,
                categoryId: categoryId,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("Add place response:", response.data);
            setHasFetchedPlaces(false);
        } catch (error) {
            console.error("요청 중 오류 발생:", error);
        }
    };

    const wsConnect = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error('Token is required to connect');
            return;
        }

        // 토큰 유효성 확인 함수 (예: 만료 시간을 확인)
        const isTokenExpired = (token) => {
            console.log("토큰 유효성 확인: ", token);
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.exp * 1000 < Date.now();
            } catch (error) {
                console.error('Invalid token format');
                return true;
            }
        };

        // WebSocket 연결 설정
        let currentToken = token;

        if (isTokenExpired(token)) {
            console.log('Token expired or missing, cannot connect to WebSocket.');
            return;
        }

        // 유효한 토큰으로 WebSocket 연결
        stompClient.current = new StompClient({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                Authorization: `Bearer ${currentToken}`
            },
            onConnect: () => {
                console.log('Connected to WebSocket');
                setWsConnected(true);

                stompClient.current.subscribe(`/sub/plans/errors`, (errMessage) => {
                    const receivedErrMessage = errMessage.body;
                    console.log("웹소켓 에러응답:", receivedErrMessage);
                    setWsError(receivedErrMessage);
                });

                if (planId) {
                    const subscription = stompClient.current.subscribe(`/sub/plans/${planId}`, (message) => {
                        const receivedMessage = JSON.parse(message.body);
                        console.log("웹소켓 응답:", receivedMessage);
                        setSharedPlace((prevMessages) => [...prevMessages, receivedMessage]);
                    });

                    return () => {
                        if (subscription) {
                            subscription.unsubscribe();
                        }
                    };
                }
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                setWsConnected(false);
            },
            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
                setWsConnected(false);

                setTimeout(async () => {
                    await wsConnect();
                }, 5000);
            },
        });

        stompClient.current.activate();
    };

    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.deactivate();
        }
    };

    const publishMessage = (placeId) => {
        if (stompClient.current && wsConnected) {
            const destination = '/pub/share-place';
            const body = JSON.stringify({
                'planId': planId,
                'placeId': placeId
            });

            stompClient.current.publish({
                destination: destination,
                body: body
            });

        } else {
            console.error('Not connected to WebSocket');
        }
    };

    useEffect(() => {
        const parsedWsError = JSON.parse(wsError)
        if (parsedWsError.planId === planId && parsedWsError.memberId === memberUUID) {
            setShowWsError(parsedWsError.errorMessage);

            setTimeout(() => {
                setShowWsError('');
            }, 3000);

            setTimeout(() => {
                document.querySelector('.custom-modal-message').classList.add('fade-out');
            }, 2500);
        }
    }, [wsError, planId, memberUUID]);

    useEffect(() => {
        const fetchSharedPlaces = async () => {
            try {
                const response = await axiosInstance.get(`/plans/${planId}/places/shared`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setSharedPlace(response.data);
                console.log("Shared places response:", response.data);
            } catch (error) {
                console.error("요청 중 오류 발생:", error);
            }
        };

        fetchSharedPlaces();
        wsConnect();

        return () => {
            disconnect();
        };
    }, [planId]);

    useEffect(() => {
        const saveMemberId = async () => {
            try {
                const response = await axiosInstance.get(`/my-page`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                console.log("마이페이지api 사용자 정보 : ", response.data);
                console.log("마이페이지api 사용자 정보2 : ",response.data.id);
                setMemberUUID(response.data.id);
            } catch (error) {
                console.error("요청 중 오류 발생:", error);
            }
        }
        saveMemberId();
    }, []);

    useEffect(() => {
        console.log("업데이트된 사용자ID : ", memberUUID);
    }, [memberUUID]);

    return (
        <div className="step2-container">
            <div className="place-container">
                <h2>여행 지역 : {krName} </h2>
                {selectedDates && <p>선택된 날짜: {selectedDates}</p>}
                <div className={`custom-modal-message ${showWsError ? 'show' : ''}`}>
                    {showWsError}
                </div>
                <div className="places-list">
                    {places.map((place) => (
                        <div key={place.id} className="place-item-container">
                            <div className="place-item">
                                <h3>{place.placeName}</h3>
                                <p>{place.address}</p>
                            </div>
                            <button className="share-btn" onClick={() => publishMessage(place.id)}>공유</button>
                        </div>
                    ))}
                </div>
    
                <div className="add-place-form">
                    <input
                        type="text"
                        placeholder="Place Name"
                        value={placeName}
                        onChange={(e) => setPlaceName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                    >
                        <option value={1}>명소</option>
                        <option value={2}>식당/카페</option>
                        <option value={3}>숙소</option>
                    </select>
                    <button className="add-btn" onClick={handleAddPlaceClick}>추가</button>
                </div>
            </div>
            <div className="selected-places">
                <h2>친구와 공유중인 장소</h2>
                <ul>
                    {sharedPlace.map((msg, index) => (
                        <li key={index} className="selected-place-item">
                            <h3>{msg.placeName}</h3>
                            <p>{msg.address}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
    
};

export default SetPlace;
