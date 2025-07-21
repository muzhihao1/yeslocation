import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/molecules/Card';
import { Button } from '../components/atoms/Button';
import { Grid, Container, Show, Spacer } from '../components/molecules/Grid';
import { SEO } from '../components/atoms/SEO';
import { useContextEngine } from '../context/ContextEngine';
import { api } from '../services/api';
import { generateSearchBoxSchema } from '../utils/structuredData';
import { useCMSContents } from '../hooks/useCMS';
import { CMSKeys } from '../types/cms';
import type { Product, Store, TrainingProgram } from '../types/models';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContextEngine();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredStores, setFeaturedStores] = useState<Store[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);

  // 使用CMS内容
  const { contents: cmsContent } = useCMSContents([
    CMSKeys.HOME_HERO_TITLE,
    CMSKeys.HOME_HERO_SUBTITLE,
    CMSKeys.HOME_HERO_CTA,
    CMSKeys.HOME_VALUE_PROP_1_TITLE,
    CMSKeys.HOME_VALUE_PROP_1_DESC,
    CMSKeys.HOME_VALUE_PROP_2_TITLE,
    CMSKeys.HOME_VALUE_PROP_2_DESC,
    CMSKeys.HOME_VALUE_PROP_3_TITLE,
    CMSKeys.HOME_VALUE_PROP_3_DESC,
    CMSKeys.COMPANY_NAME,
  ]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [productsRes, storesRes, coursesRes] = await Promise.all([
        api.products.getAll(),
        api.stores.getAll(),
        api.training.getAll(),
      ]);

      if (productsRes.success && productsRes.data) {
        setFeaturedProducts(productsRes.data.slice(0, 3));
      }
      if (storesRes.success && storesRes.data) {
        setFeaturedStores(storesRes.data.slice(0, 2));
      }
      if (coursesRes.success && coursesRes.data) {
        setFeaturedCourses(coursesRes.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCTAClick = (action: string) => {
    // Track interaction via dispatch if needed
    switch (action) {
      case 'view_products':
        navigate('/products');
        break;
      case 'find_store':
        navigate('/stores');
        break;
      case 'book_training':
        navigate('/training');
        break;
      default:
        break;
    }
  };

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <SEO
        title="首页"
        description="云南耶氏体育，专业台球俱乐部。提供高端台球器材销售、专业培训课程、场地预约等一站式服务。拥有10+连锁门店，50+专业教练，15年行业经验。"
        jsonLd={generateSearchBoxSchema()}
      />
      <div className="min-h-screen bg-neutral-50">
      {/* 英雄区域 */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 grid-background opacity-10" />
        </div>

        {/* 装饰元素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-float animation-delay-300" />

        {/* 内容 */}
        <div className="relative z-10 container text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white">
              {cmsContent[CMSKeys.HOME_HERO_TITLE] || '专业台球 始于热爱'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">
              {cmsContent[CMSKeys.HOME_HERO_SUBTITLE] || '云南耶氏体育，您身边的台球专家'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => handleCTAClick('book_training')}
                className="shadow-xl hover:shadow-2xl"
              >
                {cmsContent[CMSKeys.HOME_HERO_CTA] || '免费体验课程'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleCTAClick('view_products')}
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                浏览产品
              </Button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 价值主张 */}
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
              <span className="text-gradient"> {cmsContent[CMSKeys.COMPANY_NAME] || '耶氏体育'}</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              专业品质，贴心服务，让每一位台球爱好者都能享受纯粹的运动乐趣
            </p>
          </motion.div>

          <Grid
            cols={{ xs: 1, sm: 2, md: 3 }}
            gap={{ xs: '1.5rem', md: '2rem' }}
          >
            {[
              {
                icon: '🏆',
                title: cmsContent[CMSKeys.HOME_VALUE_PROP_1_TITLE] || '20年匠心工艺',
                description: cmsContent[CMSKeys.HOME_VALUE_PROP_1_DESC] || '西南地区唯一台球设备制造商',
              },
              {
                icon: '🎯',
                title: cmsContent[CMSKeys.HOME_VALUE_PROP_2_TITLE] || '专业培训体系',
                description: cmsContent[CMSKeys.HOME_VALUE_PROP_2_DESC] || '专业教练团队，科学训练体系',
              },
              {
                icon: '🌟',
                title: cmsContent[CMSKeys.HOME_VALUE_PROP_3_TITLE] || '一站式服务',
                description: cmsContent[CMSKeys.HOME_VALUE_PROP_3_DESC] || '从设备到运营，全程支持',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center text-5xl group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 shadow-lg">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-800">{item.title}</h3>
                <p className="text-lg text-neutral-600 leading-relaxed px-4">{item.description}</p>
              </motion.div>
            ))}
          </Grid>
        </div>
      </section>

      {/* 精选产品 */}
      <section className="py-20 bg-neutral-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">精选产品</h2>
              <p className="text-xl text-neutral-600">专业装备，助您称霸球场</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/products')}
              className="hidden md:flex"
            >
              查看全部 →
            </Button>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-white rounded-xl shadow-card animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <Card
                    title={product.name}
                    description={product.description}
                    image={product.image}
                    category={product.category}
                    tags={[product.brand]}
                    action={{
                      label: '查看详情',
                      onClick: () => {
                        navigate('/products');
                      },
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" onClick={() => navigate('/products')}>
              查看全部产品 →
            </Button>
          </div>
        </div>
      </section>

      {/* 培训课程 */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">专业培训课程</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              从入门到精通，我们为您提供最专业的台球培训
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${
                  index === 0 ? 'from-green-400 to-green-600' :
                  index === 1 ? 'from-blue-400 to-blue-600' :
                  'from-purple-400 to-purple-600'
                }`} />
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-neutral-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-primary-600">¥{course.price}</span>
                    <span className="text-sm text-neutral-500">{course.duration}</span>
                  </div>
                  <Button
                    fullWidth
                    variant={index === 1 ? 'primary' : 'outline'}
                    onClick={() => {
                      navigate('/training');
                    }}
                  >
                    了解详情
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 数据展示 */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: '20+', label: '连锁门店' },
              { number: '70000+', label: '会员' },
              { number: '50+', label: '专业教练' },
              { number: '15年', label: '行业经验' },
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-20 bg-neutral-50">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              准备好开始您的台球之旅了吗？
            </h2>
            <p className="text-xl text-neutral-600 mb-8">
              立即预约体验，感受专业台球的魅力
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleCTAClick('book_training')}
              >
                预约免费体验
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact')}
              >
                联系我们
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
};