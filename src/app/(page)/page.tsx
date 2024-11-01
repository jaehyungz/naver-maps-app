// import MapView from "../components/MapView";

"use client";
import Link from "next/link";
import MapView from "../components/MapView";
import { useEffect, useState } from "react";
import Loading from "./loading";

export default function Home() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const changeLoading = () => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    changeLoading();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <div>home!!</div>;
}
