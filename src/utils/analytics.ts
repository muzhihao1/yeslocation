/**
 * Google Analytics 4 集成
 * 提供事件追踪、用户属性设置、转化追踪等功能
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// GA4 配置
const GA4_MEASUREMENT_ID = process.env.REACT_APP_GA4_MEASUREMENT_ID || '';
const DEBUG_MODE = process.env.REACT_APP_DEBUG_MODE === 'true';

/**
 * 初始化 Google Analytics
 */
export function initializeGA4() {
  if (!GA4_MEASUREMENT_ID) {
    console.warn('GA4 Measurement ID not configured');
    return;
  }
  
  // 初始化 dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // gtag 函数
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  // 设置时间
  window.gtag('js', new Date());
  
  // 配置 GA4
  window.gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: false, // 我们将手动发送页面视图
    debug_mode: DEBUG_MODE,
  });
  
  if (DEBUG_MODE) {
    console.log('GA4 initialized with ID:', GA4_MEASUREMENT_ID);
  }
}

/**
 * 发送页面视图事件
 */
export function trackPageView(path: string, title?: string) {
  if (!window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
  
  if (DEBUG_MODE) {
    console.log('Page view tracked:', { path, title });
  }
}

/**
 * 追踪自定义事件
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, any>
) {
  if (!window.gtag) return;
  
  window.gtag('event', eventName, parameters);
  
  if (DEBUG_MODE) {
    console.log('Event tracked:', { eventName, parameters });
  }
}

/**
 * 追踪用户参与度
 */
export function trackEngagement(engagementType: string, value?: number) {
  trackEvent('user_engagement', {
    engagement_type: engagementType,
    engagement_value: value,
    engagement_time_msec: Date.now(),
  });
}

/**
 * 追踪转化事件
 */
export function trackConversion(
  conversionType: 'booking' | 'inquiry' | 'signup' | 'purchase',
  value?: number,
  currency: string = 'CNY'
) {
  const eventMap = {
    booking: 'booking_completed',
    inquiry: 'generate_lead',
    signup: 'sign_up',
    purchase: 'purchase',
  };
  
  trackEvent(eventMap[conversionType], {
    value,
    currency,
    conversion_type: conversionType,
  });
}

/**
 * 设置用户属性
 */
export function setUserProperties(properties: Record<string, any>) {
  if (!window.gtag) return;
  
  window.gtag('set', 'user_properties', properties);
  
  if (DEBUG_MODE) {
    console.log('User properties set:', properties);
  }
}

/**
 * 追踪搜索事件
 */
export function trackSearch(searchTerm: string, resultsCount?: number) {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

/**
 * 追踪分享事件
 */
export function trackShare(method: string, contentType: string, itemId?: string) {
  trackEvent('share', {
    method,
    content_type: contentType,
    item_id: itemId,
  });
}

/**
 * 追踪错误事件
 */
export function trackError(
  errorMessage: string,
  errorType: string,
  fatal: boolean = false
) {
  trackEvent('exception', {
    description: errorMessage,
    error_type: errorType,
    fatal,
  });
}

/**
 * 追踪时间花费
 */
export function trackTiming(
  category: string,
  variable: string,
  value: number,
  label?: string
) {
  trackEvent('timing_complete', {
    name: variable,
    value,
    event_category: category,
    event_label: label,
  });
}

// 预定义的事件类型
export const GA_EVENTS = {
  // 页面交互
  BUTTON_CLICK: 'button_click',
  LINK_CLICK: 'link_click',
  FORM_SUBMIT: 'form_submit',
  
  // 预约相关
  BOOKING_START: 'booking_start',
  BOOKING_STEP: 'booking_step',
  BOOKING_COMPLETE: 'booking_complete',
  BOOKING_CANCEL: 'booking_cancel',
  
  // 产品相关
  VIEW_ITEM: 'view_item',
  VIEW_ITEM_LIST: 'view_item_list',
  SELECT_ITEM: 'select_item',
  
  // 用户行为
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  CHAT_START: 'chat_start',
  CHAT_MESSAGE: 'chat_message',
  
  // 导航
  NAVIGATION: 'navigation',
  MENU_CLICK: 'menu_click',
  
  // 内容交互
  VIDEO_PLAY: 'video_play',
  IMAGE_VIEW: 'image_view',
  DOWNLOAD: 'download',
} as const;

// 增强的页面追踪
export function trackEnhancedPageView(
  path: string,
  title: string,
  options?: {
    user_type?: string;
    content_group?: string;
    page_referrer?: string;
  }
) {
  trackEvent('page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
    ...options,
  });
}

// 追踪滚动深度
let maxScrollDepth = 0;
export function trackScrollDepth() {
  const scrollPercentage = Math.round(
    ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
  );
  
  // 只在达到新的深度里程碑时追踪
  const milestones = [25, 50, 75, 90, 100];
  for (const milestone of milestones) {
    if (scrollPercentage >= milestone && maxScrollDepth < milestone) {
      maxScrollDepth = milestone;
      trackEvent('scroll', {
        percent_scrolled: milestone,
        page_path: window.location.pathname,
      });
      break;
    }
  }
}

// 会话时长追踪
let sessionStartTime = Date.now();
export function trackSessionDuration() {
  const duration = Math.round((Date.now() - sessionStartTime) / 1000);
  
  trackEvent('session_duration', {
    duration_seconds: duration,
    page_count: window.history.length,
  });
}

// 设置内容分组
export function setContentGroup(groupName: string, groupIndex: number = 1) {
  if (!window.gtag) return;
  
  window.gtag('event', 'page_view', {
    content_group: groupName,
    [`content_group${groupIndex}`]: groupName,
  });
}