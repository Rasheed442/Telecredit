import React from 'react';
import Image from 'next/image';
import { IoMdArrowUp, IoMdArrowDown } from 'react-icons/io';

interface MetricsCardProps {
  title: string;
  value: string;
  change: number;
  changeText: string;
  icon: any;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  change, 
  changeText, 
  icon
}) => {
  const isPositive = change > 0;
  
  return (
    <div className="bg-white px-4 py-4 h-[150px] shadow-sm border border-gray-100 flex flex-col justify-between">
      {/* Icon and Title */}
      <div className="flex items-center gap-3">
          <Image src={icon} alt={title} width={20} height={20} />
        <p className="text-sm font-light text-[#667085]">
          {title}
        </p>
      </div>
         <p className="text-[28px] font-bold font-sf-pro text-gray-900">
            {value}
          </p>
      {/* Value and Change */}
      <div className="flex items-center gap-1">
        <div className={`flex items-center rounded-full text-[14px] font-medium ${
          isPositive 
            ? ' text-green-600' 
            : ' text-red-600'
        }`}>
          {isPositive ? (
            <IoMdArrowUp size={12} />
          ) : (
            <IoMdArrowDown size={12} />
          )}
          <span>
            {Math.abs(change)}%
          </span>
        </div>
          <p className="text-xs font-light text-gray-500">
            {changeText}
          </p>
        
        {/* Change Badge */}
       
      </div>
    </div>
  );
};

export default MetricsCard;
