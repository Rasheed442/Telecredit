"use client";
import React, { useState, useEffect } from "react";
import SubMenu from "@/components/SubMenu";
import { IoMdArrowDown } from "react-icons/io";
import axiosInstance from "@/app/utils/axios";

const PER_PAGE = 20;

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
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
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
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
type TabKey = "recent" | "recovery" | "duplicate" | "unauthorized";
type BooleanStatus = boolean | null;

// Recent/Duplicate/Unauthorized callback type
type CallbackRow = {
  id: number;
  callbackType: string | null;
  partnerReference: string | null;
  partnerName: string | null;
  msisdn: string;
  sourceIp: string;
  authorized: BooleanStatus;
  duplicateRejected: BooleanStatus;
  processed: BooleanStatus;
  processingStatus: string | null;
  responseCode: string | null;
  responseMessage: string;
  createdAt: string | null;
};

// Recovery/Parked recoveries type
type RecoveryRow = {
  id: number;
  msisdn: string;
  telco: string;
  transactionRef: string;
  loanId: string;
  recoveryId: string;
  transactionType: string;
  amount: number;
  daBalance: number;
  applied: boolean;
  appliedAt: string | null;
  createdAt: string;
};

type TabData = {
  data: (CallbackRow | RecoveryRow)[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

// ── Mock data – will be replaced by API calls ──────────────────────────
const tabs: { key: TabKey; label: string; endpoint: string }[] = [
  { key: "recent", label: "Recent Callbacks", endpoint: "admin/callback-audit/recent" },
  { key: "recovery", label: "Parked Recoveries", endpoint: "admin/callback-audit/parked-recoveries" },
  { key: "duplicate", label: "Duplicate Rejections", endpoint: "admin/callback-audit/duplicates" },
  { key: "unauthorized", label: "Unauthorized Attempts", endpoint: "admin/callback-audit/unauthorized" },
];

// ── Status Badge ───────────────────────────────────────────────────────
function StatusBadge({ value }: { value: BooleanStatus | string }) {
  if (typeof value === "boolean") {
    const status = value ? "Success" : "Failed";
    const styles: Record<string, string> = {
      Success: "bg-green-50 text-green-700  border border-green-200",
      Failed: "bg-[#FEF3F2] text-[#B42318] border border-red-200",
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 text-[13px] font-semibold ${styles[status]}`}>
        {status}
      </span>
    );
  }
  
  if (value === null) {
    return (
      <span className="inline-flex items-center px-3 py-1 text-[13px] font-semibold bg-gray-50 text-gray-600 border border-gray-200">
        N/A
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-3 py-1 text-[13px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
      {value}
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

// ── Helper: Format date ────────────────────────────────────────────────
function formatDate(date: string | null): string {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

// ── Empty State Component ──────────────────────────────────────────────
function EmptyState({ tab }: { tab: TabKey }) {
  const emptyStates: Record<TabKey, { icon: string; message: string; description: string }> = {
    recent: {
      icon: "📞",
      message: "No Recent Callbacks",
      description: "There are no recent callback records to display at the moment.",
    },
    recovery: {
      icon: "💰",
      message: "No Parked Recoveries",
      description: "All recovery transactions have been processed.",
    },
    duplicate: {
      icon: "⚠️",
      message: "No Duplicate Rejections",
      description: "There are no duplicate callbacks detected.",
    },
    unauthorized: {
      icon: "🔒",
      message: "No Unauthorized Attempts",
      description: "All callback requests have been authorized.",
    },
  };

  const state = emptyStates[tab];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="text-5xl mb-4">{state.icon}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{state.message}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm">{state.description}</p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────
export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("recent");
  const [page, setPage] = useState(1);
  const [tabData, setTabData] = useState<Record<TabKey, TabData>>({
    recent: { data: [], page: 0, size: 20, totalElements: 0, totalPages: 0, hasNext: false },
    recovery: { data: [], page: 0, size: 20, totalElements: 0, totalPages: 0, hasNext: false },
    duplicate: { data: [], page: 0, size: 20, totalElements: 0, totalPages: 0, hasNext: false },
    unauthorized: { data: [], page: 0, size: 20, totalElements: 0, totalPages: 0, hasNext: false },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data for the active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = tabs.find(t => t.key === activeTab)?.endpoint;
        if (!endpoint) return;

        const response = await axiosInstance.get(endpoint, {
          params: { page: page - 1, size: PER_PAGE }
        });

        if (response.data?.success && response.data?.data) {
          setTabData(prev => ({
            ...prev,
            [activeTab]: response.data.data
          }));
        }
      } catch (err) {
        console.error("Error fetching callback data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, page]);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setPage(1);
  };

  const currentData = tabData[activeTab];
  const sliced = currentData.data;

  return (
    <div className="p-6">
      <SubMenu
        title="Partner Callback Audit Center"
        subtitle="Every fulfillment and recovery callback received from partners"
      />

      {/* ── Tab Bar ── */}
      <div className="flex border border-[#DCE9F9] bg-[#EEF4FC] rounded mb-2 mt-6 pl-1 py-1 gap-1 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-[14px] cursor-pointer font-ibm-plex-sans whitespace-nowrap transition-colors -mb-px
              ${
                activeTab === t.key
                  ? "bg-[#243B6B] text-white font-semibold rounded"
                  : "border-transparent text-[#6B7280] hover:text-[#374151]"
              }`}
          >
            {t.label}
            <span
              className={`text-[12px] font-semibold px-2 py-0.5 rounded
              ${activeTab === t.key ? "bg-white text-gray-700 font-bold" : "bg-gray-50 text-gray-700"}`}
            >
              {currentData.totalElements}
            </span>
          </button>
        ))}
      </div>

      {/* ── Error Message ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ── Table Card ── */}
      <div className="mt-6 bg-white border border-gray-100 rounded-sm shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : sliced.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <>
            <table className="w-full text-[13px] font-ibm-plex-sans">
              <thead>
                <tr className="border-b border-[#F3F4F6] bg-gray-50">
                  {activeTab === "recovery" ? (
                    <>
                      <SortableTh>MSISDN</SortableTh>
                      <SortableTh>Telco</SortableTh>
                      <SortableTh>Transaction Ref</SortableTh>
                      <SortableTh>Loan ID</SortableTh>
                      <SortableTh>Recovery ID</SortableTh>
                      <SortableTh>Transaction Type</SortableTh>
                      <SortableTh>Amount</SortableTh>
                      <SortableTh>DA Balance</SortableTh>
                      <SortableTh>Applied</SortableTh>
                      <SortableTh>Created At</SortableTh>
                    </>
                  ) : (
                    <>
                      <SortableTh>ID</SortableTh>
                      <SortableTh>MSISDN</SortableTh>
                      <SortableTh>Partner Name</SortableTh>
                      <SortableTh>Authorized</SortableTh>
                      <SortableTh>Processed</SortableTh>
                      <SortableTh>Duplicate Rejected</SortableTh>
                      <SortableTh>Response Message</SortableTh>
                      <SortableTh>Created At</SortableTh>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {sliced.map((row, i) => {
                  const isRecovery = activeTab === "recovery";
                  const recoveryRow = row as RecoveryRow;
                  const callbackRow = row as CallbackRow;

                  return (
                    <tr
                      key={i}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {isRecovery ? (
                        <>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {recoveryRow.msisdn}
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {recoveryRow.telco}
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {recoveryRow.transactionRef}
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {recoveryRow.loanId}
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {recoveryRow.recoveryId}
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {recoveryRow.transactionType}
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {recoveryRow.amount}
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {recoveryRow.daBalance}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <StatusBadge value={recoveryRow.applied} />
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {formatDate(recoveryRow.createdAt)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-5 py-4 font-semibold text-[#111827] whitespace-nowrap">
                            {callbackRow.id}
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {callbackRow.msisdn}
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {callbackRow.partnerName || "N/A"}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <StatusBadge value={callbackRow.authorized} />
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <StatusBadge value={callbackRow.processed} />
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <StatusBadge value={callbackRow.duplicateRejected} />
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {callbackRow.responseMessage}
                          </td>
                          <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                            {formatDate(callbackRow.createdAt)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              total={currentData.totalElements}
              page={page}
              onPage={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
