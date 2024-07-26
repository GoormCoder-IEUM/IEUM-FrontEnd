import React, { useState } from "react";
import "../style/Step2.css"

const Step2 = ({ selectedDates, krName }) => {
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const places = [
    { id: 1, name: "꼬스띠노", type: "카페", location: "제주특별자치도" },
    { id: 2, name: "빛의 벙커", type: "명소", location: "서귀포시" },
    { id: 3, name: "성산 일출봉", type: "명소", location: "서귀포시" },
    // Add more places here
  ];

  const handlePlaceClick = (place) => {
    setSelectedPlaces((prev) => [...prev, place]);
  };

  const handleRemovePlace = (placeId) => {
    setSelectedPlaces((prev) => prev.filter(place => place.id !== placeId));
  };

  return (
    <div className="step2-container">
      <div className="place-container"> 
        <h2>여행 지역 : {krName} </h2>
        {selectedDates && <p>선택된 날짜: {selectedDates}</p>}
        <div className="places-list">
          {places.map((place) => (
            <div key={place.id} className="place-item">
              <h3>{place.name}</h3>
              <p>{place.type}</p>
              <p>{place.location}</p>
              <button onClick={() => handlePlaceClick(place)}>추가</button>
            </div>
          ))}
        </div>
      </div>
      <div className="selected-places">
        <h2>Selected Places</h2>
        {selectedPlaces.map((place) => (
          <div key={place.id} className="selected-place-item">
            <h3>{place.name}</h3>
            <p>{place.type}</p>
            <p>{place.location}</p>
            <button onClick={() => handleRemovePlace(place.id)}>제거</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2;
