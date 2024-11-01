"use client";

import { useMap } from "@/app/hooks";
import { marker } from "framer-motion/client";
import React, { useEffect, useRef, useState } from "react";

import "./style.css";
import { useRouter } from "next/navigation";

interface Props {}

function Page(props: Props) {
  const {} = props;

  const router = useRouter();

  const mapRef = useMap();

  const StreetLayerRef = useRef<naver.maps.StreetLayer>();
  const panoRef = useRef<naver.maps.Panorama>();
  const markerRef = useRef<naver.maps.Marker>();
  const overlayRef = useRef<naver.maps.OverlayView>();
  const fakeOverlayRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const lineRef = useRef<HTMLDivElement | null>(null);

  const [isRoadView, setIsRoadView] = useState(false);

  const createRoadView = () => {
    if (!mapRef.current) return;
    const layer = new naver.maps.StreetLayer();
    if (!isRoadView) {
      StreetLayerRef.current?.setMap(null);
      StreetLayerRef.current = undefined;
    }

    if (isRoadView) {
      naver.maps.Event.addListener(mapRef.current, "click", (e) => {
        const position = e.coord;
        initPanorama(position);
        // createMarker(position);
        // createOverlay(position);
      });

      layer.setMap(mapRef.current);

      StreetLayerRef.current = layer;
      return;
    }
  };

  function createOverlay(latlng: naver.maps.LatLng) {
    if (!mapRef.current) return;

    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = undefined;
    }

    const overlay = new naver.maps.OverlayView();

    const overlayElement = document.createElement("div");

    fakeOverlayRef.current = overlayElement;
    overlayElement.classList.add("arrow");

    overlay.onAdd = () => {
      const overlayLayer = overlay.getPanes().overlayLayer;
      overlayLayer.appendChild(overlayElement);
    };

    overlay.draw = () => {
      if (!overlay.getMap()) return;

      const projection = overlay.getProjection();
      const pixelPosition = projection.fromCoordToOffset(latlng);

      overlayElement.style.left = `${pixelPosition.x}px`;
      overlayElement.style.top = `${pixelPosition.y}px`;

      const pan = panoRef.current?.getPov().pan ?? 0;
      const round = Math.round(pan);

      overlayElement.style.setProperty("transform", `rotate(${round}deg)`);
    };

    overlay.onRemove = () => {
      if (overlayElement.parentNode) {
        overlayElement.parentNode.removeChild(overlayElement);
      }
    };

    overlay.setMap(mapRef.current);
    overlayRef.current = overlay;
  }
  function createMarker(latlng: naver.maps.LatLng) {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.setPosition(latlng);

      return;
    }

    markerRef.current = new naver.maps.Marker({
      position: latlng,

      map: mapRef.current,
    });
  }

  function initPanorama(latlng: naver.maps.LatLng) {
    if (!mapRef.current) return;

    const lat = latlng.lat();
    const lng = latlng.lng();

    router.push(`/road-view/detail?lat=${lat}&lng=${lng}`);
    // window.open(`/road-view/detail?lat=${lat}&lng=${lng}`);
  }

  useEffect(() => {
    // if (mapRef.current) {
    createRoadView();
    //   initPanorama();
    // }
  }, [isRoadView]);

  return (
    <div className="road-view-container" style={{ display: "flex" }}>
      {/* <div className="line" ref={lineRef}></div> */}

      <button className="button" onClick={() => setIsRoadView((prev) => !prev)}>
        {isRoadView ? "일반 지도로 전환" : "로드뷰로 전환"}
      </button>

      <div id="map" ref={mapContainerRef} />

      {/* <div id="pano" /> */}
    </div>
  );
}

export default Page;
