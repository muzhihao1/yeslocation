import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveImage } from '../atoms/ResponsiveImage';
// import { preloadImages } from '../../utils/imageOptimization';

interface ImageGalleryProps {
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 预加载相邻图片
  React.useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (activeIndex + 1) % images.length;
      const prevIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
      
      // 简单的预加载实现
      const urls = [images[nextIndex].url, images[prevIndex].url];
      urls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [activeIndex, images]);
  
  // 自动播放
  React.useEffect(() => {
    if (autoPlay && !isFullscreen) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % images.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, images.length, isFullscreen]);
  
  const handlePrevious = () => {
    setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  };
  
  const handleNext = () => {
    setActiveIndex((activeIndex + 1) % images.length);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
  };
  
  if (images.length === 0) return null;
  
  return (
    <>
      <div 
        className={`relative ${className}`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* 主图片区域 */}
        <div className="relative aspect-w-16 aspect-h-9 bg-neutral-100 rounded-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <ResponsiveImage
                src={images[activeIndex].url}
                alt={images[activeIndex].alt}
                type="hero"
                className="w-full h-full"
                priority
              />
              
              {/* 图片说明 */}
              {images[activeIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white text-lg">{images[activeIndex].caption}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* 导航按钮 - 已移除 */}
          
          {/* 全屏按钮 */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            aria-label="全屏查看"
          >
            <svg
              className="w-5 h-5 text-neutral-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
          
          {/* 指示器 */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`查看第${index + 1}张图片`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* 缩略图 */}
        {showThumbnails && images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                  index === activeIndex
                    ? 'ring-2 ring-primary-500 ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <ResponsiveImage
                  src={image.url}
                  alt={image.alt}
                  type="thumbnail"
                  className="w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* 全屏模式 */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="关闭全屏"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <ResponsiveImage
                src={images[activeIndex].url}
                alt={images[activeIndex].alt}
                type="full"
                className="max-w-full max-h-full"
                priority
              />
              
              {/* 全屏导航 - 已移除 */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};