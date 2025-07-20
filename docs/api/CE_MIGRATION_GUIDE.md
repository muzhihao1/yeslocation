# CE增强API迁移指南

## 概述
本指南帮助Terminal A从基础API迁移到CE增强版API，获得完整的Context Engineering增强功能。

## 快速开始

### 1. 导入变更
```typescript
// 旧版（基础API）
import { api } from '@/services/api';

// 新版（CE增强API）
import { apiEnhanced } from '@/services/apiEnhanced';
```

### 2. 初始化设置
```typescript
// 在应用启动时设置会话ID（用于行为追踪）
apiEnhanced.setSessionId(userSessionId);
```

## API调用变更

### 基本调用（无变化）
```typescript
// 调用方式保持不变，但响应格式增强
const response = await apiEnhanced.stores.getAll();
```

### 响应格式变化

#### 旧版响应格式：
```typescript
{
  success: true,
  data: [...],
  metadata: {
    timestamp: number,
    version: string,
    cached: boolean,
    processingTime: number
  },
  error?: ErrorInfo
}
```

#### 新版响应格式（ProtocolResponse）：
```typescript
{
  protocol: "yes-sports.api.v1",     // 协议标识
  version: "1.0",                    // 协议版本
  timestamp: 1705500000000,          // 时间戳
  success: true,                     // 成功标志
  data: [...],                       // 实际数据
  error?: ErrorInfo,                 // 错误信息（如果有）
  meta: {
    requestId: "req-xxx",            // 请求ID（用于追踪）
    timestamp: 1705500000000,        // 响应时间戳
    processingTime: 45,              // 处理时间（毫秒）
    cached: false,                   // 是否缓存
    resonance?: 0.85,                // 内容共振度（0-1）
    residue?: ["viewed_store_1"]     // 用户行为残留
  }
}
```

## 新增功能使用

### 1. 带用户上下文的调用
```typescript
// 传递用户上下文以获得共振度计算
const userContext: UserContext = {
  userId: "user-123",
  interests: [
    { category: "franchise", level: 0.8, keywords: ["加盟", "投资"] }
  ],
  location: {
    coordinates: [113.3, 23.1],
    city: "广州"
  },
  behavior: {
    totalTimeSpent: 300,
    searchQueries: ["广州门店", "加盟费用"]
  }
};

const response = await apiEnhanced.stores.getNearby(
  coords,
  options,
  userContext  // 传递上下文
);

// 响应中会包含共振度信息
console.log(response.meta.resonance); // 0.85
```

### 2. 使用CE增强功能

#### 获取用户行为模式
```typescript
const pattern = await apiEnhanced.ceEnhancements.getUserPattern();
if (pattern.success) {
  console.log(pattern.data.dominantActions);  // 主要行为类型
  console.log(pattern.data.interests);         // 兴趣领域
  console.log(pattern.data.preferences);       // 用户偏好
}
```

#### 获取性能报告
```typescript
const report = await apiEnhanced.ceEnhancements.getPerformanceReport();
if (report.success) {
  console.log(report.data.summary);            // 总体统计
  console.log(report.data.endpoints);          // 各端点性能
  console.log(report.data.recommendations);    // 优化建议
}
```

#### 计算内容共振度
```typescript
const resonance = await apiEnhanced.ceEnhancements.calculateResonance(
  userContext,
  contentItem
);
console.log(resonance.data.score);            // 共振度分数
console.log(resonance.data.reasons);          // 推荐理由
```

## 推荐内容增强

推荐API现在返回每个推荐项的共振度信息：

```typescript
const recommendations = await apiEnhanced.recommendations.getContent(userContext);

recommendations.data.forEach(item => {
  console.log(item.resonance);          // 共振度分数
  console.log(item.resonanceReasons);   // 共振原因
});
```

## 前端集成建议

### 1. 共振度可视化组件
```typescript
interface ResonanceIndicatorProps {
  score: number;
  children: React.ReactNode;
}

const ResonanceIndicator: React.FC<ResonanceIndicatorProps> = ({ score, children }) => {
  const getColor = () => {
    if (score >= 0.8) return 'border-green-500';
    if (score >= 0.6) return 'border-yellow-500';
    return 'border-gray-300';
  };
  
  return (
    <div className={`relative border-2 ${getColor()} rounded-lg p-4`}>
      <div className="absolute top-2 right-2 text-sm font-semibold">
        {Math.round(score * 100)}% 匹配
      </div>
      {children}
    </div>
  );
};
```

### 2. 集成到Context Engine
```typescript
// 在 ContextEngine 中集成残留追踪
import { residueTracker } from '@/tracking/residueTracker';

const trackUserAction = (action: string, target: string) => {
  residueTracker.track(sessionId, action, target);
};

// 在行为追踪时调用
trackUserAction('VIEW', 'store_detail_1');
```

## 性能监控集成

在开发环境中显示性能监控信息：

```typescript
const PerformanceWidget: React.FC = () => {
  const [health, setHealth] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await apiEnhanced.ceEnhancements.getHealthStatus();
      if (status.success) {
        setHealth(status.data);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!health || process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded p-4">
      <div className={`text-sm font-bold ${
        health.status === 'healthy' ? 'text-green-500' : 
        health.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
      }`}>
        API Health: {health.status}
      </div>
      {health.issues.map((issue, i) => (
        <div key={i} className="text-xs text-gray-600">{issue}</div>
      ))}
    </div>
  );
};
```

## 逐步迁移策略

1. **第一阶段**：保持现有功能，仅替换导入
   - 将 `api` 替换为 `apiEnhanced`
   - 确保所有功能正常工作

2. **第二阶段**：添加用户上下文
   - 在关键API调用中传递用户上下文
   - 开始使用共振度信息

3. **第三阶段**：集成CE增强功能
   - 添加共振度可视化
   - 集成性能监控
   - 使用行为模式分析

## 注意事项

1. **向后兼容**：增强API完全兼容基础API，可以直接替换
2. **性能影响**：CE增强功能会略微增加响应时间（约10-20ms）
3. **隐私考虑**：行为追踪仅在会话内，不持久化个人信息

## 问题排查

如果遇到问题，检查：
1. 是否正确设置了会话ID
2. 用户上下文格式是否正确
3. 查看浏览器控制台的错误信息

## 完整示例

```typescript
// App.tsx
import { apiEnhanced } from '@/services/apiEnhanced';
import { useContext } from '@/context/ContextEngine';

function App() {
  const { userContext, sessionId } = useContext();
  
  // 初始化
  useEffect(() => {
    apiEnhanced.setSessionId(sessionId);
  }, [sessionId]);
  
  // 使用增强API
  const loadStores = async () => {
    const response = await apiEnhanced.stores.getNearby(
      userContext.location.coordinates,
      { radius: 5 },
      userContext
    );
    
    if (response.success) {
      // 处理数据，包含共振度信息
      const storesWithResonance = response.data.map(store => ({
        ...store,
        resonance: response.meta.resonance
      }));
      
      setStores(storesWithResonance);
    }
  };
  
  return <YourApp />;
}
```

---

迁移到CE增强API将为用户提供更智能、更个性化的体验。如有任何问题，请查看API_GUIDE.md或联系Terminal B团队。