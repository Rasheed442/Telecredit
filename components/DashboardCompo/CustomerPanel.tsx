"use client";

import React from "react";

const networks = [
  {
    rank: 1,
    name: "MTN",
    phone: "08115322207",
    bg: "https://cdn.worldvectorlogo.com/logos/mtn-new-logo.svg",
    textColor: "#111",
    display: "",
    fontSize: "18px",
    size: 100,
  },
  {
    rank: 2,
    name: "Glo",
    phone: "08108762779",
    bg: "https://cdn.punchng.com/wp-content/uploads/2025/07/15224513/Globacom-logo.jpg",
    textColor: "#fff",
    display: "",
    fontSize: "22px",
    size: 80,
  },
  {
    rank: 3,
    name: "Airtel",
    phone: "0708762779",
    bg: "https://media.licdn.com/dms/image/v2/D4D0BAQGN7-Wg9ljDMw/company-logo_200_200/company-logo_200_200/0/1666835995579/airtel_business_logo?e=2147483647&v=beta&t=sTKNbFVRolBBZzIwB1ACRSAeM7JWjHsWGJaW3jwdaak",
    textColor: "#fff",
    display: "",
    fontSize: "28px",
    size: 70,
  },
];

const REPEAT_USERS_PCT = 65;
const TOTAL_SEGMENTS = 120;
const filledSegments = Math.round((REPEAT_USERS_PCT / 100) * TOTAL_SEGMENTS);

// Sort so rank 1 appears in center
const displayOrder = [
  networks.find((n) => n.rank === 3)!,
  networks.find((n) => n.rank === 1)!,
  networks.find((n) => n.rank === 2)!,
];

export default function CustomerPanel() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
      {/* Header */}
      <h3 className="font-ibm-plex-sans text-[20px] font-medium text-[#1F2937] mb-1">
        Customer panel
      </h3>
      <p className="font-mulish text-[15px] font-normal text-[#667085] mb-6">
        Shows top borrowers and repeat usage trends
      </p>

      {/* Network logos */}
      <div className="flex justify-around items-end py-6 gap-3">
        {displayOrder.map((net) => (
          <div
            key={net.name}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div className="relative">
              {/* Logo circle */}
              <div
                className="rounded-full flex items-center justify-center font-bold"
                style={{
                  width: net.size,
                  height: net.size,
                  backgroundImage: `url(${net.bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: net.textColor,
                  fontSize: net.fontSize,
                  fontStyle: net.name === "Glo" ? "italic" : "normal",
                }}
              >
                {net.display}
              </div>
              {/* Rank badge */}
              <div
                className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#4B47D6] text-white text-[11px] font-semibold flex items-center justify-center"
                style={net.rank === 2 ? { left: "auto", right: "-4px" } : {}}
              >
                {net.rank}
              </div>
            </div>
            <span className="text-[14px] font-medium text-[#667085] font-mulish">{net.phone}</span>
            <span className="text-[16px] font-semibold font-ibm-plex-sans text-[#1F2937]">
              {net.name}
            </span>
          </div>
        ))}
      </div>

      {/* Repeat users bar */}
      <div className="border-t border-[#F3F4F6] pt-4">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[14px] font-normal text-[#667085] font-mulish">Repeat Users</span>
          <span className="text-[16px] font-semibold text-[#1F2937]">
            {REPEAT_USERS_PCT}%
          </span>
        </div>

        {/* Segmented bar */}
        <div className="flex gap-[3px]">
          {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
            <div
              key={i}
              className="flex h-3 rounded-sm w-[5px]"
              style={{
                background: i < filledSegments ? "#7B75F0" : "#E0DFFB",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}