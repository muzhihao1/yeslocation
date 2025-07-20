import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useContextEngine } from '../context/ContextEngine';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { Button, Card } from '../components';
import { api, TrainingProgram } from '../services/api';

export const TrainingPage: React.FC = () => {
  const { trackClick, engagementLevel } = useBehaviorTracking();
  const { state, dispatch } = useContextEngine();
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'installation' | 'academy' | 'all'>('all');
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  useEffect(() => {
    // 更新用户兴趣
    const currentInterests = state.molecules.userInterests || [];
    if (!currentInterests.includes('training')) {
      dispatch({
        type: 'UPDATE_INTERESTS',
        payload: [...currentInterests, 'training', 'education']
      });
    }

    // 获取培训课程
    fetchTrainingPrograms();
  }, [dispatch]); // 只依赖dispatch，避免无限循环

  const fetchTrainingPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.training.getAll();
      
      if (response.success && response.data) {
        setTrainingPrograms(response.data);
        trackClick('training-programs-loaded');
      } else {
        throw new Error(response.error?.message || '加载失败');
      }
    } catch (error) {
      console.error('Failed to fetch training programs:', error);
      setError(error instanceof Error ? error.message : '加载培训课程失败');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredPrograms = selectedCategory === 'all' 
    ? trainingPrograms 
    : trainingPrograms.filter(p => p.category === selectedCategory);
    
  const categories = [
    { id: 'all', name: '全部课程', icon: '🎯' },
    { id: 'installation', name: '安装维修', icon: '🔧' },
    { id: 'academy', name: '技术培训', icon: '🎱' }
  ];

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchTrainingPrograms} variant="secondary">
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
        className="relative bg-gradient-to-br from-yes-dark to-yes-green text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            专业培训中心
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl mb-8 max-w-3xl mx-auto"
          >
            从零基础到专业高手，我们陪您一路成长
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                trackClick('training-hero-cta');
                document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              立即报名
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-yes-dark text-center mb-12">
            为什么选择耶氏培训
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-yes-dark mb-2">专业认证</h3>
              <p className="text-gray-600">颁发行业认可的专业证书</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-semibold text-yes-dark mb-2">资深教练</h3>
              <p className="text-gray-600">多年实战经验的专业教练团队</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-yes-dark mb-2">实战教学</h3>
              <p className="text-gray-600">理论结合实践的教学模式</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-yes-dark mb-2">就业保障</h3>
              <p className="text-gray-600">优秀学员直接推荐就业</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Training Categories */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-yes-dark text-center mb-12"
          >
            培训课程
          </motion.h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id as 'all' | 'installation' | 'academy');
                  trackClick(`training-category-${category.id}`);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-yes-green text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yes-green mx-auto"></div>
              </div>
            ) : filteredPrograms.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-600">
                暂无{selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory)?.name : ''}课程
              </div>
            ) : (
              filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="h-full bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-yes-dark mb-4">{program.title}</h3>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🕑</span>
                          <div>
                            <span className="font-semibold text-gray-700">培训时长：</span>
                            <span className="text-gray-600">{program.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🎓</span>
                          <div>
                            <span className="font-semibold text-gray-700">难度级别：</span>
                            <span className="text-gray-600">
                              {program.level === 'beginner' ? '初级' : 
                               program.level === 'intermediate' ? '中级' : '高级'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">💰</span>
                          <div>
                            <span className="font-semibold text-gray-700">培训费用：</span>
                            <span className="text-yes-green font-bold">¥{program.price}</span>
                          </div>
                        </div>
                        {program.certification && (
                          <div className="flex items-center gap-3">
                            <span className="text-lg">🏆</span>
                            <div>
                              <span className="font-semibold text-gray-700">认证证书：</span>
                              <span className="text-yes-green">✓ 提供</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {program.modules && program.modules.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-700 mb-2">课程模块：</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {program.modules.slice(0, 3).map((module, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="text-yes-green">•</span>
                                {module}
                              </li>
                            ))}
                            {program.modules.length > 3 && (
                              <li className="text-gray-500">及其他 {program.modules.length - 3} 个模块...</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedProgram(program);
                            setShowEnrollForm(true);
                            trackClick(`enroll-program-${program.id}`);
                          }}
                        >
                          立即报名
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            trackClick(`view-details-${program.id}`);
                            // 查看详情功能
                          }}
                        >
                          了解详情
                        </Button>
                      </div>
                    </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.section>

      {/* Instructors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-yes-dark text-center mb-12">
            专业教练团队
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-32 h-32 bg-gradient-to-br from-yes-green to-yes-dark rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                张教练
              </div>
              <h3 className="text-xl font-semibold text-yes-dark mb-2">张明华</h3>
              <p className="text-yes-green mb-2">高级技术教练</p>
              <p className="text-gray-600">15年专业台球教学经验，培养出多名省级比赛冠军</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-32 h-32 bg-gradient-to-br from-yes-dark to-yes-green rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                李教练
              </div>
              <h3 className="text-xl font-semibold text-yes-dark mb-2">李建国</h3>
              <p className="text-yes-green mb-2">运营管理专家</p>
              <p className="text-gray-600">10年连锁门店管理经验，精通台球厅运营管理</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-32 h-32 bg-gradient-to-br from-yes-green to-yes-dark rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                王师傅
              </div>
              <h3 className="text-xl font-semibold text-yes-dark mb-2">王志强</h3>
              <p className="text-yes-green mb-2">安装技术总监</p>
              <p className="text-gray-600">20年台球桌安装维护经验，技术精湛</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gradient-to-r from-yes-dark to-yes-green text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            学员成功故事
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur p-6 text-white rounded-lg shadow-lg">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🌟</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">刘小明 - 从爱好者到职业选手</h3>
                  <p className="opacity-90">
                    通过3个月的系统培训，从业余爱好者成长为省级比赛前八强，现已签约成为职业选手。
                  </p>
                  <p className="text-sm opacity-70 mt-2">2023年毕业学员</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur p-6 text-white rounded-lg shadow-lg">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💼</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">王美丽 - 成功创业开店</h3>
                  <p className="opacity-90">
                    完成运营管理培训后，在老家成功开设台球厅，月营业额超15万，已准备开第二家店。
                  </p>
                  <p className="text-sm opacity-70 mt-2">2022年毕业学员</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form */}
      <section id="enrollment-form" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-yes-dark text-center mb-8">
              立即报名
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    您的姓名
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系电话
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent"
                    placeholder="请输入手机号"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择课程
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent">
                  <option>请选择培训课程</option>
                  <option value="installation">安装维修培训</option>
                  <option value="academy">台球技术培训</option>
                  {selectedProgram && (
                    <option value={selectedProgram.id} selected>{selectedProgram.title}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前水平
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent">
                  <option>请选择您的当前水平</option>
                  <option>零基础</option>
                  <option>初级水平</option>
                  <option>中级水平</option>
                  <option>高级水平</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注说明
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent"
                  placeholder="请告诉我们您的学习目标或特殊需求"
                />
              </div>

              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    trackClick('training-form-submit');
                    alert('感谢您的报名！我们会尽快与您联系。');
                  }}
                >
                  提交报名
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-gray-600">
              <p className="mb-2">咨询热线</p>
              <p className="text-2xl font-bold text-yes-green">177-8714-7147</p>
            </div>
          </div>
        </div>
      </section>

      {/* Context指示器（开发模式） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs">
          <p>参与度：{engagementLevel}</p>
          <p>选中课程：{selectedCategory}</p>
        </div>
      )}
    </div>
  );
};