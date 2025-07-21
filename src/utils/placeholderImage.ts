/**
 * 占位符图片生成器
 * 在产品图片加载失败时显示占位符
 */

/**
 * 生成占位符图片的Data URL
 * @param width 图片宽度
 * @param height 图片高度
 * @param text 占位符文本
 * @param bgColor 背景颜色
 * @param textColor 文字颜色
 * @returns 占位符图片的Data URL
 */
export const generatePlaceholder = (
  width: number = 400,
  height: number = 300,
  text: string = '产品图片',
  bgColor: string = '#E5E7EB',
  textColor: string = '#6B7280'
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // 绘制背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // 设置文字样式
  ctx.fillStyle = textColor;
  ctx.font = `${Math.floor(width / 10)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // 绘制文字
  ctx.fillText(text, width / 2, height / 2);
  
  // 绘制边框
  ctx.strokeStyle = textColor;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  
  return canvas.toDataURL();
};

/**
 * 根据产品类别获取占位符图片
 * @param category 产品类别
 * @returns 占位符图片URL
 */
export const getPlaceholderByCategory = (category?: string): string => {
  const categoryMap: Record<string, string> = {
    table: '台球桌',
    cue: '球杆',
    accessory: '配件',
    maintenance: '维护用品'
  };
  
  const text = category ? categoryMap[category] || '产品图片' : '产品图片';
  return generatePlaceholder(400, 300, text);
};

/**
 * 创建SVG占位符
 * @param category 产品类别
 * @returns SVG占位符URL
 */
export const createSVGPlaceholder = (category?: string): string => {
  const categoryIcons: Record<string, string> = {
    table: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z',
    cue: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    accessory: 'M12 2L2 7l10 5 10-5-10-5z',
    maintenance: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
  };
  
  const iconPath = category && categoryIcons[category] ? categoryIcons[category] : categoryIcons.table;
  
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#E5E7EB"/>
      <g transform="translate(200, 150)">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" x="-40" y="-40">
          <path d="${iconPath}"/>
        </svg>
      </g>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};