#!/bin/bash

# Tailwind CSS 修复脚本

echo "🔧 开始修复Tailwind CSS配置问题..."

cd yes-sports-website

# 备份当前package.json
cp package.json package.json.backup

echo "📦 降级Tailwind CSS到稳定版本..."

# 卸载当前版本
npm uninstall tailwindcss @tailwindcss/postcss

# 安装Tailwind CSS 3.x稳定版本
npm install tailwindcss@^3.4.0 autoprefixer@^10.4.16 postcss@^8.4.32 --save-dev

# 更新postcss.config.js
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo "✅ Tailwind CSS配置已更新"

# 确保tailwind.config.js存在
if [ ! -f tailwind.config.js ]; then
  echo "创建tailwind.config.js..."
  cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yes-green': '#00a651',
        'yes-dark': '#1a1a1a',
      },
      fontFamily: {
        'sans': ['Microsoft YaHei', 'PingFang SC', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
EOF
fi

echo "🚀 尝试启动开发服务器..."
npm start