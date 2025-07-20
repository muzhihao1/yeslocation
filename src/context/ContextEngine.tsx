import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Context Engineering核心类型定义
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PageVisit {
  page: string;
  timestamp: number;
  duration: number;
}

export interface Pattern {
  type: string;
  frequency: number;
  lastOccurrence: number;
}

// Atoms层 - 基础数据单元
export interface ContextAtoms {
  userLocation?: Coordinates;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  visitTime: Date;
  isFirstVisit: boolean;
  language: string;
}

// Molecules层 - 组合状态
export interface ContextMolecules {
  nearestStores: any[]; // 将由StoreService提供
  userInterests: string[];
  contentPriority: Map<string, number>;
}

// Cells层 - 有状态记忆
export interface ContextCells {
  visitHistory: PageVisit[];
  interactionPatterns: Pattern[];
  sessionDuration: number;
  engagementLevel: 'low' | 'medium' | 'high';
}

// Organs层 - 系统级功能
export interface ContextOrgans {
  recommendations: any[];
  navigationSuggestions: string[];
  adaptiveUI: {
    layout: 'compact' | 'normal' | 'expanded';
    emphasisAreas: string[];
  };
}

// Fields层 - 全局场域
export interface ContextFields {
  resonance: number; // 0-1, 用户与内容的共鸣度
  coherence: number; // 0-1, 浏览行为的连贯性
  intention: 'browse' | 'search' | 'engage' | 'convert';
  journey: 'awareness' | 'interest' | 'consideration' | 'decision';
}

// 完整的Context状态
export interface ContextState {
  atoms: ContextAtoms;
  molecules: ContextMolecules;
  cells: ContextCells;
  organs: ContextOrgans;
  fields: ContextFields;
  metadata: {
    version: string;
    lastUpdate: number;
  };
}

// Context Actions
type ContextAction =
  | { type: 'UPDATE_LOCATION'; payload: Coordinates }
  | { type: 'UPDATE_INTERESTS'; payload: string[] }
  | { type: 'ADD_PAGE_VISIT'; payload: PageVisit }
  | { type: 'UPDATE_ENGAGEMENT'; payload: 'low' | 'medium' | 'high' }
  | { type: 'SET_RECOMMENDATIONS'; payload: any[] }
  | { type: 'UPDATE_RESONANCE'; payload: number }
  | { type: 'UPDATE_JOURNEY'; payload: ContextFields['journey'] }
  | { type: 'SYNC_STATE'; payload: Partial<ContextState> };

// 初始状态
const initialState: ContextState = {
  atoms: {
    deviceType: 'desktop',
    visitTime: new Date(),
    isFirstVisit: true,
    language: 'zh-CN',
  },
  molecules: {
    nearestStores: [],
    userInterests: [],
    contentPriority: new Map([
      ['about', 1],
      ['stores', 0.9],
      ['franchise', 0.8],
      ['training', 0.7],
      ['products', 0.6],
    ]),
  },
  cells: {
    visitHistory: [],
    interactionPatterns: [],
    sessionDuration: 0,
    engagementLevel: 'low',
  },
  organs: {
    recommendations: [],
    navigationSuggestions: [],
    adaptiveUI: {
      layout: 'normal',
      emphasisAreas: [],
    },
  },
  fields: {
    resonance: 0,
    coherence: 0,
    intention: 'browse',
    journey: 'awareness',
  },
  metadata: {
    version: '1.0.0',
    lastUpdate: Date.now(),
  },
};

// Context Reducer
function contextReducer(state: ContextState, action: ContextAction): ContextState {
  const newState = { ...state };
  
  switch (action.type) {
    case 'UPDATE_LOCATION':
      newState.atoms.userLocation = action.payload;
      break;
      
    case 'UPDATE_INTERESTS':
      newState.molecules.userInterests = action.payload;
      // 动态调整内容优先级
      // Ensure contentPriority is a Map
      if (!(newState.molecules.contentPriority instanceof Map)) {
        newState.molecules.contentPriority = new Map(Object.entries(newState.molecules.contentPriority));
      }
      action.payload.forEach(interest => {
        const current = newState.molecules.contentPriority.get(interest) || 0;
        newState.molecules.contentPriority.set(interest, Math.min(current + 0.1, 1));
      });
      break;
      
    case 'ADD_PAGE_VISIT':
      newState.cells.visitHistory.push(action.payload);
      // 更新会话时长
      newState.cells.sessionDuration += action.payload.duration;
      // 分析模式
      updatePatterns(newState.cells);
      break;
      
    case 'UPDATE_ENGAGEMENT':
      newState.cells.engagementLevel = action.payload;
      // 根据参与度调整UI
      if (action.payload === 'high') {
        newState.organs.adaptiveUI.layout = 'expanded';
      }
      break;
      
    case 'SET_RECOMMENDATIONS':
      newState.organs.recommendations = action.payload;
      break;
      
    case 'UPDATE_RESONANCE':
      newState.fields.resonance = action.payload;
      break;
      
    case 'UPDATE_JOURNEY':
      newState.fields.journey = action.payload;
      break;
      
    case 'SYNC_STATE':
      const syncedState = { ...state, ...action.payload };
      // Ensure contentPriority is a Map
      if (syncedState.molecules && syncedState.molecules.contentPriority && !(syncedState.molecules.contentPriority instanceof Map)) {
        syncedState.molecules.contentPriority = new Map(Object.entries(syncedState.molecules.contentPriority));
      }
      return syncedState;
      
    default:
      return state;
  }
  
  // 更新元数据
  newState.metadata.lastUpdate = Date.now();
  
  // 计算场域连贯性
  newState.fields.coherence = calculateCoherence(newState);
  
  return newState;
}

// 辅助函数
function updatePatterns(cells: ContextCells) {
  // 分析访问模式
  const patterns = cells.visitHistory.reduce((acc, visit) => {
    const pattern = acc.find(p => p.type === visit.page);
    if (pattern) {
      pattern.frequency++;
      pattern.lastOccurrence = visit.timestamp;
    } else {
      acc.push({
        type: visit.page,
        frequency: 1,
        lastOccurrence: visit.timestamp,
      });
    }
    return acc;
  }, cells.interactionPatterns);
  
  cells.interactionPatterns = patterns;
}

function calculateCoherence(state: ContextState): number {
  // 基于用户行为计算连贯性
  const { visitHistory, engagementLevel } = state.cells;
  const { userInterests } = state.molecules;
  
  let score = 0;
  
  // 访问深度
  if (visitHistory.length > 3) score += 0.3;
  
  // 兴趣明确度
  if (userInterests.length > 0) score += 0.3;
  
  // 参与度
  if (engagementLevel === 'high') score += 0.4;
  else if (engagementLevel === 'medium') score += 0.2;
  
  return Math.min(score, 1);
}

// Context Provider
const ContextEngineContext = createContext<{
  state: ContextState;
  dispatch: React.Dispatch<ContextAction>;
} | null>(null);

export const ContextEngineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  
  // 初始化：检测设备类型
  useEffect(() => {
    const deviceType = window.innerWidth < 768 ? 'mobile' : 
                      window.innerWidth < 1024 ? 'tablet' : 'desktop';
    dispatch({ 
      type: 'SYNC_STATE', 
      payload: { 
        atoms: { ...state.atoms, deviceType } 
      } 
    });
  }, []);
  
  // 持久化到LocalStorage
  useEffect(() => {
    const savedState = localStorage.getItem('yes-context-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Restore Map objects
        if (parsed.molecules && parsed.molecules.contentPriority) {
          parsed.molecules.contentPriority = new Map(Object.entries(parsed.molecules.contentPriority));
        }
        dispatch({ type: 'SYNC_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load context state:', e);
      }
    }
  }, []);
  
  useEffect(() => {
    // Convert Map to plain object before saving
    const stateToSave = {
      ...state,
      molecules: {
        ...state.molecules,
        contentPriority: state.molecules.contentPriority instanceof Map 
          ? Object.fromEntries(state.molecules.contentPriority)
          : state.molecules.contentPriority
      }
    };
    localStorage.setItem('yes-context-state', JSON.stringify(stateToSave));
  }, [state]);
  
  
  return (
    <ContextEngineContext.Provider value={{ state, dispatch }}>
      {children}
    </ContextEngineContext.Provider>
  );
};

// 自定义Hook
export const useContextEngine = () => {
  const context = useContext(ContextEngineContext);
  if (!context) {
    throw new Error('useContextEngine must be used within ContextEngineProvider');
  }
  return context;
};


// 导出便捷函数
export const useContextAtoms = () => {
  const { state } = useContextEngine();
  return state.atoms;
};

export const useContextMolecules = () => {
  const { state } = useContextEngine();
  return state.molecules;
};

export const useContextCells = () => {
  const { state } = useContextEngine();
  return state.cells;
};

export const useContextOrgans = () => {
  const { state } = useContextEngine();
  return state.organs;
};

export const useContextFields = () => {
  const { state } = useContextEngine();
  return state.fields;
};