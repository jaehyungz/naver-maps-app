"use client";

// import MapView from "@/app/components/MapView";
// import { div } from "framer-motion/client";
import MapView from "@/app/components/MapView";
import { useMap } from "@/app/hooks";
import React from "react";

interface Props {}

function Page(props: Props) {
  const {} = props;
  const mapRef = useMap();

  return <MapView map={mapRef} />;
}

export default Page;
