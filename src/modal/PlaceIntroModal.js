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
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">
          <div className="modal-body-content">
            <div className="content-title-eng"><strong>{enName}</strong></div>
            <div className="content-title-kor">{krName}</div>
            <div className="content-detail">{content}</div>
          </div>
          <img src="assets/intro_sample.jpg" alt="Jeju" />
        </div>
        <button className="modal-action-button" onClick={handleLearnMoreClick}>알아보기</button>
      </div>
    </div>
  );
};

export default PlaceIntroModal;
