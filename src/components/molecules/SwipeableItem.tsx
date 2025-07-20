import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';

interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  deleteThreshold?: number;
  className?: string;
  deleteButtonContent?: React.ReactNode;
}

export const SwipeableItem: React.FC<SwipeableItemProps> = ({
  children,
  onDelete,
  deleteThreshold = 100,
  className = '',
  deleteButtonContent
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  // Transform values for visual feedback
  const deleteOpacity = useTransform(x, [-deleteThreshold, 0], [1, 0]);
  const contentOpacity = useTransform(x, [-deleteThreshold * 1.5, 0], [0.5, 1]);
  const deleteScale = useTransform(x, [-deleteThreshold * 1.5, -deleteThreshold, 0], [1.2, 1, 0.8]);
  
  const handleDragEnd = (_: any, info: PanInfo) => {
    const shouldDelete = info.offset.x < -deleteThreshold && info.velocity.x < -100;
    
    if (shouldDelete && onDelete) {
      setIsDeleting(true);
      controls.start({
        x: -window.innerWidth,
        transition: { duration: 0.3 }
      }).then(() => {
        onDelete();
      });
    } else {
      // Snap back to original position
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      });
    }
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Delete background */}
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 bg-error"
        style={{
          opacity: deleteOpacity,
          width: '100%'
        }}
      >
        <motion.div
          style={{ scale: deleteScale }}
          className="flex items-center text-white"
        >
          {deleteButtonContent || (
            <>
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="font-medium">删除</span>
            </>
          )}
        </motion.div>
      </motion.div>
      
      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ 
          x,
          opacity: contentOpacity
        }}
        className={`relative bg-white ${isDeleting ? 'pointer-events-none' : ''}`}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    </div>
  );
};