"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// USING CONTEXT
import { useAppContext } from "../../../context/app-context";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({});

  // IF USER WANTS TO LOGED IN OR REGISTERED IT DOSEN'T HAVE TOKEN AND ITS CART SHOULD BE ZERO
  const { setCartNumber } = useAppContext();
  setCartNumber(0);

  const router = useRouter();

  // IF USER HAD TOKEN SHOULD BE REDIRECTED TO ACCOUNT PAGE
  const [auth_cookie, setauth_cookie] = useState(Cookies.get("auth_cookie"));

  useEffect(() => {
    setauth_cookie(Cookies.get("auth_cookie"));
  }, [Cookies.get("auth_cookie")]);

  const formSubmitter = () => {
    const formData = {
      username: watch("username"),
      displayname: watch("displayname"),
      email: watch("email"),
      password: watch("password"),
      rePassword: watch("repassword"),
      favoriteProducts: [],
      userProducts: [],
      comments: [],
      payments: [],
      cart: [],
      viewed: false,
      userIsActive: false,
      emailSend: true,
    };
    const backendUrl = `https://fileshop-server.iran.liara.run/api/register-user`;
    axios
      .post(backendUrl, formData)
      .then((d) => {
        Cookies.set("auth_cookie", d.data.auth, { expires: 60 });
        const message = d.data.msg
          ? d.data.msg
          : "ثبت نام شما با موفقیت انجام شد!";
        toast.success(message, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        router.push("/account/info");
      })
      .catch((err) => {
        const errorMsg =
          err.response && err.response.data && err.response.data.msg
            ? err.response.data.msg
            : "خطا";
        toast.error(errorMsg, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <section className="container mx-auto flex justify-center items-center">
      <form
        onSubmit={handleSubmit(formSubmitter)}
        className="flex flex-col gap-6 m-4 md:m-8 w-full md:w-[30rem] bg-[#FFFAE7] rounded-md p-2 md:p-8"
      >
        <div className="flex justify-center items-center gap-6 flex-wrap">
          <h1 className="text-base md:text-lg text-center text-blue-600 ">
            ثبت نام در سایت
          </h1>
          <Link
            className="bg-blue-600 rounded-md text-white px-2 py-1 transition-all duration-200 hover:bg-blue-700"
            href={"/login"}
          >
            ورود به حساب
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="text"
            autoComplete="off"
            placeholder="نام کاربری"
            className="p-2 w-full outline-none border-zinc-400 border-2 rounded-md focus:border-[#D2001A] "
            {...register("username", {
              required: true,
              maxLength: 20,
              minLength: 8,
            })}
          />
          {errors.username && errors.username.type == "required" && (
            <div className="text-rose-500 text-sm">
              نام کاربری وارد نشده است!
            </div>
          )}
          {errors.username && errors.username.type == "maxLength" && (
            <div className="text-rose-500 text-sm">
              نام کاربری باید کمتر از 20 کاراکتر باشد!
            </div>
          )}
          {errors.username && errors.username.type == "minLength" && (
            <div className="text-rose-500 text-sm">
              نام کاربری باید بیشتر از 8 کاراکتر باشد!
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="text"
            autoComplete="off"
            placeholder="نام نمایشی"
            className="p-2 w-full outline-none border-zinc-400 border-2 rounded-md focus:border-[#D2001A] "
            {...register("displayname", {
              required: true,
              maxLength: 20,
              minLength: 8,
            })}
          />
          {errors.displayname && errors.displayname.type == "required" && (
            <div className="text-rose-500 text-sm">
              نام نمایشی وارد نشده است!
            </div>
          )}
          {errors.displayname && errors.displayname.type == "maxLength" && (
            <div className="text-rose-500 text-sm">
              نام نمایشی باید کمتر از 20 کاراکتر باشد!
            </div>
          )}
          {errors.displayname && errors.displayname.type == "minLength" && (
            <div className="text-rose-500 text-sm">
              نام نمایشی باید بیشتر از 8 کاراکتر باشد!
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="email"
            autoComplete="off"
            placeholder="ایمیل"
            className="p-2 w-full outline-none border-zinc-400 border-2 rounded-md focus:border-[#D2001A] "
            {...register("email", {
              required: true,
              minLength: 11,
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
          />
          {errors.email && errors.email.type == "required" && (
            <div className="text-rose-500 text-sm">ایمیل را وارد کنید!</div>
          )}
          {errors.email && errors.email.type == "pattern" && (
            <div className="text-rose-500 text-sm">فرمت ایمیل صحیح نیست!</div>
          )}
          {errors.email && errors.email.type == "minLength" && (
            <div className="text-rose-500 text-sm">
              طول ایمیل حداقل باید 11 کاراکتر باشد!
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="password"
            autoComplete="off"
            placeholder="رمز عبور"
            className="p-2 w-full outline-none border-zinc-400 border-2 rounded-md focus:border-[#D2001A] "
            {...register("password", {
              required: true,
              maxLength: 20,
              minLength: 8,
            })}
          />
          {errors.password && errors.password.type == "required" && (
            <div className="text-rose-500 text-sm">رمز عبور وارد نشده است!</div>
          )}
          {errors.password && errors.password.type == "maxLength" && (
            <div className="text-rose-500 text-sm">
              رمز عبور باید کمتر از 20 کاراکتر باشد!
            </div>
          )}
          {errors.password && errors.password.type == "minLength" && (
            <div className="text-rose-500 text-sm">
              رمز عبور باید بیشتر از 8 کاراکتر باشد!
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="password"
            autoComplete="off"
            placeholder="تکرار رمز عبور"
            className="p-2 w-full outline-none border-zinc-400 border-2 rounded-md focus:border-[#D2001A] "
            {...register("repassword", {
              required: true,
              validate: (val) => val === watch("password"),
            })}
          />
          {errors.repassword && errors.repassword.type == "required" && (
            <div className="text-rose-500 text-sm">رمز عبور وارد نشده است!</div>
          )}
          {errors.repassword && errors.repassword.type == "validate" && (
            <div className="text-rose-500 text-sm">
              رمز عبور وارد شده مطابقت ندارد!
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 rounded-md p-2 text-white w-full transitioln-all duration-200 hover:bg-blue-700"
        >
          ثبت نام در سایت
        </button>
      </form>
    </section>
  );
};

export default RegisterForm;
