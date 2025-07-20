import React from 'react';
import { ResponsiveValue, resolveResponsiveValue, useBreakpoint } from '../../styles/responsive-utilities';

interface GridProps {
  children: React.ReactNode;
  cols?: ResponsiveValue<number>;
  gap?: ResponsiveValue<string | number>;
  className?: string;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = { xs: '1rem', md: '1.5rem', lg: '2rem' },
  className = '',
  alignItems = 'stretch',
  justifyItems = 'stretch'
}) => {
  const { breakpoint } = useBreakpoint();
  
  // 解析响应式值
  const currentCols = resolveResponsiveValue(cols, breakpoint) || 1;
  const currentGap = resolveResponsiveValue(gap, breakpoint) || '1rem';
  
  // 生成网格样式
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${currentCols}, 1fr)`,
    gap: typeof currentGap === 'number' ? `${currentGap}px` : currentGap,
    alignItems,
    justifyItems
  };
  
  return (
    <div className={`responsive-grid ${className}`} style={gridStyle}>
      {children}
    </div>
  );
};

interface RowProps {
  children: React.ReactNode;
  gap?: ResponsiveValue<string | number>;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  className?: string;
}

export const Row: React.FC<RowProps> = ({
  children,
  gap = { xs: '0.5rem', md: '1rem' },
  align = 'center',
  justify = 'start',
  wrap = true,
  className = ''
}) => {
  const { breakpoint } = useBreakpoint();
  const currentGap = resolveResponsiveValue(gap, breakpoint) || '1rem';
  
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  };
  
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: typeof currentGap === 'number' ? `${currentGap}px` : currentGap,
    alignItems: align,
    justifyContent: justifyMap[justify],
    flexWrap: wrap ? 'wrap' : 'nowrap'
  };
  
  return (
    <div className={`responsive-row ${className}`} style={rowStyle}>
      {children}
    </div>
  );
};

interface ColProps {
  children: React.ReactNode;
  span?: ResponsiveValue<number>;
  offset?: ResponsiveValue<number>;
  className?: string;
}

export const Col: React.FC<ColProps> = ({
  children,
  span = 12,
  offset = 0,
  className = ''
}) => {
  const { breakpoint } = useBreakpoint();
  const currentSpan = resolveResponsiveValue(span, breakpoint) || 12;
  const currentOffset = resolveResponsiveValue(offset, breakpoint) || 0;
  
  const colStyle: React.CSSProperties = {
    gridColumn: currentOffset > 0 
      ? `${currentOffset + 1} / span ${currentSpan}`
      : `span ${currentSpan}`,
    minWidth: 0 // 防止内容溢出
  };
  
  return (
    <div className={`responsive-col ${className}`} style={colStyle}>
      {children}
    </div>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  fluid?: boolean;
  maxWidth?: ResponsiveValue<string>;
  padding?: ResponsiveValue<string>;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  fluid = false,
  maxWidth = { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
  padding = { xs: '1rem', md: '1.5rem', lg: '2rem' },
  className = ''
}) => {
  const { breakpoint } = useBreakpoint();
  const currentMaxWidth = fluid ? '100%' : resolveResponsiveValue(maxWidth, breakpoint) || '100%';
  const currentPadding = resolveResponsiveValue(padding, breakpoint) || '1rem';
  
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: currentMaxWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: currentPadding,
    paddingRight: currentPadding
  };
  
  return (
    <div className={`responsive-container ${className}`} style={containerStyle}>
      {children}
    </div>
  );
};

// 响应式显示/隐藏组件
interface ShowProps {
  children: React.ReactNode;
  above?: keyof typeof import('../../styles/responsive-utilities').breakpoints;
  below?: keyof typeof import('../../styles/responsive-utilities').breakpoints;
  only?: keyof typeof import('../../styles/responsive-utilities').breakpoints | 
    (keyof typeof import('../../styles/responsive-utilities').breakpoints)[];
}

export const Show: React.FC<ShowProps> = ({ children, above, below, only }) => {
  const { breakpoint } = useBreakpoint();
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  let shouldShow = true;
  
  if (above) {
    const aboveIndex = breakpointOrder.indexOf(above);
    shouldShow = currentIndex >= aboveIndex;
  }
  
  if (below) {
    const belowIndex = breakpointOrder.indexOf(below);
    shouldShow = shouldShow && currentIndex < belowIndex;
  }
  
  if (only) {
    const onlyArray = Array.isArray(only) ? only : [only];
    shouldShow = onlyArray.includes(breakpoint);
  }
  
  return shouldShow ? <>{children}</> : null;
};

// 响应式间距组件
interface SpacerProps {
  size?: ResponsiveValue<string | number>;
  axis?: 'horizontal' | 'vertical' | 'both';
}

export const Spacer: React.FC<SpacerProps> = ({ 
  size = { xs: '1rem', md: '2rem' }, 
  axis = 'vertical' 
}) => {
  const { breakpoint } = useBreakpoint();
  const currentSize = resolveResponsiveValue(size, breakpoint) || '1rem';
  const sizeValue = typeof currentSize === 'number' ? `${currentSize}px` : currentSize;
  
  const spacerStyle: React.CSSProperties = {
    display: axis === 'horizontal' ? 'inline-block' : 'block',
    width: axis === 'vertical' ? '100%' : sizeValue,
    height: axis === 'horizontal' ? '100%' : sizeValue,
    minWidth: axis === 'both' ? sizeValue : undefined,
    minHeight: axis === 'both' ? sizeValue : undefined
  };
  
  return <div style={spacerStyle} aria-hidden="true" />;
};