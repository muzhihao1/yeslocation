/**
 * 加载状态组件集合
 * 提供多种加载动画效果
 */

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

/**
 * 旋转加载器
 */
export const SpinnerLoader: React.FC<LoadingProps> = ({ 
  size = 'md', 
  color = 'text-yes-blue',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg 
        className={`animate-spin ${sizeClasses[size]} ${color}`} 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4" 
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
        />
      </svg>
      {text && (
        <p className={`text-sm ${color}`}>{text}</p>
      )}
    </div>
  );
};

/**
 * 脉冲加载器
 */
export const PulseLoader: React.FC<LoadingProps> = ({ 
  size = 'md',
  color = 'bg-yes-blue',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`rounded-full ${sizeClasses[size]} ${color}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

/**
 * 波纹加载器
 */
export const RippleLoader: React.FC<LoadingProps> = ({ 
  size = 'md',
  color = 'border-yes-blue',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`relative ${sizeClasses[size]}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 rounded-full border-2 ${color}`}
            animate={{
              scale: [1, 2],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

/**
 * 骨架屏加载器
 */
export const SkeletonLoader: React.FC<{ 
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}> = ({ 
  width = 'w-full', 
  height = 'h-4',
  rounded = false,
  className = '' 
}) => {
  return (
    <div
      className={`
        ${width} ${height}
        ${rounded ? 'rounded-full' : 'rounded'}
        bg-gray-200 animate-pulse
        ${className}
      `}
    />
  );
};

/**
 * 卡片骨架屏
 */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <SkeletonLoader height="h-48" className="mb-4" />
      <SkeletonLoader height="h-6" width="w-3/4" />
      <SkeletonLoader height="h-4" />
      <SkeletonLoader height="h-4" width="w-5/6" />
      <div className="flex gap-2 mt-4">
        <SkeletonLoader height="h-8" width="w-20" />
        <SkeletonLoader height="h-8" width="w-20" />
      </div>
    </div>
  );
};

/**
 * 列表骨架屏
 */
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
          <SkeletonLoader width="w-12" height="h-12" rounded />
          <div className="flex-1 space-y-2">
            <SkeletonLoader height="h-4" width="w-1/3" />
            <SkeletonLoader height="h-3" width="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 进度条加载器
 */
export const ProgressLoader: React.FC<{ 
  progress: number;
  text?: string;
  showPercentage?: boolean;
}> = ({ 
  progress, 
  text,
  showPercentage = true 
}) => {
  return (
    <div className="w-full space-y-2">
      {(text || showPercentage) && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{text}</span>
          {showPercentage && <span>{Math.round(progress)}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yes-blue to-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

/**
 * 带Logo的加载器
 */
export const LogoLoader: React.FC<LoadingProps> = ({ text = '加载中...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="w-16 h-16 bg-yes-blue rounded-lg flex items-center justify-center"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          borderRadius: ["20%", "50%", "20%", "50%", "20%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-white text-2xl font-bold">Y</span>
      </motion.div>
      <motion.p
        className="text-gray-600"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
};

/**
 * 全屏加载器
 */
export const FullscreenLoader: React.FC<{ 
  text?: string;
  type?: 'spinner' | 'pulse' | 'logo';
}> = ({ 
  text = '加载中...', 
  type = 'logo' 
}) => {
  const loaders = {
    spinner: <SpinnerLoader size="lg" text={text} />,
    pulse: <PulseLoader size="lg" text={text} />,
    logo: <LogoLoader text={text} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      {loaders[type]}
    </motion.div>
  );
};