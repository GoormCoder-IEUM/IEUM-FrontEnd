import React, { useState, useEffect } from "react";
import "../style/SetDetail.css";
import { axiosInstance } from '../axiosinstance/Axiosinstance';
import TimeChooseModal from "../modal/TimeChooseModal";

const SetDetail = ({ planId, selectedDates }) => {
    const [sharedPlace, setSharedPlace] = useState([]);
    const [isInfoVisible, setIsInfoVisible] = useState(true);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [hasFetchedPlaces, setHasFetchedPlaces] = useState(false);
    const [hasFetchedSharedPlaces, setHasFetchedSharedPlaces] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // 시간 설정 모달
    const [showModalMessage, setShowModalMessage] = useState(""); // 알림용 모달
    const [dailyPlaces, setDailyPlaces] = useState([]); // 일자별 일정 조회
    const [selectedDate, setSelectedDate] = useState(null);
    const [day, setDay] = useState("1"); // 날짜 선택용
    const [calcDateResult, setCalcDateResult] = useState(""); // 날짜 계산용


    // 일정 조회
    useEffect(() => {
        const fetchSharedPlaces = async () => {
            if (!hasFetchedPlaces) {
                try {
                    const response = await axiosInstance.get(`/plans/${planId}/places/shared`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    setSharedPlace(response.data);
                    setHasFetchedPlaces(true);
                    console.log("Shared places response:", response.data);
                } catch (error) {
                    console.error("요청 중 오류 발생:", error);
                }
            }
        };
        fetchSharedPlaces();
    }, [hasFetchedPlaces]);

    // 일자별 일정 조회
    useEffect(() => {
        const fetchDailyPlaces = async () => {
            console.log("요청 : ", `/plans/${planId}/places/shared/${day}`);
            if (!hasFetchedSharedPlaces) {
                try {
                    const response = await axiosInstance.get(`/plans/${planId}/places/shared/${day}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    setDailyPlaces(response.data);
                    setSelectedDate(day);
                    setHasFetchedSharedPlaces(true);
                    console.log("Daily places response:", response.data);
                } catch (error) {
                    console.error("일자별 일정 조회 중 오류 발생:", error);
                }
            }
        };
        fetchDailyPlaces();
    }, [day, hasFetchedSharedPlaces]);


    // 조회할 날 선택
    useEffect(() => {
        setHasFetchedSharedPlaces(false);
        console.log(day);
    }, [day]);
    
    const handleDayChange = (event) => {
        setDay(event.target.value);
    };
    

    // 삭제 요청
    const handleDeletePlace = async (placeId) => {
        try {
            await axiosInstance.delete(`/plans/${planId}/places/${placeId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log("Place deleted:", placeId);
            setHasFetchedPlaces(false);
            setHasFetchedSharedPlaces(false);
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
        }
    };

    const toggleInfoVisibility = () => {
        setIsInfoVisible(!isInfoVisible);
    };

    const handlePlaceClick = (place) => {
        setSelectedPlace(place);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedPlace(null);
    };

    // 방문 시간 설정
    const handleTimeSubmit = async (startedAt, endedAt) => {
        console.log("StartedAt:", startedAt);
        console.log("EndedAt:", endedAt);
        if (!startedAt || !endedAt) {
            setShowModalMessage("시작 시간과 종료 시간을 모두 입력하세요.");
            return;
        }

        if (new Date(endedAt) <= new Date(startedAt)) {
            setShowModalMessage("종료 시간이 시작 시간보다 빠릅니다. 올바른 시간을 입력하세요.");
            return;
        }

        if (selectedPlace) {
            try {
                await axiosInstance.patch(`/plans/${planId}/places/${selectedPlace.id}`, {
                    startedAt,
                    endedAt,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setShowModalMessage("방문 시간이 설정되었습니다.");
                handleModalClose();
                setHasFetchedPlaces(false);
                setHasFetchedSharedPlaces(false);
            } catch (error) {
                console.error("시간 설정 중 오류 발생:", error);
                setShowModalMessage(error.response.data);
            }
        }
    };

    // 날짜 표기 수정
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}월${day}일 ${hours}:${minutes}`;
    };

    // 일자 계산 함수
    useEffect(() => {
        const calcDate = () => {
            // 입력된 문자열에서 날짜를 분리
            const [startDateString, endDateString] = selectedDates.split(" ~ ");

            // 문자열을 Date 객체로 변환
            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);

            // 두 날짜 간의 차이 계산 (밀리초 단위)
            const timeDifference = endDate - startDate;

            // 밀리초를 일 단위로 변환
            const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

            // 일차는 첫날을 1일차로 계산해야 하므로, 차이 값에 1을 더해 반환
            return dayDifference + 1;
        }
        const result = calcDate(selectedDates);
        setCalcDateResult(result);
    }, []);

    // 메시지용 모달
    useEffect(() => {
        if (showModalMessage) {
            setTimeout(() => {
                setShowModalMessage("");
            }, 3000);

            setTimeout(() => {
                document.querySelector('.custom-modal-message').classList.add('fade-out');
            }, 2500);
        }
    }, [showModalMessage]);

    return (
        <div className="step3-container">
            <div className="detail-container">
                <div className="detail-container-info">
                    <h2>일정 상세 설정</h2>
                    <p>등록한 장소들의 방문 시기를 설정합니다.</p>
                    <div className="info-section">
                        <button onClick={toggleInfoVisibility} className="toggle-info-btn">
                            {isInfoVisible ? "접기" : "펼치기"}
                        </button>
                        {isInfoVisible && (
                            <div>
                                <div>장소를 <strong>클릭</strong>하면 방문시간을 설정합니다.</div>
                                <br />
                                <div>명소인 경우 <strong className="place-item-category-1">색상</strong>으로 표기됩니다.</div>
                                <div>식당,카페인 경우 <strong className="place-item-category-2">색상</strong>으로 표기됩니다.</div>
                                <div>숙소인 경우 <strong className="place-item-category-3">색상</strong>으로 표기됩니다.</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="place-item-wrap">
                    {sharedPlace.map((place) => (
                        <div key={place.id} className="place-item-container">
                            <div className="place-item" onClick={() => handlePlaceClick(place)}>
                                <h3 className={`place-item-category-${place.categoryId}`}>{place.placeName}</h3>
                                <p>{place.address}</p>
                                <p>{formatDate(place.startedAt)}~{formatDate(place.endedAt)}</p>
                            </div>
                            <button className="delete-btn" onClick={() => handleDeletePlace(place.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="selected-places">
                <h2>일자별 일정 조회</h2>
                <select onChange={handleDayChange}>
                    {[...Array(calcDateResult)].map((_, index) => (
                        <option key={index} value={index + 1}>{index + 1}일차</option>
                    ))}
                </select>
                {selectedDate && (
                    <div className="daily-item-wrap">
                        <h3>{selectedDate}일차 일정</h3>
                        {dailyPlaces.map((place) => (
                            <div key={place.id} className="place-item-container">
                                <div className="place-item">
                                    <h3 className={`place-item-category-${place.categoryId}`}>{place.placeName}</h3>
                                    <p>{place.address}</p>
                                    <p>{formatDate(place.startedAt)}~{formatDate(place.endedAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && selectedPlace && (
                <TimeChooseModal
                    place={selectedPlace}
                    onClose={handleModalClose}
                    onSubmit={handleTimeSubmit}
                />
            )}

            <div className={`custom-modal-message ${showModalMessage ? 'show' : ''}`}>
                {showModalMessage}
            </div>

        </div>
    );

};

export default SetDetail;
