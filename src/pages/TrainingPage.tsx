import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContextEngine } from '../context/ContextEngine';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { Button, Card, TrainingDetailsModal } from '../components';
import { api, TrainingProgram } from '../services/api';

// 路由路径到视图的映射
const pathToViewMap: Record<string, string> = {
  '/training': 'courses', // 默认显示课程体系
  '/training/courses': 'courses',
  '/training/coaches': 'coaches', 
  '/training/booking': 'booking'
};

export const TrainingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackClick, engagementLevel } = useBehaviorTracking();
  const { state, dispatch } = useContextEngine();
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'installation' | 'academy' | 'all'>('all');
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsProgram, setDetailsProgram] = useState<TrainingProgram | null>(null);
  
  // 根据路由路径确定当前视图
  const currentView = pathToViewMap[location.pathname] || 'courses';
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    programId: '',
    level: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  // 表单验证
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = '请输入您的姓名';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = '请输入联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      errors.phone = '请输入正确的手机号码';
    }
    
    if (!formData.programId) {
      errors.programId = '请选择培训课程';
    }
    
    if (!formData.level) {
      errors.level = '请选择您的当前水平';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    trackClick('training-form-submit');
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 成功提交
      setSubmitSuccess(true);
      
      // 重置表单
      setFormData({
        name: '',
        phone: '',
        programId: '',
        level: '',
        message: ''
      });
      setSelectedProgram(null);
      setFormErrors({});
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setFormErrors({ submit: '提交失败，请稍后重试' });
    } finally {
      setSubmitting(false);
    }
  };

  // 更新选中的课程时同步更新表单数据
  useEffect(() => {
    if (selectedProgram) {
      setFormData(prev => ({ ...prev, programId: selectedProgram.id }));
    }
  }, [selectedProgram]);
  
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
    <div className="min-h-screen pt-16 md:pt-20 bg-gray-50">
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
            className="text-5xl font-bold mb-6 text-white"
          >
            专业培训中心
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl mb-8 max-w-3xl mx-auto text-white/90"
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

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'courses'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                navigate('/training/courses');
                trackClick('training-nav-courses');
              }}
            >
              课程体系
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'coaches'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                navigate('/training/coaches');
                trackClick('training-nav-coaches');
              }}
            >
              教练团队
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'booking'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                navigate('/training/booking');
                trackClick('training-nav-booking');
              }}
            >
              在线预约
            </button>
          </nav>
        </div>
      </section>

      {/* Conditional Content Based on View */}
      {currentView === 'courses' ? (
        <>
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
                            // Scroll to enrollment form
                            setTimeout(() => {
                              document.getElementById('enrollment-form')?.scrollIntoView({ 
                                behavior: 'smooth',
                                block: 'center'
                              });
                              // Reset the flag after animation
                              setTimeout(() => setShowEnrollForm(false), 500);
                            }, 100);
                          }}
                        >
                          立即报名
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            trackClick(`view-details-${program.id}`);
                            setDetailsProgram(program);
                            setShowDetailsModal(true);
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

          {/* Success Stories */}
          <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-500">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-white">
                学员成功故事
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white bg-opacity-20 backdrop-blur p-6 rounded-lg shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🌟</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">刘小明 - 从爱好者到职业选手</h3>
                      <p className="text-white/90">
                        通过3个月的系统培训，从业余爱好者成长为省级比赛前八强，现已签约成为职业选手。
                      </p>
                      <p className="text-sm text-white/70 mt-2">2023年毕业学员</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 backdrop-blur p-6 rounded-lg shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">💼</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">王美丽 - 成功创业开店</h3>
                      <p className="text-white/90">
                        完成运营管理培训后，在老家成功开设台球厅，月营业额超15万，已准备开第二家店。
                      </p>
                      <p className="text-sm text-white/70 mt-2">2022年毕业学员</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : currentView === 'coaches' ? (
        /* Instructors */
        <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-yes-dark text-center mb-12">
            专业教练团队
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                耿教练
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">耿新位</h3>
              <p className="text-primary-600 mb-2">高级技术教练</p>
              <p className="text-gray-600">15年专业台球教学经验，培养出多名省级比赛冠军</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                陈教练
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">陈东泽</h3>
              <p className="text-primary-600 mb-2">运营管理专家</p>
              <p className="text-gray-600">10年连锁门店管理经验，精通台球厅运营管理</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                庞师傅
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">庞明儒</h3>
              <p className="text-primary-600 mb-2">安装技术总监</p>
              <p className="text-gray-600">20年台球桌安装维护经验，技术精湛</p>
            </div>
          </div>
        </div>
      </section>
      ) : currentView === 'booking' ? (
        /* Enrollment Form */
        <section id="enrollment-form" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg"
            animate={{ 
              scale: showEnrollForm ? [1, 1.02, 1] : 1,
              boxShadow: showEnrollForm 
                ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-yes-dark text-center mb-8">
              立即报名
            </h2>
            
            {/* 成功消息 */}
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-green-800 font-medium text-center">
                  ✅ 报名成功！我们会尽快与您联系。
                </p>
              </motion.div>
            )}
            
            {/* 全局错误消息 */}
            {formErrors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-800 font-medium text-center">
                  {formErrors.submit}
                </p>
              </motion.div>
            )}
            
            {selectedProgram && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-green-800 font-medium">
                  已选择课程：<span className="font-bold">{selectedProgram.title}</span>
                </p>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    您的姓名
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入姓名"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系电话
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入手机号"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择课程
                </label>
                <select 
                  value={formData.programId}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, programId: e.target.value }));
                    const program = trainingPrograms.find(p => p.id === e.target.value);
                    setSelectedProgram(program || null);
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent ${
                    formErrors.programId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">请选择培训课程</option>
                  {trainingPrograms.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.title}
                    </option>
                  ))}
                </select>
                {formErrors.programId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.programId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前水平
                </label>
                <select 
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent ${
                    formErrors.level ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">请选择您的当前水平</option>
                  <option value="beginner">零基础</option>
                  <option value="elementary">初级水平</option>
                  <option value="intermediate">中级水平</option>
                  <option value="advanced">高级水平</option>
                </select>
                {formErrors.level && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.level}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注说明
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yes-green focus:border-transparent"
                  placeholder="请告诉我们您的学习目标或特殊需求"
                />
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="min-w-[160px]"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      提交中...
                    </span>
                  ) : (
                    '提交报名'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-gray-600">
              <p className="mb-2">咨询热线</p>
              <p className="text-2xl font-bold text-yes-green">177-8714-7147</p>
            </div>
          </motion.div>
        </div>
      </section>
      ) : null}

      {/* Training Details Modal */}
      <TrainingDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setDetailsProgram(null);
        }}
        program={detailsProgram}
        onEnroll={(program) => {
          setSelectedProgram(program);
          setShowEnrollForm(true);
          trackClick(`enroll-from-details-${program.id}`);
          // Scroll to enrollment form
          setTimeout(() => {
            document.getElementById('enrollment-form')?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'center'
            });
          }, 100);
        }}
      />

      {/* Context指示器（开发模式） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs">
          <p>参与度：{engagementLevel}</p>
          <p>当前视图：{currentView}</p>
          <p>选中分类：{selectedCategory}</p>
        </div>
      )}
    </div>
  );
};