"use client";

import { loginbg, logo } from "@/constant";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import { useState, useEffect } from "react";
import LabelInput from "@/Reusables/LabelInput";

export default function Home() {
  const route = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [loginMode] = useState<"admin" | "org">("admin");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (
    values: { username: string; password: string },
    { setSubmitting }: any,
  ) => {
    route.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:grid lg:grid-cols-2">
      {/* ── Left panel — hidden on mobile, shown lg+ ── */}
      <div className="hidden lg:flex bg-[#131E35] h-full flex-col">
        <div className="flex gap-3 p-4 pt-8 pl-8">
          <Image src={logo} alt="" width={170} height={170} />
        </div>

        <div className="flex flex-col items-center justify-center flex-1 px-12 pb-10">
          <div className="flex flex-col items-center w-full max-w-[650px]">
            <div className="relative w-full aspect-[16/10] rounded-2xl mb-8">
              <Image
                src={loginbg}
                alt="Carousel Image"
                fill
                className="object-contain"
              />
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
          </div>
        </div>
      </div>

      {/* ── Right panel (form) — full screen on mobile ── */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-screen lg:min-h-0 px-6 sm:px-10 bg-[#131E35] lg:bg-white">
        {/* Logo — mobile only */}
        <div className="lg:hidden mb-8 self-start">
          <Image src={logo} alt="" width={150} height={150} />
        </div>

        <div className="w-full max-w-[600px]">
          <h2 className="text-white lg:text-[#1B1B1B] text-[32px] sm:text-[40px] font-semibold font-sf-pro leading-tight">
            Welcome back
          </h2>

          <p className="text-[#BEBEBE] lg:text-gray-500 font-ibm-plex-sans text-[15px] font-light mt-1">
            Enter your credentials to access system-level controls and
            <br className="hidden sm:block" /> analytics
          </p>

          <Formik
            key={loginMode}
            initialValues={{ username: "", password: "" }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4 pt-4 py-4">
                <Field name="username">
                  {({ field }: any) => (
                    <LabelInput
                      title="Username*"
                      placeholder="Username *"
                      type="text"
                      style="bg-[#f7fbff] w-full border-1 border-[#ECEFF3] border-[#9B9B9B] outline-none placeholder:text-[#9B9B9B] text-[#474747] placeholder:text-[16px] text-[16px] rounded-lg h-[44px] px-4 font-light"
                      labelstyle="text-white lg:text-[#1B1B1B]"
                      field={field}
                    />
                  )}
                </Field>

                <Field name="password">
                  {({ field }: any) => (
                    <LabelInput
                      title="Password*"
                      placeholder="Password *"
                      type="password"
                      style="bg-[#f7fbff] w-full border-1 border-[#ECEFF3] outline-none border-[#9B9B9B] placeholder:text-[#9B9B9B] text-[#474747] placeholder:text-[14px] text-[16px] rounded-lg h-[44px] px-4 font-light"
                      labelstyle="text-white lg:text-[#1B1B1B]"
                      field={field}
                    />
                  )}
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full transition-[0.2s] text-[16px] text-ibm-flex-sans font-medium bg-[#243B6B] lg:bg-[#243B6B] border border-white/20 lg:border-transparent text-white text-center my-4 p-3 rounded-md disabled:opacity-50"
                >
                  Sign In
                </button>
              </Form>
            )}
          </Formik>

          <div className="flex justify-center gap-1 items-center">
            <p className="text-white/70 lg:text-[#1A1A1A] text-[14px] font-geist font-light">
              Forgot Password?
            </p>
            <p className="text-white lg:text-[#1A1A1A] text-[15px] font-geist font-normal border-b border-white lg:border-[#1A1A1A] cursor-pointer hover:opacity-80 transition-opacity">
              Reset Password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
