import React from "react";
import pic from "../img/images.jpg";
import "../style/ContryIntroModal.css";
import { Link } from "react-router-dom";

const ContryIntroModal = () => {
  return (
    <div className="modal-container">
      <div className="right-container">
        <h5>JEJU</h5>
        <h5>대한민국 제주</h5>
        <p>도시 정보</p>
        <button>
          <Link to="/select-destination">일정만들기</Link>
        </button>
      </div>
      <div className="left-container">
        <img src={pic} alt="Jeju" />
        <div className="button-group">
          <button>항공권 예매</button>
          <button>숙박 예약</button>
        </div>
      </div>
    </div>
  );
};

export default ContryIntroModal;
