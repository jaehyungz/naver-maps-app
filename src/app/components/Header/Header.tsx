import Link from "next/link";
import React from "react";

interface Props {}

function Header(props: Props) {
  const {} = props;

  return (
    <div
      style={{
        display: "flex",
        // gap: "30px",
        // position: "fixed",
        // top: 0,
        // zIndex: 20,
      }}
    >
      <Link href={"/"}>홈</Link>
      <Link href={"/map"}>맵</Link>
    </div>
  );
}

export default Header;
