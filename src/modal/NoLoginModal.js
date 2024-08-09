import React from "react";
import "../style/NoLoginModal.css"; 

const NoLoginModal = ({ isOpen, onClose, onGoToLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="no-login-modal-overlay">
      <div className="no-login-modal">
        <div className="no-login-modal-header">
          <span className="lock-icon">🔒</span>
        </div>
        <div className="no-login-modal-content">
          <h2>로그인이 필요합니다</h2>
          <p>여행지 선택을 위해 로그인이 필요합니다.<br/>로그인 후 이용해 주세요.</p>
        </div>
        <div className="no-login-modal-buttons">
          <button className="no-login-modal-button" onClick={onGoToLogin}>
            로그인
          </button>
          <button className="no-login-modal-close-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoLoginModal;
