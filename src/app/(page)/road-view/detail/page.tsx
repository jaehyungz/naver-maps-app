"use client";

import { useMap } from "@/app/hooks";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { useSearchParams } from "next/navigation";

function Page() {
  const searchParams = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  //   const mapRef = useMap();
  const mapRef = useRef<naver.maps.Map>();

  const panoRef = useRef<naver.maps.Panorama>();
  const markerRef = useRef<naver.maps.Marker>();
  const streetLayerRef = useRef<naver.maps.StreetLayer>();
  const overlayRef = useRef<naver.maps.OverlayView>();
  const overlayElementRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState({
    lat: lat ? lat : "37.5075",
    lng: lng ? lng : "127.0646",
  });

  useEffect(() => {
    if (!mapRef.current) {
      createMap();
    }

    handlePanorama(position);
    createMarker(position);
    // createOverlay(position);
  }, [position]);

  useEffect(() => {
    createRoadView();
  }, [mapRef.current]);

  function createMap() {
    const latlng = new naver.maps.LatLng(
      Number(position.lat),
      Number(position.lng)
    );

    mapRef.current = new naver.maps.Map("road-map", {
      center: new naver.maps.LatLng(latlng),
    });

    naver.maps.Event.addListener(mapRef.current, "click", (e) => {
      const coord = e.coord;
      setPosition({
        lat: coord.lat().toString(),
        lng: coord.lng().toString(),
      });
    });
  }

  function createMarker(position: { lat: string; lng: string }) {
    if (!mapRef.current) return;

    const latlng = new naver.maps.LatLng(
      Number(position.lat),
      Number(position.lng)
    );

    if (markerRef.current) {
      markerRef.current.setPosition(latlng);
      return;
    }

    markerRef.current = new naver.maps.Marker({
      position: latlng,
      map: mapRef.current,
      draggable: true,
      icon: {
        content: "<div class='arrow'></div>",
        anchor: new naver.maps.Point(0, 0),
      },
    });

    markerRef.current.addListener("dragend", (v) => {
      setPosition({
        lat: v.coord.lat().toString(),
        lng: v.coord.lng().toString(),
      });
    });
  }

  //   function createOverlay(position: { lat: string; lng: string }) {
  //     const latlng = new naver.maps.LatLng(
  //       Number(position.lat),
  //       Number(position.lng)
  //     );

  //     if (!mapRef.current) return;

  //     if (overlayRef.current) {
  //       overlayRef.current.setMap(null);
  //       overlayRef.current = undefined;
  //     }

  //     const overlay = new naver.maps.OverlayView();

  //     const overlayElement = document.createElement("div");

  //     overlayElement.classList.add("arrow");

  //     overlayElementRef.current = overlayElement;

  //     overlay.onAdd = () => {
  //       const overlayLayer = overlay.getPanes().overlayLayer;
  //       overlayLayer.appendChild(overlayElement);
  //     };
  //     overlay.draw = () => {
  //       if (!overlay.getMap()) return;

  //       const projection = overlay.getProjection();
  //       const pixelPosition = projection.fromCoordToOffset(latlng);

  //       overlayElement.style.left = `${pixelPosition.x}px`;
  //       overlayElement.style.top = `${pixelPosition.y}px`;

  //       const pan = panoRef.current?.getPov().pan ?? 0;
  //       const round = Math.round(pan);

  //       overlayElement.style.setProperty("transform", `rotate(${round}deg)`);
  //     };

  //     overlay.onRemove = () => {
  //       if (overlayElement.parentNode) {
  //         overlayElement.parentNode.removeChild(overlayElement);
  //       }
  //     };

  //     overlay.setMap(mapRef.current);
  //     overlayRef.current = overlay;
  //   }

  function createRoadView() {
    if (!mapRef.current) return;
    const layer = new naver.maps.StreetLayer();

    layer.setMap(mapRef.current);
    streetLayerRef.current = layer;
  }

  function handlePanorama(position: { lat: string; lng: string }) {
    const latlng = new naver.maps.LatLng(
      Number(position.lat),
      Number(position.lng)
    );

    if (panoRef.current) {
      console.log("이미있는 pano position조정");

      panoRef.current.setPosition(latlng);
      return;
    }

    var pano;

    console.log("처음 pano생성");
    pano = new naver.maps.Panorama("pano", {
      position: new naver.maps.LatLng(latlng),
    });

    panoRef.current = pano;

    panoRef.current.addListener("pov_changed", () => {
      const pan = panoRef.current?.getPov().pan ?? 0;
      const round = Math.round(pan);

      if (markerRef.current) {
        const el = markerRef.current.getElement()
          .childNodes[0] as HTMLDivElement;
        el.style.setProperty("transform", `rotate(${round}deg)`);
      }
    });

    panoRef.current.addListener("pano_changed", () => {
      console.log("pano_changed");
      const coord = panoRef.current?.getLocation().coord;
      createMarker({
        lat: coord?.lat().toString() ?? "",
        lng: coord?.lng().toString() ?? "",
      });
    });
  }

  return (
    <div className="road-view-container">
      <div id="pano" />
      <div id="road-map" />
    </div>
  );
}

export default Page;
