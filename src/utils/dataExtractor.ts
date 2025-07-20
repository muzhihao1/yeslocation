/**
 * 数据提取和处理工具函数
 */

import { Store } from '../types/models';

/**
 * 计算两个坐标点之间的距离（使用Haversine公式）
 * @param coord1 坐标1 [经度, 纬度]
 * @param coord2 坐标2 [经度, 纬度]
 * @returns 距离（公里）
 */
export function calculateDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const R = 6371; // 地球半径（公里）
  const dLat = toRad(coord2[1] - coord1[1]);
  const dLon = toRad(coord2[0] - coord1[0]);
  const lat1 = toRad(coord1[1]);
  const lat2 = toRad(coord2[1]);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  
  return Math.round(d * 10) / 10; // 保留一位小数
}

/**
 * 将角度转换为弧度
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 按区域分组门店
 * @param stores 门店列表
 * @returns 按区域分组的门店Map
 */
export function groupStoresByDistrict(stores: Store[]): Map<string, Store[]> {
  const grouped = new Map<string, Store[]>();
  
  stores.forEach(store => {
    const district = store.district;
    if (!grouped.has(district)) {
      grouped.set(district, []);
    }
    grouped.get(district)!.push(store);
  });
  
  return grouped;
}

/**
 * 获取门店营业状态
 * @param businessHours 营业时间字符串（格式：HH:MM-HH:MM）
 * @returns 是否营业中
 */
export function isStoreOpen(businessHours: string): boolean {
  if (!businessHours || !businessHours.includes('-')) {
    return false;
  }
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [startTime, endTime] = businessHours.split('-').map(time => {
    const [hours, minutes] = time.trim().split(':').map(Number);
    return hours * 60 + minutes;
  });
  
  // 处理跨夜营业的情况
  if (endTime < startTime) {
    return currentTime >= startTime || currentTime <= endTime;
  }
  
  return currentTime >= startTime && currentTime <= endTime;
}

/**
 * 格式化距离显示
 * @param distance 距离（公里）
 * @returns 格式化的距离字符串
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

/**
 * 根据评分获取星级显示
 * @param rating 评分（0-5）
 * @returns 星级字符串
 */
export function getRatingStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
}

/**
 * 提取地址中的关键地标
 * @param address 完整地址
 * @returns 关键地标
 */
export function extractLandmark(address: string): string {
  // 匹配括号中的内容
  const match = address.match(/[（(]([^）)]+)[）)]/);
  if (match) {
    return match[1];
  }
  
  // 提取最后一个地名
  const parts = address.split(/[路街道巷号]/);
  if (parts.length > 1) {
    return parts[parts.length - 2] + (address.includes('路') ? '路' : '街');
  }
  
  return address;
}

/**
 * 生成门店分布统计
 * @param stores 门店列表
 * @returns 统计信息
 */
export function generateStoreStatistics(stores: Store[]) {
  const stats = {
    total: stores.length,
    byDistrict: {} as Record<string, number>,
    averageRating: 0,
    openNow: 0
  };
  
  let totalRating = 0;
  
  stores.forEach(store => {
    // 按区域统计
    stats.byDistrict[store.district] = (stats.byDistrict[store.district] || 0) + 1;
    
    // 评分统计
    if (store.rating) {
      totalRating += store.rating;
    }
    
    // 营业状态统计
    if (store.businessHours && isStoreOpen(store.businessHours)) {
      stats.openNow++;
    }
  });
  
  stats.averageRating = stores.length > 0 ? Math.round(totalRating / stores.length * 10) / 10 : 0;
  
  return stats;
}