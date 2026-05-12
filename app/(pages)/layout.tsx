"use client";

import Header from "@/components/Header";
import React, { ReactNode, Suspense, memo } from "react";
import { ComponentLoadingSpinner } from "@/components/ui/loading-spinner";
import Navbar from "@/components/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const MemoizedHeader = memo(Header);

const layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — fixed position, doesn't scroll with content */}
      <div className="fixed left-0 top-0 h-full z-30">
        <Navbar />
      </div>

      {/* Main content — takes full width on mobile, remaining width on desktop */}
      <div className="flex-1 bg-[#F8FAFC] min-h-screen overflow-y-auto lg:ml-56 xl:ml-60">
        <MemoizedHeader />

        <Suspense fallback={<ComponentLoadingSpinner height="h-64" />}>
          <main className="">{children}</main>
        </Suspense>
      </div>
    </div>
  );
};

export default layout;
