import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../style/Schedule.css";
import SetDate from "../sidebar/SetDate";
import SetPlace from "../sidebar/SetPlace";
import SetDetail from "../sidebar/SetDetail";
import DateChooseModal from "../modal/DateChooseModal";
import InviteMemberModal from "../modal/InviteMemberModal";
import KakaoMap from "./KakaoMap";
import { axiosInstance } from "../axiosinstance/Axiosinstance";
import Chat from "./Chat";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PlanResult } from "../sidebar/PlanResult";

const Schedule = () => {
  const [activeStep, setActiveStep] = useState("STEP 1");
  const [showDateChooseModal, setShowDateChooseModal] = useState(true);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [hasDateChange, setHasDateChange] = useState(false);
  const [selectedDates, setSelectedDates] = useState("");
  const [planId, setPlanId] = useState(null);
  const location = useLocation();
  const { destinationId, krName: initialKrName, planIdForState } = location.state || {};
  const [krName, setKrName] = useState(initialKrName);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 카카오맵 지도정보 관련
  const [selectedPlace, setSelectedPlace] = useState({ name: '', address: '' });

  const onPlaceSelect = (placeName, placeAddress) => {
    setSelectedPlace({ name: placeName, address: placeAddress });
  };

  useEffect(() => {
    if (planIdForState) {
      setShowDateChooseModal(false);
      console.log("planIdForState before setting planId: ", planIdForState);
      setPlanId(planIdForState);
    }
  }, [planIdForState]);


  useEffect(() => {
    if (planId !== null) {
      console.log("set plan id : ", planId);
    }
  }, [planId]);

  const handleSetActiveStep = (step) => {
    setActiveStep(step);
  };

  const closeDateChooseModal = () => {
    setShowDateChooseModal(false);
    setShowInviteMemberModal(true);
  };

  const closeInviteMemberModal = () => {
    setShowInviteMemberModal(false);
  };

  const renderComponent = (step) => {
    switch (step) {
      case "STEP 1":
        return <SetDate selectedDates={selectedDates} krName={krName} planId={planId} fetchPlanData={fetchPlanData} setHasDateChange={setHasDateChange} />;
      case "STEP 2":
        return <SetPlace selectedDates={selectedDates} krName={krName}
          destinationId={destinationId} planId={planId} selectedPlace={selectedPlace} />;
      case "STEP 3":
        return <SetDetail planId={planId} selectedDates={selectedDates} />;
      case "STEP 4":
        return <PlanResult planId={planId} selectedDates={selectedDates} />;
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const utcToLocalDate = (utcDate) => {
    const date = new Date(utcDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const fetchPlanData = async () => {
    if (!planId) return;
    try {
      const token = localStorage.getItem("token");
  
      const response = await axiosInstance.get(`/plans/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const startDateUTC = response.data.startedAt;
      const endDateUTC = response.data.endedAt;
  
      const startDate = utcToLocalDate(startDateUTC); // UTC -> 로컬
      const endDate = utcToLocalDate(endDateUTC); // UTC -> 로컬
  
      setStartDate(startDate);
      setEndDate(endDate);
  
      const selectedDates = `${startDate} ~ ${endDate}`;
      setSelectedDates(selectedDates);
      console.log("selectedDates ", selectedDates);
      setHasDateChange(true);
      setKrName(response.data.destinationKrName);
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
    }
  };
  

  useEffect(() => {
    fetchPlanData();
  }, [hasDateChange, planId])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="schedule-container">
        <DateChooseModal
          show={showDateChooseModal}
          onClose={closeDateChooseModal}
          setSelectedDates={setSelectedDates}
          destinationId={destinationId}
          setPlanId={setPlanId}
          formatDate={formatDate}
        />
        <InviteMemberModal
          show={showInviteMemberModal}
          onClose={closeInviteMemberModal}
          planId={planId}
        />
        <div className="sidebar-container">
          <div className="sidebar">
            <div
              className={`sidebar-detail ${activeStep === "STEP 1" ? "active" : ""}`}
              onClick={() => handleSetActiveStep("STEP 1")}
            >
              <div>STEP 1</div>
              <div>날짜 확인</div>
            </div>
            <div
              className={`sidebar-detail ${activeStep === "STEP 2" ? "active" : ""}`}
              onClick={() => handleSetActiveStep("STEP 2")}
            >
              <div>STEP 2</div>
              <div>장소 선택</div>
            </div>
            <div
              className={`sidebar-detail ${activeStep === "STEP 3" ? "active" : ""}`}
              onClick={() => handleSetActiveStep("STEP 3")}
            >
              <div>STEP 3</div>
              <div>시간 선택</div>
            </div>
            <div
              className={`sidebar-detail ${activeStep === "STEP 4" ? "active" : ""}`}
              onClick={() => handleSetActiveStep("STEP 4")}
            >
              <div>STEP 4</div>
              <div>일정 확인</div>
            </div>
          </div>
        </div>
        <div className="content-container">
          {renderComponent(activeStep)}
        </div>
        {activeStep !== "STEP 4" && <KakaoMap onPlaceSelect={onPlaceSelect} />}
        <Chat planId={planId} />
      </div>
    </DndProvider>
  );
};

export default Schedule;
