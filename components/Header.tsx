"use client";

import { light, notification, profile, settings } from "@/constant";
import { openMobileNav } from "@/components/Navbar"; // adjust import path
import Image from "next/image";
import React from "react";
import { HiMenu } from "react-icons/hi";

const Header = () => {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white border-gray-200 px-4 lg:px-6 h-[8vh]">
      {/* Hamburger — mobile only, left side */}
      <button
        onClick={openMobileNav}
        className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
      >
        <HiMenu size={22} />
      </button>

      {/* Empty spacer on desktop (nothing on the left) */}
      <div className="hidden lg:block" />

      {/* Right side icons + profile */}
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="flex items-center gap-1 lg:gap-2">
          <Image
            src={light}
            alt="light"
            width={32}
            height={32}
            className="cursor-pointer hover:opacity-80 transition-opacity w-7 h-7 lg:w-8 lg:h-8"
          />
          <Image
            src={settings}
            alt="settings"
            width={32}
            height={32}
            className="cursor-pointer hover:opacity-80 transition-opacity w-7 h-7 lg:w-8 lg:h-8"
          />
          <Image
            src={notification}
            alt="notification"
            width={32}
            height={32}
            className="cursor-pointer hover:opacity-80 transition-opacity w-7 h-7 lg:w-8 lg:h-8"
          />
        </div>

        <div className="w-px h-5 bg-gray-200" />

        <div className="flex items-center gap-2">
          <Image
            src={profile}
            alt="profile"
            width={36}
            height={36}
            className="cursor-pointer hover:opacity-80 transition-opacity rounded-full w-8 h-8 lg:w-9 lg:h-9"
          />
          <div className="hidden lg:flex lg:flex-col">
            <p className="text-[#1F2937] text-[13px] font-semibold leading-tight">
              Administrator
            </p>
            <p className="text-[#667085] text-[11px] font-medium font-mulish">
              Logout Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
