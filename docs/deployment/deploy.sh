#!/bin/bash

# 部署脚本 - 将静态网站部署到服务器

# 配置变量
SERVER_USER="root"
SERVER_IP="180.76.56.219"
SERVER_PATH="/var/www/html/demo"
LOCAL_PATH="."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始部署静态网站...${NC}"

# 1. 检查文件
echo -e "${YELLOW}检查必要文件...${NC}"
if [ ! -f "yeslocation.html" ]; then
    echo -e "${RED}错误: 找不到 yeslocation.html 文件${NC}"
    exit 1
fi

# 2. 创建服务器目录（如果不存在）
echo -e "${YELLOW}创建服务器目录...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${SERVER_PATH}"

# 3. 上传文件到服务器
echo -e "${YELLOW}上传文件到服务器...${NC}"
scp -r yeslocation.html favicon.ico ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

# 4. 设置文件权限
echo -e "${YELLOW}设置文件权限...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "chmod -R 755 ${SERVER_PATH} && chown -R www-data:www-data ${SERVER_PATH}"

# 5. 验证部署
echo -e "${GREEN}部署完成！${NC}"
echo -e "访问地址: http://${SERVER_IP}:8000/demo/yeslocation.html"
echo -e "如果配置了清洁URL，可以访问: http://${SERVER_IP}:8000/demo/yeslocation"