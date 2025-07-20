# Terminal B 任务指南（更新版）

## 角色定位
作为Terminal B，你负责：
- 📊 业务逻辑层和数据处理
- 📁 内容管理系统（基于CE协议）
- 🎯 智能推荐算法
- 🔌 API接口和服务层
- 🏗️ 数据架构和Mock系统

## 已完成任务总结 ✅
根据CONTEXT_STATE.json，已完成：
1. ✅ 数据模型定义（Store, FranchiseInfo, TrainingProgram, Product）
2. ✅ CE协议实现（6种文档协议）
3. ✅ DataProvider接口定义
4. ✅ 数据提取工具（从yeslocation.html提取20家门店）
5. ✅ Mock数据系统（20家门店 + 加盟信息 + 培训数据 + 产品数据）
6. ✅ StoreService实现（含距离计算、分组、推荐功能）

## 当前任务：Phase 2 - 内容服务与推荐算法（重新规划）

### 任务2.1：完成内容管理服务 🔄 优先级：高
```typescript
// src/services/contentService.ts
import { 
  ExecutiveBrief, 
  StrategicPlan, 
  TechnicalDoc, 
  StructuredArticle 
} from '../protocols/ceProtocols';

export class ContentService {
  // 获取公司信息（关于我们页面）
  async getCompanyInfo(): Promise<ExecutiveBrief> {
    return {
      protocol: DocumentProtocol.EXECUTIVE_BRIEF,
      metadata: {
        title: "云南耶氏体育文化发展有限公司",
        author: "耶氏体育",
        created: "2022-02-24",
        version: "1.0"
      },
      content: {
        summary: "把职业台球带到大众生活中",
        keyPoints: [
          "20家连锁门店覆盖昆明全城",
          "西南地区唯一台球桌生产厂家",
          "四大品牌：耶氏、古帮特、鑫隆基、申天堂",
          "全产业链布局：生产-销售-运营-培训"
        ],
        sections: {
          history: "2018年创立，从第一家店开始...",
          mission: "让普罗大众能打得起球，让台球成为全民运动",
          values: "专业、品质、服务、创新",
          team: {
            founder: "朱勇孟",
            employees: "100+",
            philosophy: "把职业台球运动带到大众生活中"
          }
        }
      }
    };
  }

  // 获取加盟信息（加盟合作页面）
  async getFranchiseInfo(): Promise<StrategicPlan> {
    return {
      protocol: DocumentProtocol.STRATEGIC_PLAN,
      // 从mockData中获取完整的加盟信息
    };
  }

  // 获取培训信息（培训中心页面）
  async getTrainingInfo(): Promise<TechnicalDoc> {
    return {
      protocol: DocumentProtocol.TECHNICAL_DOC,
      // 从mockData中获取培训课程信息
    };
  }

  // 获取产品信息（产品中心页面）
  async getProductsInfo(): Promise<StructuredArticle> {
    return {
      protocol: DocumentProtocol.STRUCTURED_ARTICLE,
      // 从mockData中获取产品信息
    };
  }
}
```

### 任务2.2：实现智能推荐算法 🔄 优先级：高
```typescript
// src/services/recommendationService.ts
import { UserContext } from '../types/context';
import { ContentRecommendation } from '../types/recommendation';

export class RecommendationService {
  private storeService: StoreService;
  private contentService: ContentService;

  // 基于Context Engine的智能推荐
  async recommendContent(context: UserContext): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    // 1. 基于用户旅程阶段推荐
    switch (context.journey) {
      case 'awareness':
        recommendations.push({
          type: 'about',
          module: await this.contentService.getCompanyInfo(),
          priority: 10,
          reason: '了解耶氏体育'
        });
        break;
      
      case 'interest':
        if (context.location) {
          const nearestStores = await this.storeService.getNearestStores(
            context.location, 
            3
          );
          recommendations.push({
            type: 'stores',
            module: { stores: nearestStores },
            priority: 9,
            reason: '查看附近门店'
          });
        }
        break;
      
      case 'consideration':
        recommendations.push({
          type: 'franchise',
          module: await this.contentService.getFranchiseInfo(),
          priority: 8,
          reason: '了解加盟机会'
        });
        break;
      
      case 'decision':
        recommendations.push({
          type: 'contact',
          module: { action: 'call', phone: '17787147147' },
          priority: 10,
          reason: '立即联系我们'
        });
        break;
    }
    
    // 2. 基于用户兴趣推荐
    if (context.interests.includes('training')) {
      recommendations.push({
        type: 'training',
        module: await this.contentService.getTrainingInfo(),
        priority: 7,
        reason: '您可能对培训感兴趣'
      });
    }
    
    // 3. 基于参与度推荐
    if (context.engagementLevel === 'high') {
      recommendations.push({
        type: 'products',
        module: await this.contentService.getProductsInfo(),
        priority: 6,
        reason: '查看我们的产品'
      });
    }
    
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  // 推荐最佳行动
  recommendNextAction(context: UserContext): string[] {
    const actions: string[] = [];
    
    if (!context.location) {
      actions.push('开启位置服务，查找最近门店');
    }
    
    if (context.pageViews < 3) {
      actions.push('了解更多关于耶氏体育');
    }
    
    if (context.interests.includes('franchise') && context.engagementLevel === 'high') {
      actions.push('申请加盟咨询');
    }
    
    return actions;
  }
}
```

### 任务2.3：创建统一API服务层 🔄 优先级：高
```typescript
// src/services/api.ts
export class API {
  private storeService: StoreService;
  private contentService: ContentService;
  private recommendationService: RecommendationService;
  private mockAPI: MockAPI;

  constructor() {
    this.storeService = new StoreService();
    this.contentService = new ContentService();
    this.recommendationService = new RecommendationService();
    this.mockAPI = new MockAPI();
  }

  // 门店相关API
  stores = {
    getAll: () => this.mockAPI.wrapWithDelay(
      this.storeService.getAllStores()
    ),
    getNearby: (coords: Coordinates) => this.mockAPI.wrapWithDelay(
      this.storeService.getNearestStores(coords)
    ),
    getByDistrict: (district: string) => this.mockAPI.wrapWithDelay(
      this.storeService.getStoresByDistrict().get(district) || []
    ),
    getStatistics: () => this.mockAPI.wrapWithDelay(
      this.storeService.getStoreStatistics()
    )
  };

  // 内容相关API
  content = {
    getCompanyInfo: () => this.mockAPI.wrapWithDelay(
      this.contentService.getCompanyInfo()
    ),
    getFranchiseInfo: () => this.mockAPI.wrapWithDelay(
      this.contentService.getFranchiseInfo()
    ),
    getTrainingInfo: () => this.mockAPI.wrapWithDelay(
      this.contentService.getTrainingInfo()
    ),
    getProductsInfo: () => this.mockAPI.wrapWithDelay(
      this.contentService.getProductsInfo()
    )
  };

  // 推荐相关API
  recommendations = {
    getContent: (context: UserContext) => this.mockAPI.wrapWithDelay(
      this.recommendationService.recommendContent(context)
    ),
    getNextActions: (context: UserContext) => this.mockAPI.wrapWithDelay(
      this.recommendationService.recommendNextAction(context)
    )
  };
}

// 导出单例
export const api = new API();
```

### 任务2.4：创建Mock API包装器
```typescript
// src/services/mockApi.ts
export class MockAPI {
  // 模拟网络延迟
  async wrapWithDelay<T>(data: T, delay: number = 300): Promise<T> {
    await this.delay(delay);
    return data;
  }

  // 模拟API错误
  async wrapWithError<T>(
    data: T, 
    errorRate: number = 0.05
  ): Promise<T> {
    if (Math.random() < errorRate) {
      throw new Error('API Error: Network request failed');
    }
    return this.wrapWithDelay(data);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## 今日重点任务
1. 🔥 完成ContentService所有方法实现
2. 🔥 实现智能推荐算法
3. 🔥 创建统一的API服务层
4. 🔥 编写API使用文档

## 与Terminal A的协作需求
1. ✅ 提供完整的API接口供页面调用
2. ✅ 确保数据格式与页面需求匹配
3. ✅ 支持Context Engine的集成
4. ⏳ 提供API文档和使用示例

## API文档示例
```typescript
// API使用示例 - 供Terminal A参考

// 1. 获取所有门店
const stores = await api.stores.getAll();

// 2. 获取最近的3家门店
const userLocation = { latitude: 24.880, longitude: 102.833 };
const nearestStores = await api.stores.getNearby(userLocation);

// 3. 获取公司信息
const companyInfo = await api.content.getCompanyInfo();

// 4. 获取推荐内容
const userContext = {
  journey: 'interest',
  location: userLocation,
  interests: ['franchise', 'training'],
  engagementLevel: 'medium',
  pageViews: 5
};
const recommendations = await api.recommendations.getContent(userContext);
```

## 注意事项
1. 保持API响应的一致性
2. 处理异步操作和错误情况
3. 优化数据结构，减少冗余
4. 为未来真实API预留扩展接口

---

**当前优先级：完成ContentService + 推荐算法 + API服务层！**