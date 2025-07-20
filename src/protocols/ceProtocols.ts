/**
 * Context Engineering (CE) 文档协议定义
 * 用于标准化内容管理和文档结构
 * 支持多种文档类型的统一处理
 */

/**
 * CE文档协议类型枚举
 * 定义了系统支持的所有文档协议类型
 */
export enum DocumentProtocol {
  /** 执行简报协议 - 用于高层概览信息 */
  EXECUTIVE_BRIEF = "executive_brief",
  
  /** 战略计划协议 - 用于详细的规划和方案 */
  STRATEGIC_PLAN = "strategic_plan",
  
  /** 技术文档协议 - 用于技术规格和实现细节 */
  TECHNICAL_DOC = "technical_documentation",
  
  /** 结构化文章协议 - 用于通用内容展示 */
  STRUCTURED_ARTICLE = "structured_article",
  
  /** 数据报告协议 - 用于数据分析和统计展示 */
  DATA_REPORT = "data_report",
  
  /** 用户指南协议 - 用于操作说明和培训材料 */
  USER_GUIDE = "user_guide"
}

/**
 * 文档元数据接口
 * 包含所有文档的通用元信息
 */
export interface DocumentMetadata {
  /** 文档唯一标识符 */
  id: string;
  
  /** 文档标题 */
  title: string;
  
  /** 文档描述 */
  description?: string;
  
  /** 文档作者 */
  author: string;
  
  /** 创建时间 */
  createdAt: string;
  
  /** 最后更新时间 */
  updatedAt: string;
  
  /** 文档版本 */
  version: string;
  
  /** 文档标签 */
  tags?: string[];
  
  /** 文档状态 */
  status: DocumentStatus;
  
  /** 文档语言 */
  language: string;
  
  /** 访问权限 */
  accessLevel: AccessLevel;
  
  /** 相关文档ID列表 */
  relatedDocuments?: string[];
  
  /** 自定义元数据 */
  customMetadata?: Record<string, any>;
}

/**
 * 文档状态枚举
 */
export enum DocumentStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
  DEPRECATED = "deprecated"
}

/**
 * 访问级别枚举
 */
export enum AccessLevel {
  PUBLIC = "public",
  INTERNAL = "internal",
  RESTRICTED = "restricted",
  CONFIDENTIAL = "confidential"
}

/**
 * 基础协议文档接口
 * 所有协议文档的通用结构
 */
export interface ProtocolDocument<T = any> {
  /** 使用的协议类型 */
  protocol: DocumentProtocol;
  
  /** 文档元数据 */
  metadata: DocumentMetadata;
  
  /** 文档内容（根据协议类型而定） */
  content: T;
  
  /** 协议版本 */
  protocolVersion: string;
  
  /** 渲染配置 */
  renderConfig?: RenderConfig;
}

/**
 * 渲染配置接口
 * 控制文档在前端的展示方式
 */
export interface RenderConfig {
  /** 布局类型 */
  layout?: 'default' | 'wide' | 'narrow' | 'fullscreen';
  
  /** 是否显示目录 */
  showTableOfContents?: boolean;
  
  /** 是否显示元数据 */
  showMetadata?: boolean;
  
  /** 自定义样式类名 */
  customClasses?: string[];
  
  /** 启用的功能 */
  features?: DocumentFeature[];
}

/**
 * 文档功能枚举
 */
export enum DocumentFeature {
  PRINT = "print",
  SHARE = "share",
  DOWNLOAD = "download",
  COMMENT = "comment",
  BOOKMARK = "bookmark",
  SEARCH = "search"
}

/**
 * 执行简报内容结构
 * 用于公司介绍等高层概览信息
 */
export interface ExecutiveBriefContent {
  /** 核心摘要 */
  summary: string;
  
  /** 关键要点列表 */
  keyPoints: KeyPoint[];
  
  /** 详细内容段落 */
  sections?: BriefSection[];
  
  /** 统计数据 */
  statistics?: Statistic[];
  
  /** 行动呼吁 */
  callToAction?: CallToAction;
}

/**
 * 关键要点
 */
export interface KeyPoint {
  /** 要点标题 */
  title: string;
  
  /** 要点描述 */
  description?: string;
  
  /** 图标 */
  icon?: string;
  
  /** 优先级 */
  priority?: number;
}

/**
 * 简报段落
 */
export interface BriefSection {
  /** 段落标题 */
  title: string;
  
  /** 段落内容 */
  content: string;
  
  /** 子段落 */
  subsections?: BriefSection[];
}

/**
 * 统计数据
 */
export interface Statistic {
  /** 数据标签 */
  label: string;
  
  /** 数据值 */
  value: string | number;
  
  /** 单位 */
  unit?: string;
  
  /** 变化趋势 */
  trend?: 'up' | 'down' | 'stable';
  
  /** 变化百分比 */
  changePercentage?: number;
}

/**
 * 行动呼吁
 */
export interface CallToAction {
  /** 主要文本 */
  text: string;
  
  /** 按钮文本 */
  buttonText?: string;
  
  /** 链接地址 */
  link?: string;
  
  /** 样式类型 */
  style?: 'primary' | 'secondary' | 'outline';
}

/**
 * 战略计划内容结构
 * 用于加盟方案等详细规划
 */
export interface StrategicPlanContent {
  /** 计划概览 */
  overview: string;
  
  /** 目标列表 */
  objectives: Objective[];
  
  /** 实施步骤 */
  implementation: ImplementationPhase[];
  
  /** 资源需求 */
  resources?: ResourceRequirement[];
  
  /** 风险评估 */
  risks?: RiskAssessment[];
  
  /** 成功指标 */
  successMetrics?: SuccessMetric[];
  
  /** 时间线 */
  timeline?: Timeline;
}

/**
 * 目标定义
 */
export interface Objective {
  /** 目标ID */
  id: string;
  
  /** 目标标题 */
  title: string;
  
  /** 目标描述 */
  description: string;
  
  /** 优先级 */
  priority: 'high' | 'medium' | 'low';
  
  /** 关键结果 */
  keyResults?: string[];
}

/**
 * 实施阶段
 */
export interface ImplementationPhase {
  /** 阶段编号 */
  phase: number;
  
  /** 阶段名称 */
  name: string;
  
  /** 阶段描述 */
  description: string;
  
  /** 持续时间 */
  duration: string;
  
  /** 任务列表 */
  tasks: Task[];
  
  /** 里程碑 */
  milestones?: Milestone[];
}

/**
 * 任务定义
 */
export interface Task {
  /** 任务ID */
  id: string;
  
  /** 任务名称 */
  name: string;
  
  /** 负责人 */
  assignee?: string;
  
  /** 截止日期 */
  deadline?: string;
  
  /** 依赖任务 */
  dependencies?: string[];
}

/**
 * 里程碑
 */
export interface Milestone {
  /** 里程碑名称 */
  name: string;
  
  /** 目标日期 */
  targetDate: string;
  
  /** 可交付成果 */
  deliverables?: string[];
}

/**
 * 资源需求
 */
export interface ResourceRequirement {
  /** 资源类型 */
  type: 'human' | 'financial' | 'equipment' | 'facility';
  
  /** 资源描述 */
  description: string;
  
  /** 数量 */
  quantity?: number;
  
  /** 成本 */
  cost?: number;
  
  /** 可用性 */
  availability?: 'available' | 'pending' | 'unavailable';
}

/**
 * 风险评估
 */
export interface RiskAssessment {
  /** 风险ID */
  id: string;
  
  /** 风险描述 */
  description: string;
  
  /** 可能性 */
  likelihood: 'high' | 'medium' | 'low';
  
  /** 影响程度 */
  impact: 'high' | 'medium' | 'low';
  
  /** 缓解措施 */
  mitigation?: string[];
}

/**
 * 成功指标
 */
export interface SuccessMetric {
  /** 指标名称 */
  name: string;
  
  /** 目标值 */
  target: string | number;
  
  /** 测量方法 */
  measurement: string;
  
  /** 评估频率 */
  frequency?: string;
}

/**
 * 时间线
 */
export interface Timeline {
  /** 开始日期 */
  startDate: string;
  
  /** 结束日期 */
  endDate: string;
  
  /** 关键日期 */
  keyDates?: KeyDate[];
}

/**
 * 关键日期
 */
export interface KeyDate {
  /** 日期 */
  date: string;
  
  /** 事件描述 */
  event: string;
  
  /** 重要性 */
  importance: 'critical' | 'important' | 'normal';
}

/**
 * 结构化文章内容
 * 用于通用内容展示
 */
export interface StructuredArticleContent {
  /** 文章摘要 */
  abstract?: string;
  
  /** 文章段落 */
  sections: ArticleSection[];
  
  /** 引用列表 */
  references?: Reference[];
  
  /** 附录 */
  appendices?: Appendix[];
}

/**
 * 文章段落
 */
export interface ArticleSection {
  /** 段落ID */
  id: string;
  
  /** 段落标题 */
  title: string;
  
  /** 段落内容（支持Markdown） */
  content: string;
  
  /** 段落级别 */
  level: number;
  
  /** 子段落 */
  subsections?: ArticleSection[];
  
  /** 媒体内容 */
  media?: MediaContent[];
}

/**
 * 媒体内容
 */
export interface MediaContent {
  /** 媒体类型 */
  type: 'image' | 'video' | 'audio' | 'embed';
  
  /** 媒体URL */
  url: string;
  
  /** 标题 */
  caption?: string;
  
  /** 替代文本 */
  altText?: string;
  
  /** 尺寸配置 */
  dimensions?: {
    width?: number;
    height?: number;
  };
}

/**
 * 引用
 */
export interface Reference {
  /** 引用ID */
  id: string;
  
  /** 引用文本 */
  text: string;
  
  /** 引用链接 */
  url?: string;
  
  /** 引用类型 */
  type?: 'book' | 'article' | 'website' | 'other';
}

/**
 * 附录
 */
export interface Appendix {
  /** 附录标题 */
  title: string;
  
  /** 附录内容 */
  content: string;
  
  /** 附录类型 */
  type?: 'text' | 'table' | 'code' | 'data';
}

/**
 * CE文档处理器接口
 * 定义文档处理的标准方法
 */
export interface DocumentProcessor {
  /** 解析文档 */
  parse(raw: string): ProtocolDocument;
  
  /** 验证文档 */
  validate(doc: ProtocolDocument): ValidationResult;
  
  /** 转换文档格式 */
  transform(doc: ProtocolDocument, targetFormat: string): any;
  
  /** 渲染文档 */
  render(doc: ProtocolDocument): string;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  isValid: boolean;
  
  /** 错误列表 */
  errors?: ValidationError[];
  
  /** 警告列表 */
  warnings?: ValidationWarning[];
}

/**
 * 验证错误
 */
export interface ValidationError {
  /** 错误代码 */
  code: string;
  
  /** 错误消息 */
  message: string;
  
  /** 错误路径 */
  path?: string;
}

/**
 * 验证警告
 */
export interface ValidationWarning {
  /** 警告代码 */
  code: string;
  
  /** 警告消息 */
  message: string;
  
  /** 建议 */
  suggestion?: string;
}

/**
 * 文档查询接口
 * 用于搜索和过滤文档
 */
export interface DocumentQuery {
  /** 协议类型过滤 */
  protocols?: DocumentProtocol[];
  
  /** 状态过滤 */
  statuses?: DocumentStatus[];
  
  /** 标签过滤 */
  tags?: string[];
  
  /** 全文搜索 */
  searchText?: string;
  
  /** 日期范围 */
  dateRange?: {
    start?: string;
    end?: string;
  };
  
  /** 排序字段 */
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'relevance';
  
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
  
  /** 分页 */
  pagination?: {
    page: number;
    pageSize: number;
  };
}

/**
 * 文档查询结果
 */
export interface DocumentQueryResult {
  /** 文档列表 */
  documents: ProtocolDocument[];
  
  /** 总数 */
  total: number;
  
  /** 当前页 */
  page: number;
  
  /** 每页大小 */
  pageSize: number;
  
  /** 总页数 */
  totalPages: number;
  
  /** 查询元数据 */
  queryMetadata?: {
    executionTime: number;
    matchedFields?: string[];
  };
}