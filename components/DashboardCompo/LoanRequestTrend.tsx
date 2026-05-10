"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { calender } from "@/constant";
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Plugin,
} from "chart.js";
import axiosInstance from "@/app/utils/axios";
import { DisbursementTrend, RecoveryTrend } from "@/app/utils/endpoint";

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const bgBarsPlugin: Plugin<"line"> = {
  id: "bgBars",
  beforeDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { left, right, top, bottom },
      scales: { x, y },
    } = chart;
    const barW = ((right - left) / months.length) * 0.38;
    ctx.save();
    months.forEach((_, i) => {
      const cx = x.getPixelForValue(i);
      const barH = (bottom - top) * 0.42;
      const bTop = bottom - barH;
      const grad = ctx.createLinearGradient(0, bTop, 0, bottom);
      grad.addColorStop(0, "rgba(139,128,249,0.12)");
      grad.addColorStop(1, "rgba(139,128,249,0.02)");
      ctx.fillStyle = grad;
      const r = 7;
      const bx = cx - barW / 2;
      ctx.beginPath();
      ctx.moveTo(bx + r, bTop);
      ctx.lineTo(bx + barW - r, bTop);
      ctx.quadraticCurveTo(bx + barW, bTop, bx + barW, bTop + r);
      ctx.lineTo(bx + barW, bottom);
      ctx.lineTo(bx, bottom);
      ctx.lineTo(bx, bTop + r);
      ctx.quadraticCurveTo(bx, bTop, bx + r, bTop);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  },
};

export default function LoanRequestTrend() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"line"> | null>(null);
  const [hovered, setHovered] = useState<"loan" | "recovery" | null>(null);
  const [loading, setLoading] = useState(true);
  const [disbursementData, setDisbursementData] = useState<any[]>([]);
  const [recoveryData, setRecoveryData] = useState<any[]>([]);

  useEffect(() => {
    fetchTrendData();
  }, []);

  const fetchTrendData = async () => {
    try {
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trend data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      plugins: [bgBarsPlugin],
      data: {
        labels: [],
        datasets: [
          {
            label: "Loan",
            data: [],
            borderColor: "#8B80F9",
            backgroundColor: "rgba(139,128,249,0.07)",
            borderWidth: 2.5,
            borderDash: [6, 5],
            pointRadius: [],
            pointHoverRadius: 6,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#8B80F9",
            pointBorderWidth: 2,
            tension: 0.45,
            fill: true,
          },
          {
            label: "Recovery",
            data: [],
            borderColor: "#4CBFFF",
            backgroundColor: "rgba(76,191,255,0)",
            borderWidth: 2.5,
            borderDash: [6, 5],
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#4CBFFF",
            pointBorderWidth: 2,
            tension: 0.45,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: -16,
          },
        },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#fff",
            titleColor: "#1F2937",
            bodyColor: "#6B7280",
            borderColor: "#E5E7EB",
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (ctx) =>
                ` ${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString() ?? 0}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              font: { size: 12 },
              color: "#9CA3AF",
              padding: 6,
              maxRotation: 0,
              autoSkip: false,
            },
          },
          y: {
            min: 0,
            max: 5500,
            grid: { color: "rgba(0,0,0,0.055)", drawTicks: false },
            border: { display: false, dash: [4, 4] },
            afterFit(scale) {
              scale.width = 60; // ← forces a fixed width for the y-axis label area
            },
            ticks: {
              font: { size: 11 },
              color: "#9CA3AF",
              padding: 16,
              maxTicksLimit: 6,
              callback: (v) => (Number(v) >= 1000 ? Number(v) / 1000 + "k" : v),
            },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, []);

  useEffect(() => {
    const c = chartRef.current;
    if (!c) return;
    const cols = ["#8B80F9", "#4CBFFF"];
    c.data.datasets.forEach((ds: any, i: number) => {
      const match =
        (hovered === "loan" && i === 0) || (hovered === "recovery" && i === 1);
      const dim = hovered !== null && !match;
      ds.borderColor = dim ? cols[i] + "44" : cols[i];
      ds.borderWidth = match ? 3 : dim ? 1 : 2.5;
    });
    c.update("none");
  }, [hovered]);

  if (loading) {
    return (
      <div className="bg-white rounded-sm p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
              Daily Loan vs Recovery Trend
            </h2>
            <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
              Compares outbound lending and inbound recoveries over time.
            </p>
          </div>
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-sm px-4 py-1.5 text-sm text-[#374151]">
            <Image src={calender} alt="calendar" width={16} height={16} />
            <span>This Year</span>
          </div>
        </div>

        {/* Chart */}
        <div style={{ height: "280px" }}>
          <canvas ref={canvasRef} />
        </div>

        {/* Legend — now below chart */}
        <div className="flex justify-center items-center gap-6 mt-4">
          {(["loan", "recovery"] as const).map((s) => (
            <div
              key={s}
              className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm text-[#667085] transition-opacity ${
                hovered !== null && hovered !== s ? "opacity-30" : ""
              }`}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: s === "loan" ? "#8B80F9" : "#4CBFFF" }}
              />
              <span className="capitalize">{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && disbursementData.length === 0 && recoveryData.length === 0) {
    return (
      <div className="bg-white rounded-sm p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
              Daily Loan vs Recovery Trend
            </h2>
            <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
              Compares outbound lending and inbound recoveries over time.
            </p>
          </div>
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-sm px-4 py-1.5 text-sm text-[#374151]">
            <Image src={calender} alt="calendar" width={16} height={16} />
            <span>This Year</span>
          </div>
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>

            <div className="text-gray-500 text-[16px] font-ibm-plex-sans font-normal mb-1">
              No Data Available
            </div>
            <div className="text-gray-400 font-ibm-plex-sans text-sm max-w-xs mx-auto">
              Loan and recovery data will appear here
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
            Daily Loan vs Recovery Trend
          </h2>
          <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
            Compares outbound lending and inbound recoveries over time.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-sm px-4 py-1.5 text-sm text-[#374151]">
          <Image src={calender} alt="calendar" width={16} height={16} />
          <span>This Year</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: "280px" }}>
        <canvas ref={canvasRef} />
      </div>

      {/* Legend — now below chart */}
      <div className="flex justify-center items-center gap-6 mt-4">
        {(["loan", "recovery"] as const).map((s) => (
          <div
            key={s}
            className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm text-[#667085] transition-opacity ${
              hovered !== null && hovered !== s ? "opacity-30" : ""
            }`}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: s === "loan" ? "#8B80F9" : "#4CBFFF" }}
            />
            <span className="capitalize">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
