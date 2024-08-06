import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import '../style/chat.css';

const Chat = ({ planId }) => { // planId prop 추가
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [client, setClient] = useState(null);
    const [token, setToken] = useState('');
    const [userName, setUserName] = useState('');
    const messagesEndRef = useRef(null); 

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        setToken(savedToken);
    }, []);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:8080/my-page', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                setUserName(response.data.name);
                console.log('User name fetched:', response.data.name);
            })
            .catch(error => {
                console.error('Error fetching user name:', error);
            });
        }
    }, [token]);

    useEffect(() => {
        if (planId && token) {
            axios.get(`http://localhost:8080/chats/plans/${planId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                setMessages(response.data);
                scrollToBottom();
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });

            const stompClient = new Client({
                brokerURL: 'ws://localhost:8080/ws',
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                onConnect: () => {
                    console.log('Connected');
                    stompClient.subscribe(`/sub/chats/plan/${planId}`, (message) => {
                        const receivedMessage = JSON.parse(message.body);
                        console.log('Received message:', receivedMessage);
                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    });
                },
                onDisconnect: () => {
                    console.log('Disconnected');
                },
            });

            stompClient.activate();
            setClient(stompClient);

            return () => {
                if (stompClient) {
                    stompClient.deactivate();
                }
            };
        }
    }, [planId, token]);

    const sendMessage = () => {
        if (client && newMessage.trim() !== '') {
            const messagePayload = {
                planId: parseInt(planId, 10),
                message: newMessage,
                createdAt: new Date().toISOString(),
                senderid: userName
            };

            console.log('Sending message:', messagePayload);

            client.publish({
                destination: '/pub/share-plan/chats',
                body: JSON.stringify(messagePayload),
            });

            setNewMessage('');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-container">
            <h2 className="chat-header">채팅방</h2>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender.name === userName ? 'my-message' : 'other-message'}`}>
                        {msg.sender.name !== userName && (
                            <strong>{msg.sender.name}</strong>
                        )}
                        <div>{msg.message}</div>
                        <div className="timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="chat-input"
                />
                <button onClick={sendMessage} className="chat-send-button">전송</button>
            </div>
        </div>
    );
};

export default Chat;
