import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshThreshold?: number;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshThreshold = 80,
  className = ''
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(true);
  const y = useMotionValue(0);
  const controls = useAnimation();
  
  // Transform values for visual feedback
  const pullProgress = useTransform(y, [0, refreshThreshold], [0, 1]);
  const indicatorRotation = useTransform(y, [0, refreshThreshold * 2], [0, 360]);
  const indicatorScale = useTransform(y, [0, refreshThreshold, refreshThreshold * 1.5], [0, 1, 1.2]);
  const indicatorOpacity = useTransform(y, [0, refreshThreshold * 0.5], [0, 1]);
  
  // Check if we're at the top of the page
  useEffect(() => {
    const handleScroll = () => {
      setCanRefresh(window.scrollY === 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (!canRefresh) {
      controls.start({ y: 0 });
      return;
    }
    
    const shouldRefresh = info.offset.y > refreshThreshold;
    
    if (shouldRefresh && !isRefreshing) {
      setIsRefreshing(true);
      
      // Hold the indicator in place
      await controls.start({
        y: refreshThreshold,
        transition: { type: "spring", stiffness: 200, damping: 20 }
      });
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        // Animate back to original position
        await controls.start({
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        });
      }
    } else {
      // Snap back to original position
      controls.start({
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      });
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Refresh indicator */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
        <motion.div
          style={{
            y,
            opacity: indicatorOpacity,
            scale: indicatorScale
          }}
          className="absolute -top-12 bg-white rounded-full shadow-lg p-3"
        >
          <motion.div
            style={{ rotate: indicatorRotation }}
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            <svg 
              className={`w-6 h-6 ${isRefreshing ? 'text-primary-500' : 'text-neutral-400'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Draggable content */}
      <motion.div
        drag={canRefresh ? "y" : false}
        dragConstraints={{ top: 0, bottom: refreshThreshold * 2 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
};