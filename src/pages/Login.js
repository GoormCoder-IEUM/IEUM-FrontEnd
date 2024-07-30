import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Login.css";

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 카카오 로그인
  const Rest_api_key = '57d8ed74ba0df4a9a24520ab381936d7' //REST API KEY
  const redirect_uri = 'http://localhost:3000/kakaologin' //Redirect URI
  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
  
  
  const handleKakaoLogin = () => {
    window.location.href = kakaoURL
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const loginData = {
      loginId: loginId,
      password: password,
    };

    try {
      const response = await axios.post("http://localhost:8080/auth/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Login successful", response.data, loginData);
      localStorage.setItem("token", response.data.accessToken);
      console.log("토큰", response.data.accessToken);
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed. Please check your credentials and try again.");
    }

    navigate('/');
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loginId">ID:</label>
          <input
            type="text"
            id="loginId"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Login</button>
      </form>

      <button className="kakao-btn" onClick={handleKakaoLogin}></button>

    </div>
  );
};

export default Login;
