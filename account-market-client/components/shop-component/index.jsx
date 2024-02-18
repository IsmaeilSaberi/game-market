"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import GraphicSliderBox from "../sliders/graphic-slider/graphicSliderBox";
import { useRouter } from "next/navigation";
import { BiFilterAlt } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

const ShopComponent = ({ url }) => {
  const goTopCtrl = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const router = useRouter();

  const [result, setresult] = useState([-1]);
  const [btns, setbtns] = useState([-1]);

  const [title, settitle] = useState(
    url.keyword && url.keyword.length > 0
      ? unescape(url.keyword).split("_").join(" ")
      : ""
  );

  const [keyword, setkeyword] = useState(
    url.keyword && url.keyword.length > 0
      ? `&keyword=${unescape(url.keyword).replace(/\s+/g, "_").toLowerCase()}`
      : ""
  );
  const [orderBy, setorderBy] = useState(
    url.orderBy ? `&orderBy=${url.orderBy}` : "&orderBy=date"
  );
  const [typeOfPro, settypeOfPro] = useState(
    url.type ? `&type=${url.type}` : ""
  );
  const [maxPrice, setmaxPrice] = useState(
    url.maxP ? `&maxP=${url.maxP}` : "&maxP=1000000000"
  );
  const [maxPriceInputNumber, setmaxPriceInputNumber] = useState(
    url.maxP ? url.maxP : 1000000000
  );
  const [minPrice, setminPrice] = useState(
    url.minP ? `&minP=${url.minP}` : "&minP=0"
  );
  const [minPriceInputNumber, setminPriceInputNumber] = useState(
    url.minP ? url.minP : 0
  );
  const [categories, setcategories] = useState(
    url.categories ? `&categories=${url.categories}` : ""
  );

  const [searchedProductsNumber, setsearchedProductsNumber] = useState(0);

  const [pgn, setpgn] = useState(url.pgn ? `&pgn=${url.pgn}` : "&pgn=12");
  const [pn, setpn] = useState(url.pn ? `&pn=${url.pn}` : "&pn=1");

  useEffect(() => {
    const frontQueries = `${
      keyword.length > 0
        ? `&keyword=${escape(keyword.replace("&keyword=", ""))}`
        : ""
    }${orderBy ? orderBy : ""}${typeOfPro ? typeOfPro : ""}${
      maxPrice ? maxPrice : ""
    }${minPrice ? minPrice : ""}${categories ? categories : ""}${
      pgn ? pgn : ""
    }${pn ? pn : ""}`;

    const backendQueries = `${keyword.length > 0 ? keyword : ""}${
      orderBy ? orderBy : ""
    }${typeOfPro ? typeOfPro : ""}${maxPrice ? maxPrice : ""}${
      minPrice ? minPrice : ""
    }${categories ? categories : ""}${pgn ? pgn : ""}${pn ? pn : ""}`;

    const mainFrontUrl = `/shop?${frontQueries}`;
    const mainBackendUrl = `https://fileshop-server.iran.liara.run/api/search-products?${backendQueries}`;

    setmenuIsOpen(-1);
    setpgn(`&pgn=12`);
    setresult([-1]);
    setbtns([-1]);
    goTopCtrl();
    router.push(mainFrontUrl);
    axios.get(mainBackendUrl).then((d) => {
      setresult(d.data.allProducts);
      setbtns(d.data.btns);
      setsearchedProductsNumber(d.data.productsNumber);
    });
  }, [keyword, orderBy, typeOfPro, maxPrice, minPrice, categories, pgn, pn]);

  // KEYWORD
  useEffect(() => {
    url.keyword == undefined || url.keyword.length < 1
      ? settitle(``)
      : settitle(unescape(url.keyword).split("_").join(" "));
    setpn(`&pn=1`);
    setkeyword(
      url.keyword && url.keyword.length > 0
        ? `&keyword=${unescape(url.keyword).replace(/\s+/g, "_").toLowerCase()}`
        : ""
    );
  }, [url.keyword]);

  // ORDER BY
  const orderBymanager = (v) => {
    setorderBy(`&orderBy=${v.target.value}`);
    setpn(`&pn=1`);
  };

  // TYPE OF PRODUCT
  const typeOfProductmanager = (v) => {
    if (v.target.value == "allPros") {
      settypeOfPro(``);
      url.keyword == undefined || url.keyword.length < 1
        ? settitle(``)
        : settitle(unescape(url.keyword).split("_").join(" "));
    } else {
      settypeOfPro(`&type=${v.target.value}`);
      url.keyword == undefined || url.keyword.length < 1
        ? settitle(
            v.target.value == "app"
              ? `اپلیکیشن ها`
              : v.target.value == "gr"
              ? `محصولات گرافیکی`
              : `کتاب ها`
          )
        : settitle(
            v.target.value == "app"
              ? `${unescape(url.keyword).split("_").join(" ")} از اپلیکیشن ها`
              : v.target.value == "gr"
              ? `${unescape(url.keyword)
                  .split("_")
                  .join(" ")} از محصولات گرافیکی`
              : `${unescape(url.keyword).split("_").join(" ")} از کتاب ها`
          );
    }
    setpn(`&pn=1`);
  };

  // PRICE
  const minPRef = useRef();
  const maxPRef = useRef();
  const pricemanager = (e) => {
    e.preventDefault();
    if (maxPRef.current.value == "" || maxPRef.current.value < 0) {
      maxPRef.current.value = 1000000000;
    }
    if (minPRef.current.value == "" || minPRef.current.value < 0) {
      minPRef.current.value = 0;
    }
    setmaxPrice(`&maxP=${maxPRef.current.value}`);
    setminPrice(`&minP=${minPRef.current.value}`);
    setpn(`&pn=1`);
  };

  // CATEGORIES
  const [allCats, setallCats] = useState([-1]);
  useEffect(() => {
    const url = "https://fileshop-server.iran.liara.run/api/product-categories";
    axios.get(url).then((d) => {
      setallCats(d.data);
    });
  }, []);

  const categoriesmanager = (v) => {
    if (v.target.checked) {
      if (categories.length > 0) {
        setcategories(`${categories},${v.target.value}`);
      } else {
        setcategories(`&categories=${v.target.value}`);
      }
    } else {
      const numberOfComos = categories.split(",").length - 1;
      ("categories=cat1,cat2,cat3");
      const a = categories.includes(`,${v.target.value}`)
        ? categories.replace(`,${v.target.value}`, "")
        : numberOfComos == 0
        ? ""
        : categories.replace(`${v.target.value},`, "");
      setcategories(a);
    }
    setpn(`&pn=1`);
  };

  // DEFAULT CATEGORIES
  const urlCatsSlugs = url.categories ? url.categories.split(",") : [];

  const urlCatsIds = [];
  urlCatsSlugs.map((c, i) => {
    for (let i = 0; i < allCats.length; i++) {
      if (c == allCats[i].slug) {
        urlCatsIds.push(allCats[i]._id);
      }
    }
  });

  // FOR RESPONSIVE
  const [menuIsOpen, setmenuIsOpen] = useState(-1);

  useEffect(() => {
    if (menuIsOpen == -1) {
      document.body.style.overflow = "auto";
    } else if (menuIsOpen == 1) {
      document.body.style.overflow = "hidden";
    }
  }, [menuIsOpen]);

  return (
    <div className=" container mx-auto flex justify-between items-start gap-2">
      <aside
        className={
          menuIsOpen == -1
            ? "z-50 md:z-30 flex flex-col gap-1 md:gap-4 bg-[#FFDE00] md:bg-transparent w-full md:w-80 h-[100vh] md:h-auto py-1 md:px-2 fixed top-0 bottom-0 left-[100%] -right-[100%] md:static transition-all duration-500 pt-10 md:pt-0"
            : "z-50 md:z-30 flex flex-col gap-1 md:gap-4 backdrop-blur-3xl md:bg-transparent w-full md:w-80 h-[100vh] md:h-auto py-1 md:px-2 fixed overflow-auto top-0 bottom-0 right-0 left-0 md:static transition-all duration-500 pt-10 md:pt-0"
        }
      >
        <div className="flex flex-col gap-1 md:gap-4 bg-transparent md:bg-[#FFFAE7] md:rounded-lg p-2 text-black text-xs md:text-base">
          <div className="text-black">مرتب سازی بر اساس</div>
          <div className="flex items-center justify-center 2xl:justify-between flex-wrap gap-2">
            <div className="flex justify-center items-center gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 hover:border-blue-400 rounded">
              <label htmlFor="date">جدیدترین</label>
              {orderBy == "&orderBy=date" ? (
                <input
                  onClick={orderBymanager}
                  type="radio"
                  name="orderBy"
                  id="date"
                  value={"date"}
                  defaultChecked
                />
              ) : (
                <input
                  onClick={orderBymanager}
                  type="radio"
                  name="orderBy"
                  id="date"
                  value={"date"}
                />
              )}
            </div>
            <div className="flex justify-center items-center gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 hover:border-blue-400 rounded">
              <label htmlFor="price">قیمت</label>
              {
                <input
                  onClick={orderBymanager}
                  type="radio"
                  name="orderBy"
                  id="price"
                  value={"price"}
                  defaultChecked={orderBy == "&orderBy=price"}
                />
              }
            </div>
            <div className="flex justify-center items-center gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 hover:border-blue-400 rounded">
              <label htmlFor="pageView">پربازدیدترین</label>
              {orderBy == "&orderBy=pageView" ? (
                <input
                  onClick={orderBymanager}
                  type="radio"
                  name="orderBy"
                  id="pageView"
                  value={"pageView"}
                  defaultChecked
                />
              ) : (
                <input
                  onClick={orderBymanager}
                  type="radio"
                  name="orderBy"
                  id="pageView"
                  value={"pageView"}
                />
              )}
            </div>
            <div className="flex justify-center items-center gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 hover:border-blue-400 rounded">
              <label htmlFor="buyNumber">پرفروش ترین</label>
              {orderBy == "&orderBy=buyNumber" ? (
                <input
                  onClick={orderBymanager}
                  type="radio"
                  name="orderBy"
                  id="buyNumber"
                  value={"buyNumber"}
                  defaultChecked
                />
              ) : (
                <input
                  onClick={orderBymanager}
                  type="radio"
                  name="orderBy"
                  id="buyNumber"
                  value={"buyNumber"}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 md:gap-4 bg-transparent md:bg-[#FFFAE7] md:rounded-lg p-2 text-black text-xs md:text-base">
          <div className="text-black">نوع محصول</div>
          <div className="flex items-center justify-center 2xl:justify-between flex-wrap gap-2">
            <div className="flex justify-center items-center gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 hover:border-blue-400 rounded">
              <label htmlFor="allPros">همه</label>
              {typeOfPro == "" ? (
                <input
                  onClick={typeOfProductmanager}
                  type="radio"
                  name="typeOfProduct"
                  id="allPros"
                  value={"allPros"}
                  defaultChecked
                />
              ) : (
                <input
                  onClick={typeOfProductmanager}
                  type="radio"
                  name="typeOfProduct"
                  id="allPros"
                  value={"allPros"}
                />
              )}
            </div>
            <div className="flex justify-center items-center gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 hover:border-blue-400 rounded">
              <label htmlFor="app">اپلیکیشن</label>
              {typeOfPro == "&type=app" ? (
                <input
                  onClick={typeOfProductmanager}
                  type="radio"
                  name="typeOfProduct"
                  id="app"
                  value={"app"}
                  defaultChecked
                />
              ) : (
                <input
                  onClick={typeOfProductmanager}
                  type="radio"
                  name="typeOfProduct"
                  id="app"
                  value={"app"}
                />
              )}
            </div>
            <div className="flex justify-center items-center gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 hover:border-blue-400 rounded">
              <label htmlFor="book">کتاب</label>
              {typeOfPro == "&type=book" ? (
                <input
                  onClick={typeOfProductmanager}
                  type="radio"
                  name="typeOfProduct"
                  id="book"
                  value={"book"}
                  defaultChecked
                />
              ) : (
                <input
                  onClick={typeOfProductmanager}
                  type="radio"
                  name="typeOfProduct"
                  id="book"
                  value={"book"}
                />
              )}
            </div>
            <div className="flex justify-center items-center gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 hover:border-blue-400 rounded">
              <label htmlFor="gr">فایل گرافیکی</label>
              {typeOfPro == "&type=gr" ? (
                <input
                  onClick={typeOfProductmanager}
                  type="radio"
                  name="typeOfProduct"
                  id="gr"
                  value={"gr"}
                  defaultChecked
                />
              ) : (
                <input
                  onClick={typeOfProductmanager}
                  type="radio"
                  name="typeOfProduct"
                  id="gr"
                  value={"gr"}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 md:gap-4 bg-transparent md:bg-[#FFFAE7] md:rounded-lg p-2 text-black text-xs md:text-base">
          <div className="text-black">بازه قیمت (تومان)</div>
          <form onSubmit={pricemanager} className="flex flex-col gap-4">
            <div className="flex items-center justify-center 2xl:justify-between flex-wrap gap-2">
              <input
                className="inputLtr text-center text-black gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 focus:border-blue-400 rounded"
                type="number"
                placeholder="حداقل قیمت"
                ref={minPRef}
                defaultValue={minPriceInputNumber}
                min={0}
              />
              <input
                className="inputLtr text-center text-black gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 focus:border-blue-400 rounded"
                type="number"
                placeholder="حداکثر قیمت"
                ref={maxPRef}
                defaultValue={maxPriceInputNumber}
                min={0}
              />
            </div>
            <div className=" flex justify-center">
              <button
                type="submit"
                className="w-60 md:w-full bg-[#D2001A] rounded h-8 md:h-10 flex justify-center items-center text-white transition-all duration-200 hover:bg-orange-500"
              >
                اعمال فیلتر قیمت
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-col gap-1 md:gap-4 bg-transparent md:bg-[#FFFAE7] md:rounded-lg p-2 text-black text-xs md:text-base">
          <div className="text-black">دسته بندی</div>
          <div className="flex items-center justify-center 2xl:justify-between flex-wrap gap-2">
            {allCats[0] == -1 ? (
              <div className=" w-full flex justify-center items-center p-12">
                <Image
                  alt="loading"
                  width={40}
                  height={40}
                  src={"/loading.svg"}
                />
              </div>
            ) : allCats.length < 1 ? (
              <div>دسته ای موجود نیست</div>
            ) : (
              <div className=" flex justify-center items-center w-full">
                <div className=" flex gap-2 flex-wrap justify-around items-center">
                  {allCats.map((da, i) => (
                    <div
                      key={i}
                      className="flex justify-center items-center gap-1 w-28 p-1 md:p-2 tesxt-base sm:text-xs border-2  border-gray-400 md:border-[#FFDE00] transition-all duration-200 hover:border-blue-400 rounded"
                    >
                      <label htmlFor={da.slug}>{da.title}</label>
                      {urlCatsIds.length < 1 ? (
                        <input
                          onClick={categoriesmanager}
                          type="checkbox"
                          id={da.slug}
                          value={da.slug}
                        />
                      ) : (
                        <input
                          onClick={categoriesmanager}
                          type="checkbox"
                          id={da.slug}
                          value={da.slug}
                          defaultChecked={urlCatsIds.includes(da._id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
      <main className=" bg-[#FFFAE7] rounded-lg p-2 w-full flex flex-col gap-8 pt-10 md:pt-0 px-2">
        <div className=" flex justify-between items-center">
          <h1 className=" text-base md:text-xl text-indigo-600 ">
            محصولات {title} فروشگاه مارکت بازی
          </h1>
          <div className=" text-base sm:text-sm rounded-md border-2 border-indigo-600 w-20 h-8 flex justify-center items-center">
            {searchedProductsNumber} محصول
          </div>
        </div>
        <div className=" flex flex-col gap-6">
          <section className=" flex justify-center lg:justify-between items-center gap-4 flex-wrap">
            {result[0] == -1 ? (
              <div className=" w-full flex justify-center items-center p-12">
                <Image
                  alt="loading"
                  width={120}
                  height={120}
                  src={"/loading.svg"}
                />
              </div>
            ) : result.length < 1 ? (
              <div>محصولی با این شرایط موجود نیست...</div>
            ) : (
              result.map((da, i) => <GraphicSliderBox key={i} itemData={da} />)
            )}
          </section>
          <section className=" flex justify-center items-center gap-4 flex-wrap">
            {btns[0] == -1 ? (
              <div className=" w-full flex justify-center items-center p-12">
                <Image
                  alt="loading"
                  width={50}
                  height={50}
                  src={"/loading.svg"}
                />
              </div>
            ) : (
              btns.map((da, i) => (
                <button
                  onClick={() => {
                    setpgn(`&pgn=12`);
                    setpn(`&pn=${da + 1}`);
                    goTopCtrl();
                    setresult([-1]);
                  }}
                  className={
                    pn == `&pn=${da + 1}`
                      ? "w-8 h-8 rounded border-2 bg-indigo-400 text-white border-indigo-500 transition-all duration-200 hover:bg-indigo-200"
                      : "w-8 h-8 rounded border-2 border-indigo-500 transition-all duration-200 hover:bg-indigo-200"
                  }
                  key={i}
                >
                  {da + 1}
                </button>
              ))
            )}
          </section>
        </div>
      </main>
      <div className="fixed z-50 flex md:hidden top-3 left-3">
        <BiFilterAlt
          onClick={() => setmenuIsOpen(menuIsOpen * -1)}
          className={
            menuIsOpen == -1
              ? "w-9 h-9 text-black flex"
              : "w-9 h-9 text-black hidden"
          }
        />
        <AiOutlineClose
          onClick={() => setmenuIsOpen(menuIsOpen * -1)}
          className={
            menuIsOpen == 1
              ? "w-10 h-10 text-black flex"
              : "w-10 h-10 text-black hidden"
          }
        />
      </div>
    </div>
  );
};

export default ShopComponent;
