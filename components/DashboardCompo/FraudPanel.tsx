"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const fraudData = [
  { label: "Identity theft",        value: 48, color: "#4B47D6" },
  { label: "Multiple account abuse", value: 32, color: "#A89FF5" },
  { label: "Suspicious transactions",value: 15, color: "#F5A97F" },
  { label: "Device spoofing",        value:  5, color: "#4CBFFF" },
];

const totalAttempts = 1250;

export default function FraudPanel() {
  const chartData = {
    labels: fraudData.map((d) => d.label),
    datasets: [
      {
        data: fraudData.map((d) => d.value),
        backgroundColor: fraudData.map((d) => d.color),
        borderColor: "#ffffff",
        borderWidth: 3,
        borderRadius: 6,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#1F2937",
        bodyColor: "#6B7280",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
      {/* Header */}
      <h3 className="font-ibm-plex-sans text-[20px] font-medium text-[#1F2937] mb-1">
        Fraud Pannel
      </h3>
      <p className="font-mulish text-[15px] font-normal text-[#667085] mb-6">
        Tracks fraud attempts to keep the platform secure
      </p>

      <div className="flex items-center gap-10 flex-wrap">
        {/* Donut chart */}
        <div className="relative w-[270px] h-[270px] flex-shrink-0">
          <Doughnut data={chartData} options={options} />
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[32px] font-bold text-[#1F2937] leading-none">
              {totalAttempts.toLocaleString()}
            </span>
            <span className="text-[13px] text-[#667085] mt-1">
              Fraud attempts
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-[180px] divide-y divide-[#F3F4F6]">
          {fraudData.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[14px] font-normal text-[#667085] leading-snug">
                  {item.label}
                </span>
              </div>
              <span className="text-[16px] font-bold text-[#1F2937] ml-6">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}