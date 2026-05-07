"use client"

import Header from '@/components/Header'
import React, { ReactNode, Suspense, memo } from 'react'
import { ComponentLoadingSpinner } from '@/components/ui/loading-spinner'
import Navbar from '@/components/Navbar';

interface LayoutProps {
  children: ReactNode;
}

// Memoized Header component to prevent unnecessary re-renders
const MemoizedHeader = memo(Header);

const layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50"> 
      <div className='grid grid-cols-[1.7fr_9fr]'>
        <Suspense fallback={<ComponentLoadingSpinner height="h-screen" />}>
          <Navbar/>
        </Suspense>
         
        <div className="bg-[#F8FAFC] h-[100vh] overflow-y-auto">
          <Header />

          <Suspense >
            {children}
          </Suspense>
        </div>
      </div>   
    </div>
  )
}

export default layout