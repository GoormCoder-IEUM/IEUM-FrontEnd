import React, { useState } from "react";
import axios from "axios";
import "../style/InviteMemberModal.css";

const InviteMemberModal = ({ show, onClose, planId }) => {
  const [id, setId] = useState("");
  const [ids, setIds] = useState([]);
  const [error, setError] = useState(null);

  if (!show) {
    return null;
  }

  const handleAddId = () => {
    if (id && !ids.includes(id.trim())) {
      setIds([...ids, id.trim()]);
      setId("");
    }
  };

  const handleInvite = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:8080/plan/members/invite/${planId}`,
        { memberLoginIds: ids },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Invite response:", response.data);
      onClose();
    } catch (error) {
      console.error("Error inviting member:", error);
      setError("Failed to invite member. Please try again.");
    }
  };

  return (
    <div className="invitemembermodal">
      <div className="invitemembermodal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h1>새 멤버 초대</h1>
        {error && <p className="error">{error}</p>}
        <div className="inv-section">
          <input
            type="text"
            placeholder="ID 입력"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddId}>추가</button>
        </div>
        <div className="added-ids">
          <p>초대할 사용자</p>
          {ids.length > 0 && (
            <ul>
              {ids.map((id, index) => (
                <li key={index}>{id}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="inv-btn-wrap">
          <button className="inv-btn" onClick={handleInvite}>초대</button>
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;
