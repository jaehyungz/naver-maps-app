// import { useMapContext } from "@/app/context/map-context";
// import { usePolygonContext } from "@/app/context/polygon-context";
import { useMapContext } from "@/app/context/map-context";
import React, { useEffect } from "react";

interface Props {}

function MapSideBar2(props: Props) {
  const {} = props;

  const { map, polygon, onPolygonAdd, onPolygonDelete } = useMapContext();
  //   const { polygon, onDelete } = usePolygonContext();

  return (
    <div
      style={{
        width: 350,
        height: "80vh",
        backgroundColor: "#fff",
        position: "fixed",
        left: 10,
        top: 10,
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        padding: "16px",
        boxSizing: "border-box",
        border: "1px solid",
      }}
    >
      <button
        style={{ width: 100 }}
        onClick={() => {
          if (!map) return;
          map.setZoom(17);
        }}
      >
        zoom in
      </button>
      <button
        onClick={() => {
          if (!map) return;
          map.setZoom(10);
        }}
        style={{ width: 100 }}
      >
        zoom out
      </button>
      <button
        onClick={() => {
          if (!map) return;
          polygon?.setMap(null);
          onPolygonDelete();
        }}
        style={{ width: 100 }}
      >
        delete Polygon
      </button>
      <button style={{ width: 100 }}>4</button>
      <button style={{ width: 100 }}>5</button>
    </div>
  );
}

export default MapSideBar2;
