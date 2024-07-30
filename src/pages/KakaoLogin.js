import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const KakaoLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");

        console.log("code : ", code);

        const fetchKakaoLogin = async () => {
            try {
                const registrationId = 'kakao';

                const response = await axios.get(
                    `http://localhost:8080/auth/${registrationId}/login`, {
                    params: { code }
                }
                );
                console.log("로그인 응답 :", response.data);

                localStorage.setItem("token", response.data.accessToken);

                navigate('/');

            } catch (error) {
                console.error("로그인 에러", error);
            }
        };

        fetchKakaoLogin();

    }, [navigate]);

    return (
        <div>로그인 중입니다.</div>
    )
}

export default KakaoLogin;
