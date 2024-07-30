import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../style/SetPlace.css";

const SetPlace = ({ selectedDates, krName, planId }) => {
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const [address, setAddress] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [hasFetchedPlaces, setHasFetchedPlaces] = useState(false);

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
        setHasFetchedPlaces(true);

        console.log("places: ", response.data);
      } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
      }
    };

    if (!hasFetchedPlaces) {
      fetchPlaces();
    }
  }, [hasFetchedPlaces, planId]);

  const handleAddPlaceClick = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:8080/plans/${planId}/places`,
        {
          placeName,
          address,
          categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Add place response:", response.data);
      setHasFetchedPlaces(false);
    } catch (error) {
      console.error("Error adding place:", error);
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
            <div key={place.id} className="place-item">
              <h3>{place.placeName}</h3>
              <p>{place.address}</p>
            </div>
          ))}
        </div>

        <div className="add-place-form">
          <input
            type="text"
            placeholder="Place Name"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option value={1}>명소</option>
            <option value={2}>식당/카페</option>
            <option value={3}>숙소</option>
          </select>
          <button onClick={handleAddPlaceClick}>추가</button>
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
