import React from "react";
import { Link } from "react-router-dom";
import "../style/HeaderBar.css";

const HeaderBar = () => {
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
      </ul>
    </nav>
  );
};

export default HeaderBar;
