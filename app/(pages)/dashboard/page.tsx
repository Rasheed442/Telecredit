"use client";

import AgingBucketChart from '@/components/DashboardCompo/AirtimeVsDataChart';
import TelcoPerformance from '@/components/DashboardCompo/TelcoPerformance';
import CustomerPanel from '@/components/DashboardCompo/CustomerPanel';
import FraudPanel from '@/components/DashboardCompo/FraudPanel';
import LoanRequestTable from '@/components/DashboardCompo/LoanRequestTable';
import LoanRequestTrend from '@/components/DashboardCompo/LoanRequestTrend';
import RiskPanel from '@/components/DashboardCompo/RiskPanel';
import MetricsCard from '@/components/DashboardCompo/MetricsCard';
import { arrowup, calender, cube, cube2, cube3, cube4, quicklink, activeb, behav, blocked, deliquent, money, outstanding, profit, trending } from '@/constant'
import Image from 'next/image'
import React from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { AiOutlineDown } from 'react-icons/ai';

function page() {
    const metricsData = [
                {
            title: "Total Disbursed",
            value: "1,296",
            change: 8.2,
            changeText: "vs Last Month",
            icon: money
        },
        {
            title: "Total Recoveries",
            value: "987",
            change: 12.5,
            changeText: "vs Last Month",
            icon: trending
        },
        {
            title: "Outstanding Balance",
            value: "₦12.3M",
            change: 6.4,
            changeText: "vs Last Month",
            icon: outstanding
        },
        {
            title: "Active Borrowers",
            value: "542",
            change: -5.8,
            changeText: "vs Last Month",
            icon: activeb
        },
        {
            title: "Delinquent Borrowers",
            value: "742",
            change: 3.2,
            changeText: "vs Last Month",
            icon: deliquent
        },
        {
            title: "Hard Block Customers",
            value: "23",
            change: 18.7,
            changeText: "vs Last Month",
            icon: blocked
        },
        {
            title: "Portfolio Profit",
            value: "₦45.3k",
            change: 6.4,
            changeText: "vs Last Month",
            icon: profit
        },
        {
            title: "Avg Behavioral Risk",
            value: "15.2%",
            change: 15.2,
            changeText: "vs Last Month",
            icon: behav
        }
    ];

    const LoansCredit = [
        {
            loan: `48.9`,
            name: "Total Loans Issued",
            count: 54.8,
            image: cube
        },
        {
            loan: "2,847",
            name: "Active Loans",
            count: 10,
            image: cube2
        },
        {
            loan: `87.3`,
            name: "Repayment Rate",
            count: 12.4,
            image: cube3
        },
        {
            loan: `10.3`,
            name: "Total Revenue",
            count: 62,
            image: cube4
        }
    ]
    return (
        <div className='px-6 pt-5'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col'>
                    <p className='font-sf-pro text-[28px] text-[#1F2937] font-semibold '>Welcome back, Admin 👋</p>
                    <span className='font-mulish text-[16px] font-normal text-[#667085]'>Monitor loan activity, manage airtime & data credits in real time.</span>

                </div>
                <div className='border border-[#EBEBEB] flex items-center px-4 gap-2 rounded-sm bg-white py-2 cursor-pointer'>
                    <Image src={calender} alt='calender' width={15} height={15} />
                    <p className='text-gray-500 text-[14px] font-medium font-mulish'>This Year </p>
                    <AiOutlineDown color='#344054' size={14}/>
                </div>
            </div>

            {/* Metrics Section */}
            <div className='grid grid-cols-4 gap-3 pt-6'>
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

          
                <div className='grid grid-cols-[60%_40%] gap-4 py-6 pr-4'>
                    <div className=''>
                        <LoanRequestTrend />
                    </div>
                    <div className=''>
                        <AgingBucketChart />
                    </div>
                </div>

                {/* Telco Performance Section */}
                <div className='py-4 pr-4'>
                    <TelcoPerformance />
                </div>

                {/* Risk Panels Section */}
                <RiskPanel/>
                <LoanRequestTable/>

        </div>
    )
}

export default page