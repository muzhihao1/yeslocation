import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  maxDate,
  disabledDates = [],
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  
  // 获取月份的天数
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  // 获取月份第一天是星期几
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  // 生成日历天数数组
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    
    const days: (Date | null)[] = [];
    
    // 添加空白天数
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // 添加月份的天数
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  // 检查日期是否被禁用
  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    
    // 检查最小日期
    if (minDate && date < minDate) return true;
    
    // 检查最大日期
    if (maxDate && date > maxDate) return true;
    
    // 检查禁用日期列表
    return disabledDates.some(
      disabled =>
        disabled.getFullYear() === date.getFullYear() &&
        disabled.getMonth() === date.getMonth() &&
        disabled.getDate() === date.getDate()
    );
  };
  
  // 检查日期是否被选中
  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    
    return (
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getDate() === date.getDate()
    );
  };
  
  // 检查是否是今天
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    );
  };
  
  // 切换月份
  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };
  
  // 格式化月份显示
  const formatMonthYear = (date: Date) => {
    const months = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    return `${date.getFullYear()}年 ${months[date.getMonth()]}`;
  };
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const calendarDays = generateCalendarDays();
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth('prev')}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="上一月"
        >
          <svg
            className="w-5 h-5 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold text-neutral-800">
          {formatMonthYear(currentMonth)}
        </h3>
        
        <button
          onClick={() => changeMonth('next')}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="下一月"
        >
          <svg
            className="w-5 h-5 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      
      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-neutral-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const disabled = isDateDisabled(date);
          const selected = isDateSelected(date);
          const today = isToday(date);
          
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }
          
          return (
            <motion.button
              key={date.toISOString()}
              onClick={() => !disabled && onDateSelect(date)}
              disabled={disabled}
              whileHover={!disabled ? { scale: 1.05 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                transition-colors relative
                ${disabled
                  ? 'text-neutral-300 cursor-not-allowed'
                  : selected
                  ? 'bg-primary-500 text-white'
                  : today
                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  : 'text-neutral-700 hover:bg-neutral-100'
                }
              `}
            >
              {date.getDate()}
              {today && !selected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* 今日快捷按钮 */}
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <button
          onClick={() => {
            const today = new Date();
            setCurrentMonth(today);
            onDateSelect(today);
          }}
          className="w-full py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          返回今天
        </button>
      </div>
    </div>
  );
};