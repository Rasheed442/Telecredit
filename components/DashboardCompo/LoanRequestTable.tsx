"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { IoMdArrowDown } from "react-icons/io";

const allRows = [
  { event:"Loan", msisdn:"08115322207", telco:"MTN", amount:"₦500.00", status:"Failed", timestamp:"23/09/26, 09:11:04" },
  { event:"Recovery", msisdn:"08108762779", telco:"Glo", amount:"₦750.00", status:"Success", timestamp:"23/09/26, 09:11:04" },
  { event:"Loan", msisdn:"09087622779", telco:"9 Mobile", amount:"₦200.00", status:"Pending", timestamp:"23/09/26, 09:11:04" },
  { event:"Recovery", msisdn:"07087627729", telco:"Airtel", amount:"₦150.00", status:"Success", timestamp:"23/09/26, 09:11:04" },
  { event:"Loan", msisdn:"08125322248", telco:"MTN", amount:"₦250.00", status:"Failed", timestamp:"23/09/26, 09:11:04" },
  { event:"Recovery", msisdn:"08115322017", telco:"Glo", amount:"₦1000.00", status:"Pending", timestamp:"23/09/26, 09:11:04" },
  { event:"Loan", msisdn:"08108762779", telco:"9 Mobile", amount:"₦950.00", status:"Success", timestamp:"23/09/26, 09:11:04" },
  { event:"Recovery", msisdn:"08108762779", telco:"Airtel", amount:"₦300.00", status:"Failed", timestamp:"23/09/26, 09:11:04" },
  { event:"Loan", msisdn:"08108762779", telco:"MTN", amount:"₦200.00", status:"Success", timestamp:"23/09/26, 09:11:04" },
  { event:"Recovery", msisdn:"08108762779", telco:"Glo", amount:"₦250.00", status:"Pending", timestamp:"23/09/26, 09:11:04" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Success: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-600",
    Pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

function EventBadge({ event }: { event: string }) {
  const styles: Record<string, string> = {
    Loan: "bg-blue-100 text-blue-700",
    Recovery: "bg-green-100 text-green-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full ${styles[event]}`}>
      {event}
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
    <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-[#F3F4F6] mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-[#F3F4F6]">
              {["Event","MSISDN","Telco","Amount","Status","Timestamp"].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-[12px] font-normal text-[#667085] whitespace-nowrap border-r border-gray-200 last:border-r-0">
                  {h} {h !== "Timestamp" && <SortIcon />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors text-[#667085]">
                <td className="px-3 py-3"><EventBadge event={row.event} /></td>
                <td className="px-3 py-3 text-[#1F2937]">{row.msisdn}</td>
                <td className="px-3 py-3 text-[#667085]">{row.telco}</td>
                <td className="px-3 py-3 text-[#667085]">{row.amount}</td>
                <td className="px-3 py-3"><StatusBadge status={row.status} /></td>
                <td className="px-3 py-3 text-[#667085]">{row.timestamp}</td>
              </tr>
            ))}
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