"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { IoMdArrowDown } from "react-icons/io";
import Image from "next/image";
import { AiOutlineDown } from "react-icons/ai";
import { calender } from "@/constant";
import CalendarPopup from "@/components/ui/CalendarPopup";

const allRows = [
  {
    event: "Loan",
    msisdn: "08115322207",
    telco: "MTN",
    amount: "₦500.00",
    status: "Failed",
    timestamp: "23/09/26, 09:11:04",
  },
  {
    event: "Recovery",
    msisdn: "08108762779",
    telco: "Glo",
    amount: "₦750.00",
    status: "Success",
    timestamp: "23/09/26, 09:11:04",
  },
  {
    event: "Loan",
    msisdn: "09087622779",
    telco: "9 Mobile",
    amount: "₦200.00",
    status: "Pending",
    timestamp: "23/09/26, 09:11:04",
  },
  {
    event: "Recovery",
    msisdn: "07087627729",
    telco: "Airtel",
    amount: "₦150.00",
    status: "Success",
    timestamp: "23/09/26, 09:11:04",
  },
  {
    event: "Loan",
    msisdn: "08125322248",
    telco: "MTN",
    amount: "₦250.00",
    status: "Failed",
    timestamp: "23/09/26, 09:11:04",
  },
  {
    event: "Recovery",
    msisdn: "08115322017",
    telco: "Glo",
    amount: "₦1000.00",
    status: "Pending",
    timestamp: "23/09/26, 09:11:04",
  },
  {
    event: "Loan",
    msisdn: "08108762779",
    telco: "9 Mobile",
    amount: "₦950.00",
    status: "Success",
    timestamp: "23/09/26, 09:11:04",
  },
  {
    event: "Recovery",
    msisdn: "08108762779",
    telco: "Airtel",
    amount: "₦300.00",
    status: "Failed",
    timestamp: "23/09/26, 09:11:04",
  },
  {
    event: "Loan",
    msisdn: "08108762779",
    telco: "MTN",
    amount: "₦200.00",
    status: "Success",
    timestamp: "23/09/26, 09:11:04",
  },
  {
    event: "Recovery",
    msisdn: "08108762779",
    telco: "Glo",
    amount: "₦250.00",
    status: "Pending",
    timestamp: "23/09/26, 09:11:04",
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Success: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-600",
    Pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-sm ${styles[status]}`}
    >
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
    <span
      className={`inline-flex items-center gap-1 text-[13px] font-semibold px-2.5 py-1 rounded-sm ${styles[event]}`}
    >
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
  const [selectedDate, setSelectedDate] = useState("This Year");
  const total = allRows.length;
  const rows = allRows.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-[#DCE9F9] mt-6">
      <div className="flex items-center justify-between p-4 pb-6">
        <div>
          <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
            Recents Transactions
          </h2>
          <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
            Latest fulfllments and recoveries
          </p>
        </div>
        <CalendarPopup
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-[#F3F4F6] bg-gray-50">
              {[
                "Event",
                "MSISDN",
                "Telco",
                "Amount",
                "Status",
                "Timestamp",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-3 text-left text-[13px] font-normal text-[#667085] whitespace-nowrap"
                >
                  {h} <SortIcon />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors text-[#667085]"
                >
                  <td className="px-3 py-3">
                    <EventBadge event={row.event} />
                  </td>
                  <td className="px-3 py-3 text-[#1F2937]">{row.msisdn}</td>
                  <td className="px-3 py-3 text-[#667085]">{row.telco}</td>
                  <td className="px-3 py-3 text-[#667085]">{row.amount}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-3 text-[#667085]">{row.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293H19a2 2 0 012 2v4a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="text-gray-500 text-sm font-ibm-plex-sans">
                      No recent transactions found
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-[#F3F4F6] text-[13px] text-[#667085]">
        <span>
          Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)}{" "}
          of {total} entries
        </span>
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border border-[#E5E7EB] rounded-md px-2 py-1 text-[13px] text-[#374151]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 rounded-md border border-[#E5E7EB] flex items-center justify-center disabled:opacity-40 hover:bg-[#F9FAFB]"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="w-7 h-7 rounded-md bg-[#4B47D6] text-white flex items-center justify-center text-[13px] font-medium">
            {page}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-7 h-7 rounded-md border border-[#E5E7EB] flex items-center justify-center disabled:opacity-40 hover:bg-[#F9FAFB]"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
