import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { Client as StompClient } from '@stomp/stompjs';
import "../style/SetPlace.css";

const SetPlace = ({ selectedDates, krName, planId }) => {
	const [places, setPlaces] = useState([]);
	const [selectedPlaces, setSelectedPlaces] = useState([]);
	const [placeName, setPlaceName] = useState('');
	const [address, setAddress] = useState('');
	const [categoryId, setCategoryId] = useState(1);
	const [hasFetchedPlaces, setHasFetchedPlaces] = useState(false);

	const stompClient = useRef(null);
	const [wsConnected, setWsConnected] = useState(false);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const fetchPlaces = async () => {
			const token = localStorage.getItem("token");

			try {
				const response = await axios.get(
					`http://localhost:8080/plans/${planId}/places`,
					{
						headers: {
							"Authorization": `Bearer ${token}`,
						},
					});
				setPlaces(response.data);
				setHasFetchedPlaces(true);

				console.log("장소 리스트", response);
			} catch (error) {
				console.error("There has been a problem with your fetch operation:", error);
			}
		};

		if (!hasFetchedPlaces) {
			fetchPlaces();
		}
	}, [hasFetchedPlaces, planId]);

	const handleAddPlaceClick = async () => {
		const token = localStorage.getItem("token");

		try {
			const response = await axios.post(
				`http://localhost:8080/plans/${planId}/places`,
				{
					placeName,
					address,
					categoryId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log("Add place response:", response.data);
			setHasFetchedPlaces(false);
		} catch (error) {
			console.error("Error adding place:", error);
		}
	};

	const handleRemovePlace = (placeId) => {
		setSelectedPlaces((prev) => prev.filter((place) => place.id !== placeId));
	};

	const wsConnect = () => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.error('Token is required to connect');
			return;
		}

		stompClient.current = new StompClient({
			brokerURL: 'ws://localhost:8080/ws',
			connectHeaders: {
				Authorization: `Bearer ${token}`
			},
			onConnect: () => {
				console.log('Connected to WebSocket');
				setWsConnected(true);

				// Subscribe to error path
				stompClient.current.subscribe(`/sub/errors`, (message) => {
					const receivedMessage = message.body;
					console.log("웹소켓 에러응답:", receivedMessage);
					alert("웹소켓 에러응답:" + receivedMessage);
					setMessages((prevMessages) => [...prevMessages, receivedMessage]);
				});

				// Subscribe to plan specific channel
				if (planId) {
					const subscription = stompClient.current.subscribe(`/sub/plans/${planId}`, (message) => {
						const receivedMessage = JSON.parse(message.body);
						console.log("웹소켓 응답:", receivedMessage);
						setMessages((prevMessages) => [...prevMessages, receivedMessage]);
					});

					// Cleanup function to unsubscribe when the component unmounts or planId changes
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
				// Reconnect logic
				setTimeout(() => {
					wsConnect();
				}, 5000); // Retry connection after 5 seconds
			},
			debug: function (str) {
				console.log(str);
			}
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
		wsConnect();

		return () => {
			disconnect();
		};
	}, []); // 빈 배열을 의존성 배열로 설정하여 컴포넌트가 처음 마운트될 때만 실행되도록 함

	return (
		<div className="step2-container">
			<div className="place-container">
				<h2>여행 지역 : {krName} </h2>
				{selectedDates && <p>선택된 날짜: {selectedDates}</p>}

				<div className="places-list">
					{places.map((place) => (
						<div key={place.id} className="place-item">
							<h3>{place.placeName}</h3>
							<p>{place.address}</p>
							<p>55{place.id}</p>
							<button onClick={() => publishMessage(place.id)}>추가</button>
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
					<button onClick={handleAddPlaceClick}>추가</button>
				</div>
			</div>
			<div className="selected-places">
				<h2>Selected Places</h2>
				<ul>
					{messages.map((msg, index) => (
						<li key={index}>
							<div>Place Name: {msg.placeName}</div>
							<div>Address: {msg.address}</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default SetPlace;
