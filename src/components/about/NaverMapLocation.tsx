'use client';

import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';
import { useEffect, useState } from 'react';

// Client 환경에서 렌더링하기 위한 래퍼(Wrapper) 
export default function NaverMapLocation() {
    const [isMounted, setIsMounted] = useState(false);
    // TODO: 환경변수 사용
    const ncpClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || '';

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="text-gray-400">지도를 불러오는 중입니다...</div>;
    }

    if (!ncpClientId) {
        return (
            <div className="text-center p-6 text-gray-500">
                <p className="mb-2">⚠️ 네이버 지도 API Client ID가 설정되지 않았습니다.</p>
                <p className="text-sm">`.env.local` 파일에 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`를 추가해주세요.</p>
            </div>
        );
    }

    // 기본 위도/경도 (예: 강남역 중심으로 임시 설정)
    const defaultLat = 37.4979;
    const defaultLng = 127.0276;

    return (
        <MapDiv style={{ width: '100%', height: '100%' }}>
            <NaverMap
                defaultCenter={{ lat: defaultLat, lng: defaultLng }}
                defaultZoom={15}
            >
                <Marker defaultPosition={{ lat: defaultLat, lng: defaultLng }} />
            </NaverMap>
        </MapDiv>
    );
}
