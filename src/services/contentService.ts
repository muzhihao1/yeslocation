/**
 * 内容管理服务
 * 基于CE文档协议提供结构化内容
 */

import {
  DocumentProtocol,
  DocumentStatus,
  AccessLevel,
  ProtocolDocument,
  ExecutiveBriefContent,
  StrategicPlanContent,
  StructuredArticleContent,
  KeyPoint,
  BriefSection,
  Statistic,
  CallToAction,
  Objective,
  ImplementationPhase,
  Task,
  ResourceRequirement,
  SuccessMetric,
  Timeline,
  KeyDate,
  ArticleSection,
  MediaContent
} from '../protocols/ceProtocols';

import {
  mockCompanyInfo,
  mockFranchiseInfo,
  mockTrainingPrograms,
  mockProducts,
  getFranchiseSuccessCases,
  getFAQs,
  getNews
} from '../data/mockData';

import {
  ContentDataService,
  DataResponse,
  ContentModule,
  ContentType
} from '../interfaces/dataProvider';

import {
  CompanyInfo,
  FranchiseInfo,
  TrainingProgram,
  Product,
  ResponseMetadata
} from '../types/models';

/**
 * 内容服务实现类
 * 提供基于CE协议的结构化内容管理
 */
export class ContentService {
  /**
   * 获取公司信息（ExecutiveBrief协议）
   * 用于关于我们页面
   */
  async getCompanyInfo(): Promise<ProtocolDocument<ExecutiveBriefContent>> {
    try {
      const companyInfo = mockCompanyInfo;
      
      // 构建关键要点
      const keyPoints: KeyPoint[] = [
        {
          title: "20家连锁门店",
          description: "覆盖昆明全城，年服务客户超100万人次",
          icon: "store",
          priority: 1
        },
        {
          title: "西南唯一生产商",
          description: "西南地区唯一台球桌生产基地，年产500台",
          icon: "factory",
          priority: 2
        },
        {
          title: "四大品牌体系",
          description: "耶氏、古帮特、鑫隆基、申天堂全产品线",
          icon: "brand",
          priority: 3
        },
        {
          title: "全产业链布局",
          description: "生产-销售-运营-培训一体化服务",
          icon: "chain",
          priority: 4
        }
      ];
      
      // 构建内容段落
      const sections: BriefSection[] = [
        {
          title: "公司历史",
          content: `云南耶氏体育发展有限公司成立于${companyInfo.foundedYear || 2018}年，从第一家直营店开始，
                   经过${new Date().getFullYear() - (companyInfo.foundedYear || 2018)}年的发展，
                   已成为云南台球行业的领导品牌。`,
          subsections: []
        },
        {
          title: "企业使命",
          content: companyInfo.sections.mission,
          subsections: [
            {
              title: "愿景",
              content: "成为西南地区台球行业的领导者"
            },
            {
              title: "价值观",
              content: companyInfo.sections.values
            }
          ]
        },
        {
          title: "业务范围",
          content: "耶氏体育提供台球行业全方位服务",
          subsections: [
            {
              title: "连锁经营",
              content: "20家直营及加盟门店，覆盖昆明主要商圈"
            },
            {
              title: "设备制造",
              content: "自主生产基地，提供高品质台球桌及配件"
            },
            {
              title: "专业培训",
              content: "从入门到职业的完整培训体系"
            },
            {
              title: "赛事运营",
              content: "承办各级台球赛事，推广台球文化"
            }
          ]
        }
      ];
      
      // 构建统计数据
      const statistics: Statistic[] = [
        {
          label: "连锁门店",
          value: 20,
          unit: "家",
          trend: "up",
          changePercentage: 25
        },
        {
          label: "员工总数",
          value: companyInfo.employeeCount || 100,
          unit: "人+",
          trend: "up"
        },
        {
          label: "年产量",
          value: 500,
          unit: "台",
          trend: "stable"
        },
        {
          label: "服务客户",
          value: "100万",
          unit: "人次/年",
          trend: "up",
          changePercentage: 30
        }
      ];
      
      // 构建行动呼吁
      const callToAction: CallToAction = {
        text: "加入耶氏，共创台球事业新未来",
        buttonText: "了解加盟详情",
        link: "/franchise",
        style: "primary"
      };
      
      const executiveBriefContent: ExecutiveBriefContent = {
        summary: companyInfo.slogan || '把职业台球带到大众生活中',
        keyPoints,
        sections,
        statistics,
        callToAction
      };
      
      return {
        protocol: DocumentProtocol.EXECUTIVE_BRIEF,
        metadata: {
          id: "company-info-001",
          title: companyInfo.name || '云南耶氏体育文化发展有限公司',
          description: "公司概况及发展历程",
          author: "耶氏体育",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: new Date().toISOString(),
          version: "1.0.0",
          tags: ["公司介绍", "关于我们", "企业文化"],
          status: DocumentStatus.PUBLISHED,
          language: "zh-CN",
          accessLevel: AccessLevel.PUBLIC
        },
        content: executiveBriefContent,
        protocolVersion: "1.0"
      };
    } catch (error) {
      throw new Error(`Failed to get company info: ${error}`);
    }
  }
  
  /**
   * 获取加盟信息（StrategicPlan协议）
   * 用于加盟合作页面
   */
  async getFranchiseInfo(): Promise<ProtocolDocument<StrategicPlanContent>> {
    try {
      const franchiseInfo = mockFranchiseInfo;
      const successCases = getFranchiseSuccessCases();
      
      // 构建目标列表
      const objectives: Objective[] = [
        {
          id: "obj-1",
          title: "市场扩张目标",
          description: "3年内在云南省实现50家门店覆盖",
          priority: "high",
          keyResults: [
            "每年新增10-15家加盟店",
            "覆盖云南16个地州市",
            "市场占有率达到40%"
          ]
        },
        {
          id: "obj-2",
          title: "品牌提升目标",
          description: "成为西南地区最具影响力的台球品牌",
          priority: "high",
          keyResults: [
            "品牌知名度达到90%",
            "客户满意度超过95%",
            "获得行业领导品牌认证"
          ]
        },
        {
          id: "obj-3",
          title: "盈利能力目标",
          description: "实现加盟商与总部的共赢发展",
          priority: "medium",
          keyResults: [
            "加盟店平均回本期控制在18个月内",
            "年利润率达到25%以上",
            "加盟商续约率超过90%"
          ]
        }
      ];
      
      // 构建实施阶段
      const implementation: ImplementationPhase[] = franchiseInfo.process.map((step, index) => ({
        phase: step.step,
        name: step.title,
        description: step.description,
        duration: "待定",
        tasks: [],
        milestones: index === franchiseInfo.process.length - 1 ? [{
          name: "正式开业",
          targetDate: "签约后60-90天",
          deliverables: ["装修完成", "设备安装", "人员到位", "营销准备"]
        }] : undefined
      }));
      
      // 构建资源需求
      const resources: ResourceRequirement[] = [
        {
          type: "financial",
          description: "初始投资资金",
          quantity: 1,
          cost: 150000, // Default average investment
          availability: "pending"
        },
        {
          type: "human",
          description: "运营管理团队",
          quantity: 5,
          availability: "pending"
        },
        {
          type: "facility",
          description: "经营场地",
          quantity: 300,
          availability: "pending"
        }
      ];
      
      // 构建成功指标
      const successMetrics: SuccessMetric[] = [
        {
          name: "月营业额",
          target: "10-30万元",
          measurement: "财务报表统计",
          frequency: "每月"
        },
        {
          name: "投资回报期",
          target: "1.5-2年内",
          measurement: "累计利润/初始投资",
          frequency: "每季度评估"
        },
        {
          name: "客户满意度",
          target: "90%以上",
          measurement: "客户调研问卷",
          frequency: "每月"
        }
      ];
      
      // 构建时间线
      const timeline: Timeline = {
        startDate: "签约日",
        endDate: "开业后12个月",
        keyDates: [
          {
            date: "签约当日",
            event: "缴纳加盟费和保证金",
            importance: "critical"
          },
          {
            date: "签约后7天",
            event: "选址确认",
            importance: "critical"
          },
          {
            date: "签约后30天",
            event: "装修开工",
            importance: "important"
          },
          {
            date: "签约后60天",
            event: "设备安装",
            importance: "important"
          },
          {
            date: "签约后75天",
            event: "人员培训",
            importance: "important"
          },
          {
            date: "签约后90天",
            event: "正式开业",
            importance: "critical"
          }
        ]
      };
      
      const strategicPlanContent: StrategicPlanContent = {
        overview: "耶氏体育加盟计划 - 共创台球事业新篇章",
        objectives,
        implementation,
        resources,
        successMetrics,
        timeline
      };
      
      return {
        protocol: DocumentProtocol.STRATEGIC_PLAN,
        metadata: {
          id: "franchise-plan-001",
          title: "耶氏体育加盟合作方案",
          description: "完整的加盟流程、投资分析和支持体系",
          author: "耶氏体育加盟部",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: new Date().toISOString(),
          version: "2.0.0",
          tags: ["加盟", "合作", "投资", "创业"],
          status: DocumentStatus.PUBLISHED,
          language: "zh-CN",
          accessLevel: AccessLevel.PUBLIC
        },
        content: strategicPlanContent,
        protocolVersion: "1.0"
      };
    } catch (error) {
      throw new Error(`Failed to get franchise info: ${error}`);
    }
  }
  
  /**
   * 获取培训信息
   * 返回结构化的培训课程信息
   */
  async getTrainingInfo(): Promise<ProtocolDocument<StructuredArticleContent>> {
    try {
      const trainingPrograms = mockTrainingPrograms;
      
      // 按类别分组培训课程
      const installationPrograms = trainingPrograms.filter(p => p.category === 'installation');
      const academyPrograms = trainingPrograms.filter(p => p.category === 'academy');
      
      // 构建文章段落
      const sections: ArticleSection[] = [
        {
          id: "intro",
          title: "耶氏台球培训体系",
          content: `耶氏体育拥有完整的台球培训体系，从专业技术培训到休闲爱好培养，
                   为不同需求的学员提供专业、系统的培训服务。年培训学员超过2000人次。`,
          level: 1
        },
        {
          id: "installation",
          title: "专业技术培训",
          content: "面向台球行业从业者的专业技能培训",
          level: 2,
          subsections: installationPrograms.map(program => ({
            id: program.id,
            title: program.title,
            content: `**培训时长**: ${program.duration}\n\n**培训费用**: ¥${program.price}\n\n**培训内容**: ${program.description}\n\n**课程模块**:\n${program.modules?.map((item, idx) => `${idx + 1}. ${item}`).join('\n') || '详细课程大纲请咨询'}`,
            level: 3,
            media: program.certification ? [{
              type: "image" as const,
              url: "/images/certificate.png",
              caption: "完成培训将获得专业认证证书",
              altText: "培训证书"
            }] : undefined
          }))
        },
        {
          id: "academy",
          title: "台球学院课程",
          content: "面向台球爱好者的技术提升课程",
          level: 2,
          subsections: academyPrograms.map(program => ({
            id: program.id,
            title: program.title,
            content: `**课程时长**: ${program.duration}\n\n**课程费用**: ¥${program.price}\n\n**课程介绍**: ${program.description}\n\n**适合人群**: ${program.level === 'beginner' ? '初学者' : program.level === 'intermediate' ? '有一定基础' : '专业人士'}`,
            level: 3,
            media: program.schedule ? [{
              type: "embed" as const,
              url: "#schedule",
              caption: `最近开课时间: ${program.schedule[0]?.date || '请咨询'}`,
              altText: "课程安排"
            }] : undefined
          }))
        },
        {
          id: "advantages",
          title: "培训优势",
          content: "选择耶氏培训的理由",
          level: 2,
          subsections: [
            {
              id: "adv-1",
              title: "专业师资",
              content: "拥有国家级教练员资质的专业团队，平均教龄超过10年",
              level: 3
            },
            {
              id: "adv-2",
              title: "实战教学",
              content: "理论与实践相结合，在真实的台球厅环境中学习",
              level: 3
            },
            {
              id: "adv-3",
              title: "就业保障",
              content: "优秀学员可直接进入耶氏体系工作，提供就业推荐",
              level: 3
            },
            {
              id: "adv-4",
              title: "持续支持",
              content: "毕业后提供持续的技术支持和进修机会",
              level: 3
            }
          ]
        },
        {
          id: "registration",
          title: "报名方式",
          content: `**报名热线**: 17787147147\n\n**报名地址**: 各耶氏门店均可报名\n\n**在线咨询**: 关注"耶氏台球"公众号了解更多`,
          level: 2
        }
      ];
      
      const structuredArticleContent: StructuredArticleContent = {
        abstract: "耶氏体育培训中心提供从入门到专业的全方位台球培训服务，包括技术培训和台球学院两大体系",
        sections
      };
      
      return {
        protocol: DocumentProtocol.STRUCTURED_ARTICLE,
        metadata: {
          id: "training-info-001",
          title: "耶氏台球培训中心",
          description: "专业台球培训课程体系介绍",
          author: "耶氏培训中心",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: new Date().toISOString(),
          version: "1.0.0",
          tags: ["培训", "课程", "教学", "技能提升"],
          status: DocumentStatus.PUBLISHED,
          language: "zh-CN",
          accessLevel: AccessLevel.PUBLIC
        },
        content: structuredArticleContent,
        protocolVersion: "1.0"
      };
    } catch (error) {
      throw new Error(`Failed to get training info: ${error}`);
    }
  }
  
  /**
   * 获取产品信息
   * 返回结构化的产品目录
   */
  async getProductsInfo(): Promise<ProtocolDocument<StructuredArticleContent>> {
    try {
      const products = mockProducts;
      
      // 按品牌分组产品
      const yesBrand = products.filter(p => p.brand === '耶氏');
      const gubangBrand = products.filter(p => p.brand === '古帮特');
      const xljBrand = products.filter(p => p.brand === '鑫隆基');
      const sttBrand = products.filter(p => p.brand === '申天堂');
      
      // 构建文章段落
      const sections: ArticleSection[] = [
        {
          id: "intro",
          title: "耶氏体育产品中心",
          content: `作为西南地区唯一的台球桌生产商，耶氏体育拥有完整的产品线，
                   涵盖台球桌、球杆、配件和维护用品四大类别，旗下拥有耶氏、古帮特、
                   鑫隆基、申天堂四大品牌，满足不同层次的市场需求。`,
          level: 1
        },
        {
          id: "yes-brand",
          title: "耶氏品牌 - 专业台球桌",
          content: "自主研发生产的高品质台球桌，广泛应用于专业比赛和高端俱乐部",
          level: 2,
          subsections: yesBrand.map(product => ({
            id: product.id,
            title: product.name,
            content: this.formatProductContent(product),
            level: 3,
            media: [{
              type: "image" as const,
              url: product.image || "/images/product-placeholder.jpg",
              caption: product.name,
              altText: product.name
            }]
          }))
        },
        {
          id: "gubang-brand",
          title: "古帮特品牌 - 专业球杆",
          content: "传承经典工艺，为专业选手和爱好者提供高品质球杆",
          level: 2,
          subsections: gubangBrand.map(product => ({
            id: product.id,
            title: product.name,
            content: this.formatProductContent(product),
            level: 3
          }))
        },
        {
          id: "xlj-brand",
          title: "鑫隆基品牌 - 台球配件",
          content: "全方位的台球配件供应，品质可靠，性价比高",
          level: 2,
          subsections: xljBrand.map(product => ({
            id: product.id,
            title: product.name,
            content: this.formatProductContent(product),
            level: 3
          }))
        },
        {
          id: "stt-brand",
          title: "申天堂品牌 - 维护用品",
          content: "专业的台球设备维护保养产品，延长设备使用寿命",
          level: 2,
          subsections: sttBrand.map(product => ({
            id: product.id,
            title: product.name,
            content: this.formatProductContent(product),
            level: 3
          }))
        },
        {
          id: "services",
          title: "产品服务",
          content: "我们不仅提供优质产品，更提供完善的售后服务",
          level: 2,
          subsections: [
            {
              id: "delivery",
              title: "配送安装",
              content: "提供专业的配送安装服务，确保产品完美呈现",
              level: 3
            },
            {
              id: "warranty",
              title: "质保服务",
              content: "所有产品享受正规质保，台球桌最高10年质保",
              level: 3
            },
            {
              id: "maintenance",
              title: "维护保养",
              content: "提供定期维护保养服务，保持设备最佳状态",
              level: 3
            },
            {
              id: "customization",
              title: "定制服务",
              content: "根据客户需求提供个性化定制服务",
              level: 3
            }
          ]
        }
      ];
      
      const structuredArticleContent: StructuredArticleContent = {
        abstract: "耶氏体育产品中心提供台球桌、球杆、配件、维护用品等全系列产品，四大品牌满足不同市场需求",
        sections
      };
      
      return {
        protocol: DocumentProtocol.STRUCTURED_ARTICLE,
        metadata: {
          id: "products-info-001",
          title: "耶氏体育产品中心",
          description: "台球设备及配件产品目录",
          author: "耶氏产品部",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: new Date().toISOString(),
          version: "1.0.0",
          tags: ["产品", "台球桌", "球杆", "配件", "设备"],
          status: DocumentStatus.PUBLISHED,
          language: "zh-CN",
          accessLevel: AccessLevel.PUBLIC
        },
        content: structuredArticleContent,
        protocolVersion: "1.0"
      };
    } catch (error) {
      throw new Error(`Failed to get products info: ${error}`);
    }
  }
  
  /**
   * 获取内容模块
   * 实现ContentDataService接口的方法
   */
  async getModule(type: ContentType): Promise<DataResponse<ContentModule>> {
    try {
      let module: ContentModule;
      
      switch (type) {
        case ContentType.ABOUT:
          const companyInfo = await this.getCompanyInfo();
          module = {
            type: ContentType.ABOUT,
            title: "关于我们",
            data: companyInfo,
            protocol: DocumentProtocol.EXECUTIVE_BRIEF,
            metadata: {
              lastUpdated: new Date().toISOString(),
              version: "1.0.0",
              cacheable: true,
              cacheDuration: 86400, // 24小时
              priority: 10
            }
          };
          break;
          
        case ContentType.FRANCHISE:
          const franchiseInfo = await this.getFranchiseInfo();
          module = {
            type: ContentType.FRANCHISE,
            title: "加盟合作",
            data: franchiseInfo,
            protocol: DocumentProtocol.STRATEGIC_PLAN,
            metadata: {
              lastUpdated: new Date().toISOString(),
              version: "2.0.0",
              cacheable: true,
              cacheDuration: 43200, // 12小时
              priority: 9
            }
          };
          break;
          
        case ContentType.TRAINING:
          const trainingInfo = await this.getTrainingInfo();
          module = {
            type: ContentType.TRAINING,
            title: "培训中心",
            data: trainingInfo,
            protocol: DocumentProtocol.STRUCTURED_ARTICLE,
            metadata: {
              lastUpdated: new Date().toISOString(),
              version: "1.0.0",
              cacheable: true,
              cacheDuration: 21600, // 6小时
              priority: 8
            }
          };
          break;
          
        case ContentType.PRODUCTS:
          const productsInfo = await this.getProductsInfo();
          module = {
            type: ContentType.PRODUCTS,
            title: "产品中心",
            data: productsInfo,
            protocol: DocumentProtocol.STRUCTURED_ARTICLE,
            metadata: {
              lastUpdated: new Date().toISOString(),
              version: "1.0.0",
              cacheable: true,
              cacheDuration: 10800, // 3小时
              priority: 7
            }
          };
          break;
          
        default:
          throw new Error(`Unsupported content type: ${type}`);
      }
      
      return {
        success: true,
        data: module,
        metadata: this.createMetadata()
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "CONTENT_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
          details: error,
          timestamp: Date.now()
        },
        metadata: this.createMetadata()
      };
    }
  }
  
  /**
   * 格式化产品内容
   * @param product 产品对象
   * @returns 格式化的Markdown内容
   */
  private formatProductContent(product: Product): string {
    const parts: string[] = [];
    
    // 价格信息
    if (product.price) {
      parts.push(`**价格**: ¥${product.price}`);
    }
    
    // 产品描述
    if (product.description) {
      parts.push(`\n**产品描述**: ${product.description}`);
    }
    
    // 产品规格
    if (product.specs) {
      parts.push(`\n**产品规格**: ${product.specs}`);
    }
    
    // 库存状态
    if (product.inStock !== undefined) {
      parts.push(`\n**库存状态**: ${product.inStock ? '有货' : '暂时缺货'}`);
    }
    
    return parts.join('\n');
  }
  
  /**
   * 翻译规格键名
   * @param key 英文键名
   * @returns 中文标签
   */
  private translateSpecKey(key: string): string {
    const translations: Record<string, string> = {
      size: "尺寸",
      material: "材质",
      slateThickness: "石板厚度",
      pocketType: "袋口类型",
      legStyle: "腿部样式",
      clothBrand: "台呢品牌",
      weight: "重量",
      length: "长度",
      tipDiameter: "杆头直径",
      jointType: "接口类型",
      wrapType: "握把类型",
      type: "类型",
      dimensions: "尺寸",
      compatibility: "兼容性",
      usage: "使用方法",
      volume: "容量",
      suitableFor: "适用范围"
    };
    
    return translations[key] || key;
  }
  
  /**
   * 创建响应元数据
   * @returns 元数据对象
   */
  private createMetadata(): ResponseMetadata {
    return {
      timestamp: Date.now(),
      version: "1.0.0",
      cached: false,
      processingTime: Math.floor(Math.random() * 50) + 30
    };
  }
}

/**
 * 内容服务单例
 */
export const contentService = new ContentService();