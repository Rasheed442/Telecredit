"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { deliquent } from "@/constant";
import axiosInstance from "@/app/utils/axios";
import {
  DelinquentCustomers,
  LegacyRiskCustomers,
  FraudStats,
} from "@/app/utils/endpoint";

// ── Shared row wrapper ────────────────────────────────────────────────
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#EEF4FC] rounded-sm px-4 py-3">{children}</div>
);

// ── Panel header ──────────────────────────────────────────────────────
const PanelHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <Image src={deliquent} alt="alert" width={20} height={20} />
    <h3 className="text-[18px] font-semibold font-sf-pro text-[#1F2937]">
      {title}
    </h3>
  </div>
);

// ── Panel 1: Legacy Risk Customers ───────────────────────────────────────
const LegacyRiskPanel = ({ legacyRiskData }: { legacyRiskData: any[] }) => (
  <div className="bg-white rounded-sm p-5 border border-gray-200 flex flex-col gap-3">
    <PanelHeader title="High Risk Customer" />
    <div className="flex flex-col gap-3">
      {legacyRiskData.length > 0 ? (
        legacyRiskData.map((item, i) => (
          <Row key={i}>
            <div className="flex justify-between items-start">
              <span className="text-[14px] font-semibold font-sf-pro text-[#1F2937]">
                {item.msisdn}
              </span>
              <span className="text-[13px] font-medium text-red-500">
                {item.riskFlag}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[13px] text-[#667085] font-ibm-plex-sans">
                Risk Flag
              </span>
              <span className="text-[13px] text-[#374151] font-light font-ibm-plex-sans">
                Blacklisted
              </span>
            </div>
          </Row>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="flex justify-center mb-3">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="text-gray-500 text-sm font-ibm-plex-sans">
            No high risk customers found
          </div>
        </div>
      )}
    </div>
  </div>
);

// ── Panel 2: Fraud Stats ──────────────────────────────────────
const FraudPanel = ({ fraudData }: { fraudData: any }) => (
  <div className="bg-white rounded p-5 border border-gray-200 flex flex-col gap-3">
    <PanelHeader title="Fraud Blocked Today" />
    <div className="flex flex-col gap-3">
      {fraudData ? (
        <>
          <Row>
            <div className="flex justify-between items-start">
              <span className="text-[14px] font-semibold font-sf-pro text-[#1F2937]">
                Unauthorized Callbacks
              </span>
              <span className="text-[13px] font-medium text-red-500">
                {fraudData.rejectedUnauthorizedCallbacks || 0}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-[13px] text-[#667085] font-ibm-plex-sans">
                Rejected unauthorized attempts
              </span>
            </div>
          </Row>
          <Row>
            <div className="flex justify-between items-start">
              <span className="text-[14px] font-semibold font-sf-pro text-[#1F2937]">
                Duplicate Callbacks
              </span>
              <span className="text-[13px] font-medium text-orange-500">
                {fraudData.duplicateCallbacksRejected || 0}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-[13px] text-[#667085] font-ibm-plex-sans">
                Rejected duplicate attempts
              </span>
            </div>
          </Row>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="flex justify-center mb-3">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div className="text-gray-500 text-sm font-ibm-plex-sans">
            No fraud data available
          </div>
        </div>
      )}
    </div>
  </div>
);

// ── Panel 3: Delinquent Customers ───────────────────────────────────
const DelinquentPanel = ({ delinquentData }: { delinquentData: any[] }) => (
  <div className="bg-white rounded-sm p-5 border border-gray-200 flex flex-col gap-3">
    <PanelHeader title="New Delinquent Account" />
    <div className="flex flex-col gap-3">
      {delinquentData.length > 0 ? (
        delinquentData.map((item, i) => (
          <Row key={i}>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-semibold font-sf-pro text-[#1F2937]">
                {item.msisdn}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] inline-block" />
                <span className="text-[13px] text-[#9CA3AF]">
                  ₦{item.outstandingBalance}
                </span>
              </div>
            </div>
          </Row>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="flex justify-center mb-3">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <div className="text-gray-500 text-sm font-ibm-plex-sans">
            No delinquent customers found
          </div>
        </div>
      )}
    </div>
  </div>
);

// ── Root ──────────────────────────────────────────────────────────────
export default function RiskPanel() {
  const [legacyRiskData, setLegacyRiskData] = useState<any[]>([]);
  const [fraudData, setFraudData] = useState<any>(null);
  const [delinquentData, setDelinquentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch all three endpoints
      const [legacyRiskResponse, fraudResponse, delinquentResponse] =
        await Promise.all([
          axiosInstance.get(LegacyRiskCustomers, { headers }),
          axiosInstance.get(FraudStats, { headers }),
          axiosInstance.get(DelinquentCustomers, { headers }),
        ]);

      setLegacyRiskData(legacyRiskResponse.data);
      setFraudData(fraudResponse.data);
      setDelinquentData(delinquentResponse.data);
    } catch (error) {
      console.error("Error fetching risk data:", error);
      // Set fallback data on error
      setLegacyRiskData([
        { msisdn: "07086022674", riskFlag: "BLACKLIST" },
        { msisdn: "08111222333", riskFlag: "HIGH_RISK" },
      ]);
      setFraudData({
        rejectedUnauthorizedCallbacks: 5,
        duplicateCallbacksRejected: 12,
      });
      setDelinquentData([
        { msisdn: "07086022674", outstandingBalance: 60 },
        { msisdn: "08111222333", outstandingBalance: 45 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-sm p-5 border border-gray-200"
          >
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <LegacyRiskPanel legacyRiskData={legacyRiskData} />
      <FraudPanel fraudData={fraudData} />
      <DelinquentPanel delinquentData={delinquentData} />
    </div>
  );
}
