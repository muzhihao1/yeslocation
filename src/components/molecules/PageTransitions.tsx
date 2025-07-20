/**
 * 页面过渡动画组件
 * 提供多种页面切换效果
 */

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'rotate' | 'blur';
  duration?: number;
}

/**
 * 淡入淡出过渡
 */
export const FadeTransition: React.FC<PageTransitionProps> = ({ 
  children,
  duration = 0.3 
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * 滑动过渡
 */
export const SlideTransition: React.FC<PageTransitionProps & {
  direction?: 'left' | 'right' | 'up' | 'down';
}> = ({ 
  children,
  direction = 'right',
  duration = 0.3 
}) => {
  const location = useLocation();

  const variants = {
    initial: {
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
      opacity: 0,
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: {
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0,
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * 缩放过渡
 */
export const ScaleTransition: React.FC<PageTransitionProps> = ({ 
  children,
  duration = 0.3 
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        transition={{ 
          duration,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * 旋转过渡
 */
export const RotateTransition: React.FC<PageTransitionProps> = ({ 
  children,
  duration = 0.5 
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ 
          rotateY: -90,
          opacity: 0,
        }}
        animate={{ 
          rotateY: 0,
          opacity: 1,
        }}
        exit={{ 
          rotateY: 90,
          opacity: 0,
        }}
        transition={{ 
          duration,
          ease: "easeInOut"
        }}
        style={{ transformPerspective: 1200 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * 模糊过渡
 */
export const BlurTransition: React.FC<PageTransitionProps> = ({ 
  children,
  duration = 0.3 
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ 
          opacity: 0,
          filter: 'blur(10px)',
        }}
        animate={{ 
          opacity: 1,
          filter: 'blur(0px)',
        }}
        exit={{ 
          opacity: 0,
          filter: 'blur(10px)',
        }}
        transition={{ duration }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * 通用页面过渡组件
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  type = 'fade',
  duration = 0.3 
}) => {
  const transitions = {
    fade: <FadeTransition duration={duration}>{children}</FadeTransition>,
    slide: <SlideTransition duration={duration}>{children}</SlideTransition>,
    scale: <ScaleTransition duration={duration}>{children}</ScaleTransition>,
    rotate: <RotateTransition duration={duration}>{children}</RotateTransition>,
    blur: <BlurTransition duration={duration}>{children}</BlurTransition>,
  };

  return transitions[type] || transitions.fade;
};

/**
 * 分段过渡（适用于内容区块）
 */
export const StaggeredTransition: React.FC<{
  children: ReactNode[];
  delay?: number;
}> = ({ children, delay = 0.1 }) => {
  return (
    <motion.div>
      {React.Children.map(children, (child, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * delay,
            ease: "easeOut",
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * 视差滚动过渡
 */
export const ParallaxTransition: React.FC<{
  children: ReactNode;
  offset?: number;
}> = ({ children, offset = 50 }) => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      style={{
        transform: `translateY(${scrollY * 0.5}px)`,
      }}
      transition={{ type: "tween", ease: "linear" }}
    >
      {children}
    </motion.div>
  );
};

/**
 * 滚动触发动画
 */
export const ScrollReveal: React.FC<{
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}> = ({ 
  children, 
  direction = 'up',
  delay = 0 
}) => {
  const initial = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 },
  };

  return (
    <motion.div
      initial={initial[direction]}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * 路由切换动画包装器
 */
export const AnimatedRoutes: React.FC<{
  children: ReactNode;
  transitionType?: 'fade' | 'slide' | 'scale' | 'rotate' | 'blur';
}> = ({ children, transitionType = 'fade' }) => {
  const location = useLocation();

  return (
    <PageTransition type={transitionType} key={location.pathname}>
      {children}
    </PageTransition>
  );
};