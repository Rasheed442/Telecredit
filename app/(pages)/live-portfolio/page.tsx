// page.tsx
"use client";
import React, { useState } from "react";
import SubMenu from "@/components/SubMenu";
import DataTable, { LoanRow } from "@/components/DataTable";
import Dropdown from "@/components/Dropdown";
import DPDAnalysisChart from "@/components/LivePortfolio/DPDAnalysisChart";
import { IoFilterSharp, IoSearch } from "react-icons/io5";
import LoanDetailView from "@/components/LivePortfolio/LoanDetailView";

// ── Types ──────────────────────────────────────────────────────────────
type TabKey = "open" | "delinquent" | "closed" | "watchlist" | "aging";

// ── Mock data ──────────────────────────────────────────────────────────
const rows: LoanRow[] = [
  {
    loanId: "ATL_CORE_010",
    msisdn: "07086022674",
    telco: "AIRTEL",
    amount: "₦500",
    outstanding: "₦68",
    recovered: "₦432",
    aging: "DP 31",
    fraudRisk: "High",
    score: 86,
    created: "18/03/2026",
  },
  {
    loanId: "MTN_CORE_045",
    msisdn: "08123456789",
    telco: "MTN",
    amount: "₦1,000",
    outstanding: "₦418",
    recovered: "₦582",
    aging: "DP 17",
    fraudRisk: "Medium",
    score: 81,
    created: "18/03/2026",
  },
  {
    loanId: "GLO_CORE_089",
    msisdn: "09087654321",
    telco: "GLO",
    amount: "₦1,000",
    outstanding: "₦212",
    recovered: "₦788",
    aging: "DP 0",
    fraudRisk: "Low",
    score: 41,
    created: "18/03/2026",
  },
  {
    loanId: "GLO_CORE_089",
    msisdn: "07012345678",
    telco: "9 MOBILE",
    amount: "₦1,000",
    outstanding: "₦330",
    recovered: "₦670",
    aging: "DP 31",
    fraudRisk: "High",
    score: 20,
    created: "18/03/2026",
  },
  {
    loanId: "9MOB_CORE_034",
    msisdn: "08098765432",
    telco: "AIRTEL",
    amount: "₦200",
    outstanding: "₦186",
    recovered: "₦14",
    aging: "DP 17",
    fraudRisk: "Medium",
    score: 11,
    created: "18/03/2026",
  },
  {
    loanId: "ATL_CORE_010",
    msisdn: "07086022674",
    telco: "MTN",
    amount: "₦500",
    outstanding: "₦17",
    recovered: "₦483",
    aging: "DP 0",
    fraudRisk: "Low",
    score: 13,
    created: "18/03/2026",
  },
  {
    loanId: "MTN_CORE_045",
    msisdn: "08123456789",
    telco: "GLO",
    amount: "₦100",
    outstanding: "₦88",
    recovered: "₦12",
    aging: "DP 31",
    fraudRisk: "High",
    score: 20,
    created: "18/03/2026",
  },
  {
    loanId: "GLO_CORE_089",
    msisdn: "09087654321",
    telco: "9 MOBILE",
    amount: "₦50",
    outstanding: "₦28",
    recovered: "₦22",
    aging: "DP 17",
    fraudRisk: "Medium",
    score: 49,
    created: "18/03/2026",
  },
  {
    loanId: "9MOB_CORE_034",
    msisdn: "07012345678",
    telco: "AIRTEL",
    amount: "₦1,000",
    outstanding: "₦444",
    recovered: "₦556",
    aging: "DP 0",
    fraudRisk: "Low",
    score: 80,
    created: "18/03/2026",
  },
  {
    loanId: "ATL_CORE_010",
    msisdn: "08098765432",
    telco: "MTN",
    amount: "₦50",
    outstanding: "₦40",
    recovered: "₦10",
    aging: "DP 31",
    fraudRisk: "High",
    score: 89,
    created: "18/03/2026",
  },
];

const tabs: { key: TabKey; label: string; count?: number }[] = [
  { key: "open", label: "Open Loans", count: 542 },
  { key: "delinquent", label: "Delinquent Loans", count: 89 },
  { key: "closed", label: "Closed Loans", count: 616 },
  { key: "watchlist", label: "Portfolio Watchlist", count: 2 },
  { key: "aging", label: "Aging Buckets Analysis" },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("open");
  const [search, setSearch] = useState("");
  const [telco, setTelco] = useState("All Telcos");
  const [status, setStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const [selectedLoan, setSelectedLoan] = useState<LoanRow | null>(null);

  const telcoOptions = [
    { value: "All Telcos", label: "All Telcos" },
    { value: "MTN", label: "MTN" },
    { value: "AIRTEL", label: "AIRTEL" },
    { value: "GLO", label: "GLO" },
    { value: "9 MOBILE", label: "9 MOBILE" },
  ];

  const statusOptions = [
    { value: "All Statuses", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Delinquent", label: "Delinquent" },
    { value: "Closed", label: "Closed" },
  ];

  const filtered = rows.filter(
    (r) =>
      r.msisdn.includes(search) ||
      r.loanId.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Loan detail view ──
  if (selectedLoan) {
    return (
      <LoanDetailView
        loan={selectedLoan}
        onBack={() => setSelectedLoan(null)}
      />
    );
  }

  return (
    <div className="p-6">
      <SubMenu
        title="Live Portfolio Monitoring"
        subtitle="Track and manage all active, delinquent, and closed loans."
      />

      <div className="flex border border-[#DCE9F9] bg-[#EEF4FC] rounded-sm mb-2 mt-6 pl-1 py-1 gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-[14px] cursor-pointer font-ibm-plex-sans whitespace-nowrap transition-colors border-b-2 -mb-[1px]
              ${
                activeTab === t.key
                  ? "bg-[#243B6B] text-white font-semibold rounded-md"
                  : "border-transparent text-[#6B7280] hover:text-[#374151]"
              }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={`text-[12px] font-semibold px-2 py-0.5 rounded-md
                  ${
                    activeTab === t.key
                      ? "bg-white text-gray-700 font-bold"
                      : "bg-gray-50 text-gray-700"
                  }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
        {/* ── Filters ── */}
        {activeTab !== "aging" && (
          <div className="flex items-center justify-end gap-3 px-5 flex-wrap">
            <div className="py-4 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2 border border-[#E5E7EB] bg-[#FAFAFA] rounded-sm px-3 h-10 flex-1 w-92.5">
                <IoSearch size={19} className="text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search MSISDN"
                  className="flex-1 placeholder:text-[16px] text-[#374151] font-ibm-plex-sans outline-none placeholder:font-ibm-plex-sans placeholder:text-gray-500 bg-transparent"
                />
              </div>
            </div>
            <Dropdown
              options={telcoOptions}
              value={telco}
              onChange={setTelco}
              className="w-32"
            />
            <Dropdown
              options={statusOptions}
              value={status}
              onChange={setStatus}
              className="w-32"
            />
            <button className="flex items-center cursor-pointer gap-2 border bg-[#243B6B] border-gray-200 rounded-sm px-4 h-10 text-[14px] text-white font-medium hover:bg-[#F9FAFB] transition-colors">
              <IoFilterSharp size={18} className="text-white" />
              Apply filter
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {activeTab === "aging" ? (
          <DPDAnalysisChart />
        ) : (
          <DataTable
            searchable={false}
            data={filtered}
            onActionClick={(row) => setSelectedLoan(row)}
            className="border-t-0"
          />
        )}
      </div>
    </div>
  );
}
