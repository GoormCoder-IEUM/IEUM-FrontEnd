import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KakaoMap = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

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
        level: 3,
      };

      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);
    };

    waitForKakao();
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://localhost:8080/plans/1/places');
        setPlaces(response.data);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    fetchPlaces();
  }, []);

  useEffect(() => {
    if (map) {
      const bounds = new window.kakao.maps.LatLngBounds();

      selectedPlaces.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
        const marker = new window.kakao.maps.Marker({ position });
        marker.setMap(map);
        bounds.extend(position);
      });

      if (selectedPlaces.length > 0) {
        map.setBounds(bounds);
      }
    }
  }, [selectedPlaces, map]);

  const handleSelectPlace = (place) => {
    setSelectedPlaces((prev) => [...prev, place]);
    const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
    map.setCenter(position);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h2>장소 선택</h2>
        <div>
          {places.map((place) => (
            <div key={place.id}>
              <button onClick={() => handleSelectPlace(place)}>{place.placeName}</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 2 }}>
        <div id="map" style={{ width: '500px', height: '500px', border: '1px solid black' }}></div>
      </div>
    </div>
  );
};

export default KakaoMap;
