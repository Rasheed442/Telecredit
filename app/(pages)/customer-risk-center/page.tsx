"use client";
import React, { useState, useEffect } from "react";
import SubMenu from "@/components/SubMenu";
import { IoSearch } from "react-icons/io5";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDown } from "react-icons/io";
import Image from "next/image";
import axiosInstance from "@/app/utils/axios";
import { CustomerProfile } from "@/app/utils/endpoint";
import {
  deliquent,
  activeb,
  blocked,
  money,
  profit,
  outstanding,
  behav,
  key,
  trending,
  moneyin,
} from "@/constant";

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

// ── Commented Out Dummy Data ──────────────────────────────────────────
/*
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

const mockLoanHistory = [
  {
    loanId: "ATL_CORE_010",
    amount: "₦500",
    outstanding: "₦100",
    date: "18/03/2026",
    aging: "DP 31",
    agingColor: "red",
  },
  {
    loanId: "ATL_CORE_005",
    amount: "₦1,000",
    outstanding: "₦300",
    date: "18/03/2026",
    aging: "DP 0",
    agingColor: "green",
  },
  {
    loanId: "ATL_CORE_015",
    amount: "₦200",
    outstanding: "₦10",
    date: "18/03/2026",
    aging: "DP 17",
    agingColor: "orange",
  },
  {
    loanId: "ATL_CORE_012",
    amount: "₦500",
    outstanding: "₦200",
    date: "18/03/2026",
    aging: "DP 31",
    agingColor: "red",
  },
  {
    loanId: "ATL_CORE_008",
    amount: "₦50",
    outstanding: "₦5",
    date: "18/03/2026",
    aging: "DP 0",
    agingColor: "green",
  },
];
*/

const mockRecoveryHistory = [
  {
    recoverId: "REC__0001",
    loanId: "ATL_CORE_010",
    amountRecovered: "₦500",
    date: "18/03/2026",
  },
  {
    recoverId: "REC__0002",
    loanId: "ATL_CORE_005",
    amountRecovered: "₦1,000",
    date: "18/03/2026",
  },
  {
    recoverId: "REC__0003",
    loanId: "ATL_CORE_015",
    amountRecovered: "₦200",
    date: "18/03/2026",
  },
  {
    recoverId: "REC__0004",
    loanId: "ATL_CORE_012",
    amountRecovered: "₦500",
    date: "18/03/2026",
  },
  {
    recoverId: "REC__0005",
    loanId: "ATL_CORE_008",
    amountRecovered: "₦50",
    date: "18/03/2026",
  },
];

const mockFraudDecisions = [
  {
    decisionId: "FD_001",
    loanId: "ATL_CORE_021",
    riskScore: 85,
    decision: "High Risk",
    date: "17/03/2026",
  },
  {
    decisionId: "FD_002",
    loanId: "ATL_CORE_018",
    riskScore: 25,
    decision: "Low Risk",
    date: "16/03/2026",
  },
  {
    decisionId: "FD_003",
    loanId: "ATL_CORE_023",
    riskScore: 92,
    decision: "Fraud Detected",
    date: "15/03/2026",
  },
  {
    decisionId: "FD_004",
    loanId: "ATL_CORE_019",
    riskScore: 45,
    decision: "Medium Risk",
    date: "14/03/2026",
  },
  {
    decisionId: "FD_005",
    loanId: "ATL_CORE_025",
    riskScore: 15,
    decision: "Low Risk",
    date: "13/03/2026",
  },
];

const mockCallbackAudit = [
  {
    callbackId: "CB_001",
    customerId: "CUST_001",
    agentName: "John Doe",
    outcome: "Successful",
    date: "18/03/2026",
  },
  {
    callbackId: "CB_002",
    customerId: "CUST_002",
    agentName: "Jane Smith",
    outcome: "No Answer",
    date: "18/03/2026",
  },
  {
    callbackId: "CB_003",
    customerId: "CUST_003",
    agentName: "Mike Johnson",
    outcome: "Successful",
    date: "17/03/2026",
  },
  {
    callbackId: "CB_004",
    customerId: "CUST_004",
    agentName: "Sarah Williams",
    outcome: "Callback Scheduled",
    date: "17/03/2026",
  },
  {
    callbackId: "CB_005",
    customerId: "CUST_005",
    agentName: "Tom Brown",
    outcome: "Successful",
    date: "16/03/2026",
  },
];

const mockExposureLedger = [
  {
    msisdn: "07086022674",
    telco: "AIRTEL",
    activeLoans: 1,
    disbursed: "₦500",
    recovered: "₦432",
    outstanding: "₦68",
  },
  {
    msisdn: "08123456789",
    telco: "MTN",
    activeLoans: 10,
    disbursed: "₦1,000",
    recovered: "₦582",
    outstanding: "₦418",
  },
  {
    msisdn: "09087654321",
    telco: "GLO",
    activeLoans: 4,
    disbursed: "₦1,000",
    recovered: "₦788",
    outstanding: "₦212",
  },
  {
    msisdn: "07012345678",
    telco: "9 MOBILE",
    activeLoans: 12,
    disbursed: "₦1,000",
    recovered: "₦670",
    outstanding: "₦330",
  },
  {
    msisdn: "08098765432",
    telco: "AIRTEL",
    activeLoans: 23,
    disbursed: "₦200",
    recovered: "₦14",
    outstanding: "₦186",
  },
  {
    msisdn: "07086022674",
    telco: "MTN",
    activeLoans: 3,
    disbursed: "₦500",
    recovered: "₦483",
    outstanding: "₦17",
  },
  {
    msisdn: "08123456789",
    telco: "GLO",
    activeLoans: 4,
    disbursed: "₦100",
    recovered: "₦12",
    outstanding: "₦88",
  },
];

const mockDelinquentCustomers = [
  {
    msisdn: "07086022674",
    activeLoans: 1,
    outstanding: "₦68",
    fraudRisk: "High",
  },
  {
    msisdn: "08123456789",
    activeLoans: 10,
    outstanding: "₦418",
    fraudRisk: "Medium",
  },
  {
    msisdn: "09087654321",
    activeLoans: 4,
    outstanding: "₦212",
    fraudRisk: "Low",
  },
  {
    msisdn: "07012345678",
    activeLoans: 12,
    outstanding: "₦330",
    fraudRisk: "High",
  },
  {
    msisdn: "08098765432",
    activeLoans: 23,
    outstanding: "₦186",
    fraudRisk: "Medium",
  },
  {
    msisdn: "07086022674",
    activeLoans: 3,
    outstanding: "₦17",
    fraudRisk: "Low",
  },
  {
    msisdn: "08123456789",
    activeLoans: 4,
    outstanding: "₦88",
    fraudRisk: "High",
  },
];

const mockLegacyRiskCustomers = [
  {
    msisdn: "07086022674",
    legacyDefaults: 1,
    lastSeen: "05/05/2026, 14:30:00",
    source: "Legacy Import",
  },
  {
    msisdn: "08123456789",
    legacyDefaults: 10,
    lastSeen: "05/05/2026, 14:30:00",
    source: "Legacy Import",
  },
  {
    msisdn: "09087654321",
    legacyDefaults: 4,
    lastSeen: "05/05/2026, 14:30:00",
    source: "Legacy Import",
  },
  {
    msisdn: "07012345678",
    legacyDefaults: 12,
    lastSeen: "05/05/2026, 14:30:00",
    source: "Legacy Import",
  },
  {
    msisdn: "08098765432",
    legacyDefaults: 23,
    lastSeen: "05/05/2026, 14:30:00",
    source: "Legacy Import",
  },
  {
    msisdn: "07086022674",
    legacyDefaults: 3,
    lastSeen: "05/05/2026, 14:30:00",
    source: "Legacy Import",
  },
  {
    msisdn: "08123456789",
    legacyDefaults: 4,
    lastSeen: "05/05/2026, 14:30:00",
    source: "Legacy Import",
  },
];

const mockBehaviouralRisk = [
  {
    msisdn: "07086022674",
    telco: "AIRTEL",
    loan: 1,
    defaults: 1,
    averageRisk: 98,
    fraudRisk: "Critical",
  },
  {
    msisdn: "08123456789",
    telco: "MTN",
    loan: 10,
    defaults: 10,
    averageRisk: 96,
    fraudRisk: "Critical",
  },
  {
    msisdn: "09087654321",
    telco: "GLO",
    loan: 4,
    defaults: 4,
    averageRisk: 87,
    fraudRisk: "Critical",
  },
  {
    msisdn: "07012345678",
    telco: "9 MOBILE",
    loan: 12,
    defaults: 12,
    averageRisk: 60,
    fraudRisk: "Critical",
  },
  {
    msisdn: "08098765432",
    telco: "AIRTEL",
    loan: 23,
    defaults: 23,
    averageRisk: 90,
    fraudRisk: "Critical",
  },
  {
    msisdn: "07086022675",
    telco: "MTN",
    loan: 3,
    defaults: 3,
    averageRisk: 88,
    fraudRisk: "Critical",
  },
  {
    msisdn: "08123456790",
    telco: "GLO",
    loan: 4,
    defaults: 4,
    averageRisk: 80,
    fraudRisk: "Critical",
  },
];

const mockHardBlocked = [
  {
    msisdn: "07086022674",
    reason: "Unauthorized signature",
    rule: "SYSTEM",
    lastSeen: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08123456789",
    reason: "Unauthorized signature",
    rule: "ADMIN",
    lastSeen: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "09087654321",
    reason: "Duplicate identity",
    rule: "SYSTEM",
    lastSeen: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "07012345678",
    reason: "Charge-back",
    rule: "ADMIN",
    lastSeen: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08098765432",
    reason: "Fraud callback mismatch",
    rule: "SYSTEM",
    lastSeen: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "07086022674",
    reason: "Velocity breach",
    rule: "ADMIN",
    lastSeen: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08123456789",
    reason: "Duplicate identity",
    rule: "SYSTEM",
    lastSeen: "05/05/2026, 14:30:00",
  },
];

const mockWhitelisted = [
  {
    msisdn: "07086022674",
    reason: "Unauthorized signature",
    source: "SYSTEM",
    createdDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08123456789",
    reason: "Unauthorized signature",
    source: "ADMIN",
    createdDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "09087654321",
    reason: "Duplicate identity",
    source: "SYSTEM",
    createdDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "07012345678",
    reason: "Charge-back",
    source: "ADMIN",
    createdDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08098765432",
    reason: "Fraud callback mismatch",
    source: "SYSTEM",
    createdDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "07086022674",
    reason: "Velocity breach",
    source: "ADMIN",
    createdDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08123456789",
    reason: "Duplicate identity",
    source: "SYSTEM",
    createdDate: "05/05/2026, 14:30:00",
  },
];

// ── Tab Configs ────────────────────────────────────────────────────────
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

// ── Shared UI ──────────────────────────────────────────────────────────
const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[13px] font-normal text-[#667085] whitespace-nowrap">
    {children}
  </th>
);

const Td = ({
  children,
  bold,
}: {
  children: React.ReactNode;
  bold?: boolean;
}) => (
  <td
    className={`px-4 py-4 text-[13px] ${bold ? "text-[#1F2937] font-medium" : "text-[#667085]"}`}
  >
    {children}
  </td>
);

const TableWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">{children}</table>
  </div>
);

const agingBadge = (aging: string, color: string) => {
  const styles: Record<string, string> = {
    red: "bg-red-100 text-red-700 border border-red-200",
    green: "bg-green-100 text-green-700  border border-green-200",
    orange: "bg-orange-100 text-orange-700 border border-orange-200",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5  text-xs font-semibold ${styles[color] ?? "bg-gray-100 text-gray-700"}`}
    >
      {aging}
    </span>
  );
};

const fraudRiskBadge = (risk: string) => {
  const styles: Record<string, string> = {
    High: "bg-red-100 text-red-700  border border-red-200",
    Medium: "bg-orange-100 text-orange-700 border border-orange-200",
    Low: "bg-green-100 text-green-700 border border-green-200",
    Critical: "bg-red-100 text-red-700 border border-red-200",
  };
  return (
    <span
      className={`inline-flex px-3 py-0.5 rounded text-xs font-semibold ${styles[risk] ?? "bg-gray-100 text-gray-700"}`}
    >
      {risk}
    </span>
  );
};

// ── Metric Cards ───────────────────────────────────────────────────────
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
  <div className="bg-white rounded-sm py-4 px-4 border border-gray-200">
    <div className="flex items-center gap-2 mb-4">
      {icon && <Image src={icon} alt={title} width={18} height={18} />}
      <span className="text-[13px] text-[#667085] font-ibm-plex-sans">
        {title}
      </span>
    </div>
    {status ? (
      <span
        className={`inline-flex px-3 py-1  rounded text-[13px] font-normal font-ibm-plex-sans ${
          status === "Active"
            ? "bg-green-100 text-green-800 border border-green-200 pt-1"
            : status === "Restricted"
              ? "bg-orange-100 text-[#D76603] border border-orange-200 pt-1"
              : "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    ) : (
      <div className="text-[28px] font-bold text-[#1F2937] font-sf-pro">
        {value}
      </div>
    )}
  </div>
);

// ── Sub-tab content ────────────────────────────────────────────────────
const LoanHistoryTab = ({ data }: { data: any[] }) => (
  <TableWrapper>
    <thead>
      <tr className="border-y border-[#F3F4F6] bg-gray-50">
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Loan ID
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Amount
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Outstanding
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Date
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Aging
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? (
        <tr>
          <td colSpan={5} className="px-5 py-8 text-center text-gray-500 font-ibm-plex-sans">
            No loan history found for this customer.
          </td>
        </tr>
      ) : (
        data.map((row, i) => (
          <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
            <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
              {row.loanId}
            </td>
            <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
              {row.amount}
            </td>
            <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
              {row.outstanding}
            </td>
            <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
              {row.date}
            </td>
            <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
              {agingBadge(row.aging, row.agingColor)}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </TableWrapper>
);

const RecoveryHistoryTab = () => (
  <TableWrapper>
    <thead>
      <tr className="border-y border-[#F3F4F6] bg-gray-50">
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Recover ID
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Loan ID
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Amount Recovered
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Date
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      {mockRecoveryHistory.map((row, i) => (
        <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.recoverId}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.loanId}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.amountRecovered}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.date}
          </td>
        </tr>
      ))}
    </tbody>
  </TableWrapper>
);

const FraudDecisionsTab = () => (
  <TableWrapper>
    <thead>
      <tr className="border-y border-[#F3F4F6] bg-gray-50">
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Decision ID
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Loan ID
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Risk Score
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Decision
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Date
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      {mockFraudDecisions.map((row, i) => (
        <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.decisionId}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.loanId}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.riskScore}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {fraudRiskBadge(row.decision)}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.date}
          </td>
        </tr>
      ))}
    </tbody>
  </TableWrapper>
);

const CallbackAuditTab = () => (
  <TableWrapper>
    <thead>
      <tr className="border-y border-[#F3F4F6] bg-gray-50">
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Callback ID
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Customer ID
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Agent Name
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Outcome
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
        <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
              Date
              <div className="flex flex-col">
                <IoMdArrowDown className="inline ml-1 opacity-50" />
              </div>
            </button>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      {mockCallbackAudit.map((row, i) => (
        <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.callbackId}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.customerId}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.agentName}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.outcome}
          </td>
          <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
            {row.date}
          </td>
        </tr>
      ))}
    </tbody>
  </TableWrapper>
);

// ── Main Tab Sections ──────────────────────────────────────────────────
const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="mb-6">
    <h2 className="font-sf-pro text-[18px] font-semibold text-[#1F2937]">
      {title}
    </h2>
    <p className="text-[13px] text-[#667085] font-ibm-plex-sans mt-0.5">
      {subtitle}
    </p>
  </div>
);

const SkeletonMetricCard = () => (
  <div className="bg-white rounded-sm py-4 px-4 border border-gray-200 animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-[18px] h-[18px] bg-gray-200 rounded-full animate-pulse" />
      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="h-8 w-32 bg-gray-200 rounded mt-2 animate-pulse" />
  </div>
);

const CustomerSearchSection = ({
  search,
  setSearch,
  activeSubTab,
  setActiveSubTab,
  customerMetrics,
  loadingProfile,
  errorProfile,
  onSearch,
  loanHistory,
}: {
  search: string;
  setSearch: (v: string) => void;
  activeSubTab: SubTabKey;
  setActiveSubTab: (v: SubTabKey) => void;
  customerMetrics: CustomerMetrics | null;
  loadingProfile: boolean;
  errorProfile: string | null;
  onSearch: () => void;
  loanHistory: any[];
}) => (
  <div>
    {/* Search bar */}
    <div className="flex justify-between lg:justify-end gap-3 mb-6 px-4 pt-6">
      <div className="flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-sm px-3 h-10  lg:w-80">
        <IoSearch size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          placeholder="Search MSISDN (e.g 07015322207)"
          className="flex-1 text-[13px] text-[#374151] font-ibm-plex-sans outline-none placeholder:text-gray-400 bg-transparent"
        />
      </div>
      <button 
        onClick={onSearch}
        disabled={loadingProfile}
        className="flex items-center lg:gap-2 bg-[#243B6B] px-3 lg:px-4 h-10 rounded-sm w-auto lg:w-auto text-[10px] lg:text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors disabled:opacity-50"
      >
        {loadingProfile ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-1"></div>
        ) : (
          <span className="hidden lg:block">
            <AiOutlineSearch size={16} />
          </span>
        )}
        {loadingProfile ? "Searching..." : "Search Customer"}
      </button>
    </div>

    {/* Error Profile Banner */}
    {errorProfile && (
      <div className="mx-4 mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[14px] rounded-sm font-ibm-plex-sans flex items-center gap-2 animate-[fadeIn_0.3s_ease]">
        <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{errorProfile}</span>
      </div>
    )}

    {/* Metric cards & sub tabs */}
    {loadingProfile ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>
    ) : !customerMetrics ? (
      <div className="mx-4 mb-6 py-16 px-4 border border-dashed border-gray-300 rounded-sm bg-gray-50 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#EEF4FC] text-[#243B6B] rounded-full flex items-center justify-center mb-4 border border-[#DCE9F9] shadow-sm">
          <AiOutlineSearch size={32} />
        </div>
        <h3 className="text-[16px] font-semibold text-gray-700 font-ibm-plex-sans">Search Customer Profile</h3>
        <p className="text-[13px] text-gray-500 max-w-sm mt-2 font-ibm-plex-sans leading-relaxed">
          Enter a customer's MSISDN in the search bar above to fetch and analyze their lending metrics, risk profile, and loan history.
        </p>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4">
          <MetricCard
            title="Total Borrowed"
            value={customerMetrics.totalBorrowed}
            icon={money}
          />
          <MetricCard
            title="Total Recovered"
            value={customerMetrics.totalRecovered}
            icon={trending}
          />
          <MetricCard
            title="Outstanding Balance"
            value={customerMetrics.outstandingBalance}
            icon={outstanding}
          />
          <MetricCard
            title="Active Loans"
            value={customerMetrics.activeLoans}
            icon={moneyin}
          />
          <MetricCard
            title="Lifetime Defaults"
            value={customerMetrics.lifetimeDefaults}
            icon={deliquent}
          />
          <MetricCard
            title="Behavioral Risk Score"
            value={customerMetrics.behaviouralRiskScore}
            icon={blocked}
          />
          <MetricCard
            title="Hard Block Status"
            value={customerMetrics.hardBlockStatus}
            status={customerMetrics.hardBlockStatus}
            icon={profit}
          />
          <MetricCard
            title="Eligibility Status"
            value={customerMetrics.eligibilityStatus}
            status={customerMetrics.eligibilityStatus}
            icon={behav}
          />
        </div>

        {/* Sub tabs */}
        <div className="flex gap-6 border-b border-[#F3F4F6] mb-4 px-6 pt-6">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`pb-2 text-[14px] font-ibm-plex-sans transition-colors border-b-2 -mb-px ${
                activeSubTab === tab.key
                  ? "border-[#5490DE] text-[#5490DE] font-medium"
                  : "border-transparent text-[#6B7280] hover:text-[#374151]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sub tab content */}
        {activeSubTab === "loan-history" && <LoanHistoryTab data={loanHistory} />}
        {activeSubTab === "recovery-history" && <RecoveryHistoryTab />}
        {activeSubTab === "fraud-decisions" && <FraudDecisionsTab />}
        {activeSubTab === "callback-audit" && <CallbackAuditTab />}
      </>
    )}
  </div>
);

const EmptyTableState = ({ colSpan, message }: { colSpan: number; message: string }) => (
  <tr>
    <td colSpan={colSpan} className="px-5 py-12 text-center text-gray-500 font-ibm-plex-sans bg-white border-b border-[#F9FAFB]">
      <div className="flex flex-col items-center justify-center gap-3 py-6">
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm text-gray-400">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293h-2.122a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 007.586 13H4" />
          </svg>
        </div>
        <div className="text-[15px] font-semibold text-gray-700 mt-1">{message}</div>
        <div className="text-[12px] text-gray-400 max-w-xs mx-auto">
          No matching records were found. Try adjusting your search keywords or check back later.
        </div>
      </div>
    </td>
  </tr>
);

const ExposureLedgerSection = ({
  search,
  setSearch,
  filteredData,
}: {
  search: string;
  setSearch: (v: string) => void;
  filteredData: any[];
}) => (
  <div>
    <div className="flex flex-col lg:flex-row items-center justify-between mb-6 px-4 pt-6">
      <div className="flex-1">
        <SectionHeader
          title="Exposure Ledger"
          subtitle="Per-customer outstanding exposure across portfolio"
        />
      </div>
      {/* Search bar */}
      <div className="flex  gap-3">
        <div className="flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-sm px-3 h-10 w-full lg:w-80">
          <IoSearch size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MSISDN (e.g 07015322207)"
            className="flex-1 text-[13px] text-[#374151] font-ibm-plex-sans outline-none placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#243B6B] px-4 h-10 rounded-sm text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors">
          <AiOutlineSearch size={16} />
          Search
        </button>
      </div>
    </div>
    <TableWrapper>
      <thead>
        <tr className="border-y border-[#F3F4F6] bg-gray-50">
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                MSISDN
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Telco
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Active Loan
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Disbursed
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Recovered
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Outstanding
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length === 0 ? (
          <EmptyTableState colSpan={6} message="No exposure ledger records found" />
        ) : (
          filteredData.map((row: any, i) => (
            <tr
              key={i}
              className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors"
            >
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.msisdn}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.telco}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.activeLoans}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.disbursed}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.recovered}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.outstanding}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableWrapper>
  </div>
);

const DelinquentCustomerSection = ({
  search,
  setSearch,
  filteredData,
}: {
  search: string;
  setSearch: (v: string) => void;
  filteredData: any[];
}) => (
  <div>
    <div className="flex flex-col lg:flex-row items-center justify-between mb-6 px-4 pt-6">
      <div className="flex-1">
        <SectionHeader
          title="Delinquent Customers"
          subtitle="Borrowers with outstanding balances past due"
        />
      </div>
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-sm px-3 h-10 w-full lg:w-80">
          <IoSearch size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MSISDN (e.g 07015322207)"
            className="flex-1 text-[13px] text-[#374151] font-ibm-plex-sans outline-none placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#243B6B] px-4 h-10 rounded-sm text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors">
          <AiOutlineSearch size={16} />
          Search
        </button>
      </div>
    </div>
    <TableWrapper>
      <thead>
        <tr className="border-y border-[#F3F4F6] bg-gray-50">
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                MSISDN
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Active Loan
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Outstanding
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Fraud Risk
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length === 0 ? (
          <EmptyTableState colSpan={4} message="No delinquent customers found" />
        ) : (
          filteredData.map((row, i) => (
            <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.msisdn}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.activeLoans}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.outstanding}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {fraudRiskBadge(row.fraudRisk)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableWrapper>
  </div>
);

const LegalRiskCustomerSection = ({
  search,
  setSearch,
  filteredData,
}: {
  search: string;
  setSearch: (v: string) => void;
  filteredData: any[];
}) => (
  <div>
    <div className="flex flex-col lg:flex-row items-center justify-between mb-6 px-4 pt-6">
      <div className="flex-1">
        <SectionHeader
          title="Legacy Risk Customers"
          subtitle="Imported risk records from prior systems"
        />
      </div>
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-sm px-3 h-10 w-full lg:w-80">
          <IoSearch size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MSISDN (e.g 07015322207)"
            className="flex-1 text-[13px] text-[#374151] font-ibm-plex-sans outline-none placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#243B6B] px-4 h-10 rounded-sm text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors">
          <AiOutlineSearch size={16} />
          Search
        </button>
      </div>
    </div>
    <TableWrapper>
      <thead>
        <tr className="border-y border-[#F3F4F6] bg-gray-50">
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                MSISDN
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Legacy Defaults
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Last Seen
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Source
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length === 0 ? (
          <EmptyTableState colSpan={4} message="No legacy risk customers found" />
        ) : (
          filteredData.map((row, i) => (
            <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.msisdn}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.legacyDefaults}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.lastSeen}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.source}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableWrapper>
  </div>
);

const BehaviouralRiskSection = ({
  search,
  setSearch,
  filteredData,
}: {
  search: string;
  setSearch: (v: string) => void;
  filteredData: any[];
}) => (
  <div>
    <div className="flex flex-col lg:flex-row items-center justify-between mb-6 px-4 pt-6">
      <div className="flex-1">
        <SectionHeader
          title="Behavioural Risk Ranking"
          subtitle="Customers ranked by aggregate behavioural risk score"
        />
      </div>
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-sm px-3 h-10 w-full lg:w-80">
          <IoSearch size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MSISDN (e.g 07015322207)"
            className="flex-1 text-[13px] text-[#374151] font-ibm-plex-sans outline-none placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#243B6B] px-4 h-10 rounded-sm text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors">
          <AiOutlineSearch size={16} />
          Search
        </button>
      </div>
    </div>
    <TableWrapper>
      <thead>
        <tr className="border-y border-[#F3F4F6] bg-gray-50">
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                MSISDN
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Telco
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Loan
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Defaults
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Average Risk
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Fraud Risk
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length === 0 ? (
          <EmptyTableState colSpan={6} message="No behavioural risk records found" />
        ) : (
          filteredData.map((row: any, i) => (
            <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.msisdn}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.telco}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.loan}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.defaults}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.averageRisk}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {fraudRiskBadge(row.fraudRisk)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableWrapper>
  </div>
);

const HardBlockedSection = ({
  search,
  setSearch,
  filteredData,
}: {
  search: string;
  setSearch: (v: string) => void;
  filteredData: any[];
}) => (
  <div>
    <div className="flex lg:flex-row flex-col items-center justify-between mb-6 px-4 pt-6">
      <div className="flex-1">
        <SectionHeader
          title="Hard Blocked Customers"
          subtitle="Permanently blocked from all lending products"
        />
      </div>
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-sm px-3 h-10 lg:w-80 w-full">
          <IoSearch size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MSISDN (e.g 07015322207)"
            className="flex-1 text-[13px] text-[#374151] font-ibm-plex-sans outline-none placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#243B6B] px-4 h-10 rounded-sm text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors">
          <AiOutlineSearch size={16} />
          Search
        </button>
      </div>
    </div>
    <TableWrapper>
      <thead>
        <tr className="border-y border-[#F3F4F6] bg-gray-50">
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                MSISDN
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Reason
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Rule
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Last Seen
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length === 0 ? (
          <EmptyTableState colSpan={4} message="No hard blocked customers found" />
        ) : (
          filteredData.map((row: any, i) => (
            <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.msisdn}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.reason}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.rule}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.lastSeen}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableWrapper>
  </div>
);

const WhitelistedSection = ({
  search,
  setSearch,
  filteredData,
}: {
  search: string;
  setSearch: (v: string) => void;
  filteredData: any[];
}) => (
  <div>
    <div className="flex items-center justify-between mb-6 px-4 pt-6 flex-col lg:flex-row">
      <div className="flex-1">
        <SectionHeader
          title="Whitelisted Customers"
          subtitle="Trusted customers with elevated lending access"
        />
      </div>
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-sm px-3 h-10 lg:w-80 w-full">
          <IoSearch size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MSISDN (e.g 07015322207)"
            className="flex-1 text-[13px] text-[#374151] font-ibm-plex-sans outline-none placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#243B6B] px-4 h-10 rounded-sm text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors">
          <AiOutlineSearch size={16} />
          Search
        </button>
      </div>
    </div>
    <TableWrapper>
      <thead>
        <tr className="border-y border-[#F3F4F6] bg-gray-50">
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                MSISDN
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Reason
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Source
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
          <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
                Created Date
                <div className="flex flex-col">
                  <IoMdArrowDown className="inline ml-1 opacity-50" />
                </div>
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length === 0 ? (
          <EmptyTableState colSpan={4} message="No whitelisted customers found" />
        ) : (
          filteredData.map((row: any, i) => (
            <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.msisdn}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.reason}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.source}
              </td>
              <td className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap">
                {row.createdDate}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableWrapper>
  </div>
);

// ── Page ───────────────────────────────────────────────────────────────
export default function Page() {
  const [activeMainTab, setActiveMainTab] =
    useState<MainTabKey>("customer-search");
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>("loan-history");
  const [search, setSearch] = useState("");

  const [customerMetrics, setCustomerMetrics] = useState<CustomerMetrics | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [loanHistory, setLoanHistory] = useState<any[]>([]);

  const fetchCustomerProfile = async (msisdn: string) => {
    if (!msisdn) return;
    setLoadingProfile(true);
    setErrorProfile(null);
    try {
      const response = await axiosInstance.get(CustomerProfile(msisdn));
      const resData = response.data;
      if (resData && resData.success && resData.data) {
        const d = resData.data;
        const mappedMetrics: CustomerMetrics = {
          totalBorrowed: `₦${Number(d.totalDisbursed || 0).toLocaleString()}`,
          totalRecovered: `₦${Number(d.totalRecovered || 0).toLocaleString()}`,
          outstandingBalance: `₦${Number(d.outstandingBalance || 0).toLocaleString()}`,
          activeLoans: d.activeLoanCount || 0,
          lifetimeDefaults: d.totalDefaults || 0,
          behaviouralRiskScore: d.behavioralRiskScore || 0,
          hardBlockStatus: d.hardBlocked ? "Restricted" : "Active",
          eligibilityStatus: (d.blacklisted || d.hardBlocked || d.riskCategory === "HIGH") ? "Restricted" : "Active",
        };
        setCustomerMetrics(mappedMetrics);
        
        if (Array.isArray(d.recentLoans)) {
          if (d.recentLoans.length > 0) {
            setLoanHistory(
              d.recentLoans.map((loan: any) => ({
                loanId: loan.loanId || loan.id || "N/A",
                amount: `₦${Number(loan.amount || 0).toLocaleString()}`,
                outstanding: `₦${Number(loan.outstandingBalance || 0).toLocaleString()}`,
                date: loan.createdAt ? new Date(loan.createdAt).toLocaleDateString("en-GB") : "N/A",
                aging: loan.agingBucket || "CURRENT",
                agingColor: loan.agingBucket === "CURRENT" ? "green" : "red",
              }))
            );
          } else {
            setLoanHistory([]);
          }
        }
      } else {
        setErrorProfile(resData.message || "Failed to fetch customer profile.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorProfile(err.response?.data?.message || "Customer not found or network error.");
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="p-6">
      <SubMenu
        title="Customer Search"
        subtitle="Search and analyze customers and view their risk profiles."
      />

      {/* Main Tabs */}
      <div className="flex border border-[#DCE9F9] bg-[#EEF4FC] rounded-sm mt-6 mb-6 pl-1 py-1 gap-1 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveMainTab(tab.key)}
            className={`px-4 py-2 text-[13px] font-ibm-plex-sans whitespace-nowrap rounded transition-colors ${
              activeMainTab === tab.key
                ? "bg-[#243B6B] text-white font-semibold"
                : "text-[#6B7280] hover:text-[#374151]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white  rounded-sm border border-gray-200">
        {activeMainTab === "customer-search" && (
          <CustomerSearchSection
            search={search}
            setSearch={setSearch}
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
            customerMetrics={customerMetrics}
            loadingProfile={loadingProfile}
            errorProfile={errorProfile}
            onSearch={() => fetchCustomerProfile(search)}
            loanHistory={loanHistory}
          />
        )}
        {activeMainTab === "exposure-ledger" && (
          <ExposureLedgerSection
            search={search}
            setSearch={setSearch}
            filteredData={mockExposureLedger.filter((row: any) =>
              row.msisdn.toLowerCase().includes(search.toLowerCase()),
            )}
          />
        )}
        {activeMainTab === "delinquent-customer" && (
          <DelinquentCustomerSection
            search={search}
            setSearch={setSearch}
            filteredData={mockDelinquentCustomers.filter((row: any) =>
              row.msisdn.toLowerCase().includes(search.toLowerCase()),
            )}
          />
        )}
        {activeMainTab === "legal-risk-customer" && (
          <LegalRiskCustomerSection
            search={search}
            setSearch={setSearch}
            filteredData={mockLegacyRiskCustomers.filter((row: any) =>
              row.msisdn.toLowerCase().includes(search.toLowerCase()),
            )}
          />
        )}
        {activeMainTab === "behavioural-risk-ranking" && (
          <BehaviouralRiskSection
            search={search}
            setSearch={setSearch}
            filteredData={mockBehaviouralRisk.filter((row: any) =>
              row.msisdn.toLowerCase().includes(search.toLowerCase()),
            )}
          />
        )}
        {activeMainTab === "hard-blocked" && (
          <HardBlockedSection
            search={search}
            setSearch={setSearch}
            filteredData={mockHardBlocked.filter((row: any) =>
              row.msisdn.toLowerCase().includes(search.toLowerCase()),
            )}
          />
        )}
        {activeMainTab === "whitelisted-customer" && (
          <WhitelistedSection
            search={search}
            setSearch={setSearch}
            filteredData={mockWhitelisted.filter((row: any) =>
              row.msisdn.toLowerCase().includes(search.toLowerCase()),
            )}
          />
        )}
      </div>
    </div>
  );
}
