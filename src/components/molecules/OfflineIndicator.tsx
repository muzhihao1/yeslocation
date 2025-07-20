/**
 * 离线状态指示器组件
 * 显示应用的在线/离线状态
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatusChange, setShowStatusChange] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatusChange(true);
      // 3秒后隐藏在线提示
      setTimeout(() => setShowStatusChange(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatusChange(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* 离线时的持续指示器 */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 bg-gray-800 text-white px-4 py-2 text-center z-50"
          >
            <div className="flex items-center justify-center space-x-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
              </svg>
              <span>您当前处于离线状态 - 显示缓存内容</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 状态变化时的临时提示 */}
      <AnimatePresence>
        {showStatusChange && isOnline && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.397-3.536a8.5 8.5 0 0114.794 0M4.124 10.635a11.5 11.5 0 0115.752 0" />
              </svg>
              <span className="font-medium">已恢复网络连接</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};