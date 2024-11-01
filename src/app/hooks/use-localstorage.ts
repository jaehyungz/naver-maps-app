import { useEffect, useState } from "react";

const zoomState = (() => {
  const zoomCookieValue =
    typeof window === "undefined" ? null : localStorage.getItem("zoom");

  const zoomValue = zoomCookieValue ? Number(zoomCookieValue) : null;

  if (typeof zoomValue === "number" && !isNaN(zoomValue)) {
    if (zoomValue >= 10 && zoomValue <= 21) {
      return zoomValue;
    }
  }

  return 13; // 기본값
})();

function centerState(str: any): { lat: number; lng: number } {
  try {
    if (!str) {
      return {
        lat: 37.500417673083625,
        lng: 127.07855114783959,
      };
    }

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
    lat: 37.500417673083625,
    lng: 127.07855114783959,
  };
}

export function useZoomState() {
  //   const [state, setState] = useState(() => {
  //     return typeof window === "undefined"
  //       ? null
  //       : JSON.parse(window.localStorage.getItem(key) || initialState);
  //   });
  const [state, setState] = useState<number>(zoomState);

  useEffect(() => {
    window.localStorage.setItem("zoom", JSON.stringify(state));
  }, [state]);

  return { state, setState };
}

export function useCenterState() {
  const [state, setState] = useState<{ lat: number; lng: number }>(() =>
    centerState(
      typeof window === "undefined" ? null : localStorage.getItem("center")
    )
  );

  useEffect(() => {
    window.localStorage.setItem("center", JSON.stringify(state));
  }, [state]);

  return { state, setState };
}
