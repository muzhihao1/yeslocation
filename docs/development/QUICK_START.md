# 快速启动指南

## 📁 文档已整理完成

所有文档已经整理到以下目录：
- `docs/api/` - API相关文档
- `docs/deployment/` - 部署相关文档
- `docs/development/` - 开发相关文档

## 🚀 启动项目

### 方法1：直接启动（开发模式）
```bash
cd yes-sports-website
npm start
```

### 方法2：修复Tailwind CSS后启动
如果遇到Tailwind CSS错误，运行修复脚本：
```bash
./fix-tailwind.sh
```

### 方法3：手动修复步骤
```bash
cd yes-sports-website

# 1. 清理缓存
rm -rf node_modules package-lock.json

# 2. 重新安装依赖
npm install

# 3. 如果还有问题，降级Tailwind CSS
npm uninstall tailwindcss @tailwindcss/postcss
npm install tailwindcss@^3.4.0 autoprefixer@^10.4.16 postcss@^8.4.32 --save-dev

# 4. 启动项目
npm start
```

## 📋 项目状态

### ✅ 已完成
- Terminal B：16/16任务（100%）
- 所有API服务已就绪
- CE增强功能已实现
- 文档整理完成

### 🔄 进行中
- Terminal A：12/15任务（80%）
- 需要集成CE增强API
- 前端性能优化

### ⚠️ 已知问题
- Tailwind CSS 4.x版本与React Scripts兼容性问题
- 建议使用开发模式运行或降级到Tailwind CSS 3.x

## 🛠️ 常用命令

```bash
# 启动开发服务器
npm start

# 构建生产版本（修复Tailwind后）
npm run build

# 运行测试
npm test

# 查看API文档
open docs/api/API_GUIDE.md

# 查看CE增强API迁移指南
open docs/api/CE_MIGRATION_GUIDE.md
```

## 📱 访问地址

开发服务器启动后，访问：
- 本地：http://localhost:3000
- 网络：http://[你的IP]:3000

## 💡 开发提示

1. **使用增强版API**
   ```typescript
   import { apiEnhanced } from '@/services/apiEnhanced';
   apiEnhanced.setSessionId('user-123');
   ```

2. **查看性能监控**
   ```typescript
   const report = await apiEnhanced.ceEnhancements.getPerformanceReport();
   ```

3. **获取用户行为模式**
   ```typescript
   const pattern = await apiEnhanced.ceEnhancements.getUserPattern();
   ```

## 🆘 遇到问题？

1. 查看 `PROJECT_STATUS.md` 了解详细状态
2. 检查 `docs/development/` 中的开发文档
3. 确保在 `yes-sports-website` 目录下运行命令
4. 尝试清理缓存并重新安装依赖