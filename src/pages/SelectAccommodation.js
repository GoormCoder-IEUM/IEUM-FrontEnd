import React from 'react';
import KakaoMap from './KakaoMap';
import Chat from './Chat';

const SelectAccommodation = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '10px' }}>
        <h2>장소 선택</h2>
      </div>
      <div style={{ flex: 2, padding: '10px' }}>
        <KakaoMap />
      </div>
      <div style={{ flex: 3, padding: '10px' }}>
        <Chat />
      </div>
    </div>
  );
};

export default SelectAccommodation;
