import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/PlaceIntroModal.css";

const PlaceIntroModal = ({ isOpen, onClose, enName, krName, content, id, modalRef }) => {
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    navigate("/schedule", { state: { id, krName } });
  };

  if (!isOpen) return null;

  return (
    <div className="placeintromodal-overlay">
      <div className="placeintromodal-content" ref={modalRef}>
        <button className="placeintromodal-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="placeintromodal-body">
          <div className="placeintromodal-body-content">
            <div className="content-title-eng"><strong>{enName}</strong></div>
            <div className="content-title-kor">{krName}</div>
            <div className="content-detail">{content}</div>
          </div>
          <img src="assets/intro_sample.jpg" alt="Jeju" />
        </div>
        <button className="placeintromodal-action-button" onClick={handleLearnMoreClick}>알아보기</button>
      </div>
    </div>
  );
};

export default PlaceIntroModal;
