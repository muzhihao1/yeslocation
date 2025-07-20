import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: '营业时间是什么时候？',
    answer: '我们大部分门店的营业时间是早上9:00到晚上22:00，部分门店可能有所不同。您可以在门店详情页查看具体营业时间。',
    category: '基本信息',
    keywords: ['营业时间', '开门', '关门', '几点'],
  },
  {
    id: '2',
    question: '如何预约场地？',
    answer: '您可以通过以下方式预约：\n1. 在线预约：点击"立即预约"按钮\n2. 电话预约：拨打门店电话\n3. 到店预约：直接到门店前台',
    category: '预约相关',
    keywords: ['预约', '订场', '预定'],
  },
  {
    id: '3',
    question: '收费标准是怎样的？',
    answer: '收费标准因门店和时段而异：\n• 工作日白天：30-40元/小时\n• 工作日晚上：40-50元/小时\n• 周末节假日：50-60元/小时\n• VIP包间：80-120元/小时',
    category: '价格信息',
    keywords: ['价格', '收费', '多少钱', '费用'],
  },
  {
    id: '4',
    question: '是否提供球杆租赁？',
    answer: '是的，所有门店都提供免费的公共球杆。如果您需要更专业的球杆，我们也提供高端球杆租赁服务，价格为20-50元/次。',
    category: '设施服务',
    keywords: ['球杆', '租赁', '借用', '设备'],
  },
  {
    id: '5',
    question: '有哪些培训课程？',
    answer: '我们提供多种培训课程：\n• 零基础入门班（10课时）\n• 进阶技巧班（20课时）\n• 一对一私教（按需定制）\n• 青少年兴趣班（周末班）\n• 专业竞技班（长期培训）',
    category: '培训课程',
    keywords: ['培训', '课程', '教学', '学习', '教练'],
  },
  {
    id: '6',
    question: '如何成为会员？',
    answer: '您可以通过以下方式成为会员：\n1. 在任意门店前台办理\n2. 通过官方网站在线申请\n3. 联系客服电话办理\n会员可享受8折优惠及其他专属权益。',
    category: '会员服务',
    keywords: ['会员', '办卡', 'VIP', '充值'],
  },
  {
    id: '7',
    question: '是否可以举办比赛或活动？',
    answer: '当然可以！我们提供：\n• 场地包场服务\n• 专业赛事承办\n• 团建活动定制\n• 生日派对场地\n请提前联系门店预约，我们会为您提供专业的活动方案。',
    category: '活动赛事',
    keywords: ['比赛', '活动', '包场', '团建', '派对'],
  },
  {
    id: '8',
    question: '停车是否方便？',
    answer: '大部分门店都配有专属停车位或合作停车场，会员可享受免费停车。具体停车信息请查看各门店详情页。',
    category: '设施服务',
    keywords: ['停车', '车位', '泊车'],
  },
];

interface FAQBotProps {
  onQuestionClick?: (answer: string) => void;
  className?: string;
}

export const FAQBot: React.FC<FAQBotProps> = ({ onQuestionClick, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // 获取所有分类
  const categories = Array.from(new Set(faqs.map(faq => faq.category)));
  
  // 过滤FAQ
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm
      ? faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.keywords.some(keyword => keyword.includes(searchTerm.toLowerCase()))
      : true;
    
    const matchesCategory = selectedCategory
      ? faq.category === selectedCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // 根据搜索词推荐FAQ
  const getRecommendedFAQs = () => {
    if (!searchTerm) return [];
    
    return faqs
      .filter(faq =>
        faq.keywords.some(keyword =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .slice(0, 3);
  };
  
  const recommendedFAQs = getRecommendedFAQs();
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">常见问题</h3>
      
      {/* 搜索框 */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索您的问题..."
          className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* 推荐问题 */}
      {recommendedFAQs.length > 0 && searchTerm && (
        <div className="mb-4 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm font-medium text-primary-700 mb-2">您可能想问：</p>
          <div className="space-y-1">
            {recommendedFAQs.map((faq) => (
              <button
                key={faq.id}
                onClick={() => {
                  setExpandedId(faq.id);
                  onQuestionClick?.(faq.answer);
                }}
                className="block w-full text-left text-sm text-primary-600 hover:text-primary-700"
              >
                • {faq.question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* FAQ列表 */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredFAQs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-neutral-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => {
                  setExpandedId(expandedId === faq.id ? null : faq.id);
                  if (expandedId !== faq.id) {
                    onQuestionClick?.(faq.answer);
                  }
                }}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors"
              >
                <span className="font-medium text-neutral-800">{faq.question}</span>
                <motion.svg
                  animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>
              
              <AnimatePresence>
                {expandedId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-3 text-neutral-600 whitespace-pre-wrap"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredFAQs.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          <p>没有找到相关问题</p>
          <p className="text-sm mt-2">试试其他关键词或联系客服</p>
        </div>
      )}
    </div>
  );
};