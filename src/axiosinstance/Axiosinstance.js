// services/tokenService.js
import axios from 'axios';

// 갱신 중인지 확인하는 플래그
let isRefreshing = false;

// 대기 중인 요청을 저장하는 배열
let refreshSubscribers = [];

// 새로운 토큰을 대기 중인 요청에 전달하는 함수
const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = []; // 모든 대기 중인 요청 초기화
};

// 대기 중인 요청에 콜백을 추가하는 함수
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

// Refresh Token을 사용하여 새로운 Access Token을 요청하는 함수
const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await axios.post('http://localhost:8080/auth/refresh', {
            refreshToken: refreshToken,
        });

        const newAccessToken = response.data; // 서버에서 반환된 새로운 Access Token
        localStorage.setItem('token', newAccessToken); // 새로운 Access Token 저장

        return newAccessToken;
    } catch (error) {
        console.error("토큰 갱신 중 오류 발생:", error);
        throw error;
    }
};

// Axios 인스턴스 생성
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // API의 기본 URL 설정
});

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 토큰이 만료되었고 이 요청이 아직 재시도되지 않았다면
        if (error.response.status === 500 && !originalRequest._retry) { // 401 코드로 변경
            console.error("응답 에러:", error);

            if (!isRefreshing) {
                isRefreshing = true;
                originalRequest._retry = true;

                try {
                    const newAccessToken = await refreshToken();
                    isRefreshing = false;
                    onRefreshed(newAccessToken); // 새로운 토큰으로 대기 중인 요청 해결

                    // 원래 요청을 새로운 토큰으로 다시 시도
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    isRefreshing = false;
                    refreshSubscribers = [];
                    return Promise.reject(refreshError);
                }
            } else {
                // 이미 갱신 중이라면 대기
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((newToken) => {
                        // 대기 중인 요청이 새로운 토큰을 사용하여 재시도
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }
        }

        return Promise.reject(error);
    }
);
