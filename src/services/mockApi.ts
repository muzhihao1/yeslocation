/**
 * Mock API 包装器
 * 用于模拟真实API的延迟和错误处理
 */

/**
 * Mock API类
 * 提供网络请求模拟功能
 */
export class MockAPI {
  /**
   * 模拟网络延迟包装器
   * @param data 要返回的数据
   * @param delay 延迟时间（毫秒），默认300ms
   * @returns 延迟后返回的数据Promise
   */
  async wrapWithDelay<T>(data: T | Promise<T>, delay: number = 300): Promise<T> {
    // 等待延迟
    await this.delay(delay);
    
    // 如果data本身是Promise，等待它解析
    if (data instanceof Promise) {
      return await data;
    }
    
    return data;
  }
  
  /**
   * 模拟API错误包装器
   * @param data 要返回的数据
   * @param errorRate 错误率（0-1之间），默认0.05（5%）
   * @param delay 延迟时间（毫秒），默认300ms
   * @returns 可能抛出错误的数据Promise
   */
  async wrapWithError<T>(
    data: T | Promise<T>,
    errorRate: number = 0.05,
    delay: number = 300
  ): Promise<T> {
    // 随机判断是否触发错误
    if (Math.random() < errorRate) {
      // 先延迟，模拟网络请求时间
      await this.delay(delay);
      
      // 随机选择错误类型
      const errorTypes = [
        { code: 'NETWORK_ERROR', message: 'Network request failed' },
        { code: 'TIMEOUT_ERROR', message: 'Request timeout' },
        { code: 'SERVER_ERROR', message: 'Internal server error' },
        { code: 'RATE_LIMIT', message: 'Too many requests' }
      ];
      
      const error = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      throw new APIError(error.message, error.code);
    }
    
    // 正常返回数据
    return this.wrapWithDelay(data, delay);
  }
  
  /**
   * 批量请求包装器
   * 模拟批量请求的并发控制
   * @param requests 请求数组
   * @param concurrency 并发数，默认3
   * @returns 所有请求结果的Promise数组
   */
  async wrapBatchRequests<T>(
    requests: Array<() => Promise<T>>,
    concurrency: number = 3
  ): Promise<T[]> {
    const results: T[] = [];
    
    // 分批处理请求
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(request => request())
      );
      results.push(...batchResults);
      
      // 批次之间增加小延迟
      if (i + concurrency < requests.length) {
        await this.delay(100);
      }
    }
    
    return results;
  }
  
  /**
   * 重试包装器
   * 自动重试失败的请求
   * @param request 请求函数
   * @param maxRetries 最大重试次数，默认3
   * @param retryDelay 重试延迟（毫秒），默认1000ms
   * @returns 请求结果的Promise
   */
  async wrapWithRetry<T>(
    request: () => Promise<T>,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await request();
      } catch (error) {
        lastError = error as Error;
        
        // 如果还有重试机会
        if (attempt < maxRetries) {
          console.warn(`Request failed, retrying... (${attempt + 1}/${maxRetries})`);
          // 指数退避策略
          await this.delay(retryDelay * Math.pow(2, attempt));
        }
      }
    }
    
    // 所有重试都失败
    throw new APIError(
      `Request failed after ${maxRetries} retries: ${lastError?.message}`,
      'MAX_RETRIES_EXCEEDED'
    );
  }
  
  /**
   * 缓存包装器
   * 为请求添加简单的内存缓存
   * @param key 缓存键
   * @param request 请求函数
   * @param ttl 缓存时间（毫秒），默认5分钟
   * @returns 缓存或新请求的结果
   */
  async wrapWithCache<T>(
    key: string,
    request: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && cached.expiry > Date.now()) {
      console.log(`Cache hit for key: ${key}`);
      return cached.data as T;
    }
    
    console.log(`Cache miss for key: ${key}`);
    const data = await request();
    
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
    
    return data;
  }
  
  /**
   * 进度回调包装器
   * 用于长时间运行的操作
   * @param request 请求函数
   * @param onProgress 进度回调
   * @returns 请求结果的Promise
   */
  async wrapWithProgress<T>(
    request: () => Promise<T>,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    // 模拟进度更新
    const progressInterval = setInterval(() => {
      const progress = Math.min(90, Math.random() * 100);
      onProgress?.(progress);
    }, 500);
    
    try {
      const result = await request();
      onProgress?.(100);
      return result;
    } finally {
      clearInterval(progressInterval);
    }
  }
  
  /**
   * 延迟函数
   * @param ms 延迟毫秒数
   * @returns Promise<void>
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * 简单的内存缓存
   */
  private cache = new Map<string, { data: any; expiry: number }>();
  
  /**
   * 清除缓存
   * @param key 要清除的缓存键，不传则清除所有
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
  
  /**
   * 获取缓存统计信息
   * @returns 缓存统计
   */
  getCacheStats(): { size: number; keys: string[] } {
    const now = Date.now();
    const validKeys = Array.from(this.cache.entries())
      .filter(([_, value]) => value.expiry > now)
      .map(([key, _]) => key);
    
    return {
      size: validKeys.length,
      keys: validKeys
    };
  }
}

/**
 * 自定义API错误类
 */
export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * 预定义的延迟时间常量
 */
export const API_DELAYS = {
  INSTANT: 0,
  FAST: 100,
  NORMAL: 300,
  SLOW: 800,
  VERY_SLOW: 2000
} as const;

/**
 * 预定义的错误率常量
 */
export const ERROR_RATES = {
  NONE: 0,
  LOW: 0.01,      // 1%
  MEDIUM: 0.05,   // 5%
  HIGH: 0.1,      // 10%
  VERY_HIGH: 0.2  // 20%
} as const;

/**
 * Mock API 单例实例
 */
export const mockAPI = new MockAPI();

// 导出类型
export type DelayType = typeof API_DELAYS[keyof typeof API_DELAYS];
export type ErrorRateType = typeof ERROR_RATES[keyof typeof ERROR_RATES];