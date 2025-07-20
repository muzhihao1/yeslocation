# 快速参考 - 耶氏台球俱乐部网站

## 🚀 快速启动
```bash
npm start
# 访问 http://localhost:3000
```

## 📁 重要文件
- `CLAUDE.md` - 详细开发记录
- `src/context/ContextEngine.tsx` - 核心状态管理
- `src/services/recommendationService.ts` - 推荐系统
- `src/types/models.ts` - 类型定义

## ⚠️ 当前注意事项
1. **Tailwind CSS**: 使用 v3.4.17（不要升级到 v4）
2. **TypeScript 错误**: 不影响运行，可以忽略
3. **LocalStorage**: 如遇问题，清除浏览器缓存

## 🔧 常见问题解决
- **页面空白**: 清除 LocalStorage
- **编译错误**: 重启开发服务器
- **导入错误**: 使用 `../types/models` 而非 `../data/models`

## 📝 待办事项
- [ ] 修复剩余的 TypeScript 类型错误
- [ ] 优化 bundle 大小
- [ ] 完善神经系统集成
- [ ] 添加单元测试
- [ ] 准备生产环境配置