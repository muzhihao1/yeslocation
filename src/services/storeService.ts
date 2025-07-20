/**
 * 门店服务
 * 提供门店相关的业务逻辑处理
 */

import { Store } from '../types/models';
import { mockStores } from '../data/mockData';
import { calculateDistance, groupStoresByDistrict } from '../utils/dataExtractor';
import {
  StoreDataService,
  DataResponse,
  Coordinates,
  NearbyStoreOptions,
  NearbyStoresResult,
  StoreStatistics,
  ResponseMetadata,
  ErrorResponse
} from '../interfaces/dataProvider';

/**
 * 门店服务实现类
 * 实现StoreDataService接口定义的所有方法
 */
export class StoreService implements StoreDataService {
  private stores: Store[];
  
  constructor() {
    // 初始化时加载所有门店数据
    this.stores = [...mockStores];
  }
  
  /**
   * 获取所有门店
   * @returns 包含所有门店数据的Promise
   */
  async getAll(): Promise<DataResponse<Store[]>> {
    try {
      // 模拟API调用延迟
      await this.simulateDelay(300);
      
      return {
        success: true,
        data: this.stores,
        metadata: this.createMetadata()
      };
    } catch (error) {
      return this.createErrorResponse('Failed to fetch stores', error);
    }
  }
  
  /**
   * 根据ID获取单个门店
   * @param id 门店ID
   * @returns 包含门店信息的Promise
   */
  async getById(id: number): Promise<DataResponse<Store>> {
    try {
      await this.simulateDelay(200);
      
      const store = this.stores.find(s => s.id === id);
      
      if (!store) {
        return this.createErrorResponse('Store not found', null, 'STORE_NOT_FOUND');
      }
      
      return {
        success: true,
        data: store,
        metadata: this.createMetadata()
      };
    } catch (error) {
      return this.createErrorResponse('Failed to fetch store', error);
    }
  }
  
  /**
   * 获取附近的门店
   * @param coords 用户坐标 [经度, 纬度]
   * @param options 查询选项
   * @returns 包含附近门店列表的Promise
   */
  async getNearby(
    coords: Coordinates,
    options: NearbyStoreOptions = {}
  ): Promise<DataResponse<NearbyStoresResult>> {
    try {
      await this.simulateDelay(400);
      
      const {
        limit = 5,
        maxDistance = 20,
        includeDistance = true,
        sortByDistance = true
      } = options;
      
      // 计算每个门店到用户位置的距离
      const storesWithDistance = this.stores.map(store => ({
        ...store,
        distance: calculateDistance(coords, store.coordinates)
      }));
      
      // 过滤超出最大距离的门店
      const nearbyStores = storesWithDistance.filter(
        store => store.distance <= maxDistance
      );
      
      // 按距离排序
      if (sortByDistance) {
        nearbyStores.sort((a, b) => a.distance - b.distance);
      }
      
      // 限制返回数量
      const limitedStores = nearbyStores.slice(0, limit);
      
      // 如果不需要距离信息，删除distance字段
      const resultStores = includeDistance
        ? limitedStores
        : limitedStores.map(({ distance, ...store }) => store);
      
      return {
        success: true,
        data: {
          stores: resultStores,
          userLocation: coords,
          timestamp: Date.now()
        },
        metadata: this.createMetadata()
      };
    } catch (error) {
      return this.createErrorResponse('Failed to fetch nearby stores', error);
    }
  }
  
  /**
   * 按区域获取门店
   * @param district 区域名称
   * @returns 包含该区域门店列表的Promise
   */
  async getByDistrict(district: string): Promise<DataResponse<Store[]>> {
    try {
      await this.simulateDelay(250);
      
      const districtStores = this.stores.filter(
        store => store.district === district
      );
      
      if (districtStores.length === 0) {
        return {
          success: true,
          data: [],
          metadata: {
            ...this.createMetadata(),
            processingTime: 250
          }
        };
      }
      
      return {
        success: true,
        data: districtStores,
        metadata: this.createMetadata()
      };
    } catch (error) {
      return this.createErrorResponse('Failed to fetch stores by district', error);
    }
  }
  
  /**
   * 获取所有区域列表
   * @returns 包含区域列表的Promise
   */
  async getDistricts(): Promise<DataResponse<string[]>> {
    try {
      await this.simulateDelay(150);
      
      // 获取所有唯一的区域
      const districts = [...new Set(this.stores.map(store => store.district))];
      
      // 按拼音排序
      districts.sort((a, b) => a.localeCompare(b, 'zh-CN'));
      
      return {
        success: true,
        data: districts,
        metadata: this.createMetadata()
      };
    } catch (error) {
      return this.createErrorResponse('Failed to fetch districts', error);
    }
  }
  
  /**
   * 获取门店统计信息
   * @returns 包含统计信息的Promise
   */
  async getStatistics(): Promise<DataResponse<StoreStatistics>> {
    try {
      await this.simulateDelay(350);
      
      // 按区域分组
      const storesByDistrict = groupStoresByDistrict(this.stores);
      const distributionByDistrict: Record<string, number> = {};
      
      storesByDistrict.forEach((stores: Store[], district: string) => {
        distributionByDistrict[district] = stores.length;
      });
      
      // 计算总台球桌数和月访客量
      const totalTables = this.stores.reduce(
        (sum, store) => sum + (store.tableCount || 0),
        0
      );
      
      const totalMonthlyVisitors = this.stores.reduce(
        (sum, store) => sum + (store.monthlyVisitors || 0),
        0
      );
      
      const statistics: StoreStatistics = {
        totalStores: this.stores.length,
        distributionByDistrict,
        totalTables,
        totalMonthlyVisitors
      };
      
      return {
        success: true,
        data: statistics,
        metadata: this.createMetadata()
      };
    } catch (error) {
      return this.createErrorResponse('Failed to fetch statistics', error);
    }
  }
  
  /**
   * 搜索门店
   * @param query 搜索关键词
   * @returns 匹配的门店列表
   */
  async searchStores(query: string): Promise<Store[]> {
    await this.simulateDelay(200);
    
    const lowerQuery = query.toLowerCase();
    
    return this.stores.filter(store => {
      return (
        store.name.toLowerCase().includes(lowerQuery) ||
        (store.shortName && store.shortName.toLowerCase().includes(lowerQuery)) ||
        store.address.toLowerCase().includes(lowerQuery) ||
        store.district.toLowerCase().includes(lowerQuery) ||
        store.phone.includes(query)
      );
    });
  }
  
  /**
   * 获取推荐门店
   * 基于各种因素推荐门店
   * @param coords 用户坐标（可选）
   * @param limit 推荐数量
   * @returns 推荐的门店列表
   */
  async getRecommendedStores(
    coords?: Coordinates,
    limit: number = 3
  ): Promise<Store[]> {
    await this.simulateDelay(300);
    
    let recommendedStores = [...this.stores];
    
    // 如果有用户位置，优先推荐附近的门店
    if (coords) {
      const nearbyResult = await this.getNearby(coords, { limit: limit * 2 });
      if (nearbyResult.success && nearbyResult.data) {
        recommendedStores = nearbyResult.data.stores;
      }
    }
    
    // 按评分和月访客量综合排序
    recommendedStores.sort((a, b) => {
      const scoreA = (a.rating || 0) * 0.6 + (a.monthlyVisitors || 0) / 10000 * 0.4;
      const scoreB = (b.rating || 0) * 0.6 + (b.monthlyVisitors || 0) / 10000 * 0.4;
      return scoreB - scoreA;
    });
    
    return recommendedStores.slice(0, limit);
  }
  
  /**
   * 获取热门门店
   * 基于月访客量返回热门门店
   * @param limit 返回数量
   * @returns 热门门店列表
   */
  async getPopularStores(limit: number = 5): Promise<Store[]> {
    await this.simulateDelay(200);
    
    const sortedStores = [...this.stores].sort(
      (a, b) => (b.monthlyVisitors || 0) - (a.monthlyVisitors || 0)
    );
    
    return sortedStores.slice(0, limit);
  }
  
  /**
   * 获取最新开业的门店
   * @param limit 返回数量
   * @returns 最新门店列表
   */
  async getNewStores(limit: number = 3): Promise<Store[]> {
    await this.simulateDelay(200);
    
    // 模拟最新开业的门店（ID较大的）
    const sortedStores = [...this.stores].sort((a, b) => b.id - a.id);
    
    return sortedStores.slice(0, limit);
  }
  
  /**
   * 获取有特定服务的门店
   * @param feature 特色服务名称
   * @returns 提供该服务的门店列表
   */
  async getStoresByFeature(feature: string): Promise<Store[]> {
    await this.simulateDelay(250);
    
    return this.stores.filter(
      store => store.features && store.features.includes(feature)
    );
  }
  
  /**
   * 验证门店营业状态
   * @param storeId 门店ID
   * @returns 是否正在营业
   */
  async checkStoreOpen(storeId: number): Promise<boolean> {
    const storeResponse = await this.getById(storeId);
    
    if (!storeResponse.success || !storeResponse.data) {
      return false;
    }
    
    const store = storeResponse.data;
    const now = new Date();
    const currentHour = now.getHours();
    
    // 简单的营业时间判断（大部分店10:00-02:00）
    if (store.businessHours) {
      if (store.businessHours.includes('24小时')) {
        return true;
      }
      
      // 基本营业时间判断
      if (currentHour >= 10 || currentHour < 2) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * 模拟API调用延迟
   * @param ms 延迟毫秒数
   */
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * 创建响应元数据
   * @returns 元数据对象
   */
  private createMetadata(): ResponseMetadata {
    return {
      timestamp: Date.now(),
      version: '1.0.0',
      cached: false,
      processingTime: Math.floor(Math.random() * 100) + 50
    };
  }
  
  /**
   * 创建错误响应
   * @param message 错误消息
   * @param error 原始错误对象
   * @param code 错误代码
   * @returns 错误响应对象
   */
  private createErrorResponse(
    message: string,
    error: any,
    code: string = 'UNKNOWN_ERROR'
  ): DataResponse<any> {
    const errorResponse: ErrorResponse = {
      code,
      message,
      details: error?.message || error,
      timestamp: Date.now()
    };
    
    return {
      success: false,
      error: errorResponse,
      metadata: this.createMetadata()
    };
  }
}

/**
 * 门店服务单例
 */
export const storeService = new StoreService();