"use client";

import AirtimeVsDataChart from '@/components/DashboardCompo/AirtimeVsDataChart';
import CustomerPanel from '@/components/DashboardCompo/CustomerPanel';
import FraudPanel from '@/components/DashboardCompo/FraudPanel';
import LoanRequestTable from '@/components/DashboardCompo/LoanRequestTable';
import LoanRequestTrend from '@/components/DashboardCompo/LoanRequestTrend';
import RiskPanel from '@/components/DashboardCompo/RiskPanel';
import { arrowup, calender, cube, cube2, cube3, cube4, quicklink } from '@/constant'
import Image from 'next/image'
import React from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";

function page() {
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
        <div className='px-4'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <p className='font-ibm-plex-sans text-[28px] text-[#1F2937] font-semibold '>Welcome back, Admin 👋</p>
                    <span className='font-mulish text-[16px] font-normal text-[#667085]'>Monitor loan activity, manage airtime & data credits in real time.</span>

                </div>
                <div className='border-2 border-[#EBEBEB] flex items-center px-4 gap-2 rounded-full py-2'>
                    <Image src={calender} alt='calender' width={15} height={15} />
                    <p className='text-[#344054] text-[14px] font-medium font-mulish'>This Year</p>
                </div>
            </div>

            <div className='grid grid-cols-[55%_45%] pt-4 gap-4 pr-4'>
                <div className='h-[400px] w-full bg-cover bg-center bg-top rounded-3xl flex items-end px-4 pb-2 relative transition-all hover:scale-[1.02] hover:brightness-110 group' style={{ backgroundImage: `url(${quicklink.src})` }}>
                    <div className='flex flex-col'>
                        <p className='text-[22px] font-ibm-plex-sans text-white font-medium'>Quick Links</p>
                        <span className='text-[14px] font-normal font-ibm-plex-sans text-white'>Key actions helping admins complete tasks quickly and efficiently.</span>
                        <div className='py-4 flex items-center gap-2'>
                            <button
                                className="flex items-center gap-2 relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/30 text-white px-3  rounded-full font-mulish font-semibold text-[14px] transition-all hover:bg-white/20 hover:border-white/50 z-20 cursor-pointer before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-[150%] group-hover:before:translate-x-[150%] before:transition-transform before:duration-700 animate-shadow-pulse"
                            >
                                Processed Loan
                                <Image src={arrowup} alt='arrowup' width={35} height={35} className='pt-2' />
                            </button>
                            <button
                                className="flex items-center gap-2 relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/30 text-white px-3  rounded-full font-mulish font-semibold text-[14px] transition-all hover:bg-white/20 hover:border-white/50 z-20 cursor-pointer before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-[150%] group-hover:before:translate-x-[150%] before:transition-transform before:duration-700 animate-shadow-pulse"
                            >
                                Add Data Plans
                                <Image src={arrowup} alt='arrowup' width={35} height={35} className='pt-2' />
                            </button>
                            <button
                                className="flex items-center gap-2 relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/30 text-white px-3  rounded-full font-mulish font-semibold text-[14px] transition-all hover:bg-white/20 hover:border-white/50 z-20 cursor-pointer before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-[150%] group-hover:before:translate-x-[150%] before:transition-transform before:duration-700 animate-shadow-pulse"
                            >
                                Send broadcast
                                <Image src={arrowup} alt='arrowup' width={35} height={35} className='pt-2' />
                            </button>
                        </div>
                    </div>
                </div>
                <div className=' grid grid-cols-2 gap-4'>
                    {
                        LoansCredit?.map((d, i) => {
                            return <div key={i} className={`${i === 0 ? 'bg-[#9E97FF]' : i === 1 ? 'bg-[#4CBFFF]' : i === 2 ? 'bg-[#BEC9DA]' : i === 3 ? 'bg-[#FFC197]' : 'bg-[#BEC9DA]'} rounded-xl px-4 py-4 flex flex-col justify-between`}>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <Image src={d?.image} alt='cube' width={40} height={40} />
                                        <p className={`font-mulish font-semibold text-[17px]  ${i === 0 || i === 1 ? 'text-white' : 'text-[#1F2937]'}`}>{d?.name}</p>
                                    </div>
                                    <BsThreeDotsVertical size={24} />
                                </div>
                                <p className={`font-ibm-plex-sans font-medium ${i === 0 || i === 1 ? 'text-white' : 'text-[#1F2937]'}  text-[30px]`}> {i === 0 || i === 3 ? "₦" : ""}{d?.loan}{i === 0 || i === 3 ? "M" : i === 2 ? "%" : ""}</p>

                                <div className='flex items-center justify-between'>
                                    <p className={`flex items-center gap-1 text-[14px] ${d?.count >= 50 ? 'bg-[#ECFDF3]' : 'bg-[#E8F5E9]'} rounded-full px-3 py-1 ${d?.count >= 50 ? "text-[#039855]" : "text-[#B42318]"}`}>{d?.count >= 50 ? <IoMdArrowUp color='#027A48' size={15} /> : <IoMdArrowDown color='#FF6B6B' size={15} />}{d?.count}%</p>
                                    <span className={`font-mulish font-medium text-[15px] ${i === 0 || i === 1 ? 'text-white' : 'text-[#1F2937]'}`}>VS Last Year</span>
                                </div>
                            </div>
                        })
                    }

                    
                </div>

            </div>
                <div className='grid grid-cols-[70%_30%] gap-4 py-6 pr-4'>
                    <div className=''>
                        <LoanRequestTrend />
                    </div>
                    <div className=''>
                        <AirtimeVsDataChart />
                    </div>
                </div>

                <div className='grid grid-cols-[30%_35%_35%] gap-4 pr-8'>
                    <RiskPanel/>
                    <FraudPanel/>
                    <CustomerPanel/>
                </div>
                <LoanRequestTable/>

        </div>
    )
}

export default page