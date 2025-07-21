// 数据模型类型定义

export interface Store {
  id: number;
  name: string;
  shortName?: string;
  address: string;
  phone: string;
  coordinates: [number, number];
  district: string;
  businessHours: string;
  isRealCoordinate?: boolean;
  rating?: number;
  tableCount?: number;
  monthlyVisitors?: number;
  features?: string[];
}

export interface CompanyInfo {
  name?: string;
  slogan?: string;
  summary: string;
  description?: string;
  foundedYear?: number;
  employeeCount?: number;
  keyPoints: string[];
  sections: {
    history: string;
    mission: string;
    values: string;
    team: {
      founder: string;
      employees: string;
      philosophy: string;
    };
  };
  contact?: {
    phone?: string;
    email?: string;
    wechat?: string;
  };
}

export interface FranchiseInfo {
  advantages: string[];
  process: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  investment: {
    initial: string;
    roi: string;
    support: string[];
    breakdown?: {
      franchiseFee: string;
      equipment: string;
      decoration: string;
      others: string;
    };
  };
}

export interface TrainingCategory {
  name: string;
  description: string;
  duration: string;
  price: string;
  levels?: string[];
}

export interface TrainingInfo {
  categories: TrainingCategory[];
}

export interface Brand {
  name: string;
  description: string;
}

export interface ProductsInfo {
  brands: Brand[];
  categories: string[];
  features: string[];
}

// 用户上下文
export interface UserContext {
  userId?: string;
  sessionId?: string;
  visitCount?: number;
  pageViews?: number;
  location?: {
    coordinates?: [number, number];
    city?: string;
    district?: string;
  };
  interests?: Array<{
    category: string;
    level: number;
    keywords: string[];
  }>;
  behavior?: {
    totalTimeSpent?: number;
    searchQueries?: string[];
    clickedElements?: string[];
    pagesVisited?: string[];
  };
  // Neural system properties
  visitHistory?: Array<any>;
  userInterests?: string[];
  currentPage?: string;
  timeOfDay?: string;
  deviceType?: string;
  engagementLevel?: string;
  journey?: string;
}

// 产品
export interface Product {
  id: string;
  name: string;
  brand: '耶氏' | '古帮特' | '鑫隆基' | '申天堂';
  category: 'table' | 'cue' | 'accessory' | 'maintenance';
  price?: number;
  specs?: string;
  description?: string;
  inStock?: boolean;
  image?: string;
}

// 培训项目
export interface TrainingProgram {
  id: string;
  title: string;
  category: 'installation' | 'academy';
  description: string;
  duration: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  certification: boolean;
  popularity: number;
  modules?: string[];
  features?: string[];
  requirements?: string[];
  schedule?: Array<{
    date: string;
    time: string;
    location: string;
  }> | string;
}

// 内容推荐
export interface ContentRecommendation {
  id: string;
  type: string;
  title: string;
  description?: string;
  priority: number;
  reason?: string;
  data?: any;
}

// 搜索结果
export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description?: string;
  url?: string;
  relevanceScore?: number;
  highlights?: string[];
  metadata?: any;
}

// 响应元数据
export interface ResponseMetadata {
  timestamp: number;
  version: string;
  cached: boolean;
  processingTime: number;
}

// 错误响应
export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

// 预约表单数据
export interface BookingFormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  storeId: string;
  coachId?: string;
  message?: string;
}

// 产品咨询表单数据
export interface ProductInquiryFormData {
  name: string;
  phone: string;
  product: string;
  quantity: number;
  message?: string;
}

// 产品咨询记录
export interface ProductInquiry extends ProductInquiryFormData {
  id: string;
  submittedAt: string;
  status: 'pending' | 'processing' | 'contacted' | 'completed';
  followUpNotes?: string;
}