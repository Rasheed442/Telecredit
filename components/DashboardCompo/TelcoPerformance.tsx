"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { calender } from "@/constant";
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Plugin,
} from "chart.js";
import axiosInstance from "@/app/utils/axios";
import { TelcoDistribution } from "@/app/utils/endpoint";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const BLUE = "#3B82F6";
const GREEN = "#027A48";

function createHatchPattern(
  ctx: CanvasRenderingContext2D,
  color: string,
): CanvasPattern | null {
  const size = 10;
  const offscreen = document.createElement("canvas");
  offscreen.width = size;
  offscreen.height = size;
  const octx = offscreen.getContext("2d")!;

  // Transparent background
  octx.clearRect(0, 0, size, size);

  // Draw diagonal slash lines (///)
  octx.strokeStyle = color;
  octx.lineWidth = 1.5;
  octx.globalAlpha = 0.55;

  octx.beginPath();
  octx.moveTo(0, size);
  octx.lineTo(size, 0);
  octx.stroke();

  octx.beginPath();
  octx.moveTo(-size, size);
  octx.lineTo(size, -size);
  octx.stroke();

  octx.beginPath();
  octx.moveTo(0, size * 2);
  octx.lineTo(size * 2, 0);
  octx.stroke();

  return ctx.createPattern(offscreen, "repeat");
}

function roundedTopRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  if (h < r) r = h;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Draws full-height ghost bars with hatch BEFORE the actual solid bars are drawn
const ghostHatchPlugin: Plugin<"bar"> = {
  id: "ghostHatch",
  beforeDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { bottom },
      scales: { y },
    } = chart;

    const maxY = y.getPixelForValue(y.max);
    const fullBarH = bottom - maxY;
    const r = 6;

    [0, 1].forEach((datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      const color = datasetIndex === 0 ? BLUE : GREEN;
      const hatchPattern = createHatchPattern(ctx, color);

      meta.data.forEach((bar: any) => {
        const { x: bx, width: bw } = bar.getProps(["x", "width"], true);
        const x0 = bx - bw / 2;

        ctx.save();

        // 1. Faint solid background (full height)
        ctx.fillStyle = color + "18";
        roundedTopRect(ctx, x0, maxY, bw, fullBarH, r);
        ctx.fill();

        // 2. Diagonal hatch overlay (full height)
        if (hatchPattern) {
          roundedTopRect(ctx, x0, maxY, bw, fullBarH, r);
          ctx.clip();
          ctx.fillStyle = hatchPattern;
          ctx.fillRect(x0, maxY, bw, fullBarH);
        }

        ctx.restore();
      });
    });
  },
};

export default function TelcoPerformance() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"bar"> | null>(null);
  const [hovered, setHovered] = useState<"outbound" | "inbound" | null>(null);
  const [telcoData, setTelcoData] = useState<any[]>([
    { telco: "MTN", disbursed: 35, recovered: 28 },
    { telco: "Airtel", disbursed: 28, recovered: 22 },
    { telco: "Glo", disbursed: 18, recovered: 15 },
    { telco: "9mobile", disbursed: 12, recovered: 9 },
    { telco: "Others", disbursed: 7, recovered: 5 },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTelcoData();
  }, []);

  const fetchTelcoData = async () => {
    try {
      setLoading(false);
    } catch (error) {
      console.error("Error fetching telco data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      plugins: [ghostHatchPlugin],
      data: {
        labels: ["MTN", "Airtel", "Glo", "9mobile", "Others"],
        datasets: [
          {
            label: "Disbursed",
            data: [35, 28, 18, 12, 7],
            backgroundColor: BLUE,
            borderWidth: 0,
            borderRadius: 6,
            barPercentage: 0.9,
          },
          {
            label: "Recovered",
            data: [28, 22, 15, 9, 5],
            backgroundColor: GREEN,
            borderWidth: 0,
            borderRadius: 6,
            barPercentage: 0.9,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y || 0}%`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              font: { size: 12, weight: 500 },
              color: "#374151",
              padding: 8,
            },
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: "rgba(0,0,0,0.055)", drawTicks: false },
            border: { display: false },
            ticks: {
              font: { size: 11 },
              color: "#9CA3AF",
              padding: 10,
              maxTicksLimit: 6,
              callback: (v) => `${v}%`,
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
    const cols = [BLUE, GREEN];
    c.data.datasets.forEach((ds: any, i: number) => {
      const match = hovered === "outbound" && i === 0;
      const dim = hovered !== null && !match;
      ds.backgroundColor = dim ? cols[i] + "55" : cols[i];
    });
    c.update("none");
  }, [hovered]);

  if (loading) {
    return (
      <div className="bg-white rounded-sm p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
              Telco Performance
            </h2>
            <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
              Telco Distribution Mix
            </p>
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

  if (!loading && telcoData.length === 0) {
    return (
      <div className="bg-white rounded-sm p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
              Telco Performance
            </h2>
            <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
              Telco Distribution Mix
            </p>
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
              No Data Available
            </div>
            <div className="text-gray-400 font-ibm-plex-sans text-sm max-w-xs mx-auto">
              Telco distribution data will appear here
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
            Telco Performance
          </h2>
          <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
            Telco Distribution Mix
          </p>
        </div>
        <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-sm px-4 py-1.5 text-sm text-[#374151]">
          <Image src={calender} alt="calendar" width={14} height={14} />
          <span>This Year</span>
        </div>
      </div>

      <div style={{ height: "250px" }}>
        <canvas ref={canvasRef} />
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: BLUE }}
          />
          <span className="text-sm text-[#374151]">Disbursed %</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: GREEN }}
          />
          <span className="text-sm text-[#374151]">Recovered %</span>
        </div>
      </div>
    </div>
  );
}
