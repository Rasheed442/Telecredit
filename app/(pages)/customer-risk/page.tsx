
"use client";

import SubMenu from '@/components/SubMenu'
import React, { useState } from 'react'

type TabKey = "open" | "delinquent" | "closed" | "watchlist" | "aging";


function page() {
    
    const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "open", label: "Customer Research", count: 542 },
    { key: "delinquent", label: "Delinquent Loans", count: 89 },
    { key: "closed", label: "Closed Loans", count: 616 },
    { key: "watchlist", label: "Portfolio Watchlist", count: 2 },
    { key: "aging", label: "Aging Buckets Analysis" },
];
    const [activeTab, setActiveTab] = useState<TabKey>("open");

  return (
    <div className="p-6">
          <SubMenu
                title="Customer Risk Center"
                subtitle="Track and manage all active, delinquent, and closed loans."
            />

             <div className="flex border border-gray-200 bg-[#EEF4FC] rounded-sm mb-2 mt-6 pl-1 py-1 gap-1 overflow-x-auto ">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2 text-[14px] cursor-pointer font-ibm-plex-sans  whitespace-nowrap transition-colors border-b-2 -mb-[1px]
                ${activeTab === t.key
                                ? "bg-[#1F2937] text-white font-semibold rounded-md"
                                : "border-transparent text-[#6B7280] hover:text-[#374151]"}`}
                    >
                        {t.label}
                        {t.count !== undefined && (
                            <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-md
                  ${activeTab === t.key
                                    ? "bg-white text-gray-700 font-bold"
                                    : "bg-gray-200 text-gray-700 text-[#6B7280]"}`}>
                                {t.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
    </div>
  )
}

export default page