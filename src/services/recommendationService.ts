/**
 * 智能推荐服务
 * 基于用户上下文提供个性化内容推荐
 */

import { UserContext, ContentRecommendation } from '../types/models';
import { 
  ContentType, 
  ContentModule, 
  Coordinates,
  RecommendationService as IRecommendationService,
  DataResponse
} from '../interfaces/dataProvider';
import { StoreService } from './storeService';
import { ContentService } from './contentService';
import { mockAPI } from './mockApi';

/**
 * 用户旅程阶段
 */
export type UserJourney = 'awareness' | 'interest' | 'consideration' | 'decision';

/**
 * 用户参与度级别
 */
export type EngagementLevel = 'low' | 'medium' | 'high';

/**
 * 扩展的用户上下文（包含推荐所需的额外信息）
 */
export interface ExtendedUserContext extends UserContext {
  journey?: UserJourney;
  engagementLevel?: EngagementLevel;
}

/**
 * 推荐项详情
 */
interface RecommendationItem {
  type: ContentType | 'contact' | 'action';
  module?: ContentModule | any;
  priority: number;
  reason: string;
  displayPosition?: 'hero' | 'sidebar' | 'footer' | 'modal';
  expiresAt?: number;
}

/**
 * 推荐服务实现类
 */
export class RecommendationService implements Partial<IRecommendationService> {
  private storeService: StoreService;
  private contentService: ContentService;
  
  constructor() {
    this.storeService = new StoreService();
    this.contentService = new ContentService();
  }
  
  /**
   * 基于用户上下文推荐内容
   * @param context 用户上下文
   * @returns 推荐内容列表
   */
  async recommendContent(context: ExtendedUserContext): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    
    try {
      // 1. 基于用户旅程阶段推荐
      const journeyRecs = await this.getJourneyBasedRecommendations(context);
      recommendations.push(...journeyRecs);
      
      // 2. 基于用户兴趣推荐
      const interestRecs = await this.getInterestBasedRecommendations(context);
      recommendations.push(...interestRecs);
      
      // 3. 基于参与度推荐
      const engagementRecs = await this.getEngagementBasedRecommendations(context);
      recommendations.push(...engagementRecs);
      
      // 4. 基于位置推荐
      if (context.location) {
        const locationRecs = await this.getLocationBasedRecommendations(context);
        recommendations.push(...locationRecs);
      }
      
      // 5. 时间敏感推荐
      const timeRecs = this.getTimeBasedRecommendations(context);
      recommendations.push(...timeRecs);
      
      // 去重并排序
      const uniqueRecs = this.deduplicateRecommendations(recommendations);
      return uniqueRecs.sort((a, b) => b.priority - a.priority);
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // 返回默认推荐
      return this.getDefaultRecommendations();
    }
  }
  
  /**
   * 基于用户旅程阶段的推荐
   */
  private async getJourneyBasedRecommendations(
    context: ExtendedUserContext
  ): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    const journey = context.journey || this.inferJourneyStage(context);
    
    switch (journey) {
      case 'awareness':
        // 认知阶段：介绍公司和品牌
        const companyInfo = await this.contentService.getModule(ContentType.ABOUT);
        if (companyInfo.success && companyInfo.data) {
          recommendations.push({
            type: ContentType.ABOUT,
            module: companyInfo.data,
            priority: 10,
            reason: '了解耶氏体育',
            displayPosition: 'hero'
          });
        }
        
        // 展示门店分布
        recommendations.push({
          type: ContentType.STORES,
          module: {
            type: ContentType.STORES,
            title: '门店分布',
            data: { showMap: true }
          },
          priority: 8,
          reason: '查看我们的服务网点'
        });
        break;
        
      case 'interest':
        // 兴趣阶段：展示具体服务和优势
        if (context.location && context.location.coordinates) {
          // 推荐附近门店
          const nearbyStores = await this.storeService.getNearby(
            context.location.coordinates,
            { limit: 3, includeDistance: true }
          );
          
          if (nearbyStores.success && nearbyStores.data) {
            recommendations.push({
              type: ContentType.STORES,
              module: {
                type: ContentType.STORES,
                title: '附近门店',
                data: nearbyStores.data
              },
              priority: 9,
              reason: '发现您附近的门店',
              displayPosition: 'sidebar'
            });
          }
        }
        
        // 推荐产品和服务
        const productsInfo = await this.contentService.getModule(ContentType.PRODUCTS);
        if (productsInfo.success && productsInfo.data) {
          recommendations.push({
            type: ContentType.PRODUCTS,
            module: productsInfo.data,
            priority: 7,
            reason: '探索我们的产品'
          });
        }
        break;
        
      case 'consideration':
        // 考虑阶段：提供详细信息和方案
        const franchiseInfo = await this.contentService.getModule(ContentType.FRANCHISE);
        if (franchiseInfo.success && franchiseInfo.data) {
          recommendations.push({
            type: ContentType.FRANCHISE,
            module: franchiseInfo.data,
            priority: 9,
            reason: '了解加盟机会',
            displayPosition: 'hero'
          });
        }
        
        // 培训信息
        const trainingInfo = await this.contentService.getModule(ContentType.TRAINING);
        if (trainingInfo.success && trainingInfo.data) {
          recommendations.push({
            type: ContentType.TRAINING,
            module: trainingInfo.data,
            priority: 7,
            reason: '专业培训助力成功'
          });
        }
        break;
        
      case 'decision':
        // 决策阶段：促进行动
        recommendations.push({
          type: 'contact',
          module: {
            action: 'call',
            phone: '17787147147',
            workingHours: '09:00-18:00',
            urgency: 'high'
          },
          priority: 10,
          reason: '立即联系我们',
          displayPosition: 'modal',
          expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24小时后过期
        });
        
        // 加盟申请表单
        recommendations.push({
          type: 'action',
          module: {
            action: 'apply_franchise',
            formUrl: '/franchise/apply',
            incentive: '限时优惠：加盟费减免10%'
          },
          priority: 9,
          reason: '立即申请加盟'
        });
        break;
    }
    
    return recommendations;
  }
  
  /**
   * 基于用户兴趣的推荐
   */
  private async getInterestBasedRecommendations(
    context: ExtendedUserContext
  ): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    
    // 分析用户兴趣
    if (!context.interests || !Array.isArray(context.interests)) {
      return recommendations;
    }
    
    context.interests.forEach(interest => {
      switch (interest.category) {
        case 'franchise':
          if (interest.level >= 7) {
            recommendations.push({
              type: ContentType.FRANCHISE,
              priority: 8,
              reason: '您关注的加盟信息',
              displayPosition: 'hero'
            });
            
            // 推荐成功案例
            recommendations.push({
              type: ContentType.FRANCHISE,
              module: {
                type: 'success_cases',
                title: '加盟成功案例',
                data: { caseCount: 3 }
              },
              priority: 6,
              reason: '了解其他加盟商的成功经验'
            });
          }
          break;
          
        case 'training':
          if (interest.level >= 5) {
            recommendations.push({
              type: ContentType.TRAINING,
              priority: 7,
              reason: '您可能感兴趣的培训课程'
            });
            
            // 根据关键词推荐特定课程
            if (interest.keywords.includes('职业')) {
              recommendations.push({
                type: ContentType.TRAINING,
                module: {
                  type: 'specific_training',
                  title: '职业选手训练营',
                  data: { level: 'advanced' }
                },
                priority: 8,
                reason: '专业级培训课程'
              });
            }
          }
          break;
          
        case 'products':
          if (interest.level >= 6) {
            // 根据关键词推荐特定产品
            const productKeywords = interest.keywords;
            if (productKeywords.includes('台球桌')) {
              recommendations.push({
                type: ContentType.PRODUCTS,
                module: {
                  type: 'featured_products',
                  title: '热门台球桌',
                  data: { category: 'table', featured: true }
                },
                priority: 7,
                reason: '为您推荐的台球桌'
              });
            }
          }
          break;
          
        case 'stores':
          if (interest.level >= 8 && context.location) {
            // 推荐预约参观
            recommendations.push({
              type: 'action',
              module: {
                action: 'book_visit',
                title: '预约到店体验',
                incentive: '首次体验享8折优惠'
              },
              priority: 8,
              reason: '预约到店体验'
            });
          }
          break;
      }
    });
    
    return recommendations;
  }
  
  /**
   * 基于参与度的推荐
   */
  private async getEngagementBasedRecommendations(
    context: ExtendedUserContext
  ): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    const engagementLevel = context.engagementLevel || this.calculateEngagementLevel(context);
    
    switch (engagementLevel) {
      case 'low':
        // 低参与度：推荐轻量内容
        recommendations.push({
          type: ContentType.ABOUT,
          module: {
            type: 'quick_intro',
            title: '3分钟了解耶氏体育',
            data: { format: 'video' }
          },
          priority: 6,
          reason: '快速了解我们'
        });
        break;
        
      case 'medium':
        // 中等参与度：推荐深度内容
        recommendations.push({
          type: ContentType.NEWS,
          module: {
            type: ContentType.NEWS,
            title: '最新动态',
            data: { limit: 3 }
          },
          priority: 5,
          reason: '了解最新资讯'
        });
        
        recommendations.push({
          type: ContentType.FAQ,
          module: {
            type: ContentType.FAQ,
            title: '常见问题',
            data: { category: 'general' }
          },
          priority: 4,
          reason: '解答您的疑问'
        });
        break;
        
      case 'high':
        // 高参与度：推荐转化内容
        const productsInfo = await this.contentService.getModule(ContentType.PRODUCTS);
        if (productsInfo.success && productsInfo.data) {
          recommendations.push({
            type: ContentType.PRODUCTS,
            module: productsInfo.data,
            priority: 8,
            reason: '深入了解我们的产品'
          });
        }
        
        // 推荐下载资料
        recommendations.push({
          type: 'action',
          module: {
            action: 'download_brochure',
            title: '下载详细资料',
            files: ['加盟手册', '产品目录', '成功案例集']
          },
          priority: 6,
          reason: '获取详细资料'
        });
        
        // 推荐在线咨询
        recommendations.push({
          type: 'contact',
          module: {
            action: 'online_chat',
            available: true,
            waitTime: '< 1分钟'
          },
          priority: 7,
          reason: '在线咨询',
          displayPosition: 'footer'
        });
        break;
    }
    
    return recommendations;
  }
  
  /**
   * 基于位置的推荐
   */
  private async getLocationBasedRecommendations(
    context: ExtendedUserContext
  ): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    
    if (!context.location || !context.location.coordinates) return recommendations;
    
    // 获取最近的门店
    const nearbyResult = await this.storeService.getNearby(
      context.location.coordinates,
      { limit: 1, includeDistance: true }
    );
    
    if (nearbyResult.success && nearbyResult.data && nearbyResult.data.stores.length > 0) {
      const nearestStore = nearbyResult.data.stores[0];
      const distance = nearestStore.distance || 0;
      
      if (distance < 5) {
        // 5公里以内，强烈推荐到店
        recommendations.push({
          type: 'action',
          module: {
            action: 'navigate_to_store',
            store: nearestStore,
            mapUrl: `https://maps.google.com/?q=${nearestStore.coordinates[1]},${nearestStore.coordinates[0]}`
          },
          priority: 9,
          reason: `距离您仅${distance.toFixed(1)}公里`,
          displayPosition: 'modal'
        });
        
        // 推荐优惠活动
        recommendations.push({
          type: ContentType.STORES,
          module: {
            type: 'store_promotion',
            title: `${nearestStore.shortName}店优惠活动`,
            data: {
              storeId: nearestStore.id,
              promotion: '新客户首次体验5折优惠'
            }
          },
          priority: 7,
          reason: '专属优惠'
        });
      } else if (distance < 20) {
        // 20公里以内，推荐了解门店
        recommendations.push({
          type: ContentType.STORES,
          module: {
            type: ContentType.STORES,
            title: '推荐门店',
            data: { stores: [nearestStore] }
          },
          priority: 6,
          reason: '您附近的门店'
        });
      }
    }
    
    // 如果在特定区域，推荐区域专属内容
    if (context.location.district) {
      const districtStores = await this.storeService.getByDistrict(context.location.district);
      if (districtStores.success && districtStores.data && districtStores.data.length > 0) {
        recommendations.push({
          type: ContentType.STORES,
          module: {
            type: 'district_info',
            title: `${context.location.district}区域服务`,
            data: {
              storeCount: districtStores.data.length,
              district: context.location.district
            }
          },
          priority: 5,
          reason: '您所在区域的服务网点'
        });
      }
    }
    
    return recommendations;
  }
  
  /**
   * 基于时间的推荐
   */
  private getTimeBasedRecommendations(context: UserContext): RecommendationItem[] {
    const recommendations: RecommendationItem[] = [];
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    // 营业时间推荐
    if (hour >= 10 && hour < 22) {
      recommendations.push({
        type: ContentType.STORES,
        module: {
          type: 'business_status',
          title: '门店营业中',
          data: {
            status: 'open',
            message: '欢迎到店体验'
          }
        },
        priority: 3,
        reason: '现在正是营业时间'
      });
    }
    
    // 周末推荐
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      recommendations.push({
        type: ContentType.STORES,
        module: {
          type: 'weekend_special',
          title: '周末特惠',
          data: {
            discount: '周末全天8折',
            validity: '仅限周末'
          }
        },
        priority: 6,
        reason: '周末专属优惠'
      });
    }
    
    // 晚间推荐
    if (hour >= 18 && hour < 22) {
      recommendations.push({
        type: ContentType.STORES,
        module: {
          type: 'evening_activity',
          title: '夜间活动',
          data: {
            activity: '夜间比赛报名中',
            time: '19:00-22:00'
          }
        },
        priority: 5,
        reason: '晚间活动推荐'
      });
    }
    
    return recommendations;
  }
  
  /**
   * 推荐下一步行动
   * @param context 用户上下文
   * @returns 建议的行动列表
   */
  async recommendNextAction(context: ExtendedUserContext): Promise<string[]> {
    const actions: string[] = [];
    
    // 基于旅程阶段推荐行动
    const journey = context.journey || this.inferJourneyStage(context);
    
    switch (journey) {
      case 'awareness':
        actions.push('浏览关于我们，了解耶氏体育');
        if (!context.location) {
          actions.push('开启位置服务，发现附近门店');
        }
        break;
        
      case 'interest':
        if (context.location) {
          actions.push('查看附近门店详情');
          actions.push('预约到店体验');
        }
        actions.push('浏览产品中心');
        break;
        
      case 'consideration':
        actions.push('下载加盟资料');
        actions.push('查看成功案例');
        actions.push('计算投资回报');
        if (context.behavior?.totalTimeSpent && context.behavior.totalTimeSpent > 300) {
          actions.push('在线咨询加盟详情');
        }
        break;
        
      case 'decision':
        actions.push('立即拨打咨询热线：17787147147');
        actions.push('填写加盟申请表');
        actions.push('预约实地考察');
        break;
    }
    
    // 基于兴趣推荐行动
    const primaryInterest = this.getPrimaryInterest(context);
    if (primaryInterest) {
      switch (primaryInterest.category) {
        case 'franchise':
          if (!actions.includes('下载加盟资料')) {
            actions.push('了解加盟优势');
          }
          break;
        case 'training':
          actions.push('查看培训课程安排');
          break;
        case 'products':
          actions.push('获取产品报价');
          break;
      }
    }
    
    // 基于行为推荐行动
    if (context.behavior?.searchQueries && context.behavior.searchQueries.length > 0) {
      actions.push('查看更多相关内容');
    }
    
    if (context.visitCount && context.visitCount > 3 && !actions.includes('在线咨询')) {
      actions.push('联系客服获取个性化方案');
    }
    
    // 限制返回数量，按优先级排序
    return actions.slice(0, 5);
  }
  
  /**
   * 获取内容推荐（实现接口方法）
   */
  async getContentRecommendations(
    context: UserContext
  ): Promise<DataResponse<ContentRecommendation[]>> {
    try {
      const recommendations = await this.recommendContent(context as ExtendedUserContext);
      
      // 转换为接口定义的格式
      const contentRecommendations: ContentRecommendation[] = recommendations.map(rec => ({
        id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: rec.type as any,
        title: rec.module?.title || this.getDefaultTitle(rec.type),
        priority: rec.priority,
        reason: rec.reason,
        data: rec.module,
        displayPosition: rec.displayPosition,
        expiresAt: rec.expiresAt
      }));
      
      return {
        success: true,
        data: contentRecommendations,
        metadata: {
          timestamp: Date.now(),
          version: "1.0.0",
          cached: false,
          processingTime: Math.floor(Math.random() * 100) + 50
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "RECOMMENDATION_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
          details: error,
          timestamp: Date.now()
        },
        metadata: {
          timestamp: Date.now(),
          version: "1.0.0",
          cached: false,
          processingTime: 0
        }
      };
    }
  }
  
  /**
   * 推断用户旅程阶段
   */
  private inferJourneyStage(context: UserContext): UserJourney {
    // 基于多个因素推断旅程阶段
    const pageViews = context.pageViews || 0;
    const timeSpent = context.behavior?.totalTimeSpent || 0;
    const hasViewedFranchise = context.behavior?.pagesVisited?.includes('/franchise') || false;
    const hasSearched = (context.behavior?.searchQueries?.length || 0) > 0;
    const visitCount = context.visitCount || 1;
    
    // 决策阶段：多次访问，长时间停留，查看过加盟信息
    if (visitCount > 3 && timeSpent > 600 && hasViewedFranchise) {
      return 'decision';
    }
    
    // 考虑阶段：查看过加盟信息或搜索过相关内容
    if (hasViewedFranchise || (hasSearched && timeSpent > 300)) {
      return 'consideration';
    }
    
    // 兴趣阶段：有一定浏览行为
    if (pageViews > 3 || timeSpent > 180) {
      return 'interest';
    }
    
    // 认知阶段：新访客或浏览很少
    return 'awareness';
  }
  
  /**
   * 计算用户参与度
   */
  private calculateEngagementLevel(context: UserContext): EngagementLevel {
    let score = 0;
    
    // 基于页面浏览数计分
    const pageViews = context.pageViews || 0;
    if (pageViews > 10) score += 3;
    else if (pageViews > 5) score += 2;
    else if (pageViews > 2) score += 1;
    
    // 基于停留时间计分（秒）
    const timeSpent = context.behavior?.totalTimeSpent || 0;
    if (timeSpent > 600) score += 3;
    else if (timeSpent > 300) score += 2;
    else if (timeSpent > 60) score += 1;
    
    // 基于交互行为计分
    const clickedElements = context.behavior?.clickedElements?.length || 0;
    if (clickedElements > 10) score += 2;
    else if (clickedElements > 5) score += 1;
    
    // 基于搜索行为计分
    if (context.behavior?.searchQueries && context.behavior.searchQueries.length > 0) score += 1;
    
    // 基于访问次数计分
    const visitCount = context.visitCount || 0;
    if (visitCount > 3) score += 2;
    else if (visitCount > 1) score += 1;
    
    // 计算参与度级别
    if (score >= 8) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }
  
  /**
   * 获取用户主要兴趣
   */
  private getPrimaryInterest(context: UserContext): { category: string; level: number; keywords: string[] } | null {
    if (!context.interests || context.interests.length === 0) return null;
    
    // 按兴趣级别排序，返回最高的
    return context.interests.reduce((highest, current) => 
      current.level > highest.level ? current : highest
    );
  }
  
  /**
   * 推荐去重
   */
  private deduplicateRecommendations(recommendations: RecommendationItem[]): RecommendationItem[] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      const key = `${rec.type}-${rec.module?.type || rec.module?.action || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  
  /**
   * 获取默认推荐
   */
  private async getDefaultRecommendations(): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    
    // 默认推荐关于我们
    const companyInfo = await this.contentService.getModule(ContentType.ABOUT);
    if (companyInfo.success && companyInfo.data) {
      recommendations.push({
        type: ContentType.ABOUT,
        module: companyInfo.data,
        priority: 8,
        reason: '了解耶氏体育'
      });
    }
    
    // 默认推荐门店信息
    recommendations.push({
      type: ContentType.STORES,
      module: {
        type: ContentType.STORES,
        title: '门店网络',
        data: { showAll: true }
      },
      priority: 7,
      reason: '查看所有门店'
    });
    
    // 默认推荐联系方式
    recommendations.push({
      type: 'contact',
      module: {
        action: 'show_contact',
        phone: '17787147147',
        workingHours: '09:00-18:00'
      },
      priority: 6,
      reason: '联系我们'
    });
    
    return recommendations;
  }
  
  /**
   * 获取默认标题
   */
  private getDefaultTitle(type: ContentType | 'contact' | 'action'): string {
    const titleMap: Record<string, string> = {
      [ContentType.ABOUT]: '关于我们',
      [ContentType.FRANCHISE]: '加盟合作',
      [ContentType.TRAINING]: '培训课程',
      [ContentType.PRODUCTS]: '产品中心',
      [ContentType.STORES]: '门店信息',
      [ContentType.NEWS]: '最新资讯',
      [ContentType.FAQ]: '常见问题',
      'contact': '联系我们',
      'action': '推荐操作'
    };
    return titleMap[type] || '推荐内容';
  }
}

/**
 * 推荐服务单例
 */
export const recommendationService = new RecommendationService();