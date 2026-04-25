
"use client"

import React from 'react'
import { archieve, caution, coll, Dashborad, key, logout, setting, Tel } from '@/constant'
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
        {
            name: "cell",
            icon: coll,
        },
        {
            name: "arc",
            icon: archieve,
        },
        {
            name: "key",
            icon: key,
        },
        {
            name: "setting",
            icon: setting,
        },
        {
            name: "logout",
            icon: logout,
        },
    ]
  return (
    <div className='flex pl-5 pt-8 flex-col gap-4 bg-[#F8FAFC] h-[92vh]'>
      {Navlinks.map((link, index) => (
        <div key={link.name} className={`${index === 6  ? 'pt-[80px]' : ''}`}>
          <Image src={link.icon} alt={link.name} width={48} height={48} />
        </div>
      ))}
    </div>
  )
}

export default Navbar