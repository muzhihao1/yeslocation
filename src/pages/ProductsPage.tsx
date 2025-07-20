import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContextEngine } from '../context/ContextEngine';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { Button, Card } from '../components';
import { SEO } from '../components/atoms/SEO';
import { api } from '../services/api';
import { generateBreadcrumbSchema } from '../utils/structuredData';

interface Brand {
  name: string;
  description: string;
}

interface ProductsInfo {
  brands: Brand[];
  categories: string[];
  features: string[];
}

interface Product {
  name: string;
  specs: string;
  price: string;
}

// Product showcase data
const productShowcase: Record<string, Product[]> = {
  '台球桌': [
    { name: '耶氏专业比赛台', specs: '国际标准尺寸，青石板台面', price: '¥28,000起' },
    { name: '古帮特豪华型', specs: '经典设计，进口台呢', price: '¥18,000起' },
    { name: '鑫隆基商用型', specs: '性价比之选，稳定耐用', price: '¥12,000起' },
    { name: '申天堂家用款', specs: '紧凑设计，适合家庭', price: '¥6,800起' }
  ],
  '球杆': [
    { name: '职业级碳纤维杆', specs: '超轻设计，精准控制', price: '¥3,800' },
    { name: '高级枫木杆', specs: '传统工艺，手感出色', price: '¥2,200' },
    { name: '入门练习杆', specs: '适合初学者', price: '¥380' },
    { name: '儿童专用杆', specs: '轻巧短杆设计', price: '¥280' }
  ],
  '配件': [
    { name: '进口6811台呢', specs: '世界锦标赛指定用呢', price: '¥1,800/套' },
    { name: '水晶球套装', specs: '高透明度，精准重量', price: '¥680/套' },
    { name: '台球灯', specs: 'LED专业照明', price: '¥1,200' },
    { name: '球杆架', specs: '实木材质，可放16支', price: '¥380' }
  ],
  '维护用品': [
    { name: '台呢刷套装', specs: '专业清洁工具', price: '¥120' },
    { name: '巧克粉', specs: '防滑增摩', price: '¥30/盒' },
    { name: '杆油保养套装', specs: '延长球杆寿命', price: '¥180' },
    { name: '台球清洁剂', specs: '专业配方', price: '¥60' }
  ]
};

export const ProductsPage: React.FC = () => {
  const { trackClick, engagementLevel } = useBehaviorTracking();
  const { state, dispatch } = useContextEngine();
  const [productsInfo, setProductsInfo] = useState<ProductsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('台球桌');

  useEffect(() => {
    // 更新用户兴趣
    const currentInterests = state.molecules.userInterests || [];
    if (!currentInterests.includes('products')) {
      dispatch({
        type: 'UPDATE_INTERESTS',
        payload: [...currentInterests, 'products', 'manufacturing']
      });
    }

    // 获取产品信息
    fetchProductsInfo();
  }, [dispatch]); // 只依赖dispatch，避免无限循环

  const fetchProductsInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.content.getProductsInfo();
      
      // ProtocolDocument 包含内容，需要从中提取产品信息
      if (response && response.content) {
        // 硬编码产品信息，因为 ProtocolDocument 的结构与 ProductsInfo 不匹配
        const productsInfo: ProductsInfo = {
          brands: [
            { name: '耶氏', description: '专业比赛级别' },
            { name: '古帮特', description: '经典实用' },
            { name: '鑫隆基', description: '高性价比' },
            { name: '申天堂', description: '家用入门' }
          ],
          categories: ['台球桌', '球杆', '配件', '维护用品'],
          features: ['自主生产', '品质保证', '专业认证', '售后服务']
        };
        
        setProductsInfo(productsInfo);
        if (productsInfo.brands.length > 0) {
          setSelectedBrand(productsInfo.brands[0].name);
        }
        trackClick('products-info-loaded');
      }
    } catch (error) {
      console.error('Failed to fetch products info:', error);
      setError('加载产品信息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Hero Skeleton */}
        <div className="relative h-96 bg-gradient-to-br from-neutral-200 to-neutral-300 animate-pulse" />
        
        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-xl shadow-card animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-white rounded-xl shadow-card animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">{error}</p>
          <Button onClick={fetchProductsInfo} variant="secondary">
            重试
          </Button>
        </div>
      </div>
    );
  }

  if (!productsInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-600">无法加载产品信息</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="产品中心"
        description="耶氏体育产品中心 - 西南地区唯一台球桌生产厂家。提供耶氏、古帮特、鑫隆基、申天堂四大品牌系列台球桌、球杆、配件及维护用品。专业生产、品质保证、售后无忧。"
        keywords="台球桌,台球杖,台球配件,耶氏台球,古帮特,鑫隆基,申天堂,台球器材,台球设备"
        jsonLd={generateBreadcrumbSchema([
          { name: '首页', url: '/' },
          { name: '产品中心', url: '/products' }
        ])}
      />
      <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 grid-background opacity-10" />
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl animate-float animation-delay-300" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-float animation-delay-600" />

        {/* Content */}
        <div className="relative z-10 container text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              产品
              <span className="text-secondary-400"> 中心</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">
              西南地区唯一台球桌生产厂家
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              四大品牌系列，满足不同需求，为您提供最专业的台球设备
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              为什么选择
              <span className="text-gradient"> 我们的产品</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              专业生产、品质保证、售后无忧
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: '🏭', title: '自主生产', desc: '自有工厂，品质可控，价格优势明显' },
              { icon: '🔧', title: '品质保证', desc: '严格质检，多项专利技术，性能领先' },
              { icon: '🛡️', title: '专业认证', desc: 'ISO9001认证，符合国际标准' },
              { icon: '🤝', title: '售后服务', desc: '完善的售后体系，全程质保无忧' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 bg-neutral-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">四大品牌系列</h2>
            <p className="text-xl text-neutral-600">满足不同客户需求</p>
          </motion.div>

          {/* Brand Selector */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12"
          >
            {productsInfo.brands.map((brand, index) => (
              <motion.button
                key={brand.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedBrand(brand.name);
                  trackClick(`product-brand-${brand.name}`);
                }}
                className={`p-6 rounded-xl text-center transition-all duration-300 ${
                  selectedBrand === brand.name
                    ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/25'
                    : 'bg-white text-neutral-700 hover:shadow-lg'
                }`}
              >
                <div className="text-3xl font-bold mb-2">{brand.name}</div>
                <div className="text-sm opacity-80">{brand.description}</div>
              </motion.button>
            ))}
          </motion.div>

          {/* Brand Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBrand}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl shadow-xl p-8">
                <h3 className="text-3xl font-bold mb-6">{selectedBrand}品牌介绍</h3>
                {selectedBrand === '耶氏' && (
                  <div>
                    <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                      耶氏品牌是我们的旗舰系列，专为专业比赛和高端会所设计。采用最优质的材料和最先进的工艺，
                      每一张耶氏台球桌都经过严格的质量检测，确保达到国际比赛标准。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        '国际标准尺寸，适合专业比赛',
                        '进口高弹性库边，反弹精准',
                        '青石板台面，平整度极高',
                        '专利减震系统，稳定性卓越'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-primary-500 text-xl">✓</span>
                          <span className="text-neutral-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedBrand === '古帮特' && (
                  <div>
                    <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                      古帮特系列传承经典设计，融合现代工艺，是中高端台球厅的首选。外观典雅大气，
                      性能稳定可靠，深受广大台球爱好者喜爱。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        '经典外观设计，彰显品味',
                        '优质硬木框架，经久耐用',
                        '专业级配置，性价比高',
                        '多种颜色可选，满足装修需求'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-primary-500 text-xl">✓</span>
                          <span className="text-neutral-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedBrand === '鑫隆基' && (
                  <div>
                    <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                      鑫隆基系列专注于性价比，为中小型台球厅和社区活动中心提供优质选择。
                      在保证品质的前提下，最大程度控制成本，让更多人享受台球运动。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        '合理的价格定位',
                        '稳定的产品性能',
                        '简约实用的设计',
                        '完善的售后服务'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-primary-500 text-xl">✓</span>
                          <span className="text-neutral-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedBrand === '申天堂' && (
                  <div>
                    <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                      申天堂系列是入门级产品线，专为家庭娱乐和初学者设计。轻巧便携，
                      安装简单，让台球运动走进千家万户。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        '适合家庭使用',
                        '安装拆卸方便',
                        '占地面积小',
                        '价格亲民实惠'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-primary-500 text-xl">✓</span>
                          <span className="text-neutral-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">产品分类</h2>
            <p className="text-xl text-neutral-600">全系列台球设备，一站式采购</p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {productsInfo.categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(category);
                  trackClick(`product-category-${category}`);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/25'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Product Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {productShowcase[selectedCategory]?.map((product, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  title={product.name}
                  description={product.specs}
                  category={selectedCategory === '台球桌' ? '🎱' : selectedCategory === '球杆' ? '🎯' : '🔧'}
                  action={{
                    label: '询价',
                    onClick: () => {
                      trackClick(`product-inquiry-${product.name}`);
                      document.getElementById('product-inquiry')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  tags={[product.price]}
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Manufacturing Excellence */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-400 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">生产实力</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              西南地区唯一生产基地，现代化工厂保证品质
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-semibold mb-6">专业制造，品质保证</h3>
              <p className="text-lg mb-8 text-white/90 leading-relaxed">
                拥有现代化生产车间5000平方米，配备先进的数控加工设备，年产能超过3000台。
                从原材料采购到成品出厂，每一个环节都严格把控，确保产品品质。
              </p>
              <div className="space-y-4">
                {[
                  { icon: '🏭', text: '5000㎡现代化厂房' },
                  { icon: '🤖', text: '全自动数控生产线' },
                  { icon: '📊', text: 'ISO9001质量认证' },
                  { icon: '🔬', text: '专业检测实验室' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { number: '3000+', label: '年产能' },
                { number: '50+', label: '技术工人' },
                { number: '10+', label: '专利技术' },
                { number: '99%', label: '客户满意度' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Inquiry */}
      <section id="product-inquiry" className="py-20 bg-neutral-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-center mb-8">产品咨询</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      您的姓名
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="请输入姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      联系电话
                    </label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="请输入手机号"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    咨询产品
                  </label>
                  <select className="input">
                    <option>请选择产品类型</option>
                    <optgroup label="台球桌">
                      <option>耶氏专业比赛台</option>
                      <option>古帮特经典系列</option>
                      <option>鑫隆基商用型</option>
                      <option>申天堂入门款</option>
                    </optgroup>
                    <optgroup label="球杆">
                      <option>职业级碳纤维杆</option>
                      <option>高级枫木杆</option>
                    </optgroup>
                    <optgroup label="配件">
                      <option>台呢及配件</option>
                      <option>其他耗材</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    采购数量
                  </label>
                  <input
                    type="number"
                    className="input"
                    placeholder="请输入采购数量"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    留言
                  </label>
                  <textarea
                    rows={4}
                    className="input"
                    placeholder="请描述您的具体需求"
                  />
                </div>

                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      trackClick('product-inquiry-submit');
                      alert('感谢您的咨询！我们会尽快与您联系并提供报价。');
                    }}
                  >
                    提交咨询
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center text-neutral-600">
                <p className="mb-2">销售热线</p>
                <p className="text-2xl font-bold text-primary-600">177-8714-7147</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Context指示器（开发模式） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs">
          <p>参与度：{engagementLevel}</p>
          <p>当前品牌：{selectedBrand}</p>
          <p>当前分类：{selectedCategory}</p>
        </div>
      )}
      </div>
    </>
  );
};