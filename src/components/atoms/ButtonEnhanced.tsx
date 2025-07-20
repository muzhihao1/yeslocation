/**
 * 增强版按钮组件
 * 包含丰富的微交互效果和反馈动画
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ButtonEnhancedProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
  type?: 'button' | 'submit' | 'reset';
  ripple?: boolean;
  glow?: boolean;
  pulse?: boolean;
  hapticFeedback?: boolean;
}

interface RippleProps {
  x: number;
  y: number;
  size: number;
}

export const ButtonEnhanced: React.FC<ButtonEnhancedProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  success = false,
  error = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
  ripple = true,
  glow = false,
  pulse = false,
  hapticFeedback = true,
}) => {
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  // 尺寸样式
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-5 py-2.5 text-base min-h-[40px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  };

  // 变体样式
  const variantClasses = {
    primary: 'bg-yes-yellow text-gray-900 hover:bg-amber-400 shadow-lg hover:shadow-xl',
    secondary: 'bg-yes-blue text-white hover:bg-blue-600 shadow-sm hover:shadow-md',
    outline: 'border-2 border-yes-blue text-yes-blue hover:bg-blue-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow-md',
  };

  // 处理点击涟漪效果
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ripple || disabled || loading) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size };
    setRipples([...ripples, newRipple]);

    // 移除涟漪
    setTimeout(() => {
      setRipples((prevRipples) => prevRipples.slice(1));
    }, 600);
  };

  // 处理点击事件
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // 触觉反馈
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    handleRipple(e);
    
    if (onClick) {
      try {
        await onClick();
      } catch (err) {
        console.error('Button click error:', err);
      }
    }
  };

  // 加载动画
  const LoadingSpinner = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
        />
      </svg>
    </motion.div>
  );

  // 成功动画
  const SuccessIcon = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </motion.div>
  );

  // 错误动画
  const ErrorIcon = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: [0, -10, 10, -10, 10, 0] }}
      transition={{ 
        scale: { type: "spring", stiffness: 500, damping: 30 },
        rotate: { duration: 0.5 }
      }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </motion.div>
  );

  const isDisabled = disabled || loading || success || error;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      animate={{
        boxShadow: isPressed 
          ? 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' 
          : undefined,
      }}
      className={`
        relative inline-flex items-center justify-center
        font-medium rounded-lg overflow-hidden
        transition-all duration-200
        ${sizeClasses[size]}
        ${success ? 'bg-green-500 text-white' : error ? 'bg-red-500 text-white' : variantClasses[variant]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        ${glow && !isDisabled ? 'shadow-glow' : ''}
        ${pulse && !isDisabled ? 'animate-pulse-subtle' : ''}
        ${className}
      `}
      disabled={isDisabled}
      onClick={handleClick}
      type={type}
    >
      {/* 涟漪效果容器 */}
      <span className="absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {ripples.map((ripple, index) => (
            <motion.span
              key={index}
              className="absolute bg-white/30 rounded-full"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </span>

      {/* 内容容器 */}
      <span className="relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSpinner key="loading" />
          ) : success ? (
            <SuccessIcon key="success" />
          ) : error ? (
            <ErrorIcon key="error" />
          ) : (
            <motion.span
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              {icon && iconPosition === 'left' && (
                <span className="mr-2">{icon}</span>
              )}
              <span>{children}</span>
              {icon && iconPosition === 'right' && (
                <span className="ml-2">{icon}</span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* 聚焦环 */}
      <span className="absolute inset-0 rounded-lg ring-2 ring-yes-blue ring-opacity-0 focus-within:ring-opacity-50 transition-all duration-200" />

      {/* 悬停光晕效果 */}
      {glow && !isDisabled && (
        <motion.span
          className="absolute inset-0 rounded-lg opacity-0"
          style={{
            background: variant === 'primary' 
              ? 'radial-gradient(circle at center, rgba(255, 179, 0, 0.3), transparent)'
              : 'radial-gradient(circle at center, rgba(33, 150, 243, 0.3), transparent)',
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

// 添加自定义样式到全局CSS
const styles = `
@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(33, 150, 243, 0.3);
}
`;