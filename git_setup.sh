#!/bin/bash

# Initialize git repository
git init

# Add remote repository
git remote add origin https://github.com/muzhihao1/yeslocation/

# Add all files
git add .

# Create commit
git commit -m "fix: 修复首页副标题显示方框字符问题 - 将bullet符号替换为竖线符号"

# Push to remote
git push -u origin main

echo "Git operations completed"