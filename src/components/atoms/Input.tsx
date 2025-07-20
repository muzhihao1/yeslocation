/**
 * 输入框组件
 * 支持验证、格式化、移动端优化等功能
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  status?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled' | 'underlined';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
  formatter?: (value: string) => string;
  restrictor?: (value: string) => string;
  showCount?: boolean;
  maxLength?: number;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  status = 'default',
  size = 'md',
  variant = 'outlined',
  icon,
  iconPosition = 'left',
  clearable = false,
  formatter,
  restrictor,
  showCount = false,
  maxLength,
  className = '',
  value,
  onChange,
  onClear,
  onFocus,
  onBlur,
  disabled,
  readOnly,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理输入值变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // 应用输入限制
    if (restrictor) {
      newValue = restrictor(newValue);
    }

    // 应用格式化
    if (formatter) {
      newValue = formatter(newValue);
    }

    // 创建新的事件对象
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: newValue,
      },
    };

    onChange?.(newEvent as React.ChangeEvent<HTMLInputElement>);
  };

  // 处理清除
  const handleClear = () => {
    if (inputRef.current) {
      const event = new Event('input', { bubbles: true });
      inputRef.current.value = '';
      inputRef.current.dispatchEvent(event);
    }
    onClear?.();
  };

  // 处理焦点
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // 处理失焦
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // 尺寸类名
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  };

  // 变体类名
  const variantClasses = {
    outlined: `
      border rounded-lg
      ${status === 'error' ? 'border-red-500' : ''}
      ${status === 'success' ? 'border-green-500' : ''}
      ${status === 'default' ? 'border-gray-300 focus:border-yes-blue' : ''}
    `,
    filled: `
      bg-gray-100 rounded-lg border-2 border-transparent
      ${status === 'error' ? 'border-red-500' : ''}
      ${status === 'success' ? 'border-green-500' : ''}
      ${status === 'default' ? 'focus:border-yes-blue' : ''}
    `,
    underlined: `
      border-b-2 rounded-none
      ${status === 'error' ? 'border-red-500' : ''}
      ${status === 'success' ? 'border-green-500' : ''}
      ${status === 'default' ? 'border-gray-300 focus:border-yes-blue' : ''}
    `,
  };

  // 是否显示密码切换按钮
  const isPasswordType = props.type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : props.type;

  // 计算字符数
  const charCount = value ? String(value).length : 0;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          className={`
            block mb-1 font-medium transition-colors
            ${status === 'error' ? 'text-red-600' : 'text-gray-700'}
            ${size === 'sm' ? 'text-sm' : ''}
            ${size === 'lg' ? 'text-lg' : ''}
          `}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* 左侧图标 */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* 输入框 */}
        <input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
          className={`
            w-full px-3 transition-all duration-200
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${clearable && value ? 'pr-10' : ''}
            ${isPasswordType ? 'pr-10' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
            ${readOnly ? 'bg-gray-50 cursor-default' : ''}
            focus:outline-none focus:ring-2 focus:ring-yes-blue/20
          `}
          {...props}
          type={inputType}
        />

        {/* 右侧图标 */}
        {icon && iconPosition === 'right' && !clearable && !isPasswordType && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* 清除按钮 */}
        {clearable && value && !disabled && !readOnly && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* 密码显示切换 */}
        {isPasswordType && !disabled && !readOnly && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* 提示信息和错误信息 */}
      <div className="mt-1 min-h-[20px]">
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
          {!error && hint && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-gray-500"
            >
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 字符计数 */}
      {showCount && maxLength && (
        <div className="absolute right-0 -bottom-6 text-xs text-gray-500">
          {charCount} / {maxLength}
        </div>
      )}
    </div>
  );
};