"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "DPD 0",    value: 30, fill: "#027A48" }, // wide
  { name: "DPD 1-7",  value: 30, fill: "#175CD3" }, // wide
  { name: "DPD 8-30", value: 15, fill: "#D76603" }, // narrow
  { name: "DPD 31+",  value: 25, fill: "#B42318" }, // medium
];

const RADIAN = Math.PI / 180;

const renderLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, value,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
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
      {`${value}%`}
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
  return (
    <div className="bg-white rounded-sm p-6 shadow-sm h-full">
      <h3 className="text-[18px] font-bold text-[#1F2937] mb-1">
        Portfolio by Aging Bucket
      </h3>
      <p className="text-[13px] text-[#667085] ">
        Loan exposure across delinquency stages.
      </p>

      <div className="h-82 relative">
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center" style={{ marginTop: "-24px" }}>
            <p className="text-[15px] font-bold text-[#1F2937] leading-snug">Aging</p>
            <p className="text-[15px] font-bold text-[#1F2937] leading-snug">Bucket</p>
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
  cornerRadius={0}   // ← remove rounding so arc length difference is visible
  labelLine={false}
  label={renderLabel}
  stroke="none"
>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.fill}
                  stroke="none"  // ← this removes the gray ring
                />
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