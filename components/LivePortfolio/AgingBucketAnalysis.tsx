"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Image from "next/image";
import { calender } from "@/constant";

// ── Types ──────────────────────────────────────────────────────────────
interface AgingBucketData {
  name: string;
  value: number;
  percentage: number;
  fill: string;
}

// ── Color Mapping ──────────────────────────────────────────────────────
const colorMap: Record<string, string> = {
  CURRENT: "#10B981",
  DPD_1_30: "#3B82F6",
  DPD_31_60: "#F59E0B",
  DPD_61_90: "#EF4444",
  DPD_91_PLUS: "#991B1B",
};

const formatLabel = (label: string): string => {
  const labelMap: Record<string, string> = {
    CURRENT: "Current",
    DPD_1_30: "DPD 1-30",
    DPD_31_60: "DPD 31-60",
    DPD_61_90: "DPD 61-90",
    DPD_91_PLUS: "DPD 91+",
  };
  return labelMap[label] || label;
};

// ── Custom Label Component ──────────────────────────────────────────────
const renderLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percentage } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percentage < 5) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-[12px] font-semibold font-sf-pro"
    >
      {`${percentage}%`}
    </text>
  );
};

// ── Custom Legend Component ──────────────────────────────────────────────
const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex justify-center gap-6 mt-6 flex-wrap">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[13px] text-[#374151] font-sans">
            {entry.value} ({entry.payload.percentage}%)
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AgingBucketAnalysis() {
  const [data, setData] = useState<AgingBucketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLoans, setTotalLoans] = useState(0);

  useEffect(() => {
    fetchAgingData();
  }, []);

  const fetchAgingData = async () => {
    try {
      setLoading(false);

      // Dummy data for aging bucket analysis
      const dummyData: AgingBucketData[] = [
        { name: "Current", value: 342, percentage: 63, fill: "#10B981" },
        { name: "DPD 1-30", value: 89, percentage: 16, fill: "#3B82F6" },
        { name: "DPD 31-60", value: 67, percentage: 12, fill: "#F59E0B" },
        { name: "DPD 61-90", value: 34, percentage: 6, fill: "#EF4444" },
        { name: "DPD 91+", value: 10, percentage: 3, fill: "#991B1B" },
      ];

      const total = dummyData.reduce((sum, item) => sum + item.value, 0);
      setTotalLoans(total);
      setData(dummyData);
    } catch (error) {
      console.error("Error fetching aging data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-sm p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
              Aging Bucket Analysis
            </h2>
            <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
              Portfolio distribution across delinquency stages.
            </p>
          </div>
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-sm px-4 py-1.5 text-sm text-[#374151]">
            <Image src={calender} alt="calendar" width={14} height={14} />
            <span>This Year</span>
          </div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ height: "300px" }}
        >
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-sm p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
              Aging Bucket Analysis
            </h2>
            <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
              Portfolio distribution across delinquency stages.
            </p>
          </div>
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-sm px-4 py-1.5 text-sm text-[#374151]">
            <Image src={calender} alt="calendar" width={14} height={14} />
            <span>This Year</span>
          </div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ height: "300px" }}
        >
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-gray-500 text-[16px] font-ibm-plex-sans font-normal mb-1">
              No Aging Data Available
            </div>
            <div className="text-gray-400 font-ibm-plex-sans text-sm max-w-xs mx-auto">
              Aging bucket distribution data will appear here
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
            Aging Bucket Analysis
          </h2>
          <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
            Portfolio distribution across delinquency stages.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-sm px-4 py-1.5 text-sm text-[#374151]">
          <Image src={calender} alt="calendar" width={14} height={14} />
          <span>This Year</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-sm p-3">
          <div className="text-green-700 text-[12px] font-ibm-plex-sans mb-1">
            Current
          </div>
          <div className="text-green-900 text-[20px] font-semibold font-sf-pro">
            {data.find((d) => d.name === "Current")?.value || 0}
          </div>
          <div className="text-green-600 text-[11px] font-ibm-plex-sans">
            {data.find((d) => d.name === "Current")?.percentage || 0}%
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
          <div className="text-blue-700 text-[12px] font-ibm-plex-sans mb-1">
            DPD 1-30
          </div>
          <div className="text-blue-900 text-[20px] font-semibold font-sf-pro">
            {data.find((d) => d.name === "DPD 1-30")?.value || 0}
          </div>
          <div className="text-blue-600 text-[11px] font-ibm-plex-sans">
            {data.find((d) => d.name === "DPD 1-30")?.percentage || 0}%
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-3">
          <div className="text-yellow-700 text-[12px] font-ibm-plex-sans mb-1">
            DPD 31-90
          </div>
          <div className="text-yellow-900 text-[20px] font-semibold font-sf-pro">
            {(data.find((d) => d.name === "DPD 31-60")?.value || 0) +
              (data.find((d) => d.name === "DPD 61-90")?.value || 0)}
          </div>
          <div className="text-yellow-600 text-[11px] font-ibm-plex-sans">
            {(data.find((d) => d.name === "DPD 31-60")?.percentage || 0) +
              (data.find((d) => d.name === "DPD 61-90")?.percentage || 0)}
            %
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-sm p-3">
          <div className="text-red-700 text-[12px] font-ibm-plex-sans mb-1">
            DPD 91+
          </div>
          <div className="text-red-900 text-[20px] font-semibold font-sf-pro">
            {data.find((d) => d.name === "DPD 91+")?.value || 0}
          </div>
          <div className="text-red-600 text-[11px] font-ibm-plex-sans">
            {data.find((d) => d.name === "DPD 91+")?.percentage || 0}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [
                `${typeof value === "number" ? value : Number(value) || 0} loans`,
                name || "Unknown",
              ]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                padding: "10px",
              }}
            />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Total Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-[14px] text-gray-600 font-ibm-plex-sans">
            Total Loans Analyzed
          </div>
          <div className="text-[18px] font-semibold text-gray-900 font-sf-pro">
            {totalLoans.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
