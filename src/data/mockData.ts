/**
 * Mock data for Yes Sports website
 */

import { Store, Product, TrainingProgram, CompanyInfo, FranchiseInfo } from '../types/models';

// 门店数据
export const mockStores: Store[] = [
  // 呈贡区
  { id: 1, name: '耶氏台球(大学城店)', district: '呈贡区', address: '云南省昆明市呈贡区大学城聚贤街768号', phone: '177-8714-7147', coordinates: [102.8471, 24.8736], businessHours: '09:00-22:00', rating: 4.8 },
  { id: 2, name: '耶氏台球(春融街店)', district: '呈贡区', address: '云南省昆明市呈贡区春融街地铁站D出口', phone: '177-8714-7147', coordinates: [102.8547, 24.8802], businessHours: '09:00-22:00', rating: 4.7 },
  { id: 3, name: '耶氏台球(雨花店)', district: '呈贡区', address: '云南省昆明市呈贡区雨花路', phone: '177-8714-7147', coordinates: [102.8392, 24.8695], businessHours: '09:00-22:00', rating: 4.6 },
  { id: 4, name: '耶氏台球(彩云南路店)', district: '呈贡区', address: '云南省昆明市呈贡区彩云南路', phone: '177-8714-7147', coordinates: [102.8513, 24.8678], businessHours: '09:00-22:00', rating: 4.9 },
  { id: 5, name: '耶氏台球(吴家营店)', district: '呈贡区', address: '云南省昆明市呈贡区吴家营地铁站', phone: '177-8714-7147', coordinates: [102.8601, 24.8745], businessHours: '09:00-22:00', rating: 4.7 },
  { id: 6, name: '耶氏台球(呈贡广场店)', district: '呈贡区', address: '云南省昆明市呈贡区呈贡广场', phone: '177-8714-7147', coordinates: [102.8456, 24.8721], businessHours: '09:00-22:00', rating: 4.8 },
  
  // 五华区
  { id: 7, name: '耶氏台球(翠湖店)', district: '五华区', address: '云南省昆明市五华区翠湖公园附近', phone: '177-8714-7147', coordinates: [102.7035, 25.0502], businessHours: '09:00-22:00', rating: 4.7 },
  { id: 8, name: '耶氏台球(南屏街店)', district: '五华区', address: '云南省昆明市五华区南屏街', phone: '177-8714-7147', coordinates: [102.7108, 25.0421], businessHours: '09:00-23:00', rating: 4.9 },
  { id: 9, name: '耶氏台球(小西门店)', district: '五华区', address: '云南省昆明市五华区小西门', phone: '177-8714-7147', coordinates: [102.6978, 25.0438], businessHours: '09:00-22:00', rating: 4.6 },
  { id: 10, name: '耶氏台球(一二一大街店)', district: '五华区', address: '云南省昆明市五华区一二一大街', phone: '177-8714-7147', coordinates: [102.7021, 25.0589], businessHours: '09:00-22:00', rating: 4.8 },
  { id: 11, name: '耶氏台球(龙泉路店)', district: '五华区', address: '云南省昆明市五华区龙泉路', phone: '177-8714-7147', coordinates: [102.7156, 25.0612], businessHours: '09:00-22:00', rating: 4.7 },
  { id: 12, name: '耶氏台球(丰宁店)', district: '五华区', address: '云南省昆明市五华区丰宁小区', phone: '177-8714-7147', coordinates: [102.6892, 25.0567], businessHours: '09:00-22:00', rating: 4.6 },
  
  // 官渡区
  { id: 13, name: '耶氏台球(关上店)', district: '官渡区', address: '云南省昆明市官渡区关上中路', phone: '177-8714-7147', coordinates: [102.7389, 25.0187], businessHours: '09:00-22:00', rating: 4.8 },
  { id: 14, name: '耶氏台球(世纪城店)', district: '官渡区', address: '云南省昆明市官渡区世纪城', phone: '177-8714-7147', coordinates: [102.7621, 24.9876], businessHours: '09:00-23:00', rating: 4.9 },
  
  // 盘龙区
  { id: 15, name: '耶氏台球(北京路店)', district: '盘龙区', address: '云南省昆明市盘龙区北京路', phone: '177-8714-7147', coordinates: [102.7234, 25.0678], businessHours: '09:00-22:00', rating: 4.7 },
  { id: 16, name: '耶氏台球(白塔路店)', district: '盘龙区', address: '云南省昆明市盘龙区白塔路', phone: '177-8714-7147', coordinates: [102.7312, 25.0723], businessHours: '09:00-22:00', rating: 4.6 },
  
  // 晋宁区
  { id: 17, name: '耶氏台球(晋宁店)', district: '晋宁区', address: '云南省昆明市晋宁区昆阳街道', phone: '177-8714-7147', coordinates: [102.5952, 24.6697], businessHours: '09:00-22:00', rating: 4.7 },
  { id: 18, name: '耶氏台球(郑和路店)', district: '晋宁区', address: '云南省昆明市晋宁区郑和路', phone: '177-8714-7147', coordinates: [102.5876, 24.6612], businessHours: '09:00-22:00', rating: 4.6 },
  { id: 19, name: '耶氏台球(晋城店)', district: '晋宁区', address: '云南省昆明市晋宁区晋城镇', phone: '177-8714-7147', coordinates: [102.6023, 24.6789], businessHours: '09:00-22:00', rating: 4.8 },
  
  // 澄江市
  { id: 20, name: '耶氏台球(澄江店)', district: '澄江市', address: '云南省玉溪市澄江市凤麓街道', phone: '177-8714-7147', coordinates: [102.9084, 24.6756], businessHours: '09:00-22:00', rating: 4.7 }
];

// 产品数据
export const mockProducts: Product[] = [
  // 耶氏品牌
  { id: 'p1', name: '耶氏专业比赛台', brand: '耶氏', category: 'table', price: 28800, specs: '9尺国际标准，进口台呢', description: '专业比赛级别台球桌，采用进口顶级配件', inStock: true, image: '/images/products/yes-pro-table.jpg' },
  { id: 'p2', name: '耶氏商用台球桌', brand: '耶氏', category: 'table', price: 18800, specs: '8尺中式黑八', description: '适合台球厅使用的高品质台球桌', inStock: true, image: '/images/products/yes-commercial.jpg' },
  { id: 'p3', name: '耶氏专业球杆', brand: '耶氏', category: 'cue', price: 3880, specs: '碳纤维科技杆身', description: '专业选手同款，精准度高', inStock: true, image: '/images/products/yes-cue.jpg' },
  
  // 古帮特品牌
  { id: 'p4', name: '古帮特经典台球桌', brand: '古帮特', category: 'table', price: 15800, specs: '8尺标准规格', description: '经典设计，性价比高', inStock: true, image: '/images/products/gubang-classic.jpg' },
  { id: 'p5', name: '古帮特专业球杆', brand: '古帮特', category: 'cue', price: 1880, specs: '加拿大枫木', description: '手工打造，平衡性佳', inStock: true, image: '/images/products/gubang-cue.jpg' },
  { id: 'p6', name: '古帮特台球配件套装', brand: '古帮特', category: 'accessory', price: 880, specs: '全套配件', description: '包含架杆、巧克粉、皮头等', inStock: true, image: '/images/products/gubang-accessories.jpg' },
  
  // 鑫隆基品牌
  { id: 'p7', name: '鑫隆基多功能台球桌', brand: '鑫隆基', category: 'table', price: 12800, specs: '7尺可折叠', description: '适合家用，节省空间', inStock: true, image: '/images/products/xinlong-multi.jpg' },
  { id: 'p8', name: '鑫隆基训练球杆', brand: '鑫隆基', category: 'cue', price: 880, specs: '练习专用', description: '适合初学者使用', inStock: true, image: '/images/products/xinlong-training.jpg' },
  { id: 'p9', name: '鑫隆基保养套装', brand: '鑫隆基', category: 'maintenance', price: 288, specs: '清洁保养用品', description: '延长设备使用寿命', inStock: true, image: '/images/products/xinlong-maintenance.jpg' },
  
  // 申天堂品牌
  { id: 'p10', name: '申天堂家用台球桌', brand: '申天堂', category: 'table', price: 8800, specs: '6尺小型', description: '适合家庭娱乐使用', inStock: true, image: '/images/products/shentian-home.jpg' },
  { id: 'p11', name: '申天堂入门球杆', brand: '申天堂', category: 'cue', price: 380, specs: '轻量化设计', description: '入门级球杆，轻巧耐用', inStock: true, image: '/images/products/shentian-beginner.jpg' },
  { id: 'p12', name: '申天堂台球套装', brand: '申天堂', category: 'accessory', price: 580, specs: '家用套装', description: '包含球、三角架等基础配件', inStock: true, image: '/images/products/shentian-set.jpg' }
];

// 培训课程数据
export const mockTrainingPrograms: TrainingProgram[] = [
  {
    id: 't1',
    title: '台球桌专业安装技术培训',
    category: 'installation',
    description: '学习专业的台球桌安装、调平、维护技术',
    duration: '5天',
    price: 3800,
    level: 'intermediate',
    certification: true,
    popularity: 4.8,
    modules: ['台球桌结构原理', '安装工具使用', '调平技术', '台呢更换', '日常维护'],
    schedule: [
      { date: '2024-02-01', time: '09:00-17:00', location: '昆明总部' },
      { date: '2024-03-01', time: '09:00-17:00', location: '昆明总部' }
    ]
  },
  {
    id: 't2',
    title: '台球技术初级培训',
    category: 'academy',
    description: '零基础学员的台球入门课程',
    duration: '10课时',
    price: 1580,
    level: 'beginner',
    certification: false,
    popularity: 4.6,
    modules: ['握杆姿势', '基础瞄准', '力度控制', '基本杆法', '简单走位'],
    schedule: [
      { date: '2024-02-05', time: '19:00-21:00', location: '各门店' },
      { date: '2024-02-12', time: '19:00-21:00', location: '各门店' }
    ]
  },
  {
    id: 't3',
    title: '台球技术中级培训',
    category: 'academy',
    description: '提升球技，学习高级技巧',
    duration: '20课时',
    price: 2880,
    level: 'intermediate',
    certification: true,
    popularity: 4.7,
    modules: ['高级杆法', '复杂走位', '防守策略', '心理训练', '比赛技巧'],
    schedule: [
      { date: '2024-02-10', time: '19:00-21:00', location: '各门店' },
      { date: '2024-02-17', time: '19:00-21:00', location: '各门店' }
    ]
  },
  {
    id: 't4',
    title: '门店运营管理培训',
    category: 'installation',
    description: '学习台球厅的运营管理知识',
    duration: '3天',
    price: 2580,
    level: 'beginner',
    certification: true,
    popularity: 4.5,
    modules: ['门店管理', '客户服务', '营销推广', '财务基础', '团队建设'],
    schedule: [
      { date: '2024-02-15', time: '09:00-17:00', location: '昆明总部' },
      { date: '2024-03-15', time: '09:00-17:00', location: '昆明总部' }
    ]
  }
];

// 公司信息
export const mockCompanyInfo: CompanyInfo = {
  name: '云南耶氏体育文化发展有限公司',
  slogan: '把职业台球带到大众生活中',
  summary: '西南地区唯一的台球桌生产厂家，拥有20家连锁门店，致力于推广台球运动。',
  description: '云南耶氏体育文化发展有限公司成立于2018年，是西南地区领先的台球运动推广企业。公司集台球桌生产、销售、门店运营、培训服务于一体，拥有完整的产业链。',
  foundedYear: 2018,
  employeeCount: 100,
  keyPoints: [
    '西南地区唯一台球桌生产厂家',
    '拥有20家连锁门店',
    '4个自主品牌',
    '完整产业链服务'
  ],
  sections: {
    history: '公司创立于2018年，从第一家门店开始，逆市扩张，短短几年时间发展到20家连锁门店，成为云南省最大的台球连锁品牌。2020年建立自己的生产工厂，成为西南地区唯一的台球桌生产厂家。',
    mission: '把职业台球带到大众生活中，让更多人享受台球运动的乐趣。我们致力于提供专业的设备、优质的环境和系统的培训，推动台球运动在西南地区的普及和发展。',
    values: '专业、品质、服务、创新。我们坚持用专业的态度做好每一张台球桌，用优质的服务对待每一位客户，不断创新以满足市场需求。',
    team: {
      founder: '蔺总',
      employees: '100+专业团队',
      philosophy: '认认真真做好台球这一件事'
    }
  },
  contact: {
    phone: '177-8714-7147',
    email: 'info@yes147.com',
    wechat: 'yes147sport'
  }
};

// 加盟信息
export const mockFranchiseInfo: FranchiseInfo = {
  advantages: [
    '品牌支持：西南地区知名台球连锁品牌',
    '技术培训：专业的技术和运营培训体系',
    '设备优势：自有工厂，设备成本低',
    '运营指导：总部提供持续运营支持',
    '区域保护：合理的区域保护政策'
  ],
  process: [
    { step: 1, title: '了解品牌', description: '通过官网、实地考察了解耶氏品牌' },
    { step: 2, title: '提交申请', description: '填写加盟申请表，提交相关资料' },
    { step: 3, title: '资质审核', description: '总部审核加盟商资质和选址' },
    { step: 4, title: '签订合同', description: '双方签订加盟合作协议' },
    { step: 5, title: '店面装修', description: '按照统一标准进行店面装修' },
    { step: 6, title: '设备安装', description: '总部提供设备并安排专业安装' },
    { step: 7, title: '人员培训', description: '店员接受专业技术和服务培训' },
    { step: 8, title: '开业运营', description: '正式开业，总部持续支持' }
  ],
  investment: {
    initial: '30-50万元',
    breakdown: {
      franchiseFee: '5万元',
      equipment: '15-25万元',
      decoration: '8-15万元',
      others: '2-5万元'
    },
    roi: '12-18个月',
    support: [
      '免费店面设计',
      '设备成本价供应',
      '开业营销支持',
      '持续运营指导'
    ]
  }
};

// FAQ数据
export function getFAQs() {
  return [
    {
      id: 'faq1',
      category: 'general',
      question: '耶氏台球的营业时间是什么时候？',
      answer: '我们大部分门店的营业时间是早上9:00到晚上22:00，部分繁华商圈门店营业到23:00。具体时间请查看各门店信息。'
    },
    {
      id: 'faq2',
      category: 'franchise',
      question: '加盟耶氏台球需要多少投资？',
      answer: '根据店面规模和位置不同，总投资在30-50万元之间。包括加盟费5万元、设备费15-25万元、装修费8-15万元等。'
    },
    {
      id: 'faq3',
      category: 'training',
      question: '台球培训课程适合零基础学员吗？',
      answer: '当然适合！我们有专门的初级培训课程，从握杆姿势开始教起，循序渐进，让零基础学员也能快速入门。'
    },
    {
      id: 'faq4',
      category: 'products',
      question: '你们的台球桌质保期是多久？',
      answer: '耶氏品牌台球桌提供2年质保，古帮特和鑫隆基品牌提供1年质保。终身提供有偿维修服务。'
    },
    {
      id: 'faq5',
      category: 'general',
      question: '可以举办台球比赛或包场吗？',
      answer: '可以的！我们支持举办各类台球比赛和包场活动。请提前联系门店预约，我们会提供专业的赛事支持。'
    }
  ];
}

// 新闻数据
export function getNews() {
  return [
    {
      id: 'news1',
      title: '耶氏台球第20家门店盛大开业',
      summary: '2024年1月，耶氏台球在澄江市的新店正式开业，标志着我们的连锁版图进一步扩大。',
      date: '2024-01-15',
      category: 'company',
      image: '/images/news/store20.jpg'
    },
    {
      id: 'news2',
      title: '2024年春季台球培训班开始报名',
      summary: '新一期的台球技术培训班开始接受报名，包括初级班、中级班和高级班，专业教练授课。',
      date: '2024-01-10',
      category: 'training',
      image: '/images/news/training.jpg'
    },
    {
      id: 'news3',
      title: '耶氏杯台球公开赛圆满结束',
      summary: '历时3天的耶氏杯台球公开赛圆满落幕，来自全省的128名选手参与了激烈角逐。',
      date: '2024-01-05',
      category: 'event',
      image: '/images/news/tournament.jpg'
    }
  ];
}

// 加盟成功案例
export function getFranchiseSuccessCases() {
  return [
    {
      id: 'case1',
      name: '张先生',
      location: '呈贡大学城店',
      investment: '35万',
      roi: '14个月',
      story: '张先生原本是一名IT工程师，2022年加盟耶氏台球。凭借大学城的地理优势和总部的运营支持，仅用14个月就收回了投资。现在月营业额稳定在8万元以上。',
      image: '/images/cases/case1.jpg'
    },
    {
      id: 'case2',
      name: '李女士',
      location: '官渡世纪城店',
      investment: '45万',
      roi: '16个月',
      story: '李女士看好台球运动的发展前景，选择了人流量大的世纪城商圈。通过举办会员活动和青少年培训班，建立了稳定的客户群体，生意蒸蒸日上。',
      image: '/images/cases/case2.jpg'
    },
    {
      id: 'case3',
      name: '王总',
      location: '五华南屏街店',
      investment: '50万',
      roi: '12个月',
      story: '王总有多年的餐饮行业经验，转型做台球厅后，将服务理念带入经营中。优质的服务加上繁华的地段，让门店迅速成为当地台球爱好者的聚集地。',
      image: '/images/cases/case3.jpg'
    }
  ];
}