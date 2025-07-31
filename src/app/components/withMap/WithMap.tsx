import { useMap } from "@/app/hooks";
import React, { ComponentType } from "react";

export const WithMap =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const mapRef = useMap();

    return <Component {...props} map={mapRef} />;
  };
