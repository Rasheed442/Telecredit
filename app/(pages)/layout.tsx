"use client";

import Header from "@/components/Header";
import React, { ReactNode, Suspense, memo, useState, useEffect } from "react";
import { ComponentLoadingSpinner } from "@/components/ui/loading-spinner";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

const MemoizedHeader = memo(Header);

const layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsSessionExpired(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleLoginRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("user");
    setIsSessionExpired(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Session Expired Modal */}
      {isSessionExpired && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center animate-[slideUp_0.3s_ease-out]">
            <div className="w-16 h-16 bg-[#F7FBFF] rounded-full flex items-center justify-center mb-4 border border-[#ECEFF3]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#243B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-sf-pro font-semibold text-[#1B1B1B] mb-2">Session Expired</h3>
            <p className="text-[#667085] font-ibm-plex-sans text-sm mb-6">
              Your session has expired or is invalid. Please log in again to continue.
            </p>
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-[#243B6B] hover:bg-[#1a2b4d] transition-colors text-white font-medium py-3 rounded-lg text-[15px]"
            >
              Log In Again
            </button>
          </div>
        </div>
      )}
      {/* Sidebar — fixed position, doesn't scroll with content */}
      <div className="fixed left-0 top-0 h-full z-50">
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
