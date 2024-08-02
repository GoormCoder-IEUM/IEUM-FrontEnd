import React from "react";
import "../style/SetDate.css";

const SetDate = ({ selectedDates, krName }) => {
  return (
    <div className="step1-container">
				<h2>여행 지역 : {krName} </h2>
				{selectedDates && <p>선택된 날짜: {selectedDates}</p>}
    </div>
  );
};

export default SetDate;
