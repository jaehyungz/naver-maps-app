import React from "react";

import MapView2 from "@/app/components/MapView2";

import MapProvider from "@/app/provider/map-provider";
import PolygonProvider from "@/app/provider/polygon-provider";

interface Props {}

function Page(props: Props) {
  const {} = props;

  return (
    <MapProvider>
      {/* <PolygonProvider> */}
      <MapView2 />
      {/* </PolygonProvider> */}
    </MapProvider>
  );
}

export default Page;
