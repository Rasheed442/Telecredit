"use client";

import SubMenu from "@/components/SubMenu";
import React, { useState } from "react";
import { IoMdArrowDown } from "react-icons/io";

// ── Types ──────────────────────────────────────────────────────────────────
interface SystemJob {
  id: string;
  title: string;
  description: string;
  endpoint: string;
}

interface JobHistoryEntry {
  id: string;
  jobName: string;
  status: "Success" | "Failed" | "Running";
  executedAt: string;
  duration: string;
}

// ── Static Data ────────────────────────────────────────────────────────────
const systemJobs: SystemJob[] = [
  {
    id: "refresh-dashboard",
    title: "Refresh Dashboard Snapshots",
    description:
      "Updates all KPI metrics and regenerates dashboard analytics caches",
    endpoint: "POST /api/v1/admin/jobs/refresh-dashboard",
  },
  {
    id: "run-aging",
    title: "Run Loan Aging Scheduler",
    description:
      "Recalculates aging buckets for all open loans and updates delinquency status",
    endpoint: "POST /api/v1/admin/jobs/run-aging",
  },
  {
    id: "run-legacy-import",
    title: "Run Legacy History Import",
    description:
      "Imports historical loan data from legacy systems into the current platform",
    endpoint: "POST /api/v1/admin/jobs/run-legacy-import",
  },
  {
    id: "rebuild-exposure",
    title: "Rebuild Exposure Ledger",
    description:
      "Recalculates customer exposure balances and outstanding amounts",
    endpoint: "POST /api/v1/admin/jobs/rebuild-exposure",
  },
];

const initialHistory: JobHistoryEntry[] = [
  {
    id: "1",
    jobName: "Refresh Dashboard Snapshot",
    status: "Failed",
    executedAt: "2026-05-04 23:00",
    duration: "45s",
  },
  {
    id: "2",
    jobName: "Run Loan Aging Scheduler",
    status: "Success",
    executedAt: "2026-05-08 14:22",
    duration: "2m 15s",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  Success: "text-emerald-600 bg-emerald-50 border border-emerald-200",
  Failed: "text-red-500 bg-red-50 border border-red-200",
  Running: "text-blue-600 bg-blue-50 border border-blue-200",
};

// ── Sub-components ─────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 2L11 7L3 12V2Z" fill="white" />
    </svg>
  );
}

function JobTriggerCard({
  job,
  onRun,
  running,
}: {
  job: SystemJob;
  onRun: (job: SystemJob) => void;
  running: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between gap-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
        <p className="text-sm text-gray-500">{job.description}</p>
        <div className="inline-block mt-1 bg-gray-100 rounded px-3 py-1">
          <code className="text-xs text-gray-600 font-mono">
            {job.endpoint}
          </code>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4 flex justify-end">
        <button
          onClick={() => onRun(job)}
          disabled={running}
          className="inline-flex items-center gap-2 bg-[#1e2d4d] hover:bg-[#273d66] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
        >
          <PlayIcon />
          {running ? "Running…" : "Run Job"}
        </button>
      </div>
    </div>
  );
}

function SortableTh({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-6 py-3">
      <button className="flex items-center gap-1 text-xs font-medium text-[#6B7280] font-ibm-plex-sans hover:text-[#374151]">
        {children}
        <IoMdArrowDown className="opacity-50" />
      </button>
    </th>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function SystemJobsPage() {
  const [history, setHistory] = useState<JobHistoryEntry[]>(initialHistory);
  const [runningJobs, setRunningJobs] = useState<Set<string>>(new Set());

  const handleRun = (job: SystemJob) => {
    setRunningJobs((prev) => new Set(prev).add(job.id));

    // Simulate job execution (2–4s)
    const duration = Math.floor(Math.random() * 3000) + 2000;
    setTimeout(() => {
      const success = Math.random() > 0.2;
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const executedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

      const entry: JobHistoryEntry = {
        id: String(Date.now()),
        jobName: job.title,
        status: success ? "Success" : "Failed",
        executedAt,
        duration: `${Math.round(duration / 1000)}s`,
      };

      setHistory((prev) => [entry, ...prev]);
      setRunningJobs((prev) => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    }, duration);
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <SubMenu
        title="System Job Center"
        subtitle="Execute administrative tasks and maintenance jobs."
      />

      {/* Job Trigger Cards — 2×2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {systemJobs.map((job) => (
          <JobTriggerCard
            key={job.id}
            job={job}
            onRun={handleRun}
            running={runningJobs.has(job.id)}
          />
        ))}
      </div>

      {/* Job Execution History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            Job Execution History
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[#F3F4F6]">
              <SortableTh>Job Name</SortableTh>
              <SortableTh>Status</SortableTh>
              <SortableTh>Executed At</SortableTh>
              <SortableTh>Duration</SortableTh>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr
                key={entry.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-800">{entry.jobName}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={entry.status} />
                </td>
                <td className="px-6 py-4 text-gray-600">{entry.executedAt}</td>
                <td className="px-6 py-4 text-gray-600">{entry.duration}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-gray-400 text-sm"
                >
                  No jobs have been run yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
