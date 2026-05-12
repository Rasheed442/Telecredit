"use client";
import React, { useState } from "react";
import { LoanRow } from "@/components/DataTable";

// ── Types ──────────────────────────────────────────────────────────────
interface RecoveryRecord {
  id: string;
  amount: string;
  recoveredAt: string;
}

interface AuditRecord {
  jobName: string;
  timestamp: string;
}

// ── Mock generators ────────────────────────────────────────────────────
function generateRecovery(count: number): RecoveryRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `REC_${String(i + 1).padStart(5, "0")}`,
    amount: "₦432",
    recoveredAt: i % 2 === 0 ? "2026-05-04 23:00" : "2026-05-08 14:22",
  }));
}

const auditJobs = [
  "Refresh Dashboard Snapshot",
  "Run Loan Aging Scheduler",
  "Run Legacy History Import",
  "Rebuild Exposure Ledger",
];

function generateAudit(count: number): AuditRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    jobName: auditJobs[i % auditJobs.length],
    timestamp: i % 2 === 0 ? "2026-05-04 23:00" : "2026-05-08 14:22",
  }));
}

const recoveryData = generateRecovery(50);
const auditData = generateAudit(50);

// ── Pagination helper ──────────────────────────────────────────────────
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
    <div className="flex items-center justify-between px-6 py-4">
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
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
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

// ── Badge helpers ──────────────────────────────────────────────────────
function AgingBadge({ value }: { value: string }) {
  const isDP0 = value === "DP 0";
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded text-sm font-semibold ${
        isDP0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"
      }`}
    >
      {value}
    </span>
  );
}

function FraudBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    High: "bg-red-50 text-red-500",
    Medium: "bg-yellow-50 text-yellow-600",
    Low: "bg-green-50 text-green-700",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded text-sm font-semibold ${
        colors[value] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {value}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────
interface LoanDetailViewProps {
  loan: LoanRow;
  onBack: () => void;
}

export default function LoanDetailView({ loan, onBack }: LoanDetailViewProps) {
  const [recoveryPage, setRecoveryPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);

  const recoverySlice = recoveryData.slice(
    (recoveryPage - 1) * PER_PAGE,
    recoveryPage * PER_PAGE,
  );
  const auditSlice = auditData.slice(
    (auditPage - 1) * PER_PAGE,
    auditPage * PER_PAGE,
  );

  const fields = [
    { label: "MSISDN", value: loan.msisdn },
    {
      label: "Telco",
      value: loan.telco.charAt(0) + loan.telco.slice(1).toLowerCase(),
    },
    { label: "Amount", value: loan.amount },
    { label: "Outstanding", value: loan.outstanding },
    { label: "Recovered", value: loan.recovered },
    { label: "Aging", value: <AgingBadge value={loan.aging} /> },
    { label: "Fraud Risk", value: <FraudBadge value={loan.fraudRisk} /> },
    { label: "Score", value: loan.score },
    { label: "Created", value: loan.created },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex cursor-pointer items-center gap-2 text-sm text-[#243B6B] bg-[#EEF4FC] py-2 px-4 rounded-sm hover:text-gray-900 transition-colors"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5016 6.66829H0.834961M6.66829 0.834961L0.834961 6.66829L6.66829 12.5016"
            stroke="#243B6B"
            stroke-width="1.67"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Back
      </button>

      {/* Loan header card */}
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Loan {loan.loanId}
        </h2>
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {fields.map((f) => (
            <div key={f.label} className="flex flex-col gap-1 min-w-[80px]">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {f.label}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {f.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery History */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="px-6 py-5">
          <h3 className="text-base font-semibold text-gray-900">
            Recovery History
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                Recovery ID
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                Amount
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                Recovered at At
              </th>
            </tr>
          </thead>
          <tbody>
            {recoverySlice.map((rec) => (
              <tr
                key={rec.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-700">{rec.id}</td>
                <td className="px-6 py-4 text-gray-700">{rec.amount}</td>
                <td className="px-6 py-4 text-gray-500">{rec.recoveredAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          total={recoveryData.length}
          page={recoveryPage}
          onPage={setRecoveryPage}
        />
      </div>

      {/* Callback Audit Trail */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="px-6 py-5">
          <h3 className="text-base font-semibold text-gray-900">
            Callback Audit Trail
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                Job Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {auditSlice.map((audit, i) => (
              <tr
                key={i}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-700">{audit.jobName}</td>
                <td className="px-6 py-4 text-gray-500">{audit.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          total={auditData.length}
          page={auditPage}
          onPage={setAuditPage}
        />
      </div>
    </div>
  );
}
