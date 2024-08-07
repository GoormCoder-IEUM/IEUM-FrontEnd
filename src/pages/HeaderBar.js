import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/HeaderBar.css";

const HeaderBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    // 로그인 페이지로 리다이렉트
    navigate("/login");
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Main</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <Link to="/mypage">My Page</Link>
        </li>
        <li>
          <Link to="/schedule">Schedule</Link>
        </li>
        <li>
          <Link to="/select-destination">Select Destination</Link>
        </li>
        <li>
          <Link to="/select-accommodation">Select Accommodation</Link>
        </li>
        <li>
          <Link to="/finaldata">Finaldata</Link>
        </li>
        <li>
          <Link to="/chat">Chat</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderBar;
