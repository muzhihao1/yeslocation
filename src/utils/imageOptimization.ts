/**
 * 图片优化工具集
 * 提供图片压缩、格式转换、响应式图片生成等功能
 */

/**
 * 图片尺寸配置
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  large: { width: 1024, height: 768 },
  xlarge: { width: 1920, height: 1080 },
  hero: { width: 1920, height: 1080 },
  card: { width: 400, height: 300 },
  avatar: { width: 100, height: 100 },
} as const;

/**
 * 支持的图片格式
 */
export const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const;

/**
 * 图片优化配置
 */
export interface ImageOptimizationConfig {
  quality?: number; // 0-100
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  sizes?: Array<keyof typeof IMAGE_SIZES>;
  lazy?: boolean;
  placeholder?: 'blur' | 'shimmer' | 'none';
}

/**
 * 获取图片的优化建议
 */
export function getImageOptimizationTips(fileSize: number, dimensions: { width: number; height: number }) {
  const tips: string[] = [];
  
  // 文件大小建议
  if (fileSize > 1024 * 1024) { // 大于1MB
    tips.push('图片文件过大，建议压缩到1MB以下');
  }
  
  // 尺寸建议
  if (dimensions.width > 2000) {
    tips.push('图片宽度过大，建议缩放到2000px以内');
  }
  
  if (dimensions.width < 320) {
    tips.push('图片宽度过小，可能在大屏幕上显示模糊');
  }
  
  // 格式建议
  tips.push('建议使用WebP或AVIF格式，可减少30-50%的文件大小');
  tips.push('为不支持新格式的浏览器提供JPG/PNG备用图片');
  
  return tips;
}

/**
 * 生成响应式图片srcset
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: Array<keyof typeof IMAGE_SIZES> = ['small', 'medium', 'large']
): string {
  return sizes
    .map(size => {
      const { width } = IMAGE_SIZES[size];
      return `${baseUrl}?w=${width} ${width}w`;
    })
    .join(', ');
}

/**
 * 生成图片sizes属性
 */
export function generateSizes(breakpoints: { [key: string]: string } = {}) {
  const defaultBreakpoints = {
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '50vw',
    '(max-width: 1024px)': '33vw',
  };
  
  const merged = { ...defaultBreakpoints, ...breakpoints };
  
  return Object.entries(merged)
    .map(([breakpoint, size]) => `${breakpoint} ${size}`)
    .join(', ') + ', 25vw';
}

/**
 * 计算图片压缩质量
 */
export function calculateQuality(originalSize: number, targetSize: number): number {
  const ratio = targetSize / originalSize;
  
  if (ratio >= 0.8) return 90;
  if (ratio >= 0.6) return 85;
  if (ratio >= 0.4) return 80;
  if (ratio >= 0.2) return 75;
  return 70;
}

/**
 * 获取图片元数据
 */
export async function getImageMetadata(file: File): Promise<{
  width: number;
  height: number;
  aspectRatio: number;
  format: string;
  size: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        format: file.type.split('/')[1],
        size: file.size,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('无法读取图片'));
    };
    
    img.src = url;
  });
}

/**
 * 压缩图片
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('无法创建canvas上下文'));
      return;
    }
    
    img.onload = () => {
      // 计算新尺寸
      let { width, height } = img;
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      
      // 设置canvas尺寸
      canvas.width = width;
      canvas.height = height;
      
      // 绘制图片
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转换为Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('压缩失败'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('无法加载图片'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 生成图片占位符
 */
export function generatePlaceholder(width: number, height: number, color: string = '#f0f0f0'): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-size="16">
        ${width} × ${height}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * 图片优化检查器
 */
export class ImageOptimizationChecker {
  private recommendations: string[] = [];
  
  async checkFile(file: File): Promise<string[]> {
    this.recommendations = [];
    
    // 检查文件大小
    if (file.size > 2 * 1024 * 1024) {
      this.recommendations.push('⚠️ 文件大于2MB，强烈建议压缩');
    } else if (file.size > 1024 * 1024) {
      this.recommendations.push('📌 文件大于1MB，建议适当压缩');
    }
    
    // 检查文件格式
    const format = file.type.split('/')[1];
    if (!['webp', 'avif'].includes(format)) {
      this.recommendations.push('💡 建议使用WebP或AVIF格式以获得更好的压缩率');
    }
    
    // 获取图片尺寸
    try {
      const metadata = await getImageMetadata(file);
      
      // 检查尺寸
      if (metadata.width > 3000) {
        this.recommendations.push('📐 图片宽度超过3000px，建议缩小尺寸');
      }
      
      // 检查长宽比
      if (metadata.aspectRatio > 3 || metadata.aspectRatio < 0.33) {
        this.recommendations.push('🖼️ 图片长宽比异常，可能影响显示效果');
      }
    } catch (error) {
      this.recommendations.push('❌ 无法读取图片信息');
    }
    
    return this.recommendations;
  }
  
  getOptimizationScore(file: File): number {
    let score = 100;
    
    // 文件大小评分
    if (file.size > 2 * 1024 * 1024) score -= 30;
    else if (file.size > 1024 * 1024) score -= 15;
    else if (file.size > 500 * 1024) score -= 5;
    
    // 格式评分
    const format = file.type.split('/')[1];
    if (!['webp', 'avif'].includes(format)) score -= 20;
    
    return Math.max(0, score);
  }
}

/**
 * CDN URL生成器
 */
export function generateCDNUrl(
  baseUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  } = {}
): string {
  const params = new URLSearchParams();
  
  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.quality) params.append('q', options.quality.toString());
  if (options.format) params.append('f', options.format);
  if (options.fit) params.append('fit', options.fit);
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * 批量图片优化建议
 */
export async function batchOptimizationReport(files: File[]): Promise<{
  totalSize: number;
  averageSize: number;
  recommendations: string[];
  files: Array<{
    name: string;
    size: number;
    score: number;
    tips: string[];
  }>;
}> {
  const checker = new ImageOptimizationChecker();
  const fileReports = [];
  let totalSize = 0;
  
  for (const file of files) {
    const tips = await checker.checkFile(file);
    const score = checker.getOptimizationScore(file);
    
    fileReports.push({
      name: file.name,
      size: file.size,
      score,
      tips,
    });
    
    totalSize += file.size;
  }
  
  const averageSize = totalSize / files.length;
  const recommendations = [];
  
  if (totalSize > 10 * 1024 * 1024) {
    recommendations.push('总文件大小超过10MB，建议批量压缩');
  }
  
  if (averageSize > 1024 * 1024) {
    recommendations.push('平均文件大小超过1MB，建议优化');
  }
  
  const lowScoreFiles = fileReports.filter(f => f.score < 70);
  if (lowScoreFiles.length > 0) {
    recommendations.push(`${lowScoreFiles.length}个文件需要优化`);
  }
  
  return {
    totalSize,
    averageSize,
    recommendations,
    files: fileReports,
  };
}