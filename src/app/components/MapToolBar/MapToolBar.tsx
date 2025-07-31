import React, { useEffect, useRef, useState } from "react";

import "./style.css";

interface Props {
  map: naver.maps.Map;
  onVisibleOverlay: () => void;
  overlayVisible: boolean;
}

function MapToolBar(props: Props) {
  const { map, onVisibleOverlay, overlayVisible } = props;

  const mapTypesArr = [
    {
      label: "지도",
      id: naver.maps.MapTypeId.NORMAL,
    },
    {
      label: "위성",
      id: naver.maps.MapTypeId.HYBRID,
    },
    {
      label: "지적",
      id: "cadastral",
    },
    {
      label: "거리",
      id: "road",
    },
  ];

  const cadastralLayerRef = useRef<naver.maps.CadastralLayer>();
  const roadViewLayerRef = useRef<naver.maps.StreetLayer>();

  const [mapType, setMapType] = useState<string>(map.getMapTypeId());

  const [isOpen, setIsOpen] = useState(false);

  //   const [isOverlayHide, setIsOverlayHide] = useState(false);

  // 지도유형 label 변환 유틸함수
  function convertMapName(type: string) {
    switch (type) {
      case naver.maps.MapTypeId.NORMAL:
        return "지도";
      case naver.maps.MapTypeId.HYBRID:
        return "위성";
      case "cadastral":
        return "지적";
      case "road":
        return "거리";
    }
  }

  // 지도유형 변환 함수
  const handleMapType = (type: string) => () => {
    setMapType(type);
    setIsOpen(false);

    switch (type) {
      case "cadastral":
        if (roadViewLayerRef.current) {
          roadViewLayerRef.current.setMap(null);
          roadViewLayerRef.current = undefined;
        }

        const cadastralLayer = new naver.maps.CadastralLayer();

        cadastralLayerRef.current = cadastralLayer;
        cadastralLayer.setMap(map);

        break;

      case "road":
        if (cadastralLayerRef.current) {
          cadastralLayerRef.current.setMap(null);
          cadastralLayerRef.current = undefined;
        }

        const roadViewLayer = new naver.maps.StreetLayer();
        roadViewLayerRef.current = roadViewLayer;

        roadViewLayer.setMap(map);

        break;

      default:
        map.setMapTypeId(type);

        if (cadastralLayerRef.current) {
          cadastralLayerRef.current.setMap(null);
          cadastralLayerRef.current = undefined;
        }

        if (roadViewLayerRef.current) {
          roadViewLayerRef.current.setMap(null);
          roadViewLayerRef.current = undefined;
        }

        break;
    }
  };

  const handleZoom = (type: "IN" | "OUT") => () => {
    const zoom = map.getZoom();
    if (type === "IN") {
      map.setZoom(zoom + 1, true);
    } else {
      map.setZoom(zoom - 1, true);
    }
  };
  const handleOverlay = () => {
    // setIsOverlayHide((prev) => !prev);
    onVisibleOverlay();
  };

  return (
    <div className="tool-bar">
      <ul className="zoom-list">
        <li onClick={handleZoom("IN")}>
          {/* <span>확대</span> */}
          {/* 확대 */}
          {/* &#43; */}
          <span>+</span>
        </li>
        <li onClick={handleZoom("OUT")}>
          <span>-</span>
        </li>
      </ul>

      <div className="control">
        {isOpen ? (
          <div className="control-list">
            {mapTypesArr.map((v) => {
              return (
                <button
                  key={v.id}
                  className={mapType === v.id ? "active" : ""}
                  onClick={handleMapType(v.id)}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="current" onClick={() => setIsOpen(true)}>
            {convertMapName(mapType)}
          </div>
        )}
        <button
          className={overlayVisible ? "" : "active"}
          onClick={handleOverlay}
        >
          숨김
        </button>
      </div>
    </div>
  );
}

export default MapToolBar;
