import React from "react";
import "../style/ReceivedInvitationsModal.css";

const ReceivedInvitationsModal = ({ isOpen, onClose, invitations, onAccept }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="receivedinvitationsmodal-overlay">
      <div className="receivedinvitationsmodal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>받은 초대 조회</h2>
        <div className="invitation-table-container">
          {invitations.length > 0 ? (
            <table className="invitation-table">
              <thead>
                <tr>
                  <th>일정 제목</th>
                  <th>여행지</th>
                  <th>수락 여부</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invitation, index) => (
                  <tr key={index} className="invitation-item">
                    <td>{invitation.planName}</td>
                    <td>{invitation.destinationName}</td>
                    <td>
                      <button onClick={() => onAccept(invitation.planId, 'ACCEPT')}>수락</button>
                      <button className="refuse-btn" onClick={() => onAccept(invitation.planId, 'REFUSE')}>거절</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>받은 초대가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceivedInvitationsModal;
