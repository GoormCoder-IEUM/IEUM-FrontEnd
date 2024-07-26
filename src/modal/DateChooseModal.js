import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import "../style/DateChooseModal.css";

const DateChooseModal = ({ show, onClose, setSelectedDates, id }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (!show) {
    return null;
  }

  const handleDateSelect = (selectInfo) => {
    const { start, end } = selectInfo;
    if (!startDate) {
      setStartDate(start);
      setCalendarEvents([
        {
          start,
          end: new Date(start).setDate(start.getDate() + 1),
          display: 'background',
          backgroundColor: '#ff9f89'
        }
      ]);
    } else if (!endDate) {
      const adjustedEnd = new Date(end);
      adjustedEnd.setDate(adjustedEnd.getDate() - 1);
      setEndDate(adjustedEnd);

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(adjustedEnd);

      setCalendarEvents([
        {
          start: startDate,
          end: adjustedEnd,
          display: 'background',
          backgroundColor: '#ff9f89'
        }
      ]);

      setSelectedDates(`${formattedStartDate} ~ ${formattedEndDate}`);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setCalendarEvents([]);
  };

  const handleSelectClick = async () => {
    if (startDate && endDate) {
      const token = localStorage.getItem("token");
      const data = {
        destinationId: id,
        startedAt: new Date(startDate).toISOString(),
        endedAt: new Date(endDate).toISOString(),
        vehicle: "PUBLIC_TRANSPORTATION"
      };
      console.log("요청 :", data);

      try {
        const response = await axios.post('http://localhost:8080/plans', data, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
        onClose();
      } catch (error) {
        console.error("There was an error making the request!", error);
      }
    }
  };

  return (
    <div className="datechoosemodal">
      <div className="datechoosemodal-content">
        <h2>여행 기간이 어떻게 되시나요?</h2>
        <p>* 여행 일자는 최대 10일까지 설정 가능합니다.</p>
        <p>현지 여행 기간(여행지 도착 날짜, 여행지 출발 날짜)으로 입력해 주세요.</p>
        <div className="calendar-container">
          <div className="calendar">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              initialDate="2024-07-01"
              selectable={true}
              select={handleDateSelect}
              events={calendarEvents}
              dayMaxEvents={true}
            />
          </div>
          <div className="calendar">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              initialDate="2024-08-01"
              selectable={true}
              select={handleDateSelect}
              events={calendarEvents}
              dayMaxEvents={true}
            />
          </div>
        </div>

        <div className="selected-date">
          선택한 날짜 : {startDate && endDate ? `${formatDate(startDate)} ~ ${formatDate(endDate)}` : "날짜를 선택해주세요."}
        </div>

        <button onClick={handleReset}>다시 선택</button>
        <button onClick={handleSelectClick}>선택</button>
      </div>
    </div>
  );
};

export default DateChooseModal;
