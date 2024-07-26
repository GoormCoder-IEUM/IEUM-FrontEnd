import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import "../style/MyPage.css";
import UserEditModal from "../modal/UserEditModal";
import PasswordChangeModal from "../modal/PasswordChangeModal"; // 비밀번호 변경 모달 import

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("일정");
  const [events, setEvents] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // 비밀번호 변경 모달 상태
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birth: "",
  });
  const [passwordData, setPasswordData] = useState({
    previousPassword: "",
    newPassword: "",
  }); // 비밀번호 변경 데이터

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("마이페이지 토큰 :", token);
        const response = await axios.get(`http://localhost:8080/my-page`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMemberInfo(response.data);
      } catch (error) {
        console.error("Error fetching member info:", error);
      }
    };

    fetchMemberInfo();
  }, []);

  const handleDateClick = (arg) => {
    const title = prompt("Enter event title:");
    if (title) {
      setEvents([
        ...events,
        {
          title,
          start: arg.date,
          allDay: arg.allDay,
        },
      ]);
    }
  };

  const openEditModal = () => {
    setFormData({
      name: memberInfo.name,
      gender: memberInfo.gender,
      birth: new Date(memberInfo.birth).toISOString().substr(0, 10),
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openPasswordModal = () => {
    setPasswordData({
      previousPassword: "",
      newPassword: "",
    });
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevPasswordData) => ({
      ...prevPasswordData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/my-page`,
        {
          ...formData,
          birth: new Date(formData.birth).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMemberInfo(response.data);
      closeEditModal();
    } catch (error) {
      console.error("Error updating member info:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("비밀번호 변경 토큰:" ,token);
      const response = await axios.post(
        `http://localhost:8080/my-page/password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      closePasswordModal();
    } catch (error) {
      console.error("Error changing password:", error);
      alert("비밀번호 변경에 실패하였습니다.");
    }
  };

  return (
    <div className="mypage-container">
      <div className="profile-section">
        <h2>프로필</h2>
        {memberInfo ? (
          <>
            <div className="profile-item">이름: {memberInfo.name}</div>
            <div className="profile-item">아이디: {memberInfo.loginId}</div>
            <div className="profile-item">성별: {memberInfo.gender}</div>
            <div className="profile-item">생일: {new Date(memberInfo.birth).toLocaleDateString()}</div>
            <div className="profile-item">가입일: {new Date(memberInfo.createdAt).toLocaleDateString()}</div>
          </>
        ) : (
          <div>Loading...</div>
        )}
        <div className="profile-item" onClick={openEditModal}>회원 정보 수정</div>
        <div className="profile-item" onClick={openPasswordModal}>비밀번호 재설정</div>
        <div className="profile-item">회원탈퇴</div>
      </div>
      <div className="content-section">
        <div className="tabs">
          <div
            className={`tab ${activeTab === "일정" ? "active" : ""}`}
            onClick={() => setActiveTab("일정")}
          >
            일정
          </div>
          <div
            className={`tab ${activeTab === "캘린더" ? "active" : ""}`}
            onClick={() => setActiveTab("캘린더")}
          >
            캘린더
          </div>
        </div>
        <div className="content">
          {activeTab === "일정" ? (
            <div className="schedule">
              <div className="placeholder">일정 리스트</div>
            </div>
          ) : (
            <div className="calendar">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
              />
            </div>
          )}
        </div>
      </div>

      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleFormSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
      />

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        onSubmit={handlePasswordSubmit}
        formData={passwordData}
        handleInputChange={handlePasswordChange}
      />
    </div>
  );
};

export default MyPage;
