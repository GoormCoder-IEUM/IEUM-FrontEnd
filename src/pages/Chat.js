import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import '../style/Chat.css';

const Chat = ({ planId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [client, setClient] = useState(null);
    const [token, setToken] = useState('');
    const [userName, setUserName] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 80, y: 10 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);
    const dragging = useRef(false);

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
                    stompClient.subscribe(`/sub/chats/plan/${planId}`, (message) => {
                        const receivedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    });
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

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleMouseDown = (e) => {
        dragging.current = true;
        const chatRect = chatRef.current.getBoundingClientRect();
        setOffset({
            x: e.clientX - chatRect.left,
            y: e.clientY - chatRect.top,
        });
        chatRef.current.style.cursor = 'grabbing';  // 드래그 중임을 표시하기 위해 커서를 변경
    };

    const handleMouseMove = (e) => {
        if (dragging.current) {
            const newX = (e.clientX - offset.x) / window.innerWidth * 100;
            const newY = (e.clientY - offset.y) / window.innerHeight * 100;

            setPosition({
                x: newX,
                y: newY,
            });
        }
    };

    const handleMouseUp = () => {
        dragging.current = false;
        chatRef.current.style.cursor = 'grab';  // 드래그 종료 후 커서를 원래대로 변경
    };

    return (
        <div
            ref={chatRef}
            style={{
                position: 'absolute',
                left: `${position.x}%`,  // 픽셀이 아닌 %로 위치 설정
                top: `${position.y}%`,
                cursor: 'grab',
                zIndex: 999,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className={`chat-container ${isOpen ? "open" : ""}`}>
                <button className="toggle-chat-btn" onClick={toggleChat}>
                    {isOpen ? "채팅 닫기" : "채팅 열기"}
                </button>
                <div className="chat-guide"> {isOpen ? "" : "드래그 해서 채팅창을 옮길 수 있습니다."}</div>

                {isOpen && (
                    <div className="chat-wrap">
                        <div className="chat-header">채팅방</div>
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
                )}
            </div>
        </div>
    );
};

export default Chat;
