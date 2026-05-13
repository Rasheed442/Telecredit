"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { calender } from "@/constant";

interface CalendarPickerProps {
  selected: Date | null;
  onChange: (date: Date) => void;
  label?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
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

export default function CalendarPicker({
  selected,
  onChange,
  label,
}: CalendarPickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selected ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* grid helpers */
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; cur: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, cur: false });

  const isToday = (d: number, cur: boolean) => {
    const now = new Date();
    return (
      cur &&
      d === now.getDate() &&
      month === now.getMonth() &&
      year === now.getFullYear()
    );
  };

  const isSelected = (d: number, cur: boolean) => {
    if (!selected || !cur) return false;
    return (
      d === selected.getDate() &&
      month === selected.getMonth() &&
      year === selected.getFullYear()
    );
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const displayLabel =
    label ??
    (selected
      ? selected.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "This Year");

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 border border-[#E5E7EB] rounded-sm px-4 py-1.5 text-sm text-[#374151] bg-white hover:bg-[#F9FAFB] transition-colors"
      >
        <Image src={calender} alt="calendar" width={16} height={16} />
        <span>{displayLabel}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 z-50 mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-xl"
          style={{ width: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6]">
            <button
              onClick={prevMonth}
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

            <span className="text-[14px] font-semibold text-[#111827] font-sf-pro">
              {MONTHS[month]} {year}
            </span>

            <button
              onClick={nextMonth}
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

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-medium text-[#9CA3AF] pb-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {cells.map((cell, i) => {
              const today = isToday(cell.day, cell.cur);
              const sel = isSelected(cell.day, cell.cur);

              return (
                <button
                  key={i}
                  disabled={!cell.cur}
                  onClick={() => {
                    if (!cell.cur) return;
                    onChange(new Date(year, month, cell.day));
                    setOpen(false);
                  }}
                  className={`
                    h-8 w-full rounded-md text-[13px] font-medium transition-colors
                    ${!cell.cur ? "text-[#D1D5DB] cursor-default" : "cursor-pointer"}
                    ${
                      sel
                        ? "bg-[#243B6B] text-white"
                        : today
                          ? "bg-[#EFF4FF] text-[#243B6B] font-semibold"
                          : cell.cur
                            ? "text-[#374151] hover:bg-[#F3F4F6]"
                            : ""
                    }
                  `}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer — quick actions */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#F3F4F6]">
            <button
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
              onClick={() => setOpen(false)}
              className="text-[12px] text-[#6B7280] hover:text-[#374151]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
