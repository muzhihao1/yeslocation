# Vercel 部署配置指南

## 环境变量配置

在Vercel部署时，需要配置以下环境变量：

### 必需的环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `REACT_APP_SITE_URL` | 网站的正式域名 | `https://yes-sports.com` 或您的自定义域名 |
| `REACT_APP_GA4_MEASUREMENT_ID` | Google Analytics 4 测量ID | `G-XXXXXXXXXX` |

### 可选的环境变量

| 变量名 | 说明 | 默认值 | 建议值 |
|--------|------|--------|--------|
| `REACT_APP_CDN_URL` | CDN域名 | 无 | `https://cdn.yes-sports.com` |
| `REACT_APP_ENABLE_CDN` | 是否启用CDN | `false` | 生产环境建议设为 `true` |
| `REACT_APP_API_URL` | API服务器地址 | `http://localhost:3001` | 您的API服务器地址 |
| `REACT_APP_API_TIMEOUT` | API请求超时时间(毫秒) | `10000` | `10000` |
| `REACT_APP_CHAT_WIDGET_KEY` | 智能客服插件密钥 | 无 | 您的客服系统密钥 |
| `REACT_APP_BOOKING_API_KEY` | 预约系统API密钥 | 无 | 您的预约系统密钥 |
| `REACT_APP_IMAGE_OPTIMIZATION_API` | 图片优化服务地址 | 无 | `https://img.yes-sports.com` |
| `REACT_APP_DEBUG_MODE` | 调试模式 | `false` | 生产环境保持 `false` |

## Vercel 配置步骤

### 1. 导入项目
1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库: `muzhihao1/yeslocation`
4. 选择要部署的分支

### 2. 配置构建设置
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3. 配置环境变量
在 "Environment Variables" 部分添加上述环境变量。

### 4. 配置域名
1. 在 "Domains" 部分添加自定义域名
2. 按照提示配置 DNS 记录：
   - A 记录: `76.76.21.21`
   - 或 CNAME 记录: `cname.vercel-dns.com`

## 注意事项

1. **Google Analytics 配置**
   - 需要先在 [Google Analytics](https://analytics.google.com) 创建属性
   - 获取测量ID (格式: G-XXXXXXXXXX)
   - 配置数据流和转化事件

2. **API 服务配置**
   - 如果有后端API服务，需要配置 `REACT_APP_API_URL`
   - 确保API服务支持CORS，允许来自Vercel域名的请求

3. **PWA 功能**
   - Service Worker 会自动启用
   - 确保 HTTPS 已启用（Vercel 默认启用）

4. **性能优化**
   - 考虑启用 Vercel Edge Network
   - 配置适当的缓存头

## 部署后验证

1. **功能测试**
   - [ ] 首页正常加载
   - [ ] 导航功能正常
   - [ ] PWA 安装提示出现
   - [ ] 离线页面工作正常
   - [ ] Google Analytics 数据收集

2. **性能测试**
   - 使用 [PageSpeed Insights](https://pagespeed.web.dev) 测试
   - 目标分数: 90+ 

3. **SEO 验证**
   - 检查 sitemap.xml 是否可访问
   - 验证 meta 标签正确渲染
   - 提交到 Google Search Console

---

*最后更新: 2025-01-19*