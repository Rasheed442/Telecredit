"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import axiosInstance from "@/app/utils/axios";
import { AgingDistribution } from "@/app/utils/endpoint";

const colorMap: { [key: string]: string } = {
  CURRENT: "#027A48",
  DPD_0: "#027A48",
  DPD_1_7: "#175CD3",
  DPD_8_30: "#D76603",
  DPD_31_PLUS: "#B42318",
};

const formatLabel = (label: string) => {
  return label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const RADIAN = Math.PI / 180;

const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  // Don't render text if the slice is too small to fit the label
  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
      fontFamily="sans-serif"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex justify-center gap-6 mt-3 flex-wrap">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[13px] text-[#374151] font-sans">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const AgingBucketChart = () => {
  const [data, setData] = useState<any[]>([
    { name: "Current", value: 58, fill: "#10B981" },
    { name: "DPD 1-30", value: 25, fill: "#3B82F6" },
    { name: "DPD 31+", value: 17, fill: "#EF4444" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgingData();
  }, []);

  const fetchAgingData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axiosInstance.get(AgingDistribution, { headers });
      
      const apiData = response.data?.data?.series || response.data?.series || response.data;
      
      if (!Array.isArray(apiData)) {
        throw new Error("Invalid API response structure");
      }

      // Transform API data to chart format
      const chartData = apiData.map((item: any) => ({
        name: formatLabel(item.label),
        value: item.value,
        fill: colorMap[item.label] || "#666666",
      }));

      setData(chartData);
    } catch (error) {
      console.error("Error fetching aging data:", error);
      // Set fallback data on error
      setData([
        { name: "DPD 0", value: 40, fill: "#175CD3" },
        { name: "DPD 1-7", value: 30, fill: "#B42318" },
        { name: "DPD 8-30", value: 20, fill: "#D76603" },
        { name: "DPD 31+", value: 10, fill: "#027A48" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-sm p-6 shadow-sm h-full">
        <div>
          <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
            Portfolio by Aging Bucket
          </h2>
          <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
            Loan exposure across delinquency stages.
          </p>
        </div>
        <div className="h-82 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="bg-white rounded-sm p-8 shadow-sm h-full">
        <div>
          <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
            Portfolio by Aging Bucket
          </h2>
          <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
            Loan exposure across delinquency stages.
          </p>
        </div>
        <div className="h-82 flex items-center justify-center">
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
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-gray-500 text-[16px] font-ibm-plex-sans font-normal mb-1">
              No Data Available
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
    <div className="bg-white rounded-sm p-6 shadow-sm h-full">
      <div>
        <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
          Portfolio by Aging Bucket
        </h2>
        <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
          Loan exposure across delinquency stages.
        </p>
      </div>

      <div className="h-82 relative">
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center" style={{ marginTop: "-24px" }}>
            <p className="text-[15px] font-bold text-[#1F2937] leading-snug">
              Aging
            </p>
            <p className="text-[15px] font-bold text-[#1F2937] leading-snug">
              Bucket
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="52%"
              outerRadius="78%"
              paddingAngle={3}
              dataKey="value"
              cornerRadius={0}
              labelLine={false}
              label={renderLabel}
              stroke="none"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={index} fill={entry.fill} stroke="none" />
              ))}
            </Pie>
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AgingBucketChart;
