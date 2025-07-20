import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavTab {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  
  const tabs: NavTab[] = [
    { id: 'home', label: '首页', icon: 'home', path: '/' },
    { id: 'products', label: '产品', icon: 'grid', path: '/products' },
    { id: 'booking', label: '预约', icon: 'calendar', path: '/training/booking' },
    { id: 'stores', label: '门店', icon: 'map', path: '/stores' },
    { id: 'profile', label: '我的', icon: 'user', path: '/about' }
  ];
  
  useEffect(() => {
    const currentTab = tabs.find(tab => {
      if (tab.path === '/') {
        return location.pathname === '/';
      }
      return location.pathname.startsWith(tab.path);
    });
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [location]);
  
  // 根据图标名称渲染 SVG 图标
  const renderIcon = (iconName: string, isActive: boolean) => {
    const iconClass = `w-6 h-6 ${isActive ? 'text-primary-600' : 'text-neutral-500'}`;
    
    switch (iconName) {
      case 'home':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'grid':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'map':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'user':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-neutral-200">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-2"
              onClick={() => setActiveTab(tab.id)}
            >
              {/* 活动指示器 */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeBottomTab"
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-primary-600"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              
              {/* 图标和标签 */}
              <motion.div
                className="flex flex-col items-center"
                whileTap={{ scale: 0.95 }}
              >
                {renderIcon(tab.icon, isActive)}
                <span className={`text-xs mt-1 ${
                  isActive ? 'text-primary-600 font-medium' : 'text-neutral-500'
                }`}>
                  {tab.label}
                </span>
              </motion.div>
              
              {/* 点击涟漪效果 */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-primary-100 rounded-lg -z-10"
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </Link>
          );
        })}
      </div>
      
      {/* 安全区域填充（适配 iPhone X 及以上） */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </div>
  );
};