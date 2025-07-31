"use client";

import { createContext, useContext } from "react";

// ----------------------------------------------------------------------

export type Context = {
  polygon: naver.maps.Polygon | undefined;
  onDelete: () => void;
  onAdd: (polygon: naver.maps.Polygon) => void;
};

export const PolygonContext = createContext<Context | undefined>(undefined);

export const PolygonContextConsumer = PolygonContext.Consumer;

export function usePolygonContext() {
  const context = useContext(PolygonContext);

  if (!context) {
    throw new Error(
      "usePolygonContext: Context must be used inside MapProvider"
    );
  }

  return context;
}
