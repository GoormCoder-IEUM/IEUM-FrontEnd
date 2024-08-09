import React, { useState, useEffect } from "react";
import "../style/SetDate.css";
import { axiosInstance } from "../axiosinstance/Axiosinstance";

const SetDate = ({ selectedDates, krName, planId, fetchPlanData }) => {
  const [editTime, setEditTime] = useState("");
  const [isStartTime, setIsStartTime] = useState(true);
  const [showModalMessage, setShowModalMessage] = useState("");

  const handleTimeChange = (event) => {
    setEditTime(event.target.value);
    event.target.blur();
  };

  const handleToggleChange = (option) => {
    setIsStartTime(option === "start");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editTime) {
      setShowModalMessage("Please select a new time.");
      return;
    }

    const formattedTime = editTime;

    try {
      const token = localStorage.getItem("token");
      const url = isStartTime
        ? `/plans/${planId}/start-time`
        : `/plans/${planId}/end-time`;

      const params = isStartTime
        ? { newStartTime: formattedTime }
        : { newEndTime: formattedTime };

      const response = await axiosInstance.put(url, null, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowModalMessage(
        isStartTime ? "시작 일자가 변경되었습니다." : "끝 일자가 변경되었습니다."
      );
      console.log("Response:", response.data);
      fetchPlanData(planId);
    } catch (error) {
      console.error(
        isStartTime ? "Error updating start time:" : "Error updating end time:",
        error
      );
      setShowModalMessage("Failed to update time. Please try again.");
    }
  };

  useEffect(() => {
    if (showModalMessage) {
      setTimeout(() => {
        setShowModalMessage("");
      }, 3000);

      setTimeout(() => {
        document.querySelector('.custom-modal-message').classList.add('fade-out');
      }, 2500);
    }
  }, [showModalMessage]);

  return (
    <div className="step1-container">
      <h2>여행 지역 : {krName}</h2>
      {selectedDates && <p>선택된 날짜: {selectedDates}</p>}

      <div className="toggle-container">
        <button
          className={`toggle-button ${isStartTime ? "active" : ""}`}
          onClick={() => handleToggleChange("start")}
        >
          시작 시간 수정하기
        </button>
        <button
          className={`toggle-button ${!isStartTime ? "active" : ""}`}
          onClick={() => handleToggleChange("end")}
        >
          끝 시간 수정하기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="time-form">
        <label htmlFor="newTime">
          {isStartTime ? "새 시작 시간:" : "새 종료 시간:"}
        </label>
        <input
          type="datetime-local"
          id="newTime"
          value={editTime}
          onChange={handleTimeChange}
          className="time-input"
        />
        <button type="submit" className="time-button">시간 업데이트</button>
      </form>

      <div className={`custom-modal-message ${showModalMessage ? 'show' : ''}`}>
        {showModalMessage}
      </div>
    </div>
  );
};

export default SetDate;
