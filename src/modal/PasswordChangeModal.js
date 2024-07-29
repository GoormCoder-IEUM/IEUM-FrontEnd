import React from "react";
import "../style/PasswordChangeModal.css";

const PasswordChangeModal = ({ isOpen, onClose, onSubmit, formData, handleInputChange }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>비밀번호 변경</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="previousPassword">현재 비밀번호</label>
            <input
              type="password"
              id="previousPassword"
              name="previousPassword"
              value={formData.previousPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">저장</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
