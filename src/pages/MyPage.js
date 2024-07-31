import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import "../style/MyPage.css";
import UserEditModal from "../modal/UserEditModal";
import PasswordChangeModal from "../modal/PasswordChangeModal";
import ReceivedInvitationsModal from "../modal/ReceivedInvitationsModal";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("일정");
  const [events, setEvents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isInvitationsModalOpen, setIsInvitationsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birth: "",
  });
  const [passwordData, setPasswordData] = useState({
    previousPassword: "",
    newPassword: "",
  });
  const [invitations, setInvitations] = useState([]);
  const navigate = useNavigate();


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

    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/plans/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("전체 일정 조회 :", response);
        const formattedEvents = response.data.map((schedule) => ({
          title: schedule.destinationName,
          start: schedule.startedAt,
          end: schedule.endedAt,
        }));
        setSchedules(response.data);
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchMemberInfo();
    fetchSchedules();
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

  const openInvitationsModal = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/plan/members/invite`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvitations(response.data);
      console.log("받은초대: ", response.data);
      setIsInvitationsModalOpen(true);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const closeInvitationsModal = () => {
    setIsInvitationsModalOpen(false);
  };

  const handleAccept = async (planId, acceptance) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:8080/plan/members/invite/${planId}/${acceptance}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (acceptance === 'ACCEPT') {
        alert("초대를 수락했습니다.")
      }
      else {
        alert("초대를 거절했습니다.")
      }
      setInvitations((prevInvitations) =>
        prevInvitations.filter((invitation) => invitation.planId !== planId)
      );
      console.log(response.data);
      // Update invitations list or any other state if needed
    } catch (error) {
      console.error("Error sending acceptance:", error);
    }
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
      console.log("비밀번호 변경 토큰:", token);
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

  const handleEditPlan = (schedule) => {
    const planIdForState = schedule.id
    console.log("마이페이지 planId : ", planIdForState);
    navigate('/schedule', { state: { planIdForState } });
  }

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
        <div className="profile-item" onClick={openInvitationsModal}>받은 초대 조회</div>
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
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <div key={schedule.id} className="schedule-item">
                    <div>목적지: {schedule.destinationName}</div>
                    <div>시작일: {new Date(schedule.startedAt).toLocaleDateString()}</div>
                    <div>종료일: {new Date(schedule.endedAt).toLocaleDateString()}</div>
                    <div>교통수단: {schedule.vehicle}</div>
                    <button onClick={() => handleEditPlan(schedule)}>일정 확인</button>
                  </div>
                ))
              ) : (
                <div className="placeholder">일정이 없습니다.</div>
              )}
            </div>
          ) : (
            <div className="mypage-calendar">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                height="100%"
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

      <ReceivedInvitationsModal
        isOpen={isInvitationsModalOpen}
        onClose={closeInvitationsModal}
        invitations={invitations}
        onAccept={handleAccept}
      />
    </div>
  );
};

export default MyPage;
