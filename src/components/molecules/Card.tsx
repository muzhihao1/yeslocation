import React from 'react';
import { motion } from 'framer-motion';
import { useContextEngine } from '../../context/ContextEngine';
import { LazyImage } from '../atoms/LazyImage';

export interface CardProps {
  title: string;
  description?: string;
  image?: string;
  category?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  priority?: number;
  tags?: string[];
  featured?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  category,
  action,
  className = '',
  priority = 0,
  tags = [],
  featured = false,
}) => {
  const { state } = useContextEngine();
  
  // 判断是否为高优先级内容
  const isHighPriority = priority > 3 || featured;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 ${className}`}
    >
      {/* 特色标签 */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-secondary-500 text-white text-xs font-semibold rounded-full shadow-lg">
            推荐
          </span>
        </div>
      )}
      
      {/* 图片区域 */}
      {image && (
        <div className="relative h-48 md:h-56 overflow-hidden group">
          <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-105">
            <LazyImage
              src={image}
              alt={title}
              className="w-full h-full"
              placeholderColor="bg-neutral-200"
            />
          </div>
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* 分类标签 */}
          {category && (
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-800 text-xs font-medium rounded-lg">
                {category}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* 内容区域 */}
      <div className="p-6">
        {/* 标题 */}
        <h3 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {title}
        </h3>
        
        {/* 描述 */}
        {description && (
          <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        )}
        
        {/* 标签 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* 行动按钮 */}
        {action && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={`w-full px-4 py-2.5 font-medium rounded-lg transition-all duration-200 ${
              isHighPriority
                ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {action.label}
          </motion.button>
        )}
      </div>
      
      {/* 悬停效果边框 */}
      <div className="absolute inset-0 border-2 border-primary-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};