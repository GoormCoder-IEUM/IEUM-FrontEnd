import React, { useState, useEffect } from "react";
import "../style/SetPlace.css";

const SetPlace = ({ selectedDates, krName }) => {
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:8080/api/places", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        console.log("places: ", response);
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const data = await response.json();
        setPlaces(data);
        console.log("places: ", places);
      } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
      }
    };

    fetchPlaces();
  }, []);

  const handlePlaceClick = (place) => {
    setSelectedPlaces((prev) => [...prev, place]);
  };

  const handleRemovePlace = (placeId) => {
    setSelectedPlaces((prev) => prev.filter((place) => place.id !== placeId));
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

export default SetPlace;
