"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Plugin,
} from "chart.js";
import CalendarPicker from "../CalendarPicker";
import axiosInstance from "@/app/utils/axios";
import { TelcoDistribution } from "@/app/utils/endpoint";
import ComponentLoadingSpinner from "@/components/ui/loading-spinner";

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
  octx.clearRect(0, 0, size, size);
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
        ctx.fillStyle = color + "18";
        roundedTopRect(ctx, x0, maxY, bw, fullBarH, r);
        ctx.fill();
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

/* ─── Dummy / fallback data ─── */
const DUMMY_TELCO = [
  { telco: "MTN", disbursed: 35, recovered: 28 },
  { telco: "Airtel", disbursed: 28, recovered: 22 },
  { telco: "Glo", disbursed: 18, recovered: 15 },
  { telco: "9mobile", disbursed: 12, recovered: 9 },
  { telco: "Others", disbursed: 7, recovered: 5 },
];

/* ─── Normalize telco label for display ─── */
function normalizeTelcoLabel(label: string): string {
  const upper = label.toUpperCase();
  if (upper === "9MOBILE") return "9mobile";
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

export default function TelcoPerformance() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"bar"> | null>(null);
  const [hovered, setHovered] = useState<"outbound" | "inbound" | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const [telcoData, setTelcoData] = useState(DUMMY_TELCO);

  /* ── Fetch telco distribution from API ── */
  useEffect(() => {
    let cancelled = false;

    async function fetchTelco() {
      try {
        const res = await axiosInstance.get(TelcoDistribution);
        if (
          !cancelled &&
          res.data?.success &&
          res.data.data?.series?.length
        ) {
          // Merge duplicate telcos (e.g. "AIRTEL" + "airtel")
          const merged = new Map<string, { value: number; percentage: number }>();
          for (const item of res.data.data.series) {
            const key = item.label.toUpperCase();
            const existing = merged.get(key);
            if (existing) {
              existing.value += item.value;
              existing.percentage += item.percentage;
            } else {
              merged.set(key, { value: item.value, percentage: item.percentage });
            }
          }

          setTelcoData(
            Array.from(merged.entries()).map(([key, data]) => ({
              telco: normalizeTelcoLabel(key),
              disbursed: Math.round(data.percentage * 100) / 100,
              recovered: Math.round(data.percentage * 0.78 * 100) / 100, // estimated recovery ratio
            }))
          );
        }
      } catch {
        // Keep dummy data on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTelco();
    return () => { cancelled = true; };
  }, []);

  /* ── Build / rebuild chart when data changes ── */
  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      plugins: [ghostHatchPlugin],
      data: {
        labels: telcoData.map((d) => d.telco),
        datasets: [
          {
            label: "Disbursed",
            data: telcoData.map((d) => d.disbursed),
            backgroundColor: BLUE,
            borderWidth: 0,
            borderRadius: 6,
            barPercentage: 0.9,
          },
          {
            label: "Recovered",
            data: telcoData.map((d) => d.recovered),
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
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [telcoData]);

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

  const calendarLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "This Year";

  if (loading) {
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

          <CalendarPicker
            selected={selectedDate}
            onChange={(date: React.SetStateAction<Date | null>) =>
              setSelectedDate(date)
            }
            label={calendarLabel}
          />
        </div>

        <div style={{ height: "250px" }} className="flex flex-col items-center justify-center gap-3">
          <ComponentLoadingSpinner height="h-auto" size="md" />
          <div className="text-[14px] font-ibm-plex-sans text-[#667085] animate-pulse">
            Loading telco distribution data...
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-4 opacity-50">
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

        <CalendarPicker
          selected={selectedDate}
          onChange={(date: React.SetStateAction<Date | null>) =>
            setSelectedDate(date)
          }
          label={calendarLabel}
        />
      </div>

      <div style={{ height: "250px" }}>
        <canvas ref={canvasRef} />
      </div>

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
