/**
 * Basic Performance Monitor
 * 基于Context Engineering的API性能监控系统
 * 追踪、分析和优化API调用性能
 */

/**
 * API调用指标
 */
export interface APIMetric {
  /** 端点路径 */
  endpoint: string;
  
  /** 请求方法 */
  method?: string;
  
  /** 响应时间（毫秒） */
  duration: number;
  
  /** 是否成功 */
  success: boolean;
  
  /** 错误代码（如果失败） */
  errorCode?: string;
  
  /** 时间戳 */
  timestamp: number;
  
  /** 请求大小（字节） */
  requestSize?: number;
  
  /** 响应大小（字节） */
  responseSize?: number;
  
  /** 附加标签 */
  tags?: Record<string, string>;
}

/**
 * 端点性能统计
 */
export interface EndpointStats {
  /** 端点名称 */
  endpoint: string;
  
  /** 调用次数 */
  calls: number;
  
  /** 成功次数 */
  successCount: number;
  
  /** 成功率 */
  successRate: number;
  
  /** 平均响应时间 */
  avgDuration: number;
  
  /** 最小响应时间 */
  minDuration: number;
  
  /** 最大响应时间 */
  maxDuration: number;
  
  /** P50响应时间 */
  p50Duration: number;
  
  /** P95响应时间 */
  p95Duration: number;
  
  /** P99响应时间 */
  p99Duration: number;
  
  /** 平均响应大小 */
  avgResponseSize?: number;
}

/**
 * 性能报告
 */
export interface PerformanceReport {
  /** 报告生成时间 */
  generatedAt: number;
  
  /** 统计时间范围 */
  timeRange: {
    start: number;
    end: number;
  };
  
  /** 总体统计 */
  summary: {
    totalCalls: number;
    totalSuccess: number;
    totalFailure: number;
    overallSuccessRate: number;
    avgResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
  };
  
  /** 各端点统计 */
  endpoints: EndpointStats[];
  
  /** 慢查询列表 */
  slowQueries: APIMetric[];
  
  /** 错误分析 */
  errorAnalysis: Array<{
    errorCode: string;
    count: number;
    endpoints: string[];
  }>;
  
  /** 性能趋势 */
  trends: {
    responseTimeTrend: 'improving' | 'stable' | 'degrading';
    successRateTrend: 'improving' | 'stable' | 'degrading';
  };
  
  /** 优化建议 */
  recommendations: string[];
}

/**
 * 监控器配置
 */
export interface MonitorConfig {
  /** 最大保留指标数 */
  maxMetrics: number;
  
  /** 慢查询阈值（毫秒） */
  slowQueryThreshold: number;
  
  /** 报告时间窗口（毫秒） */
  reportWindow: number;
  
  /** 是否启用自动清理 */
  autoCleanup: boolean;
  
  /** 清理间隔（毫秒） */
  cleanupInterval: number;
}

/**
 * Performance Monitor类
 * 监控和分析API性能
 */
export class PerformanceMonitor {
  private metrics: APIMetric[] = [];
  private config: MonitorConfig;
  private cleanupTimer?: NodeJS.Timeout;
  
  constructor(config?: Partial<MonitorConfig>) {
    this.config = {
      maxMetrics: 10000,
      slowQueryThreshold: 1000, // 1秒
      reportWindow: 3600000, // 1小时
      autoCleanup: true,
      cleanupInterval: 300000, // 5分钟
      ...config
    };
    
    if (this.config.autoCleanup) {
      this.startAutoCleanup();
    }
  }
  
  /**
   * 开始计时
   * @param endpoint 端点名称
   * @param method 请求方法
   * @returns 结束计时的函数
   */
  startTimer(endpoint: string, method: string = 'GET'): (success: boolean, errorCode?: string) => void {
    const start = Date.now();
    
    return (success: boolean, errorCode?: string) => {
      const duration = Date.now() - start;
      this.record({
        endpoint,
        method,
        duration,
        success,
        errorCode,
        timestamp: Date.now()
      });
    };
  }
  
  /**
   * 记录API调用指标
   * @param metric API指标
   */
  record(metric: APIMetric): void {
    this.metrics.push(metric);
    
    // 限制指标数量
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }
  }
  
  /**
   * 批量记录指标
   * @param metrics 指标数组
   */
  recordBatch(metrics: APIMetric[]): void {
    metrics.forEach(metric => this.record(metric));
  }
  
  /**
   * 生成性能报告
   * @param timeWindow 时间窗口（毫秒）
   * @returns 性能报告
   */
  generateReport(timeWindow?: number): PerformanceReport {
    const window = timeWindow || this.config.reportWindow;
    const now = Date.now();
    const startTime = now - window;
    
    // 筛选时间窗口内的指标
    const windowMetrics = this.metrics.filter(m => m.timestamp >= startTime);
    
    if (windowMetrics.length === 0) {
      return this.emptyReport(startTime, now);
    }
    
    // 计算总体统计
    const summary = this.calculateSummary(windowMetrics);
    
    // 计算各端点统计
    const endpoints = this.calculateEndpointStats(windowMetrics);
    
    // 查找慢查询
    const slowQueries = this.findSlowQueries(windowMetrics);
    
    // 错误分析
    const errorAnalysis = this.analyzeErrors(windowMetrics);
    
    // 分析趋势
    const trends = this.analyzeTrends(windowMetrics);
    
    // 生成建议
    const recommendations = this.generateRecommendations(
      summary,
      endpoints,
      slowQueries,
      errorAnalysis,
      trends
    );
    
    return {
      generatedAt: now,
      timeRange: { start: startTime, end: now },
      summary,
      endpoints,
      slowQueries,
      errorAnalysis,
      trends,
      recommendations
    };
  }
  
  /**
   * 获取实时统计
   * @returns 实时统计数据
   */
  getRealTimeStats(): {
    last1Min: { calls: number; avgDuration: number; successRate: number };
    last5Min: { calls: number; avgDuration: number; successRate: number };
    last15Min: { calls: number; avgDuration: number; successRate: number };
  } {
    const now = Date.now();
    
    return {
      last1Min: this.getStatsForWindow(now - 60000, now),
      last5Min: this.getStatsForWindow(now - 300000, now),
      last15Min: this.getStatsForWindow(now - 900000, now)
    };
  }
  
  /**
   * 获取健康状态
   * @returns 健康状态
   */
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
  } {
    const now = Date.now();
    const realTimeStats = this.getRealTimeStats();
    const issues: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    // 检查成功率
    if (realTimeStats.last1Min.successRate < 0.95) {
      issues.push('成功率低于95%');
      status = 'warning';
    }
    if (realTimeStats.last1Min.successRate < 0.90) {
      status = 'critical';
    }
    
    // 检查响应时间
    if (realTimeStats.last1Min.avgDuration > 1000) {
      issues.push('平均响应时间超过1秒');
      if (status === 'healthy') status = 'warning';
    }
    if (realTimeStats.last1Min.avgDuration > 3000) {
      status = 'critical';
    }
    
    // 检查是否有大量慢查询
    const recentSlowQueries = this.metrics
      .filter(m => m.timestamp > now - 60000 && m.duration > this.config.slowQueryThreshold)
      .length;
    
    if (recentSlowQueries > 10) {
      issues.push(`最近1分钟有${recentSlowQueries}个慢查询`);
      if (status === 'healthy') status = 'warning';
    }
    
    return { status, issues };
  }
  
  /**
   * 清理过期指标
   * @param keepWindow 保留时间窗口（毫秒）
   */
  cleanup(keepWindow: number = this.config.reportWindow * 2): void {
    const cutoff = Date.now() - keepWindow;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
  }
  
  /**
   * 导出指标数据
   * @returns 所有指标
   */
  exportMetrics(): APIMetric[] {
    return [...this.metrics];
  }
  
  /**
   * 导入指标数据
   * @param metrics 指标数据
   */
  importMetrics(metrics: APIMetric[]): void {
    this.metrics = [...this.metrics, ...metrics];
    this.cleanup();
  }
  
  /**
   * 停止监控器
   */
  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }
  
  // 私有方法
  
  private startAutoCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }
  
  private calculateSummary(metrics: APIMetric[]): PerformanceReport['summary'] {
    const totalCalls = metrics.length;
    const successMetrics = metrics.filter(m => m.success);
    const totalSuccess = successMetrics.length;
    const totalFailure = totalCalls - totalSuccess;
    
    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    
    return {
      totalCalls,
      totalSuccess,
      totalFailure,
      overallSuccessRate: totalCalls > 0 ? totalSuccess / totalCalls : 1,
      avgResponseTime: this.calculateAverage(durations),
      p95ResponseTime: this.calculatePercentile(durations, 95),
      p99ResponseTime: this.calculatePercentile(durations, 99)
    };
  }
  
  private calculateEndpointStats(metrics: APIMetric[]): EndpointStats[] {
    const endpointMap = new Map<string, APIMetric[]>();
    
    // 按端点分组
    metrics.forEach(metric => {
      const existing = endpointMap.get(metric.endpoint) || [];
      existing.push(metric);
      endpointMap.set(metric.endpoint, existing);
    });
    
    // 计算每个端点的统计
    return Array.from(endpointMap.entries()).map(([endpoint, endpointMetrics]) => {
      const durations = endpointMetrics.map(m => m.duration).sort((a, b) => a - b);
      const successCount = endpointMetrics.filter(m => m.success).length;
      
      return {
        endpoint,
        calls: endpointMetrics.length,
        successCount,
        successRate: endpointMetrics.length > 0 ? successCount / endpointMetrics.length : 1,
        avgDuration: this.calculateAverage(durations),
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        p50Duration: this.calculatePercentile(durations, 50),
        p95Duration: this.calculatePercentile(durations, 95),
        p99Duration: this.calculatePercentile(durations, 99),
        avgResponseSize: this.calculateAverage(
          endpointMetrics
            .filter(m => m.responseSize !== undefined)
            .map(m => m.responseSize!)
        )
      };
    });
  }
  
  private findSlowQueries(metrics: APIMetric[]): APIMetric[] {
    return metrics
      .filter(m => m.duration > this.config.slowQueryThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 20); // 返回最慢的20个
  }
  
  private analyzeErrors(metrics: APIMetric[]): PerformanceReport['errorAnalysis'] {
    const errorMap = new Map<string, { count: number; endpoints: Set<string> }>();
    
    metrics
      .filter(m => !m.success && m.errorCode)
      .forEach(metric => {
        const existing = errorMap.get(metric.errorCode!) || { count: 0, endpoints: new Set() };
        existing.count++;
        existing.endpoints.add(metric.endpoint);
        errorMap.set(metric.errorCode!, existing);
      });
    
    return Array.from(errorMap.entries())
      .map(([errorCode, data]) => ({
        errorCode,
        count: data.count,
        endpoints: Array.from(data.endpoints)
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  private analyzeTrends(metrics: APIMetric[]): PerformanceReport['trends'] {
    if (metrics.length < 10) {
      return {
        responseTimeTrend: 'stable',
        successRateTrend: 'stable'
      };
    }
    
    // 将指标分成两半进行比较
    const midPoint = Math.floor(metrics.length / 2);
    const firstHalf = metrics.slice(0, midPoint);
    const secondHalf = metrics.slice(midPoint);
    
    // 响应时间趋势
    const avgFirst = this.calculateAverage(firstHalf.map(m => m.duration));
    const avgSecond = this.calculateAverage(secondHalf.map(m => m.duration));
    
    let responseTimeTrend: PerformanceReport['trends']['responseTimeTrend'] = 'stable';
    if (avgSecond > avgFirst * 1.2) {
      responseTimeTrend = 'degrading';
    } else if (avgSecond < avgFirst * 0.8) {
      responseTimeTrend = 'improving';
    }
    
    // 成功率趋势
    const successRateFirst = firstHalf.filter(m => m.success).length / firstHalf.length;
    const successRateSecond = secondHalf.filter(m => m.success).length / secondHalf.length;
    
    let successRateTrend: PerformanceReport['trends']['successRateTrend'] = 'stable';
    if (successRateSecond < successRateFirst - 0.05) {
      successRateTrend = 'degrading';
    } else if (successRateSecond > successRateFirst + 0.05) {
      successRateTrend = 'improving';
    }
    
    return { responseTimeTrend, successRateTrend };
  }
  
  private generateRecommendations(
    summary: PerformanceReport['summary'],
    endpoints: EndpointStats[],
    slowQueries: APIMetric[],
    errorAnalysis: PerformanceReport['errorAnalysis'],
    trends: PerformanceReport['trends']
  ): string[] {
    const recommendations: string[] = [];
    
    // 基于总体性能
    if (summary.avgResponseTime > 1000) {
      recommendations.push('平均响应时间超过1秒，建议优化查询性能或增加缓存');
    }
    
    if (summary.overallSuccessRate < 0.95) {
      recommendations.push('成功率低于95%，建议检查服务稳定性和错误处理');
    }
    
    // 基于端点性能
    const slowEndpoints = endpoints.filter(e => e.avgDuration > 2000);
    if (slowEndpoints.length > 0) {
      recommendations.push(
        `以下端点响应缓慢：${slowEndpoints.map(e => e.endpoint).join(', ')}。建议优化这些端点`
      );
    }
    
    // 基于慢查询
    if (slowQueries.length > 10) {
      recommendations.push('存在大量慢查询，建议分析慢查询日志并优化');
    }
    
    // 基于错误分析
    if (errorAnalysis.length > 0 && errorAnalysis[0].count > 10) {
      recommendations.push(
        `错误代码 ${errorAnalysis[0].errorCode} 频繁出现（${errorAnalysis[0].count}次），建议调查原因`
      );
    }
    
    // 基于趋势
    if (trends.responseTimeTrend === 'degrading') {
      recommendations.push('响应时间呈下降趋势，建议及时排查性能问题');
    }
    
    if (trends.successRateTrend === 'degrading') {
      recommendations.push('成功率呈下降趋势，可能存在服务稳定性问题');
    }
    
    // 缓存建议
    const highFreqEndpoints = endpoints
      .filter(e => e.calls > 100)
      .sort((a, b) => b.calls - a.calls);
    
    if (highFreqEndpoints.length > 0) {
      recommendations.push(
        `高频端点 ${highFreqEndpoints[0].endpoint} 可以考虑增加缓存策略`
      );
    }
    
    return recommendations;
  }
  
  private getStatsForWindow(start: number, end: number): {
    calls: number;
    avgDuration: number;
    successRate: number;
  } {
    const windowMetrics = this.metrics.filter(m => m.timestamp >= start && m.timestamp <= end);
    
    if (windowMetrics.length === 0) {
      return { calls: 0, avgDuration: 0, successRate: 1 };
    }
    
    const durations = windowMetrics.map(m => m.duration);
    const successCount = windowMetrics.filter(m => m.success).length;
    
    return {
      calls: windowMetrics.length,
      avgDuration: this.calculateAverage(durations),
      successRate: successCount / windowMetrics.length
    };
  }
  
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }
  
  private calculatePercentile(sortedNumbers: number[], percentile: number): number {
    if (sortedNumbers.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sortedNumbers.length) - 1;
    return sortedNumbers[Math.max(0, Math.min(index, sortedNumbers.length - 1))];
  }
  
  private emptyReport(start: number, end: number): PerformanceReport {
    return {
      generatedAt: Date.now(),
      timeRange: { start, end },
      summary: {
        totalCalls: 0,
        totalSuccess: 0,
        totalFailure: 0,
        overallSuccessRate: 1,
        avgResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0
      },
      endpoints: [],
      slowQueries: [],
      errorAnalysis: [],
      trends: {
        responseTimeTrend: 'stable',
        successRateTrend: 'stable'
      },
      recommendations: ['没有足够的数据生成建议']
    };
  }
}

// 导出单例
export const performanceMonitor = new PerformanceMonitor();