import React, { useState } from "react";
import axios from "axios";
import "../style/InviteMemberModal.css";

const InviteMemberModal = ({ show, onClose, planId }) => {
  const [id, setid] = useState("");
  const [error, setError] = useState(null);

  if (!show) {
    return null;
  }

  const handleInvite = async () => {
    const token = localStorage.getItem("token");
    try {
    const response = await axios.post(`http://localhost:8080/plan/members/invite/${planId}`, {
        memberLoginIds: [id],
      },
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
        <h2>새 멤버 초대</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="id"
          placeholder="id 입력"
          value={id}
          onChange={(e) => setid(e.target.value)}
        />
        <button onClick={handleInvite}>초대</button>
      </div>
    </div>
  );
};

export default InviteMemberModal;
