import React, { useState, useEffect } from "react";
import "../style/TimeChooseModal.css";

const TimeChooseModal = ({ place, onClose, onSubmit }) => {
    const [startedAt, setStartedAt] = useState("");
    const [endedAt, setEndedAt] = useState("");
    const [showModalMessage, setShowModalMessage] = useState(""); // 알림용 모달


    const handleSubmit = () => {
        onSubmit(startedAt, endedAt);
    };

    const handleStartDate = (e) => {
        setStartedAt(e.target.value)
        e.target.blur();
    };

    const handleEndDate = (e) => {
        setEndedAt(e.target.value)
        e.target.blur();
    };
    

    // 메시지용 모달
    useEffect(() => {
        if (showModalMessage) {
            setTimeout(() => {
                setShowModalMessage("");
            }, 3000);

            setTimeout(() => {
                document.querySelector('.custom-modal-message').classList.add('fade-out');
            }, 2500);
        }
    }, [showModalMessage]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>{place.placeName} 시간 설정</h2>
                <div className="time-inputs">
                    <label>시작 시간:</label>
                    <input
                        type="datetime-local"
                        value={startedAt}
                        onChange={handleStartDate}
                    />
                    <label>종료 시간:</label>
                    <input
                        type="datetime-local"
                        value={endedAt}
                        onChange={handleEndDate}
                    />
                </div>
                <div className="modal-actions">
                    <button onClick={onClose}>취소</button>
                    <button onClick={handleSubmit}>저장</button>
                </div>
            </div>

            <div className={`custom-modal-message ${showModalMessage ? 'show' : ''}`}>
                {showModalMessage}
            </div>
        </div>
    );
};

export default TimeChooseModal;
