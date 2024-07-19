import React from "react";
import pic from "../img/images.jpg";
import "../style/PlaceIntroModal.css";

const PlaceIntroModal = () => {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <p className="place-name">장소이름</p>
        <p className="place-english-name">장소영문이름</p>
        <img src={pic} alt="Jeju" className="place-image" />
        <p className="place-description">장소에 대한 설명</p>
        <p className="place-address">주소 : 주소상세 쓰기</p>
        <p className="place-hours">영업 시간 : 8:00 ~ 17:00</p>
      </div>
    </div>
  );
};

export default PlaceIntroModal;
