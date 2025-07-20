/**
 * Google Analytics 集成钩子
 * 负责初始化和管理 GA4
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  initializeGA4, 
  trackPageView, 
  trackScrollDepth,
  trackSessionDuration,
  setUserProperties 
} from '../utils/analytics';
import { useContextEngine } from '../context/ContextEngine';

export const useAnalytics = () => {
  const location = useLocation();
  const { state } = useContextEngine();
  
  // 初始化 GA4
  useEffect(() => {
    initializeGA4();
    
    // 设置初始用户属性
    setUserProperties({
      platform: 'web',
      initial_referrer: document.referrer || 'direct',
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    });
    
    // 监听滚动深度
    const handleScroll = () => {
      trackScrollDepth();
    };
    
    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 监听页面卸载，记录会话时长
    const handleUnload = () => {
      trackSessionDuration();
    };
    
    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
  
  // 路由变化时追踪页面视图
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
  
  // 用户状态变化时更新用户属性
  useEffect(() => {
    if (state.fields.journey || state.cells.engagementLevel) {
      setUserProperties({
        journey_stage: state.fields.journey,
        engagement_level: state.cells.engagementLevel,
        interests: state.molecules.userInterests.join(','),
        resonance_score: Math.round(state.fields.resonance * 100),
      });
    }
  }, [
    state.fields.journey, 
    state.cells.engagementLevel, 
    state.molecules.userInterests, 
    state.fields.resonance
  ]);
};