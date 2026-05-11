"use client";

import { loginbg, logo, quicklink, speedo } from "@/constant";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axiosInstance from "./utils/axios";
import { LoginUrl } from "./utils/endpoint";

import LabelInput from "@/Reusables/LabelInput";

// const adminLoginSchema = Yup.object().shape({
//   username: Yup.string().required("Username is required"),
//   password: Yup.string()
//     .required("Password is required")
//     .min(6, "Password must be at least 6 characters"),
// });

// const orgLoginSchema = Yup.object().shape({
//   username: Yup.string().required("Username is required"),
//   password: Yup.string()
//     .required("Password is required")
//     .min(6, "Password must be at least 6 characters"),
// });

const carouselSlides = [
  {
    image: loginbg,
    leftBadgeTitle: "₦47B+",
    leftBadgeText: "Fraud blocked this year",
    rightBadgeTitle: "99.9%",
    rightBadgeText: "Detection accuracy",
    headingNormal: "Detect threats before they ",
    headingHighlight: "strike.",
    description:
      "Real-time fraud detection and behavioral analytics purpose-built for Nigerian financial institutions.",
  },
  {
    image: loginbg,
    leftBadgeTitle: "100M+",
    leftBadgeText: "Transactions monitored",
    rightBadgeTitle: "0.1s",
    rightBadgeText: "Avg response time",
    headingNormal: "Secure your transactions with ",
    headingHighlight: "confidence.",
    description:
      "Advanced AI-driven security protecting millions of daily transactions across Africa.",
  },
  {
    image: loginbg,
    leftBadgeTitle: "24/7",
    leftBadgeText: "Active monitoring",
    rightBadgeTitle: "50+",
    rightBadgeText: "Partner institutions",
    headingNormal: "Empower your team with ",
    headingHighlight: "insights.",
    description:
      "Comprehensive reporting and analytics dashboard for fraud mitigation teams.",
  },
];

export default function Home() {
  const route = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [loginMode, setLoginMode] = useState<"admin" | "org">("admin");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  // Redirect to dashboard if already authenticated

  const handleSubmit = async (
    values: { username: string; password: string },
    { setSubmitting }: any,
  ) => {
    // Bypass validation and go directly to dashboard
    // try {
    //   const payload = { username: values.username, password: values.password };

    //   const response = await axiosInstance.post(LoginUrl, payload);

    //   if (response.data.token) {
    //     // Store token in localStorage
    //     localStorage.setItem("jwt_token", response.data.token);
    //     toast.success("Login successful");
    //     route.push("/dashboard");
    //   } else {
    //     toast.error("Login failed");
    //   }
    // } catch (error: any) {
    //   console.error("Login error:", error);
    //   const errorMessage =
    //     error?.response?.data?.message ||
    //     error?.message ||
    //     "Login failed. Please try again.";
    //   toast.error(errorMessage);
    // } finally {
    //   setSubmitting(false);
    // }

    // Direct access to dashboard without validation
    route.push("/dashboard");
  };

  return (
    <div
      style={{ backgroundColor: "#ffffff" }}
      className="h-screen min-h-[800px] min-w-[1240px] w-full grid grid-cols-2 bg-white overflow-auto"
    >
      <div className=" bg-[#131E35] h-full">
        <div className="flex  gap-3 p-4 pt-8 pl-8">
          <Image src={logo} alt="" width={170} height={170} />
          {/* <p className="text-[#1A1A1A] text-[20px] font-bold">Fraud Analyzer</p> */}
        </div>

        <div className="flex flex-col items-center justify-center h-[80%] w-full relative px-12">
          <div
            className={`absolute flex flex-col items-center w-full max-w-[650px] transition-opacity duration-1000 `}
          >
            <div className="relative w-full aspect-[16/10] rounded-2xl mb-8 group cursor-pointer">
              <Image
                src={loginbg}
                alt="Carousel Image"
                fill
                className="object-contain"
              />

              <div className="absolute -left-8 bottom-6 bg-[#1A2234]/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] -rotate-3 group-hover:rotate-0 transition-transform duration-300 overflow-hidden">
                <span className="text-[#00E599] font-bold text-[16px]"></span>
                <span className="text-white text-[14px] font-light"></span>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
              </div>

              <div className="absolute -right-6 top-8 bg-[#1A2234]/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rotate-3 group-hover:rotate-0 transition-transform duration-300 group-hover:bg-white/20 group-hover:border-white/50 z-20 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
              </div>
            </div>

            <div className="text-center flex flex-col items-center gap-4 w-full">
              <h2 className="text-[30px] text-white font-semibold font-sf-pro leading-tight">
                Airtime & Data Credit{" "}
                <span className="text-[#5490DE] font-dm-serif italic font-normal">
                  Risk Control Hub
                </span>
              </h2>
              <p className="text-[#BEBEBE] text-[16px] font-light font-ibm-plex-sans text-center max-w-[90%]">
                Detect fraud, manage exposure, and enforce underwriting
                decisions across telco networks from a single command center.
              </p>
            </div>
            <div className="flex max-w-[650px] items-center gap-2 absolute bottom-[-10%]"></div>
          </div>
        </div>
      </div>

      <div>
        {/* <div className="flex justify-end items-end p-2">
    <button
            onClick={() => setLoginMode(prev => prev === "admin" ? "org" : "admin")}
            className="flex border border-[#1B1B1B] rounded-md text-[12px] px-4 py-1 text-[#1B1B1B]"
          >
            {loginMode === "admin" ? "Switch to Organisation Login" : "Switch to Admin Login"}
          </button>
  </div> */}

        <div className="flex flex-col items-center justify-center h-[90%]">
          <div className="w-full max-w-[600px] m-auto px-4">
            <h2 className="text-[#1B1B1B] text-[40px] text-gray-900 font-semibold font-sf-pro leading-18">
              Welcome back
            </h2>

            <p className="text-gray-500 font-ibm-plex-sans text-[15px] font-light">
              Enter your credentials to access system-level controls and
              <br /> analytics
            </p>

            <Formik
              key={loginMode}
              initialValues={{ username: "", password: "" }}
              // validationSchema={
              //   loginMode === "admin" ? adminLoginSchema : orgLoginSchema
              // }
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="flex flex-col gap-4 pt-4 py-4">
                  <Field name="username">
                    {({ field }: any) => (
                      <LabelInput
                        title="Username*"
                        placeholder="Username *"
                        type="text"
                        style="bg-[#f7fbff]  w-full border-1 border-[#ECEFF3] border-[#9B9B9B] outline-none placeholder:text-[#9B9B9B] text-[#474747] placeholder:text-[16px] text-[16px] rounded-lg h-[44px] px-4 font-light"
                        labelstyle=""
                        field={field}
                      />
                    )}
                  </Field>
                  {/* {errors.username && touched.username && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </div>
                  )} */}

                  <Field name="password">
                    {({ field }: any) => (
                      <LabelInput
                        title="Password*"
                        placeholder="Password *"
                        type="password"
                        style="bg-[#f7fbff] w-full border-1 border-[#ECEFF3] outline-none border-[#9B9B9B] placeholder:text-[#9B9B9B] text-[#474747]  placeholder:text-[14px] text-[16px] rounded-lg h-[44px] px-4 font-light"
                        labelstyle=""
                        field={field}
                      />
                    )}
                  </Field>
                  {/* {errors.password && touched.password && (
                    <div className="text-red-500 text-xs ">
                      {errors.password}
                    </div>
                  )} */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full transition-[0.2s] text-[16px] text-ibm-flex-sans font-medium bg-[#243B6B] text-white text-center my-4 p-3 rounded-md disabled:opacity-50"
                  >
                    Sign In
                  </button>
                </Form>
              )}
            </Formik>
            <div className="flex justify-center gap-1 items-center">
              <p className="text-[#1A1A1A] text-[14px] font-geist font-light">
                Forgot Password?
              </p>
              <p className="text-[#1A1A1A] text-[15px] font-geist font-normal border-b border-[#1A1A1A] cursor-pointer hover:opacity-80 transition-opacity">
                Reset Password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
