"use client";

import AgingBucketChart from "@/components/DashboardCompo/AirtimeVsDataChart";
import TelcoPerformance from "@/components/DashboardCompo/TelcoPerformance";
import CustomerPanel from "@/components/DashboardCompo/CustomerPanel";
import FraudPanel from "@/components/DashboardCompo/FraudPanel";
import LoanRequestTable from "@/components/DashboardCompo/LoanRequestTable";
import LoanRequestTrend from "@/components/DashboardCompo/LoanRequestTrend";
import RiskPanel from "@/components/DashboardCompo/RiskPanel";
import MetricsCard from "@/components/DashboardCompo/MetricsCard";
import {
  arrowup,
  calender,
  cube,
  cube2,
  cube3,
  cube4,
  quicklink,
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
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { AiOutlineDown } from "react-icons/ai";
import axiosInstance from "@/app/utils/axios";
import {
  DashboardSummary,
  DisbursementTrend,
  RecoveryTrend,
  ProductDistribution,
  TelcoDistribution,
  AgingDistribution,
  RiskMetrics,
  FraudStats,
  HighValueCustomers,
  RepeatBorrowers,
  RecentLoans,
  DelinquentCustomers,
  LegacyRiskCustomers,
  PortfolioWatchlist,
} from "@/app/utils/endpoint";

function page() {
  const [metricsData, setMetricsData] = useState([
    {
      title: "Total Disbursed",
      value: "₦0",
      change: 0,
      changeText: "vs Last Month",
      icon: money,
    },
    {
      title: "Total Recoveries",
      value: "₦0",
      change: 0,
      changeText: "vs Last Month",
      icon: trending,
    },
    {
      title: "Outstanding Balance",
      value: "₦0",
      change: 0,
      changeText: "vs Last Month",
      icon: outstanding,
    },
    {
      title: "Active Borrowers",
      value: "0",
      change: 0,
      changeText: "vs Last Month",
      icon: activeb,
    },
    {
      title: "Delinquent Borrowers",
      value: "0",
      change: 0,
      changeText: "vs Last Month",
      icon: deliquent,
    },
    {
      title: "Hard Block Customers",
      value: "0",
      change: 0,
      changeText: "vs Last Month",
      icon: blocked,
    },
    {
      title: "Portfolio Profit",
      value: "₦0",
      change: 0,
      changeText: "vs Last Month",
      icon: profit,
    },
    {
      title: "Avg Behavioral Risk",
      value: "0%",
      change: 0,
      changeText: "vs Last Month",
      icon: behav,
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch dashboard summary
      const summaryResponse = await axiosInstance.get(DashboardSummary, {
        headers,
      });
      const summaryData = summaryResponse.data;

      // Update metrics with real data
      setMetricsData([
        {
          title: "Total Disbursed",
          value: `₦${(summaryData.totalDisbursed || 0).toLocaleString()}`,
          change: 8.2,
          changeText: "vs Last Month",
          icon: money,
        },
        {
          title: "Total Recoveries",
          value: `₦${(summaryData.totalRecovered || 0).toLocaleString()}`,
          change: 12.5,
          changeText: "vs Last Month",
          icon: trending,
        },
        {
          title: "Outstanding Balance",
          value: `₦${(summaryData.outstandingPortfolio || 0).toLocaleString()}`,
          change: 6.4,
          changeText: "vs Last Month",
          icon: outstanding,
        },
        {
          title: "Portfolio Revenue",
          value: `₦${(summaryData.totalRevenue || 0).toLocaleString()}`,
          change: 15.2,
          changeText: "vs Last Month",
          icon: profit,
        },
        {
          title: "Active Borrowers",
          value: (summaryData.activeBorrowers || 0).toString(),
          change: -5.8,
          changeText: "vs Last Month",
          icon: activeb,
        },
        {
          title: "Delinquent Borrowers",
          value: (summaryData.delinquentBorrowers || 0).toString(),
          change: 3.2,
          changeText: "vs Last Month",
          icon: deliquent,
        },
        {
          title: "Hard Block Customers",
          value: (summaryData.blockedCustomers || 0).toString(),
          change: 18.7,
          changeText: "vs Last Month",
          icon: blocked,
        },
        {
          title: "Avg Behavioral Risk",
          value: `${(summaryData.behavioralRisk || 0).toFixed(1)}%`,
          change: 15.2,
          changeText: "vs Last Month",
          icon: behav,
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 pt-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="font-sf-pro text-[28px] text-[#1F2937] font-semibold ">
            Welcome back, Admin 👋
          </p>
          <span className="font-mulish text-[16px] font-normal text-[#667085]">
            Monitor loan activity, manage airtime & data credits in real time.
          </span>
        </div>
        <div className="border border-[#EBEBEB] flex items-center px-4 gap-2 rounded-sm bg-white py-2 cursor-pointer">
          <Image src={calender} alt="calender" width={15} height={15} />
          <p className="text-gray-500 text-[14px] font-medium font-mulish">
            This Year{" "}
          </p>
          <AiOutlineDown color="#344054" size={14} />
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-4 gap-4 pt-6">
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

      <div className="grid grid-cols-[60%_40%] gap-4 py-6 pr-4">
        <div className="">
          <LoanRequestTrend />
        </div>
        <div className="">
          <AgingBucketChart />
        </div>
      </div>

      {/* Telco Performance Section */}
      <div className=" pb-6 pr-4">
        <TelcoPerformance />
      </div>

      {/* Risk Panels Section */}
      <RiskPanel />
      <LoanRequestTable />
    </div>
  );
}

export default page;
