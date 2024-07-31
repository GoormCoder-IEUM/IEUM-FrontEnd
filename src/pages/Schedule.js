import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../style/Schedule.css";
import SetDate from "../sidebar/SetDate";
import SetPlace from "../sidebar/SetPlace";
import SetAccommodation from "../sidebar/SetAccommodation";
import DateChooseModal from "../modal/DateChooseModal";
import InviteMemberModal from "../modal/InviteMemberModal";
import KakaoMap from "./KakaoMap";
import axios from "axios";

const Schedule = () => {
  const [activeStep, setActiveStep] = useState("STEP 1");
  const [showDateChooseModal, setShowDateChooseModal] = useState(true);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState("");
  const [planId, setPlanId] = useState(null);
  const location = useLocation();
  const { destinationId, krName: initialKrName, planIdForState } = location.state || {};
  const [krName, setKrName] = useState(initialKrName);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  useEffect(() => {
    if (krName === undefined) {
      setShowDateChooseModal(false);
      console.log("planIdForState ", planIdForState);
      setPlanId(planIdForState);
    }
  }, []);

  useEffect(() => {
    if (planId !== null) {
      console.log("set plan id : ", planId);
      fetchPlanData();
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
        return <SetDate selectedDates={selectedDates} krName={krName} />;
      case "STEP 2":
        return <SetPlace selectedDates={selectedDates} krName={krName} destinationId={destinationId} planId={planId} />;
      case "STEP 3":
        return <SetAccommodation selectedDates={selectedDates} />;
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

const fetchPlanData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:8080/plans/${planId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const startDate = new Date(response.data.startedAt).toISOString().split('T')[0];
    const endDate = new Date(response.data.endedAt).toISOString().split('T')[0];
    
    setStartDate(startDate);
    setEndDate(endDate);
    
    const selectedDates = `${startDate} ~ ${endDate}`;
    setSelectedDates(selectedDates);
    console.log("selectedDates ", selectedDates);

    setKrName(response.data.destinationKrName);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


  return (
    <div className="container">
      <DateChooseModal 
        show={showDateChooseModal} 
        onClose={closeDateChooseModal} 
        setSelectedDates={setSelectedDates} 
        destinationId={destinationId} 
        setPlanId={setPlanId} // Pass setPlanId to DateChooseModal
        formatDate={formatDate}
      />
      <InviteMemberModal 
        show={showInviteMemberModal} 
        onClose={closeInviteMemberModal} 
        planId={planId} // Pass planId to InviteMemberModal
      />
      <div className="sidebar-container">
        <div className="sidebar">
          <div className="sidebar-detail" onClick={() => handleSetActiveStep("STEP 1")}>
            <div>STEP 1</div>
            <div>날짜 확인</div>
          </div>
          <div className="sidebar-detail" onClick={() => handleSetActiveStep("STEP 2")}>
            <div>STEP 2</div>
            <div>장소 선택</div>
          </div>
          <div className="sidebar-detail" onClick={() => handleSetActiveStep("STEP 3")}>
            <div>STEP 3</div>
            <div>숙소 선택</div>
          </div>
        </div>
      </div>
      <div className="content-container">
        {renderComponent(activeStep)}
      </div>
      <KakaoMap />
    </div>
  );
};

export default Schedule;
