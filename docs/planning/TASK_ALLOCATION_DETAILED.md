# 耶氏体育网站修改任务分配方案（详细版）

## 终端A负责任务详细说明

### 1. 视觉设计修改方案实施 🔴

#### 1.1 色彩系统更新（已完成）
- [x] 蓝黄色系配置完成

#### 1.2 应用新色系到所有页面组件（当前任务）

**具体实施代码：**

1. **创建全局CSS变量** `src/index.css`
```css
:root {
  /* 主色调 - 蓝色系 */
  --color-primary-dark: #1565C0;
  --color-primary-main: #2196F3;
  --color-primary-light: #64B5F6;
  --color-primary-pale: #E3F2FD;
  
  /* 辅助色 - 黄色系 */
  --color-secondary-main: #FFB300;
  --color-secondary-light: #FFD54F;
  --color-secondary-dark: #FF8F00;
  --color-secondary-pale: #FFF8E1;
  
  /* 中性色 */
  --color-neutral-900: #212121;
  --color-neutral-700: #424242;
  --color-neutral-500: #757575;
  --color-neutral-300: #E0E0E0;
  --color-neutral-100: #F5F5F5;
  --color-neutral-50: #FAFAFA;
  
  /* 功能色 */
  --color-success: #4CAF50;
  --color-warning: #FFA726;
  --color-error: #F44336;
  --color-info: #29B6F6;
}
```

2. **更新Button组件** `src/components/Button.tsx`
```jsx
const Button = ({ variant = 'primary', size = 'md', ...props }) => {
  const variants = {
    primary: 'bg-secondary hover:bg-secondary-dark text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-primary hover:bg-primary-dark text-white',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`
        rounded-lg transition-all duration-300 font-medium
        ${variants[variant]} ${sizes[size]}
        transform hover:-translate-y-0.5 active:translate-y-0
      `}
      {...props}
    />
  );
};
```

3. **更新Hero渐变背景**
```scss
.hero-gradient {
  background: linear-gradient(135deg, #1565C0 0%, #2196F3 50%, #64B5F6 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/pattern.svg');
    opacity: 0.1;
  }
}
```

#### 1.3 字体系统实施

**实施步骤：**

1. **安装字体** `public/index.html`
```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- 思源黑体 -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
```

2. **字体系统配置**
```scss
// 字体定义
$font-display: 'Montserrat', 'Noto Sans SC', 'PingFang SC', sans-serif;
$font-body: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;

// 字体大小系统
$font-sizes: (
  'display': 4.5rem,    // 72px
  'h1': 3rem,          // 48px
  'h2': 2.25rem,       // 36px
  'h3': 1.875rem,      // 30px
  'h4': 1.5rem,        // 24px
  'body-lg': 1.125rem, // 18px
  'body': 1rem,        // 16px
  'body-sm': 0.875rem, // 14px
  'caption': 0.75rem   // 12px
);
```

### 2. 技术架构优化 🔴

#### 2.1 性能优化 - 图片懒加载

**实施代码：**

1. **创建懒加载Hook** `src/hooks/useImageLazyLoad.ts`
```typescript
import { useEffect, useRef, useState } from 'react';

export const useImageLazyLoad = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return { imgRef, isLoaded, isInView, setIsLoaded };
};
```

2. **懒加载图片组件** `src/components/LazyImage.tsx`
```tsx
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}> = ({ src, alt, className = '', width, height }) => {
  const { imgRef, isLoaded, isInView, setIsLoaded } = useImageLazyLoad();

  return (
    <div className={`relative ${className}`}>
      {/* 占位符 */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}
      
      {/* 实际图片 */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
```

#### 2.2 代码分割实施

**路由懒加载配置** `src/App.tsx`
```tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLoader from './components/PageLoader';

// 懒加载页面
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const TrainingPage = lazy(() => import('./pages/TrainingPage'));
const StoresPage = lazy(() => import('./pages/StoresPage'));
const FranchisePage = lazy(() => import('./pages/FranchisePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/franchise" element={<FranchisePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Suspense>
  );
}
```

#### 2.3 SEO优化实施

**Meta标签组件** `src/components/SEO.tsx`
```tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/default-og-image.jpg',
  url = window.location.href
}) => {
  const siteTitle = '耶氏体育 - 专业台球设备与培训';
  
  return (
    <Helmet>
      <title>{title} | {siteTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
```

### 3. 功能开发 - 在线预约系统 🟡

#### 3.1 预约系统数据结构

```typescript
// src/types/booking.ts
export interface TimeSlot {
  time: string;
  available: boolean;
  maxCapacity: number;
  currentBookings: number;
}

export interface BookingData {
  id?: string;
  service: 'training' | 'experience' | 'venue';
  course?: string;
  name: string;
  phone: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export interface BusinessHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}
```

#### 3.2 预约系统核心类实现

```typescript
// src/services/BookingSystem.ts
class BookingSystem {
  private calendar: CalendarManager;
  private slots: SlotManager;
  private notifications: NotificationService;

  constructor() {
    this.calendar = new CalendarManager();
    this.slots = new SlotManager();
    this.notifications = new NotificationService();
  }

  async getAvailableSlots(date: Date, serviceType: string): Promise<TimeSlot[]> {
    const dayOfWeek = date.getDay();
    const isHoliday = await this.calendar.checkHoliday(date);
    
    // 获取营业时间
    const businessHours = this.getBusinessHours(dayOfWeek, isHoliday);
    
    // 获取已预约时间段
    const bookedSlots = await this.slots.getBookedSlots(date, serviceType);
    
    // 计算可用时间段
    return this.calculateAvailableSlots(businessHours, bookedSlots, serviceType);
  }

  private getBusinessHours(dayOfWeek: number, isHoliday: boolean): BusinessHours {
    // 节假日特殊时间
    if (isHoliday) {
      return {
        dayOfWeek,
        openTime: '10:00',
        closeTime: '22:00',
        isOpen: true
      };
    }

    // 正常营业时间
    const hours: Record<number, BusinessHours> = {
      0: { dayOfWeek: 0, openTime: '10:00', closeTime: '22:00', isOpen: true }, // 周日
      1: { dayOfWeek: 1, openTime: '14:00', closeTime: '22:00', isOpen: true }, // 周一
      2: { dayOfWeek: 2, openTime: '14:00', closeTime: '22:00', isOpen: true }, // 周二
      3: { dayOfWeek: 3, openTime: '14:00', closeTime: '22:00', isOpen: true }, // 周三
      4: { dayOfWeek: 4, openTime: '14:00', closeTime: '22:00', isOpen: true }, // 周四
      5: { dayOfWeek: 5, openTime: '14:00', closeTime: '23:00', isOpen: true }, // 周五
      6: { dayOfWeek: 6, openTime: '10:00', closeTime: '23:00', isOpen: true }, // 周六
    };

    return hours[dayOfWeek];
  }

  async createBooking(bookingData: BookingData): Promise<BookingData> {
    // 验证时间段可用性
    const isAvailable = await this.slots.checkAvailability(
      bookingData.date,
      bookingData.time,
      bookingData.service
    );

    if (!isAvailable) {
      throw new Error('该时间段已被预约');
    }

    // 创建预约
    const booking = await this.saveBooking(bookingData);
    
    // 发送确认通知
    await this.notifications.sendConfirmation(booking);
    
    // 更新时间段状态
    await this.slots.markAsBooked(bookingData.date, bookingData.time, booking.id!);

    return booking;
  }
}

export default new BookingSystem();
```

#### 3.3 预约日历组件实现

```tsx
// src/components/BookingCalendar.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import bookingSystem from '../services/BookingSystem';

export const BookingCalendar: React.FC<{
  serviceType: string;
  onSlotSelect: (date: Date, slot: TimeSlot) => void;
}> = ({ serviceType, onSlotSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // 获取当月日期
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];
    
    // 上月尾部日期
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    
    // 当月日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // 下月开头日期
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  // 日期选择处理
  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setLoading(true);
    
    try {
      const slots = await bookingSystem.getAvailableSlots(date, serviceType);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('获取时间段失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 检查日期是否可选
  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    
    return date >= today && date <= maxDate;
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="booking-calendar">
      {/* 月份导航 */}
      <div className="calendar-header flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-neutral-100 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold">
          {currentMonth.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-neutral-100 rounded-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-neutral-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isSelectable = isDateSelectable(date);
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <motion.button
              key={index}
              whileHover={isSelectable ? { scale: 1.05 } : {}}
              whileTap={isSelectable ? { scale: 0.95 } : {}}
              onClick={() => isSelectable && handleDateSelect(date)}
              disabled={!isSelectable}
              className={`
                relative p-3 rounded-lg transition-all
                ${isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'}
                ${isSelectable ? 'hover:bg-primary-50 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                ${isSelected ? 'bg-primary-500 text-white hover:bg-primary-600' : ''}
                ${isToday && !isSelected ? 'ring-2 ring-primary-500' : ''}
              `}
            >
              <span className="text-sm">{date.getDate()}</span>
            </motion.button>
          );
        })}
      </div>

      {/* 时间段选择 */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h4 className="text-lg font-semibold mb-4">选择时间</h4>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="text-neutral-600 text-center py-8">
              该日期暂无可预约时间段
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {availableSlots.map(slot => (
                <motion.button
                  key={slot.time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSlotSelect(selectedDate, slot)}
                  disabled={!slot.available}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${slot.available 
                      ? 'border-neutral-200 hover:border-primary-500 hover:bg-primary-50' 
                      : 'border-neutral-100 bg-neutral-50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="text-sm font-medium">{slot.time}</div>
                  <div className="text-xs text-neutral-600 mt-1">
                    {slot.available 
                      ? `剩余 ${slot.maxCapacity - slot.currentBookings} 位` 
                      : '已满'
                    }
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
```

### 4. 功能开发 - 智能客服系统 🟡

#### 4.1 客服系统实现

```tsx
// src/components/CustomerService.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  options?: string[];
}

export const CustomerService: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '您好！我是耶氏体育的客服助手，有什么可以帮助您的吗？',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 快捷问题
  const quickQuestions = [
    '如何预约培训课程？',
    '台球桌价格是多少？',
    '最近的门店在哪里？',
    '加盟需要什么条件？'
  ];

  // 关键词回复配置
  const keywordReplies = {
    '价格': {
      content: '我们的台球桌价格从6,800元到28,000元不等，具体取决于型号和配置。您想了解哪个系列的产品呢？',
      options: ['耶氏专业系列', '古帮特经典系列', '家用入门系列']
    },
    '培训': {
      content: '我们提供多种培训课程：\n• 基础班：2800元/30课时\n• 进阶班：3800元/30课时\n• 专业班：5800元/30课时\n• 少儿班：2200元/20课时',
      options: ['查看课程详情', '预约免费体验', '了解教练团队']
    },
    '门店': {
      content: '我们在昆明有20多家门店，请问您在哪个区域呢？',
      options: ['五华区', '盘龙区', '西山区', '官渡区']
    },
    '加盟': {
      content: '加盟耶氏体育：\n• 投资额度：30-50万\n• 回本周期：12-18个月\n• 支持政策：选址、装修、培训、运营全方位支持',
      options: ['查看加盟条件', '预约面谈', '下载加盟手册']
    }
  };

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // 显示输入状态
    setIsTyping(true);

    // 模拟延迟
    setTimeout(() => {
      const reply = getReply(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: reply.content,
        options: reply.options,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // 获取回复
  const getReply = (message: string) => {
    // 检查关键词
    for (const [keyword, reply] of Object.entries(keywordReplies)) {
      if (message.includes(keyword)) {
        return reply;
      }
    }

    // 默认回复
    return {
      content: '抱歉，我可能没有理解您的问题。您可以试试以下问题，或者直接联系人工客服。',
      options: quickQuestions
    };
  };

  // 转人工客服
  const transferToHuman = () => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: '正在为您转接人工客服，请稍候...\n客服电话：177-8714-7147\n工作时间：10:00-22:00',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-xl flex items-center justify-center z-40"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* 聊天窗口 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden z-50"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* 头部 */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="font-medium">在线客服</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={transferToHuman}
                    className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <User className="w-4 h-4 inline mr-1" />
                    转人工
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto p-4 h-[400px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  
                  {/* 快捷选项 */}
                  {msg.options && (
                    <div className="mt-2 space-y-1">
                      {msg.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(option)}
                          className="block text-sm text-primary-600 hover:bg-primary-50 px-3 py-1 rounded-lg transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-neutral-500 mt-1">
                    {msg.timestamp.toLocaleTimeString('zh-CN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
              
              {/* 输入指示器 */}
              {isTyping && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-sm">正在输入...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 快捷问题 */}
            <div className="px-4 py-2 border-t border-neutral-200">
              <div className="flex gap-2 overflow-x-auto">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="text-xs bg-neutral-100 px-3 py-1 rounded-full whitespace-nowrap hover:bg-neutral-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* 输入区域 */}
            <div className="p-4 border-t border-neutral-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                  placeholder="输入您的问题..."
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:border-primary-500 transition-colors"
                />
                <motion.button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-full transition-colors ${
                    inputValue.trim()
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
```

### 5. 数据分析与优化 🟢

#### 5.1 Google Analytics 4 集成

**安装配置** `public/index.html`
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**事件追踪Hook** `src/hooks/useAnalytics.ts`
```typescript
export const useAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  const trackPageView = (pagePath: string, pageTitle: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  };

  const trackConversion = (value: number, currency: string = 'CNY') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'G-XXXXXXXXXX/conversion',
        value: value,
        currency: currency
      });
    }
  };

  return { trackEvent, trackPageView, trackConversion };
};
```

---

## 终端B负责任务详细说明

### 1. 用户体验优化方案 🔴

详细实施内容请参考 WEBSITE_MODIFICATION_PLAN.md 中的：
- 导航结构重构（第265-499行）
- 转化路径优化（第741-1029行）
- 表单体验优化

### 2. 交互设计升级 🟡

详细实施内容请参考 WEBSITE_MODIFICATION_PLAN.md 中的：
- 微交互设计系统（第1034-1246行）
- 页面过渡动画（第1248-1304行）
- 滚动动画系统（第1306-1350行）

### 3. 功能开发 - 后半部分 🟡

- 会员系统
- 数据看板

### 4. 移动端优化 🟡

详细实施内容请参考 WEBSITE_MODIFICATION_PLAN.md 中的：
- 移动端适配策略（第2192行开始）
- PWA实现

### 5. 内容策略优化 🟢

- 文案优化
- 图片/视频资源准备
- CMS系统集成

---

## 下一步行动

### 终端A（我）的当前任务：
1. 立即开始实施"应用新色系到所有页面组件"
2. 创建全局CSS变量
3. 更新所有组件的颜色引用
4. 测试颜色一致性

### 终端B的建议开始任务：
1. 开始导航结构重构的设计和实现
2. 创建新的导航组件
3. 实现桌面端和移动端导航

最后更新：2025-01-19