"use client";

import { param } from "framer-motion/client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {}

function Page(props: Props) {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const id = params.id;
    window.addEventListener("popstate", (e) => {
      router.replace(`/map?id=${id}`);
    });
  }, []);

  return <div>zz</div>;
}

export default Page;
