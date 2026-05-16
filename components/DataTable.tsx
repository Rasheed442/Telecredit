import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IoMdArrowDown } from "react-icons/io";

// ── Types ──────────────────────────────────────────────────────────────
export type Aging = string;
export type FraudRisk = "Low" | "Medium" | "High";

export interface LoanRow {
  loanId: string;
  msisdn: string;
  telco: string;
  amount: string;
  outstanding: string;
  recovered: string;
  aging: Aging;
  fraudRisk: FraudRisk;
  score: number;
  created: string;
  status?: string;
  closed?: boolean;
  delinquent?: boolean;
}

export interface TableColumn {
  key: keyof LoanRow | "action";
  label: string;
  sortable?: boolean;
  render?: (row: LoanRow) => React.ReactNode;
}

export interface DataTableProps {
  data: LoanRow[];
  columns?: TableColumn[];
  searchable?: boolean;
  searchPlaceholder?: string;
  paginated?: boolean;
  itemsPerPage?: number;
  serverPagination?: boolean;
  totalElements?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: LoanRow) => void;
  onActionClick?: (row: LoanRow) => void;
  actionLabel?: string;
  className?: string;
}

// ── Badge helpers ──────────────────────────────────────────────────────
const agingStyles: Record<string, string> = {
  "DP 0": "bg-green-50  text-green-700  border border-green-200",
  "DP 1-7": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "DP 8-30": "bg-orange-50 text-orange-600 border border-orange-200",
  "DP 17": "bg-orange-50 text-orange-600 border border-orange-200",
  "DP 31": "bg-red-50    text-red-600    border border-red-200",
  "DP 31+": "bg-red-50    text-red-600    border border-red-200",
};

const riskStyles: Record<FraudRisk, string> = {
  Low: "bg-green-50  text-green-700 border border-green-200",
  Medium: "bg-orange-50 text-orange-600 border border-orange-200",
  High: "bg-red-50    text-red-600    border border-red-200",
};

// Default columns configuration
const defaultColumns: TableColumn[] = [
  { key: "loanId", label: "Loan ID", sortable: true },
  { key: "msisdn", label: "MSISDN", sortable: true },
  { key: "telco", label: "Telco" },
  { key: "amount", label: "Amount" },
  { key: "outstanding", label: "Outstanding" },
  { key: "recovered", label: "Recovered" },
  {
    key: "aging",
    label: "Aging",
    render: (row) => (
      <span
        className={`text-[12px] font-medium px-2.5 py-1   ${
          agingStyles[row.aging] ??
          "bg-gray-50 text-gray-600 border border-gray-200"
        }`}
      >
        {row.aging}
      </span>
    ),
  },
  {
    key: "fraudRisk",
    label: "Fraud Risk",
    render: (row) => (
      <span
        className={`text-[12px] font-medium px-2.5 py-1  ${riskStyles[row.fraudRisk]}`}
      >
        {row.fraudRisk}
      </span>
    ),
  },
  { key: "score", label: "Score" },
  { key: "created", label: "Created" },
  { key: "action", label: "Action" },
];

export default function DataTable({
  data,
  columns = defaultColumns,
  searchable = true,
  searchPlaceholder = "Search MSISDN",
  paginated = true,
  itemsPerPage = 10,
  serverPagination = false,
  totalElements,
  currentPage = 1,
  onPageChange,
  onRowClick,
  onActionClick,
  actionLabel = "View",
  className = "",
}: DataTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter data based on search
  const filtered = data.filter(
    (row) =>
      row.msisdn.includes(search) ||
      row.loanId.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort data
  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn as keyof LoanRow] ?? "";
    const bValue = b[sortColumn as keyof LoanRow] ?? "";

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const activePage = serverPagination ? currentPage : page;
  const totalPages = serverPagination && totalElements !== undefined
    ? Math.ceil(totalElements / itemsPerPage)
    : Math.ceil(sorted.length / itemsPerPage);

  const paginatedData = serverPagination
    ? sorted
    : paginated
      ? sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage)
      : sorted;

  const handlePageChange = (newPage: number) => {
    if (serverPagination) {
      onPageChange?.(newPage);
    } else {
      setPage(newPage);
    }
  };

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const renderCell = (column: TableColumn, row: LoanRow) => {
    if (column.render) {
      return column.render(row);
    }

    if (column.key === "action") {
      return (
        <button
          className="text-[13px] font-medium text-[#2563EB] hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onActionClick?.(row);
          }}
        >
          {actionLabel}
        </button>
      );
    }

    return row[column.key as keyof LoanRow];
  };

  return (
    <div
      className={`bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden ${className}`}
    >
      {/* Search */}
      {searchable && (
        <div className="px-5 py-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-3 h-10 flex-1 max-w-85">
            <div className="w-4 h-4 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="flex-1 text-[13px] text-[#374151] outline-none placeholder:text-[#9CA3AF] bg-transparent"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-[#F3F4F6] bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSort(column.key as string)}
                      className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]"
                    >
                      {column.label}
                      <div className="flex flex-col">
                        <IoMdArrowDown className="inline ml-1 opacity-50" />
                      </div>
                    </button>
                    {/* {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.key as string)}
                        className="flex items-center gap-1 hover:text-[#374151]"
                      >
                        {column.label}
                        <div className="flex flex-col">
                         <IoMdArrowDown className="inline ml-1 opacity-50" />
                        </div>
                      </button>
                    ) : (
                      column.label
                    )} */}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={`${row.loanId}-${index}`}
                  className={`border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key as string}
                      className="px-5 py-4 text-[13px] font-ibm-plex-sans text-[#374151] whitespace-nowrap"
                    >
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-gray-500"
                >
                  No loans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex justify-between items-center px-5 py-4 border-t border-[#F3F4F6]">
          <button
            onClick={() => handlePageChange(Math.max(1, activePage - 1))}
            disabled={activePage === 1}
            className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 text-[13px] text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={14} />
            Previous
          </button>
          <span className="text-[13px] text-[#6B7280]">
            Page {activePage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, activePage + 1))}
            disabled={activePage >= totalPages}
            className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-4 py-2 text-[13px] text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-40 transition-colors"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
