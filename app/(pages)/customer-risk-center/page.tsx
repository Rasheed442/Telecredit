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
  totalBorrowed: "₦0",
  totalRecovered: "₦0",
  outstandingBalance: "₦0",
  activeLoans: 0,
  lifetimeDefaults: 0,
  behaviouralRiskScore: 0,
  hardBlockStatus: "Inactive",
  eligibilityStatus: "Pending",
};

const mockLoanHistory: LoanRow[] = [];
const mockRecoveryHistory: any[] = [];
const mockFraudDecisions: any[] = [];
const mockCallbackAudit: any[] = [];

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
  <div className="bg-white rounded-sm p-5 border border-gray-200 shadow-sm">
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
    <div className="text-[24px] font-semibold text-gray-900 font-sf-pro mb-3">
      {value}
    </div>
    {status && (
      <div
        className={`inline-block px-3 py-1 rounded-full text-[12px] font-medium font-ibm-plex-sans ${
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

const LoanHistoryTab = () => (
  <div className="p-5">
    {mockLoanHistory.length > 0 ? (
      <DataTable
        searchable={false}
        data={mockLoanHistory}
        onActionClick={(row) => console.log("View loan:", row.loanId)}
        className="border-t-0"
      />
    ) : (
      <div className="text-center py-12">
        <div className="flex justify-center mb-3">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.707.293h-3.172a1 1 0 00-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <div className="text-gray-500 text-sm font-ibm-plex-sans">
          No loan history found
        </div>
      </div>
    )}
  </div>
);

const RecoveryHistoryTab = () => (
  <div className="p-5">
    {mockRecoveryHistory.length > 0 ? (
      <div className="text-center py-12">
        <div className="text-gray-500 text-sm font-ibm-plex-sans">
          Recovery history data available
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="flex justify-center mb-3">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div className="text-gray-500 text-sm font-ibm-plex-sans">
          No recovery history found
        </div>
      </div>
    )}
  </div>
);

const FraudDecisionsTab = () => (
  <div className="p-5">
    {mockFraudDecisions.length > 0 ? (
      <div className="text-center py-12">
        <div className="text-gray-500 text-sm font-ibm-plex-sans">
          Fraud decisions data available
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="flex justify-center mb-3">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="text-gray-500 text-sm font-ibm-plex-sans">
          No fraud decisions found
        </div>
      </div>
    )}
  </div>
);

const CallbackAuditTab = () => (
  <div className="p-5">
    {mockCallbackAudit.length > 0 ? (
      <div className="text-center py-12">
        <div className="text-gray-500 text-sm font-ibm-plex-sans">
          Callback audit data available
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="flex justify-center mb-3">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0l7.89-5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="text-gray-500 text-sm font-ibm-plex-sans">
          No callback audit data found
        </div>
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
          {/* Sub Tab Content */}
          <div className="py-4">
            {activeSubTab === "loan-history" && <LoanHistoryTab />}
            {activeSubTab === "recovery-history" && <RecoveryHistoryTab />}
            {activeSubTab === "fraud-decisions" && <FraudDecisionsTab />}
            {activeSubTab === "callback-audit" && <CallbackAuditTab />}
          </div>
        </div>
      </div>

      {/* Search Section */}

      {/* Sub Tabs */}
    </div>
  );
}
