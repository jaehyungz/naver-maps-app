import { useEffect, useRef, useState } from "react";
import useMyLocation from "./useMyLocation";

function convertCenter(str: any): { lat: number; lng: number } {
  try {
    const parsedData = JSON.parse(str);

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
  } catch (error) {
    console.error(error);
  }
  return {
    lat: 37.5075,
    lng: 127.0646,
  };
}

export function useMap() {
  const mapRef = useRef<naver.maps.Map>();

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

    mapRef.current = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(position.lat, position.lng),
      zoom: zoomState,
      minZoom: 10,
    });
  }, []);

  return mapRef;
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
