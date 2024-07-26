import React, { useState } from "react";
import axios from "axios";
import "../style/Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const userData = {
      loginId: username,
      name,
      password,
      // birth: birthdate, 수정 필요함
      birth: "2024-07-23T01:13:01.307Z",
      gender,
    };

    try {
      const response = await axios.post("http://localhost:8080/auth/join", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("회원정보: ", userData);

      if (response.status === 200 || response.status === 201) {
        console.log("Signup successful");
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("Signup failed. Please check your details and try again.");
      console.log("회원정보: ", userData);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="birthdate">Birthdate:</label>
          <input
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
