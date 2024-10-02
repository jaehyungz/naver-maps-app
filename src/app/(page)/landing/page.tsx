"use client";
import React, { useEffect, useRef, useState } from "react";

import { motion, useCycle } from "framer-motion";
import "./style.css";
import { useDimensions } from "@/app/hooks/use-dimensions";
import MenuButton from "@/app/components/MenuButton";
import MenuItem from "@/app/components/MenuItem";
interface Props {}

function Page(props: Props) {
  const {} = props;

  const list = { hidden: { opacity: 0 } };
  const item = { hidden: { x: -10, opacity: 0 } };

  const imgs = [
    {
      id: 1,
      url: "https://i.pinimg.com/474x/af/d3/91/afd3914189affdd99dfe2c890e48dac3.jpg",
    },
    {
      id: 2,
      url: "https://i.pinimg.com/474x/2f/76/a2/2f76a266fb8245975b6b27ce829e046b.jpg",
    },
    {
      id: 3,
      url: "https://i.pinimg.com/474x/6f/3d/e6/6f3de6bcacd70048ff3d4d8acaa15cd0.jpg",
    },
    {
      id: 4,
      url: "https://i.pinimg.com/236x/4a/f1/04/4af104f71080e36c7a010004d47be087.jpg",
    },
    {
      id: 5,
      url: "https://i.pinimg.com/236x/70/d5/60/70d560f01fa69abf4098b48fae3a3639.jpg",
    },
    {
      id: 6,
      url: "https://i.pinimg.com/236x/4a/f1/04/4af104f71080e36c7a010004d47be087.jpg",
    },
    // {
    //   id: 6,
    //   url: "https://i.pinimg.com/236x/70/d5/60/70d560f01fa69abf4098b48fae3a3639.jpg",
    // },
    {
      id: 7,
      url: "https://i.pinimg.com/474x/6f/3d/e6/6f3de6bcacd70048ff3d4d8acaa15cd0.jpg",
    },

    {
      id: 8,
      url: "https://i.pinimg.com/236x/4a/f1/04/4af104f71080e36c7a010004d47be087.jpg",
    },

    {
      id: 9,
      url: "https://i.pinimg.com/474x/af/d3/91/afd3914189affdd99dfe2c890e48dac3.jpg",
    },
    {
      id: 10,
      url: "https://i.pinimg.com/236x/4a/f1/04/4af104f71080e36c7a010004d47be087.jpg",
    },
    {
      id: 11,
      url: "https://i.pinimg.com/474x/6f/3d/e6/6f3de6bcacd70048ff3d4d8acaa15cd0.jpg",
    },
    {
      id: 12,
      url: "https://i.pinimg.com/474x/2f/76/a2/2f76a266fb8245975b6b27ce829e046b.jpg",
    },
  ];
  const [heightArr, setHeightArr] = useState<number[]>([]);

  //   useEffect(() => {
  //     imgs.map((v) => {
  //       const img = new Image();

  //       img.onload = (v) => {
  //         setHeightArr((prev) => [...prev, img.height]);
  //       };
  //       img.src = v.url;
  //     });
  //   }, []);

  const variants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  const containerRef = useRef<HTMLElement | null>(null);

  const [isOpen, toggleOpen] = useCycle(false, true);

  const { height } = useDimensions(containerRef);

  const sidebar = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: "circle(30px at 40px 40px)",
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const length = imgs.length;

    const rows = Math.ceil(imgs.length / 3);
    const firstItemHeights: number[] = [];
    var heightObejct: any = { 0: [], 1: [], 2: [] };
    var firstIdx = -1;
    var secondIdx = -1;
    var lastIdx = -1;

    //첫번쨰 애들만
    for (let i = 0; i < imgs.length; i++) {
      //처음애들
      if (i === 0 || i % 3 === 0) {
        firstIdx += 1;
        heightObejct["0"].push(itemRefs.current[i]!.clientHeight);

        const numArray = heightObejct["0"].filter((a, idx) => idx !== firstIdx);
        const sum = numArray.reduce((acc, cur) => {
          return acc + cur;
        }, 0);
        itemRefs.current[i]!.style.transform = `translateY(${sum}px)`;
      }

      //중간애들
      if (i === 1 || (i - 1) % 3 === 0) {
        secondIdx += 1;
        itemRefs.current[i]!.style.transform = `translateX(300px)`;
        heightObejct["1"].push(itemRefs.current[i]!.clientHeight);

        const numArray = heightObejct["1"].filter((a, idx) => idx !== firstIdx);
        const sum = numArray.reduce((acc, cur) => {
          return acc + cur;
        }, 0);
        itemRefs.current[
          i
        ]!.style.transform = `translateX(300px) translateY(${sum}px)`;
      }

      //마지막애들

      if (i === 2 || (i - 2) % 3 === 0) {
        lastIdx += 1;
        heightObejct["2"].push(itemRefs.current[i]!.clientHeight);

        const numArray = heightObejct["2"].filter((a, idx) => idx !== firstIdx);
        const sum = numArray.reduce((acc, cur) => {
          return acc + cur;
        }, 0);
        itemRefs.current[
          i
        ]!.style.transform = `translateX(600px) translateY(${sum}px)`;
      }
    }
  }, [imgs]);

  return (
    <div className="container">
      {/* <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
      >
        <motion.div className="background" variants={sidebar} />

        <MenuButton toggle={() => toggleOpen()} />

        <motion.ul variants={variants}>
          {[0, 1, 2, 3, 4].map((i) => (
            <MenuItem i={i} key={i} />
          ))}
        </motion.ul>
      </motion.nav> */}
      {/* <motion.div animate={{ x: 100, opacity: 1 }} className="circle" /> */}

      <div className="masonry-container">
        {imgs.map((item, idx) => {
          return (
            <div
              className="masonry-item"
              key={idx}
              style={{}}
              ref={(el) => (itemRefs.current[idx] = el)} // 각 요소에 ref 연결
            >
              <strong>{idx}이미지</strong>
              <img src={item.url} alt="img" />
            </div>
          );
        })}
      </div>

      {/* <motion.div
        className="circle"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 1.1 }}
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
      />

      <motion.ul animate="hidden" variants={list}>
        <motion.li variants={item}>1</motion.li>
        <motion.li variants={item}>2</motion.li>
        <motion.li variants={item}>3</motion.li>
      </motion.ul> */}
    </div>
  );
}

export default Page;
