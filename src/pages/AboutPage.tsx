import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useContextEngine } from '../context/ContextEngine';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { Button, Card } from '../components';
import { api } from '../services/api';
import { CompanyInfo } from '../types/models';

export const AboutPage: React.FC = () => {
  const { trackClick, engagementLevel } = useBehaviorTracking();
  const { state, dispatch } = useContextEngine();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'history' | 'mission' | 'values' | 'team'>('history');

  useEffect(() => {
    // 更新用户兴趣
    const currentInterests = state.molecules.userInterests || [];
    if (!currentInterests.includes('about')) {
      dispatch({
        type: 'UPDATE_INTERESTS',
        payload: [...currentInterests, 'about', 'company']
      });
    }

    // 获取公司信息
    fetchCompanyInfo();
  }, [dispatch]); // 只依赖dispatch，避免无限循环

  const fetchCompanyInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching company info...');
      const response = await api.content.getCompanyInfo();
      console.log('API Response:', response);
      
      // ProtocolDocument 直接包含内容，不需要 success 和 data 属性
      if (response && response.content) {
        // 将 ExecutiveBriefContent 转换为 CompanyInfo
        const content = response.content;
        const companyData = {
          name: '云南耶氏体育文化发展有限公司',
          slogan: '把职业台球带到大众生活中',
          summary: content.summary || '',
          description: content.sections?.find(s => s.title === '公司历史')?.content || '',
          foundedYear: 2018,
          employeeCount: 100,
          keyPoints: content.keyPoints?.map(kp => kp.title) || [],
          sections: {
            history: content.sections?.find(s => s.title === '公司历史')?.content || '云南耶氏体育发展有限公司成立于2018年，经过数年发展，已成为云南台球行业的领导品牌。',
            mission: content.sections?.find(s => s.title === '企业使命')?.content || '把职业台球带到大众生活中，让更多人享受台球运动的乐趣。',
            values: content.sections?.find(s => s.title === '企业使命')?.subsections?.find(s => s.title === '价值观')?.content || '专业、品质、服务、创新',
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
        console.log('Setting company info:', companyData);
        setCompanyInfo(companyData);
        trackClick('company-info-loaded');
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('数据格式错误');
      }
    } catch (error) {
      console.error('Failed to fetch company info:', error);
      setError(error instanceof Error ? error.message : '加载公司信息失败');
    } finally {
      setLoading(false);
    }
  };

  const sectionTabs = [
    { id: 'history', label: '发展历程', icon: '📈' },
    { id: 'mission', label: '企业使命', icon: '🎯' },
    { id: 'values', label: '核心价值', icon: '💎' },
    { id: 'team', label: '团队介绍', icon: '👥' }
  ] as const;

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white rounded-xl shadow-card animate-pulse" />
            ))}
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="h-96 bg-white rounded-xl shadow-card animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !companyInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || '无法加载公司信息'}</p>
          <Button onClick={fetchCompanyInfo} variant="secondary">
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 grid-background opacity-10" />
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl animate-float animation-delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float animation-delay-600" />

        {/* Content */}
        <div className="relative z-10 container text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              关于
              <span className="text-secondary-400"> 耶氏体育</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-light leading-relaxed">
              {companyInfo.slogan}
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-white/80 max-w-3xl mx-auto">
              {companyInfo.summary}
            </motion.p>
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

      {/* Company Stats */}
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
              公司
              <span className="text-gradient"> 发展成就</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              专注台球行业，打造西南地区领先的台球连锁品牌
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
              { number: companyInfo.foundedYear, label: '创立年份', icon: '🏢', featured: false },
              { number: '20+', label: '连锁门店', icon: '🏪', featured: true },
              { number: companyInfo.employeeCount + '+', label: '专业团队', icon: '👥', featured: false },
              { number: '10000+', label: '服务客户', icon: '🎱', featured: true }
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  title={`${stat.number}`}
                  description={stat.label}
                  featured={stat.featured}
                  className="text-center hover:scale-105 transition-transform duration-300"
                  image={undefined}
                  category={stat.icon}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {sectionTabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveSection(tab.id);
                  trackClick(`about-tab-${tab.id}`);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeSection === tab.id
                    ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/25'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 shadow-md'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-xl p-8">
              {activeSection === 'history' && (
                <div>
                  <h2 className="text-3xl font-bold text-yes-dark mb-6">发展历程</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {companyInfo.sections.history}
                  </p>
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-2xl font-bold text-yes-green">2018</div>
                      <div className="text-sm text-gray-600">创立年份</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-2xl font-bold text-yes-green">20+</div>
                      <div className="text-sm text-gray-600">连锁门店</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-2xl font-bold text-yes-green">100+</div>
                      <div className="text-sm text-gray-600">员工数量</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-2xl font-bold text-yes-green">4</div>
                      <div className="text-sm text-gray-600">自有品牌</div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'mission' && (
                <div>
                  <h2 className="text-3xl font-bold text-yes-dark mb-6">企业使命</h2>
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    {companyInfo.sections.mission}
                  </p>
                  <div className="bg-yes-green bg-opacity-10 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yes-dark mb-4">我们的承诺</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-yes-green mt-1">✓</span>
                        <span className="text-gray-700">提供专业级别的台球设备和场地</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-yes-green mt-1">✓</span>
                        <span className="text-gray-700">打造舒适、现代的台球运动环境</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-yes-green mt-1">✓</span>
                        <span className="text-gray-700">培养专业台球人才，推广台球文化</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-yes-green mt-1">✓</span>
                        <span className="text-gray-700">让每个人都能享受台球运动的乐趣</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'values' && (
                <div>
                  <h2 className="text-3xl font-bold text-yes-dark mb-6">核心价值</h2>
                  <p className="text-lg text-gray-700 mb-8">{companyInfo.sections.values}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['专业', '品质', '服务', '创新'].map((value, index) => (
                      <div key={value} className="border-l-4 border-yes-green pl-6">
                        <h3 className="text-xl font-semibold text-yes-dark mb-2">{value}</h3>
                        <p className="text-gray-600">
                          {[
                            '专业的设备、专业的服务、专业的培训体系',
                            '高品质的台球桌、高品质的环境、高品质的体验',
                            '客户至上、贴心服务、持续改进',
                            '技术创新、模式创新、管理创新'
                          ][index]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'team' && (
                <div>
                  <h2 className="text-3xl font-bold text-yes-dark mb-6">团队介绍</h2>
                  <div className="bg-gradient-to-r from-yes-green to-yes-dark text-white p-8 rounded-lg mb-8">
                    <h3 className="text-2xl font-semibold mb-4">创始人：{companyInfo.sections.team.founder}</h3>
                    <p className="text-lg italic mb-4">"{companyInfo.sections.team.philosophy}"</p>
                    <p className="opacity-90">
                      带领团队从第一家店开始，逆市扩张，将耶氏打造成为西南地区最具影响力的台球连锁品牌。
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl mb-4">👔</div>
                      <h4 className="font-semibold text-yes-dark mb-2">管理团队</h4>
                      <p className="text-gray-600">经验丰富的管理团队，确保高效运营</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-4">🔧</div>
                      <h4 className="font-semibold text-yes-dark mb-2">技术团队</h4>
                      <p className="text-gray-600">专业的安装维护团队，保障设备品质</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-4">🎓</div>
                      <h4 className="font-semibold text-yes-dark mb-2">培训团队</h4>
                      <p className="text-gray-600">资深教练团队，传授专业技能</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-400 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            加入耶氏，共创辉煌
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            无论您是想要加盟创业，还是希望提升台球技能，耶氏都是您的最佳选择
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                trackClick('about-franchise-cta');
                window.location.href = '/franchise';
              }}
              className="shadow-xl hover:shadow-2xl"
            >
              了解加盟详情
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                trackClick('about-training-cta');
                window.location.href = '/training';
              }}
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              查看培训课程
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Context指示器（开发模式） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs">
          <p>参与度：{engagementLevel}</p>
          <p>活跃板块：{activeSection}</p>
          <p>API状态：{loading ? '加载中' : error ? '错误' : '正常'}</p>
          <p>数据源：{companyInfo ? 'API' : 'None'}</p>
        </div>
      )}
    </div>
  );
};