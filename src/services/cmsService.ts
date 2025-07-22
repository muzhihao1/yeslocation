/**
 * CMS内容管理服务
 * 管理网站的可编辑内容
 */

import { CMSContent, CMSKeys, CMSCategories, CMSCategory } from '../types/cms';

class CMSService {
  private readonly STORAGE_KEY = 'yes_sports_cms_content';
  private cache: Map<string, CMSContent> = new Map();
  private initialized = false;

  /**
   * 默认内容配置
   */
  private defaultContent: Partial<Record<keyof typeof CMSKeys, CMSContent>> = {
    // 首页内容
    HOME_HERO_TITLE: {
      id: 'home_hero_title',
      key: CMSKeys.HOME_HERO_TITLE,
      type: 'text',
      value: '让每个人都能享受专业级台球体验',
      label: '首页主标题',
      category: 'home',
      updatedAt: new Date(),
    },
    HOME_HERO_SUBTITLE: {
      id: 'home_hero_subtitle',
      key: CMSKeys.HOME_HERO_SUBTITLE,
      type: 'text',
      value: '20年匠心工艺 | 西南唯一台球设备制造商 | 一站式服务',
      label: '首页副标题',
      category: 'home',
      updatedAt: new Date(),
    },
    HOME_HERO_CTA: {
      id: 'home_hero_cta',
      key: CMSKeys.HOME_HERO_CTA,
      type: 'text',
      value: '免费体验课程',
      label: '首页CTA按钮文字',
      category: 'home',
      updatedAt: new Date(),
    },
    HOME_VALUE_PROP_1_TITLE: {
      id: 'home_value1_title',
      key: CMSKeys.HOME_VALUE_PROP_1_TITLE,
      type: 'text',
      value: '自主生产',
      label: '价值主张1标题',
      category: 'home',
      updatedAt: new Date(),
    },
    HOME_VALUE_PROP_1_DESC: {
      id: 'home_value1_desc',
      key: CMSKeys.HOME_VALUE_PROP_1_DESC,
      type: 'richtext',
      value: '西南地区唯一台球设备制造商 从源头保证品质',
      label: '价值主张1描述',
      category: 'home',
      updatedAt: new Date(),
    },
    HOME_VALUE_PROP_2_TITLE: {
      id: 'home_value2_title',
      key: CMSKeys.HOME_VALUE_PROP_2_TITLE,
      type: 'text',
      value: '专业培训',
      label: '价值主张2标题',
      category: 'home',
      updatedAt: new Date(),
    },
    HOME_VALUE_PROP_2_DESC: {
      id: 'home_value2_desc',
      key: CMSKeys.HOME_VALUE_PROP_2_DESC,
      type: 'richtext',
      value: '专业教练团队，科学训练体系',
      label: '价值主张2描述',
      category: 'home',
      updatedAt: new Date(),
    },
    HOME_VALUE_PROP_3_TITLE: {
      id: 'home_value3_title',
      key: CMSKeys.HOME_VALUE_PROP_3_TITLE,
      type: 'text',
      value: '全程服务',
      label: '价值主张3标题',
      category: 'home',
      updatedAt: new Date(),
    },
    HOME_VALUE_PROP_3_DESC: {
      id: 'home_value3_desc',
      key: CMSKeys.HOME_VALUE_PROP_3_DESC,
      type: 'richtext',
      value: '从设备到运营，提供一站式解决方案',
      label: '价值主张3描述',
      category: 'home',
      updatedAt: new Date(),
    },
    
    // 关于我们页面
    ABOUT_TITLE: {
      id: 'about_title',
      key: CMSKeys.ABOUT_TITLE,
      type: 'text',
      value: '关于耶氏体育',
      label: '关于我们页面标题',
      category: 'about',
      updatedAt: new Date(),
    },
    ABOUT_INTRO: {
      id: 'about_intro',
      key: CMSKeys.ABOUT_INTRO,
      type: 'richtext',
      value: '云南耶氏体育文化发展有限公司是西南地区领先的台球设备制造商和运营服务商，致力于推广台球文化，让更多人享受台球运动的乐趣。',
      label: '公司简介',
      category: 'about',
      updatedAt: new Date(),
    },
    ABOUT_MISSION: {
      id: 'about_mission',
      key: CMSKeys.ABOUT_MISSION,
      type: 'richtext',
      value: '让每个人都能享受专业级的台球体验，推动中国台球运动的普及和发展。',
      label: '公司使命',
      category: 'about',
      updatedAt: new Date(),
    },
    ABOUT_VISION: {
      id: 'about_vision',
      key: CMSKeys.ABOUT_VISION,
      type: 'richtext',
      value: '成为中国最受信赖的台球设备和服务提供商，打造国际一流的台球品牌。',
      label: '公司愿景',
      category: 'about',
      updatedAt: new Date(),
    },
    
    // 产品页面
    PRODUCTS_TITLE: {
      id: 'products_title',
      key: CMSKeys.PRODUCTS_TITLE,
      type: 'text',
      value: '产品中心',
      label: '产品页面标题',
      category: 'products',
      updatedAt: new Date(),
    },
    PRODUCTS_INTRO: {
      id: 'products_intro',
      key: CMSKeys.PRODUCTS_INTRO,
      type: 'richtext',
      value: '耶氏体育拥有完整的台球设备生产线，从专业比赛台球桌到休闲娱乐设备，满足不同客户的需求。',
      label: '产品页面介绍',
      category: 'products',
      updatedAt: new Date(),
    },
    
    // 培训页面
    TRAINING_TITLE: {
      id: 'training_title',
      key: CMSKeys.TRAINING_TITLE,
      type: 'text',
      value: '专业台球培训',
      label: '培训页面标题',
      category: 'training',
      updatedAt: new Date(),
    },
    TRAINING_INTRO: {
      id: 'training_intro',
      key: CMSKeys.TRAINING_INTRO,
      type: 'richtext',
      value: '耶氏体育培训中心拥有专业的教练团队和科学的训练体系，为不同水平的学员提供个性化的培训方案。',
      label: '培训页面介绍',
      category: 'training',
      updatedAt: new Date(),
    },
    
    // 加盟页面
    FRANCHISE_TITLE: {
      id: 'franchise_title',
      key: CMSKeys.FRANCHISE_TITLE,
      type: 'text',
      value: '加盟耶氏体育',
      label: '加盟页面标题',
      category: 'franchise',
      updatedAt: new Date(),
    },
    FRANCHISE_INTRO: {
      id: 'franchise_intro',
      key: CMSKeys.FRANCHISE_INTRO,
      type: 'richtext',
      value: '加入耶氏体育，共享台球产业发展红利。我们提供全方位的加盟支持，助您轻松开店，快速盈利。',
      label: '加盟页面介绍',
      category: 'franchise',
      updatedAt: new Date(),
    },
    
    // 联系页面
    CONTACT_TITLE: {
      id: 'contact_title',
      key: CMSKeys.CONTACT_TITLE,
      type: 'text',
      value: '联系我们',
      label: '联系页面标题',
      category: 'contact',
      updatedAt: new Date(),
    },
    CONTACT_INTRO: {
      id: 'contact_intro',
      key: CMSKeys.CONTACT_INTRO,
      type: 'richtext',
      value: '如有任何问题或合作意向，欢迎随时与我们联系。我们将竭诚为您服务。',
      label: '联系页面介绍',
      category: 'contact',
      updatedAt: new Date(),
    },
    
    // 通用内容
    COMPANY_NAME: {
      id: 'company_name',
      key: CMSKeys.COMPANY_NAME,
      type: 'text',
      value: '耶氏体育',
      label: '公司名称',
      category: 'common',
      updatedAt: new Date(),
    },
    COMPANY_SLOGAN: {
      id: 'company_slogan',
      key: CMSKeys.COMPANY_SLOGAN,
      type: 'text',
      value: '专业品质，值得信赖',
      label: '公司口号',
      category: 'common',
      updatedAt: new Date(),
    },
    FOOTER_COPYRIGHT: {
      id: 'footer_copyright',
      key: CMSKeys.FOOTER_COPYRIGHT,
      type: 'text',
      value: '© 2025 云南耶氏体育文化发展有限公司 版权所有',
      label: '版权信息',
      category: 'common',
      updatedAt: new Date(),
    },
    FOOTER_ICP: {
      id: 'footer_icp',
      key: CMSKeys.FOOTER_ICP,
      type: 'text',
      value: '滇ICP备2025000000号',
      label: 'ICP备案号',
      category: 'common',
      updatedAt: new Date(),
    },
  };

  /**
   * 初始化内容
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // 从本地存储加载内容
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, content]) => {
          this.cache.set(key, {
            ...(content as CMSContent),
            updatedAt: new Date((content as any).updatedAt),
          });
        });
      } else {
        // 初始化默认内容
        Object.values(this.defaultContent).forEach((content) => {
          if (content) {
            this.cache.set(content.key, content);
          }
        });
        this.saveToStorage();
      }
      this.initialized = true;
    } catch (error) {
      console.error('CMS初始化失败:', error);
      // 使用默认内容
      Object.values(this.defaultContent).forEach((content) => {
        if (content) {
          this.cache.set(content.key, content);
        }
      });
      this.initialized = true;
    }
  }

  /**
   * 保存到本地存储
   */
  private saveToStorage(): void {
    const data: Record<string, CMSContent> = {};
    this.cache.forEach((content, key) => {
      data[key] = content;
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * 获取内容
   */
  async getContent(key: string): Promise<string> {
    await this.initialize();
    const content = this.cache.get(key);
    return content?.value || this.defaultContent[key as keyof typeof CMSKeys]?.value || key;
  }

  /**
   * 获取完整内容对象
   */
  async getContentObject(key: string): Promise<CMSContent | null> {
    await this.initialize();
    return this.cache.get(key) || null;
  }

  /**
   * 获取类别下的所有内容
   */
  async getContentByCategory(category: string): Promise<CMSContent[]> {
    await this.initialize();
    const contents: CMSContent[] = [];
    this.cache.forEach((content) => {
      if (content.category === category) {
        contents.push(content);
      }
    });
    return contents.sort((a, b) => a.label.localeCompare(b.label));
  }

  /**
   * 获取所有内容
   */
  async getAllContent(): Promise<CMSContent[]> {
    await this.initialize();
    return Array.from(this.cache.values());
  }

  /**
   * 更新内容
   */
  async updateContent(key: string, value: string): Promise<CMSContent> {
    await this.initialize();
    const existing = this.cache.get(key);
    if (!existing) {
      throw new Error(`内容键 ${key} 不存在`);
    }

    const updated: CMSContent = {
      ...existing,
      value,
      updatedAt: new Date(),
    };

    this.cache.set(key, updated);
    this.saveToStorage();
    return updated;
  }

  /**
   * 批量更新内容
   */
  async batchUpdateContent(updates: Record<string, string>): Promise<CMSContent[]> {
    await this.initialize();
    const updatedContents: CMSContent[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      const existing = this.cache.get(key);
      if (existing) {
        const updated: CMSContent = {
          ...existing,
          value,
          updatedAt: new Date(),
        };
        this.cache.set(key, updated);
        updatedContents.push(updated);
      }
    });

    this.saveToStorage();
    return updatedContents;
  }

  /**
   * 重置为默认内容
   */
  async resetToDefault(key?: string): Promise<void> {
    await this.initialize();

    if (key) {
      // 重置单个内容
      const defaultItem = this.defaultContent[key as keyof typeof CMSKeys];
      if (defaultItem) {
        this.cache.set(key, { ...defaultItem, updatedAt: new Date() });
      }
    } else {
      // 重置所有内容
      this.cache.clear();
      Object.values(this.defaultContent).forEach((content) => {
        if (content) {
          this.cache.set(content.key, { ...content, updatedAt: new Date() });
        }
      });
    }

    this.saveToStorage();
  }

  /**
   * 获取所有类别
   */
  getCategories(): CMSCategory[] {
    return CMSCategories;
  }

  /**
   * 导出内容
   */
  async exportContent(): Promise<string> {
    await this.initialize();
    const data: Record<string, CMSContent> = {};
    this.cache.forEach((content, key) => {
      data[key] = content;
    });
    return JSON.stringify(data, null, 2);
  }

  /**
   * 导入内容
   */
  async importContent(jsonData: string): Promise<void> {
    await this.initialize();
    try {
      const data = JSON.parse(jsonData);
      this.cache.clear();
      Object.entries(data).forEach(([key, content]) => {
        this.cache.set(key, {
          ...(content as CMSContent),
          updatedAt: new Date((content as any).updatedAt),
        });
      });
      this.saveToStorage();
    } catch (error) {
      throw new Error('导入失败：无效的JSON数据');
    }
  }
}

export const cmsService = new CMSService();