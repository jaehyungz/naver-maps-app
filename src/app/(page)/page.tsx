// import MapView from "../components/MapView";

"use client";
import Link from "next/link";
import MapView from "../components/MapView";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useGetPosts } from "@/api/hooks/posts";
import { button } from "framer-motion/client";

export default function Home() {
  const [id, setId] = useState("1");
  const { data, isFetching } = useGetPosts(id);

  const handleClick = (item: number) => () => {
    console.log(isFetching);
    setId(item.toString());
    console.log(item.toString());
  };

  const asd = () => {
    console.log("!");

    navigator.geolocation.getCurrentPosition(
      (pos) => console.log(pos),
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => console.log(pos),
      (err) => console.log(err)
    );
  }, []);

  return (
    <div>
      {Array.from({ length: 251 }, (_, i) => i + 1).map((item) => {
        return (
          <button key={item} onClick={handleClick(item)}>
            {item} 조회 버튼
          </button>
        );
      })}

      <button onClick={asd}>hello</button>
      <div>
        {data?.id}
        <br />
        {data?.title}
        <br />
        {data?.userId}
      </div>
    </div>
  );
}
