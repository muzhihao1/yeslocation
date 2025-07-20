import { useEffect, useRef, useCallback } from 'react';
import { useContextEngine } from '../context/ContextEngine';
import { useLocation } from 'react-router-dom';
import { 
  trackEvent, 
  trackPageView, 
  trackEngagement, 
  setUserProperties,
  trackScrollDepth,
  GA_EVENTS 
} from '../utils/analytics';

interface TrackingEvent {
  type: 'page_view' | 'click' | 'scroll' | 'hover' | 'engagement';
  target?: string;
  data?: any;
  timestamp: number;
}

export const useBehaviorTracking = () => {
  const { state, dispatch } = useContextEngine();
  const location = useLocation();
  const pageStartTime = useRef<number>(Date.now());
  const scrollDepth = useRef<number>(0);
  const interactionCount = useRef<number>(0);
  
  // 获取当前页面类别
  const getCurrentCategory = (): string => {
    const path = location.pathname.slice(1);
    const categoryMap: Record<string, string> = {
      '': 'home',
      'about': 'about',
      'stores': 'stores',
      'franchise': 'franchise',
      'training': 'training',
      'products': 'products',
      'contact': 'contact',
    };
    
    return categoryMap[path] || 'other';
  };

  // 追踪页面访问
  useEffect(() => {
    const startTime = Date.now();
    pageStartTime.current = startTime;
    
    // 页面进入时记录
    const pageName = location.pathname.slice(1) || 'home';
    console.log(`[Context] Page view: ${pageName}`);
    
    // GA4 页面追踪
    trackPageView(location.pathname, document.title);
    
    // 设置内容分组
    trackEvent('page_view', {
      page_path: location.pathname,
      page_title: document.title,
      content_group: getCurrentCategory(),
    });
    
    // 页面离开时记录访问时长
    return () => {
      const duration = Date.now() - startTime;
      dispatch({
        type: 'ADD_PAGE_VISIT',
        payload: {
          page: pageName,
          timestamp: startTime,
          duration,
        },
      });
      
      // GA4 追踪页面停留时间
      trackEngagement('page_time', Math.round(duration / 1000));
      
      // 根据访问时长和交互次数更新参与度
      updateEngagementLevel(duration, interactionCount.current);
    };
  }, [location.pathname, dispatch]);
  
  // 追踪滚动深度
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const depth = scrollHeight > 0 ? (currentScroll / scrollHeight) * 100 : 0;
      
      scrollDepth.current = Math.max(scrollDepth.current, depth);
      
      // GA4 追踪滚动深度
      trackScrollDepth();
      
      // 滚动超过50%视为感兴趣
      if (depth > 50 && !state.molecules.userInterests.includes(getCurrentCategory())) {
        const category = getCurrentCategory();
        if (category) {
          dispatch({
            type: 'UPDATE_INTERESTS',
            payload: [...state.molecules.userInterests, category],
          });
          
          // GA4 追踪用户兴趣
          trackEvent('user_interest', {
            interest_category: category,
            trigger: 'scroll_depth',
            depth_percentage: Math.round(depth),
          });
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [state.molecules.userInterests, dispatch]);
  
  // 追踪点击事件
  const trackClick = useCallback((target: string, data?: any) => {
    interactionCount.current += 1;
    
    const event: TrackingEvent = {
      type: 'click',
      target,
      data,
      timestamp: Date.now(),
    };
    
    console.log('[Context] Click tracked:', event);
    
    // GA4 追踪点击
    trackEvent(GA_EVENTS.BUTTON_CLICK, {
      button_name: target,
      page_location: location.pathname,
      ...data,
    });
    
    // 更新共鸣度
    const currentResonance = state.fields.resonance;
    dispatch({
      type: 'UPDATE_RESONANCE',
      payload: Math.min(currentResonance + 0.05, 1),
    });
  }, [state.fields.resonance, dispatch, location.pathname]);
  
  // 追踪悬停事件（用于热图分析）
  const trackHover = useCallback((target: string, duration: number) => {
    if (duration > 1000) { // 悬停超过1秒
      console.log(`[Context] Hover tracked: ${target} for ${duration}ms`);
      interactionCount.current += 0.5;
    }
  }, []);
  
  // 更新参与度等级
  const updateEngagementLevel = (duration: number, interactions: number) => {
    const durationMinutes = duration / 60000;
    const interactionRate = interactions / durationMinutes;
    
    let level: 'low' | 'medium' | 'high' = 'low';
    
    if (durationMinutes > 2 && interactionRate > 3) {
      level = 'high';
    } else if (durationMinutes > 1 && interactionRate > 1) {
      level = 'medium';
    }
    
    if (state.cells.engagementLevel !== level) {
      dispatch({ type: 'UPDATE_ENGAGEMENT', payload: level });
    }
  };
  
  
  // 更新用户旅程阶段
  useEffect(() => {
    const { visitHistory } = state.cells;
    const { userInterests } = state.molecules;
    
    let journey: typeof state.fields.journey = 'awareness';
    
    if (visitHistory.length > 5 && userInterests.length > 2) {
      journey = 'decision';
    } else if (visitHistory.length > 3 && userInterests.length > 0) {
      journey = 'consideration';
    } else if (visitHistory.length > 1) {
      journey = 'interest';
    }
    
    if (state.fields.journey !== journey) {
      dispatch({ type: 'UPDATE_JOURNEY', payload: journey });
      
      // GA4 设置用户属性
      setUserProperties({
        user_journey_stage: journey,
        engagement_level: state.cells.engagementLevel,
        interests_count: userInterests.length,
        visit_count: visitHistory.length,
      });
      
      // 追踪旅程阶段变化
      trackEvent('journey_stage_change', {
        new_stage: journey,
        interests: userInterests,
        page_views: visitHistory.length,
      });
    }
  }, [state.cells.visitHistory, state.molecules.userInterests, state.fields.journey, state.cells.engagementLevel, dispatch]);
  
  return {
    trackClick,
    trackHover,
    scrollDepth: scrollDepth.current,
    pageTime: Date.now() - pageStartTime.current,
    engagementLevel: state.cells.engagementLevel,
    journey: state.fields.journey,
  };
};