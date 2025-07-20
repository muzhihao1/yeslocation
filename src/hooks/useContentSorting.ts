import { useMemo } from 'react';
import { useContextEngine } from '../context/ContextEngine';

export interface ContentModule {
  id: string;
  type: 'about' | 'stores' | 'franchise' | 'training' | 'products' | 'hero';
  title: string;
  priority: number;
  data?: any;
}

export const useContentSorting = (modules: ContentModule[]) => {
  const { state } = useContextEngine();
  
  const sortedModules = useMemo(() => {
    const { userInterests, contentPriority } = state.molecules;
    const { engagementLevel } = state.cells;
    const { journey, resonance } = state.fields;
    
    // 复制模块数组以避免直接修改
    const modulesToSort = modules.map(module => ({
      ...module,
      dynamicPriority: calculateDynamicPriority(
        module,
        {
          userInterests,
          contentPriority,
          engagementLevel,
          journey,
          resonance,
        }
      ),
    }));
    
    // 根据动态优先级排序
    return modulesToSort.sort((a, b) => b.dynamicPriority - a.dynamicPriority);
  }, [modules, state]);
  
  return sortedModules;
};

// 计算动态优先级的核心算法
function calculateDynamicPriority(
  module: ContentModule,
  context: {
    userInterests: string[];
    contentPriority: Map<string, number>;
    engagementLevel: 'low' | 'medium' | 'high';
    journey: 'awareness' | 'interest' | 'consideration' | 'decision';
    resonance: number;
  }
): number {
  let priority = module.priority;
  
  // 1. 基于用户兴趣调整
  if (context.userInterests.includes(module.type)) {
    priority += 0.3;
  }
  
  // 2. 基于内容优先级Map调整
  const mappedPriority = context.contentPriority.get(module.type);
  if (mappedPriority) {
    priority = priority * 0.5 + mappedPriority * 0.5;
  }
  
  // 3. 基于用户旅程阶段调整
  const journeyBoost = getJourneyBoost(module.type, context.journey);
  priority += journeyBoost;
  
  // 4. 基于参与度调整
  if (context.engagementLevel === 'high') {
    // 高参与度用户看到更多深度内容
    if (['franchise', 'training', 'products'].includes(module.type)) {
      priority += 0.2;
    }
  } else if (context.engagementLevel === 'low') {
    // 低参与度用户看到更多引导性内容
    if (['hero', 'about'].includes(module.type)) {
      priority += 0.2;
    }
  }
  
  // 5. 基于共鸣度微调
  priority *= (1 + context.resonance * 0.1);
  
  return Math.min(priority, 1);
}

// 根据用户旅程阶段提供不同的内容权重
function getJourneyBoost(
  moduleType: string,
  journey: 'awareness' | 'interest' | 'consideration' | 'decision'
): number {
  const boostMap: Record<string, Record<string, number>> = {
    awareness: {
      hero: 0.3,
      about: 0.2,
      stores: 0.1,
      franchise: 0,
      training: 0,
      products: 0,
    },
    interest: {
      hero: 0.1,
      about: 0.2,
      stores: 0.2,
      franchise: 0.1,
      training: 0.1,
      products: 0.1,
    },
    consideration: {
      hero: 0,
      about: 0.1,
      stores: 0.2,
      franchise: 0.3,
      training: 0.2,
      products: 0.2,
    },
    decision: {
      hero: 0,
      about: 0,
      stores: 0.3,
      franchise: 0.3,
      training: 0.2,
      products: 0.1,
    },
  };
  
  return boostMap[journey]?.[moduleType] || 0;
}

// 导出实用的内容推荐函数
export const useContentRecommendations = () => {
  const { state } = useContextEngine();
  
  const getRecommendedActions = () => {
    const { journey, resonance } = state.fields;
    const { engagementLevel } = state.cells;
    const { userInterests } = state.molecules;
    
    const recommendations: string[] = [];
    
    // 基于旅程阶段推荐
    switch (journey) {
      case 'awareness':
        recommendations.push('了解更多关于耶氏体育');
        recommendations.push('查看我们的门店分布');
        break;
      case 'interest':
        recommendations.push('探索我们的服务项目');
        recommendations.push('了解加盟机会');
        break;
      case 'consideration':
        recommendations.push('查看加盟方案详情');
        recommendations.push('联系我们获取更多信息');
        break;
      case 'decision':
        recommendations.push('立即申请加盟');
        recommendations.push('预约实地考察');
        break;
    }
    
    // 基于兴趣推荐
    if (userInterests.includes('training')) {
      recommendations.push('了解我们的培训课程');
    }
    if (userInterests.includes('products')) {
      recommendations.push('浏览台球设备产品');
    }
    
    return recommendations.slice(0, 3); // 最多返回3个推荐
  };
  
  return {
    recommendations: getRecommendedActions(),
    shouldShowCTA: state.fields.resonance > 0.5 && state.cells.engagementLevel !== 'low',
  };
};