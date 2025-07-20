/**
 * 数据提供者接口定义
 * 定义Terminal B向Terminal A提供数据的标准接口
 * 基于Context Engineering的并行开发架构
 */

import {
  Store,
  FranchiseInfo,
  TrainingProgram,
  Product,
  CompanyInfo,
  UserContext,
  ContentRecommendation,
  SearchResult,
  ResponseMetadata,
  ErrorResponse
} from '../types/models';

import {
  ProtocolDocument,
  DocumentProtocol,
  DocumentQuery,
  DocumentQueryResult
} from '../protocols/ceProtocols';

/**
 * 坐标类型定义
 */
export type Coordinates = [longitude: number, latitude: number];

/**
 * 内容类型枚举
 */
export enum ContentType {
  ABOUT = 'about',
  FRANCHISE = 'franchise',
  TRAINING = 'training',
  PRODUCTS = 'products',
  STORES = 'stores',
  NEWS = 'news',
  FAQ = 'faq'
}

/**
 * 内容模块接口
 * 用于返回结构化的内容数据
 */
export interface ContentModule {
  /** 模块类型 */
  type: ContentType;
  
  /** 模块标题 */
  title: string;
  
  /** 模块数据 */
  data: any;
  
  /** 使用的CE协议 */
  protocol?: DocumentProtocol;
  
  /** 元数据 */
  metadata?: ContentModuleMetadata;
}

/**
 * 内容模块元数据
 */
export interface ContentModuleMetadata {
  /** 最后更新时间 */
  lastUpdated: string;
  
  /** 版本号 */
  version: string;
  
  /** 是否可缓存 */
  cacheable: boolean;
  
  /** 缓存时长（秒） */
  cacheDuration?: number;
  
  /** 优先级 */
  priority?: number;
}

/**
 * 主数据提供者接口
 * Terminal B向Terminal A提供的完整数据服务接口
 */
export interface DataProvider {
  /** 门店数据服务 */
  stores: StoreDataService;
  
  /** 内容数据服务 */
  content: ContentDataService;
  
  /** 产品数据服务 */
  products: ProductDataService;
  
  /** 培训数据服务 */
  training: TrainingDataService;
  
  /** 搜索服务 */
  search: SearchService;
  
  /** 推荐服务 */
  recommendations: RecommendationService;
  
  /** 文档服务 */
  documents: DocumentService;
}

/**
 * 门店数据服务接口
 */
export interface StoreDataService {
  /**
   * 获取所有门店
   * @returns 门店列表的Promise
   */
  getAll(): Promise<DataResponse<Store[]>>;
  
  /**
   * 根据ID获取单个门店
   * @param id 门店ID
   * @returns 门店信息的Promise
   */
  getById(id: number): Promise<DataResponse<Store>>;
  
  /**
   * 获取附近的门店
   * @param coords 用户坐标
   * @param options 查询选项
   * @returns 附近门店列表的Promise
   */
  getNearby(
    coords: Coordinates,
    options?: NearbyStoreOptions
  ): Promise<DataResponse<NearbyStoresResult>>;
  
  /**
   * 按区域获取门店
   * @param district 区域名称
   * @returns 该区域门店列表的Promise
   */
  getByDistrict(district: string): Promise<DataResponse<Store[]>>;
  
  /**
   * 获取所有区域列表
   * @returns 区域列表的Promise
   */
  getDistricts(): Promise<DataResponse<string[]>>;
  
  /**
   * 获取门店统计信息
   * @returns 统计信息的Promise
   */
  getStatistics(): Promise<DataResponse<StoreStatistics>>;
}

/**
 * 附近门店查询选项
 */
export interface NearbyStoreOptions {
  /** 最大返回数量 */
  limit?: number;
  
  /** 最大距离（公里） */
  maxDistance?: number;
  
  /** 是否包含距离信息 */
  includeDistance?: boolean;
  
  /** 是否按距离排序 */
  sortByDistance?: boolean;
}

/**
 * 附近门店查询结果
 */
export interface NearbyStoresResult {
  /** 门店列表（包含距离信息） */
  stores: (Store & { distance?: number })[];
  
  /** 用户位置 */
  userLocation: Coordinates;
  
  /** 查询时间 */
  timestamp: number;
}

/**
 * 门店统计信息
 */
export interface StoreStatistics {
  /** 总门店数 */
  totalStores: number;
  
  /** 按区域分布 */
  distributionByDistrict: Record<string, number>;
  
  /** 总台球桌数 */
  totalTables?: number;
  
  /** 月均总客流 */
  totalMonthlyVisitors?: number;
}

/**
 * 内容数据服务接口
 */
export interface ContentDataService {
  /**
   * 根据类型获取内容模块
   * @param type 内容类型
   * @param options 查询选项
   * @returns 内容模块的Promise
   */
  getModule(
    type: ContentType,
    options?: ContentOptions
  ): Promise<DataResponse<ContentModule>>;
  
  /**
   * 获取多个内容模块
   * @param types 内容类型数组
   * @returns 内容模块数组的Promise
   */
  getModules(types: ContentType[]): Promise<DataResponse<ContentModule[]>>;
  
  /**
   * 根据用户上下文获取推荐内容
   * @param context 用户上下文
   * @returns 推荐内容模块数组的Promise
   */
  getRecommendations(
    context: UserContext
  ): Promise<DataResponse<ContentModule[]>>;
  
  /**
   * 获取公司信息
   * @returns 公司信息的Promise
   */
  getCompanyInfo(): Promise<DataResponse<CompanyInfo>>;
  
  /**
   * 获取加盟信息
   * @returns 加盟信息的Promise
   */
  getFranchiseInfo(): Promise<DataResponse<FranchiseInfo>>;
}

/**
 * 内容查询选项
 */
export interface ContentOptions {
  /** 语言 */
  language?: string;
  
  /** 是否包含元数据 */
  includeMetadata?: boolean;
  
  /** 版本 */
  version?: string;
}

/**
 * 产品数据服务接口
 */
export interface ProductDataService {
  /**
   * 获取所有产品
   * @param filter 产品过滤器
   * @returns 产品列表的Promise
   */
  getAll(filter?: ProductFilter): Promise<DataResponse<Product[]>>;
  
  /**
   * 根据ID获取产品
   * @param id 产品ID
   * @returns 产品信息的Promise
   */
  getById(id: string): Promise<DataResponse<Product>>;
  
  /**
   * 按品牌获取产品
   * @param brand 品牌名称
   * @returns 该品牌产品列表的Promise
   */
  getByBrand(
    brand: '耶氏' | '古帮特' | '鑫隆基' | '申天堂'
  ): Promise<DataResponse<Product[]>>;
  
  /**
   * 按类别获取产品
   * @param category 产品类别
   * @returns 该类别产品列表的Promise
   */
  getByCategory(
    category: 'table' | 'cue' | 'accessory' | 'maintenance'
  ): Promise<DataResponse<Product[]>>;
  
  /**
   * 获取产品分类树
   * @returns 分类树的Promise
   */
  getCategoryTree(): Promise<DataResponse<CategoryTree>>;
}

/**
 * 产品过滤器
 */
export interface ProductFilter {
  /** 品牌过滤 */
  brands?: Array<'耶氏' | '古帮特' | '鑫隆基' | '申天堂'>;
  
  /** 类别过滤 */
  categories?: Array<'table' | 'cue' | 'accessory' | 'maintenance'>;
  
  /** 价格范围 */
  priceRange?: {
    min?: number;
    max?: number;
  };
  
  /** 是否有货 */
  inStock?: boolean;
  
  /** 排序字段 */
  sortBy?: 'name' | 'price' | 'brand' | 'category';
  
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
  
  /** 分页 */
  pagination?: {
    page: number;
    pageSize: number;
  };
}

/**
 * 产品分类树
 */
export interface CategoryTree {
  /** 分类节点 */
  categories: CategoryNode[];
}

/**
 * 分类节点
 */
export interface CategoryNode {
  /** 分类ID */
  id: string;
  
  /** 分类名称 */
  name: string;
  
  /** 分类类型 */
  type: 'brand' | 'category' | 'subcategory';
  
  /** 产品数量 */
  productCount: number;
  
  /** 子分类 */
  children?: CategoryNode[];
}

/**
 * 培训数据服务接口
 */
export interface TrainingDataService {
  /**
   * 获取所有培训项目
   * @param filter 培训过滤器
   * @returns 培训项目列表的Promise
   */
  getAll(filter?: TrainingFilter): Promise<DataResponse<TrainingProgram[]>>;
  
  /**
   * 根据ID获取培训项目
   * @param id 培训项目ID
   * @returns 培训项目信息的Promise
   */
  getById(id: string): Promise<DataResponse<TrainingProgram>>;
  
  /**
   * 按类别获取培训项目
   * @param category 培训类别
   * @returns 该类别培训项目列表的Promise
   */
  getByCategory(
    category: 'installation' | 'academy'
  ): Promise<DataResponse<TrainingProgram[]>>;
  
  /**
   * 获取培训日程
   * @param options 日程查询选项
   * @returns 培训日程的Promise
   */
  getSchedule(
    options?: ScheduleOptions
  ): Promise<DataResponse<TrainingScheduleResult>>;
}

/**
 * 培训过滤器
 */
export interface TrainingFilter {
  /** 类别过滤 */
  categories?: Array<'installation' | 'academy'>;
  
  /** 级别过滤 */
  levels?: Array<'beginner' | 'intermediate' | 'advanced'>;
  
  /** 价格范围 */
  priceRange?: {
    min?: number;
    max?: number;
  };
  
  /** 是否有证书 */
  hasCertification?: boolean;
}

/**
 * 日程查询选项
 */
export interface ScheduleOptions {
  /** 开始日期 */
  startDate?: string;
  
  /** 结束日期 */
  endDate?: string;
  
  /** 培训类别 */
  category?: 'installation' | 'academy';
  
  /** 地点 */
  location?: string;
}

/**
 * 培训日程查询结果
 */
export interface TrainingScheduleResult {
  /** 日程列表 */
  schedules: Array<{
    program: TrainingProgram;
    sessions: Array<{
      date: string;
      time: string;
      location: string;
      availableSeats: number;
    }>;
  }>;
  
  /** 查询时间范围 */
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * 搜索服务接口
 */
export interface SearchService {
  /**
   * 搜索门店
   * @param query 搜索查询
   * @returns 门店搜索结果的Promise
   */
  searchStores(query: string): Promise<DataResponse<Store[]>>;
  
  /**
   * 搜索产品
   * @param query 搜索查询
   * @returns 产品搜索结果的Promise
   */
  searchProducts(query: string): Promise<DataResponse<Product[]>>;
  
  /**
   * 搜索内容
   * @param query 搜索查询
   * @returns 内容搜索结果的Promise
   */
  searchContent(query: string): Promise<DataResponse<SearchResult[]>>;
  
  /**
   * 全局搜索
   * @param query 搜索查询
   * @param options 搜索选项
   * @returns 全局搜索结果的Promise
   */
  searchGlobal(
    query: string,
    options?: GlobalSearchOptions
  ): Promise<DataResponse<GlobalSearchResult>>;
}

/**
 * 全局搜索选项
 */
export interface GlobalSearchOptions {
  /** 搜索范围 */
  scopes?: Array<'stores' | 'products' | 'content' | 'training'>;
  
  /** 每个范围的最大结果数 */
  limitPerScope?: number;
  
  /** 是否包含高亮 */
  includeHighlights?: boolean;
}

/**
 * 全局搜索结果
 */
export interface GlobalSearchResult {
  /** 搜索查询 */
  query: string;
  
  /** 各类结果 */
  results: {
    stores?: Store[];
    products?: Product[];
    content?: SearchResult[];
    training?: TrainingProgram[];
  };
  
  /** 总结果数 */
  totalResults: number;
  
  /** 搜索建议 */
  suggestions?: string[];
}

/**
 * 推荐服务接口
 */
export interface RecommendationService {
  /**
   * 获取内容推荐
   * @param context 用户上下文
   * @returns 内容推荐列表的Promise
   */
  getContentRecommendations(
    context: UserContext
  ): Promise<DataResponse<ContentRecommendation[]>>;
  
  /**
   * 获取产品推荐
   * @param context 用户上下文
   * @returns 产品推荐列表的Promise
   */
  getProductRecommendations(
    context: UserContext
  ): Promise<DataResponse<Product[]>>;
  
  /**
   * 获取门店推荐
   * @param context 用户上下文
   * @returns 门店推荐列表的Promise
   */
  getStoreRecommendations(
    context: UserContext
  ): Promise<DataResponse<Store[]>>;
  
  /**
   * 获取个性化首页布局
   * @param context 用户上下文
   * @returns 首页布局配置的Promise
   */
  getPersonalizedLayout(
    context: UserContext
  ): Promise<DataResponse<PersonalizedLayout>>;
}

/**
 * 个性化布局配置
 */
export interface PersonalizedLayout {
  /** 布局版本 */
  version: string;
  
  /** 英雄区配置 */
  hero?: {
    type: ContentType;
    data: any;
  };
  
  /** 主要内容区块 */
  mainSections: Array<{
    id: string;
    type: ContentType;
    priority: number;
    data: any;
  }>;
  
  /** 侧边栏配置 */
  sidebar?: Array<{
    id: string;
    type: ContentType;
    data: any;
  }>;
}

/**
 * 文档服务接口
 * 基于CE协议的文档管理服务
 */
export interface DocumentService {
  /**
   * 查询文档
   * @param query 文档查询条件
   * @returns 文档查询结果的Promise
   */
  query(query: DocumentQuery): Promise<DataResponse<DocumentQueryResult>>;
  
  /**
   * 根据ID获取文档
   * @param id 文档ID
   * @returns 协议文档的Promise
   */
  getById(id: string): Promise<DataResponse<ProtocolDocument>>;
  
  /**
   * 根据协议类型获取文档
   * @param protocol 协议类型
   * @returns 文档列表的Promise
   */
  getByProtocol(
    protocol: DocumentProtocol
  ): Promise<DataResponse<ProtocolDocument[]>>;
  
  /**
   * 渲染文档为HTML
   * @param id 文档ID
   * @returns 渲染后的HTML字符串的Promise
   */
  renderDocument(id: string): Promise<DataResponse<string>>;
}

/**
 * 标准数据响应包装器
 * 所有数据服务方法都应返回此格式
 */
export interface DataResponse<T> {
  /** 响应状态 */
  success: boolean;
  
  /** 响应数据 */
  data?: T;
  
  /** 错误信息（当success为false时） */
  error?: ErrorResponse;
  
  /** 响应元数据 */
  metadata: ResponseMetadata;
}

/**
 * 数据提供者工厂接口
 * 用于创建和配置数据提供者实例
 */
export interface DataProviderFactory {
  /**
   * 创建数据提供者实例
   * @param config 配置选项
   * @returns 数据提供者实例
   */
  create(config?: DataProviderConfig): DataProvider;
}

/**
 * 数据提供者配置
 */
export interface DataProviderConfig {
  /** API基础URL（用于未来迁移到真实API） */
  apiBaseUrl?: string;
  
  /** 是否使用Mock数据 */
  useMockData?: boolean;
  
  /** 缓存配置 */
  cache?: {
    enabled: boolean;
    ttl?: number;
  };
  
  /** 重试配置 */
  retry?: {
    maxAttempts: number;
    delay: number;
  };
  
  /** 超时设置（毫秒） */
  timeout?: number;
}

/**
 * 数据同步接口
 * 用于Terminal A和B之间的数据同步
 */
export interface DataSyncInterface {
  /**
   * 注册数据变更监听器
   * @param event 事件类型
   * @param handler 处理函数
   */
  onDataChange(
    event: DataChangeEvent,
    handler: DataChangeHandler
  ): void;
  
  /**
   * 通知数据变更
   * @param change 变更信息
   */
  notifyChange(change: DataChangeNotification): void;
}

/**
 * 数据变更事件类型
 */
export enum DataChangeEvent {
  STORE_UPDATED = 'store_updated',
  PRODUCT_UPDATED = 'product_updated',
  CONTENT_UPDATED = 'content_updated',
  TRAINING_UPDATED = 'training_updated'
}

/**
 * 数据变更处理函数
 */
export type DataChangeHandler = (
  notification: DataChangeNotification
) => void;

/**
 * 数据变更通知
 */
export interface DataChangeNotification {
  /** 事件类型 */
  event: DataChangeEvent;
  
  /** 变更的实体类型 */
  entityType: string;
  
  /** 变更的实体ID */
  entityId: string;
  
  /** 变更类型 */
  changeType: 'create' | 'update' | 'delete';
  
  /** 变更数据 */
  data?: any;
  
  /** 时间戳 */
  timestamp: number;
}

// Re-export types from models
export type {
  Store,
  FranchiseInfo,
  TrainingProgram,
  Product,
  CompanyInfo,
  UserContext,
  ContentRecommendation,
  SearchResult,
  ResponseMetadata,
  ErrorResponse
} from '../types/models';

// Re-export protocol types
export type {
  ProtocolDocument,
  DocumentQuery,
  DocumentQueryResult
} from '../protocols/ceProtocols';