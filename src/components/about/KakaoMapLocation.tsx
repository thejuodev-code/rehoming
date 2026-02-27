'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}

export default function KakaoMapLocation() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID || '';

    // 인천광역시 남동구 논현로46번길 22 B동 1층 105호
    const lat = 37.4199;
    const lng = 126.7322;

    useEffect(() => {
        if (!mapRef.current) return;

        let intervalId: NodeJS.Timeout;

        const initMap = () => {
            try {
                window.kakao.maps.load(() => {
                    const position = new window.kakao.maps.LatLng(lat, lng);
                    const options = {
                        center: position,
                        level: 3,
                    };
                    const map = new window.kakao.maps.Map(mapRef.current, options);

                    // 마커 추가
                    const marker = new window.kakao.maps.Marker({
                        position: position,
                    });
                    marker.setMap(map);

                    // 인포윈도우(말풍선) 추가
                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: '<div style="padding:8px 12px;font-size:14px;font-weight:bold;color:#333;">리호밍센터</div>',
                    });
                    infowindow.open(map, marker);

                    setIsLoaded(true);
                });
            } catch (error) {
                console.error("Kakao Map initialization error:", error);
                setHasError(true);
            }
        };

        const checkKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                if (intervalId) clearInterval(intervalId);
                initMap();
            }
        };

        if (window.kakao && window.kakao.maps) {
            initMap();
        } else {
            intervalId = setInterval(checkKakaoMap, 100);

            // Timeout after 10 seconds empty map
            setTimeout(() => {
                if (!window.kakao || !window.kakao.maps) {
                    if (intervalId) clearInterval(intervalId);
                    setHasError(true);
                }
            }, 10000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!kakaoAppKey) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-6 text-gray-500 text-center">
                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <p className="mb-2 font-semibold text-gray-700">카카오 지도 API 키가 설정되지 않았습니다</p>
                <p className="text-sm text-gray-400">.env.local 파일에 NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID를 추가해주세요</p>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-500 text-sm p-4 text-center">
                지도를 불러오는 데 실패했습니다.<br />API 키나 네트워크 상태를 확인해주세요.
            </div>
        );
    }

    return (
        <>
            <div ref={mapRef} className="w-full h-full" />
            {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 text-sm">카카오 지도를 로딩 중입니다...</p>
                </div>
            )}
        </>
    );
}
