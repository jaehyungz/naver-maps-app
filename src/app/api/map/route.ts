import { normalData, zoomData } from "@/app/utils/data";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const level = url.searchParams.get("level");
  var locations: {
    id: number;
    lat: number;
    lng: number;
    name: string;
    size: "big" | "small";
  }[] = [];

  if (parseInt(level!, 10) <= 11) {
    new Promise((resolve) => {
      for (let i = 0; i < zoomData.length; i++) {
        const el = zoomData[i];

        locations.push({
          id: i,
          lat: el.lat,
          lng: el.lng,
          name: el.content.shortName,
          size: "big",
        });
      }

      resolve(locations);
    });
  } else {
    new Promise((resolve) => {
      for (let i = 0; i < normalData.data.length; i++) {
        const el = normalData.data[i];

        // const lat = Math.random() * (38 - 33) + 33;
        // const lng = Math.random() * (129 - 126) + 126;
        locations.push({
          id: i,
          lat: el.lat,
          lng: el.lng,
          name: el.name,
          size: "small",
        });

        // locations.push({ lat, lng, name: `매물${i}호`, size: "small" });
      }

      resolve(locations);
    });
  }
  return Response.json({ ok: true, data: locations });
}
