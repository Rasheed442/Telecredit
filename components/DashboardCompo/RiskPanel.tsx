"use client";
import React from "react";
import Image from "next/image";
import { deliquent } from "@/constant";

// ── Data ──────────────────────────────────────────────────────────────
const highRisk = [
  { phone: "07086022674", reason: "Multiple defaults", amount: "₦600",  score: 89 },
  { phone: "08111222333", reason: "Velocity breach",   amount: "₦450",  score: 76 },
  { phone: "09044455566", reason: "Late payments",     amount: "₦380",  score: 72 },
];

const fraudBlocked = [
  { phone: "07086022674", reason: "Blacklisted",             time: "10:30:00" },
  { phone: "08111222333", reason: "Velocity limit exceeded", time: "11:15:00" },
  { phone: "09044455566", reason: "Duplicate",               time: "12:30:00" },
];

const delinquent = [
  { phone: "07086022674", dpd: "DPD 8-30" },
  { phone: "08111222333", dpd: "DPD 31+"  },
  { phone: "09044455566", dpd: "DPD 0"    },
  { phone: "09044455566", dpd: "DPD 1-7"  },
];

// ── Shared row wrapper ────────────────────────────────────────────────
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#EEF4FC] rounded-sm px-4 py-3">{children}</div>
);

// ── Panel header ──────────────────────────────────────────────────────
const PanelHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <Image src={deliquent} alt="alert" width={18} height={18} />
    <h3 className="text-[18px] font-semibold font-sf-pro text-[#1F2937]">{title}</h3>
  </div>
);

// ── Panel 1: High Risk Customer ───────────────────────────────────────
const HighRiskPanel = () => (
  <div className="bg-white rounded-sm p-5 border border-gray-200 flex flex-col gap-3">
    <PanelHeader title="High Risk Customer" />
    <div className="flex flex-col gap-3">
      {highRisk.map((item, i) => (
        <Row key={i}>
          <div className="flex justify-between items-start">
            <span className="text-[14px] font-semibold text-[#1F2937]">{item.phone}</span>
            <span className="text-[13px] font-medium text-red-500">Score: {item.score}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-[13px] text-[#667085]">{item.reason}</span>
            <span className="text-[13px] text-[#374151]">{item.amount}</span>
          </div>
        </Row>
      ))}
    </div>
  </div>
);

// ── Panel 2: Fraud Blocked Today ──────────────────────────────────────
const FraudPanel = () => (
  <div className="bg-white rounded-sm p-5 border border-gray-200 flex flex-col gap-3">
    <PanelHeader title="Fraud Blocked Today" />
    <div className="flex flex-col gap-3">
      {fraudBlocked.map((item, i) => (
        <Row key={i}>
          <div className="flex justify-between items-start">
            <span className="text-[14px] font-semibold text-[#1F2937]">{item.phone}</span>
            <span className="text-[13px] text-[#9CA3AF]">{item.time}</span>
          </div>
          <div className="mt-1">
            <span className="text-[13px] text-[#667085]">{item.reason}</span>
          </div>
        </Row>
      ))}
    </div>
  </div>
);

// ── Panel 3: New Delinquent Account ───────────────────────────────────
const DelinquentPanel = () => (
  <div className="bg-white rounded-sm p-5 border border-gray-200 flex flex-col gap-3">
    <PanelHeader title="New Delinquent Account" />
    <div className="flex flex-col gap-3">
      {delinquent.map((item, i) => (
        <Row key={i}>
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold text-[#1F2937]">{item.phone}</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] inline-block" />
              <span className="text-[13px] text-[#9CA3AF]">{item.dpd}</span>
            </div>
          </div>
        </Row>
      ))}
    </div>
  </div>
);

// ── Root ──────────────────────────────────────────────────────────────
export default function RiskPanel() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <HighRiskPanel />
      <FraudPanel />
      <DelinquentPanel />
    </div>
  );
}