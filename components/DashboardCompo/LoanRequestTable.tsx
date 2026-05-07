"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { IoMdArrowDown } from "react-icons/io";
import Image from "next/image";
import { AiOutlineDown } from "react-icons/ai";
import { calender } from "@/constant";

const allRows = [
  { event: "Loan", msisdn: "08115322207", telco: "MTN", amount: "₦500.00", status: "Failed", timestamp: "23/09/26, 09:11:04" },
  { event: "Recovery", msisdn: "08108762779", telco: "Glo", amount: "₦750.00", status: "Success", timestamp: "23/09/26, 09:11:04" },
  { event: "Loan", msisdn: "09087622779", telco: "9 Mobile", amount: "₦200.00", status: "Pending", timestamp: "23/09/26, 09:11:04" },
  { event: "Recovery", msisdn: "07087627729", telco: "Airtel", amount: "₦150.00", status: "Success", timestamp: "23/09/26, 09:11:04" },
  { event: "Loan", msisdn: "08125322248", telco: "MTN", amount: "₦250.00", status: "Failed", timestamp: "23/09/26, 09:11:04" },
  { event: "Recovery", msisdn: "08115322017", telco: "Glo", amount: "₦1000.00", status: "Pending", timestamp: "23/09/26, 09:11:04" },
  { event: "Loan", msisdn: "08108762779", telco: "9 Mobile", amount: "₦950.00", status: "Success", timestamp: "23/09/26, 09:11:04" },
  { event: "Recovery", msisdn: "08108762779", telco: "Airtel", amount: "₦300.00", status: "Failed", timestamp: "23/09/26, 09:11:04" },
  { event: "Loan", msisdn: "08108762779", telco: "MTN", amount: "₦200.00", status: "Success", timestamp: "23/09/26, 09:11:04" },
  { event: "Recovery", msisdn: "08108762779", telco: "Glo", amount: "₦250.00", status: "Pending", timestamp: "23/09/26, 09:11:04" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Success: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-600",
    Pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-sm ${styles[status]}`}>
      {status}
    </span>
  );
}

function EventBadge({ event }: { event: string }) {
  const styles: Record<string, string> = {
    Loan: "bg-[#DBEAFE] text-[#1447E6]",
    Recovery: "bg-green-100 text-green-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-semibold px-2.5 py-1 rounded-sm ${styles[event]}`}>
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
      <div className="flex items-center justify-between p-4 pb-6">
          <div>
          <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
             Recents Transactions
          </h2>
          <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
            Latest fulfllments and recoveries
          </p>
        </div>
        <div className='border border-[#EBEBEB] flex items-center px-4 gap-2 rounded-sm bg-white py-2 cursor-pointer'>
          <Image src={calender} alt='calender' width={15} height={15} />
          <p className='text-gray-500 text-[14px] font-medium font-mulish'>This Year </p>
          <AiOutlineDown color='#344054' size={14} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-[#F3F4F6] bg-gray-50">
              {["Event", "MSISDN", "Telco", "Amount", "Status", "Timestamp"].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-[13px] font-normal text-[#667085] whitespace-nowrap">
                  {h}  <SortIcon />
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