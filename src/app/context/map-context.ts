"use client";

import { createContext, useContext } from "react";

// ----------------------------------------------------------------------

type Context = {
  map: naver.maps.Map | undefined;
  polygon: naver.maps.Polygon | undefined;
  onPolygonDelete: () => void;
  onPolygonAdd: (polygon: naver.maps.Polygon) => void;
};
export const MapContext = createContext<Context | undefined>(undefined);

export const MapContextConsumer = MapContext.Consumer;

export function useMapContext() {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error("useMapContext: Context must be used inside MapProvider");
  }

  return context;
}
