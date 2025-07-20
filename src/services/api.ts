/**
 * 统一API服务层
 * 整合所有服务，为Terminal A提供统一的接口
 */

import { 
  DataProvider,
  StoreDataService,
  ContentDataService,
  ProductDataService,
  TrainingDataService,
  SearchService,
  RecommendationService as IRecommendationService,
  DocumentService,
  Coordinates,
  ContentType,
  ContentOptions,
  ProductFilter,
  TrainingFilter,
  ScheduleOptions,
  GlobalSearchOptions,
  DocumentQuery,
  DataResponse,
  Store,
  NearbyStoresResult,
  StoreStatistics,
  ContentModule,
  Product,
  TrainingProgram,
  TrainingScheduleResult,
  SearchResult,
  GlobalSearchResult,
  ContentRecommendation,
  PersonalizedLayout,
  DocumentQueryResult,
  ProtocolDocument
} from '../interfaces/dataProvider';

import { 
  CompanyInfo,
  FranchiseInfo,
  UserContext 
} from '../types/models';

import { StoreService } from './storeService';
import { ContentService } from './contentService';
import { RecommendationService, ExtendedUserContext } from './recommendationService';
import { mockAPI, API_DELAYS } from './mockApi';
import { 
  mockProducts, 
  mockTrainingPrograms, 
  mockCompanyInfo, 
  mockFranchiseInfo,
  getFAQs,
  getNews
} from '../data/mockData';

/**
 * 产品服务实现
 */
class ProductService implements ProductDataService {
  private products = mockProducts;
  
  async getAll(filter?: ProductFilter): Promise<DataResponse<Product[]>> {
    try {
      let filteredProducts = [...this.products];
      
      // 应用过滤器
      if (filter) {
        if (filter.brands && filter.brands.length > 0) {
          filteredProducts = filteredProducts.filter(p => 
            filter.brands!.includes(p.brand)
          );
        }
        
        if (filter.categories && filter.categories.length > 0) {
          filteredProducts = filteredProducts.filter(p => 
            filter.categories!.includes(p.category)
          );
        }
        
        if (filter.priceRange) {
          filteredProducts = filteredProducts.filter(p => {
            const price = p.price || 0;
            const min = filter.priceRange!.min || 0;
            const max = filter.priceRange!.max || Infinity;
            return price >= min && price <= max;
          });
        }
        
        if (filter.inStock !== undefined) {
          filteredProducts = filteredProducts.filter(p => 
            p.inStock === filter.inStock
          );
        }
        
        // 排序
        if (filter.sortBy) {
          filteredProducts.sort((a, b) => {
            const order = filter.sortOrder === 'desc' ? -1 : 1;
            switch (filter.sortBy) {
              case 'name':
                return order * a.name.localeCompare(b.name);
              case 'price':
                return order * ((a.price || 0) - (b.price || 0));
              case 'brand':
                return order * a.brand.localeCompare(b.brand);
              case 'category':
                return order * a.category.localeCompare(b.category);
              default:
                return 0;
            }
          });
        }
        
        // 分页
        if (filter.pagination) {
          const { page, pageSize } = filter.pagination;
          const start = (page - 1) * pageSize;
          filteredProducts = filteredProducts.slice(start, start + pageSize);
        }
      }
      
      return {
        success: true,
        data: filteredProducts,
        metadata: {
          timestamp: Date.now(),
          version: "1.0.0",
          cached: false,
          processingTime: 50
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "PRODUCT_ERROR",
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
  
  async getById(id: string): Promise<DataResponse<Product>> {
    const product = this.products.find(p => p.id === id);
    
    if (!product) {
      return {
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: `Product with id ${id} not found`,
          timestamp: Date.now()
        },
        metadata: {
          timestamp: Date.now(),
          version: "1.0.0",
          cached: false,
          processingTime: 30
        }
      };
    }
    
    return {
      success: true,
      data: product,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 30
      }
    };
  }
  
  async getByBrand(brand: '耶氏' | '古帮特' | '鑫隆基' | '申天堂'): Promise<DataResponse<Product[]>> {
    const products = this.products.filter(p => p.brand === brand);
    
    return {
      success: true,
      data: products,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 40
      }
    };
  }
  
  async getByCategory(category: 'table' | 'cue' | 'accessory' | 'maintenance'): Promise<DataResponse<Product[]>> {
    const products = this.products.filter(p => p.category === category);
    
    return {
      success: true,
      data: products,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 40
      }
    };
  }
  
  async getCategoryTree(): Promise<DataResponse<any>> {
    const tree = {
      categories: [
        {
          id: "brand-yes",
          name: "耶氏",
          type: "brand" as const,
          productCount: this.products.filter(p => p.brand === '耶氏').length,
          children: [
            {
              id: "yes-table",
              name: "台球桌",
              type: "subcategory" as const,
              productCount: this.products.filter(p => p.brand === '耶氏' && p.category === 'table').length
            }
          ]
        },
        {
          id: "brand-gubang",
          name: "古帮特",
          type: "brand" as const,
          productCount: this.products.filter(p => p.brand === '古帮特').length,
          children: [
            {
              id: "gubang-cue",
              name: "球杆",
              type: "subcategory" as const,
              productCount: this.products.filter(p => p.brand === '古帮特' && p.category === 'cue').length
            }
          ]
        }
      ]
    };
    
    return {
      success: true,
      data: tree,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: true,
        processingTime: 20
      }
    };
  }
}

/**
 * 培训服务实现
 */
class TrainingService implements TrainingDataService {
  private programs = mockTrainingPrograms;
  
  async getAll(filter?: TrainingFilter): Promise<DataResponse<TrainingProgram[]>> {
    let filteredPrograms = [...this.programs];
    
    if (filter) {
      if (filter.categories && filter.categories.length > 0) {
        filteredPrograms = filteredPrograms.filter(p => 
          filter.categories!.includes(p.category)
        );
      }
      
      if (filter.levels && filter.levels.length > 0) {
        filteredPrograms = filteredPrograms.filter(p => 
          filter.levels!.includes(p.level)
        );
      }
      
      if (filter.priceRange) {
        filteredPrograms = filteredPrograms.filter(p => {
          const min = filter.priceRange!.min || 0;
          const max = filter.priceRange!.max || Infinity;
          return p.price >= min && p.price <= max;
        });
      }
      
      if (filter.hasCertification !== undefined) {
        filteredPrograms = filteredPrograms.filter(p => 
          p.certification === filter.hasCertification
        );
      }
    }
    
    return {
      success: true,
      data: filteredPrograms,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 40
      }
    };
  }
  
  async getById(id: string): Promise<DataResponse<TrainingProgram>> {
    const program = this.programs.find(p => p.id === id);
    
    if (!program) {
      return {
        success: false,
        error: {
          code: "TRAINING_NOT_FOUND",
          message: `Training program with id ${id} not found`,
          timestamp: Date.now()
        },
        metadata: {
          timestamp: Date.now(),
          version: "1.0.0",
          cached: false,
          processingTime: 30
        }
      };
    }
    
    return {
      success: true,
      data: program,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 30
      }
    };
  }
  
  async getByCategory(category: 'installation' | 'academy'): Promise<DataResponse<TrainingProgram[]>> {
    const programs = this.programs.filter(p => p.category === category);
    
    return {
      success: true,
      data: programs,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 35
      }
    };
  }
  
  async getSchedule(options?: ScheduleOptions): Promise<DataResponse<TrainingScheduleResult>> {
    let programs = [...this.programs];
    
    if (options?.category) {
      programs = programs.filter(p => p.category === options.category);
    }
    
    const schedules = programs
      .filter(p => p.schedule && p.schedule.length > 0)
      .map(program => ({
        program,
        sessions: program.schedule!
          .filter(session => {
            if (options?.startDate && new Date(session.date) < new Date(options.startDate)) {
              return false;
            }
            if (options?.endDate && new Date(session.date) > new Date(options.endDate)) {
              return false;
            }
            if (options?.location && !session.location.includes(options.location)) {
              return false;
            }
            return true;
          })
          .map(session => ({
            ...session,
            availableSeats: 20 // Default available seats
          }))
      }))
      .filter(item => item.sessions.length > 0);
    
    return {
      success: true,
      data: {
        schedules,
        dateRange: {
          start: options?.startDate || new Date().toISOString(),
          end: options?.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 60
      }
    };
  }
}

/**
 * 搜索服务实现
 */
class SearchServiceImpl implements SearchService {
  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private trainingService: TrainingService
  ) {}
  
  async searchStores(query: string): Promise<DataResponse<Store[]>> {
    const stores = await this.storeService.searchStores(query);
    
    return {
      success: true,
      data: stores,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 80
      }
    };
  }
  
  async searchProducts(query: string): Promise<DataResponse<Product[]>> {
    const allProductsResponse = await this.productService.getAll();
    
    if (!allProductsResponse.success || !allProductsResponse.data) {
      return allProductsResponse;
    }
    
    const lowerQuery = query.toLowerCase();
    const products = allProductsResponse.data.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
    );
    
    return {
      success: true,
      data: products,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 90
      }
    };
  }
  
  async searchContent(query: string): Promise<DataResponse<SearchResult[]>> {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    
    // 搜索FAQ
    const faqs = getFAQs();
    faqs.forEach(faq => {
      if (faq.question.toLowerCase().includes(lowerQuery) || 
          faq.answer.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: faq.id,
          type: 'faq',
          title: faq.question,
          description: faq.answer.substring(0, 150) + '...',
          url: `/faq#${faq.id}`,
          relevanceScore: 0.8,
          highlights: [faq.answer.substring(0, 100)]
        });
      }
    });
    
    // 搜索新闻
    const news = getNews();
    news.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery) || 
          item.summary.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: item.id,
          type: 'content',
          title: item.title,
          description: item.summary,
          url: `/news/${item.id}`,
          relevanceScore: 0.7,
          metadata: { date: item.date, category: item.category }
        });
      }
    });
    
    return {
      success: true,
      data: results,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 100
      }
    };
  }
  
  async searchGlobal(query: string, options?: GlobalSearchOptions): Promise<DataResponse<GlobalSearchResult>> {
    const scopes = options?.scopes || ['stores', 'products', 'content', 'training'];
    const limitPerScope = options?.limitPerScope || 5;
    const result: GlobalSearchResult = {
      query,
      results: {},
      totalResults: 0,
      suggestions: []
    };
    
    // 并行搜索各个范围
    const searchPromises: Promise<void>[] = [];
    
    if (scopes.includes('stores')) {
      searchPromises.push(
        this.searchStores(query).then(res => {
          if (res.success && res.data) {
            result.results.stores = res.data.slice(0, limitPerScope);
            result.totalResults += res.data.length;
          }
        })
      );
    }
    
    if (scopes.includes('products')) {
      searchPromises.push(
        this.searchProducts(query).then(res => {
          if (res.success && res.data) {
            result.results.products = res.data.slice(0, limitPerScope);
            result.totalResults += res.data.length;
          }
        })
      );
    }
    
    if (scopes.includes('content')) {
      searchPromises.push(
        this.searchContent(query).then(res => {
          if (res.success && res.data) {
            result.results.content = res.data.slice(0, limitPerScope);
            result.totalResults += res.data.length;
          }
        })
      );
    }
    
    if (scopes.includes('training')) {
      searchPromises.push(
        this.trainingService.getAll().then(res => {
          if (res.success && res.data) {
            const lowerQuery = query.toLowerCase();
            const filtered = res.data.filter(p => 
              p.title.toLowerCase().includes(lowerQuery) ||
              p.description.toLowerCase().includes(lowerQuery)
            );
            result.results.training = filtered.slice(0, limitPerScope);
            result.totalResults += filtered.length;
          }
        })
      );
    }
    
    await Promise.all(searchPromises);
    
    // 生成搜索建议
    if (result.totalResults === 0) {
      result.suggestions = [
        "台球桌",
        "加盟",
        "培训",
        "门店"
      ];
    }
    
    return {
      success: true,
      data: result,
      metadata: {
        timestamp: Date.now(),
        version: "1.0.0",
        cached: false,
        processingTime: 150
      }
    };
  }
}

/**
 * 统一API类
 * 整合所有服务提供统一接口
 */
export class API {
  private storeService: StoreService;
  private contentService: ContentService;
  private recommendationService: RecommendationService;
  private productService: ProductService;
  private trainingService: TrainingService;
  private searchService: SearchServiceImpl;
  
  constructor() {
    this.storeService = new StoreService();
    this.contentService = new ContentService();
    this.recommendationService = new RecommendationService();
    this.productService = new ProductService();
    this.trainingService = new TrainingService();
    this.searchService = new SearchServiceImpl(
      this.storeService,
      this.productService,
      this.trainingService
    );
  }
  
  /**
   * 门店相关API
   */
  stores = {
    getAll: () => mockAPI.wrapWithDelay(
      this.storeService.getAll(),
      API_DELAYS.NORMAL
    ),
    
    getById: (id: number) => mockAPI.wrapWithDelay(
      this.storeService.getById(id),
      API_DELAYS.FAST
    ),
    
    getNearby: (coords: Coordinates, options?: any) => mockAPI.wrapWithDelay(
      this.storeService.getNearby(coords, options),
      API_DELAYS.NORMAL
    ),
    
    getByDistrict: (district: string) => mockAPI.wrapWithDelay(
      this.storeService.getByDistrict(district),
      API_DELAYS.FAST
    ),
    
    getDistricts: () => mockAPI.wrapWithDelay(
      this.storeService.getDistricts(),
      API_DELAYS.FAST
    ),
    
    getStatistics: () => mockAPI.wrapWithDelay(
      this.storeService.getStatistics(),
      API_DELAYS.NORMAL
    ),
    
    getRecommended: (coords?: Coordinates, limit?: number) => mockAPI.wrapWithDelay(
      this.storeService.getRecommendedStores(coords, limit),
      API_DELAYS.NORMAL
    ),
    
    getPopular: (limit?: number) => mockAPI.wrapWithDelay(
      this.storeService.getPopularStores(limit),
      API_DELAYS.FAST
    )
  };
  
  /**
   * 内容相关API
   */
  content = {
    getCompanyInfo: () => mockAPI.wrapWithDelay(
      this.contentService.getCompanyInfo(),
      API_DELAYS.NORMAL
    ),
    
    getFranchiseInfo: () => mockAPI.wrapWithDelay(
      this.contentService.getFranchiseInfo(),
      API_DELAYS.NORMAL
    ),
    
    getTrainingInfo: () => mockAPI.wrapWithDelay(
      this.contentService.getTrainingInfo(),
      API_DELAYS.NORMAL
    ),
    
    getProductsInfo: () => mockAPI.wrapWithDelay(
      this.contentService.getProductsInfo(),
      API_DELAYS.NORMAL
    ),
    
    getModule: (type: ContentType, options?: ContentOptions) => mockAPI.wrapWithDelay(
      this.contentService.getModule(type),
      API_DELAYS.NORMAL
    )
  };
  
  /**
   * 产品相关API
   */
  products = {
    getAll: (filter?: ProductFilter) => mockAPI.wrapWithDelay(
      this.productService.getAll(filter),
      API_DELAYS.NORMAL
    ),
    
    getById: (id: string) => mockAPI.wrapWithDelay(
      this.productService.getById(id),
      API_DELAYS.FAST
    ),
    
    getByBrand: (brand: '耶氏' | '古帮特' | '鑫隆基' | '申天堂') => mockAPI.wrapWithDelay(
      this.productService.getByBrand(brand),
      API_DELAYS.FAST
    ),
    
    getByCategory: (category: 'table' | 'cue' | 'accessory' | 'maintenance') => mockAPI.wrapWithDelay(
      this.productService.getByCategory(category),
      API_DELAYS.FAST
    ),
    
    getCategoryTree: () => mockAPI.wrapWithDelay(
      this.productService.getCategoryTree(),
      API_DELAYS.FAST
    )
  };
  
  /**
   * 培训相关API
   */
  training = {
    getAll: (filter?: TrainingFilter) => mockAPI.wrapWithDelay(
      this.trainingService.getAll(filter),
      API_DELAYS.NORMAL
    ),
    
    getById: (id: string) => mockAPI.wrapWithDelay(
      this.trainingService.getById(id),
      API_DELAYS.FAST
    ),
    
    getByCategory: (category: 'installation' | 'academy') => mockAPI.wrapWithDelay(
      this.trainingService.getByCategory(category),
      API_DELAYS.FAST
    ),
    
    getSchedule: (options?: ScheduleOptions) => mockAPI.wrapWithDelay(
      this.trainingService.getSchedule(options),
      API_DELAYS.NORMAL
    )
  };
  
  /**
   * 推荐相关API
   */
  recommendations = {
    getContent: (context: UserContext) => mockAPI.wrapWithDelay(
      this.recommendationService.getContentRecommendations(context),
      API_DELAYS.NORMAL
    ),
    
    getNextActions: (context: UserContext) => mockAPI.wrapWithDelay(
      this.recommendationService.recommendNextAction(context as ExtendedUserContext),
      API_DELAYS.FAST
    ),
    
    getPersonalizedLayout: async (context: UserContext): Promise<DataResponse<PersonalizedLayout>> => {
      const recommendations = await this.recommendationService.recommendContent(context as ExtendedUserContext);
      
      // 构建个性化布局
      const layout: PersonalizedLayout = {
        version: "1.0",
        mainSections: recommendations
          .filter(rec => rec.displayPosition !== 'sidebar' && rec.displayPosition !== 'footer')
          .slice(0, 5)
          .map((rec, index) => ({
            id: `section-${index}`,
            type: rec.type as ContentType,
            priority: rec.priority,
            data: rec.module
          })),
        sidebar: recommendations
          .filter(rec => rec.displayPosition === 'sidebar')
          .slice(0, 3)
          .map((rec, index) => ({
            id: `sidebar-${index}`,
            type: rec.type as ContentType,
            data: rec.module
          }))
      };
      
      // 设置英雄区
      const heroRec = recommendations.find(rec => rec.displayPosition === 'hero');
      if (heroRec) {
        layout.hero = {
          type: heroRec.type as ContentType,
          data: heroRec.module
        };
      }
      
      return mockAPI.wrapWithDelay({
        success: true,
        data: layout,
        metadata: {
          timestamp: Date.now(),
          version: "1.0.0",
          cached: false,
          processingTime: 120
        }
      }, API_DELAYS.NORMAL);
    }
  };
  
  /**
   * 搜索相关API
   */
  search = {
    stores: (query: string) => mockAPI.wrapWithDelay(
      this.searchService.searchStores(query),
      API_DELAYS.NORMAL
    ),
    
    products: (query: string) => mockAPI.wrapWithDelay(
      this.searchService.searchProducts(query),
      API_DELAYS.NORMAL
    ),
    
    content: (query: string) => mockAPI.wrapWithDelay(
      this.searchService.searchContent(query),
      API_DELAYS.NORMAL
    ),
    
    global: (query: string, options?: GlobalSearchOptions) => mockAPI.wrapWithDelay(
      this.searchService.searchGlobal(query, options),
      API_DELAYS.SLOW
    )
  };
  
  /**
   * 快捷方法
   */
  getCompanyOverview = async () => {
    const [companyInfo, statistics, news] = await Promise.all([
      this.content.getCompanyInfo(),
      this.stores.getStatistics(),
      mockAPI.wrapWithDelay(getNews().slice(0, 3), API_DELAYS.FAST)
    ]);
    
    return {
      company: companyInfo,
      statistics,
      latestNews: news
    };
  };
  
  getFranchisePackage = async () => {
    const [franchiseInfo, successCases, faqs] = await Promise.all([
      this.content.getFranchiseInfo(),
      mockAPI.wrapWithDelay(mockFranchiseInfo, API_DELAYS.NORMAL),
      mockAPI.wrapWithDelay(
        getFAQs().filter(faq => faq.category === 'franchise'),
        API_DELAYS.FAST
      )
    ]);
    
    return {
      franchise: franchiseInfo,
      cases: successCases,
      faqs
    };
  };
}

/**
 * 导出API单例
 */
export const api = new API();

// 导出类型
export type { 
  DataResponse,
  ContentModule,
  Store,
  Product,
  TrainingProgram,
  UserContext,
  ContentRecommendation,
  StoreStatistics
};