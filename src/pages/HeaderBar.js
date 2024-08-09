import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/HeaderBar.css";
import logo from "../img/Logo.png";

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
    <nav className="header-bar">
      <ul className="nav-list">
        <li className="nav-item-img">
          <img src={logo} alt="Logo" className="logo" />
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">Login</Link>
        </li>
        <li className="nav-item">
          <Link to="/signup" className="nav-link">Signup</Link>
        </li>
        <li className="nav-item">
          <Link to="/mypage" className="nav-link">My Page</Link>
        </li>
        <li className="nav-item">
          <Link to="/schedule" className="nav-link">Schedule</Link>
        </li>
        <li className="nav-item">
          <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderBar;
