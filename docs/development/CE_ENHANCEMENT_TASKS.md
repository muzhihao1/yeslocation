# Context Engineering增强任务清单

## 概述
基于Context Engineering理念，选择4个简单实用的增强功能，提升系统的智能化水平。

## Terminal B任务清单

### 1. Protocol Response Wrapper ⏳
**目标**: 标准化所有API响应格式

**实现步骤**:
```typescript
// src/protocols/responseWrapper.ts
export interface ProtocolResponse<T> {
  protocol: string;           // "yes-sports.api.v1"
  timestamp: number;         
  data: T;
  meta: {
    cached: boolean;
    processingTime: number;
    resonance?: number;      // 0-1之间的共振度
    residue?: string[];      // 用户行为残留
  };
}

export class ResponseWrapper {
  static wrap<T>(data: T, meta?: Partial<ResponseMeta>): ProtocolResponse<T> {
    return {
      protocol: "yes-sports.api.v1",
      timestamp: Date.now(),
      data,
      meta: {
        cached: false,
        processingTime: 0,
        ...meta
      }
    };
  }
}
```

**集成位置**: 
- 修改 `api.ts` 中所有返回值
- 更新 `DataResponse` 接口

### 2. Basic Field Resonance ⏳
**目标**: 增强推荐相关性计算

**实现步骤**:
```typescript
// src/field/resonance.ts
export class FieldResonance {
  // 计算用户场与内容场的共振度
  calculate(userContext: UserContext, content: any): number {
    let score = 0;
    
    // 兴趣匹配度
    userContext.interests.forEach(interest => {
      if (this.matchesContent(interest, content)) {
        score += interest.level * 0.1;
      }
    });
    
    // 位置相关性
    if (userContext.location && content.location) {
      const distance = this.calculateDistance(userContext.location, content.location);
      score += (10 - Math.min(distance, 10)) * 0.05;
    }
    
    // 时间相关性
    score += this.timeRelevance(content) * 0.05;
    
    return Math.min(score, 1);
  }
}
```

**集成位置**:
- `recommendationService.ts` 的推荐算法中
- 返回值包含共振度分数

### 3. Simple Residue Tracker ⏳
**目标**: 追踪用户行为形成模式

**实现步骤**:
```typescript
// src/tracking/residueTracker.ts
export interface UserResidue {
  action: string;      // "view", "click", "search"
  target: string;      // 目标ID或类型
  timestamp: number;
  strength: number;    // 0-1，随时间衰减
}

export class ResidueTracker {
  private residues = new Map<string, UserResidue[]>();
  
  track(sessionId: string, action: string, target: string) {
    const residue: UserResidue = {
      action,
      target,
      timestamp: Date.now(),
      strength: 1.0
    };
    
    const userResidues = this.residues.get(sessionId) || [];
    userResidues.push(residue);
    
    // 保留最近100条，老化处理
    this.ageResidues(userResidues);
    this.residues.set(sessionId, userResidues.slice(-100));
  }
  
  getPattern(sessionId: string): UserPattern {
    const residues = this.residues.get(sessionId) || [];
    
    return {
      dominantActions: this.findDominantActions(residues),
      interests: this.extractInterests(residues),
      behaviorCycle: this.detectCycle(residues)
    };
  }
  
  private ageResidues(residues: UserResidue[]) {
    const now = Date.now();
    residues.forEach(r => {
      const age = (now - r.timestamp) / (1000 * 60 * 60); // 小时
      r.strength = Math.max(0, 1 - age / 24); // 24小时衰减到0
    });
  }
}
```

**集成位置**:
- 创建全局实例
- 在API调用时记录行为
- 提供模式分析接口

### 4. Basic Performance Monitor ⏳
**目标**: 监控和优化API性能

**实现步骤**:
```typescript
// src/monitor/performanceMonitor.ts
export class PerformanceMonitor {
  private metrics: APIMetric[] = [];
  private readonly MAX_METRICS = 1000;
  
  startTimer(endpoint: string): () => void {
    const start = Date.now();
    
    return () => {
      const duration = Date.now() - start;
      this.record(endpoint, duration, true);
    };
  }
  
  record(endpoint: string, duration: number, success: boolean) {
    this.metrics.push({
      endpoint,
      duration,
      success,
      timestamp: Date.now()
    });
    
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }
  }
  
  getReport(): PerformanceReport {
    const byEndpoint = this.groupByEndpoint();
    
    return {
      summary: {
        totalCalls: this.metrics.length,
        avgResponseTime: this.calculateAverage(this.metrics),
        successRate: this.calculateSuccessRate(this.metrics),
        p95ResponseTime: this.calculatePercentile(this.metrics, 95)
      },
      endpoints: Object.entries(byEndpoint).map(([endpoint, metrics]) => ({
        endpoint,
        calls: metrics.length,
        avgTime: this.calculateAverage(metrics),
        successRate: this.calculateSuccessRate(metrics)
      })),
      slowQueries: this.findSlowQueries(),
      recommendations: this.generateRecommendations()
    };
  }
}
```

**集成位置**:
- 包装所有API方法
- 添加性能报告端点
- 定期生成优化建议

## Terminal A任务清单

### 1. 集成Residue Tracker ⏳
**目标**: 在Context Engine中追踪用户行为

**实现位置**: `src/context/ContextEngine.tsx`
```typescript
// 在Fields Layer添加
residueTracker: new ResidueTracker(),

// 在行为追踪时记录
trackBehavior(action: string, target: string) {
  this.residueTracker.track(this.sessionId, action, target);
  
  // 获取模式用于优化
  const pattern = this.residueTracker.getPattern(this.sessionId);
  this.optimizeBasedOnPattern(pattern);
}
```

### 2. Field Resonance可视化 ⏳
**目标**: 展示推荐内容的相关性

**实现组件**: `src/components/ResonanceIndicator.tsx`
```typescript
interface ResonanceIndicatorProps {
  score: number; // 0-1
  children: React.ReactNode;
}

export const ResonanceIndicator: React.FC<ResonanceIndicatorProps> = ({ 
  score, 
  children 
}) => {
  const getColor = () => {
    if (score > 0.8) return 'border-green-500';
    if (score > 0.5) return 'border-yellow-500';
    return 'border-gray-300';
  };
  
  return (
    <div className={`relative border-2 ${getColor()} rounded-lg p-1`}>
      <div className="absolute top-0 right-0 bg-white px-2 py-1 text-xs">
        匹配度: {(score * 100).toFixed(0)}%
      </div>
      {children}
    </div>
  );
};
```

## 实施时间表

### 第1周（Terminal B后端实现）
- **Day 1-2**: Protocol Response Wrapper
  - 创建协议包装器
  - 更新所有API响应
  - 测试响应格式
  
- **Day 3-4**: Field Resonance + Residue Tracker
  - 实现共振度计算
  - 创建残留追踪器
  - 集成到推荐系统
  
- **Day 5**: Performance Monitor
  - 实现性能监控
  - 添加报告生成
  - 集成到API层

### 第2周（Terminal A前端集成）
- **Day 6-7**: Residue集成
  - 添加到Context Engine
  - 实现模式分析
  - 优化内容排序
  
- **Day 8-9**: Resonance可视化
  - 创建展示组件
  - 集成到各页面
  - 添加用户提示
  
- **Day 10**: 测试优化
  - 端到端测试
  - 性能调优
  - 文档更新

## 成功标准

1. **Response Wrapper**: 
   - [ ] 所有API返回统一格式
   - [ ] 包含完整元数据
   - [ ] 向后兼容

2. **Field Resonance**:
   - [ ] 推荐准确度提升20%+
   - [ ] 共振度计算<50ms
   - [ ] 用户可见分数

3. **Residue Tracker**:
   - [ ] 捕获率>95%
   - [ ] 模式识别准确
   - [ ] 内存占用<10MB

4. **Performance Monitor**:
   - [ ] 覆盖所有端点
   - [ ] 实时报告生成
   - [ ] 自动优化建议

## 注意事项

1. **保持简单**: 不过度设计，专注核心功能
2. **向后兼容**: 不破坏现有功能
3. **性能优先**: 确保不影响用户体验
4. **可观测性**: 添加适当的日志和监控

---

**更新时间**: 2025-01-17 17:00
**状态**: 待实施