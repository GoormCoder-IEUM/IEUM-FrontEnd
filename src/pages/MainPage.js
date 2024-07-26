import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../style/MainPage.css";
import PlaceIntroModal from "../modal/PlaceIntroModal";

const MainPage = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [data, setData] = useState([]);
  const searchContainerRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/plans');
        setData(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDestinationData();
  }, []);

  const handleButtonClick = () => {
    setIsSearchActive(true);
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

  return (
    <div className="main-container">
      <div className="text-container">
        <h1>엉엉엉 엉엉엉엉 엉엉 엉엉엉 엉엉 엉엉엉</h1>
        <p>엉엉엉 엉엉 엉엉 <strong>엉엉엉</strong> 엉엉엉엉 엉엉 엉 엉 엉엉 엉엉엉엉 엉엉엉엉.</p>
        {!isSearchActive ? (
          <button className="start-button" onClick={handleButtonClick}>
            엉엉엉 엉엉엉엉
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
          Your browser does not support the video tag.
        </video>
      </div>
      <PlaceIntroModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        krName={modalContent.krName}
        enName={modalContent.enName}
        content={modalContent.description}
        id={modalContent.id}
        modalRef={modalRef}
      />
    </div>
  );
};

export default MainPage;
