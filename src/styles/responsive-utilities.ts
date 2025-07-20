import { useState, useEffect } from 'react';

// 响应式断点系统
export const breakpoints = {
  xs: 0,      // 手机竖屏 (< 640px)
  sm: 640,    // 手机横屏 / 小平板
  md: 768,    // 平板竖屏
  lg: 1024,   // 平板横屏 / 小笔记本
  xl: 1280,   // 桌面
  '2xl': 1536 // 大屏幕
} as const;

// 媒体查询辅助函数
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
  
  // 范围查询
  mobile: `@media (max-width: ${breakpoints.md - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.lg}px)`,
  
  // 方向查询
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  // 触摸设备
  touch: '@media (hover: none) and (pointer: coarse)',
  mouse: '@media (hover: hover) and (pointer: fine)',
  
  // 高分辨率屏幕
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // 暗色模式
  dark: '@media (prefers-color-scheme: dark)',
  
  // 动画偏好
  reducedMotion: '@media (prefers-reduced-motion: reduce)'
};

// 响应式值类型
export type ResponsiveValue<T> = T | {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

// 获取当前断点
export const getCurrentBreakpoint = (): keyof typeof breakpoints => {
  const width = window.innerWidth;
  
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

// 判断是否为移动设备
export const isMobile = (): boolean => {
  return window.innerWidth < breakpoints.md;
};

// 判断是否为平板设备
export const isTablet = (): boolean => {
  const width = window.innerWidth;
  return width >= breakpoints.md && width < breakpoints.lg;
};

// 判断是否为桌面设备
export const isDesktop = (): boolean => {
  return window.innerWidth >= breakpoints.lg;
};

// 判断是否为触摸设备
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// 响应式间距系统
export const spacing = {
  xs: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    '2xl': '2rem',  // 32px
    '3xl': '3rem'   // 48px
  },
  sm: {
    xs: '0.375rem', // 6px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem'   // 64px
  },
  md: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    '2xl': '4rem',  // 64px
    '3xl': '5rem'   // 80px
  },
  lg: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    '2xl': '4rem',  // 64px
    '3xl': '6rem'   // 96px
  }
};

// 响应式字体大小
export const fontSize = {
  xs: {
    xs: '0.625rem',   // 10px
    sm: '0.75rem',    // 12px
    base: '0.875rem', // 14px
    lg: '1rem',       // 16px
    xl: '1.125rem',   // 18px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    '4xl': '2rem',    // 32px
    '5xl': '2.5rem',  // 40px
    '6xl': '3rem'     // 48px
  },
  sm: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem'  // 60px
  },
  md: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '4.5rem'   // 72px
  }
};

// 响应式容器宽度
export const containerWidth = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// React Hook: 使用响应式断点
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint());
  
  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    breakpoint,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2xl: breakpoint === '2xl'
  };
};

// 响应式值解析器
export const resolveResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  breakpoint: keyof typeof breakpoints
): T | undefined => {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }
  
  const breakpointOrder: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  // 从当前断点向下查找最近的定义值
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (bp in value && (value as any)[bp] !== undefined) {
      return (value as any)[bp];
    }
  }
  
  return undefined;
};

// CSS-in-JS 响应式样式生成器
export const responsive = <T>(values: ResponsiveValue<T>): string => {
  if (typeof values !== 'object' || values === null) {
    return String(values);
  }
  
  let css = '';
  const breakpointOrder: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  breakpointOrder.forEach((bp) => {
    if (bp in values && (values as any)[bp] !== undefined) {
      if (bp === 'xs') {
        css += `${(values as any)[bp]}`;
      } else {
        css += `${mediaQueries[bp]} { ${(values as any)[bp]} }`;
      }
    }
  });
  
  return css;
};