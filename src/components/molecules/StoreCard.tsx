import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../atoms/Button';
import { LazyImage } from '../atoms/LazyImage';
import { useContextEngine } from '../../context/ContextEngine';
import type { Store } from '../../types/models';

interface StoreCardProps {
  store: Store;
  onNavigate: () => void;
  onBook: () => void;
  className?: string;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onNavigate,
  onBook,
  className = '',
}) => {
  const { state } = useContextEngine();
  
  // 判断是否为特色门店
  const isFeatured = (store.rating && store.rating >= 4.5) || false;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 ${className}`}
    >
      {/* 特色标签 */}
      {isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-secondary-500 text-white text-xs font-semibold rounded-full shadow-lg">
            旗舰店
          </span>
        </div>
      )}
      
      {/* 图片区域 */}
      <div className="relative h-48 overflow-hidden bg-neutral-100">
        <LazyImage
          src="/images/store-placeholder.jpg"
          alt={store.name}
          className="w-full h-full object-cover"
          placeholderColor="bg-neutral-200"
        />
        
        {/* 营业状态 - 基于营业时间判断 */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500 text-white">
            营业中
          </span>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="p-6">
        {/* 标题和评分 */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
            {store.name}
          </h3>
          {store.rating && (
            <div className="flex items-center text-sm">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 font-medium">{store.rating}</span>
              <span className="text-neutral-500 ml-1">(5.0)</span>
            </div>
          )}
        </div>
        
        {/* 地址 */}
        <p className="text-neutral-600 text-sm mb-2 line-clamp-2">
          <svg
            className="inline-block w-4 h-4 mr-1 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {store.address}
        </p>
        
        {/* 营业时间和电话 */}
        <div className="text-sm text-neutral-500 space-y-1 mb-4">
          <p>
            <svg
              className="inline-block w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {store.businessHours || '09:00-22:00'}
          </p>
          <p>
            <svg
              className="inline-block w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {store.phone}
          </p>
        </div>
        
        {/* 特色标签 */}
        {store.features && store.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {store.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
        
        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={onNavigate}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            导航
          </Button>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={onBook}
          >
            立即预约
          </Button>
        </div>
      </div>
    </motion.div>
  );
};