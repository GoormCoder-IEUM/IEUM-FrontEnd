import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import '../style/chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [client, setClient] = useState(null);
    const [planId, setPlanId] = useState('');
    const [token, setToken] = useState('');
    const [senderId, setSenderId] = useState(localStorage.getItem('senderId')); 
    const messagesEndRef = useRef(null); 

    useEffect(() => {
        const savedPlanId = localStorage.getItem('planId');
        const savedToken = localStorage.getItem('token');
        setPlanId(savedPlanId);
        setToken(savedToken);
    }, []);

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
                senderId: senderId,
                createdAt: new Date().toISOString()
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
                    <div key={index} className={`chat-message ${msg.senderId === senderId ? 'my-message' : 'other-message'}`}>
                        <strong>{msg.sender.name}</strong>: {msg.message}
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
