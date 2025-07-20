/**
 * Protocol Response Wrapper
 * 基于Context Engineering理念的标准化API响应格式
 * 提供统一的响应结构、版本控制和元数据管理
 */

/**
 * 响应元数据接口
 * 包含关于响应的附加信息
 */
export interface ResponseMetadata {
  /** 是否从缓存返回 */
  cached: boolean;
  
  /** 处理时间（毫秒） */
  processingTime: number;
  
  /** 与用户上下文的共振度（0-1） */
  resonance?: number;
  
  /** 用户行为残留 */
  residue?: string[];
  
  /** 缓存时间 */
  cacheTime?: number;
  
  /** 数据版本 */
  dataVersion?: string;
}

/**
 * 标准协议响应格式
 * 所有API响应都应该遵循此格式
 */
export interface ProtocolResponse<T> {
  /** 协议标识符 */
  protocol: string;
  
  /** 协议版本 */
  version: string;
  
  /** 响应时间戳 */
  timestamp: number;
  
  /** 请求ID（用于追踪） */
  requestId?: string;
  
  /** 成功标志 */
  success: boolean;
  
  /** 响应数据 */
  data?: T;
  
  /** 错误信息 */
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  
  /** 响应元数据 */
  meta: ResponseMetadata;
}

/**
 * Protocol Response Wrapper类
 * 提供创建标准化响应的方法
 */
export class ProtocolResponseWrapper {
  private static readonly PROTOCOL = "yes-sports.api";
  private static readonly VERSION = "1.0.0";
  
  /**
   * 包装成功响应
   * @param data 响应数据
   * @param meta 可选的元数据
   * @returns 标准化响应
   */
  static success<T>(
    data: T,
    meta?: Partial<ResponseMetadata>
  ): ProtocolResponse<T> {
    return {
      protocol: this.PROTOCOL,
      version: this.VERSION,
      timestamp: Date.now(),
      success: true,
      data,
      meta: {
        cached: false,
        processingTime: 0,
        ...meta
      }
    };
  }
  
  /**
   * 包装错误响应
   * @param code 错误代码
   * @param message 错误消息
   * @param details 可选的错误详情
   * @returns 标准化错误响应
   */
  static error<T = any>(
    code: string,
    message: string,
    details?: any
  ): ProtocolResponse<T> {
    return {
      protocol: this.PROTOCOL,
      version: this.VERSION,
      timestamp: Date.now(),
      success: false,
      error: {
        code,
        message,
        details
      },
      meta: {
        cached: false,
        processingTime: 0
      }
    };
  }
  
  /**
   * 从现有的DataResponse转换为ProtocolResponse
   * 保持向后兼容
   */
  static fromDataResponse<T>(
    response: any,
    additionalMeta?: Partial<ResponseMetadata>
  ): ProtocolResponse<T> {
    if (response.success) {
      return this.success(response.data, {
        cached: response.metadata?.cached || false,
        processingTime: response.metadata?.processingTime || 0,
        ...additionalMeta
      });
    } else {
      return this.error(
        response.error?.code || 'UNKNOWN_ERROR',
        response.error?.message || 'Unknown error occurred',
        response.error?.details
      );
    }
  }
  
  /**
   * 添加请求追踪
   * @param response 原始响应
   * @param requestId 请求ID
   * @returns 带有请求ID的响应
   */
  static withRequestId<T>(
    response: ProtocolResponse<T>,
    requestId: string
  ): ProtocolResponse<T> {
    return {
      ...response,
      requestId
    };
  }
  
  /**
   * 添加共振度信息
   * @param response 原始响应
   * @param resonance 共振度分数
   * @returns 带有共振度的响应
   */
  static withResonance<T>(
    response: ProtocolResponse<T>,
    resonance: number
  ): ProtocolResponse<T> {
    return {
      ...response,
      meta: {
        ...response.meta,
        resonance: Math.max(0, Math.min(1, resonance)) // 确保在0-1之间
      }
    };
  }
  
  /**
   * 添加行为残留
   * @param response 原始响应
   * @param residue 行为残留数组
   * @returns 带有残留信息的响应
   */
  static withResidue<T>(
    response: ProtocolResponse<T>,
    residue: string[]
  ): ProtocolResponse<T> {
    return {
      ...response,
      meta: {
        ...response.meta,
        residue
      }
    };
  }
  
  /**
   * 创建缓存响应
   * @param data 缓存的数据
   * @param cacheTime 缓存时间
   * @returns 标记为缓存的响应
   */
  static cached<T>(
    data: T,
    cacheTime: number
  ): ProtocolResponse<T> {
    return this.success(data, {
      cached: true,
      cacheTime,
      processingTime: 0
    });
  }
  
  /**
   * 批量响应包装
   * @param items 多个数据项
   * @param meta 共享的元数据
   * @returns 批量响应
   */
  static batch<T>(
    items: T[],
    meta?: Partial<ResponseMetadata>
  ): ProtocolResponse<T[]> {
    return this.success(items, {
      ...meta,
      dataVersion: `batch-${items.length}`
    });
  }
}

/**
 * 响应转换器
 * 用于将不同格式的响应转换为标准格式
 */
export class ResponseTransformer {
  /**
   * 转换分页响应
   */
  static paginatedResponse<T>(
    items: T[],
    page: number,
    pageSize: number,
    total: number
  ): ProtocolResponse<{
    items: T[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    return ProtocolResponseWrapper.success({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  }
  
  /**
   * 转换搜索响应
   */
  static searchResponse<T>(
    results: T[],
    query: string,
    totalMatches: number
  ): ProtocolResponse<{
    query: string;
    results: T[];
    totalMatches: number;
  }> {
    return ProtocolResponseWrapper.success({
      query,
      results,
      totalMatches
    });
  }
}

/**
 * 响应验证器
 * 确保响应符合协议规范
 */
export class ResponseValidator {
  static isValidProtocolResponse(response: any): response is ProtocolResponse<any> {
    return (
      response &&
      typeof response === 'object' &&
      typeof response.protocol === 'string' &&
      typeof response.version === 'string' &&
      typeof response.timestamp === 'number' &&
      typeof response.success === 'boolean' &&
      response.meta &&
      typeof response.meta === 'object'
    );
  }
  
  static validateResponse<T>(response: ProtocolResponse<T>): void {
    if (!this.isValidProtocolResponse(response)) {
      throw new Error('Invalid protocol response format');
    }
    
    if (!response.success && !response.error) {
      throw new Error('Error response must include error details');
    }
    
    if (response.success && response.data === undefined) {
      console.warn('Success response with undefined data');
    }
  }
}

// 导出便捷函数
export const wrapSuccess = ProtocolResponseWrapper.success.bind(ProtocolResponseWrapper);
export const wrapError = ProtocolResponseWrapper.error.bind(ProtocolResponseWrapper);
export const wrapCached = ProtocolResponseWrapper.cached.bind(ProtocolResponseWrapper);