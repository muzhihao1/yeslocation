import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContextEngine } from '../../context/ContextEngine';
import { ConversionFunnel } from '../molecules/ConversionFunnel';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number }>;
  conversionRate: number;
  userJourneyDistribution: {
    awareness: number;
    interest: number;
    consideration: number;
    decision: number;
  };
}

export const AnalyticsDashboard: React.FC = () => {
  const { state } = useContextEngine();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');
  const [activeTab, setActiveTab] = useState<'overview' | 'behavior' | 'conversion'>('overview');
  
  // 模拟分析数据
  useEffect(() => {
    // 实际项目中应从 GA4 API 获取数据
    const mockData: AnalyticsData = {
      pageViews: 1234,
      uniqueVisitors: 567,
      averageSessionDuration: 185, // 秒
      bounceRate: 42.3,
      topPages: [
        { page: '首页', views: 456 },
        { page: '产品中心', views: 234 },
        { page: '门店列表', views: 189 },
        { page: '培训课程', views: 156 },
        { page: '关于我们', views: 123 },
      ],
      conversionRate: 3.2,
      userJourneyDistribution: {
        awareness: 45,
        interest: 30,
        consideration: 20,
        decision: 5,
      },
    };
    
    setAnalyticsData(mockData);
  }, [dateRange]);
  
  if (!analyticsData) {
    return <div className="animate-pulse bg-neutral-100 h-96 rounded-lg" />;
  }
  
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 关键指标卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-sm font-medium text-neutral-600 mb-2">页面浏览量</h3>
        <p className="text-3xl font-bold text-neutral-900">{analyticsData.pageViews.toLocaleString()}</p>
        <p className="text-sm text-green-600 mt-2">↑ 12.5% vs 昨日</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-sm font-medium text-neutral-600 mb-2">独立访客</h3>
        <p className="text-3xl font-bold text-neutral-900">{analyticsData.uniqueVisitors}</p>
        <p className="text-sm text-green-600 mt-2">↑ 8.3% vs 昨日</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-sm font-medium text-neutral-600 mb-2">平均停留时间</h3>
        <p className="text-3xl font-bold text-neutral-900">
          {Math.floor(analyticsData.averageSessionDuration / 60)}:{(analyticsData.averageSessionDuration % 60).toString().padStart(2, '0')}
        </p>
        <p className="text-sm text-green-600 mt-2">↑ 5.2% vs 昨日</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-sm font-medium text-neutral-600 mb-2">跳出率</h3>
        <p className="text-3xl font-bold text-neutral-900">{analyticsData.bounceRate}%</p>
        <p className="text-sm text-red-600 mt-2">↓ 2.1% vs 昨日</p>
      </motion.div>
    </div>
  );
  
  const renderBehavior = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 热门页面 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold mb-4">热门页面</h3>
        <div className="space-y-3">
          {analyticsData.topPages.map((page, index) => (
            <div key={page.page} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-neutral-500 w-6">{index + 1}.</span>
                <span className="text-sm font-medium text-neutral-800 ml-2">{page.page}</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-neutral-100 rounded-full h-2 mr-3">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(page.views / analyticsData.topPages[0].views) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-neutral-600">{page.views}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* 用户旅程分布 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold mb-4">用户旅程阶段</h3>
        <div className="space-y-4">
          {Object.entries(analyticsData.userJourneyDistribution).map(([stage, percentage]) => (
            <div key={stage}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-neutral-700 capitalize">{stage}</span>
                <span className="text-sm text-neutral-600">{percentage}%</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-primary-400 to-primary-600 h-3 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
  
  const renderConversion = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 转化率 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold mb-4">总体转化率</h3>
        <div className="flex items-center justify-center h-48">
          <div className="relative">
            <svg className="w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="#2196F3"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - analyticsData.conversionRate / 100)}`}
                transform="rotate(-90 64 64)"
                initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - analyticsData.conversionRate / 100) }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900">{analyticsData.conversionRate}%</span>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-neutral-600 mt-4">
          预约转化率较上周提升 0.5%
        </p>
      </motion.div>
      
      {/* 转化漏斗 */}
      <ConversionFunnel
        funnelName="预约流程"
        steps={['访问页面', '查看详情', '开始预约', '完成预约']}
        currentStep={3}
        className="h-full"
      />
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 标题和日期选择 */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">数据分析</h2>
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {range === 'today' ? '今日' : range === 'week' ? '本周' : '本月'}
            </button>
          ))}
        </div>
      </div>
      
      {/* 标签页 */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {(['overview', 'behavior', 'conversion'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {tab === 'overview' ? '概览' : tab === 'behavior' ? '用户行为' : '转化分析'}
            </button>
          ))}
        </nav>
      </div>
      
      {/* 内容区域 */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'behavior' && renderBehavior()}
        {activeTab === 'conversion' && renderConversion()}
      </div>
      
      {/* 实时状态 */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
          <span className="text-sm font-medium text-green-800">
            当前在线用户: {Math.floor(Math.random() * 20 + 10)} 人
          </span>
        </div>
      </div>
    </div>
  );
};