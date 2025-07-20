import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContextEngine } from '../context/ContextEngine';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { Button } from '../components';

export const ContactPage: React.FC = () => {
  const { trackClick, engagementLevel } = useBehaviorTracking();
  const { state, dispatch } = useContextEngine();

  useEffect(() => {
    // 更新用户兴趣
    dispatch({
      type: 'UPDATE_INTERESTS',
      payload: [...state.molecules.userInterests, 'contact', 'support']
    });
  }, []);

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

  const contactMethods = [
    {
      icon: '📞',
      title: '电话咨询',
      primary: '177-8714-7147',
      secondary: '24小时服务热线',
      action: () => {
        trackClick('contact-phone');
        window.location.href = 'tel:17787147147';
      }
    },
    {
      icon: '💬',
      title: '微信咨询',
      primary: 'YES147147',
      secondary: '扫码添加客服',
      action: () => {
        trackClick('contact-wechat');
        alert('微信号：YES147147');
      }
    },
    {
      icon: '📧',
      title: '邮件咨询',
      primary: 'info@yes147.com',
      secondary: '1-2个工作日回复',
      action: () => {
        trackClick('contact-email');
        window.location.href = 'mailto:info@yes147.com';
      }
    },
    {
      icon: '📍',
      title: '到店咨询',
      primary: '20家门店',
      secondary: '查看最近门店',
      action: () => {
        trackClick('contact-store');
        window.location.href = '/stores';
      }
    }
  ];

  const departments = [
    { name: '加盟合作', phone: '177-8714-7147', ext: '分机 1' },
    { name: '产品销售', phone: '177-8714-7147', ext: '分机 2' },
    { name: '培训报名', phone: '177-8714-7147', ext: '分机 3' },
    { name: '售后服务', phone: '177-8714-7147', ext: '分机 4' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-yes-dark to-yes-green text-white py-16"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            联系我们
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl max-w-3xl mx-auto"
          >
            专业团队随时为您服务
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Methods */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="bg-white rounded-lg shadow-lg p-6 text-center cursor-pointer hover:shadow-lg transition-shadow h-full"
                  onClick={method.action}
                >
                  <div className="text-5xl mb-4">{method.icon}</div>
                  <h3 className="text-lg font-semibold text-yes-dark mb-2">{method.title}</h3>
                  <p className="text-xl font-bold text-yes-green mb-1">{method.primary}</p>
                  <p className="text-sm text-gray-600">{method.secondary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Company Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Headquarters Info */}
            <div>
              <h2 className="text-3xl font-bold text-yes-dark mb-8">总部信息</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🏢</div>
                  <div>
                    <h3 className="font-semibold text-yes-dark mb-1">公司全称</h3>
                    <p className="text-gray-700">云南耶氏体育文化发展有限公司</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h3 className="font-semibold text-yes-dark mb-1">总部地址</h3>
                    <p className="text-gray-700">云南省昆明市呈贡区吴家营街道办事处</p>
                    <p className="text-gray-700">春融街上海东盟大厦B座12楼</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">⏰</div>
                  <div>
                    <h3 className="font-semibold text-yes-dark mb-1">办公时间</h3>
                    <p className="text-gray-700">周一至周五：9:00 - 18:00</p>
                    <p className="text-gray-700">周六周日：10:00 - 17:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">🏭</div>
                  <div>
                    <h3 className="font-semibold text-yes-dark mb-1">生产基地</h3>
                    <p className="text-gray-700">云南省昆明市晋宁工业园区</p>
                    <p className="text-gray-700">占地5000平方米现代化厂房</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Contacts */}
            <div>
              <h2 className="text-3xl font-bold text-yes-dark mb-8">部门联系</h2>
              
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-yes-dark">{dept.name}</h3>
                        <p className="text-gray-600">{dept.phone}</p>
                      </div>
                      <div className="text-sm text-gray-500">{dept.ext}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yes-green bg-opacity-10 rounded-lg">
                <p className="text-sm text-yes-dark">
                  <span className="font-semibold">温馨提示：</span>
                  如需紧急服务，请直接拨打24小时服务热线
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gradient-to-r from-yes-dark to-yes-green text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            快速链接
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <a
                href="/stores"
                onClick={() => trackClick('contact-quick-stores')}
                className="block p-6 bg-white bg-opacity-10 backdrop-blur rounded-lg hover:bg-opacity-20 transition-all"
              >
                <div className="text-4xl mb-2">🗺️</div>
                <div className="font-semibold">门店分布</div>
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <a
                href="/franchise"
                onClick={() => trackClick('contact-quick-franchise')}
                className="block p-6 bg-white bg-opacity-10 backdrop-blur rounded-lg hover:bg-opacity-20 transition-all"
              >
                <div className="text-4xl mb-2">🤝</div>
                <div className="font-semibold">加盟合作</div>
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <a
                href="/training"
                onClick={() => trackClick('contact-quick-training')}
                className="block p-6 bg-white bg-opacity-10 backdrop-blur rounded-lg hover:bg-opacity-20 transition-all"
              >
                <div className="text-4xl mb-2">🎓</div>
                <div className="font-semibold">培训报名</div>
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <a
                href="/products"
                onClick={() => trackClick('contact-quick-products')}
                className="block p-6 bg-white bg-opacity-10 backdrop-blur rounded-lg hover:bg-opacity-20 transition-all"
              >
                <div className="text-4xl mb-2">🎱</div>
                <div className="font-semibold">产品中心</div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold text-yes-dark text-center mb-8">
              在线留言
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    您的姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent"
                    placeholder="请输入姓名"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent"
                    placeholder="请输入手机号"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  电子邮箱
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent"
                  placeholder="请输入邮箱地址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  咨询类型
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent">
                  <option>请选择咨询类型</option>
                  <option>加盟合作</option>
                  <option>产品咨询</option>
                  <option>培训报名</option>
                  <option>售后服务</option>
                  <option>投诉建议</option>
                  <option>其他咨询</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  留言内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent"
                  placeholder="请详细描述您的需求或问题"
                  required
                />
              </div>

              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    trackClick('contact-form-submit');
                    alert('感谢您的留言！我们会在1-2个工作日内回复您。');
                  }}
                >
                  提交留言
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">© 2023 云南耶氏体育文化发展有限公司 版权所有</p>
          <p className="text-sm">滇ICP备2023XXXXX号-1 | 滇公网安备53011402000XXX号</p>
        </div>
      </section>

      {/* Context指示器（开发模式） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs">
          <p>参与度：{engagementLevel}</p>
          <p>用户兴趣：{state.molecules.userInterests.join(', ')}</p>
        </div>
      )}
    </div>
  );
};