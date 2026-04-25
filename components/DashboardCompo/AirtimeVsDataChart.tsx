"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Airtime Loan", value: 12, fill: "#9E97FF" },
  { name: "Data Loan", value: 120, fill: "#4CBFFF" },
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx, cy, midAngle, outerRadius, name, value,
}: any) => {
  // Push the label anchor point well outside the arc
  const labelRadius = outerRadius * 1.45;
  const lx = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const ly = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  // Line starts near the arc edge
  const lineStartRadius = outerRadius * 1.05;
  const sx = cx + lineStartRadius * Math.cos(-midAngle * RADIAN);
  const sy = cy + lineStartRadius * Math.sin(-midAngle * RADIAN);

  // Mid-bend point
  const midRadius = outerRadius * 1.25;
  const mx = cx + midRadius * Math.cos(-midAngle * RADIAN);
  const my = cy + midRadius * Math.sin(-midAngle * RADIAN);

  const isRight = lx > cx;
  const textAnchor = isRight ? "start" : "end";
  const labelText = `${value}k ${name.toLowerCase()}`;
  const words = labelText.split(" ");

  return (
    <g>
      {/* Callout line: arc edge → bend → label */}
      <path
        d={`M${sx},${sy} L${mx},${my} L${lx},${ly}`}
        fill="none"
        stroke="#9CA3AF"
        strokeWidth={0.8}
      />
      {/* Two-line label */}
      <text
        x={lx + (isRight ? 4 : -4)}
        y={ly - 8}
        textAnchor={textAnchor}
        fill="#374151"
        fontSize={11}
        fontFamily="sans-serif"
      >
        {`${value}k ${name.split(" ")[0].toLowerCase()} loan`}
      </text>
      <text
        x={lx + (isRight ? 4 : -4)}
        y={ly + 6}
        textAnchor={textAnchor}
        fill="#374151"
        fontSize={11}
        fontFamily="sans-serif"
      >
        requested.
      </text>
    </g>
  );
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex justify-center gap-8 mt-2">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[14px] text-[#1F2937] font-ibm-plex-sans">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const AirtimeVsDataChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
      <h3 className="font-ibm-plex-sans text-[20px] font-medium text-[#1F2937] mb-1">
        Airtime Vs Data
      </h3>
      <p className="font-mulish text-[14px] text-[#667085] mb-4">
        Shows the distribution of loans between airtime &amp; data
      </p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
              cornerRadius={6}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AirtimeVsDataChart;