import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import MainPage from "./pages/MainPage";

import Schedule from "./pages/Schedule";

import HeaderBar from "./pages/HeaderBar";
import SelectDestination from "./pages/SelectDestination";
import SelectAccommodation from "./pages/SelectAccommodation";
import FinalData from "./pages/FinalData";
import ContryIntroModal from "./modal/ContryIntroModal";
import DateChooseModal from "./modal/DateChooseModal";
import PlaceIntroModal from "./modal/PlaceIntroModal";
import StayIntroModal from "./modal/StayIntroModal";
import KakaoMap from "./pages/KakaoMap";
import Chat from "./pages/Chat";


function App() {
  return (
    <Router>
      <HeaderBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/map" element={<KakaoMap/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/select-destination" element={<SelectDestination />} />
        <Route path="/select-accommodation" element={<SelectAccommodation />} />
        <Route path="/finaldata" element={<FinalData />} />
      </Routes>
      <KakaoMap/>
    </Router>
  );
}

export default App;
