
"use client"

import React from 'react'
import { caution, Dashborad, Tel } from '@/constant'
import Image from 'next/image'

function Navbar() {

    const Navlinks = [
        {
            name: "Dashboard",
            icon: Dashborad
        },
        {
            name: "Tel",
            icon: Tel,
        },
        {
            name: "Caution",
            icon: caution,
        },
    ]
  return (
    <div className='flex pl-5 pt-8 flex-col gap-4 bg-[#F8FAFC] h-[92vh]'>
      {Navlinks.map((link, index) => (
        <div key={index}>
          <Image src={link.icon} alt={link.name} width={48} height={48} />
        </div>
      ))}
    </div>
  )
}

export default Navbar