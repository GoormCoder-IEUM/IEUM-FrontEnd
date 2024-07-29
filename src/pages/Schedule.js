import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../style/Schedule.css";
import SetDate from "../sidebar/SetDate";
import SetPlace from "../sidebar/SetPlace";
import SetAccommodation from "../sidebar/SetAccommodation";
import DateChooseModal from "../modal/DateChooseModal";
import InviteMemberModal from "../modal/InviteMemberModal";

const Schedule = () => {
  const [activeStep, setActiveStep] = useState("STEP 1");
  const [showDateChooseModal, setShowDateChooseModal] = useState(true);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState("");
  const [planId, setPlanId] = useState(null); // Add planId state
  const location = useLocation();
  const { id, krName } = location.state || {}; 

  useEffect(() => {
    console.log("Location State:", location.state); // Add this line
  }, [location.state]);

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
        return <SetPlace selectedDates={selectedDates} krName={krName} id={id} />;
      case "STEP 3":
        return <SetAccommodation selectedDates={selectedDates} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <DateChooseModal 
        show={showDateChooseModal} 
        onClose={closeDateChooseModal} 
        setSelectedDates={setSelectedDates} 
        id={id} 
        setPlanId={setPlanId} // Pass setPlanId to DateChooseModal
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
    </div>
  );
};

export default Schedule;
