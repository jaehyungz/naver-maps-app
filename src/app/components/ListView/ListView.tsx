"use client";

import React, { useEffect } from "react";
import "./style.css";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export type I18N<T> = {
  ko: T;
  en: T;
};

export type UnitData = {
  idx: number;
  siteInfo: any;
  unitName: I18N<string>;
  title: I18N<string>;
  summary: I18N<string>;
  images: string[];
  features: I18N<string[]>;
  tags: I18N<string[]>;
  isVacancy: boolean;
  // vacantDate?: string;
  metro: any[];
  services: I18N<
    {
      title: string;
      value: string;
    }[]
  >;
  unitSize: number;
  rentPrice: number;
  servicePrice: number;
  rentDailyFee: number;
  serviceDailyFee: number;
  floorplan?: string;
  matterport?: string;
  options: { idx: number; name: I18N<string>; icon: string }[];
};

function ListView() {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["get-units"],
    queryFn: async () => {
      const res = await fetch("/api/list");

      const data = await res.json();

      console.log(data);
      return data;
      // const response = await fetch(
      //   "https://stay-dev.epsd.co.kr/api/v1/units/?start_date=2025-07-10&end_date=2025-07-23&is_pet=false&is_multi_bed=false&page=1&pagesize=9"
      // );
      // const data = await response.json();
      // return data;
    },
  });

  return (
    <div className="list-container">
      <h1>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, odio.
      </h1>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet in
        sequi natus rem quia asperiores perspiciatis? Quisquam aperiam
        laboriosam vitae?
      </p>

      {data?.data?.items.map((v: UnitData) => {
        return (
          <div
            key={v.idx}
            className="list-item"
            onClick={() => router.push(`/list/${v.idx}`, { scroll: true })}
          >
            <div>{v.idx}</div>
            <div>
              <img src={v.images[0]} alt="이미지" />
            </div>
            <p>{v.summary.ko}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ListView;
