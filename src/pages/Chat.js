import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  width: 450px;
  height: 650px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 10px;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ddd;
  text-align: center;
  font-size: 0.8em;
  font-weight: bold;
`;

const Participants = styled.div`
  font-size: 0.7em;
  color: #555;
  margin-top: 5px;
`;

const MessageContainer = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const Message = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isMine ? 'flex-end' : 'flex-start')};
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => (props.isMine ? '#e1ffc7' : '#ffffff')};
  align-self: ${(props) => (props.isMine ? 'flex-end' : 'flex-start')};
  position: relative;
`;

const Timestamp = styled.div`
  font-size: 0.7em;
  color: #aaa;
  position: absolute;
  bottom: -18px;
  ${(props) => (props.isMine ? 'right: 0;' : 'left: 0;')}
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 20%;
  margin-right: ${(props) => (props.isMine ? '0' : '10px')};
  margin-left: ${(props) => (props.isMine ? '10px' : '0')};
`;

const ProfileName = styled.div`
  font-size: 0.7em;
  color: #555;
  margin-left: ${(props) => (props.isMine ? '10px' : '0')};
  margin-right: ${(props) => (props.isMine ? '0' : '10px')};
`;

const InputContainer = styled.div`
  padding: 10px;
  border-top: 1px solid #ddd;
  display: flex;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
`;

const SendButton = styled.button`
  padding: 10px;
  margin-left: 10px;
  border: none;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messageEndRef = useRef(null);
  const websocketRef = useRef(null);

  const loggedInUserName = '나나나';

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSendMessage = () => {
    if (input.trim()) {
      const message = { id: Date.now(), text: input, profile: 'profile1.png', name: loggedInUserName, timestamp: new Date().toLocaleTimeString() };
      websocketRef.current.send(JSON.stringify(message));
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    websocketRef.current = new WebSocket('ws://localhost:8080/ws');

    websocketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    websocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      websocketRef.current.close();
    };
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/chats/plans/{id}')
      .then((response) => response.json())
      .then((data) => setMessages(data.messages))
      .catch((error) => console.error('Error fetching messages:', error));
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const uniqueParticipants = [...new Set(messages.map((msg) => msg.name))];
  const participantNames = uniqueParticipants.join(', ');

  return (
    <ChatContainer>
      <Header>
        그룹 채팅 (참여자: {uniqueParticipants.length}명)
        <Participants>{participantNames}</Participants>
      </Header>
      <MessageContainer>
        {messages.map((msg) => (
          <Message key={msg.id} isMine={msg.name === loggedInUserName}>
            <ProfileContainer isMine={msg.name === loggedInUserName}>
              <ProfileName isMine={msg.name === loggedInUserName}>{msg.name}</ProfileName>
            </ProfileContainer>
            <MessageContent isMine={msg.name === loggedInUserName}>
              {msg.text}
              <Timestamp isMine={msg.name === loggedInUserName}>{msg.timestamp}</Timestamp>
            </MessageContent>
          </Message>
        ))}
        <div ref={messageEndRef} />
      </MessageContainer>
      <InputContainer>
        <Input 
          value={input} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown} 
          placeholder="메시지 입력" 
        />
        <SendButton onClick={handleSendMessage}>보내기</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;
/*
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  width: 450px;
  height: 650px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 10px;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ddd;
  text-align: center;
  font-size: 0.8em;
  font-weight: bold;
`;

const Participants = styled.div`
  font-size: 0.7em;
  color: #555;
  margin-top: 5px;
`;

const MessageContainer = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const Message = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isMine ? 'flex-end' : 'flex-start')};
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => (props.isMine ? '#e1ffc7' : '#ffffff')};
  align-self: ${(props) => (props.isMine ? 'flex-end' : 'flex-start')};
  position: relative;
`;

const Timestamp = styled.div`
  font-size: 0.7em;
  color: #aaa;
  position: absolute;
  bottom: -18px;
  ${(props) => (props.isMine ? 'right: 0;' : 'left: 0;')}
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 20%;
  margin-right: ${(props) => (props.isMine ? '0' : '10px')};
  margin-left: ${(props) => (props.isMine ? '10px' : '0')};
`;

const ProfileName = styled.div`
  font-size: 0.7em;
  color: #555;
  margin-left: ${(props) => (props.isMine ? '10px' : '0')};
  margin-right: ${(props) => (props.isMine ? '0' : '10px')};
`;

const InputContainer = styled.div`
  padding: 10px;
  border-top: 1px solid #ddd;
  display: flex;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
`;

const SendButton = styled.button`
  padding: 10px;
  margin-left: 10px;
  border: none;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
`;

const messagesData = [
  { id: 1, text: '이번 여름에 여행 갈까요?', profile: 'profile1.png', name: '가가가', timestamp: '오전 1:21' },
  { id: 2, text: '좋아요! 어디로 갈까요?', profile: 'profile2.png', name: '나나나', timestamp: '오전 1:23' },
  { id: 3, text: '해변이 있는 곳이 좋겠어요.', profile: 'profile2.png', name: '다다다', timestamp: '오전 1:23' },
  { id: 4, text: '제주도는 어때요?', profile: 'profile1.png', name: '가가가', timestamp: '오전 1:36' },
  { id: 5, text: '완전 좋아요! 숙소는 어디로 할까요?', profile: 'profile2.png', name: '나나나', timestamp: '오전 1:37' },
  { id: 6, text: '저렴하고 깨끗한 곳으로 알아볼게요.', profile: 'profile2.png', name: '다다다', timestamp: '오전 1:53' },
  { id: 7, text: '좋아요. 날짜는 언제로 할까요?', profile: 'profile1.png', name: '가가가', timestamp: '오전 1:53' },
  { id: 8, text: '8월 초가 좋을 것 같아요.', profile: 'profile2.png', name: '나나나', timestamp: '오전 10:27' },
  { id: 9, text: '8월 1일부터 7일까지는 어때요?', profile: 'profile2.png', name: '다다다', timestamp: '오전 10:27' },
  { id: 10, text: '좋아요! 그럼 계획을 구체적으로 세워봐요.', profile: 'profile1.png', name: '가가가', timestamp: '오전 10:27' },
];

const Chat = () => {
  const [messages, setMessages] = useState(messagesData);
  const [input, setInput] = useState('');
  const messageEndRef = useRef(null);

  const loggedInUserName = '나나나';

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now(), text: input, profile: 'profile1.png', name: loggedInUserName, timestamp: new Date().toLocaleTimeString() }]);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const uniqueParticipants = [...new Set(messages.map(msg => msg.name))];
  const participantNames = uniqueParticipants.join(', ');

  return (
    <ChatContainer>
      <Header>
        그룹 채팅 (참여자: {uniqueParticipants.length}명)
        <Participants>{participantNames}</Participants>
      </Header>
      <MessageContainer>
        {messages.map((msg) => (
          <Message key={msg.id} isMine={msg.name === loggedInUserName}>
            <ProfileContainer isMine={msg.name === loggedInUserName}>
              
              <ProfileName isMine={msg.name === loggedInUserName}>{msg.name}</ProfileName>
    
            </ProfileContainer>
            <MessageContent isMine={msg.name === loggedInUserName}>
              {msg.text}
              <Timestamp isMine={msg.name === loggedInUserName}>{msg.timestamp}</Timestamp>
            </MessageContent>
          </Message>
        ))}
        <div ref={messageEndRef} />
      </MessageContainer>
      <InputContainer>
        <Input 
          value={input} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown} 
          placeholder="메시지 입력" 
        />
        <SendButton onClick={handleSendMessage}>보내기</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat; */
