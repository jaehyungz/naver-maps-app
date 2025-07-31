"use client";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./style.css";
import { useMap } from "@/app/hooks/useMap";
import MapSideBar from "../MapSideBar";
import { cursorTo } from "readline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cookies } from "next/headers";
import { useCenterState, useZoomState } from "@/app/hooks/use-localstorage";
import { useGetMap, useGetMapDetail } from "@/api/hooks";
import MapToolBar from "../MapToolBar";
import { WithMap } from "../withMap";

interface GetMapResponse {
  id: number;
  lat: number;
  lng: number;
  name: string;
  size: "big" | "small";
}

function MapView(props: { map: MutableRefObject<naver.maps.Map | undefined> }) {
  const mapRef = props.map;

  // const mapRef = props.map;
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams(); // 변수 선언

  // const mapRef = useMap();

  const overlaysRef = useRef<naver.maps.OverlayView[]>([]); // 오버레이 배열을 저장할 ref

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // const [infoWindowState, setInfoWidowState] =
  //   useState<naver.maps.InfoWindow>();
  const infowindowRef = useRef<naver.maps.InfoWindow | null>(null);

  // const [zoomState, setZoomState] = useState(13);

  const { state: zoomState, setState: setZoomState } = useZoomState();

  const { state: centerState, setState: setCenterState } = useCenterState();

  const [overlayVisible, setOverlayVisible] = useState(true);

  const [id, setId] = useState("");
  // const [data, setData] = useState<Props[]>([]);

  const [activeIdx, setActiveIdx] = useState(-1);

  const { data } = useGetMap({ level: zoomState });

  const { data: detailData } = useGetMapDetail({ id });

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

  const createOverlays = async (
    map: naver.maps.Map | undefined,
    data: GetMapResponse[]
  ) => {
    if (!map) return;

    const bounds = map.getBounds();

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

    naver.maps.Event.addListener(map, "click", (e) => {
      if (map.layers.get("street")) {
        const position = e.coord;
        const lat = position.lat();
        const lng = position.lng();

        router.push(`/road-view/detail?lat=${lat}&lng=${lng}`);
      }
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
    setId(id.toString());
    router.push(`${pathName}?id=${id}`);

    const target = data?.find((item) => item.id === id);

    if (target) {
      const position = new naver.maps.LatLng(target.lat, target.lng);

      // map.panTo(position);
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

  const showOverlay = (
    map: naver.maps.Map,
    overaly: naver.maps.OverlayView
  ) => {
    if (overaly.getMap()) return;
    overaly.setMap(map);
  };

  const hideOverlay = (overlay: naver.maps.OverlayView) => {
    if (!overlay.getMap()) return;
    overlay.setMap(null);
  };

  // useEffect(() => {
  //   const map = mapRef.current;
  //   const id = searchParams.get("id");

  //   console.log("여기들어옴? 다시?");

  //   if (!map) return;
  //   if (!data?.length) return;
  //   if (!id?.length) return;

  //   const target = data.find((item) => item.id === Number(id));

  //   console.log(target);
  //   if (target) {
  //     const position = new naver.maps.LatLng(target.lat, target.lng);

  //     map.panTo(position);
  //   }
  // }, [searchParams, mapRef]);

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

  const handleOverlayVisible = () => {
    setOverlayVisible((prev) => !prev);

    if (overlayVisible) {
      overlaysRef.current.forEach((v) => v.onRemove());
      overlaysRef.current = [];
    } else {
      createOverlays(mapRef.current, data?.length ? data : []);
    }
  };

  // 최초에 지도 위치 검색 후 오버레이 그리기용 side Effect
  useEffect(() => {
    createOverlays(mapRef.current!, data ? data : []);
  }, [data]);

  // searchParams 가 변경될때마다 id값을 useState initialization
  useEffect(() => {
    const id = searchParams.get("id");
    setId(id ?? "");
  }, [searchParams]);

  // searchParams값을 이용해서 요청성공한 /map/{id} 값의 data좌표를 검색후 panTo
  useEffect(() => {
    if (detailData) {
      const target = data?.find((item) => item.id.toString() === detailData.id);

      if (target) {
        const position = new naver.maps.LatLng(target.lat, target.lng);
        mapRef.current?.panTo(position);
      }
    }
  }, [detailData]);

  return (
    <>
      <div className="map" id="map">
        <MapSideBar currentData={detailData} />

        {/* <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "red",
            zIndex: 1,
          }}
        >
          {mapRef.current?.getZoom()}
        </div> */}

        {mapRef.current ? (
          <MapToolBar
            map={mapRef.current}
            onVisibleOverlay={handleOverlayVisible}
            overlayVisible={overlayVisible}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

// export default WithMap(MapView);
export default MapView;
