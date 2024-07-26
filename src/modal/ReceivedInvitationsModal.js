import React from "react";
import "../style/ReceivedInvitationsModal.css";

const ReceivedInvitationsModal = ({ isOpen, onClose, invitations, onAccept }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>받은 초대 조회</h2>
        <div className="invitation-list">
          {invitations.length > 0 ? (
            invitations.map((invitation, index) => (
              <div key={index} className="invitation-item">
                <p>일정 제목: {invitation.planName}</p>
                <p>여행지: {invitation.destinationName}</p>
                <button onClick={() => onAccept(invitation.planId, 'ACCEPT')}>수락</button>
                <button onClick={() => onAccept(invitation.planId, 'REFUSE')}>거절</button>
              </div>
            ))
          ) : (
            <p>받은 초대가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceivedInvitationsModal;
