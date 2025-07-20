import React from 'react';
import { motion } from 'framer-motion';
import { useContextEngine } from '../../context/ContextEngine';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
}) => {
  const { state } = useContextEngine();

  // 尺寸样式
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // 变体样式 - 更新为蓝黄色系
  const variantClasses = {
    primary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg hover:shadow-xl active:bg-secondary-700', // 主按钮用黄色
    secondary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md active:bg-primary-700', // 次按钮用蓝色
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
    ghost: 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
    danger: 'bg-error text-white hover:bg-red-600 shadow-sm hover:shadow-md active:bg-red-700',
  };

  // 禁用状态样式
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  // 加载状态
  const loadingSpinner = (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${(disabled || loading) ? disabledClasses : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {/* 加载动画 */}
      {loading && (
        <span className={iconPosition === 'left' ? 'mr-2' : 'order-2 ml-2'}>
          {loadingSpinner}
        </span>
      )}

      {/* 图标 */}
      {!loading && icon && (
        <span className={iconPosition === 'left' ? 'mr-2' : 'order-2 ml-2'}>
          {icon}
        </span>
      )}

      {/* 按钮文本 */}
      <span>{children}</span>
    </motion.button>
  );
};