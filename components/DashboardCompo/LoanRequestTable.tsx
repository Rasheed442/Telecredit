"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { IoMdArrowDown } from "react-icons/io";

const networks: Record<string, { bg: string; color: string; label: string }> = {
  MTN:       { bg: "#FFC107", color: "#111", label: "MTN" },
  Glo:       { bg: "#4CAF50", color: "#fff", label: "glo" },
  Airtel:    { bg: "#E22226", color: "#fff", label: "A" },
  "9 Mobile":{ bg: "#1a1a1a", color: "#fff", label: "9" },
};

const allRows = [
  { phone:"08115322207", network:"MTN",      loanType:"Airtime", score:80, req:"₦250.00",  appr:"₦250.00",  date:"23/09/26, 09:11:04", status:"Approved", repay:0   },
  { phone:"08108762779", network:"Glo",      loanType:"Data",    score:50, req:"₦750.00",  appr:"₦50.00",   date:"23/09/26, 09:11:04", status:"Rejected", repay:100 },
  { phone:"09087622779", network:"9 Mobile", loanType:"Airtime", score:20, req:"₦200.00",  appr:"₦100.00",  date:"23/09/26, 09:11:04", status:"Pending",  repay:40  },
  { phone:"07087627729", network:"Airtel",   loanType:"Data",    score:80, req:"₦150.00",  appr:"₦150.00",  date:"23/09/26, 09:11:04", status:"Pending",  repay:100 },
  { phone:"08125322248", network:"MTN",      loanType:"Airtime", score:80, req:"₦250.09",  appr:"₦30.09",   date:"23/09/26, 09:11:04", status:"Approved", repay:40  },
  { phone:"08115322017", network:"Glo",      loanType:"Data",    score:50, req:"₦1000.00", appr:"₦700.00",  date:"23/09/26, 09:11:04", status:"Approved", repay:0   },
  { phone:"08108762779", network:"9 Mobile", loanType:"Data",    score:20, req:"₦950.00",  appr:"₦700.00",  date:"23/09/26, 09:11:04", status:"Rejected", repay:100 },
  { phone:"08108762779", network:"Airtel",   loanType:"Airtime", score:80, req:"₦300.00",  appr:"₦300.00",  date:"23/09/26, 09:11:04", status:"Rejected", repay:0   },
  { phone:"08108762779", network:"MTN",      loanType:"Data",    score:20, req:"₦200.00",  appr:"₦200.00",  date:"23/09/26, 09:11:04", status:"Approved", repay:40  },
  { phone:"08108762779", network:"Glo",      loanType:"Data",    score:50, req:"₦250.00",  appr:"₦250.00",  date:"23/09/26, 09:11:04", status:"Pending",  repay:100 },
];

function scoreColor(s: number) {
  return s >= 70 ? "#22C55E" : s >= 40 ? "#F59E0B" : "#EF4444";
}
function repayColor(p: number) {
  return p === 100 ? "#22C55E" : p === 0 ? "#EF4444" : "#F59E0B";
}

function RepayRing({ pct }: { pct: number }) {
  const r = 14, cx = 17, cy = 17;
  const circ = 2 * Math.PI * r;
  const color = repayColor(pct);
  const dash = circ * (pct / 100);
  return (
    <div className="relative w-9 h-9 inline-flex items-center justify-center">
      <svg width="36" height="36" viewBox="0 0 34 34">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color + "33"} strokeWidth="3" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} />
      </svg>
      <span className="absolute text-[8px] font-semibold" style={{ color }}>{pct}%</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-600",
    Pending:  "bg-yellow-100 text-yellow-700",
  };
  const icons: Record<string, string> = { Approved: "✓", Rejected: "✕", Pending: "↩" };
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
}

const SortIcon = () => (
  <IoMdArrowDown size={12} className="inline ml-1 opacity-50" />
);

export default function LoanTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const total = allRows.length;
  const rows = allRows.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#F3F4F6] mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-[#F3F4F6]">
              {["Phone Number","Network Type","Loan Type","Requested Amount","Approved Amount","Cred Score","Date","Loan Status","Repayment Status"].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-[12px] font-normal text-[#667085] whitespace-nowrap">
                  {h} {h !== "Repayment Status" && <SortIcon />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const net = networks[row.network] ?? { bg: "#ccc", color: "#000", label: "?" };
              const sc = scoreColor(row.score);
              return (
                <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors text-[#667085">
                  <td className="px-3 py-3 text-[#1F2937]">{row.phone}</td>
                  <td className="px-3 py-3 text-[#667085">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                        style={{ background: net.bg, color: net.color }}>
                        {net.label}
                      </div>
                      <span className="text-[#667085]">{row.network}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#667085]">{row.loanType}</td>
                  <td className="px-3 py-3 text-[#667085]">{row.req}</td>
                  <td className="px-3 py-3 text-[#667085]">{row.appr}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${row.score}%`, background: sc }} />
                      </div>
                      <span className="font-medium text-[12px] text-[#667085" style={{ color: sc }}>{row.score}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#667085]">{row.date}</td>
                  <td className="px-3 py-3 text-[#667085"><StatusBadge status={row.status} /></td>
                  <td className="px-3 py-3 text-[#667085"><RepayRing pct={row.repay} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-[#F3F4F6] text-[13px] text-[#667085]">
        <span>Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total} entries</span>
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="border border-[#E5E7EB] rounded-md px-2 py-1 text-[13px] text-[#374151]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="w-7 h-7 rounded-md border border-[#E5E7EB] flex items-center justify-center disabled:opacity-40 hover:bg-[#F9FAFB]">
            <ChevronLeft size={14} />
          </button>
          <div className="w-7 h-7 rounded-md bg-[#4B47D6] text-white flex items-center justify-center text-[13px] font-medium">
            {page}
          </div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-7 h-7 rounded-md border border-[#E5E7EB] flex items-center justify-center disabled:opacity-40 hover:bg-[#F9FAFB]">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}