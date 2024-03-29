"use client";
import Slider2box from "./slider2box";
import { AiOutlineRight } from "react-icons/ai";
import { AiOutlineLeft } from "react-icons/ai";
import { useRef } from "react";
import Link from "next/link";

const Slider2 = ({ linkComp, title, goalData }) => {
  const carouselRef = useRef();
  const carouselSwitcher = (data) => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo(
        carouselRef.current.scrollLeft + width * data,
        0
      );
    }
  };

  return (
    <>
      {goalData.length < 1 ? (
        <div></div>
      ) : (
        <div className="bg-gray-50">
          <div className="container mx-auto ">
            <section className="flex flex-col gap-3 m-2 ">
              <header className="m-4 flex justify-between items-center">
                <h2 className="text-orange-500 text-md md:text-xl border-orange-500 border-r-2 pr-2">
                  {title}
                </h2>
                <div className="flex gap-1 items-center">
                  {/* <div className="flex items-center gap-1"></div> */}
                  <AiOutlineRight
                    onClick={() => carouselSwitcher(1)}
                    className="cursor-pointer bg-[#FFDE00] transition-all duration-200 hover:bg-orange-500 w-10 h-10 p-2 rounded"
                  />
                  <AiOutlineLeft
                    onClick={() => carouselSwitcher(-1)}
                    className="cursor-pointer bg-[#FFDE00] transition-all duration-200 hover:bg-orange-500 w-10 h-10 p-2 rounded"
                  />
                  <Link
                    className="bg-orange-500 text-md px-4 border-2 py-2 rounded-lg transition-all duration-200 hover:bg-orange-600"
                    href={`/shop?&orderBy=date&type=${linkComp}&maxP=100000000&minP=0&pgn=12&pn=1`}
                  >
                    همه
                  </Link>
                </div>
              </header>
              <div
                ref={carouselRef}
                className="sliderContainer w-full max-w-7xl overflow-x-scroll"
              >
                <div className="flex justify-between itemas-center gap-2">
                  {goalData.map((da, i) => (
                    <Slider2box key={i} itemData={da} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default Slider2;
