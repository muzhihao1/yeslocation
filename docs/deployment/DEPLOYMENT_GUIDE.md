# 耶氏体育官网部署指南

## 🚀 部署架构
- **源代码托管**: GitHub
- **部署平台**: Vercel
- **域名**: yes147.com
- **地图页面**: /yeslocation.html (静态文件)

## 📋 部署前准备

### 1. 文件准备
```bash
# 1. 复制地图文件到public目录
cp ../yeslocation.html ./yes-sports-website/public/

# 2. 复制相关资源（如有）
cp ../favicon.ico ./yes-sports-website/public/
```

### 2. 环境配置
```bash
# .env.production
REACT_APP_API_URL=https://api.yes147.com
REACT_APP_GA_ID=UA-XXXXXXXX
```

## 🔧 GitHub配置

### 1. 创建仓库
```bash
# 初始化Git
cd yes-sports-website
git init

# 添加.gitignore
echo "
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
" > .gitignore

# 首次提交
git add .
git commit -m "Initial commit: Yes Sports official website with Context Engineering"

# 创建GitHub仓库（在GitHub网站上操作）
# 仓库名：yes-sports-website
# 设置为public或private

# 推送到GitHub
git remote add origin https://github.com/[your-username]/yes-sports-website.git
git branch -M main
git push -u origin main
```

### 2. 分支策略
```bash
# 创建开发分支
git checkout -b develop

# 功能分支
git checkout -b feature/store-page
git checkout -b feature/franchise-page
```

## ⚡ Vercel部署

### 1. 连接GitHub仓库
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 导入GitHub仓库 "yes-sports-website"
4. 配置项目：
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

### 2. 环境变量配置
在Vercel项目设置中添加：
```
NODE_ENV=production
REACT_APP_DOMAIN=yes147.com
```

### 3. 域名配置

#### 在Vercel中：
1. 进入项目设置 → Domains
2. 添加域名：yes147.com
3. 添加www子域名：www.yes147.com

#### DNS配置（在域名注册商处）：
```
# A记录
@ → 76.76.21.21

# CNAME记录
www → cname.vercel-dns.com
```

## 📁 静态文件处理

### 地图页面路由
```javascript
// vercel.json已配置
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

访问路径：
- 主站：https://yes147.com
- 地图：https://yes147.com/yeslocation.html

## 🔍 SEO优化

### 1. 更新public/index.html
```html
<meta name="description" content="云南耶氏体育文化发展有限公司 - 把职业台球带到大众生活中">
<meta name="keywords" content="耶氏台球,昆明台球,台球培训,台球加盟">
<meta property="og:title" content="耶氏体育 - 专业台球连锁品牌">
<meta property="og:description" content="20家门店遍布昆明，西南地区唯一台球桌生产厂家">
<meta property="og:image" content="https://yes147.com/og-image.jpg">
```

### 2. 创建sitemap.xml
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yes147.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yes147.com/stores</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yes147.com/franchise</loc>
    <priority>0.8</priority>
  </url>
  <!-- 更多页面... -->
</urlset>
```

### 3. 创建robots.txt
```
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://yes147.com/sitemap.xml
```

## 📊 监控与分析

### 1. Vercel Analytics
在Vercel项目中启用Analytics

### 2. Google Analytics
```javascript
// public/index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXX"></script>
```

## 🔄 持续部署

### 自动部署流程
1. 推送到main分支 → 自动部署到生产环境
2. 推送到develop分支 → 自动部署到预览环境
3. Pull Request → 自动创建预览链接

### 部署命令
```bash
# 本地构建测试
npm run build
serve -s build

# 推送触发部署
git add .
git commit -m "feat: add store page with map integration"
git push origin main
```

## 🐛 常见问题

### 1. 地图页面404
确保yeslocation.html已复制到public目录

### 2. 环境变量未生效
在Vercel中重新部署：Settings → Redeploy

### 3. 域名未生效
检查DNS传播状态：https://dnschecker.org

## 📝 部署检查清单

- [ ] 所有页面路由正常
- [ ] 地图页面可访问
- [ ] 移动端响应式正常
- [ ] 图片资源加载正常
- [ ] Context Engine功能正常
- [ ] SEO元数据正确
- [ ] 域名解析成功
- [ ] HTTPS证书有效
- [ ] 性能评分达标（Lighthouse > 90）

---

**部署顺序**：
1. 完成所有功能开发
2. 本地测试通过
3. 推送到GitHub
4. Vercel自动部署
5. 域名配置
6. 上线验证