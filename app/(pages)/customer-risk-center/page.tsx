"use client";
import React, { useState, useEffect } from "react";
import SubMenu from "@/components/SubMenu";
import DataTable, { LoanRow } from "@/components/DataTable";
import Dropdown from "@/components/Dropdown";
import { IoFilterSharp, IoSearch } from "react-icons/io5";
import { AiOutlineDown, AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDown } from "react-icons/io";
import Image from "next/image";
import {
  deliquent,
  activeb,
  blocked,
  money,
  profit,
  outstanding,
  cube2,
  trending,
  behav,
  key,
} from "@/constant";
import axiosInstance from "@/app/utils/axios";
import {
  CustomerProfile,
  DelinquentCustomers,
  LegacyRiskCustomers,
  PortfolioWatchlist,
} from "@/app/utils/endpoint";

// ── Types ──────────────────────────────────────────────────────────────
type MainTabKey =
  | "customer-search"
  | "exposure-ledger"
  | "delinquent-customer"
  | "legal-risk-customer"
  | "behavioural-risk-ranking"
  | "hard-blocked"
  | "whitelisted-customer";
type SubTabKey =
  | "loan-history"
  | "recovery-history"
  | "fraud-decisions"
  | "callback-audit";

interface CustomerMetrics {
  totalBorrowed: string;
  totalRecovered: string;
  outstandingBalance: string;
  activeLoans: number;
  lifetimeDefaults: number;
  behaviouralRiskScore: number;
  hardBlockStatus: string;
  eligibilityStatus: string;
}

// ── Mock data ──────────────────────────────────────────────────────────
const mockCustomerMetrics: CustomerMetrics = {
  totalBorrowed: "₦500",
  totalRecovered: "₦432",
  outstandingBalance: "₦68",
  activeLoans: 3,
  lifetimeDefaults: 2,
  behaviouralRiskScore: 23,
  hardBlockStatus: "Active",
  eligibilityStatus: "Restricted",
};

const mockLoanHistory: LoanRow[] = [
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
];

const mainTabs: { key: MainTabKey; label: string }[] = [
  { key: "customer-search", label: "Customer Search" },
  { key: "exposure-ledger", label: "Exposure Ledger" },
  { key: "delinquent-customer", label: "Delinquent Customer" },
  { key: "legal-risk-customer", label: "Legal Risk Customer" },
  { key: "behavioural-risk-ranking", label: "Behavioural Risk Ranking" },
  { key: "hard-blocked", label: "Hard Blocked" },
  { key: "whitelisted-customer", label: "Whitelisted Customer" },
];

const subTabs: { key: SubTabKey; label: string }[] = [
  { key: "loan-history", label: "Loan History" },
  { key: "recovery-history", label: "Recovery History" },
  { key: "fraud-decisions", label: "Fraud Decisions" },
  { key: "callback-audit", label: "Callback Audit" },
];

// ── Components ──────────────────────────────────────────────────────────
const MetricCard = ({
  title,
  value,
  status,
  icon,
}: {
  title: string;
  value: string | number;
  status?: string;
  icon?: any;
}) => (
  <div className="bg-white rounded-sm p-3 border border-gray-200">
    <div className="flex items-start justify-between mb-3">
      <div className="text-[13px] text-gray-600 font-ibm-plex-sans">
        {title}
      </div>
      {icon && (
        <Image
          src={icon}
          alt={title}
          width={20}
          height={20}
          className="text-gray-400"
        />
      )}
    </div>
    <div className="text-[26px] font-bold text-gray-700 font-sf-pro mb-3">
      {value === "Restricted" || value === "Active" ? "" : value}
    </div>
    {status && (
      <div
        className={`inline-block px-3 py-1 rounded-sm text-[12px] font-medium font-ibm-plex-sans ${
          status === "Active"
            ? "bg-green-100 text-green-800"
            : status === "Restricted"
              ? "bg-orange-100 text-orange-800"
              : "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </div>
    )}
  </div>
);

const TabButton = ({
  tab,
  isActive,
  onClick,
}: {
  tab: { key: MainTabKey; label: string };
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-[14px] cursor-pointer font-ibm-plex-sans whitespace-nowrap transition-colors border-b-2 ${
      isActive
        ? "bg-[#243B6B] text-white font-semibold rounded-md"
        : "border-transparent text-[#6B7280] hover:text-[#374151]"
    }`}
  >
    {tab.label}
  </button>
);

const SubTabButton = ({
  tab,
  isActive,
  onClick,
}: {
  tab: { key: SubTabKey; label: string };
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={` py-2 text-[14px] cursor-pointer font-ibm-plex-sans transition-colors border-b ${
      isActive
        ? "border-b border-[#5490DE] text-[#5490DE] font-medium"
        : "border-transparent text-[#6B7280] hover:text-[#374151]"
    }`}
  >
    {tab.label}
  </button>
);

export default function Page() {
  const [activeMainTab, setActiveMainTab] =
    useState<MainTabKey>("customer-search");
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>("loan-history");
  const [search, setSearch] = useState("");
  const [customerMetrics, setCustomerMetrics] =
    useState<CustomerMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      // For now, use mock data
      setCustomerMetrics(mockCustomerMetrics);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <SubMenu
          title="Customer Search"
          subtitle="Search and analyze customers and view their risk profiles."
        />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-sm p-4 border border-gray-200 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SubMenu
        title="Customer Search"
        subtitle="Search and analyze customers and view their risk profiles."
      />

      {/* Main Tabs */}
      <div className="flex border border-[#DCE9F9] bg-[#EEF4FC] rounded-sm mb-6 mt-6 pl-1 py-1 gap-1 overflow-x-auto">
        {mainTabs.map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab}
            isActive={activeMainTab === tab.key}
            onClick={() => setActiveMainTab(tab.key)}
          />
        ))}
      </div>

      <div className="bg-white p-4 rounded-sm border border-gray-200">
        <div className=" flex justify-end pb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2 border border-[#E5E7EB] w-94 bg-[#FAFAFA] rounded-sm px-3 h-10">
                <IoSearch size={19} className="text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search MSISDN (e.g 07015322207)"
                  className="flex-1 placeholder:text-[16px] text-[#374151] font-ibm-plex-sans outline-none placeholder:font-ibm-plex-sans placeholder:text-gray-500 bg-transparent"
                />
              </div>
            </div>
            <button className="flex items-center bg-[#243B6B] cursor-pointer gap-1 border border-gray-200 rounded-sm px-4 h-10 text-[14px] text-white font-medium hover:bg-[#1E40AF] transition-colors">
              <AiOutlineSearch size={19} className="text-white" />
              Search Customer
            </button>
          </div>
        </div>

        {/* Customer Metrics Cards */}
        {customerMetrics && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Total Borrowed"
              value={customerMetrics.totalBorrowed}
              icon={money}
            />
            <MetricCard
              title="Total Recovered"
              value={customerMetrics.totalRecovered}
              icon={profit}
            />
            <MetricCard
              title="Outstanding Balance"
              value={customerMetrics.outstandingBalance}
              icon={outstanding}
            />
            <MetricCard
              title="Active Loans"
              value={customerMetrics.activeLoans}
              icon={activeb}
            />
            <MetricCard
              title="Lifetime Defaults"
              value={customerMetrics.lifetimeDefaults}
              icon={deliquent}
            />
            <MetricCard
              title="Behavioral Risk Score"
              value={customerMetrics.behaviouralRiskScore}
              icon={behav}
            />
            <MetricCard
              title="Hard Block Status"
              value={customerMetrics.hardBlockStatus}
              status={customerMetrics.hardBlockStatus}
              icon={blocked}
            />
            <MetricCard
              title="Eligibility Status"
              value={customerMetrics.eligibilityStatus}
              status={customerMetrics.eligibilityStatus}
              icon={key}
            />
          </div>
        )}
        <div className="flex items-center gap-4 border-b border-[#F3F4F6]">
          {subTabs.map((tab) => (
            <SubTabButton
              key={tab.key}
              tab={tab}
              isActive={activeSubTab === tab.key}
              onClick={() => setActiveSubTab(tab.key)}
            />
          ))}
        </div>
        <div className=" overflow-hidden">
          {/* Data Table */}
          <div className="py-4">
            <DataTable
              searchable={false}
              data={mockLoanHistory}
              onActionClick={(row) => console.log("View loan:", row.loanId)}
              className="border-t-0"
            />
          </div>
        </div>
      </div>

      {/* Search Section */}

      {/* Sub Tabs */}
    </div>
  );
}
