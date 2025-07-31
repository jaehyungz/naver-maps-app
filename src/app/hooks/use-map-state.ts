import { useEffect, useRef, useState } from "react";

function convertCenter(str: any): { lat: number; lng: number } {
  const parsedData = JSON.parse(str);

  if (parsedData) {
    const isValidLat =
      typeof parsedData.lat === "number" &&
      parsedData.lat >= -90 &&
      parsedData.lat <= 90;
    const isValidLon =
      typeof parsedData.lng === "number" &&
      parsedData.lng >= -180 &&
      parsedData.lng <= 180;

    if (isValidLat && isValidLon) {
      return {
        lat: parsedData.lat,
        lng: parsedData.lng,
      };
    }
    return {
      lat: 37.508863665,
      lng: 127.063155294,
    };
  }

  return {
    lat: 37.508863665,
    lng: 127.063155294,
  };
}
export function useMapState() {
  const [map, setMap] = useState<naver.maps.Map>();

  useEffect(() => {
    const zoomState = (() => {
      const zoomCookieValue = localStorage.getItem("zoom");

      const zoomValue = zoomCookieValue ? Number(zoomCookieValue) : null;

      if (typeof zoomValue === "number" && !isNaN(zoomValue)) {
        if (zoomValue >= 10 && zoomValue <= 21) {
          return zoomValue;
        }
      }

      return 13; // 기본값
    })();

    const center = localStorage.getItem("center");

    const position = convertCenter(center);

    const obj = new naver.maps.Map("map2", {
      center: new naver.maps.LatLng(position.lat, position.lng),
      zoom: zoomState,
      minZoom: 10,
    });

    setMap(obj);
  }, []);

  return { map };
}

// const key = "464f59414a6a61653539715475786d";
// const baseURL = `http://openapi.seoul.go.kr:8088/${key}/json/busStopLocationXyInfo/1/1000/`;

// const res = await fetch(`${baseURL}`);
// if (!res.ok) {
//   return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
//     status: 500,
//     headers: { "Content-Type": "application/json" },
//   });
// }

// const data = await res.json();

// return new Response(JSON.stringify(data), {
//   status: 200,
//   headers: { "Content-Type": "application/json" },
// });
