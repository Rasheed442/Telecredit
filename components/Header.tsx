"use client";

import { light, notification, prodlogo, profile, settings } from "@/constant";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-end border-b bg-white border-gray-200 px-6 h-[8vh]">
      {/* <Image src={prodlogo} alt='logo' width={150} height={150} /> */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-3">
          <Image
            src={light}
            alt="light"
            width={38}
            height={38}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
          <Image
            src={settings}
            alt="settings"
            width={38}
            height={38}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
          <Image
            src={notification}
            alt="notification"
            width={38}
            height={38}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={profile}
            alt="profile"
            width={40}
            height={40}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
          <div className="flex flex-col">
            <p className="text-[#1F2937] text-[14px] font-semibold">
              Administrator
            </p>
            <p className="text-[#667085] text-[12px] font-medium font-mulish">
              Logout Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
