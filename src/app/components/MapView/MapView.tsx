"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { useMap } from "@/app/hooks/useMap";
import MapSideBar from "../MapSideBar";

interface Props {
  lat: number;
  lng: number;
  name: string;
  size: "big" | "small";
}

function MapView() {
  const mapRef = useMap();

  const overlaysRef = useRef<naver.maps.OverlayView[]>([]); // 오버레이 배열을 저장할 ref

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [zoomState, setZoomState] = useState(13);

  const [data, setData] = useState<Props[]>([]);

  const createOverlays = async (
    map: naver.maps.Map | undefined,
    data: Props[]
  ) => {
    if (!map) return;

    const bounds = map.getBounds();

    data.forEach((v) => {
      const position = new naver.maps.LatLng(v.lat, v.lng);

      const overlay = new naver.maps.OverlayView();

      const overlayElement = document.createElement("div");

      overlayElement.classList.add(
        v.size === "big" ? "overlay-big" : "overlay"
      );

      overlayElement.textContent = v.name;

      overlay.set("position", position);
      overlay.onAdd = () => {
        const overlayLayer = overlay.getPanes().overlayLayer;
        overlayLayer.appendChild(overlayElement);

        // overlayElement.addEventListener("click", () => onMouseClick(position));
        overlayElement.addEventListener("mouseover", onMouseOver);
        overlayElement.addEventListener("mouseout", onMouseOut);
      };

      overlay.draw = () => {
        if (!overlay.getMap()) return;

        const projection = overlay.getProjection();
        const pixelPosition = projection.fromCoordToOffset(position);

        overlayElement.style.left = `${pixelPosition.x}px`;
        overlayElement.style.top = `${pixelPosition.y}px`;
      };
      overlay.onRemove = () => {
        if (overlayElement.parentNode) {
          overlayElement.parentNode.removeChild(overlayElement);
        }
      };

      overlaysRef.current.push(overlay);

      if (bounds.hasPoint(position)) {
        overlay.setMap(map);
      } else {
        overlay.setMap(null);
      }
    });

    naver.maps.Event.addListener(map, "zoom_changed", (zoom) => {
      setZoomState(zoom);
    });
    naver.maps.Event.addListener(map, "zoomend", () => {
      overlaysRef.current.forEach((v) => v.setMap(null));
      overlaysRef.current = [];
    });

    // 처음엔 실행안함
    naver.maps.Event.addListener(map, "idle", () => {
      updateOverlays();
    });
  };

  const onMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;

    target.classList.add("z-10");
  };
  const onMouseOut = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;

    target.classList.remove("z-10");
  };

  const updateOverlays = () => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = map.getBounds();
    const overlays = overlaysRef.current;

    for (let index = 0; index < overlays.length; index++) {
      const overlay = overlays[index];
      const position = overlay.get("position");

      if (bounds.hasPoint(position)) {
        showOverlay(map, overlay);
      } else {
        hideOverlay(overlay);
      }
    }
  };

  function showOverlay(map: naver.maps.Map, overaly: naver.maps.OverlayView) {
    if (overaly.getMap()) return;
    overaly.setMap(map);
  }

  function hideOverlay(overlay: naver.maps.OverlayView) {
    if (!overlay.getMap()) return;
    overlay.setMap(null);
  }

  useEffect(() => {
    async function fetchData() {
      const params = {
        level: zoomState.toString(),
      };
      const queryString = new URLSearchParams(params).toString(); // url에 쓰기 적합한 querySting으로 return 해준다.

      const data = await fetch(`/api/map?${queryString}`);
      const res = await data.json();
      setData(res.data);
    }

    fetchData();
  }, [zoomState]);

  useMemo(() => {
    if (mapRef.current) {
      createOverlays(mapRef.current, data);
    }
  }, [mapRef.current, data]);

  return (
    <div className="map" id="map">
      <MapSideBar />
    </div>
  );
}

export default MapView;
