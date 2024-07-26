import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../style/Schedule.css";
import Step1 from "../sidebar/Step1";
import Step2 from "../sidebar/Step2";
import Step3 from "../sidebar/Step3";
import DateChooseModal from "../modal/DateChooseModal";

const Schedule = () => {
  const [activeStep, setActiveStep] = useState("STEP 1");
  const [showModal, setShowModal] = useState(true);
  const [selectedDates, setSelectedDates] = useState("");
  const location = useLocation();
  const { id, krName } = location.state || {}; 

  useEffect(() => {
    console.log("Location State:", location.state); // Add this line
  }, [location.state]);

  const handleSetActiveStep = (step) => {
    setActiveStep(step);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const renderComponent = (step) => {
    switch (step) {
      case "STEP 1":
        return <Step1 selectedDates={selectedDates} krName={krName} />;
      case "STEP 2":
        return <Step2 selectedDates={selectedDates} krName={krName} id={id} />;
      case "STEP 3":
        return <Step3 selectedDates={selectedDates} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <DateChooseModal show={showModal} onClose={closeModal} setSelectedDates={setSelectedDates} id={id} />
      <div className="sidebar-container">
        <div className="sidebar">
          <div className="sidebar-detail" onClick={() => handleSetActiveStep("STEP 1")}>
            <div>STEP 1</div>
            <div>날짜 확인</div>
          </div>
          <div className="sidebar-detail" onClick={() => handleSetActiveStep("STEP 2")}>
            <div>STEP 2</div>
            <div>날짜 확인</div>
          </div>
          <div className="sidebar-detail" onClick={() => handleSetActiveStep("STEP 3")}>
            <div>STEP 3</div>
            <div>날짜 확인</div>
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
