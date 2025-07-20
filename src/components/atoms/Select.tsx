/**
 * 下拉选择组件
 * 支持搜索、多选、分组等功能
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  status?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled' | 'underlined';
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  maxHeight?: number;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择',
  label,
  error,
  hint,
  status = 'default',
  size = 'md',
  variant = 'outlined',
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  loading = false,
  maxHeight = 300,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 处理键盘导航
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev < filteredOptions.length - 1 ? prev + 1 : prev;
            scrollToOption(next);
            return next;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : 0;
            scrollToOption(next);
            return next;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex]);

  // 过滤选项
  const filteredOptions = searchable && searchTerm
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // 分组选项
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const group = option.group || '';
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {} as Record<string, SelectOption[]>);

  // 获取选中的选项
  const getSelectedOptions = (): SelectOption[] => {
    if (!value) return [];
    const values = Array.isArray(value) ? value : [value];
    return options.filter((option) => values.includes(option.value));
  };

  // 获取显示文本
  const getDisplayText = (): string => {
    const selected = getSelectedOptions();
    if (selected.length === 0) return '';
    if (multiple) {
      return selected.map((opt) => opt.label).join(', ');
    }
    return selected[0].label;
  };

  // 处理选择
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }
    setSearchTerm('');
  };

  // 处理清除
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : '');
  };

  // 滚动到选项
  const scrollToOption = (index: number) => {
    if (listRef.current) {
      const options = listRef.current.querySelectorAll('li[role="option"]');
      const option = options[index] as HTMLElement;
      if (option) {
        option.scrollIntoView({ block: 'nearest' });
      }
    }
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
      ${status === 'default' ? 'border-gray-300 focus-within:border-yes-blue' : ''}
    `,
    filled: `
      bg-gray-100 rounded-lg border-2 border-transparent
      ${status === 'error' ? 'border-red-500' : ''}
      ${status === 'success' ? 'border-green-500' : ''}
      ${status === 'default' ? 'focus-within:border-yes-blue' : ''}
    `,
    underlined: `
      border-b-2 rounded-none
      ${status === 'error' ? 'border-red-500' : ''}
      ${status === 'success' ? 'border-green-500' : ''}
      ${status === 'default' ? 'border-gray-300 focus-within:border-yes-blue' : ''}
    `,
  };

  const displayText = getDisplayText();
  const hasValue = multiple ? (value as any[])?.length > 0 : !!value;

  return (
    <div ref={selectRef} className={`relative ${className}`}>
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

      {/* 选择器主体 */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          relative cursor-pointer
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
          transition-all duration-200
        `}
      >
        <div className="flex items-center h-full px-3">
          {/* 搜索输入框 */}
          {searchable && isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="flex-1 outline-none bg-transparent"
              autoFocus
            />
          ) : (
            <span className={`flex-1 truncate ${!hasValue ? 'text-gray-400' : ''}`}>
              {displayText || placeholder}
            </span>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center gap-1 ml-2">
            {/* 清除按钮 */}
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* 加载状态 */}
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              /* 下拉箭头 */
              <svg
                className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* 下拉列表 */}
      <AnimatePresence>
        {isOpen && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <ul
              ref={listRef}
              className="py-1 overflow-auto"
              style={{ maxHeight: `${maxHeight}px` }}
              role="listbox"
            >
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-gray-500 text-center">无匹配选项</li>
              ) : (
                Object.entries(groupedOptions).map(([group, groupOptions]) => (
                  <React.Fragment key={group}>
                    {group && (
                      <li className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                        {group}
                      </li>
                    )}
                    {groupOptions.map((option, index) => {
                      const isSelected = multiple
                        ? (value as any[])?.includes(option.value)
                        : value === option.value;
                      const globalIndex = filteredOptions.indexOf(option);
                      const isHighlighted = highlightedIndex === globalIndex;

                      return (
                        <li
                          key={option.value}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(option)}
                          onMouseEnter={() => setHighlightedIndex(globalIndex)}
                          className={`
                            px-3 py-2 cursor-pointer transition-colors
                            ${isSelected ? 'bg-yes-blue text-white' : ''}
                            ${isHighlighted && !isSelected ? 'bg-gray-100' : ''}
                            ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                            ${!isSelected && !isHighlighted ? 'hover:bg-gray-50' : ''}
                          `}
                        >
                          <div className="flex items-center">
                            {multiple && (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="mr-2"
                              />
                            )}
                            <span>{option.label}</span>
                          </div>
                        </li>
                      );
                    })}
                  </React.Fragment>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
};