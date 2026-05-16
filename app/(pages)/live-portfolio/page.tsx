// page.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import SubMenu from "@/components/SubMenu";
import DataTable, { LoanRow } from "@/components/DataTable";
import Dropdown from "@/components/Dropdown";
import DPDAnalysisChart from "@/components/LivePortfolio/DPDAnalysisChart";
import { IoFilterSharp, IoSearch } from "react-icons/io5";
import LoanDetailView from "@/components/LivePortfolio/LoanDetailView";
import axiosInstance from "@/app/utils/axios";
import { RecentLoans, PortfolioWatchlist } from "@/app/utils/endpoint";
import { AlertCircle } from "lucide-react";
import ComponentLoadingSpinner from "@/components/ui/loading-spinner";

type TabKey = "open" | "delinquent" | "closed" | "watchlist" | "aging";

interface RecentLoanApiRow {
  loanId: number;
  partnerLoanId?: string;
  transactionRef?: string;
  msisdn: string;
  telco: string;
  amount: number;
  recoveredAmount: number;
  outstandingAmount: number;
  agingBucket: string;
  delinquent: boolean;
  closed: boolean;
  behavioralRiskScore: number;
  status: string;
  createdAt: string;
}

interface RecentLoansResponse {
  success: boolean;
  data?: {
    data?: RecentLoanApiRow[];
    totalElements?: number;
  };
}

const tabs: { key: TabKey; label: string; count?: number }[] = [
  { key: "open", label: "Open Loans" },
  { key: "delinquent", label: "Delinquent Loans" },
  { key: "closed", label: "Closed Loans" },
  { key: "watchlist", label: "Portfolio Watchlist" },
  { key: "aging", label: "Aging Buckets Analysis" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(date);
};

const formatAgingBucket = (bucket: string) => {
  const labels: Record<string, string> = {
    DPD_0: "DP 0",
    DPD_1_7: "DP 1-7",
    DPD_8_30: "DP 8-30",
    DPD_31_PLUS: "DP 31+",
  };
  return labels[bucket] ?? bucket.replace(/^DPD_/, "DP ").replaceAll("_", "-");
};

const riskFromScore = (score: number) => {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

const mapRecentLoan = (loan: RecentLoanApiRow): LoanRow => ({
  loanId:
    loan.partnerLoanId || loan.transactionRef || String(loan.loanId ?? "N/A"),
  msisdn: loan.msisdn,
  telco: loan.telco?.toUpperCase() ?? "N/A",
  amount: formatCurrency(loan.amount),
  outstanding: formatCurrency(loan.outstandingAmount),
  recovered: formatCurrency(loan.recoveredAmount),
  aging: formatAgingBucket(loan.agingBucket),
  fraudRisk: riskFromScore(loan.behavioralRiskScore),
  score: loan.behavioralRiskScore ?? 0,
  created: formatDate(loan.createdAt),
  status: loan.status,
  closed: loan.closed,
  delinquent: loan.delinquent,
});

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("open");
  const [search, setSearch] = useState("");
  const [telco, setTelco] = useState("All Telcos");
  const [status, setStatus] = useState("All Statuses");
  const [selectedLoan, setSelectedLoan] = useState<LoanRow | null>(null);
  const [loans, setLoans] = useState<LoanRow[]>([]);
  const [openTotal, setOpenTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loanError, setLoanError] = useState("");

  useEffect(() => {
    const fetchRecentLoans = async () => {
      setLoadingLoans(true);
      setLoanError("");

      try {
        const token =
          localStorage.getItem("jwt_token") || localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const params: any = { page: currentPage - 1, size: 20 };

        const endpoint = activeTab === "watchlist" ? PortfolioWatchlist : RecentLoans;

        const response = await axiosInstance.get<RecentLoansResponse>(
          endpoint,
          {
            headers,
            params,
          },
        );
        const payload = response.data.data;
        const mappedLoans = (payload?.data ?? []).map(mapRecentLoan);

        setLoans(mappedLoans);
        setOpenTotal(payload?.totalElements ?? mappedLoans.length);
      } catch {
        setLoanError("Unable to load open loans right now.");
        setLoans([]);
        setOpenTotal(0);
      } finally {
        setLoadingLoans(false);
      }
    };

    fetchRecentLoans();
  }, [currentPage, activeTab]);

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

  const tabCounts = useMemo(
    () => ({
      open: activeTab === "open" ? openTotal : undefined,
      delinquent: activeTab === "delinquent" ? openTotal : undefined,
      closed: activeTab === "closed" ? openTotal : undefined,
      watchlist: activeTab === "watchlist" ? openTotal : undefined,
    }),
    [activeTab, openTotal],
  );

  const filtered = loans.filter((r) => {
    const matchesSearch =
      r.msisdn.includes(search) ||
      r.loanId.toLowerCase().includes(search.toLowerCase());
    const matchesTelco = telco === "All Telcos" || r.telco === telco;
    const matchesStatus =
      status === "All Statuses" ||
      (status === "Active" && !r.closed) ||
      (status === "Delinquent" && Boolean(r.delinquent)) ||
      (status === "Closed" && Boolean(r.closed));
    const matchesTab =
      activeTab === "open"
        ? !r.closed
        : activeTab === "delinquent"
          ? Boolean(r.delinquent)
          : activeTab === "closed"
            ? Boolean(r.closed)
            : true;

    return matchesSearch && matchesTelco && matchesStatus && matchesTab;
  });

  if (selectedLoan) {
    return (
      <LoanDetailView
        loan={selectedLoan}
        onBack={() => setSelectedLoan(null)}
      />
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <SubMenu
        title="Live Portfolio Monitoring"
        subtitle="Track and manage all active, delinquent, and closed loans."
      />
      {/* ── Tabs ── */}
      <div className="flex border border-[#DCE9F9] bg-[#EEF4FC] mt-6 mb-6 pl-1 py-1 gap-1 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 rounded sm:px-4 py-2 text-[12px] sm:text-[14px] cursor-pointer font-ibm-plex-sans whitespace-nowrap transition-colors border-b-2 -mb-px
              ${
                activeTab === t.key
                  ? "bg-[#243B6B] text-white font-semibold"
                  : "border-transparent text-[#6B7280] hover:text-[#374151]"
              }`}
          >
            {t.label}
            {(() => {
              const count = t.count ?? tabCounts[t.key as keyof typeof tabCounts];
              if (count === undefined) return null;
              return (
                <span
                  className={`text-[11px] sm:text-[12px] font-semibold px-1.5 sm:px-2 py-0.5 rounded
                    ${
                      activeTab === t.key
                        ? "bg-white text-gray-700 font-bold"
                        : "bg-gray-50 text-gray-700"
                    }`}
                >
                  {count}
                </span>
              );
            })()}
          </button>
        ))}
      </div>
      <div className="mt-6 bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
        {/* ── Filters ── */}
        {activeTab !== "aging" && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 px-4 sm:px-5 py-4 border-b border-[#F3F4F6] flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 border border-[#E5E7EB] bg-[#FAFAFA] rounded-sm px-3 h-10 w-full sm:w-auto sm:min-w-65">
              <IoSearch size={19} className="text-gray-500 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search MSISDN"
                className="flex-1 min-w-0 placeholder:text-[16px] text-[#374151] font-ibm-plex-sans outline-none placeholder:font-ibm-plex-sans placeholder:text-gray-500 bg-transparent"
              />
            </div>

            {/* Dropdowns + button row — wraps together on mobile */}
            <div className="flex items-center gap-3 flex-wrap">
              <Dropdown
                options={telcoOptions}
                value={telco}
                onChange={setTelco}
                className="w-full xs:w-auto flex-1 sm:flex-none sm:w-32"
              />
              <Dropdown
                options={statusOptions}
                value={status}
                onChange={setStatus}
                className="w-full xs:w-auto flex-1 sm:flex-none sm:w-32"
              />
              <button className="flex items-center justify-center cursor-pointer gap-2 border bg-[#243B6B] border-gray-200 rounded-sm px-4 h-10 text-[14px] text-white font-medium hover:bg-[#1a2d54] transition-colors w-full sm:w-auto">
                <IoFilterSharp size={18} className="text-white shrink-0" />
                Apply filter
              </button>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {activeTab === "aging" ? (
          <DPDAnalysisChart />
        ) : loadingLoans ? (
          <div className="relative min-h-80 overflow-hidden bg-black/30 z-70 inset-0">
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
              <div className="flex h-20 w-20 items-center justify-center rounded-sm border border-[#DCE9F9] bg-white shadow-sm">
                <ComponentLoadingSpinner height="h-auto" size="md" />
                <span className="sr-only">Loading loans</span>
              </div>
            </div>
          </div>
        ) : loanError ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600">
              <AlertCircle size={24} strokeWidth={1.8} />
            </div>
            <h3 className="font-sf-pro text-[16px] font-semibold text-[#1F2937]">
              Open loans could not be loaded
            </h3>
            <p className="mt-1 max-w-md font-ibm-plex-sans text-[13px] leading-5 text-[#667085]">
              Please check your connection or try refreshing this page.
            </p>
          </div>
        ) : (
          <DataTable
            searchable={false}
            data={filtered}
            onActionClick={(row) => setSelectedLoan(row)}
            className="border-t-0"
            serverPagination={true}
            totalElements={openTotal}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={20}
          />
        )}
      </div>
    </div>
  );
}
