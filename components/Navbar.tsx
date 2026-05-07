
"use client"

import React, { useState, useEffect } from 'react'
import { Dashborad, Tel, caution, coll, archieve, key, logo, logout, sysj } from '@/constant'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

function Navbar() {
    const route = useRouter();
    const pathname = usePathname();

    const navSections = [
        {
            title: "OVERVIEW",
            links: [
                { name: "Executive Dashboard", icon: Dashborad, link: "/dashboard" },
            ]
        },
        {
            title: "PORTFOLIO",
            links: [
                { name: "Live Portfolio", icon: Tel, link: "/live-portfolio" },
            ]
        },
        {
            title: "RISKS",
            links: [
                { name: "Customer Risk Center", icon: caution, link: "/customer-risk" },
                { name: "Fraud & Underwriting", icon: coll, link: "/fraud-underwriting" },
            ]
        },
        {
            title: "OPERATIONS",
            links: [
                { name: "Callback Audit", icon: archieve, link: "/callback-audit" },
                { name: "Analytics", icon: key, link: "/analytics" },
                { name: "System Jobs", icon: sysj, link: "/system-jobs" },
            ]
        }
    ];

    // Find the initial active link based on current pathname
    const getInitialActiveLink = () => {
        for (const section of navSections) {
            for (const link of section.links) {
                if (link.link === pathname) {
                    return link.name;
                }
            }
        }
        return "Executive Dashboard"; // Default fallback
    };
    
    const [activeLink, setActiveLink] = useState(getInitialActiveLink());

    useEffect(() => {
        // Find matching link based on current path
        const findActiveLink = () => {
            for (const section of navSections) {
                for (const link of section.links) {
                    if (link.link === pathname) {
                        return link.name;
                    }
                }
            }
            return "Executive Dashboard"; // Default fallback
        };

        setActiveLink(findActiveLink());
    }, [pathname, navSections]);

    const handleLogout = () => {
        // Add logout logic here
        route.push('/');
    };

    return (
        <div className='flex flex-col bg-[#0B1F3A] h-[100vh]'>
            {/* Logo */}
            <div className='flex items-center justify-center pt-8 pb-6'>
                <Image src={logo} alt="TeleCredit" width={120} height={120} />
            </div>

            {/* Navigation Sections */}
            <div className='flex-1 px-4 pt-4'>
                {navSections.map((section, sectionIndex) => (
                    <div key={section.title} className={`mb-6 ${sectionIndex > 0 ? 'mt-8' : ''}`}>
                        <p className='text-[13px] pl-1 text-white font-light font-ibm-plex-sans uppercase tracking-wider mb-1'>
                            {section.title}
                        </p>
                        <div className='flex flex-col gap-1'>
                            {section.links.map((link) => (
                                <Link
                                    href={link.link}
                                    key={link.name}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                                        activeLink === link.name 
                                            ? 'bg-[#5490DE] text-white' 
                                            : 'text-[#D1D5DC] hover:bg-[#1E3A5F]'
                                    }`}
                                >
                                    <Image 
                                        src={link.icon} 
                                        alt={link.name} 
                                        width={16} 
                                        height={16} 
                                        className={activeLink === link.name ? 'brightness-0 invert' : ''}
                                    />
                                    <p className='text-[14px] font-medium font-inter'>
                                        {link.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout Section */}
            <div className='border-t border-[#374151] mx-4 mb-4 pt-4'>
                <div
                    onClick={handleLogout}
                    className='flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-[#D1D5DC] hover:bg-[#1E3A5F] transition-colors'
                >
                    <div className='flex items-center gap-3'>
                        <Image src={logout} alt="Logout" width={16} height={16} />
                        <p className='text-[14px] font-medium font-inter'>Logout</p>
                    </div>
                    <Image src={logout} alt="Arrow" width={12} height={12} className='rotate-180' />
                </div>
            </div>
        </div>
    )
}

export default Navbar