import React, { useRef, useState, useEffect } from "react";
import { axiosInstance } from '../axiosinstance/Axiosinstance';
import { Client as StompClient } from '@stomp/stompjs';
import "../style/SetPlace.css";
import AOS from "aos";

const SetPlace = ({ selectedDates, krName, planId, selectedPlace }) => {
    const [places, setPlaces] = useState([]);
    const [placeName, setPlaceName] = useState('');
    const [address, setAddress] = useState('');
    const [categoryId, setCategoryId] = useState(1);
    const [isInfoVisible, setIsInfoVisible] = useState(true);
    const [hasFetchedPlaces, setHasFetchedPlaces] = useState(false);
    const placeItemRefs = useRef([]);

    const stompClient = useRef(null);
    const [wsConnected, setWsConnected] = useState(false);
    const [wsError, setWsError] = useState(false);
    const [sharedPlace, setSharedPlace] = useState([]);
    const [showWsError, setShowWsError] = useState('');
    const [memberUUID, setMemberUUID] = useState('');

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                    } else {
                        entry.target.classList.remove('aos-animate');
                    }
                });
            },
            { root: document.querySelector('.place-item-wrap'), threshold: 0.1 }
        );

        placeItemRefs.current.forEach(item => {
            if (item) observer.observe(item);
        });

        return () => {
            placeItemRefs.current.forEach(item => {
                if (item) observer.unobserve(item);
            });
        };
    }, [places]);

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

        fetchPlaces();
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
            console.log(hasFetchedPlaces);
        } catch (error) {
            console.error("요청 중 오류 발생:", error);
        }
    };

    const handleDeletePlace = async (placeId) => {
        try {
            await axiosInstance.delete(`/plans/${planId}/places/${placeId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log("Place deleted:", placeId);
            await fetchSharedPlaces();
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
        }
    };

    const wsConnect = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error('Token is required to connect');
            return;
        }

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

        let currentToken = token;

        if (isTokenExpired(token)) {
            console.log('Token expired or missing, cannot connect to WebSocket.');
            return;
        }

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

            setHasFetchedPlaces(false);

        } else {
            console.error('Not connected to WebSocket');
        }
    };

    const fetchSharedPlaces = async () => {
        try {
            const response = await axiosInstance.get(`/plans/${planId}/places/shared`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setHasFetchedPlaces(false);
            setSharedPlace(response.data);
            console.log("Shared places response:", response.data);
        } catch (error) {
            console.error("요청 중 오류 발생:", error);
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
                console.log("마이페이지api 사용자 정보2 : ", response.data.id);
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

    const toggleInfoVisibility = () => {
        setIsInfoVisible(!isInfoVisible);
    };
    return (
        <div className="step2-container">
            <div className="place-container">
                <h2>여행 지역 : {krName} </h2>
                {selectedDates && <p>선택된 날짜: {selectedDates}</p>}
                <div className="info-section">
                    <button onClick={toggleInfoVisibility} className="toggle-info-btn">
                        {isInfoVisible ? "접기" : "펼치기"}
                    </button>
                    {isInfoVisible && (
                        <div>
                            <div>지도에서 방문 할 장소를 <storng>검색</storng>합니다.</div>
                            <div>장소를 클릭하면 주소가 입력됩니다.</div>
                            <div>추가를 클릭하면 장소가 추가합니다.</div>
                            <div>공유를 클릭하면 일정에 장소가 등록됩니다.</div>
                            <div>등록 된 장소는 실시간으로 업데이트 됩니다.</div>
                        </div>
                    )}
                </div>
                <div className={`custom-modal-message ${showWsError ? 'show' : ''}`}>
                    {showWsError}
                </div>
                <div className="places-list">
                    {places.map((place) => (
                        <div key={place.id} className="place-item-container">
                            <div className="place-item">
                                <div className="place-item-content">
                                    <h3>{place.placeName}</h3>
                                    <p>{place.address}</p>
                                </div>
                                <button className="share-btn" onClick={() => publishMessage(place.id)}>공유</button>
                            </div>
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
                <div className="place-item-wrap">
                    {sharedPlace.map((msg, index) => (
                        <div
                            key={index}
                            className="place-item-container"
                            ref={el => placeItemRefs.current[index + places.length] = el}
                            data-aos="fade-right"
                        >
                            <div className="place-item">
                                <div className="place-item-content">
                                    <h3>{msg.placeName}</h3>
                                    <p>{msg.address}</p>
                                </div>
                                <button className="delete-btn" onClick={() => handleDeletePlace(msg.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                                        <path d="M0 0h24v24H0V0z" fill="none" />
                                        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SetPlace;
