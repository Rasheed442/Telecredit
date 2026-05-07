"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { calender } from "@/constant";
import {
  Chart,
  BarElement, BarController, CategoryScale, LinearScale, Tooltip,
  Plugin,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const telcos = ["MTN", "AIRTEL", "GLO", "9MOBILE"];
const outboundData = [45000, 38000, 28000, 22000];
const inboundData  = [42000, 35000, 26000, 20000];
const MAX = 50000;

const BLUE  = "#1447E6";
const GREEN = "#027A48";

function createHatchPattern(
  ctx: CanvasRenderingContext2D,
  color: string
): CanvasPattern | null {
  const size = 8;
  const offscreen = document.createElement("canvas");
  offscreen.width  = size;
  offscreen.height = size;
  const octx = offscreen.getContext("2d")!;
  octx.clearRect(0, 0, size, size);
  octx.strokeStyle = color;
  octx.lineWidth   = 1.2;
  octx.globalAlpha = 0.35;
  // Diagonal line from top-right to bottom-left
  octx.beginPath();
  octx.moveTo(0, size);
  octx.lineTo(size, 0);
  octx.stroke();
  // Repeat tile edges to fill seamlessly
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
  x: number, y: number,
  w: number, h: number,
  r: number
) {
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

const bgBarsPlugin: Plugin<"bar"> = {
  id: "bgBars",
  beforeDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { bottom },
      scales: { y },
    } = chart;

    const meta0 = chart.getDatasetMeta(0);
    const meta1 = chart.getDatasetMeta(1);
    const maxY  = y.getPixelForValue(MAX);
    const barH  = bottom - maxY;
    const r     = 6;

    const blueHatch  = createHatchPattern(ctx, BLUE);
    const greenHatch = createHatchPattern(ctx, GREEN);

    ctx.save();

    meta0.data.forEach((bar: any, i) => {
      // — Outbound faded bg —
      const { x: bx, width: bw } = bar.getProps(["x", "width"], true);
      const x0 = bx - bw / 2;

      // Solid faint fill
      ctx.fillStyle = BLUE + "18";
      roundedTopRect(ctx, x0, maxY, bw, barH, r);
      ctx.fill();

      // Hatch overlay
      if (blueHatch) {
        ctx.fillStyle = blueHatch;
        roundedTopRect(ctx, x0, maxY, bw, barH, r);
        ctx.fill();
      }

      // — Inbound faded bg —
      const bar1 = meta1.data[i];
      const { x: bx1, width: bw1 } = bar1.getProps(["x", "width"], true);
      const x1 = bx1 - bw1 / 2;

      ctx.fillStyle = GREEN + "18";
      roundedTopRect(ctx, x1, maxY, bw1, barH, r);
      ctx.fill();

      if (greenHatch) {
        ctx.fillStyle = greenHatch;
        roundedTopRect(ctx, x1, maxY, bw1, barH, r);
        ctx.fill();
      }
    });

    ctx.restore();
  },
};

export default function TelcoPerformance() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart<"bar"> | null>(null);
  const [hovered, setHovered] = useState<"outbound" | "inbound" | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      plugins: [bgBarsPlugin],
      data: {
        labels: telcos,
        datasets: [
          {
            label: "Outbound Lending",
            data: outboundData,
            backgroundColor: BLUE,
            borderWidth: 0,
            borderRadius: 6,
            barPercentage: 0.7,
          },
          {
            label: "Inbound Recovery",
            data: inboundData,
            backgroundColor: GREEN,
            borderWidth: 0,
            borderRadius: 6,
            barPercentage: 0.7,
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
              label: (ctx) =>
                ` ${ctx.dataset.label}: ₦${ctx.parsed.y?.toLocaleString() || '0'}`,
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
            max: MAX,
            grid: { color: "rgba(0,0,0,0.055)", drawTicks: false },
            border: { display: false },
            ticks: {
              font: { size: 11 },
              color: "#9CA3AF",
              padding: 10,
              maxTicksLimit: 6,
              callback: (v) => `₦${Number(v) / 1000}k`,
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
    c.data.datasets.forEach((ds, i) => {
      const match =
        (hovered === "outbound" && i === 0) ||
        (hovered === "inbound"  && i === 1);
      const dim = hovered !== null && !match;
      (ds as any).backgroundColor = dim ? cols[i] + "55" : cols[i];
    });
    c.update("none");
  }, [hovered]);

  return (
    <div className="bg-white rounded-sm p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-sf-pro text-[20px] font-semibold text-[#1F2937] mb-1">
            Telco Performance
          </h2>
          <p className="text-[14px] text-[#667085] font-ibm-plex-sans">
            Outbound Lending vs Inbound Recovery per Telco
          </p>
        </div>
        <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-sm px-4 py-1.5 text-sm text-[#374151]">
            <Image src={calender} alt="calendar" width={14} height={14} />
            <span>This Year</span>
        </div>
      </div>

      <div style={{ height: "300px" }}>
        <canvas ref={canvasRef} />
      </div>
      
      {/* Legend at bottom */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: BLUE }}
          />
          <span className="text-sm text-[#374151]">Disbursed</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: GREEN }}
          />
          <span className="text-sm text-[#374151]">Recovered</span>
        </div>
      </div>
    </div>
  );
}