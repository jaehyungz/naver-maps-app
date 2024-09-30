"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { useMap } from "@/app/hooks/useMap";
import { zoomData } from "@/app/utils/data";

interface Props {
  lat: number;
  lng: number;
  name: string;
  // isBig: boolean;
}

const dummyApi = (): Promise<Props[]> => {
  return new Promise((resolve) => {
    const locations = [];

    for (let i = 0; i < 1600; i++) {
      const lat = Math.random() * (38 - 33) + 33;
      const lng = Math.random() * (129 - 126) + 126;

      locations.push({ lat, lng, name: `매물${i}호`, isBig: false });
    }
    // for (let i = 0; i < zoomData.length; i++) {
    //   const el = zoomData[i];

    //   locations.push({
    //     lat: el.lat,
    //     lng: el.lng,
    //     name: el.content.shortName,
    //     isBig: true,
    //   });
    // }

    resolve(locations);
  });
};

const dummyZoomData = (): Promise<Props[]> => {
  return new Promise((resolve) => {
    const locations = [];

    for (let i = 0; i < zoomData.length; i++) {
      const el = zoomData[i];

      locations.push({
        lat: el.lat,
        lng: el.lng,
        name: el.content.shortName,
        // isBig: true,
      });
    }

    resolve(locations);
  });
};

function MapView() {
  const mapRef = useMap();

  const overlaysRef = useRef<naver.maps.OverlayView[]>([]); // 오버레이 배열을 저장할 ref

  const [zoomState, setZoomState] = useState(13);

  const createMarkers = async () => {
    const map = mapRef.current ?? undefined;

    if (!map) return;

    let markers: naver.maps.Marker[] = [];

    const array = zoomState > 10 ? await dummyApi() : await dummyZoomData();

    array.forEach((v) => {
      const position = new naver.maps.LatLng(v.lat, v.lng);

      var marker = new naver.maps.Marker({
        position,
        map,
      });

      markers.push(marker);
    });

    // updateMarkers(markers);

    naver.maps.Event.addListener(map, "idle", () => {
      updateMarkers(markers);
    });
  };

  const createOverlays = async (
    // zoom: number,
    map: naver.maps.Map | undefined,
    data: Props[]
  ) => {
    // const map = mapRef.current ?? undefined;

    if (!map) return;

    const bounds = map.getBounds();

    const overlays: naver.maps.OverlayView[] = [];

    // const array = zoom < 12 ? await dummyZoomData() : await dummyApi();
    // const array = await dummyApi();
    // const array = await dummyZoomData();

    data.forEach((v) => {
      const position = new naver.maps.LatLng(v.lat, v.lng);

      const overlay = new naver.maps.OverlayView();

      const overlayElement = document.createElement("div");

      overlayElement.classList.add("overlay");

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

      overlays.push(overlay);
      overlaysRef.current = overlays;

      if (bounds.hasPoint(position)) {
        overlay.setMap(map);
      } else {
        overlay.setMap(null);
      }
    });

    // updateOverlays(overlays);

    // 처음엔 실행안함
    naver.maps.Event.addListener(map, "idle", () => {
      setZoomState(map.getZoom());
      // console.log(map.getZoom());
      updateOverlays(overlays, map.getZoom());
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

  const updateOverlays = (overlays: naver.maps.OverlayView[], zoom: number) => {
    console.log(zoom);
    const map = mapRef.current;
    if (!map) return;
    const bounds = map.getBounds();

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

  const updateMarkers = (markers: naver.maps.Marker[]) => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = map.getBounds();

    for (let index = 0; index < markers.length; index++) {
      const marker = markers[index];
      const position = marker.getPosition();

      if (bounds.hasPoint(position)) {
        showMarker(map, marker);
      } else {
        hideMarker(marker);
      }
    }
  };

  function showMarker(map: naver.maps.Map, marker: naver.maps.Marker) {
    if (marker.getMap()) return;
    marker.setMap(map);
  }

  function hideMarker(marker: naver.maps.Marker) {
    if (!marker.getMap()) return;
    marker.setMap(null);
  }
  // const [data, setData] = useState<Props[]>([]);

  // useMemo(async () => {
  //   const data = zoom > 11 ? await dummyApi() : await dummyZoomData();

  //   setData(data);
  // }, [zoom]);

  useMemo(async () => {
    const data = await dummyApi();

    // const data = zoom > 11 ? await dummyApi() : await dummyZoomData();
    createOverlays(mapRef.current, data);
  }, [mapRef.current]);

  return (
    <div className="map" id="map">
      <div className="zoom">{zoomState}</div>
      <div
        className="button"
        onClick={() => {
          // overlaysRef.current.forEach((overaly) => overaly.setMap(null));
          // overlaysRef.current = [];
        }}
      >
        {zoomState}
      </div>
    </div>
  );
}

export default MapView;
