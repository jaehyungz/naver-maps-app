"use client";

import React, { useState } from "react";
import { PolygonContext } from "../context/polygon-context";
import { polygon } from "framer-motion/client";

interface Props {
  children: React.ReactNode;
}

function PolygonProvider(props: Props) {
  const [val, setVal] = useState<naver.maps.Polygon>();

  const onDelete = () => {
    setVal(undefined);
  };

  const onAdd = (polygon: naver.maps.Polygon) => {
    setVal(polygon);
  };

  return (
    <PolygonContext.Provider value={{ polygon: val, onDelete, onAdd }}>
      {props.children}
    </PolygonContext.Provider>
  );
}

export default PolygonProvider;
