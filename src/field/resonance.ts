/**
 * Basic Field Resonance
 * 基于Context Engineering的场域共振计算
 * 用于衡量用户上下文与内容之间的相关性
 */

import { UserContext, Store, Product, TrainingProgram } from '../types/models';

/**
 * 共振度计算结果
 */
export interface ResonanceResult {
  /** 总体共振度分数（0-1） */
  score: number;
  
  /** 各维度的贡献 */
  components: {
    interest: number;     // 兴趣匹配度
    location: number;     // 位置相关性
    behavior: number;     // 行为模式匹配
    temporal: number;     // 时间相关性
    journey: number;      // 用户旅程匹配
  };
  
  /** 共振强度描述 */
  strength: 'weak' | 'moderate' | 'strong' | 'perfect';
  
  /** 推荐理由 */
  reasons: string[];
}

/**
 * 场域共振计算引擎
 */
export class FieldResonance {
  /**
   * 计算用户与内容的共振度
   * @param userContext 用户上下文
   * @param content 内容对象
   * @returns 共振度结果
   */
  calculate(userContext: UserContext, content: any): ResonanceResult {
    const components = {
      interest: this.calculateInterestResonance(userContext, content),
      location: this.calculateLocationResonance(userContext, content),
      behavior: this.calculateBehaviorResonance(userContext, content),
      temporal: this.calculateTemporalResonance(userContext, content),
      journey: this.calculateJourneyResonance(userContext, content)
    };
    
    // 加权计算总分
    const weights = {
      interest: 0.35,   // 兴趣权重最高
      location: 0.20,   // 位置其次
      behavior: 0.20,   // 行为模式
      temporal: 0.10,   // 时间因素
      journey: 0.15     // 旅程阶段
    };
    
    const score = Object.entries(components).reduce((total, [key, value]) => {
      return total + value * weights[key as keyof typeof weights];
    }, 0);
    
    const reasons = this.generateReasons(components, content);
    const strength = this.categorizeStrength(score);
    
    return {
      score: Math.min(1, Math.max(0, score)), // 确保在0-1范围内
      components,
      strength,
      reasons
    };
  }
  
  /**
   * 计算兴趣共振度
   */
  private calculateInterestResonance(userContext: UserContext, content: any): number {
    if (!userContext.interests || userContext.interests.length === 0) {
      return 0.3; // 基础分数
    }
    
    let resonance = 0;
    const contentKeywords = this.extractContentKeywords(content);
    
    userContext.interests.forEach(interest => {
      // 检查内容类型匹配
      if (this.matchesContentType(interest.category, content)) {
        resonance += interest.level * 0.1;
      }
      
      // 检查关键词匹配
      interest.keywords.forEach(keyword => {
        if (contentKeywords.includes(keyword.toLowerCase())) {
          resonance += interest.level * 0.05;
        }
      });
    });
    
    return Math.min(1, resonance);
  }
  
  /**
   * 计算位置共振度
   */
  private calculateLocationResonance(userContext: UserContext, content: any): number {
    // 如果内容没有位置信息，返回中性分数
    if (!this.hasLocation(content)) {
      return 0.5;
    }
    
    // 如果用户没有位置信息，返回较低分数
    if (!userContext.location || !userContext.location.coordinates) {
      return 0.3;
    }
    
    // 对于门店类内容，计算距离
    if (this.isStore(content)) {
      const distance = this.calculateDistance(
        userContext.location.coordinates,
        content.coordinates
      );
      
      // 距离越近，共振度越高
      if (distance < 1) return 1.0;      // 1公里内
      if (distance < 3) return 0.8;      // 3公里内
      if (distance < 5) return 0.6;      // 5公里内
      if (distance < 10) return 0.4;     // 10公里内
      if (distance < 20) return 0.2;     // 20公里内
      return 0.1;                        // 更远
    }
    
    // 对于其他内容，检查区域匹配
    if (content.district === userContext.location.district) {
      return 0.8;
    }
    if (content.city === userContext.location.city) {
      return 0.6;
    }
    
    return 0.3;
  }
  
  /**
   * 计算行为共振度
   */
  private calculateBehaviorResonance(userContext: UserContext, content: any): number {
    if (!userContext.behavior) {
      return 0.3;
    }
    
    let resonance = 0;
    
    // 基于页面访问深度
    const pageDepth = userContext.pageViews || 0;
    if (pageDepth > 10) resonance += 0.3;
    else if (pageDepth > 5) resonance += 0.2;
    else if (pageDepth > 2) resonance += 0.1;
    
    // 基于停留时间
    const timeSpent = userContext.behavior.totalTimeSpent || 0;
    if (timeSpent > 600) resonance += 0.3;      // 10分钟以上
    else if (timeSpent > 300) resonance += 0.2; // 5分钟以上
    else if (timeSpent > 60) resonance += 0.1;  // 1分钟以上
    
    // 基于搜索行为
    if (userContext.behavior.searchQueries && userContext.behavior.searchQueries.length > 0) {
      const contentText = this.getContentText(content).toLowerCase();
      userContext.behavior.searchQueries.forEach(query => {
        if (contentText.includes(query.toLowerCase())) {
          resonance += 0.2;
        }
      });
    }
    
    // 基于点击行为
    if (userContext.behavior.clickedElements && userContext.behavior.clickedElements.length > 0) {
      const relevantClicks = this.countRelevantClicks(userContext.behavior.clickedElements, content);
      resonance += relevantClicks * 0.1;
    }
    
    return Math.min(1, resonance);
  }
  
  /**
   * 计算时间共振度
   */
  private calculateTemporalResonance(userContext: UserContext, content: any): number {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    // 营业时间相关（针对门店）
    if (this.isStore(content) && content.businessHours) {
      // 简化的营业时间检查
      if (hour >= 10 && hour < 22) {
        return 1.0; // 营业时间内
      }
      return 0.3; // 非营业时间
    }
    
    // 活动时间相关（针对培训）
    if (this.isTraining(content) && content.schedule) {
      // 检查是否有即将开始的课程
      const hasUpcomingSession = content.schedule.some((session: any) => {
        const sessionDate = new Date(session.date);
        const daysDiff = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff > 0 && daysDiff < 30; // 30天内
      });
      
      if (hasUpcomingSession) return 0.9;
    }
    
    // 周末加成
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 0.8; // 周末用户更有时间
    }
    
    // 晚间加成
    if (hour >= 18 && hour < 22) {
      return 0.7; // 晚间休闲时间
    }
    
    return 0.5; // 默认时间共振度
  }
  
  /**
   * 计算用户旅程共振度
   */
  private calculateJourneyResonance(userContext: UserContext, content: any): number {
    // 推断用户旅程阶段
    const journey = this.inferUserJourney(userContext);
    
    // 根据内容类型和旅程阶段匹配
    const contentType = this.getContentType(content);
    
    const journeyMatch = {
      awareness: {
        about: 1.0,
        stores: 0.7,
        products: 0.5,
        franchise: 0.3,
        training: 0.4
      },
      interest: {
        about: 0.6,
        stores: 0.9,
        products: 0.8,
        franchise: 0.5,
        training: 0.7
      },
      consideration: {
        about: 0.4,
        stores: 0.7,
        products: 0.7,
        franchise: 0.9,
        training: 0.8
      },
      decision: {
        about: 0.3,
        stores: 0.8,
        products: 0.6,
        franchise: 1.0,
        training: 0.7
      }
    };
    
    return (journeyMatch[journey] as any)?.[contentType] || 0.5;
  }
  
  /**
   * 提取内容关键词
   */
  private extractContentKeywords(content: any): string[] {
    const keywords: string[] = [];
    
    // 从不同类型的内容中提取关键词
    if (content.name) keywords.push(content.name.toLowerCase());
    if (content.title) keywords.push(content.title.toLowerCase());
    if (content.description) keywords.push(content.description.toLowerCase());
    if (content.category) keywords.push(content.category.toLowerCase());
    if (content.features) keywords.push(...content.features.map((f: string) => f.toLowerCase()));
    if (content.tags) keywords.push(...content.tags.map((t: string) => t.toLowerCase()));
    
    return keywords;
  }
  
  /**
   * 检查内容类型匹配
   */
  private matchesContentType(interestCategory: string, content: any): boolean {
    const contentType = this.getContentType(content);
    
    const categoryMap: Record<string, string[]> = {
      franchise: ['franchise', 'join', '加盟'],
      products: ['product', 'equipment', '产品', '设备'],
      training: ['training', 'course', '培训', '课程'],
      stores: ['store', 'location', '门店', '俱乐部']
    };
    
    return categoryMap[interestCategory]?.some(keyword => 
      contentType.includes(keyword) || 
      this.getContentText(content).toLowerCase().includes(keyword)
    ) || false;
  }
  
  /**
   * 计算两点之间的距离（公里）
   */
  private calculateDistance(coords1: [number, number], coords2: [number, number]): number {
    const [lon1, lat1] = coords1;
    const [lon2, lat2] = coords2;
    
    const R = 6371; // 地球半径（公里）
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  
  /**
   * 推断用户旅程阶段
   */
  private inferUserJourney(context: UserContext): 'awareness' | 'interest' | 'consideration' | 'decision' {
    const pageViews = context.pageViews || 0;
    const timeSpent = context.behavior?.totalTimeSpent || 0;
    const visitCount = context.visitCount || 1;
    const hasViewedFranchise = context.behavior?.pagesVisited?.includes('/franchise') || false;
    const hasSearched = (context.behavior?.searchQueries?.length || 0) > 0;
    
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
   * 生成推荐理由
   */
  private generateReasons(components: ResonanceResult['components'], content: any): string[] {
    const reasons: string[] = [];
    
    if (components.interest > 0.7) {
      reasons.push('与您的兴趣高度匹配');
    }
    
    if (components.location > 0.8) {
      reasons.push('距离您很近');
    } else if (components.location > 0.5 && this.hasLocation(content)) {
      reasons.push('在您附近区域');
    }
    
    if (components.behavior > 0.7) {
      reasons.push('基于您的浏览偏好');
    }
    
    if (components.temporal > 0.8) {
      reasons.push('正适合现在');
    }
    
    if (components.journey > 0.8) {
      reasons.push('符合您当前需求');
    }
    
    // 如果没有特别突出的理由，提供通用理由
    if (reasons.length === 0) {
      reasons.push('可能感兴趣的内容');
    }
    
    return reasons;
  }
  
  /**
   * 分类共振强度
   */
  private categorizeStrength(score: number): ResonanceResult['strength'] {
    if (score >= 0.9) return 'perfect';
    if (score >= 0.7) return 'strong';
    if (score >= 0.4) return 'moderate';
    return 'weak';
  }
  
  // 辅助方法
  private hasLocation(content: any): boolean {
    return !!(content.coordinates || content.district || content.city || content.address);
  }
  
  private isStore(content: any): boolean {
    return content.hasOwnProperty('coordinates') && content.hasOwnProperty('address');
  }
  
  private isTraining(content: any): boolean {
    return content.hasOwnProperty('duration') && content.hasOwnProperty('level');
  }
  
  private getContentType(content: any): string {
    if (this.isStore(content)) return 'stores';
    if (this.isTraining(content)) return 'training';
    if (content.category === 'franchise') return 'franchise';
    if (content.brand || content.price) return 'products';
    return 'about';
  }
  
  private getContentText(content: any): string {
    const texts = [];
    if (content.name) texts.push(content.name);
    if (content.title) texts.push(content.title);
    if (content.description) texts.push(content.description);
    if (content.features) texts.push(...content.features);
    return texts.join(' ');
  }
  
  private countRelevantClicks(clicks: string[], content: any): number {
    const contentType = this.getContentType(content);
    const relevantPatterns = {
      stores: ['store', 'map', 'location'],
      franchise: ['franchise', 'join', 'invest'],
      training: ['training', 'course', 'learn'],
      products: ['product', 'buy', 'price']
    };
    
    const patterns = relevantPatterns[contentType as keyof typeof relevantPatterns] || [];
    
    return clicks.filter(click => 
      patterns.some(pattern => click.toLowerCase().includes(pattern))
    ).length;
  }
}

// 导出单例
export const fieldResonance = new FieldResonance();