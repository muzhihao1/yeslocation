# 终端A 工作计划

## 当前任务：应用蓝黄色系到所有页面组件

### 任务目标
将新的蓝黄品牌色系统应用到网站的所有页面和组件中，确保视觉一致性。

### 色彩映射方案

#### 主要颜色替换
- 原绿色 (#369d36) → 主蓝色 (#2196F3)
- 原橙色 (#f59e0b) → 主黄色 (#FFB300)
- 深绿色 → 深蓝色 (#1565C0)
- 浅绿色 → 浅蓝色 (#E3F2FD)

#### 具体应用规则
1. **导航栏**
   - 背景：白色保持
   - Logo区域：蓝色
   - 导航链接：深蓝色 (#1565C0)
   - 悬停效果：主蓝色 (#2196F3)
   - CTA按钮：黄色 (#FFB300)

2. **Hero区域**
   - 渐变背景：蓝色渐变 (从 #1565C0 到 #2196F3)
   - 主标题：白色
   - 副标题：浅黄色 (#FFD54F)
   - 主要按钮：黄色 (#FFB300)
   - 次要按钮：白色边框

3. **卡片组件**
   - 背景：白色
   - 标题：深蓝色 (#1565C0)
   - 正文：中性灰 (#424242)
   - 强调元素：黄色 (#FFB300)
   - 悬停阴影：蓝色阴影

4. **表单元素**
   - 输入框边框：浅蓝色 (#90CAF9)
   - 聚焦边框：主蓝色 (#2196F3)
   - 错误状态：保持红色
   - 成功状态：保持绿色
   - 提交按钮：黄色 (#FFB300)

### 实施步骤

#### 第一步：更新全局样式变量（今天完成）
1. [ ] 检查 `src/styles/globals.css`
2. [ ] 更新 CSS 变量定义
3. [ ] 确保 Tailwind 配置正确应用

#### 第二步：更新组件库（第2天）
1. [ ] Button 组件
   - Primary: 黄色背景
   - Secondary: 蓝色背景
   - Outline: 蓝色边框
2. [ ] Card 组件
   - 更新标题颜色
   - 调整悬停效果
3. [ ] Navigation 组件
   - 更新链接颜色
   - 调整激活状态

#### 第三步：更新页面组件（第3-4天）
1. [ ] HomePage
   - Hero 区域渐变
   - 特色卡片
   - CTA 区域
2. [ ] AboutPage
   - 标题区域
   - 团队介绍卡片
   - 时间线组件
3. [ ] ProductsPage
   - 产品分类标签
   - 产品卡片
   - 价格标签
4. [ ] StorePage
   - 门店卡片
   - 地图标记
   - 营业状态指示器
5. [ ] TrainingPage
   - 课程卡片
   - 教练介绍
   - 预约按钮
6. [ ] FranchisePage
   - 加盟优势卡片
   - 流程图
   - 联系表单
7. [ ] ContactPage
   - 联系方式卡片
   - 表单样式
   - 地图集成

#### 第四步：测试和优化（第5天）
1. [ ] 视觉一致性检查
2. [ ] 对比度验证（WCAG标准）
3. [ ] 深色模式适配（如果需要）
4. [ ] 响应式断点测试

### 技术实施细节

#### CSS变量定义
```css
:root {
  /* 主色调 */
  --color-primary: #2196F3;
  --color-primary-dark: #1565C0;
  --color-primary-light: #64B5F6;
  --color-primary-pale: #E3F2FD;
  
  /* 辅助色 */
  --color-secondary: #FFB300;
  --color-secondary-dark: #FF8F00;
  --color-secondary-light: #FFD54F;
  --color-secondary-pale: #FFF8E1;
  
  /* 中性色 */
  --color-text-primary: #212121;
  --color-text-secondary: #757575;
  --color-background: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-border: #E0E0E0;
}
```

#### 组件示例更新
```jsx
// Button组件更新示例
const Button = ({ variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-secondary hover:bg-secondary-dark text-white',
    secondary: 'bg-primary hover:bg-primary-dark text-white',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
  };
  
  return (
    <button 
      className={`px-6 py-3 rounded-lg transition-all duration-300 ${variants[variant]}`}
      {...props}
    />
  );
};
```

### 注意事项

1. **兼容性处理**
   - 保留 `yes-green` 类名，但映射到蓝色
   - 保留 `yes-orange` 类名，但映射到黄色
   - 这样可以避免大量修改现有代码

2. **渐进式更新**
   - 先更新最显眼的组件
   - 逐步深入到细节
   - 保持功能正常运行

3. **团队协作**
   - 及时同步颜色更新给终端B
   - 记录所有改动
   - 提交时使用清晰的commit信息

### 验收标准

1. [ ] 所有页面使用新的蓝黄色系
2. [ ] 颜色对比度符合WCAG AA标准
3. [ ] 响应式设计下颜色表现正常
4. [ ] 无遗漏的绿色元素
5. [ ] 交互状态颜色合理

### 下一步任务预览

完成颜色系统更新后，将进行：
1. 字体系统实施
2. 间距规范化
3. 性能优化（代码分割）

---

开始时间：2025-01-19
预计完成：2025-01-23