"use client";

import React, { useState } from "react";
import { MapContext } from "../context/map-context";
import { useMapState } from "../hooks/use-map-state";

interface Props {
  children: React.ReactNode;
}

function MapProvider(props: Props) {
  const { map } = useMapState();
  const [val, setVal] = useState<naver.maps.Polygon>();
  const onDelete = () => {
    setVal(undefined);
  };

  const onAdd = (polygon: naver.maps.Polygon) => {
    setVal(polygon);
  };

  return (
    <MapContext.Provider
      value={{
        map,
        polygon: val,
        onPolygonAdd: onAdd,
        onPolygonDelete: onDelete,
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
}

export default MapProvider;
