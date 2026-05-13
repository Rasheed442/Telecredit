import SubMenu from "@/components/SubMenu";
import { airtel, glo, mobile, mtn } from "@/constant";
import Image from "next/image";
import React from "react";
import { IoMdArrowDown } from "react-icons/io";

// ── Types ──────────────────────────────────────────────────────────────────
interface TopBorrower {
  rank: number;
  phone: string;
  loans: number;
  amount: number;
  recovered: number;
}

interface RiskCustomer {
  rank: number;
  loanId: string;
  riskScore: number;
  exposure: number;
  defaultCount: number;
}

interface TelcoStat {
  name: string;
  logo: any;
  bgColor: string;
  totalLoans: number;
  recovered: number;
  recoveryRate: number;
}

// ── Static Data ────────────────────────────────────────────────────────────
const topBorrowers: TopBorrower[] = [
  { rank: 1, phone: "07012345678", loans: 18, amount: 5400, recovered: 96.3 },
  { rank: 2, phone: "08123456789", loans: 16, amount: 4800, recovered: 93.8 },
  { rank: 3, phone: "09087654321", loans: 14, amount: 4200, recovered: 97.6 },
];

const recoveryChampions: TopBorrower[] = [
  { rank: 1, phone: "07012345678", loans: 18, amount: 5400, recovered: 96.3 },
  { rank: 2, phone: "08123456789", loans: 16, amount: 4800, recovered: 93.8 },
  { rank: 3, phone: "09087654321", loans: 14, amount: 4200, recovered: 97.6 },
];

const riskCustomers: RiskCustomer[] = [
  {
    rank: 1,
    loanId: "07086022674",
    riskScore: 89,
    exposure: 100,
    defaultCount: 3,
  },
  {
    rank: 2,
    loanId: "08111222333",
    riskScore: 76,
    exposure: 300,
    defaultCount: 2,
  },
  {
    rank: 3,
    loanId: "09044455566",
    riskScore: 72,
    exposure: 10,
    defaultCount: 1,
  },
];

const telcoStats: TelcoStat[] = [
  {
    name: "MTN",
    logo: mtn,
    bgColor: "#FEF3C7",
    totalLoans: 450,
    recovered: 380,
    recoveryRate: 84.4,
  },
  {
    name: "Airtel",
    logo: airtel,
    bgColor: "#FEE2E2",
    totalLoans: 500,
    recovered: 290,
    recoveryRate: 60,
  },
  {
    name: "Glo",
    logo: glo,
    bgColor: "#D1FAE5",
    totalLoans: 500,
    recovered: 270,
    recoveryRate: 55,
  },
  {
    name: "9 Mobile",
    logo: mobile,
    bgColor: "#F3F4F6",
    totalLoans: 500,
    recovered: 190,
    recoveryRate: 49,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const rankColors: Record<number, string> = {
  1: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  2: "bg-blue-100 text-blue-600 border border-blue-200",
  3: "bg-orange-100 text-orange-600 border border-orange-200",
};

const fmt = (n: number) => `₦${n.toLocaleString()}`;

// ── Sub-components ─────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${rankColors[rank] ?? "bg-gray-100 text-gray-600"}`}
    >
      {rank}
    </span>
  );
}

function SortableTh({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-6 py-3">
      <button className="flex items-center gap-1 text-xs font-medium text-[#6B7280] font-ibm-plex-sans hover:text-[#374151]">
        {children}
        <IoMdArrowDown className="opacity-50" />
      </button>
    </th>
  );
}

function BorrowerCard({
  title,
  icon,
  data,
}: {
  title: string;
  icon: React.ReactNode;
  data: TopBorrower[];
}) {
  return (
    <div className="flex-1 min-w-0 bg-white rounded border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
      </div>
      <div className="space-y-3">
        {data.map((b) => (
          <div
            key={b.rank}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <RankBadge rank={b.rank} />
              <div>
                <p className="text-sm font-medium text-gray-800">{b.phone}</p>
                <p className="text-xs text-gray-400">{b.loans} loans</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium font-sf-pro text-gray-800">
                {fmt(b.amount)}
              </p>
              <p className="text-xs text-[#007A55] font-normal font-ibm-plex-sans">
                {b.recovered}% recovered
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TelcoCard({ stat }: { stat: TelcoStat }) {
  const barWidth = Math.min(stat.recoveryRate, 100);
  return (
    <div className="flex-1 min-w-[160px] bg-white rounded-sm border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Image src={stat.logo} alt="" width={30} height={30} />
        <span className="font-semibold text-gray-800 text-sm">{stat.name}</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Total Loans:</span>
          <span className="font-semibold text-gray-800">{stat.totalLoans}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Recovered:</span>
          <span className="font-semibold text-emerald-500">
            {stat.recovered}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Recovery Rate:</span>
          <span className="font-semibold text-gray-800">
            {stat.recoveryRate}%
          </span>
        </div>
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-4">
      <SubMenu
        title="Analytics & Leaderboards"
        subtitle="Performance metrics and customer insights."
      />

      {/* Top Borrowers + Recovery Champions */}
      <div className="flex flex-col lg:flex-row gap-3 ">
        <BorrowerCard
          title="Top Borrowers"
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99996 14.166C8.60529 14.166 7.39138 15.2202 6.76468 16.7753C6.46534 17.5181 6.89487 18.3327 7.4656 18.3327H12.5343C13.105 18.3327 13.5345 17.5181 13.2352 16.7753C12.6085 15.2202 11.3946 14.166 9.99996 14.166Z"
                stroke="#5490DE"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
              <path
                d="M15.4167 4.16602H16.4185C17.4193 4.16602 17.9196 4.16602 18.1807 4.48048C18.4417 4.79495 18.3332 5.26696 18.1161 6.21097L17.7905 7.62691C17.3008 9.75652 15.5091 11.34 13.3334 11.666"
                stroke="#5490DE"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.58329 4.16602H3.58145C2.58073 4.16602 2.08037 4.16602 1.81933 4.48048C1.55829 4.79495 1.66683 5.26696 1.88392 6.21097L2.20953 7.62691C2.69924 9.75652 4.49089 11.34 6.66663 11.666"
                stroke="#5490DE"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 14.166C12.5174 14.166 14.6375 10.2809 15.2748 4.99176C15.451 3.529 15.5392 2.79762 15.0724 2.23182C14.6056 1.66602 13.852 1.66602 12.3445 1.66602H7.65552C6.14817 1.66602 5.39448 1.66602 4.92768 2.23182C4.46088 2.79762 4.549 3.529 4.72525 4.99176C5.36254 10.2809 7.48273 14.166 10 14.166Z"
                stroke="#5490DE"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
          }
          data={topBorrowers}
        />
        <BorrowerCard
          title="Recovery Champion"
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 11.668L5.83333 8.33465C6.5688 7.59916 6.93654 7.23143 7.38786 7.19078C7.46247 7.18405 7.53753 7.18405 7.61214 7.19078C8.06346 7.23143 8.43117 7.59916 9.16667 8.33465C9.90217 9.07007 10.2698 9.43782 10.7212 9.47849C10.7958 9.48524 10.8708 9.48524 10.9455 9.47849C11.3968 9.43782 11.7645 9.07007 12.5 8.33465L16.6667 4.16797M13.3333 12.5013L16.6667 15.8347"
                stroke="#5490DE"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.3334 16.4381C13.3334 16.4381 16.7509 16.9567 17.2695 16.4381C17.7882 15.9195 17.2695 12.502 17.2695 12.502"
                stroke="#5490DE"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.3334 3.56447C13.3334 3.56447 16.7509 3.04587 17.2695 3.56449C17.7882 4.08312 17.2695 7.50065 17.2695 7.50065"
                stroke="#5490DE"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          data={recoveryChampions}
        />
      </div>

      {/* Highest Risk & Default Customers */}
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-base">
            Highest Risk &amp; Default Customers
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[#F3F4F6]">
              <SortableTh>Rank</SortableTh>
              <SortableTh>Loan ID</SortableTh>
              <SortableTh>Risk Score</SortableTh>
              <SortableTh>Exposure</SortableTh>
              <SortableTh>Default Count</SortableTh>
            </tr>
          </thead>
          <tbody>
            {riskCustomers.map((c) => (
              <tr
                key={c.rank}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <RankBadge rank={c.rank} />
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {c.loanId}
                </td>
                <td className="px-6 py-4 text-gray-700">{c.riskScore}</td>
                <td className="px-6 py-4 text-gray-700">{fmt(c.exposure)}</td>
                <td className="px-6 py-4 text-gray-700">{c.defaultCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Telco Performance */}
      <div>
        <h3 className="font-semibold text-gray-800 text-base mb-4">
          Telco Performance
        </h3>
        <div className="flex flex-col lg:flex-row md:flex-row flex-wrap  gap-4">
          {telcoStats.map((s) => (
            <TelcoCard key={s.name} stat={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
