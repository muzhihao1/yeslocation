/**
 * CMS（内容管理系统）类型定义
 */

export interface CMSContent {
  id: string;
  key: string;
  type: 'text' | 'richtext' | 'image' | 'video';
  value: string;
  label: string;
  category: string;
  updatedAt: Date;
}

export interface CMSCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

/**
 * 预定义的内容键值
 */
export const CMSKeys = {
  // 首页内容
  HOME_HERO_TITLE: 'home.hero.title',
  HOME_HERO_SUBTITLE: 'home.hero.subtitle',
  HOME_HERO_CTA: 'home.hero.cta',
  HOME_VALUE_PROP_1_TITLE: 'home.value1.title',
  HOME_VALUE_PROP_1_DESC: 'home.value1.desc',
  HOME_VALUE_PROP_2_TITLE: 'home.value2.title',
  HOME_VALUE_PROP_2_DESC: 'home.value2.desc',
  HOME_VALUE_PROP_3_TITLE: 'home.value3.title',
  HOME_VALUE_PROP_3_DESC: 'home.value3.desc',
  
  // 关于我们页面
  ABOUT_TITLE: 'about.title',
  ABOUT_INTRO: 'about.intro',
  ABOUT_MISSION: 'about.mission',
  ABOUT_VISION: 'about.vision',
  ABOUT_VALUES: 'about.values',
  
  // 产品页面
  PRODUCTS_TITLE: 'products.title',
  PRODUCTS_INTRO: 'products.intro',
  PRODUCTS_TABLE_TITLE: 'products.table.title',
  PRODUCTS_TABLE_DESC: 'products.table.desc',
  PRODUCTS_ACCESSORY_TITLE: 'products.accessory.title',
  PRODUCTS_ACCESSORY_DESC: 'products.accessory.desc',
  
  // 培训页面
  TRAINING_TITLE: 'training.title',
  TRAINING_INTRO: 'training.intro',
  TRAINING_BASIC_TITLE: 'training.basic.title',
  TRAINING_BASIC_DESC: 'training.basic.desc',
  TRAINING_ADVANCED_TITLE: 'training.advanced.title',
  TRAINING_ADVANCED_DESC: 'training.advanced.desc',
  
  // 加盟页面
  FRANCHISE_TITLE: 'franchise.title',
  FRANCHISE_INTRO: 'franchise.intro',
  FRANCHISE_BENEFITS: 'franchise.benefits',
  FRANCHISE_REQUIREMENTS: 'franchise.requirements',
  FRANCHISE_PROCESS: 'franchise.process',
  
  // 联系页面
  CONTACT_TITLE: 'contact.title',
  CONTACT_INTRO: 'contact.intro',
  CONTACT_PHONE_LABEL: 'contact.phone.label',
  CONTACT_EMAIL_LABEL: 'contact.email.label',
  CONTACT_ADDRESS_LABEL: 'contact.address.label',
  
  // 通用内容
  COMPANY_NAME: 'company.name',
  COMPANY_SLOGAN: 'company.slogan',
  FOOTER_COPYRIGHT: 'footer.copyright',
  FOOTER_ICP: 'footer.icp',
} as const;

/**
 * 内容类别
 */
export const CMSCategories: CMSCategory[] = [
  { id: 'home', name: '首页', description: '网站首页的内容', order: 1 },
  { id: 'about', name: '关于我们', description: '公司介绍相关内容', order: 2 },
  { id: 'products', name: '产品中心', description: '产品相关内容', order: 3 },
  { id: 'training', name: '培训中心', description: '培训课程相关内容', order: 4 },
  { id: 'franchise', name: '加盟合作', description: '加盟相关内容', order: 5 },
  { id: 'contact', name: '联系我们', description: '联系方式相关内容', order: 6 },
  { id: 'common', name: '通用内容', description: '全站通用的内容', order: 7 },
];