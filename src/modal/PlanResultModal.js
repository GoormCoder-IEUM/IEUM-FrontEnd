import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../axiosinstance/Axiosinstance';
import '../style/PlanResultModal.css';

export const PlanResultModal = ({ show, planId, onClose }) => {
    const [sharedPlace, setSharedPlace] = useState({});

    useEffect(() => {
        const fetchSharedPlaces = async () => {
            try {
                const response = await axiosInstance.get(`/plans/${planId}/places/shared`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const sortedPlaces = response.data.sort((a, b) => {
                    return new Date(a.startedAt) - new Date(b.startedAt);
                });

                const groupedByDate = sortedPlaces.reduce((acc, place) => {
                    const date = new Date(place.startedAt).toISOString().split('T')[0];
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(place);
                    return acc;
                }, {});

                setSharedPlace(groupedByDate);
                console.log("Grouped places response:", groupedByDate);
            } catch (error) {
                console.error("요청 중 오류 발생:", error);
            }
        };

        fetchSharedPlaces();
    }, [planId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    if (!show) {
        return null;
    }

    return (
        <div className="result-modal-overlay">
            <div className="result-modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <div className="plan-result-container">
                    <div className="date-group-container for-modal">
                        {Object.keys(sharedPlace).map(date => (
                            <div key={date} className="date-group">
                                <h2>{date}</h2>
                                {Array.isArray(sharedPlace[date]) && sharedPlace[date].map((place, index) => (
                                    <React.Fragment key={place.id}>
                                        <div className="place-item-container">
                                            <div className="place-item">
                                                <div className="place-item-content"> 
                                                    <h3 className={`place-item-category-${place.categoryId}`}>{place.placeName}</h3>
                                                    <p>{place.address}</p>
                                                    <p>{formatDate(place.startedAt)} ~ {formatDate(place.endedAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {index < sharedPlace[date].length - 1 && (
                                            <div className="arrow-down"></div> 
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanResultModal;
