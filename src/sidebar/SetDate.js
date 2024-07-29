import React from "react";

const SetDate = ({ selectedDates, krName }) => {
  return (
    <div className="step1-container">
      여행 지역 : {krName}
      {selectedDates && <p>선택된 날짜: {selectedDates}</p>}
    </div>
  );
};

export default SetDate;
