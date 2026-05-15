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

/* ─── hatch pattern helper ─── */
const createHatchPattern = (ctx: CanvasRenderingContext2D, color: string) => {
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = 8;
  patternCanvas.height = 8;
  const patternCtx = patternCanvas.getContext("2d");
  if (!patternCtx) return null;
  patternCtx.strokeStyle = color + "30";
  patternCtx.lineWidth = 1;
  patternCtx.beginPath();
  patternCtx.moveTo(0, 8);
  patternCtx.lineTo(8, 0);
  patternCtx.stroke();
  return ctx.createPattern(patternCanvas, "repeat");
};

/* ─── background bars plugin ─── */
const bgBarsPlugin: Plugin<"line"> = {
  id: "bgBars",
  beforeDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { left, right, top, bottom },
      scales: { x, y },
      data,
    } = chart;
    const barW = ((right - left) / (data.labels?.length || 1)) * 0.38;
    const purpleHatch = createHatchPattern(ctx, "#8B80F9");
    ctx.save();
    if (!data.labels) return;
    data.labels.forEach((_, i) => {
      const cx = x.getPixelForValue(i);
      const maxValue = Math.max(
        ...data.datasets[0].data.filter(
          (val): val is number => typeof val === "number",
        ),
      );
      const currentValue = data.datasets[0].data[i];
      if (currentValue === null || typeof currentValue !== "number") return;
      const barH = (currentValue / maxValue) * (bottom - top) * 0.8;
      const bTop = bottom - barH;
      const r = 7;
      const bx = cx - barW / 2;
      ctx.fillStyle = "rgba(139,128,249,0.12)";
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
      if (purpleHatch) {
        ctx.fillStyle = purpleHatch;
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
      }
    });
    ctx.restore();
  },
};

/* ─── Calendar constants ─── */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ─── Calendar Dropdown (fixed-position so it never overflows viewport) ─── */
/* ─── Calendar Dropdown ─── */
function CalendarDropdown({
  selected,
  onChange,
}: {
  selected: Date | null;
  onChange: (d: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selected ?? new Date());
  const [pos, setPos] = useState<{
    top: number;
    left?: number;
    right?: number;
  }>({
    top: 0,
    right: 16,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropW = Math.min(300, window.innerWidth - 32);
      const spaceOnRight = window.innerWidth - rect.left;
      const spaceOnLeft = rect.right;

      // If calendar fits to the right of trigger, align left edge with trigger
      // Otherwise align right edge with trigger (or viewport edge with padding)
      if (spaceOnRight >= dropW + 16) {
        setPos({ top: rect.bottom + 8, left: rect.left });
      } else {
        // Align right edge of calendar with right edge of trigger, but clamp to viewport
        const rightAligned = window.innerWidth - rect.right;
        setPos({
          top: rect.bottom + 8,
          right: Math.max(16, rightAligned),
        });
      }
    }
    setOpen((v) => !v);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; cur: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  while (cells.length < 42)
    cells.push({ day: cells.length - daysInMonth - firstDay + 1, cur: false });

  const isToday = (d: number, cur: boolean) => {
    const now = new Date();
    return (
      cur &&
      d === now.getDate() &&
      month === now.getMonth() &&
      year === now.getFullYear()
    );
  };
  const isSel = (d: number, cur: boolean) =>
    !!selected &&
    cur &&
    d === selected.getDate() &&
    month === selected.getMonth() &&
    year === selected.getFullYear();

  const label = selected
    ? selected.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "This Year";

  const dropW =
    typeof window !== "undefined" ? Math.min(300, window.innerWidth - 32) : 300;

  return (
    <div ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 border border-[#E5E7EB] rounded-sm px-3 py-1.5 text-sm text-[#374151] bg-white hover:bg-[#F9FAFB] transition-colors whitespace-nowrap"
      >
        <Image src={calender} alt="calendar" width={16} height={16} />
        <span>{label}</span>
      </button>

      {open && (
        <>
          {/* Backdrop for mobile tap-outside */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed z-[9999] bg-white border border-[#E5E7EB] rounded-xl shadow-2xl overflow-hidden"
            style={{
              top: pos.top,
              ...(pos.left !== undefined
                ? {
                    left: Math.max(
                      16,
                      Math.min(pos.left, window.innerWidth - dropW - 16),
                    ),
                  }
                : { right: pos.right }),
              width: dropW,
            }}
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F3F4F6] text-[#6B7280] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="text-[14px] font-semibold text-[#111827]">
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F3F4F6] text-[#6B7280] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 px-3 pt-3 pb-1">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] font-medium text-[#9CA3AF]"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Date grid */}
            <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
              {cells.map((cell, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={!cell.cur}
                  onClick={() => {
                    if (!cell.cur) return;
                    onChange(new Date(year, month, cell.day));
                    setOpen(false);
                  }}
                  className={[
                    "h-8 w-full rounded-md text-[13px] font-medium transition-colors",
                    !cell.cur
                      ? "text-[#D1D5DB] cursor-default"
                      : "cursor-pointer",
                    isSel(cell.day, cell.cur)
                      ? "bg-[#243B6B] text-white"
                      : isToday(cell.day, cell.cur)
                        ? "bg-[#EFF4FF] text-[#243B6B] font-semibold"
                        : cell.cur
                          ? "text-[#374151] hover:bg-[#F3F4F6]"
                          : "",
                  ].join(" ")}
                >
                  {cell.day}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => {
                  onChange(new Date());
                  setViewDate(new Date());
                  setOpen(false);
                }}
                className="text-[12px] text-[#243B6B] font-medium hover:underline"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[12px] text-[#6B7280] hover:text-[#374151]"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   Main component
════════════════════════════════════════ */
/* ─── Dummy / fallback data ─── */
const DUMMY_DISBURSEMENT = [
  { date: "Jan", value: 4200 },
  { date: "Feb", value: 1900 },
  { date: "Mar", value: 1500 },
  { date: "Apr", value: 2100 },
  { date: "May", value: 2400 },
  { date: "Jun", value: 1800 },
  { date: "Jul", value: 2200 },
  { date: "Aug", value: 2000 },
  { date: "Sep", value: 2300 },
  { date: "Oct", value: 1900 },
  { date: "Nov", value: 2100 },
  { date: "Dec", value: 2500 },
];

const DUMMY_RECOVERY = [
  { date: "Jan", value: 3800 },
  { date: "Feb", value: 1200 },
  { date: "Mar", value: 900 },
  { date: "Apr", value: 1400 },
  { date: "May", value: 1600 },
  { date: "Jun", value: 1100 },
  { date: "Jul", value: 1300 },
  { date: "Aug", value: 1500 },
  { date: "Sep", value: 1700 },
  { date: "Oct", value: 1400 },
  { date: "Nov", value: 1600 },
  { date: "Dec", value: 1800 },
];

/* ─── Helper: convert API label like "2026-02" to short month ─── */
const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function labelToMonth(label: string): string {
  const parts = label.split("-");
  if (parts.length >= 2) {
    const monthIdx = parseInt(parts[1], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) return SHORT_MONTHS[monthIdx];
  }
  return label;
}

export default function LoanRequestTrend() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"line"> | null>(null);
  const [hovered, setHovered] = useState<"loan" | "recovery" | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const [disbursementData, setDisbursementData] = useState(DUMMY_DISBURSEMENT);
  const [recoveryData, setRecoveryData] = useState(DUMMY_RECOVERY);

  /* ── Fetch real data from API (falls back to dummy on failure) ── */
  useEffect(() => {
    let cancelled = false;

    async function fetchTrends() {
      try {
        const [disbRes, recRes] = await Promise.allSettled([
          axiosInstance.get(DisbursementTrend),
          axiosInstance.get(RecoveryTrend),
        ]);

        if (!cancelled) {
          // Disbursement
          if (
            disbRes.status === "fulfilled" &&
            disbRes.value.data?.success &&
            disbRes.value.data.data?.series?.length
          ) {
            setDisbursementData(
              disbRes.value.data.data.series.map((s: { label: string; value: number }) => ({
                date: labelToMonth(s.label),
                value: s.value,
              }))
            );
          }

          // Recovery — flat array of { period, count }
          if (recRes.status === "fulfilled") {
            const recData = recRes.value.data;
            // Handle both wrapped and flat array responses
            const items = Array.isArray(recData) ? recData : recData?.data;
            if (Array.isArray(items) && items.length) {
              setRecoveryData(
                items.map((s: { period: string; count: number }) => ({
                  date: labelToMonth(s.period),
                  value: Math.round(s.count),
                }))
              );
            }
          }
        }
      } catch {
        // Keep dummy data on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTrends();
    return () => { cancelled = true; };
  }, []);

  /* ── build / rebuild chart when data changes ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Dynamic y-axis max
    const allValues = [
      ...disbursementData.map((d) => d.value),
      ...recoveryData.map((d) => d.value),
    ];
    const maxVal = Math.max(...allValues, 0);
    const yMax = Math.ceil(maxVal * 1.25); // 25% headroom

    chartRef.current = new Chart(canvas, {
      type: "line",
      plugins: [bgBarsPlugin],
      data: {
        labels: disbursementData.map((d) => d.date),
        datasets: [
          {
            label: "Loan",
            data: disbursementData.map((d) => d.value),
            borderColor: "#8B80F9",
            backgroundColor: "rgba(139,128,249,0.07)",
            borderWidth: 2.5,
            borderDash: [6, 5],
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#8B80F9",
            pointBorderWidth: 2,
            tension: 0.45,
            fill: true,
          },
          {
            label: "Recovery",
            data: recoveryData.map((d) => d.value),
            borderColor: "#4CBFFF",
            backgroundColor: "rgba(76,191,255,0.07)",
            borderWidth: 2.5,
            borderDash: [6, 5],
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#4CBFFF",
            pointBorderWidth: 2,
            tension: 0.45,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { left: -16 } },
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
            max: yMax,
            grid: { color: "rgba(0,0,0,0.055)", drawTicks: false },
            border: { display: false, dash: [4, 4] },
            afterFit(scale) {
              scale.width = 60;
            },
            ticks: {
              font: { size: 11 },
              color: "#9CA3AF",
              padding: 16,
              maxTicksLimit: 6,
              callback: (v) => {
                const n = Number(v);
                if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
                if (n >= 1000) return (n / 1000).toFixed(0) + "k";
                return v;
              },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [disbursementData, recoveryData]);

  /* ── hover dim effect ── */
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

  /* ── shared header ── */
  const header = (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
      <div className="min-w-0">
        <h2 className="font-sf-pro text-[14px] sm:text-[18px] lg:text-[20px] font-semibold text-[#1F2937] mb-1">
          Daily Loan vs Recovery
        </h2>
        <p className="text-[12px] lg:text-[14px] text-[#667085] font-ibm-plex-sans">
          Compares outbound lending and inbound recoveries over time.
        </p>
      </div>
      <div className="self-start shrink-0">
        <CalendarDropdown selected={selectedDate} onChange={setSelectedDate} />
      </div>
    </div>
  );

  /* ── shared legend ── */
  const legend = (
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
  );

  /* ── loading ── */
  if (loading) {
    return (
      <div className="bg-white rounded-sm p-4 sm:p-6 shadow-sm">
        {header}
        <div className="h-[200px] sm:h-[280px]">
          <canvas ref={canvasRef} />
        </div>
        {legend}
      </div>
    );
  }

  /* ── empty ── */
  if (!loading && disbursementData.length === 0 && recoveryData.length === 0) {
    return (
      <div className="bg-white rounded-sm p-4 sm:p-8 shadow-sm">
        {header}
        <div className="h-[200px] sm:h-[280px] flex items-center justify-center">
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

  /* ── main ── */
  return (
    <div className="bg-white rounded-sm p-4 sm:p-6 shadow-sm">
      {header}
      <div className="h-[200px] sm:h-[280px]">
        <canvas ref={canvasRef} />
      </div>
      {legend}
    </div>
  );
}
