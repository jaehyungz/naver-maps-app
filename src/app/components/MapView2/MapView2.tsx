"use client";
import { MapContext, useMapContext } from "@/app/context/map-context";
import {
  Context,
  PolygonContext,
  usePolygonContext,
} from "@/app/context/polygon-context";
import React, { useCallback, useContext, useEffect } from "react";
import MapSideBar2 from "../MapSideBar2";

interface Props {}

function MapView2(props: Props) {
  const {} = props;

  // const map = useContext(MapContext);
  // const { polygon, onDelete, onAdd } = useContext(PolygonContext)!;
  const { map, polygon, onPolygonDelete, onPolygonAdd } = useMapContext();
  // const { polygon, onDelete, onAdd } = usePolygonContext();

  const handleMapClick = useCallback(() => {
    console.log(polygon);
    if (polygon) {
      polygon.setMap(null);
      onPolygonDelete();
      return;
    }

    const polygonobj = new naver.maps.Polygon({
      map: map,
      paths: [
        [
          new naver.maps.LatLng(37.37544345085402, 127.11224555969238),
          new naver.maps.LatLng(37.37230584065902, 127.10791110992432),
          new naver.maps.LatLng(37.35975408751081, 127.10795402526855),
          new naver.maps.LatLng(37.359924641705476, 127.11576461791992),
          new naver.maps.LatLng(37.35931064479073, 127.12211608886719),
          new naver.maps.LatLng(37.36043630196386, 127.12293148040771),
          new naver.maps.LatLng(37.36354029942161, 127.12310314178465),
          new naver.maps.LatLng(37.365211629488016, 127.12456226348876),
          new naver.maps.LatLng(37.37544345085402, 127.11224555969238),
        ],
        [
          new naver.maps.LatLng(37.368485964153784, 127.10971355438232),
          new naver.maps.LatLng(37.368520071054576, 127.11464881896971),
          new naver.maps.LatLng(37.36350619025713, 127.11473464965819),
          new naver.maps.LatLng(37.363403862670665, 127.1097993850708),
          new naver.maps.LatLng(37.368485964153784, 127.10971355438232),
        ],
      ],
      fillColor: "#ff0000",
      fillOpacity: 0.3,
      strokeColor: "#ff0000",
      strokeOpacity: 0.6,
      strokeWeight: 3,
    });
    onPolygonAdd(polygonobj);
  }, [map, polygon]);

  useEffect(() => {
    if (!map) return;

    const clickListener = map.addListener("click", () => handleMapClick());
    const idleListener = map.addListener("idle", (e) => {
      const center = map.getCenter();

      const convertCenter = {
        lat: center.y,
        lng: center.x,
      };
      localStorage.setItem("center", JSON.stringify(convertCenter));
    });

    const zoomListener = map.addListener("zoom_changed", (zoom) => {
      localStorage.setItem("zoom", JSON.stringify(zoom));
    });

    return () => {
      map.removeListener(clickListener);
      map.removeListener(idleListener);
      map.removeListener(zoomListener);
    };
  }, [map, handleMapClick]);

  // const handleMapClick = (e: any) => {
  //   console.log(polygon);
  //   if (polygon) {
  //     console.log("여기는 들어옴?");
  //     polygon.setMap(null);
  //     onDelete();
  //     return;
  //   }

  //   const polygonobj = new naver.maps.Polygon({
  //     map: map,
  //     paths: [
  //       [
  //         new naver.maps.LatLng(37.37544345085402, 127.11224555969238),
  //         new naver.maps.LatLng(37.37230584065902, 127.10791110992432),
  //         new naver.maps.LatLng(37.35975408751081, 127.10795402526855),
  //         new naver.maps.LatLng(37.359924641705476, 127.11576461791992),
  //         new naver.maps.LatLng(37.35931064479073, 127.12211608886719),
  //         new naver.maps.LatLng(37.36043630196386, 127.12293148040771),
  //         new naver.maps.LatLng(37.36354029942161, 127.12310314178465),
  //         new naver.maps.LatLng(37.365211629488016, 127.12456226348876),
  //         new naver.maps.LatLng(37.37544345085402, 127.11224555969238),
  //       ],
  //       [
  //         new naver.maps.LatLng(37.368485964153784, 127.10971355438232),
  //         new naver.maps.LatLng(37.368520071054576, 127.11464881896971),
  //         new naver.maps.LatLng(37.36350619025713, 127.11473464965819),
  //         new naver.maps.LatLng(37.363403862670665, 127.1097993850708),
  //         new naver.maps.LatLng(37.368485964153784, 127.10971355438232),
  //       ],
  //     ],
  //     fillColor: "#ff0000",
  //     fillOpacity: 0.3,
  //     strokeColor: "#ff0000",
  //     strokeOpacity: 0.6,
  //     strokeWeight: 3,
  //   });
  //   onAdd(polygonobj);
  // };

  useEffect(() => {
    console.log("useEffect", polygon);
  }, [polygon]);

  return (
    <>
      <div style={{ width: "80vw", height: "80vh" }} id="map2">
        <MapSideBar2 />
      </div>
    </>
  );
}

export default MapView2;
