import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = '' 
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-xl' },
    md: { icon: 48, text: 'text-2xl' },
    lg: { icon: 64, text: 'text-3xl' },
  };
  
  const { icon, text } = sizeMap[size];
  
  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* 公司Logo图片 */}
      <motion.img 
        src="/yes-logo.png"
        alt="耶氏体育 Logo"
        className="object-contain"
        style={{ width: icon, height: icon }}
        whileHover={{ rotate: 10 }}
        transition={{ type: "spring", stiffness: 400 }}
      />
      
      {showText && (
        <div className="flex flex-col">
          <span className={`${text} font-bold text-yes-dark`}>
            耶氏体育
          </span>
          <span className="text-xs text-yes-green">
            台球 YES!
          </span>
        </div>
      )}
    </motion.div>
  );
};