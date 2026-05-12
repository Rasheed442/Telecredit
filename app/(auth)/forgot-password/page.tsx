"use client";

import { loginbg, logo } from "@/constant";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import { useState, useRef } from "react";
import LabelInput from "@/Reusables/LabelInput";

type Step = "forgot" | "otp" | "reset";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("forgot");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── OTP helpers ── */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  /* ── Submit handlers ── */
  const handleForgotSubmit = async (
    _values: { email: string },
    { setSubmitting }: any,
  ) => {
    setSubmitting(false);
    setStep("otp");
  };

  const handleOtpSubmit = () => {
    setStep("reset");
  };

  const handleResetSubmit = async (
    _values: { newPassword: string; retypePassword: string },
    { setSubmitting }: any,
  ) => {
    setSubmitting(false);
    router.push("/");
  };

  /* ── Left panel (shared) ── */
  const LeftPanel = () => (
    <div className="hidden lg:flex bg-[#131E35] h-full flex-col">
      <div className="flex gap-3 p-4 pt-8 pl-8">
        <Image src={logo} alt="TeleCredit" width={170} height={170} />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-12 pb-10">
        <div className="flex flex-col items-center w-full max-w-[650px]">
          <div className="relative w-full aspect-[16/10] rounded-2xl mb-8">
            <Image
              src={loginbg}
              alt="Dashboard preview"
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
              Detect fraud, manage exposure, and enforce underwriting decisions
              across telco networks from a single command center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Right panel wrapper (shared) ── */
  const RightPanelWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center flex-1 min-h-screen lg:min-h-0 px-6 sm:px-10 bg-[#131E35] lg:bg-white">
      {/* Logo — mobile only */}
      <div className="lg:hidden mb-8 self-start">
        <Image src={logo} alt="TeleCredit" width={150} height={150} />
      </div>

      <div className="justify-center items-center w-[90%] flex lg:w-[75%]">
        <div className="w-full ">
          {/* Lock icon */}
          <div className="flex mb-6">
            <div className="relative h-10 w-10 lg:w-18 lg:h-18 rounded-full bg-[#EFF4FF] flex items-center justify-center shadow-[0_0_0_12px_#EFF4FF80]">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 11H7C5.895 11 5 11.895 5 13V19C5 20.105 5.895 21 7 21H17C18.105 21 19 20.105 19 19V13C19 11.895 18.105 11 17 11Z"
                  stroke="#9BACC8"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 11V7C8 5.674 8.527 4.402 9.464 3.464C10.402 2.527 11.674 2 13 2C13.657 2 14.307 2.129 14.914 2.381"
                  stroke="#9BACC8"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════
     STEP 1 — Forgot Password
  ══════════════════════════════════════ */
  if (step === "forgot") {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col lg:grid lg:grid-cols-2">
        <LeftPanel />
        <RightPanelWrapper>
          <h2 className="text-white lg:text-[#1B1B1B] text-[32px] sm:text-[40px] font-semibold font-sf-pro leading-tight">
            Forgot Password?
          </h2>
          <p className="text-[#BEBEBE] lg:text-gray-500 font-ibm-plex-sans text-[15px] font-light mt-1">
            Enter your verified email to reset your password
          </p>

          <Formik initialValues={{ email: "" }} onSubmit={handleForgotSubmit}>
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4 pt-4 py-4">
                <Field name="email">
                  {({ field }: any) => (
                    <LabelInput
                      title="Email*"
                      placeholder="Enter your email"
                      type="email"
                      style="bg-[#f7fbff] w-full border-1 border-[#ECEFF3] border-[#9B9B9B] outline-none placeholder:text-[#9B9B9B] text-[#474747] placeholder:text-[16px] text-[16px] rounded-lg h-[44px] px-4 font-light"
                      labelstyle="text-white lg:text-[#1B1B1B]"
                      field={field}
                    />
                  )}
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full transition-[0.2s] text-[16px] font-medium bg-[#243B6B] border border-white/20 lg:border-transparent text-white text-center my-4 p-3 rounded-md disabled:opacity-50"
                >
                  Proceed
                </button>
              </Form>
            )}
          </Formik>

          <div className="flex justify-center gap-1 items-center">
            <p className="text-white/70 lg:text-[#1A1A1A] text-[14px] font-geist font-light">
              Didn&apos;t forget password?
            </p>
            <p
              onClick={() => router.push("/")}
              className="text-white lg:text-[#1A1A1A] text-[15px] font-geist font-normal border-b border-white lg:border-[#1A1A1A] cursor-pointer hover:opacity-80 transition-opacity"
            >
              Sign in
            </p>
          </div>
        </RightPanelWrapper>
      </div>
    );
  }

  /* ══════════════════════════════════════
     STEP 2 — OTP Verification
  ══════════════════════════════════════ */
  if (step === "otp") {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col lg:grid lg:grid-cols-2">
        <LeftPanel />
        <RightPanelWrapper>
          <h2 className="text-white lg:text-[#1B1B1B] text-[32px] sm:text-[40px] font-semibold font-sf-pro leading-tight">
            OTP Verification
          </h2>
          <p className="text-[#BEBEBE] lg:text-gray-500 font-ibm-plex-sans text-[15px] font-light mt-1">
            Enter the code sent to your email to reset your password.
          </p>

          <div className="flex flex-col gap-4 pt-6 pb-4">
            <label className="text-white lg:text-[#1B1B1B] text-[14px] font-medium font-sf-pro">
              Enter Code*
            </label>

            {/* OTP boxes + Proceed button share the same width container */}
            <div className="flex flex-col gap-4 w-fit">
              <div className="flex gap-3 flex-wrap">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-[52px] h-[52px] text-center text-[20px] font-medium text-[#474747] bg-[#f7fbff] border border-[#ECEFF3] rounded-lg outline-none focus:border-[#243B6B] focus:ring-1 focus:ring-[#243B6B] transition-all"
                    placeholder="0"
                  />
                ))}
              </div>

              <button
                onClick={handleOtpSubmit}
                className="cursor-pointer w-full transition-[0.2s] text-[16px] font-medium bg-[#243B6B] border border-white/20 lg:border-transparent text-white text-center p-3 rounded-md"
              >
                Proceed
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-1 items-center">
            <p className="text-white/70 lg:text-[#1A1A1A] text-[14px] font-geist font-light">
              Didn&apos;t forget password?
            </p>
            <p
              onClick={() => router.push("/")}
              className="text-white lg:text-[#1A1A1A] text-[15px] font-geist font-normal border-b border-white lg:border-[#1A1A1A] cursor-pointer hover:opacity-80 transition-opacity"
            >
              Sign in
            </p>
          </div>
        </RightPanelWrapper>
      </div>
    );
  }

  /* ══════════════════════════════════════
     STEP 3 — Reset Password
  ══════════════════════════════════════ */
  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:grid lg:grid-cols-2">
      <LeftPanel />
      <RightPanelWrapper>
        <h2 className="text-white lg:text-[#1B1B1B] text-[32px] sm:text-[40px] font-semibold font-sf-pro leading-tight">
          Reset Password
        </h2>
        <p className="text-[#BEBEBE] lg:text-gray-500 font-ibm-plex-sans text-[15px] font-light mt-1">
          Enter new password to reset your password
        </p>

        <Formik
          initialValues={{ newPassword: "", retypePassword: "" }}
          onSubmit={handleResetSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4 pt-4 py-4">
              <Field name="newPassword">
                {({ field }: any) => (
                  <LabelInput
                    title="New Password*"
                    placeholder="Enter your Password"
                    type="password"
                    style="bg-[#f7fbff] w-full border-1 border-[#ECEFF3] border-[#9B9B9B] outline-none placeholder:text-[#9B9B9B] text-[#474747] placeholder:text-[16px] text-[16px] rounded-lg h-[44px] px-4 font-light"
                    labelstyle="text-white lg:text-[#1B1B1B]"
                    field={field}
                  />
                )}
              </Field>

              <Field name="retypePassword">
                {({ field }: any) => (
                  <LabelInput
                    title="Retype Password*"
                    placeholder="Enter your Password"
                    type="password"
                    style="bg-[#f7fbff] w-full border-1 border-[#ECEFF3] border-[#9B9B9B] outline-none placeholder:text-[#9B9B9B] text-[#474747] placeholder:text-[16px] text-[16px] rounded-lg h-[44px] px-4 font-light"
                    labelstyle="text-white lg:text-[#1B1B1B]"
                    field={field}
                  />
                )}
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full transition-[0.2s] text-[16px] font-medium bg-[#243B6B] border border-white/20 lg:border-transparent text-white text-center my-4 p-3 rounded-md disabled:opacity-50"
              >
                Continue
              </button>
            </Form>
          )}
        </Formik>

        <div className="flex justify-center gap-1 items-center">
          <p className="text-white/70 lg:text-[#1A1A1A] text-[14px] font-geist font-light">
            Forgot password?
          </p>
          <p
            onClick={() => setStep("forgot")}
            className="text-white lg:text-[#1A1A1A] text-[15px] font-geist font-normal border-b border-white lg:border-[#1A1A1A] cursor-pointer hover:opacity-80 transition-opacity"
          >
            Reset Password
          </p>
        </div>
      </RightPanelWrapper>
    </div>
  );
}
