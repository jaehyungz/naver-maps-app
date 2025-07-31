"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {}

function Page(props: Props) {
  const {} = props;

  const [val, setVal] = useState("불정로");
  const mapRef = useRef<naver.maps.Map>();
  const markerRef = useRef<naver.maps.Marker>();

  const handleSearch = () => {
    naver.maps.Service.geocode(
      {
        query: val,
      },
      (status, res) => {
        console.log({ status });
        console.log({ res });
      }
    );
  };

  useEffect(() => {
    mapRef.current = new naver.maps.Map("map", {
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: naver.maps.MapTypeControlStyle.DROPDOWN,
        position: naver.maps.Position.TOP_RIGHT,
        mapTypeIds: [
          naver.maps.MapTypeId.NORMAL,
          naver.maps.MapTypeId.TERRAIN,
          naver.maps.MapTypeId.SATELLITE,
        ],
      },
    });

    const traffic = new naver.maps.TrafficLayer({ interval: 300000 });

    traffic.setMap(mapRef.current);
  }, []);

  const handleMap = () => {
    if (!mapRef.current) return;

    const clickListener = naver.maps.Event.addListener(
      mapRef.current,
      "click",
      (v) => {
        const center = v.coord;

        createMarker(center);
        // handleSearchGeoCode(center);
      }
    );
    // naver.maps.Event.removeListener(clickListener);
  };
  const handleSearchGeoCode = (center: naver.maps.LatLng) => {
    naver.maps.Service.reverseGeocode(
      {
        coords: center,
        orders: [
          naver.maps.Service.OrderType.ADDR,
          naver.maps.Service.OrderType.ROAD_ADDR,
        ].join(","),
      },
      (status, res) => {
        console.log(status);
        console.log(res);
      }
    );
  };

  const createMarker = (center: naver.maps.LatLng) => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.setPosition(center);
      return;
    }

    markerRef.current = new naver.maps.Marker({
      position: center,
    });
    markerRef.current.setMap(mapRef.current);
  };

  const handleReset = () => {
    if (!mapRef.current) return;

    mapRef.current.refresh(true);
  };
  const handleMapType = () => {
    if (!mapRef.current) return;
    // mapRef.current.mapTypes.set(
    //   naver.maps.MapTypeId.HYBRID,
    //   naver.maps.NaverStyleMapTypeOptions.getHybridMap()
    // );
    mapRef.current.setMapTypeId(naver.maps.MapTypeId.HYBRID);
    // mapRef.current.setMapTypeId(naver.maps.MapTypeId.HYBRID);
  };

  useEffect(() => {
    handleMap();
  }, [mapRef.current]);

  return (
    <>
      <input type="text" value={val} onChange={(e) => setVal(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleReset}>지도 초기화</button>
      <button onClick={handleMapType}>Map Type</button>

      <div id="map" style={{ width: 500, height: 500 }} />
    </>
  );
}

export default Page;
