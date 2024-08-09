import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../style/MainPage.css";
import PlaceIntroModal from "../modal/PlaceIntroModal";
import NoLoginModal from "../modal/NoLoginModal"; // NoLoginModal 컴포넌트 가져오기

const MainPage = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [data, setData] = useState([]);
  const [isLogin, setIsLogin] = useState(false); // 로그인 상태를 관리하기 위한 상태
  const [isNoLoginModalOpen, setIsNoLoginModalOpen] = useState(false); // NoLoginModal 상태
  const searchContainerRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 token을 확인하여 로그인 상태를 설정합니다.
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

    const fetchDestinationData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/plans');
        setData(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error('데이터 가져오기 에러:', error);
      }
    };

    fetchDestinationData();
  }, []);

  const handleButtonClick = () => {
    if (isLogin) {
      setIsSearchActive(true);
    } else {
      setIsNoLoginModalOpen(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  useEffect(() => {
    let results;
    if (searchQuery) {
      results = data.filter(item =>
        item.krName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.enName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      results = data;
    }
    setSearchResults(results);
  }, [searchQuery, data]);

  const handleClickOutside = (event) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target) &&
      (!modalRef.current || !modalRef.current.contains(event.target))
    ) {
      setIsSearchActive(false);
      setSearchQuery("");
      setSearchResults(data);
    }
  };

  useEffect(() => {
    if (isSearchActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchActive]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchQuery("");
    setSearchResults(data);
  };

  const handleNoLoginModalClose = () => {
    setIsNoLoginModalOpen(false);
  };

  const handleGoToLogin = () => {
    window.location.href = "/login"; // 예시로 "/login" 경로로 이동
  };

  return (
    <div className="main-container">
      <div className="text-container">
        <h1>함께라서 더 즐거운 여행 <br/> IEUM과 함께라면 더욱 간편하게!</h1>
        <p>항상 계획하기 어려웠던 여행 <strong>IEUM</strong>을 통해 쉽게 계획하고 즐겁게 다녀오자.</p>
        {!isSearchActive ? (
          <button className="start-button" onClick={handleButtonClick}>
            여행지 선택하기
          </button>
        ) : (
          <div className="search-container" ref={searchContainerRef}>
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
            />
            <ul className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <li key={result.id} onClick={() => handleResultClick(result)}>
                    {result.krName} ({result.enName})
                  </li>
                ))
              ) : (
                <li className="no-results">검색 결과 없음</li>
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="video-container">
        <video autoPlay muted loop>
          <source src="/assets/main_video.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      </div>
      <PlaceIntroModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        krName={modalContent.krName}
        enName={modalContent.enName}
        content={modalContent.description}
        destinationId={modalContent.id}
        modalRef={modalRef}
      />
      <NoLoginModal 
        isOpen={isNoLoginModalOpen} 
        onClose={handleNoLoginModalClose}
        onGoToLogin={handleGoToLogin}
      />
    </div>
  );
};

export default MainPage;
