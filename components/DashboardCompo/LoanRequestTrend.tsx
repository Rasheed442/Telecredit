"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { calender } from "@/constant";
import {
  Chart,
  LineElement, PointElement, LineController,
  CategoryScale, LinearScale, Filler, Tooltip,
  Plugin,
} from "chart.js";

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Filler, Tooltip);

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const airtime = [2000,2600,3000,2400,2200,3300,3700,4200,4800,4100,3300,3300];
const dataLoan = [1400,1400,1400,2400,2800,1800,1300,2000,2800,2400,1800,1800];
const HIGHLIGHT_IDX = 8; // Sep

const bgBarsPlugin: Plugin<"line"> = {
  id: "bgBars",
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
    const barW = ((right - left) / months.length) * 0.38;
    ctx.save();
    months.forEach((_, i) => {
      const cx = x.getPixelForValue(i);
      const isHl = i === HIGHLIGHT_IDX;
      const barH = isHl ? (bottom - top) * 0.72 : (bottom - top) * 0.42;
      const bTop = bottom - barH;
      const grad = ctx.createLinearGradient(0, bTop, 0, bottom);
      grad.addColorStop(0, isHl ? "rgba(139,128,249,0.22)" : "rgba(139,128,249,0.12)");
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
  const [hovered, setHovered] = useState<"airtime" | "data" | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      plugins: [bgBarsPlugin],
      data: {
        labels: months,
        datasets: [
          {
            label: "Airtime loan",
            data: airtime,
            borderColor: "#8B80F9",
            backgroundColor: "rgba(139,128,249,0.07)",
            borderWidth: 2.5,
            borderDash: [6, 5],
            pointRadius: airtime.map((_, i) => (i === HIGHLIGHT_IDX ? 7 : 0)),
            pointHoverRadius: 6,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#8B80F9",
            pointBorderWidth: 2,
            tension: 0.45,
            fill: true,
          },
          {
            label: "Data loan",
            data: dataLoan,
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
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString() ?? 0}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 12 }, color: "#9CA3AF", padding: 6, maxRotation: 0, autoSkip: false },
          },
          y: {
            min: 0,
            max: 5500,
            grid: { color: "rgba(0,0,0,0.055)", drawTicks: false },
            border: { display: false, dash: [4, 4] },
            ticks: {
              font: { size: 11 },
              color: "#9CA3AF",
              padding: 10,
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
    c.data.datasets.forEach((ds, i) => {
      const match = (hovered === "airtime" && i === 0) || (hovered === "data" && i === 1);
      const dim = hovered !== null && !match;
      (ds as any).borderColor = dim ? cols[i] + "44" : cols[i];
      (ds as any).borderWidth = match ? 3 : dim ? 1 : 2.5;
    });
    c.update("none");
  }, [hovered]);

  return (
    <div className="bg-white rounded-sm p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-ibm-plex-sans text-[20px] font-medium text-[#1F2937] mb-1">Daily Loan vs Recovery Trend</h2>
          <p className="text-sm text-[#667085]">This shows daily loan requests and recovery trends.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["airtime", "data"] as const).map((s) => (
            <div
              key={s}
              className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm text-[#667085] transition-opacity ${hovered !== null && hovered !== s ? "opacity-30" : ""}`}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${s === "airtime" ? "bg-[#8B80F9]" : "bg-[#4CBFFF]"}`} />
              {s === "airtime" ? "Airtime Loan" : "Data Loan"}
            </div>
          ))}
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-full px-4 py-1.5 text-sm text-[#374151]">
            <Image src={calender} alt="calendar" width={14} height={14} />
            <span>This Year</span>
          </div>
        </div>
      </div>

      <div style={{ height: "280px" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}