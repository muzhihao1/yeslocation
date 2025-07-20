import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingFormOptimized } from './BookingFormOptimized';
import { BookingConfirmation } from './BookingConfirmation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'store' | 'training';
  storeId?: string;
  storeName?: string;
  trainingId?: string;
  trainingName?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  type,
  storeId,
  storeName,
  trainingId,
  trainingName,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  const handleBookingSuccess = () => {
    // 生成预约详情
    const details = {
      id: `BK${Date.now().toString(36).toUpperCase()}`,
      type,
      name: '预约人姓名', // 实际应从表单获取
      phone: '预约人电话', // 实际应从表单获取
      date: new Date().toLocaleDateString('zh-CN'),
      time: '14:00',
      storeName,
      trainingName,
      duration: '2',
    };
    
    setBookingDetails(details);
    setShowConfirmation(true);
  };
  
  const handleClose = () => {
    setShowConfirmation(false);
    setBookingDetails(null);
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              aria-label="关闭"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            
            {/* 标题栏 */}
            {!showConfirmation && (
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
                <h2 className="text-2xl font-bold">
                  {type === 'store' ? '预约场地' : '预约培训'}
                </h2>
                {storeName && (
                  <p className="text-white/90 mt-1">{storeName}</p>
                )}
                {trainingName && (
                  <p className="text-white/90 mt-1">{trainingName}</p>
                )}
              </div>
            )}
            
            {/* 内容区域 */}
            <AnimatePresence mode="wait">
              {!showConfirmation ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <BookingFormOptimized
                    type={type}
                    storeId={storeId}
                    storeName={storeName}
                    trainingId={trainingId}
                    onSuccess={handleBookingSuccess}
                    onCancel={handleClose}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <BookingConfirmation
                    booking={bookingDetails}
                    onClose={handleClose}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};