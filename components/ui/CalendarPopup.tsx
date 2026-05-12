"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { calender } from "@/constant";
import Image from "next/image";

interface CalendarPopupProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  trigger?: React.ReactNode;
  className?: string;
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({
  selectedDate,
  onDateChange,
  trigger,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = newDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    onDateChange(formattedDate);
    setIsOpen(false);
  };

  const handleQuickSelect = (option: string) => {
    const today = new Date();
    let newDate = new Date();

    switch (option) {
      case 'today':
        break;
      case 'thisWeek':
        newDate.setDate(today.getDate() + 7);
        break;
      case 'thisMonth':
        newDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'thisYear':
        newDate = new Date(today.getFullYear(), 11, 31);
        break;
    }

    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    onDateChange(`${option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1')}`);
    setIsOpen(false);
  };

  const quickSelectOptions = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'This Year', value: 'thisYear' },
  ];

  const calendarDays = generateCalendarDays();

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-[#EBEBEB] flex items-center px-3 sm:px-4 gap-2 rounded-sm bg-white py-2 cursor-pointer hover:border-gray-300 transition-colors"
      >
        <Image src={calender} alt="calendar" width={14} height={14} />
        <p className="text-gray-500 text-[13px] sm:text-[14px] font-medium font-mulish whitespace-nowrap">
          {selectedDate}
        </p>
        <ChevronRight
          className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calendar Content */}
          <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 sm:w-96">
            {/* Quick Select Options */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Select</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickSelectOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleQuickSelect(option.value)}
                    className="px-3 py-2 text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <h3 className="text-sm font-semibold text-gray-800">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Day Headers */}
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div
                  key={index}
                  className="text-xs font-semibold text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`text-xs sm:text-sm py-2 rounded-md cursor-pointer transition-colors ${
                    day
                      ? 'hover:bg-blue-50 text-gray-700'
                      : 'text-transparent'
                  }`}
                  onClick={() => day && handleDateSelect(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarPopup;
