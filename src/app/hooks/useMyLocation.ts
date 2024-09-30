import { useEffect, useState } from "react";

function useMyLocation() {
  const [location, setLocation] = useState({
    lat: 37.5296,
    lng: 126.9638,
  });

  const successCallback = (location: {
    coords: { latitude: number; longitude: number };
  }) => {
    setLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };
  // 내 현재 위치 값 반환 실패 시 실행 함수 -> 지도 중심을 서울시청 위치로 설정
  const errorCallback = () => {
    console.log("error!");
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
  }, []);

  return location;
}

export default useMyLocation;
