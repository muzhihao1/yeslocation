/**
 * 文本域组件
 * 支持自动高度、字数统计、表情等功能
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  status?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled' | 'underlined';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  showCount?: boolean;
  maxLength?: number;
  clearable?: boolean;
  onClear?: () => void;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  status = 'default',
  size = 'md',
  variant = 'outlined',
  resize = 'vertical',
  autoResize = false,
  minRows = 3,
  maxRows = 10,
  showCount = false,
  maxLength,
  clearable = false,
  className = '',
  value,
  onChange,
  onClear,
  onFocus,
  onBlur,
  disabled,
  readOnly,
  rows = minRows,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');

  // 自动调整高度
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows * lineHeight;
      
      let newHeight = Math.max(scrollHeight, minHeight);
      if (maxHeight) {
        newHeight = Math.min(newHeight, maxHeight);
      }
      
      setTextareaHeight(`${newHeight}px`);
    }
  }, [value, autoResize, minRows, maxRows]);

  // 处理焦点
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // 处理失焦
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // 处理清除
  const handleClear = () => {
    if (textareaRef.current) {
      const event = new Event('input', { bubbles: true });
      textareaRef.current.value = '';
      textareaRef.current.dispatchEvent(event);
    }
    onClear?.();
  };

  // 插入表情
  const insertEmoji = (emoji: string) => {
    if (textareaRef.current && !disabled && !readOnly) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = textarea.value;
      const newValue = currentValue.substring(0, start) + emoji + currentValue.substring(end);
      
      // 创建事件
      const event = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      onChange?.(event);
      
      // 恢复光标位置
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    }
  };

  // 尺寸类名
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
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

  // 计算字符数
  const charCount = value ? String(value).length : 0;

  // 常用表情
  const commonEmojis = ['😊', '👍', '❤️', '🎉', '🙏', '💪', '✨', '🔥'];

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
        {/* 文本域 */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
          rows={autoResize ? undefined : rows}
          style={autoResize ? { height: textareaHeight, resize: 'none' } : { resize }}
          className={`
            w-full px-3 py-2 transition-all duration-200
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
            ${readOnly ? 'bg-gray-50 cursor-default' : ''}
            focus:outline-none focus:ring-2 focus:ring-yes-blue/20
          `}
          {...props}
        />

        {/* 工具栏 */}
        {!disabled && !readOnly && (
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            {/* 表情选择器 */}
            <div className="relative group">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="插入表情"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* 表情面板 */}
              <div className="absolute bottom-8 right-0 hidden group-hover:flex bg-white border border-gray-200 rounded-lg shadow-lg p-2 gap-1">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="w-8 h-8 hover:bg-gray-100 rounded transition-colors text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* 清除按钮 */}
            {clearable && value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="清除内容"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 底部信息栏 */}
      <div className="mt-1 flex justify-between items-start">
        {/* 错误和提示信息 */}
        <div className="flex-1 min-h-[20px]">
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
        {showCount && (
          <div className="text-xs text-gray-500 ml-2">
            {maxLength ? `${charCount} / ${maxLength}` : charCount}
          </div>
        )}
      </div>
    </div>
  );
};