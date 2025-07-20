/**
 * 文案迁移工具
 * 用于将优化后的文案更新到CMS系统
 */

import { cmsService } from '../services/cmsService';
import { CMSKeys } from '../types/cms';
import { OptimizedCopy } from './optimizedCopy';

/**
 * 执行文案迁移
 */
export async function migrateCopyToCMS(): Promise<{
  success: boolean;
  updated: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let updated = 0;

  try {
    // 批量更新所有优化后的文案
    const updates: Record<string, string> = {
      [CMSKeys.HOME_HERO_TITLE]: OptimizedCopy.HOME_HERO_TITLE,
      [CMSKeys.HOME_HERO_SUBTITLE]: OptimizedCopy.HOME_HERO_SUBTITLE,
      [CMSKeys.HOME_HERO_CTA]: OptimizedCopy.HOME_HERO_CTA,
      [CMSKeys.HOME_VALUE_PROP_1_TITLE]: OptimizedCopy.HOME_VALUE_PROP_1_TITLE,
      [CMSKeys.HOME_VALUE_PROP_1_DESC]: OptimizedCopy.HOME_VALUE_PROP_1_DESC,
      [CMSKeys.HOME_VALUE_PROP_2_TITLE]: OptimizedCopy.HOME_VALUE_PROP_2_TITLE,
      [CMSKeys.HOME_VALUE_PROP_2_DESC]: OptimizedCopy.HOME_VALUE_PROP_2_DESC,
      [CMSKeys.HOME_VALUE_PROP_3_TITLE]: OptimizedCopy.HOME_VALUE_PROP_3_TITLE,
      [CMSKeys.HOME_VALUE_PROP_3_DESC]: OptimizedCopy.HOME_VALUE_PROP_3_DESC,
      [CMSKeys.ABOUT_TITLE]: OptimizedCopy.ABOUT_TITLE,
      [CMSKeys.ABOUT_INTRO]: OptimizedCopy.ABOUT_INTRO,
      [CMSKeys.ABOUT_MISSION]: OptimizedCopy.ABOUT_MISSION,
      [CMSKeys.ABOUT_VISION]: OptimizedCopy.ABOUT_VISION,
      [CMSKeys.PRODUCTS_TITLE]: OptimizedCopy.PRODUCTS_TITLE,
      [CMSKeys.PRODUCTS_INTRO]: OptimizedCopy.PRODUCTS_INTRO,
      [CMSKeys.TRAINING_TITLE]: OptimizedCopy.TRAINING_TITLE,
      [CMSKeys.TRAINING_INTRO]: OptimizedCopy.TRAINING_INTRO,
      [CMSKeys.FRANCHISE_TITLE]: OptimizedCopy.FRANCHISE_TITLE,
      [CMSKeys.FRANCHISE_INTRO]: OptimizedCopy.FRANCHISE_INTRO,
      [CMSKeys.CONTACT_TITLE]: OptimizedCopy.CONTACT_TITLE,
      [CMSKeys.CONTACT_INTRO]: OptimizedCopy.CONTACT_INTRO,
      [CMSKeys.COMPANY_NAME]: OptimizedCopy.COMPANY_NAME,
      [CMSKeys.COMPANY_SLOGAN]: OptimizedCopy.COMPANY_SLOGAN,
      [CMSKeys.FOOTER_COPYRIGHT]: OptimizedCopy.FOOTER_COPYRIGHT,
      [CMSKeys.FOOTER_ICP]: OptimizedCopy.FOOTER_ICP,
    };

    // 执行批量更新
    const updatedContents = await cmsService.batchUpdateContent(updates);
    updated = updatedContents.length;

    console.log(`✅ 成功更新 ${updated} 条文案内容`);

    return {
      success: true,
      updated,
      errors,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    errors.push(errorMessage);
    console.error('❌ 文案迁移失败:', errorMessage);

    return {
      success: false,
      updated,
      errors,
    };
  }
}

/**
 * 预览文案变更
 */
export async function previewCopyChanges(): Promise<Array<{
  key: string;
  label: string;
  oldValue: string;
  newValue: string;
  changed: boolean;
}>> {
  const changes = [];

  try {
    // 获取所有当前内容
    const allContent = await cmsService.getAllContent();
    
    // 比较每个内容项
    for (const content of allContent) {
      const newValue = OptimizedCopy[content.key.split('.').join('_').toUpperCase() as keyof typeof OptimizedCopy];
      
      if (typeof newValue === 'string') {
        changes.push({
          key: content.key,
          label: content.label,
          oldValue: content.value,
          newValue: newValue,
          changed: content.value !== newValue,
        });
      }
    }

    return changes;
  } catch (error) {
    console.error('预览失败:', error);
    return [];
  }
}

/**
 * 导出优化文案报告
 */
export function generateCopyReport(): string {
  const report = [];
  
  report.push('# 耶氏体育网站文案优化报告\n');
  report.push('## 优化策略\n');
  report.push('1. **更强的价值主张**: 突出具体数字和成就，增强可信度');
  report.push('2. **行动导向**: 使用更有力的动词和行动号召');
  report.push('3. **情感连接**: 强调梦想、成功、专业等情感词汇');
  report.push('4. **社会证明**: 加入客户数量、成功案例等社会证明元素');
  report.push('5. **紧迫感营造**: 使用限时、立即等词汇创造行动紧迫感\n');
  
  report.push('## 主要优化内容\n');
  
  // 首页优化
  report.push('### 首页');
  report.push('- **主标题**: 从"让每个人都能享受专业级台球体验"优化为"成就您的台球梦想，从这里开始"');
  report.push('- **副标题**: 加入具体数字和成就，增强可信度');
  report.push('- **价值主张**: 更具体的描述，突出独特优势\n');
  
  // 其他页面优化
  report.push('### 其他页面');
  report.push('- **关于我们**: 加入创立时间和发展历程，增强品牌故事');
  report.push('- **产品中心**: 突出生产规模和年产能，展示实力');
  report.push('- **培训页面**: 强调教练资源和教学体系的专业性');
  report.push('- **加盟页面**: 加入成功案例数量和投资回报率，增强吸引力\n');
  
  report.push('## 额外优化建议\n');
  report.push('1. **添加客户评价模块**: 展示真实客户反馈，增强信任');
  report.push('2. **创建紧急感元素**: 限时优惠、名额有限等');
  report.push('3. **优化CTA按钮**: 使用更有吸引力的行动号召文案');
  report.push('4. **增加信任标识**: 资质认证、品质保证等标识');
  report.push('5. **完善产品特点描述**: 突出独特卖点和客户利益\n');
  
  report.push('## 实施建议\n');
  report.push('1. 先在测试环境验证文案效果');
  report.push('2. A/B测试不同版本的文案');
  report.push('3. 收集用户反馈并持续优化');
  report.push('4. 定期更新数字和成就数据');
  report.push('5. 保持文案风格的一致性\n');
  
  report.push('---\n');
  report.push(`生成时间: ${new Date().toLocaleString('zh-CN')}`);
  
  return report.join('\n');
}