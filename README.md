# 耶氏体育官网 - Context Engineering实现

基于Context Engineering理念开发的智能企业官网，实现了多层次上下文感知和动态内容适配。

[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://github.com/muzhihao1/yeslocation)
[![React Version](https://img.shields.io/badge/react-19.1.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-4.9.5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.4.17-38B2AC)](https://tailwindcss.com/)

## 技术架构

### Context Engineering层级
- **Atoms层**: 基础UI组件（Button, Logo等）
- **Molecules层**: 组合组件（Card, Navigation等）
- **Cells层**: 有状态的功能模块（行为追踪、内容排序）
- **Organs层**: 完整功能系统（Context Management System）
- **Fields层**: 全站上下文感知（用户旅程、共鸣度计算）

### 技术栈
- React 18 + TypeScript
- Tailwind CSS（原子化样式）
- Framer Motion（动画）
- React Router v6（路由）
- Context API（状态管理）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build
```

## 核心特性

### 1. 智能内容排序
- 基于用户行为动态调整内容优先级
- 根据用户旅程阶段展示相关内容
- 实时计算内容共鸣度

### 2. 行为追踪系统
- 页面访问时长统计
- 滚动深度分析
- 点击热图记录
- 参与度等级评估

### 3. 上下文感知导航
- 根据用户兴趣重排导航项
- 智能推荐下一步行动
- 自适应UI布局

### 4. 性能优化
- 渐进式内容加载
- 智能预测性加载
- 本地状态持久化

## 项目结构

```
src/
├── components/          # UI组件
│   ├── atoms/          # 基础组件
│   ├── molecules/      # 组合组件
│   └── organisms/      # 复杂组件
├── context/            # Context Engine核心
├── hooks/              # 自定义Hooks
├── pages/              # 页面组件
└── types/              # TypeScript类型定义
```

## 并行开发说明

本项目采用Terminal A/B并行开发模式：
- **Terminal A**: 负责前端UI和Context系统
- **Terminal B**: 负责业务逻辑和数据层

查看 `PARALLEL_TASKS.md` 了解详细的任务分配。

## Context Engine API

### 使用示例

```typescript
import { useContextEngine } from './context/ContextEngine';

const MyComponent = () => {
  const { state, dispatch } = useContextEngine();
  
  // 访问不同层级的状态
  const { userLocation } = state.atoms;
  const { userInterests } = state.molecules;
  const { engagementLevel } = state.cells;
  
  // 更新状态
  dispatch({ 
    type: 'UPDATE_INTERESTS', 
    payload: ['franchise', 'training'] 
  });
};
```

## 开发注意事项

1. 所有组件都应考虑Context awareness
2. 遵循TypeScript严格模式
3. 保持组件的原子性和可复用性
4. 及时更新CONTEXT_STATE.json同步进度

## 项目状态 (2025-01-18)

### 当前版本
- 开发环境正常运行
- 基础功能已实现
- TypeScript 类型警告不影响运行

### 最近更新
- 修复了 Tailwind CSS v4 兼容性问题
- 解决了大量 TypeScript 编译错误
- 修复了 Map 对象序列化问题
- 优化了推荐服务的错误处理

### 已知问题
- 部分 TypeScript 类型定义需要完善
- 神经系统集成需要进一步优化
- Bundle 体积较大 (2.9MB)

详细开发记录请查看 `CLAUDE.md`

## License

© 2025 云南耶氏体育文化发展有限公司