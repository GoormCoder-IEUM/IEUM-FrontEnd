import React from "react";
import "../style/UserEditModal.css";

const UserEditModal = ({ isOpen, onClose, onSubmit, formData, handleInputChange }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>회원 정보 수정</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">성별</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="birth">생일</label>
            <input
              type="date"
              id="birth"
              name="birth"
              value={formData.birth}
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

export default UserEditModal;
