"use client";

import React, { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import {
  Dashborad,
  Tel,
  caution,
  coll,
  archieve,
  key,
  logo,
  logout,
  sysj,
} from "@/constant";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// Export the trigger so Header can use it
export function useNavbar() {
  return null; // handled via global state below
}

// Use a simple module-level event for cross-component communication
const listeners: Array<() => void> = [];
export function openMobileNav() {
  listeners.forEach((fn) => fn());
}

function Navbar() {
  const route = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Register listener so Header's hamburger can open the drawer
  useEffect(() => {
    const handler = () => setIsMobileMenuOpen(true);
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const navSections = [
    {
      title: "OVERVIEW",
      links: [
        { name: "Executive Dashboard", icon: Dashborad, link: "/dashboard" },
      ],
    },
    {
      title: "PORTFOLIO",
      links: [{ name: "Live Portfolio", icon: Tel, link: "/live-portfolio" }],
    },
    {
      title: "RISKS",
      links: [
        {
          name: "Customer Risk Center",
          icon: caution,
          link: "/customer-risk-center",
        },
        {
          name: "Fraud & Underwriting",
          icon: coll,
          link: "/fraud-underwriting-control",
        },
      ],
    },
    {
      title: "OPERATIONS",
      links: [
        { name: "Callback Audit", icon: archieve, link: "/callback-audit" },
        { name: "Analytics", icon: key, link: "/analytics" },
        { name: "System Jobs", icon: sysj, link: "/system-jobs" },
      ],
    },
  ];

  const getActiveLink = () => {
    for (const section of navSections) {
      for (const link of section.links) {
        if (link.link === pathname) return link.name;
      }
    }
    return "Executive Dashboard";
  };

  const [activeLink, setActiveLink] = useState(getActiveLink());

  useEffect(() => {
    setActiveLink(getActiveLink());
  }, [pathname]);

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => route.push("/");
  const cancelLogout = () => setShowLogoutModal(false);

  return (
    <>
      {/* ── Mobile Drawer Overlay with slide animation ── */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "bg-black/60 backdrop-blur-sm pointer-events-auto"
            : "bg-transparent pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`bg-[#0B1F3A] h-full w-72 max-w-[82%] overflow-y-auto flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer header with logo + close */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <Image src={logo} alt="TeleCredit" width={80} height={80} />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-[#1E3A5F] transition-colors"
            >
              <HiX size={22} />
            </button>
          </div>

          {/* Nav sections */}
          <div className="flex-1 px-3 pt-4 overflow-y-auto">
            {navSections.map((section, sectionIndex) => (
              <div
                key={section.title}
                className={`mb-4 ${sectionIndex > 0 ? "mt-5" : ""}`}
              >
                <p className="text-[10px] pl-1 text-white/40 font-light uppercase tracking-widest mb-1.5">
                  {section.title}
                </p>
                <div className="flex flex-col gap-0.5">
                  {section.links.map((link) => (
                    <Link
                      href={link.link}
                      key={link.name}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        activeLink === link.name
                          ? "bg-[#5490DE] text-white"
                          : "text-[#D1D5DC] hover:bg-[#1E3A5F]"
                      }`}
                    >
                      <Image
                        src={link.icon}
                        alt={link.name}
                        width={15}
                        height={15}
                        className={
                          activeLink === link.name ? "brightness-0 invert" : ""
                        }
                      />
                      <p className="text-[13px] font-medium font-inter">
                        {link.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-[#374151] mx-3 mb-6 pt-3">
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#D1D5DC] hover:bg-[#1E3A5F] transition-colors"
            >
              <Image src={logout} alt="Logout" width={15} height={15} />
              <p className="text-[13px] font-medium font-inter">Logout</p>
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop Sidebar only ── */}
      <div className="hidden lg:flex flex-col bg-[#0B1F3A] h-screen w-56 xl:w-60 shrink-0">
        <div className="flex items-center justify-center pt-8 pb-6">
          <Image src={logo} alt="TeleCredit" width={110} height={110} />
        </div>

        <div className="flex-1 px-3 pt-2 overflow-y-auto">
          {navSections.map((section, sectionIndex) => (
            <div
              key={section.title}
              className={`mb-4 ${sectionIndex > 0 ? "mt-5" : ""}`}
            >
              <p className="text-[11px] pl-1 text-white/50 font-light uppercase tracking-widest mb-1">
                {section.title}
              </p>
              <div className="flex flex-col gap-0.5">
                {section.links.map((link) => (
                  <Link
                    href={link.link}
                    key={link.name}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      activeLink === link.name
                        ? "bg-[#5490DE] text-white"
                        : "text-[#D1D5DC] hover:bg-[#1E3A5F]"
                    }`}
                  >
                    <Image
                      src={link.icon}
                      alt={link.name}
                      width={15}
                      height={15}
                      className={
                        activeLink === link.name ? "brightness-0 invert" : ""
                      }
                    />
                    <p className="text-[13px] font-medium font-inter">
                      {link.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#374151] mx-3 mb-4 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#D1D5DC] hover:bg-[#1E3A5F] transition-colors"
          >
            <Image src={logout} alt="Logout" width={15} height={15} />
            <p className="text-[13px] font-medium font-inter">Logout</p>
          </button>
        </div>
      </div>

      {/* ── Logout Modal ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-70 px-4">
          <div className="bg-white rounded p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Image src={logout} alt="Logout" width={22} height={22} />
              </div>
            </div>
            <h3 className="text-[20px] font-semibold font-ibm-plex-sans text-gray-900 text-center mb-2">
              Confirm Log-out
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
