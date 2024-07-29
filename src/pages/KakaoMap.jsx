import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    const waitForKakao = () => {
      if (window.kakao && window.kakao.maps) {
        console.log('Kakao maps API is loaded');
        initializeMap();
      } else {
        console.log('Waiting for Kakao maps API...');
        setTimeout(waitForKakao, 100);
      }
    };

    const initializeMap = () => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      };

      const map = new window.kakao.maps.Map(container, options);

      const points = [
        new window.kakao.maps.LatLng(33.452278, 126.567803),
        new window.kakao.maps.LatLng(33.452671, 126.574792),
        new window.kakao.maps.LatLng(33.451744, 126.572441)
      ];

      const bounds = new window.kakao.maps.LatLngBounds();
      
      points.forEach(point => {
        const marker = new window.kakao.maps.Marker({ position: point });
        marker.setMap(map);
        bounds.extend(point);
      });

      window.setBounds = () => {
        map.setBounds(bounds);
      };
    };

    waitForKakao();
  }, []);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '350px' }}></div>
      <p>
        <button onClick={() => window.setBounds()}>지도 범위 재설정 하기</button>
      </p>
    </div>
  );
};

export default KakaoMap;
