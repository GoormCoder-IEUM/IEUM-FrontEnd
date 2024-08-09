import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/HeaderBar.css";
import logo from "../img/Logo.png";

const HeaderBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    // Redirect to login page
    navigate("/login");
  };

  // Check if the user is logged in by looking for the token
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav>
      <ul>
        <div>
          <Link to="/">
            <img src="/assets/ieum_logo.png" alt="Logo" className="logo-image" />
          </Link>
        </div>

        <div className="nav-menu-container">
          {isLoggedIn ? (
            <>
              <li className="nav-menu">
                <Link to="/mypage">My Page</Link>
              </li>
              <li className="nav-menu">
                <Link to="/citychoose">여행지</Link>
              </li>
              <li className="nav-menu">
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-menu">
                <Link to="/login">Login</Link>
              </li>
              <li className="nav-menu">
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default HeaderBar;
