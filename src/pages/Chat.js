import React, { useState } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  width: 550px;
  height: 650px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  font-size: 0.8em;
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
  { id: 1, text: '이번 여름에 여행 갈까요?', isMine: false, profile: 'profile1.png', name: '가가가' },
  { id: 2, text: '좋아요! 어디로 갈까요?', isMine: true, profile: 'profile2.png', name: '나나나' },
  { id: 3, text: '해변이 있는 곳이 좋겠어요.', isMine: false, profile: 'profile2.png', name: '다다다' },
  { id: 4, text: '제주도는 어때요?', isMine: false, profile: 'profile1.png', name: '가가가' },
  { id: 5, text: '완전 좋아요! 숙소는 어디로 할까요?', isMine: true, profile: 'profile2.png', name: '나나나' },
  { id: 6, text: '저렴하고 깨끗한 곳으로 알아볼게요.', isMine: false, profile: 'profile2.png', name: '다다다' },
  { id: 7, text: '좋아요. 날짜는 언제로 할까요?', isMine: false, profile: 'profile1.png', name: '가가가' },
  { id: 8, text: '8월 초가 좋을 것 같아요.', isMine: true, profile: 'profile2.png', name: '나나나' },
  { id: 9, text: '8월 1일부터 7일까지는 어때요?', isMine: false, profile: 'profile2.png', name: '다다다' },
  { id: 10, text: '좋아요! 그럼 계획을 구체적으로 세워봐요.', isMine: false, profile: 'profile1.png', name: '가가가' },
];

const Chat = () => {
  const [messages, setMessages] = useState(messagesData);
  const [input, setInput] = useState('');

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now(), text: input, isMine: true, profile: 'profile1.png', name: '나나나' }]);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <ChatContainer>
      <MessageContainer>
        {messages.map((msg) => (
          <Message key={msg.id} isMine={msg.isMine}>
            <ProfileContainer isMine={msg.isMine}>
              {!msg.isMine && <ProfileImage src={`/images/${msg.profile}`} alt={msg.name} />}
              <ProfileName isMine={msg.isMine}>{msg.name}</ProfileName>
              {msg.isMine && <ProfileImage src={`/images/${msg.profile}`} alt={msg.name} />}
            </ProfileContainer>
            <MessageContent isMine={msg.isMine}>{msg.text}</MessageContent>
          </Message>
        ))}
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
