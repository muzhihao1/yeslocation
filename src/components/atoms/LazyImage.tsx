import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useImageLazyLoad } from '../../hooks/useImageLazyLoad';
import { createSVGPlaceholder } from '../../utils/placeholderImage';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholderColor?: string;
  category?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  placeholderColor = 'bg-neutral-200',
  category
}) => {
  const { imgRef, isLoaded, isInView, setIsLoaded } = useImageLazyLoad();
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 占位符 */}
      {!isLoaded && !hasError && (
        <div 
          className={`absolute inset-0 ${placeholderColor}`}
        >
          <div className="absolute inset-0 animate-pulse">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full animate-shimmer" />
          </div>
        </div>
      )}
      
      {/* 实际图片或错误占位符 */}
      <motion.img
        ref={imgRef}
        src={hasError ? createSVGPlaceholder(category) : (isInView ? src : undefined)}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full h-full object-cover`}
      />
    </div>
  );
};