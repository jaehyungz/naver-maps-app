import { useEffect, useRef, useState } from "react";
import useMyLocation from "./useMyLocation";

export function useMap() {
  const postion = useMyLocation();
  const mapRef = useRef<naver.maps.Map>();

  useEffect(() => {
    mapRef.current = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(
        // postion.lat ?? 37.5853418,
        // postion.lng ?? 127.2096612
        37.4899316,
        127.0298818
      ),

      // disableDoubleClickZoom: true,

      zoom: 13,
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
