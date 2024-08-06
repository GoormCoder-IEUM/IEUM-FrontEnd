import React from "react";
import { Link } from "react-router-dom";
import "../style/HeaderBar.css";

const HeaderBar = () => {
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
