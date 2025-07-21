import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useContextEngine } from '../context/ContextEngine';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { Button, Card } from '../components';
import { api } from '../services/api';
import { FranchiseInfo } from '../types/models';

export const FranchisePage: React.FC = () => {
  const { trackClick, engagementLevel } = useBehaviorTracking();
  const { state, dispatch } = useContextEngine();
  const [franchiseInfo, setFranchiseInfo] = useState<FranchiseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // 更新用户兴趣
    const currentInterests = state.molecules.userInterests || [];
    if (!currentInterests.includes('franchise')) {
      dispatch({
        type: 'UPDATE_INTERESTS',
        payload: [...currentInterests, 'franchise', 'investment']
      });
    }

    // 获取加盟信息
    fetchFranchiseInfo();
  }, [dispatch]); // 只依赖dispatch，避免无限循环

  const fetchFranchiseInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching franchise info...');
      const response = await api.content.getFranchiseInfo();
      console.log('Franchise API Response:', response);
      
      // ProtocolDocument 直接包含内容，不需要 success 和 data 属性
      if (response && response.content) {
        // 从 mockFranchiseInfo 获取完整的加盟信息
        // 注意：这里简化处理，实际应该从 API 响应转换
        const franchiseData = {
          advantages: [
            '品牌支持：西南地区知名台球连锁品牌',
            '技术培训：专业的技术和运营培训体系',
            '设备优势：自有工厂，设备成本低',
            '运营指导：总部提供持续运营支持',
            '区域保护：合理的区域保护政策'
          ],
          process: [
            { step: 1, title: '了解品牌', description: '通过官网、实地考察了解耶氏品牌' },
            { step: 2, title: '提交申请', description: '填写加盟申请表，提交相关资料' },
            { step: 3, title: '资质审核', description: '总部审核加盟商资质和选址' },
            { step: 4, title: '签订合同', description: '双方签订加盟合作协议' },
            { step: 5, title: '店面装修', description: '按照统一标准进行店面装修' },
            { step: 6, title: '设备安装', description: '总部提供设备并安排专业安装' },
            { step: 7, title: '人员培训', description: '店员接受专业技术和服务培训' },
            { step: 8, title: '开业运营', description: '正式开业，总部持续支持' }
          ],
          investment: {
            initial: '30-50万元',
            breakdown: {
              franchiseFee: '5万元',
              equipment: '15-25万元',
              decoration: '8-15万元',
              others: '2-5万元'
            },
            roi: '12-18个月',
            support: [
              '免费店面设计',
              '设备成本价供应',
              '开业营销支持',
              '持续运营指导'
            ]
          }
        };
        console.log('Setting franchise info:', franchiseData);
        setFranchiseInfo(franchiseData);
        trackClick('franchise-info-loaded');
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('数据格式错误');
      }
    } catch (error) {
      console.error('Failed to fetch franchise info:', error);
      setError(error instanceof Error ? error.message : '加载加盟信息失败');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yes-green mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !franchiseInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || '无法加载加盟信息'}</p>
          <Button onClick={fetchFranchiseInfo} variant="secondary">
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            加盟耶氏，共创辉煌
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl mb-8 max-w-3xl mx-auto"
          >
            加入西南地区最具影响力的台球连锁品牌
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-block"
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                trackClick('franchise-hero-cta');
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              立即咨询加盟
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Investment Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-yes-dark mb-4">投资概览</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              合理的投资规模，快速的回报周期，全方位的支持保障
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-primary-600 to-primary-500 text-white p-8 rounded-xl text-center"
            >
              <div className="text-5xl font-bold mb-2">{franchiseInfo.investment.initial}</div>
              <div className="text-xl mb-4">初始投资</div>
              <p className="opacity-90">包含装修、设备、首批物料等</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white p-8 rounded-xl text-center"
            >
              <div className="text-5xl font-bold mb-2">{franchiseInfo.investment.roi}</div>
              <div className="text-xl mb-4">回本周期</div>
              <p className="opacity-90">基于现有门店平均数据</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-primary-600 to-primary-500 text-white p-8 rounded-xl text-center"
            >
              <div className="text-5xl font-bold mb-2">20+</div>
              <div className="text-xl mb-4">成功门店</div>
              <p className="opacity-90">成熟的运营模式</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-neutral-800 text-center mb-12"
          >
            加盟优势
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {franchiseInfo.advantages.map((advantage, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 p-6 bg-white rounded-lg shadow-lg hover:shadow-lg transition-shadow">
                  <p className="text-gray-700">{advantage}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-12">
            加盟流程
          </h2>

          {/* Step Navigation */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="flex space-x-4 p-4">
              {franchiseInfo.process.map((step) => (
                <button
                  key={step.step}
                  onClick={() => {
                    setActiveStep(step.step);
                    trackClick(`franchise-step-${step.step}`);
                  }}
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                    activeStep === step.step
                      ? 'bg-primary-500 text-white scale-110'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {step.step}
                </button>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            {franchiseInfo.process
              .filter(step => step.step === activeStep)
              .map(step => (
                <div key={step.step} className="p-8 bg-white rounded-lg shadow-lg text-center">
                  <div className="text-6xl mb-6">
                    {['📞', '🏢', '📝', '🏗️', '🎊'][step.step - 1]}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                    第{step.step}步：{step.title}
                  </h3>
                  <p className="text-lg text-gray-700">{step.description}</p>
                </div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* Support System */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-12">
            全方位支持体系
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {franchiseInfo.investment.support.map((support, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">
                  {['📍', '🎨', '🎓', '📈'][index]}
                </div>
                <p className="font-medium text-gray-700">{support}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            成功案例
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur p-6 text-white rounded-lg shadow-lg">
              <div className="text-2xl mb-4">呈贡文化广场店</div>
              <p className="mb-4">开业首月即实现盈利，月营业额稳定在30万+</p>
              <div className="text-sm opacity-80">2019年开业</div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur p-6 text-white rounded-lg shadow-lg">
              <div className="text-2xl mb-4">五华区旗舰店</div>
              <p className="mb-4">日均客流200+，成为区域标杆门店</p>
              <div className="text-sm opacity-80">2020年开业</div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur p-6 text-white rounded-lg shadow-lg">
              <div className="text-2xl mb-4">晋宁青少年培训中心</div>
              <p className="mb-4">结合培训业务，营收多元化，回报率超预期</p>
              <div className="text-sm opacity-80">2021年开业</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-12">
            常见问题
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: '需要有台球行业经验吗？',
                a: '不需要。我们提供全面的培训和运营指导，零经验也能成功经营。'
              },
              {
                q: '总部提供哪些持续支持？',
                a: '包括但不限于：营销活动策划、新品推广、技术培训、运营督导、设备维护等。'
              },
              {
                q: '加盟费包含哪些内容？',
                a: '品牌使用权、开业支持、培训服务、运营手册、营销物料等。'
              },
              {
                q: '对选址有什么要求？',
                a: '建议面积300平米以上，位于人流密集区域，我们会提供专业的选址评估。'
              }
            ].map((faq, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                  {faq.q}
                </h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-yes-dark text-center mb-8">
              立即咨询加盟
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    您的姓名
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系电话
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入手机号"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  意向城市
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent"
                  placeholder="请输入您想开店的城市"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  投资预算
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent">
                  <option>请选择投资预算</option>
                  <option>30-40万</option>
                  <option>40-50万</option>
                  <option>50万以上</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  留言
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent"
                  placeholder="请告诉我们您的需求或疑问"
                />
              </div>

              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    trackClick('franchise-form-submit');
                    alert('感谢您的咨询！我们会尽快与您联系。');
                  }}
                >
                  提交咨询
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-gray-600">
              <p className="mb-2">或直接致电咨询</p>
              <p className="text-2xl font-bold text-yes-green">177-8714-7147</p>
            </div>
          </div>
        </div>
      </section>

      {/* Context指示器（开发模式） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs">
          <p>参与度：{engagementLevel}</p>
          <p>当前步骤：{activeStep}</p>
        </div>
      )}
    </div>
  );
};