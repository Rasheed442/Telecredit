"use client";

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Filler,
  Tooltip,
  Legend,
  Plugin,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Image from "next/image";
import { calender } from "@/constant";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Filler,
  Tooltip,
  Legend,
);

// ── Crosshatch Pattern ────────────────────────────────────────────────────────
const createHatchPattern = (ctx: CanvasRenderingContext2D, color: string) => {
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = 8;
  patternCanvas.height = 8;
  const patternCtx = patternCanvas.getContext("2d");
  if (!patternCtx) return null;
  patternCtx.strokeStyle = color + "40";
  patternCtx.lineWidth = 1;
  patternCtx.beginPath();
  patternCtx.moveTo(0, 8);
  patternCtx.lineTo(8, 0);
  patternCtx.stroke();
  return ctx.createPattern(patternCanvas, "repeat");
};

// ── Rounded Top Rect ──────────────────────────────────────────────────────────
const roundedTopRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

// ── Crosshatch Plugin ─────────────────────────────────────────────────────────
const bgBarsPlugin: Plugin<"bar"> = {
  id: "bgBars",
  beforeDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { bottom },
      scales: { y },
    } = chart;

    const meta0 = chart.getDatasetMeta(0);
    const maxY = y.getPixelForValue(1000);
    const barH = bottom - maxY;
    const r = 6;
    const greenHatch = createHatchPattern(ctx, "#027A48");

    ctx.save();

    meta0.data.forEach((bar: any) => {
      const { x: bx, width: bw } = bar.getProps(["x", "width"], true);
      const x0 = bx - bw / 2;

      ctx.fillStyle = "#027A4812";
      roundedTopRect(ctx, x0, maxY, bw, barH, r);
      ctx.fill();

      if (greenHatch) {
        ctx.fillStyle = greenHatch;
        roundedTopRect(ctx, x0, maxY, bw, barH, r);
        ctx.fill();
      }
    });

    ctx.restore();
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface DPDItem {
  category: string;
  count: number;
  amount: number;
  recovered: number;
}

// ── Format Naira ──────────────────────────────────────────────────────────────
const formatNaira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function DPDAnalysisChart() {
  const [dpdData, setDpdData] = useState<DPDItem[]>([
    { category: "DPD 0", count: 33, amount: 25599, recovered: 480 },
    { category: "DPD 1-7", count: 33, amount: 25599, recovered: 150 },
    { category: "DPD 8-30", count: 23, amount: 25599, recovered: 560 },
    { category: "DPD 31+", count: 31, amount: 25599, recovered: 320 },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDPDData();
  }, []);

  const fetchDPDData = async () => {
    try {
      setLoading(false);
    } catch (error) {
      console.error("Error fetching DPD data:", error);
      setLoading(false);
    }
  };

  // ── Chart Data ──────────────────────────────────────────────────────────────
  const chartData = {
    labels: dpdData.map((item) => item.category),
    datasets: [
      {
        label: "Recovered",
        data: dpdData.map((item) => item.recovered),
        backgroundColor: "#027A48",
        borderWidth: 0,
        borderRadius: 6,
        barPercentage: 0.5,
        categoryPercentage: 0.6,
      },
    ],
  };

  // ── Chart Options ───────────────────────────────────────────────────────────
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
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
          label: (ctx: any) =>
            ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { size: 12, weight: 500 as const },
          color: "#374151",
          padding: 8,
        },
      },
      y: {
        min: 0,
        max: 1000,
        grid: { color: "rgba(0,0,0,0.055)", drawTicks: false },
        border: { display: false },
        ticks: {
          font: { size: 11 },
          color: "#9CA3AF",
          padding: 10,
          maxTicksLimit: 6,
          callback: (v: any) => v,
        },
      },
    },
  };

  // ── Header ──────────────────────────────────────────────────────────────────
  const Header = () => (
    <div className="flex justify-between items-center gap-2 lg:items-start mb-6">
      <div>
        <h2 className="font-sf-pro text-[15px] lg:text-[20px] font-semibold text-[#1F2937] mb-1">
          Telco Performance
        </h2>
        <p className="text-[12px] lg:text-[14px] md:text-[14px] text-[#667085] font-ibm-plex-sans">
          Compares outbound lending and inbound recoveries over time.
        </p>
      </div>
      <div className="flex items-center justify-center gap-1 lg:gap-2 border border-[#E5E7EB] rounded-sm w-25 lg:w-30 cursor-pointer  lg:px-4 px-1 py-2 lg:py-1.5 text-sm text-[#374151]">
        <Image src={calender} alt="calendar" width={14} height={14} />
        <span className="font-ibm-plex-sans text-[10px] lg:text-[14px]">
          This year
        </span>
      </div>
    </div>
  );

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-sm p-6 shadow-sm">
        <Header />
        <div
          className="flex items-center justify-center"
          style={{ height: "300px" }}
        >
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // ── Empty State ─────────────────────────────────────────────────────────────
  if (!loading && dpdData.length === 0) {
    return (
      <div className="bg-white rounded-sm p-8 shadow-sm">
        <Header />
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
              No Data Available
            </div>
            <div className="text-gray-400 font-ibm-plex-sans text-sm max-w-xs mx-auto">
              DPD distribution data will appear here
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Render ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-sm p-6 shadow-sm">
      <Header />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dpdData.map((item) => (
          <div
            key={item.category}
            className="bg-white border border-gray-200 rounded-sm p-4"
          >
            <div className="text-gray-500 text-[13px] font-ibm-plex-sans mb-3">
              {item.category}
            </div>
            <div className="text-gray-900 text-[28px] font-semibold font-sf-pro leading-none mb-2">
              {item.count}
            </div>
            <div className="text-gray-500 text-[13px] font-ibm-plex-sans">
              {formatNaira(item.amount)}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: "280px" }}>
        <Bar data={chartData} options={chartOptions} plugins={[bgBarsPlugin]} />
      </div>
    </div>
  );
}
