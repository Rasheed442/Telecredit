"use client";
import React, { useState } from "react";
import SubMenu from "@/components/SubMenu";
import { IoMdArrowDown } from "react-icons/io";

const PER_PAGE = 5;

function Pagination({
  total,
  page,
  onPage,
}: {
  total: number;
  page: number;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / PER_PAGE);

  const pages: (number | "...")[] = [];
  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages);
  }

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e-${i}`} className="px-2 text-gray-400 text-sm">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                page === p
                  ? "bg-[#243B6B] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

// ── Types ──────────────────────────────────────────────────────────────
type TabKey = "fulfillment" | "recovery" | "duplicate" | "unauthorized";
type StatusValue = "Success" | "Failed" | "Pending";

type CallbackRow = {
  fingerprint: string;
  requestType: "Fulfilment" | "Recovery";
  transactionRef: string;
  partnerLoanId: string;
  recoveryId: string;
  authorized: StatusValue;
  processed: StatusValue;
  duplicateRejected: StatusValue;
  responseMessage: string;
  receivedAt: string;
};

// ── Mock data ──────────────────────────────────────────────────────────
const rows: CallbackRow[] = [
  {
    fingerprint: "FP_4NV3IV.8LH",
    requestType: "Fulfilment",
    transactionRef: "TXN_00001",
    partnerLoanId: "ATL_CORE_0001",
    recoveryId: "REC_00001",
    authorized: "Failed",
    processed: "Failed",
    duplicateRejected: "Failed",
    responseMessage: "Unauthorized signature",
    receivedAt: "18/03/2026",
  },
  {
    fingerprint: "FP_4OGWMW.C9P",
    requestType: "Recovery",
    transactionRef: "TXN_00002",
    partnerLoanId: "ATL_CORE_0002",
    recoveryId: "REC_00002",
    authorized: "Pending",
    processed: "Pending",
    duplicateRejected: "Pending",
    responseMessage: "Duplicate fingerprint",
    receivedAt: "18/03/2026",
  },
  {
    fingerprint: "FP_D7MJV7.11B",
    requestType: "Fulfilment",
    transactionRef: "TXN_00003",
    partnerLoanId: "ATL_CORE_0003",
    recoveryId: "REC_00003",
    authorized: "Success",
    processed: "Success",
    duplicateRejected: "Success",
    responseMessage: "Unauthorized signature",
    receivedAt: "18/03/2026",
  },
  {
    fingerprint: "FP_A7PHDT.DL6",
    requestType: "Recovery",
    transactionRef: "TXN_00004",
    partnerLoanId: "ATL_CORE_0004",
    recoveryId: "REC_00004",
    authorized: "Failed",
    processed: "Failed",
    duplicateRejected: "Failed",
    responseMessage: "Duplicate fingerprint",
    receivedAt: "18/03/2026",
  },
  {
    fingerprint: "FP_95SGS3.C5G",
    requestType: "Fulfilment",
    transactionRef: "TXN_00005",
    partnerLoanId: "ATL_CORE_0005",
    recoveryId: "REC_00005",
    authorized: "Pending",
    processed: "Pending",
    duplicateRejected: "Pending",
    responseMessage: "Unauthorized signature",
    receivedAt: "18/03/2026",
  },
  {
    fingerprint: "FP_95JLTL.P1D",
    requestType: "Recovery",
    transactionRef: "TXN_00005",
    partnerLoanId: "ATL_CORE_0006",
    recoveryId: "REC_00006",
    authorized: "Success",
    processed: "Success",
    duplicateRejected: "Success",
    responseMessage: "Duplicate fingerprint",
    receivedAt: "18/03/2026",
  },
  {
    fingerprint: "FP_3EMKVV.QMH",
    requestType: "Fulfilment",
    transactionRef: "TXN_00006",
    partnerLoanId: "ATL_CORE_0007",
    recoveryId: "REC_00007",
    authorized: "Failed",
    processed: "Failed",
    duplicateRejected: "Failed",
    responseMessage: "Unauthorized signature",
    receivedAt: "18/03/2026",
  },
];

const tabs: { key: TabKey; label: string; count: number }[] = [
  { key: "fulfillment", label: "Fulfillment Callback Log", count: 80 },
  { key: "recovery", label: "Recovery Callback Log", count: 89 },
  { key: "duplicate", label: "Duplicate Rejections", count: 60 },
  { key: "unauthorized", label: "Unauthorized Attempts", count: 12 },
];

// ── Status Badge ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: StatusValue }) {
  const styles: Record<StatusValue, string> = {
    Success: "bg-green-50 text-green-700",
    Failed: "bg-[#FEF3F2] text-[#B42318]",
    Pending: "bg-[#F9F5E7] text-[#D76603]",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-sm text-[13px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// ── Sortable TH ────────────────────────────────────────────────────────
function SortableTh({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
      <button className="flex items-center gap-1 font-ibm-plex-sans hover:text-[#374151]">
        {children}
        <IoMdArrowDown className="opacity-50" />
      </button>
    </th>
  );
}

const statusKeys: (keyof CallbackRow)[] = [
  "authorized",
  "processed",
  "duplicateRejected",
];

// ── Page ───────────────────────────────────────────────────────────────
export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("fulfillment");
  const [page, setPage] = useState(1);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setPage(1);
  };
  const sliced = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="p-6">
      <SubMenu
        title="Partner Callback Audit Center"
        subtitle="Every fulfillment and recovery callback received from partners"
      />

      {/* ── Tab Bar ── */}
      <div className="flex border border-[#DCE9F9] bg-[#EEF4FC] rounded-sm mb-2 mt-6 pl-1 py-1 gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-[14px] cursor-pointer font-ibm-plex-sans whitespace-nowrap transition-colors -mb-[1px]
              ${
                activeTab === t.key
                  ? "bg-[#243B6B] text-white font-semibold rounded-md"
                  : "border-transparent text-[#6B7280] hover:text-[#374151]"
              }`}
          >
            {t.label}
            <span
              className={`text-[12px] font-semibold px-2 py-0.5 rounded-md
              ${activeTab === t.key ? "bg-white text-gray-700 font-bold" : "bg-gray-50 text-gray-700"}`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="mt-6 bg-white border border-gray-100 rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full text-[13px] font-ibm-plex-sans">
          <thead>
            <tr className="border-b border-[#F3F4F6] bg-gray-50">
              <SortableTh>Callback Fingerprint</SortableTh>
              <SortableTh>Request Type</SortableTh>
              <SortableTh>Transaction Ref</SortableTh>
              <SortableTh>Partner Loan ID</SortableTh>
              <SortableTh>Recovery ID</SortableTh>
              <SortableTh>Authorized</SortableTh>
              <SortableTh>Processed</SortableTh>
              <SortableTh>Duplicate Rejected</SortableTh>
              <SortableTh>Response Message</SortableTh>
              <SortableTh>Received At</SortableTh>
            </tr>
          </thead>
          <tbody>
            {sliced.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-4 font-semibold text-[#111827] whitespace-nowrap">
                  {row.fingerprint}
                </td>
                <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                  {row.requestType}
                </td>
                <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                  {row.transactionRef}
                </td>
                <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                  {row.partnerLoanId}
                </td>
                <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                  {row.recoveryId}
                </td>
                {statusKeys.map((key) => (
                  <td key={key} className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={row[key] as StatusValue} />
                  </td>
                ))}
                <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                  {row.responseMessage}
                </td>
                <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                  {row.receivedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={rows.length} page={page} onPage={setPage} />
      </div>
    </div>
  );
}
