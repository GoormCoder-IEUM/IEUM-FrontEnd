import React, { useEffect, useState } from 'react';
import '../style/Kakaomap.css';

const KakaoMap = ({ onPlaceSelect }) => {
  const [map, setMap] = useState(null);
  const [isSearchTabOpen, setIsSearchTabOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placesService, setPlacesService] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

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

      // Places 서비스 인스턴스 생성
      const ps = new window.kakao.maps.services.Places();
      setPlacesService(ps);
    };

    waitForKakao();
  }, []);

  const handleSearch = () => {
    if (!searchQuery || !placesService) return;

    placesService.keywordSearch(searchQuery, (data, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data);

        // 기존 마커 제거
        markers.forEach(marker => marker.setMap(null));

        // 새로운 마커 추가
        const newMarkers = data.map(place => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(place.y, place.x),
            map: map,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${place.place_name}</div>`,
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
          });

          return marker;
        });

        setMarkers(newMarkers);

        // 지도 중심을 첫 번째 검색 결과 위치로 이동
        if (data.length > 0) {
          map.setCenter(new window.kakao.maps.LatLng(data[0].y, data[0].x));
        }
      } else {
        console.error('Search failed:', status);
      }
    });
  };

  const handleResultClick = (place) => {
    map.setCenter(new window.kakao.maps.LatLng(place.y, place.x));
    onPlaceSelect(place.place_name, place.road_address_name || place.address_name);
  };

  return (
    <div className="map-container">
      <div id="map" className="map"></div>
      <div className={`search-tab ${isSearchTabOpen ? 'open' : ''}`}>
        <button className="map-toggle-btn" onClick={() => setIsSearchTabOpen(!isSearchTabOpen)}>
          {isSearchTabOpen ? '검색창 닫기' : '검색창 열기'}
        </button>
        {isSearchTabOpen && (
          <div className="search-tab-content">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="장소를 검색해주세요"
            />
            <button className="map-search-btn" onClick={handleSearch}>검색</button>
            {searchResults.length > 0 && (
              <>
                <h3>검색 결과</h3>
                <div className="map-search-result">
                  <ul>
                    {searchResults.map((place, index) => (
                      <li key={index} onClick={() => handleResultClick(place)}>
                        <strong>{place.place_name}</strong><br />
                        {place.road_address_name || place.address_name}<br />
                        {place.phone}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KakaoMap;
