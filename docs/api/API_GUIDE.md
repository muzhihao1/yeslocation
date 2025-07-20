# 耶氏体育 API 使用指南

## 概述

本文档为Terminal A提供完整的API接口说明。所有API已经实现Mock数据和延迟模拟，可直接在前端调用。

## 快速开始

```typescript
import { api } from '@/services/api';

// 使用示例
const stores = await api.stores.getAll();
const companyInfo = await api.content.getCompanyInfo();
```

## API 模块

### 1. 门店 API (stores)

#### 1.1 获取所有门店
```typescript
const response = await api.stores.getAll();

// 返回值类型
{
  success: boolean;
  data?: Store[];
  error?: ErrorResponse;
  metadata: ResponseMetadata;
}
```

#### 1.2 根据ID获取门店
```typescript
const response = await api.stores.getById(1);
```

#### 1.3 获取附近门店
```typescript
const userLocation: Coordinates = [102.7014, 25.0389]; // [经度, 纬度]
const options = {
  limit: 5,               // 最多返回5家
  maxDistance: 10,        // 10公里内
  includeDistance: true,  // 包含距离信息
  sortByDistance: true    // 按距离排序
};

const response = await api.stores.getNearby(userLocation, options);
```

#### 1.4 按区域获取门店
```typescript
const response = await api.stores.getByDistrict("呈贡区");
```

#### 1.5 获取所有区域列表
```typescript
const response = await api.stores.getDistricts();
// 返回: ["呈贡区", "五华区", "官渡区", "盘龙区", "晋宁区", "澄江市"]
```

#### 1.6 获取门店统计信息
```typescript
const response = await api.stores.getStatistics();
// 返回: { totalStores, distributionByDistrict, totalTables, totalMonthlyVisitors }
```

#### 1.7 获取推荐门店
```typescript
const response = await api.stores.getRecommended(userLocation, 3);
```

#### 1.8 获取热门门店
```typescript
const response = await api.stores.getPopular(5);
```

### 2. 内容 API (content)

#### 2.1 获取公司信息
```typescript
const response = await api.content.getCompanyInfo();
// 返回: ExecutiveBrief协议格式的公司信息
```

#### 2.2 获取加盟信息
```typescript
const response = await api.content.getFranchiseInfo();
// 返回: StrategicPlan协议格式的加盟方案
```

#### 2.3 获取培训信息
```typescript
const response = await api.content.getTrainingInfo();
// 返回: StructuredArticle协议格式的培训课程信息
```

#### 2.4 获取产品信息
```typescript
const response = await api.content.getProductsInfo();
// 返回: StructuredArticle协议格式的产品目录
```

#### 2.5 获取指定类型的内容模块
```typescript
import { ContentType } from '@/interfaces/dataProvider';

const response = await api.content.getModule(ContentType.ABOUT);
```

### 3. 产品 API (products)

#### 3.1 获取所有产品（支持过滤）
```typescript
const filter = {
  brands: ['耶氏', '古帮特'],
  categories: ['table', 'cue'],
  priceRange: { min: 1000, max: 50000 },
  inStock: true,
  sortBy: 'price',
  sortOrder: 'asc',
  pagination: { page: 1, pageSize: 10 }
};

const response = await api.products.getAll(filter);
```

#### 3.2 根据ID获取产品
```typescript
const response = await api.products.getById('yes-table-1');
```

#### 3.3 按品牌获取产品
```typescript
const response = await api.products.getByBrand('耶氏');
```

#### 3.4 按类别获取产品
```typescript
const response = await api.products.getByCategory('table');
// 类别: 'table' | 'cue' | 'accessory' | 'maintenance'
```

#### 3.5 获取产品分类树
```typescript
const response = await api.products.getCategoryTree();
```

### 4. 培训 API (training)

#### 4.1 获取所有培训项目（支持过滤）
```typescript
const filter = {
  categories: ['installation', 'academy'],
  levels: ['beginner', 'intermediate'],
  priceRange: { min: 500, max: 5000 },
  hasCertification: true
};

const response = await api.training.getAll(filter);
```

#### 4.2 根据ID获取培训项目
```typescript
const response = await api.training.getById('train-install-1');
```

#### 4.3 按类别获取培训项目
```typescript
const response = await api.training.getByCategory('academy');
// 类别: 'installation' | 'academy'
```

#### 4.4 获取培训日程
```typescript
const options = {
  startDate: '2025-02-01',
  endDate: '2025-03-31',
  category: 'academy',
  location: '耶氏培训中心'
};

const response = await api.training.getSchedule(options);
```

### 5. 推荐 API (recommendations)

#### 5.1 获取内容推荐
```typescript
const userContext = {
  sessionId: 'session-123',
  isFirstVisit: false,
  visitCount: 3,
  pageViews: 5,
  location: {
    latitude: 25.0389,
    longitude: 102.7014,
    city: '昆明市',
    district: '呈贡区'
  },
  interests: [
    { category: 'franchise', level: 8, keywords: ['加盟', '投资'] },
    { category: 'training', level: 5, keywords: ['培训'] }
  ],
  behavior: {
    totalTimeSpent: 300,
    pagesVisited: ['/home', '/franchise', '/stores'],
    clickedElements: ['franchise-btn', 'store-card-1'],
    searchQueries: ['加盟费用'],
    lastActivityTime: Date.now()
  },
  device: {
    type: 'desktop',
    os: 'Windows',
    browser: 'Chrome',
    screenSize: { width: 1920, height: 1080 }
  }
};

const response = await api.recommendations.getContent(userContext);
```

#### 5.2 获取下一步行动建议
```typescript
const response = await api.recommendations.getNextActions(userContext);
// 返回: string[] 如 ["立即拨打咨询热线", "下载加盟资料", "预约实地考察"]
```

#### 5.3 获取个性化布局
```typescript
const response = await api.recommendations.getPersonalizedLayout(userContext);
// 返回个性化的页面布局配置
```

### 6. 搜索 API (search)

#### 6.1 搜索门店
```typescript
const response = await api.search.stores("呈贡");
```

#### 6.2 搜索产品
```typescript
const response = await api.search.products("台球桌");
```

#### 6.3 搜索内容
```typescript
const response = await api.search.content("加盟费用");
```

#### 6.4 全局搜索
```typescript
const options = {
  scopes: ['stores', 'products', 'content', 'training'],
  limitPerScope: 3,
  includeHighlights: true
};

const response = await api.search.global("耶氏", options);
```

### 7. 快捷方法

#### 7.1 获取公司概览
```typescript
const overview = await api.getCompanyOverview();
// 返回: { company, statistics, latestNews }
```

#### 7.2 获取加盟套餐信息
```typescript
const package = await api.getFranchisePackage();
// 返回: { franchise, cases, faqs }
```

## 数据类型定义

### Store (门店)
```typescript
interface Store {
  id: number;
  name: string;
  shortName: string;
  address: string;
  phone: string;
  coordinates: [longitude: number, latitude: number];
  district: string;
  businessHours?: string;
  isRealCoordinate: boolean;
  tableCount?: number;
  vipRoomCount?: number;
  features?: string[];
  images?: string[];
  rating?: number;
  monthlyVisitors?: number;
}
```

### UserContext (用户上下文)
```typescript
interface UserContext {
  sessionId: string;
  isFirstVisit: boolean;
  visitCount: number;
  pageViews: number;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    district?: string;
    coordinates: [number, number];
  };
  interests: Array<{
    category: 'franchise' | 'products' | 'training' | 'stores';
    level: number; // 1-10
    keywords: string[];
  }>;
  behavior: {
    totalTimeSpent: number;
    pagesVisited: string[];
    clickedElements: string[];
    searchQueries: string[];
    lastActivityTime: number;
  };
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    screenSize: { width: number; height: number; };
  };
}
```

### DataResponse (统一响应格式)
```typescript
interface DataResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp: number;
  };
  metadata: {
    timestamp: number;
    version: string;
    cached: boolean;
    processingTime: number;
  };
}
```

## 错误处理

```typescript
try {
  const response = await api.stores.getAll();
  
  if (response.success) {
    // 处理成功数据
    console.log(response.data);
  } else {
    // 处理错误
    console.error(response.error);
  }
} catch (error) {
  // 处理网络错误或其他异常
  console.error('API调用失败:', error);
}
```

## 延迟时间说明

API使用MockAPI包装器模拟真实的网络延迟：

- **即时响应 (0ms)**: 缓存数据
- **快速响应 (100ms)**: 简单查询，如根据ID获取
- **正常响应 (300ms)**: 大部分API调用
- **慢速响应 (800ms)**: 复杂查询或批量数据
- **非常慢响应 (2000ms)**: 全局搜索等耗时操作

## 集成示例

### 示例1：首页数据加载
```typescript
// pages/HomePage.tsx
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        // 并行加载多个数据
        const [overview, nearbyStores] = await Promise.all([
          api.getCompanyOverview(),
          api.stores.getNearby([102.7014, 25.0389], { limit: 3 })
        ]);

        setData({ overview, nearbyStores });
      } catch (error) {
        console.error('数据加载失败:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // 渲染UI...
}
```

### 示例2：智能推荐集成
```typescript
// hooks/useRecommendations.ts
import { useContext } from 'react';
import { ContextEngine } from '@/context/ContextEngine';
import { api } from '@/services/api';

export function useRecommendations() {
  const { userContext } = useContext(ContextEngine);

  const getRecommendations = async () => {
    const response = await api.recommendations.getContent(userContext);
    return response.success ? response.data : [];
  };

  const getNextActions = async () => {
    const actions = await api.recommendations.getNextActions(userContext);
    return actions;
  };

  return { getRecommendations, getNextActions };
}
```

### 示例3：搜索功能实现
```typescript
// components/SearchBar.tsx
import { useState } from 'react';
import { api } from '@/services/api';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    const response = await api.search.global(query, {
      scopes: ['stores', 'products', 'content'],
      limitPerScope: 5
    });

    if (response.success) {
      setResults(response.data);
    }
  };

  // 渲染搜索UI...
}
```

## 注意事项

1. **异步处理**: 所有API方法都返回Promise，需要使用async/await或.then()处理
2. **错误处理**: 始终检查response.success并处理错误情况
3. **性能优化**: 使用Promise.all()并行加载多个数据
4. **缓存策略**: API层已实现基础缓存，可根据metadata.cacheable决定前端缓存策略
5. **类型安全**: 使用TypeScript类型定义确保类型安全

## 联系与支持

如有任何问题或需要额外的API功能，请联系Terminal B团队。

---

**版本**: 1.0.0  
**最后更新**: 2025-01-17  
**作者**: Terminal B Team