import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  generateCDNUrl, 
  generateSrcSet,
  IMAGE_SIZES
} from '../../utils/imageOptimization';
import { useImageLazyLoad } from '../../hooks/useImageLazyLoad';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  type?: 'hero' | 'card' | 'thumbnail' | 'full';
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholderColor?: string;
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  type = 'full',
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  onError,
  placeholderColor = 'bg-neutral-200',
  aspectRatio,
}) => {
  const [hasError, setHasError] = useState(false);
  const { imgRef, isLoaded, isInView, setIsLoaded } = useImageLazyLoad();
  
  // 获取响应式尺寸配置
  const sizeNames = type === 'hero' ? ['medium', 'large', 'xlarge', 'hero'] : 
                    type === 'card' ? ['small', 'medium', 'card'] :
                    type === 'thumbnail' ? ['thumbnail', 'small'] :
                    ['small', 'medium', 'large'];
  
  // 生成 picture sources
  const sources = [
    { type: 'image/webp', srcSet: generateSrcSet(src.replace(/\.[^.]+$/, '.webp'), sizeNames as Array<keyof typeof IMAGE_SIZES>) },
    { type: 'image/avif', srcSet: generateSrcSet(src.replace(/\.[^.]+$/, '.avif'), sizeNames as Array<keyof typeof IMAGE_SIZES>) }
  ];
  
  // 生成默认 srcset
  const defaultSrcSet = generateSrcSet(src, sizeNames as Array<keyof typeof IMAGE_SIZES>);
  
  // 获取加载优先级
  const loading = priority ? 'eager' : 'lazy';
  
  // 处理图片加载成功
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };
  
  // 处理图片加载失败
  const handleError = () => {
    setHasError(true);
    onError?.();
  };
  
  // 计算容器样式
  const containerStyle = aspectRatio
    ? { aspectRatio }
    : width && height
    ? { aspectRatio: `${width}/${height}` }
    : {};
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      {/* 占位符 */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 ${placeholderColor}`}
          >
            <div className="absolute inset-0 animate-pulse">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full animate-shimmer" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="text-center text-neutral-400">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">图片加载失败</p>
          </div>
        </div>
      )}
      
      {/* 实际图片 */}
      {!hasError && (
        <picture>
          {/* 现代格式 sources */}
          {isInView && sources.map((source, index) => (
            <source
              key={index}
              type={source.type}
              srcSet={source.srcSet}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ))}
          
          {/* 默认 img 标签 */}
          <motion.img
            ref={imgRef}
            src={isInView || priority ? generateCDNUrl(src, { width: width || 800, quality: 85 }) : undefined}
            srcSet={isInView || priority ? defaultSrcSet : undefined}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </picture>
      )}
      
      {/* 加载进度条（可选） */}
      {!isLoaded && !hasError && priority && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200">
          <div className="h-full bg-primary-500 animate-pulse" style={{ width: '30%' }} />
        </div>
      )}
    </div>
  );
};