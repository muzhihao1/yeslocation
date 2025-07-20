import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useBreakpoint } from '../../styles/responsive-utilities';

interface TouchCarouselProps {
  items: Array<{
    id: string | number;
    content: React.ReactNode;
  }>;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
}

export const TouchCarousel: React.FC<TouchCarouselProps> = ({
  items,
  className = '',
  autoPlay = false,
  autoPlayInterval = 5000,
  showIndicators = true,
  showArrows = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isMobile } = useBreakpoint();
  
  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length]);
  
  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 50;
    const swipeVelocity = 100;
    
    if (info.offset.x < -swipeThreshold || info.velocity.x < -swipeVelocity) {
      // Swipe left - next item
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocity) {
      // Swipe right - previous item
      handlePrevious();
    }
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Carousel content */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full h-full"
          >
            {items[currentIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation arrows (desktop) */}
      {showArrows && !isMobile && items.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200"
            aria-label="Previous item"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200"
            aria-label="Next item"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-primary-500'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Touch hint for mobile */}
      {isMobile && items.length > 1 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/70 text-sm flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          滑动切换
        </motion.div>
      )}
    </div>
  );
};