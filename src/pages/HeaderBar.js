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
    <nav>
      <ul>
        <div>
          <Link to="/">
            <img src="/assets/ieum_logo.png" alt="Logo" className="logo-image" />
          </Link>
        </div>

        <div className="nav-menu-container">
          <li className="nav-menu">
            <Link to="/login">Login</Link>
          </li>
          <li className="nav-menu">
            <Link to="/signup">Signup</Link>
          </li>
          <li className="nav-menu">
            <Link to="/mypage">My Page</Link>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default HeaderBar;
