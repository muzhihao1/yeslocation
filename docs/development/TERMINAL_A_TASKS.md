# Terminal A 任务指南（更新版）

## 角色定位
作为Terminal A，你负责：
- 🎨 所有UI组件和界面开发
- 🧠 Context Management System实现
- 👁️ 用户行为感知系统
- ⚡ 前端性能和交互体验
- 🚀 GitHub部署和Vercel配置

## 已完成任务总结 ✅
- Phase 1: 基础架构（React + TypeScript + Tailwind） ✅
- Phase 2: Context Engine系统（5层架构） ✅
- 基础组件库（Button, Logo, Card, Navigation） ✅
- 行为追踪和内容排序系统 ✅
- 示例首页 ✅

## 当前任务：Phase 3 - 页面开发与集成（重新规划）

### 任务3.1：集成现有地图页面 🔄 优先级：高
```typescript
// 方案1：IFrame集成（快速方案）
// src/pages/StorePage.tsx
const StorePage = () => {
  return (
    <div className="min-h-screen pt-20">
      <iframe 
        src="/yeslocation.html" 
        className="w-full h-[calc(100vh-80px)]"
        frameBorder="0"
      />
    </div>
  );
};

// 方案2：转换为React组件（推荐）
// src/components/organisms/StoreMap.tsx
// 将yeslocation.html的核心功能转换为React组件
```

### 任务3.2：开发核心页面UI
```
需要开发的页面：
1. ✅ HomePage - 已完成
2. 🔄 AboutPage - 关于我们页面
3. 🔄 StorePage - 门店分布页面（集成地图）
4. 🔄 FranchisePage - 加盟合作页面
5. 🔄 TrainingPage - 培训中心页面
6. 🔄 ProductsPage - 产品中心页面
7. 🔄 ContactPage - 联系我们页面
```

### 任务3.3：集成Terminal B的数据服务
```typescript
// src/services/api.ts
import { StoreService } from './storeService';
import { ContentService } from './contentService';
import { RecommendationService } from './recommendationService';

// 创建统一的API调用层
export const api = {
  stores: new StoreService(),
  content: new ContentService(),
  recommendations: new RecommendationService()
};

// 在页面中使用
const stores = await api.stores.getAllStores();
const nearestStores = await api.stores.getNearestStores(userLocation);
```

### 任务3.4：准备GitHub部署
```bash
# 1. 初始化Git仓库
git init
git add .
git commit -m "Initial commit: Yes Sports official website"

# 2. 创建GitHub仓库
# 仓库名：yes-sports-website

# 3. 推送代码
git remote add origin https://github.com/[username]/yes-sports-website.git
git branch -M main
git push -u origin main
```

### 任务3.5：配置Vercel部署
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/yeslocation.html",
      "dest": "/yeslocation.html"
    },
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

### 任务3.6：域名配置
```
1. 在Vercel中添加自定义域名：yes147.com
2. 配置DNS记录：
   - A记录：76.76.21.21
   - CNAME：cname.vercel-dns.com
3. 配置子路径：
   - / -> 主站
   - /map -> 地图页面（yeslocation.html）
```

## 今日重点任务
1. 🔥 将yeslocation.html集成到React项目
2. 🔥 开发AboutPage和StorePage
3. 🔥 调用Terminal B的数据服务
4. 🔥 准备GitHub仓库

## 页面开发模板
```typescript
// src/pages/AboutPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useContextEngine } from '../context/ContextEngine';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { Card, Button } from '../components';

export const AboutPage: React.FC = () => {
  const { trackClick } = useBehaviorTracking();
  const { state } = useContextEngine();
  
  // 从Terminal B获取数据
  const [companyInfo, setCompanyInfo] = useState(null);
  
  useEffect(() => {
    // 调用ContentService获取公司信息
    api.content.getCompanyInfo().then(setCompanyInfo);
  }, []);
  
  return (
    <div className="min-h-screen pt-20">
      {/* 页面内容 */}
    </div>
  );
};
```

## 与Terminal B的协作需求
1. ✅ StoreService - 已完成
2. ⏳ ContentService - 需要获取各页面内容
3. ⏳ RecommendationService - 需要推荐算法支持
4. ⏳ MockAPI - 需要统一的API服务层

## 部署检查清单
- [ ] 所有页面开发完成
- [ ] 响应式设计测试
- [ ] 性能优化（图片压缩、代码分割）
- [ ] SEO优化（meta标签、sitemap）
- [ ] GitHub仓库准备
- [ ] Vercel配置文件
- [ ] 域名DNS配置

## 注意事项
1. 保持现有地图页面的功能完整性
2. 确保React路由与静态HTML的兼容
3. 优化首屏加载速度
4. 实现良好的移动端体验

---

**当前优先级：集成地图页面 + 开发核心页面！**