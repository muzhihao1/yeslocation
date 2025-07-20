import React, { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface LongPressButtonProps {
  children: React.ReactNode;
  onLongPress: () => void;
  onPress?: () => void;
  longPressDuration?: number;
  className?: string;
  disabled?: boolean;
}

export const LongPressButton: React.FC<LongPressButtonProps> = ({
  children,
  onLongPress,
  onPress,
  longPressDuration = 500,
  className = '',
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const controls = useAnimation();
  
  const handlePressStart = () => {
    if (disabled) return;
    
    setIsPressed(true);
    startTimeRef.current = Date.now();
    
    // Start progress animation
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / longPressDuration, 1);
      setProgress(newProgress);
      
      if (newProgress >= 1) {
        handleLongPressComplete();
      }
    }, 16); // ~60fps
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    controls.start({
      scale: 0.95,
      transition: { duration: 0.1 }
    });
  };
  
  const handlePressEnd = () => {
    if (!isPressed) return;
    
    const elapsed = Date.now() - startTimeRef.current;
    
    // Clear timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // If it was a short press and onPress is defined
    if (elapsed < longPressDuration && onPress) {
      onPress();
    }
    
    // Reset state
    setIsPressed(false);
    setProgress(0);
    
    controls.start({
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    });
  };
  
  const handleLongPressComplete = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Haptic feedback for completion
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
    
    onLongPress();
    
    // Visual feedback
    controls.start({
      scale: [0.95, 1.05, 1],
      transition: { duration: 0.3 }
    });
    
    setIsPressed(false);
    setProgress(0);
  };
  
  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
      animate={controls}
      disabled={disabled}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Progress indicator */}
      <motion.div
        className="absolute inset-0 bg-primary-500/20 origin-center"
        initial={{ scale: 0 }}
        animate={{ scale: progress }}
        style={{ borderRadius: '50%' }}
      />
      
      {/* Circular progress border */}
      {isPressed && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.2"
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 48}`}
            strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress)}`}
            transform="rotate(-90 50 50)"
            className="text-primary-500"
            style={{
              transition: 'stroke-dashoffset 0.1s linear'
            }}
          />
        </svg>
      )}
      
      {/* Button content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Instructions tooltip */}
      {!isPressed && !disabled && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-neutral-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          长按{(longPressDuration / 1000).toFixed(1)}秒确认
        </div>
      )}
    </motion.button>
  );
};