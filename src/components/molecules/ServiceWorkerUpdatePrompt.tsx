/**
 * Service Worker 更新提示组件
 * 当有新版本可用时提示用户更新
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { activateUpdate } from '../../serviceWorkerRegistration';

interface ServiceWorkerUpdatePromptProps {
  registration?: ServiceWorkerRegistration;
}

export const ServiceWorkerUpdatePrompt: React.FC<ServiceWorkerUpdatePromptProps> = ({ 
  registration 
}) => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!registration) return;

    const checkForUpdate = () => {
      if (registration.waiting) {
        setShowUpdatePrompt(true);
      }
    };

    // 初始检查
    checkForUpdate();

    // 监听更新
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setShowUpdatePrompt(true);
          }
        });
      }
    });

    return () => {
      // 清理事件监听器
    };
  }, [registration]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await activateUpdate();
      // 页面会自动刷新
    } catch (error) {
      console.error('更新失败:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
    // 12小时后再次提醒
    setTimeout(() => {
      if (registration?.waiting) {
        setShowUpdatePrompt(true);
      }
    }, 12 * 60 * 60 * 1000);
  };

  return (
    <AnimatePresence>
      {showUpdatePrompt && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-yes-blue to-blue-600 p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <h3 className="font-semibold">新版本可用</h3>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="关闭"
                  disabled={isUpdating}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-3">
                耶氏体育有新版本可用，刷新页面即可获得最新功能和改进。
              </p>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 bg-yes-yellow text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isUpdating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>更新中...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>立即更新</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDismiss}
                  disabled={isUpdating}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  稍后提醒
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};