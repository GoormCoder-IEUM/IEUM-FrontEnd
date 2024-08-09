import React, { useEffect, useState } from 'react';
import '../style/Kakaomap.css';

const KakaoMap = ({ onPlaceSelect }) => {
  const [map, setMap] = useState(null);
  const [isSearchTabOpen, setIsSearchTabOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placesService, setPlacesService] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [categoryMarkers, setCategoryMarkers] = useState([]); // 카테고리 마커 상태 추가
  const [searchResults, setSearchResults] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState(''); // 검색 결과 없음 메시지

  const categories = [
    { code: 'MT1', name: '대형마트', emoji: '🏬' },
    { code: 'CS2', name: '편의점', emoji: '🏪' },
    { code: 'PK6', name: '주차장', emoji: '🅿️' },
    { code: 'OL7', name: '주유소, 충전소', emoji: '⛽' },
    { code: 'SW8', name: '지하철역', emoji: '🚇' },
    { code: 'BK9', name: '은행', emoji: '🏦' },
    { code: 'CT1', name: '문화시설', emoji: '🎭' },
    { code: 'AT4', name: '관광명소', emoji: '🏞️' },
    { code: 'AD5', name: '숙박', emoji: '🏨' },
    { code: 'FD6', name: '음식점', emoji: '🍽️' },
    { code: 'CE7', name: '카페', emoji: '☕' },
    { code: 'HP8', name: '병원', emoji: '🏥' },
    { code: 'PM9', name: '약국', emoji: '💊' },
  ];

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

  const handleSearch = (category = null) => {
    if ((!searchQuery && !category) || !placesService) return;

    const searchOptions = category ? { category_group_code: category } : {};

    placesService.keywordSearch(searchQuery, (data, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data);
        setNoResultsMessage('');

        // 일반 검색인 경우 기존 마커 제거
        if (!category) {
          markers.forEach(marker => marker.setMap(null));
          setMarkers([]);
        }

        // 카테고리 검색인 경우 기존 카테고리 마커 제거
        if (category) {
          categoryMarkers.forEach(marker => marker.setMap(null));
          setCategoryMarkers([]);
        }

        // 새로운 마커 추가
        const newMarkers = data.map(place => {
          const emoji = category ? categories.find(c => c.code === category).emoji : '';
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(place.y, place.x),
            map: map,
            image: new window.kakao.maps.MarkerImage(
              `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text x="0" y="25" font-size="25">${emoji}</text></svg>`,
              new window.kakao.maps.Size(32, 34),
              {
                offset: new window.kakao.maps.Point(16, 34),
                alt: '카테고리 마커'
              }
            ),
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${place.place_name}</div>`,
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
          });

          return marker;
        });

        if (category) {
          setCategoryMarkers(newMarkers); // 카테고리 마커 업데이트
        } else {
          setMarkers(newMarkers); // 일반 검색 마커 업데이트
        }

        // 일반 검색인 경우에만 지도 중심 이동
        if (!category && data.length > 0) {
          map.setCenter(new window.kakao.maps.LatLng(data[0].y, data[0].x));
        }
      } else {
        setSearchResults([]);
        if (!category) setMarkers([]);
        else setCategoryMarkers([]);

        setNoResultsMessage(category ? `${categories.find(c => c.code === category).name}이 근처에 없습니다` : '검색 결과가 없습니다.');
        console.error('Search failed:', status);
      }
    }, searchOptions);
  };

  const handleCategoryClick = (category) => {
    // 클릭할 때마다 기존 카테고리 마커 제거
    categoryMarkers.forEach(marker => marker.setMap(null));
    setCategoryMarkers([]);
    handleSearch(category);
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
          {isSearchTabOpen ? 'Close Search' : 'Open Search'}
        </button>
        {isSearchTabOpen && (
          <div className="search-tab-content">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places"
            />
            <button className="map-search-btn" onClick={() => handleSearch()}>Search</button>
            <div className="category-buttons">
              {categories.map((category) => (
                <button
                  key={category.code}
                  className="category-btn"
                  onClick={() => handleCategoryClick(category.code)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {searchResults.length > 0 ? (
              <>
                <h3>Search Results</h3>
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
            ) : (
              noResultsMessage && <div className="no-results">{noResultsMessage}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KakaoMap;
