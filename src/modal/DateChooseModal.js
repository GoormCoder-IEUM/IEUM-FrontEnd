import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../style/DateChooseModal.css";
import { Link } from "react-router-dom";
const DateChooseModal = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="modal-container">
      <h3>여행 기간이 어떻게 되시나요?</h3>
      <p>
        * 여행 일자는 최대 10일까지 설정 가능합니다. <br />
        현지 여행기간(여행지 도착 날짜, 여행지 출발 날짜)으로 입력해 주세요.
      </p>
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          monthsShown={2}
          placeholderText="출발 날짜 선택"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={
            startDate
              ? new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000)
              : null
          }
          monthsShown={2}
          placeholderText="도착 날짜 선택"
        />
      </div>
      <button>
        <Link to="/select-destination">일정짜러가기</Link>
      </button>
    </div>
  );
};

export default DateChooseModal;
