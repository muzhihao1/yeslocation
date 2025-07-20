/**
 * 反馈动画组件
 * 提供成功、失败、警告等各种反馈动画效果
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface FeedbackProps {
  isVisible: boolean;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 成功动画
 */
export const SuccessAnimation: React.FC<FeedbackProps> = ({ 
  isVisible, 
  onComplete,
  size = 'md' 
}) => {
  const controls = useAnimation();
  
  const sizeMap = {
    sm: 48,
    md: 80,
    lg: 120,
  };

  useEffect(() => {
    if (isVisible) {
      controls.start({
        scale: [0, 1.2, 1],
        transition: { duration: 0.5 }
      });
    }
  }, [isVisible, controls]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onAnimationComplete={onComplete}
          className="flex items-center justify-center"
        >
          <motion.div
            animate={controls}
            className="relative"
            style={{ width: sizeMap[size], height: sizeMap[size] }}
          >
            {/* 背景圆圈 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-green-500 rounded-full"
            />
            
            {/* 勾号 */}
            <svg
              className="absolute inset-0 w-full h-full p-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <motion.path
                d="M5 12l5 5L20 7"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              />
            </svg>

            {/* 爆炸粒子效果 */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute inset-0"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-green-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: Math.cos(i * Math.PI / 4) * 40,
                    y: Math.sin(i * Math.PI / 4) * 40,
                    opacity: [1, 0],
                  }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * 失败动画
 */
export const ErrorAnimation: React.FC<FeedbackProps> = ({ 
  isVisible, 
  onComplete,
  size = 'md' 
}) => {
  const sizeMap = {
    sm: 48,
    md: 80,
    lg: 120,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onAnimationComplete={onComplete}
          className="flex items-center justify-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, -5, 5, 0],
            }}
            transition={{ duration: 0.5 }}
            className="relative"
            style={{ width: sizeMap[size], height: sizeMap[size] }}
          >
            {/* 背景圆圈 */}
            <div className="absolute inset-0 bg-red-500 rounded-full" />
            
            {/* 叉号 */}
            <svg
              className="absolute inset-0 w-full h-full p-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <motion.path
                d="M6 18L18 6M6 6l12 12"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * 警告动画
 */
export const WarningAnimation: React.FC<FeedbackProps> = ({ 
  isVisible, 
  onComplete,
  size = 'md' 
}) => {
  const sizeMap = {
    sm: 48,
    md: 80,
    lg: 120,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onAnimationComplete={onComplete}
          className="flex items-center justify-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="relative"
            style={{ width: sizeMap[size], height: sizeMap[size] }}
          >
            {/* 背景三角形 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-full h-full bg-yellow-500"
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                }}
              />
            </div>
            
            {/* 感叹号 */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="w-1 h-8 bg-white rounded-full mb-1" />
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Toast 通知组件
 */
export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  position = 'top',
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const positionClasses = {
    'top': 'top-4 left-1/2 -translate-x-1/2',
    'bottom': 'bottom-4 left-1/2 -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: position.includes('top') ? -20 : 20,
        scale: 0.9
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ 
        opacity: 0, 
        y: position.includes('top') ? -20 : 20,
        scale: 0.9
      }}
      className={`fixed ${positionClasses[position]} z-50`}
    >
      <div className={`${typeStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {icons[type]}
        </motion.div>
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 hover:opacity-80 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 进度条 */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left"
      />
    </motion.div>
  );
};

/**
 * 庆祝动画（五彩纸屑）
 */
export const ConfettiAnimation: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const colors = ['#FFB300', '#2196F3', '#4CAF50', '#E91E63', '#9C27B0'];
  
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-3"
              style={{
                left: `${Math.random() * 100}%`,
                top: -10,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                rotate: Math.random() * 360,
              }}
              animate={{
                y: window.innerHeight + 10,
                x: (Math.random() - 0.5) * 200,
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: "easeOut",
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * 脉冲反馈
 */
export const PulseFeedback: React.FC<{
  children: React.ReactNode;
  trigger: boolean;
  color?: string;
}> = ({ children, trigger, color = 'bg-yes-blue' }) => {
  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {trigger && (
          <motion.div
            className={`absolute inset-0 ${color} rounded-lg pointer-events-none`}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};