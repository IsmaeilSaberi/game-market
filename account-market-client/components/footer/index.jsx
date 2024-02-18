"use client";
import Image from "next/image";
import Link from "next/link";
import { AiFillShopping, AiOutlineArrowUp } from "react-icons/ai";
import { MdArrowLeft } from "react-icons/md";

// USING CONTEXT
import { useAppContext } from "../../context/app-context";

const Footer = () => {
  // CONTEXT OF CARTnUMBER
  const { cartNumber } = useAppContext();

  const goToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <footer className="container mx-auto mt-8 flex flex-col gap-8">
      <div className="flex justify-between items-center p-2 gap-8 md:gap-2 bg-[#FFDE00] rounded-md flex-col md:flex-row">
        <div className="w-72 max-w-72 flex flex-col gap-4">
          <div className="flex justify-center items-center">
            <Image alt="logo" width={100} height={100} src="/logo.png" />
          </div>
          <p className="text-center text-base sm:text-sm">فروشگاه مارکت بازی</p>
        </div>
        <div className="flex justify-around items-start gap-8 sm:gap-16">
          <div className="flex flex-col gap-2">
            <div className="text-xl">دسترسی سریع</div>
            <ul className="flex flex-col gap-2 text-base sm:text-sm">
              <li>
                <Link
                  className="flex gap-1 w-32 transition-all duration-300 hover:text-[#FFDE00] hover:gap-2 items-center"
                  href={"/about"}
                >
                  <MdArrowLeft />
                  <span>درباره ما</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex gap-1 w-32 transition-all duration-300 hover:text-[#FFDE00] hover:gap-2 items-center"
                  href={"/contact"}
                >
                  <MdArrowLeft />
                  <span>تماس با ما</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex gap-1 w-32 transition-all duration-300 hover:text-[#FFDE00] hover:gap-2 items-center"
                  href={"/help"}
                >
                  <MdArrowLeft />
                  <span>حریم خصوصی</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex gap-1 w-32 transition-all duration-300 hover:text-[#FFDE00] hover:gap-2 items-center"
                  href={"/blog"}
                >
                  <MdArrowLeft />
                  <span>وبلاگ</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xl">راهنمای خرید</div>
            <ul className="flex flex-col gap-2 text-base sm:text-sm">
              <li>
                <Link
                  className="flex gap-1 w-32 transition-all duration-300 hover:text-[#FFDE00] hover:gap-2 items-center"
                  href={"/help"}
                >
                  <MdArrowLeft />
                  <span>سوالات متداول</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex gap-1 w-32 transition-all duration-300 hover:text-[#FFDE00] hover:gap-2 items-center"
                  href={"/help"}
                >
                  <MdArrowLeft />
                  <span>چگونه خرید کنم؟</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex gap-1 w-32 transition-all duration-300 hover:text-[#FFDE00] hover:gap-2 items-center"
                  href={"/help"}
                >
                  <MdArrowLeft />
                  <span>قوانین سایت</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center gap-4">
            <Image
              alt="logo"
              width={120}
              height={120}
              src="/images/Licenses/1.png"
            />
            <Image
              alt="logo"
              width={120}
              height={120}
              src="/images/Licenses/2.png"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
