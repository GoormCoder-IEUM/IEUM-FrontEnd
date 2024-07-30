import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../style/SetPlace.css";

const SetPlace = ({ selectedDates, krName, planId }) => {
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://localhost:8080/plans/${planId}/places`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
        setPlaces(response.data);

        console.log("places: ", places);
      }
      
      catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
      }
    };

    fetchPlaces();
  }, []);

  const handleAddPlaceClick = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:8080/plans/${planId}/places`,
        {
          placeName: "string",
          address: "string",
          categoryId: 1 // 수정 필요 수정 필요 수정 필요 수정 필요 수정 필요 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Invite response:", response.data);
    } catch (error) {
      console.error("Error inviting member:", error);
    }
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
            <div key={place.placeName} className="place-item">
              <h3>{place.placeName}</h3>
              <p>{place.address}</p>
            </div>
          ))}
        </div>

        <button onClick={() => handleAddPlaceClick()}>추가</button>
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
