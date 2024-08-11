import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axiosinstance/Axiosinstance";
import "../style/InviteMemberModal.css";

const InviteMemberModal = ({ show, onClose, planId }) => {
    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [addedUsers, setAddedUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect (() => {
        if (show) {
            setKeyword("");
            setSearchResults([]);
            setAddedUsers([]);
            setError(null);
        }
        console.log("초대창일정아이디", planId);
    }, [show, planId])

    if (!show) {
        return null;
    }

    const handleSearch = async () => {
        try {
            const response = await axiosInstance.get(`/members/search/${keyword}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log("검색 결과 :", response.data);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching members:", error);
            setError("사용자 검색에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleAddUser = (user) => {
        if (user && !addedUsers.find((u) => u.id === user.id)) {
            setAddedUsers([...addedUsers, user]);
        }
    };

    const handleInvite = async () => {
        try {
            const response = await axiosInstance.post(
                `/plan/members/invite/${planId}`,
                { memberIds: addedUsers.map(user => user.id) },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log("Invite response:", response.data);
            onClose();
        } catch (error) {
            console.error("요청 중 오류 발생:", error);
            setError("초대 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };


    return (
        <div className="invitemembermodal">
            <div className="invitemembermodal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h1>새 멤버 초대</h1>
                {error && <p className="error">{error}</p>}
                <div className="user-search-section">
                    <input
                        type="text"
                        placeholder="사용자 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button className="user-search-btn" onClick={handleSearch}>검색</button>
                </div>
                <div className="user-search-results">
                    {searchResults.length > 0 && (
                        <ul>
                            {searchResults.map((result) => (
                                <li key={result.id}>
                                    {result.name}
                                    <button className="add-btn" onClick={() => handleAddUser(result)}>&#43;</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="added-ids-title">
                    <div>초대할 사용자</div>
                </div>
                <div className="added-ids">
                    {addedUsers.length > 0 && (
                        <ul>
                            {addedUsers.map((user) => (
                                <li key={user.id} data-aos="zoom-in">{user.name}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="inv-btn-wrap">
                    <button className="inv-btn" onClick={handleInvite}>초대</button>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberModal;

