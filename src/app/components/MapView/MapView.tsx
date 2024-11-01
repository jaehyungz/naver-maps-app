"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { useMap } from "@/app/hooks/useMap";
import MapSideBar from "../MapSideBar";
import { cursorTo } from "readline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cookies } from "next/headers";
import { useCenterState, useZoomState } from "@/app/hooks/use-localstorage";
import { useGetMap } from "@/api/hooks";

interface Props {
  id: number;
  lat: number;
  lng: number;
  name: string;
  size: "big" | "small";
}

function MapView() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams(); // 변수 선언

  const mapRef = useMap();

  const overlaysRef = useRef<naver.maps.OverlayView[]>([]); // 오버레이 배열을 저장할 ref

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // const [infoWindowState, setInfoWidowState] =
  //   useState<naver.maps.InfoWindow>();
  const infowindowRef = useRef<naver.maps.InfoWindow | null>(null);

  // const [zoomState, setZoomState] = useState(13);

  const { state: zoomState, setState: setZoomState } = useZoomState();

  const { state: centerState, setState: setCenterState } = useCenterState();

  const [data, setData] = useState<Props[]>([]);

  const [activeIdx, setActiveIdx] = useState(-1);

  const { data: asd } = useGetMap({ level: zoomState });

  useEffect(() => {
    console.log({ asd });
  }, [asd]);
  const createInfoWindow = (position: naver.maps.LatLng) => {
    const map = mapRef.current;
    if (!map) return;

    const contentString = [
      '<div class="info-window">',
      "   <h3>120세대</h3>",
      "   <p>req 54% / TP -12%</p>",
      "</div>",
    ].join("");

    const infowindow = new naver.maps.InfoWindow({
      content: contentString,
      disableAnchor: true,
      pixelOffset: new naver.maps.Point(90, -20),
      disableAutoPan: true,
      borderWidth: 0,
      maxWidth: 180,

      // position: position,
    });
    // setInfoWidowState(infowindow);

    infowindowRef.current = infowindow;
    infowindow.open(map, position);
  };

  // function debounce<T extends (...args: any[]) => void>(
  //   func: T,
  //   delay: number
  // ): (...args: Parameters<T>) => void {
  //   let timeoutId: NodeJS.Timeout;

  //   return function (...args: Parameters<T>) {
  //     if (timeoutId) {
  //       clearTimeout(timeoutId);
  //     }

  //     timeoutId = setTimeout(() => {
  //       func(...args);
  //     }, delay);
  //   };
  // }

  // const debounceFn = debounce((e: MouseEvent) => {
  //   onMouseOut(e);
  // }, 300);

  const createOverlays = async (
    map: naver.maps.Map | undefined,
    data: Props[]
  ) => {
    if (!map) return;

    const bounds = map.getBounds();

    // anyRef.current.forEach((el, idx) => {
    //   if (idx === anyRef.current.length - 1) {
    //     el.classList.add("animate");
    //   } else {
    //     el.classList.remove("animate");
    //   }
    // });
    // anyRef.current.forEach((el, idx) => {
    //   if (idx === anyRef.current.length - 1) {
    //     el.classList.add("animate");
    //     console.log("들어와");
    //   } else {
    //     el.classList.remove("animate");
    //     console.log("안들어와");
    //   }
    // });

    data.forEach((v, idx) => {
      const position = new naver.maps.LatLng(v.lat, v.lng);

      const overlay = new naver.maps.OverlayView();

      const overlayElement = document.createElement("div");

      overlayElement.classList.add(
        v.size === "big" ? "overlay-big" : "overlay"
      );

      // if (activeIdx === idx) {
      //   overlayElement.classList.add("animate");
      // }

      // overlayElement.classList.add(activeIdx === idx ? "animate" : "");

      overlayElement.textContent = v.name;

      overlay.set("position", position);
      overlay.onAdd = () => {
        const overlayLayer = overlay.getPanes().overlayLayer;
        overlayLayer.appendChild(overlayElement);

        overlayElement.addEventListener(
          "click",
          handleClickOverlay(v.id, v.size === "big")
        );

        overlayElement.addEventListener(
          "mouseover",
          onMouseOver(position, v.size === "big")
        );

        // // overlayElement.addEventListener("mouseout", onMouseOut);
        // overlayElement.addEventListener("mouseout", debounceFn);
        overlayElement.addEventListener("mouseout", onMouseOut);
      };

      overlay.draw = () => {
        if (!overlay.getMap()) return;

        const projection = overlay.getProjection();
        const pixelPosition = projection.fromCoordToOffset(position);

        overlayElement.style.left = `${pixelPosition.x}px`;
        overlayElement.style.top = `${pixelPosition.y}px`;
      };
      overlay.onRemove = () => {
        if (overlayElement.parentNode) {
          overlayElement.parentNode.removeChild(overlayElement);
        }
      };

      overlaysRef.current.push(overlay);

      if (bounds.hasPoint(position)) {
        overlay.setMap(map);
      } else {
        overlay.setMap(null);
      }
    });

    naver.maps.Event.addListener(map, "zoom_changed", (zoom: number) => {
      setZoomState(zoom);
    });
    naver.maps.Event.addListener(map, "zoomend", () => {
      overlaysRef.current.forEach((v) => v.setMap(null));
      overlaysRef.current = [];
    });

    // 처음엔 실행안함
    naver.maps.Event.addListener(map, "idle", (e) => {
      const center = map.getCenter();

      const convertCenter = {
        lat: center.y,
        lng: center.x,
      };
      setCenterState(convertCenter);

      updateOverlays();
    });
  };

  const checkUserAgentForIsMobile = () => {
    // const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const userAgent = navigator.userAgent;

    if (/android/i.test(userAgent)) {
      return true;
    }
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return true;
    }
    return false;
  };

  const checkWindowSizeForisMobile = () => {
    return window.innerWidth <= 600;
  };

  const handleClickOverlay = (id: number, size: boolean) => (e: MouseEvent) => {
    const map = mapRef.current;
    if (!map) return;
    if (size) return;
    const isMobile =
      checkUserAgentForIsMobile() || checkWindowSizeForisMobile();

    if (isMobile) {
      router.push(`${pathName}/${id}`);
      return;
    }
    router.push(`${pathName}?id=${id}`);

    const target = data.find((item) => item.id === id);

    if (target) {
      const position = new naver.maps.LatLng(target.lat, target.lng);

      map.panTo(position);
    }
  };

  // const anyRef = useRef<HTMLDivElement[]>([]);
  // const onMouseClick =
  //   (isBig: boolean, currentIdx: number) => (e: MouseEvent) => {
  //     if (isBig) return;
  //     const target = e.target as HTMLDivElement;

  //     setActiveIdx(currentIdx);
  //     anyRef.current.push(target);

  //     //이전에 선택한게있다면
  //     anyRef.current.forEach((el, idx) => {
  //       if (idx === anyRef.current.length - 1) {
  //         console.log("add", el.textContent);
  //         // target.classList.remove("animate");
  //         // console.log("add", idx);
  //         el.classList.add("animate");
  //         // target.classList.add("animate");
  //       } else {
  //         console.log("remove", el.textContent);
  //         el.classList.remove("animate");
  //         // target.classList.remove("animate");
  //       }
  //     });
  //   };
  const onMouseOver =
    (position: naver.maps.LatLng, isBig: boolean) => (e: MouseEvent) => {
      const target = e.target as HTMLDivElement;
      target.classList.add("z-10");

      if (isBig) return;

      createInfoWindow(position);
    };

  const onMouseOut = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;

    target.classList.remove("z-10");
    // target.classList.remove("animate");
    if (!infowindowRef.current) return;

    infowindowRef.current?.close();
    infowindowRef.current = null;
  };

  const updateOverlays = () => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const overlays = overlaysRef.current;

    for (let index = 0; index < overlays.length; index++) {
      const overlay = overlays[index];
      const position = overlay.get("position");

      if (bounds.hasPoint(position)) {
        showOverlay(map, overlay);
      } else {
        hideOverlay(overlay);
      }
    }
  };

  function showOverlay(map: naver.maps.Map, overaly: naver.maps.OverlayView) {
    if (overaly.getMap()) return;
    overaly.setMap(map);
  }

  function hideOverlay(overlay: naver.maps.OverlayView) {
    if (!overlay.getMap()) return;
    overlay.setMap(null);
  }

  useEffect(() => {
    const map = mapRef.current;
    const id = searchParams.get("id");

    console.log(data);
    console.log(id);
    if (!map) return;
    if (!data.length) return;
    if (!id?.length) return;

    const target = data.find((item) => item.id === Number(id));

    if (target) {
      const position = new naver.maps.LatLng(target.lat, target.lng);

      map.panTo(position);
    }
  }, [searchParams, mapRef]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const params = {
  //       level: zoomState.toString(),
  //     };
  //     const queryString = new URLSearchParams(params).toString(); // url에 쓰기 적합한 querySting으로 return 해준다.
  //     const data = await fetch(`/api/map?${queryString}`);
  //     const res = await data.json();
  //     setData(res.data);
  //   }
  //   fetchData();
  // }, [zoomState]);

  useMemo(() => {
    if (mapRef.current) {
      createOverlays(mapRef.current, data);
    }
  }, [mapRef.current, data]);

  return (
    <>
      {/* <input type="text" onChange={handleChange} /> */}

      <div className="map" id="map">
        <MapSideBar />
      </div>
    </>
  );
}

export default MapView;
