import { speedo } from '@/constant'
import Image from 'next/image'
import React from 'react'

function RiskPanel() {
    const riskpanel = [
        {
            name:"Total loan exposure",
            value:"12.5M"
        },
        {
            name:"PAR(%)",
            value:"2.3%"
        },
        {
            name:"Default Rate",
            value:"1.2%"
        }
    ]
  return (
    <div className='bg-white rounded-lg p-4 border border-[#E5E7EB]'>
        <p className='text-[#1F2937] text-[20px] font-ibm-flex-sans font-medium pb-2'>Risk Panel: <span className='text-[#667085] font-mulish text-[18px] font-normal'>Core Lending Health</span></p>
        <Image src={speedo} alt='speedo' width={500} height={400} />
        <div className='flex flex-wrap justify-between gap-4 pt-6'>
            {riskpanel.map((item, index) => (
                <div key={index} className='flex flex-col gap-1'>
                    <p className='text-[#667085] text-[16px] font-ibm-flex-sans font-medium'>{item.name}</p>
                    <p className='text-[#1F2937] text-[20px] font-bold font-mulish'>{item.value}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default RiskPanel