"use client";

import AgingBucketChart from "@/components/DashboardCompo/AirtimeVsDataChart";
import TelcoPerformance from "@/components/DashboardCompo/TelcoPerformance";
import LoanRequestTable from "@/components/DashboardCompo/LoanRequestTable";
import LoanRequestTrend from "@/components/DashboardCompo/LoanRequestTrend";
import RiskPanel from "@/components/DashboardCompo/RiskPanel";
import MetricsCard from "@/components/DashboardCompo/MetricsCard";
import CalendarPopup from "@/components/ui/CalendarPopup";
import ComponentLoadingSpinner from "@/components/ui/loading-spinner";
import {
  calender,
  activeb,
  behav,
  blocked,
  deliquent,
  money,
  outstanding,
  profit,
  trending,
} from "@/constant";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { AiOutlineDown } from "react-icons/ai";
import axiosInstance from "@/app/utils/axios";
import { DashboardSummary } from "@/app/utils/endpoint";

function page() {
  const defaultMetrics = [
    {
      title: "Total Loans Disbursed",
      value: "₦2,500,000",
      change: 8.2,
      changeText: "vs Last Month",
      icon: money,
    },
    {
      title: "Total Recoveries",
      value: "₦1,850,000",
      change: 12.5,
      changeText: "vs Last Month",
      icon: trending,
    },
    {
      title: "Outstanding Balance",
      value: "₦650,000",
      change: 6.4,
      changeText: "vs Last Month",
      icon: outstanding,
    },
    {
      title: "Portfolio Revenue",
      value: "₦420,000",
      change: 15.2,
      changeText: "vs Last Month",
      icon: profit,
    },
    {
      title: "Active Borrowers",
      value: "1,247",
      change: -5.8,
      changeText: "vs Last Month",
      icon: activeb,
    },
    {
      title: "Delinquent Borrowers",
      value: "89",
      change: 3.2,
      changeText: "vs Last Month",
      icon: deliquent,
    },
    {
      title: "Hard Block Customers",
      value: "156",
      change: 18.7,
      changeText: "vs Last Month",
      icon: blocked,
    },
    {
      title: "Avg Behavioral Risk",
      value: "23.5%",
      change: 15.2,
      changeText: "vs Last Month",
      icon: behav,
    },
  ];

  const [metricsData, setMetricsData] = useState(defaultMetrics);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("This Year");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("Fetching dashboard data from:", DashboardSummary);
      const summaryResponse = await axiosInstance.get(DashboardSummary, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = summaryResponse.data.data || summaryResponse.data;
      console.log("API Response:", d);

      setMetricsData([
        {
          title: "Total Loans Disbursed",
          value: `₦${Number(d.totalDisbursed).toLocaleString()}`,
          change: 0,
          changeText: "vs Last Month",
          icon: money,
        },
        {
          title: "Total Recoveries",
          value: `₦${Number(d.totalRecovered).toLocaleString()}`,
          change: 0,
          changeText: "vs Last Month",
          icon: trending,
        },
        {
          title: "Outstanding Balance",
          value: `₦${Number(d.outstandingPortfolio).toLocaleString()}`,
          change: 0,
          changeText: "vs Last Month",
          icon: outstanding,
        },
        {
          title: "Portfolio Revenue",
          value: `₦${Number(d.totalRevenue).toLocaleString()}`,
          change: 0,
          changeText: "vs Last Month",
          icon: profit,
        },
        {
          title: "Active Loans",
          value: d.activeLoans?.toString() || "0",
          change: 0,
          changeText: "vs Last Month",
          icon: activeb,
        },
        {
          title: "Closed Loans",
          value: d.closedLoans?.toString() || "0",
          change: 0,
          changeText: "vs Last Month",
          icon: deliquent,
        },
        {
          title: "Recovery Rate",
          value: `₦${Number(d.recoveryRate).toLocaleString()}`,
          change: 0,
          changeText: "vs Last Month",
          icon: blocked,
        },
        {
          title: "Avg Ticket Size",
          value: `₦${Number(d.avgTicketSize).toFixed(2)}`,
          change: 0,
          changeText: "vs Last Month",
          icon: behav,
        },
      ]);
    } catch {
      setMetricsData(defaultMetrics);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <ComponentLoadingSpinner height="h-auto" size="lg" />
        <div className="text-[15px] font-ibm-plex-sans text-[#667085]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 pt-4 md:pt-5 pb-10 max-w-full overflow-x-hidden">
      {/* ── Page Header ── */}
      <div className="flex items-end justify-between gap-4 mb-6">
        <div className="flex flex-col gap-0.5">
          <p className="font-sf-pro text-[22px] sm:text-[26px] lg:text-[28px] text-[#1F2937] font-semibold leading-tight">
            Welcome back, Admin 👋
          </p>
          <span className="font-mulish text-[13px] sm:text-[15px] font-normal text-[#667085]">
            Monitor loan activity, manage airtime & data credits in real time.
          </span>
        </div>
        <div className="flex justify-start sm:justify-end">
          <CalendarPopup
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* ── Metrics Grid ── */}
      {/* mobile: 1 col → sm: 2 cols → lg: 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {metricsData.map((metric, index) => (
          <MetricsCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeText={metric.changeText}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* ── Charts Row ── */}
      {/* Stacked on mobile, side-by-side on xl */}
      <div className="grid grid-cols-1 xl:grid-cols-[60%_40%] gap-4 mt-6">
        <div className="min-w-0 w-full">
          <LoanRequestTrend />
        </div>
        <div className="min-w-0 w-full">
          <AgingBucketChart />
        </div>
      </div>

      {/* ── Telco Performance ── */}
      <div className="mt-6">
        <TelcoPerformance />
      </div>

      {/* ── Risk + Loan Tables ── */}
      <div className="mt-6">
        <RiskPanel />
      </div>
      <div className="mt-6">
        <LoanRequestTable />
      </div>
    </div>
  );
}

export default page;
