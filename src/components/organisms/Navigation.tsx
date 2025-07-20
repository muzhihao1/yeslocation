import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../atoms/Logo';
import { useContextEngine } from '../../context/ContextEngine';

interface NavItem {
  label: string;
  path: string;
  icon?: string;
  badge?: string;
  subMenu?: {
    label: string;
    path: string;
  }[];
}

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { state } = useContextEngine();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<number[]>([]);
  
  // 基础导航项 - 精简为6个主要项目
  const baseNavItems: NavItem[] = [
    { 
      label: '首页', 
      path: '/',
      icon: 'home'
    },
    { 
      label: '产品', 
      path: '/products',
      icon: 'pool',
      subMenu: [
        { label: '台球桌', path: '/products/tables' },
        { label: '球杆配件', path: '/products/accessories' },
        { label: '定制服务', path: '/products/custom' }
      ]
    },
    { 
      label: '培训', 
      path: '/training',
      icon: 'school',
      subMenu: [
        { label: '课程体系', path: '/training/courses' },
        { label: '教练团队', path: '/training/coaches' },
        { label: '在线预约', path: '/training/booking' }
      ]
    },
    { 
      label: '门店', 
      path: '/stores',
      icon: 'store',
      subMenu: [
        { label: '门店分布', path: '/stores/map' },
        { label: '旗舰店', path: '/stores/flagship' },
        { label: '预约到店', path: '/stores/appointment' }
      ]
    },
    { 
      label: '加盟', 
      path: '/franchise',
      icon: 'business'
    },
    { 
      label: '关于', 
      path: '/about',
      icon: 'info'
    }
  ];

  // 基于用户行为排序导航项
  const sortedNavItems = React.useMemo(() => {
    const priority = state.molecules.contentPriority;
    return [...baseNavItems].sort((a, b) => {
      const aPriority = priority.get(a.path) || 0;
      const bPriority = priority.get(b.path) || 0;
      return bPriority - aPriority;
    });
  }, [state.molecules.contentPriority]);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 关闭移动菜单当路由改变
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* 导航栏 */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-soft' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <Logo size="md" showText={true} />
            </Link>

            {/* 桌面导航 */}
            <div className="hidden lg:flex items-center space-x-1">
              {sortedNavItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                  onMouseEnter={() => item.subMenu && setActiveDropdown(index)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.path}
                    className={`relative flex items-center px-5 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                      isActive(item.path)
                        ? 'text-primary-600'
                        : 'text-neutral-700 hover:text-primary-600'
                    }`}
                  >
                    {/* 活动指示器 */}
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary-50 rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.25 }}
                      />
                    )}
                    
                    {item.label}
                    
                    {/* 下拉箭头 */}
                    {item.subMenu && (
                      <svg 
                        className="ml-1 w-4 h-4 transition-transform duration-200"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    
                    {/* 优先级指示器 */}
                    {index === 0 && (state.molecules.contentPriority.get(item.path) || 0) > 5 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary-500 rounded-full" />
                    )}
                  </Link>
                  
                  {/* 下拉菜单 */}
                  <AnimatePresence>
                    {item.subMenu && activeDropdown === index && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-neutral-100 overflow-hidden"
                      >
                        {item.subMenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="block px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* CTA按钮 */}
            <div className="hidden lg:flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2.5 text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                咨询热线
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-secondary-500 text-white font-medium rounded-lg shadow-sm hover:bg-secondary-600 hover:shadow-md transition-all duration-200"
              >
                免费体验
              </motion.button>
            </div>

            {/* 移动菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 8 : 0 }}
                  className="w-full h-0.5 bg-neutral-800 rounded-full origin-left transition-all duration-300"
                />
                <motion.span
                  animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                  className="w-full h-0.5 bg-neutral-800 rounded-full transition-all duration-300"
                />
                <motion.span
                  animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -8 : 0 }}
                  className="w-full h-0.5 bg-neutral-800 rounded-full origin-left transition-all duration-300"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* 移动菜单 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* 菜单面板 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                  <Logo size="sm" showText={true} />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* 导航项 */}
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="space-y-1 px-4">
                    {sortedNavItems.map((item, index) => {
                      const isExpanded = expandedMobileMenus.includes(index);
                      return (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div
                            onClick={() => {
                              if (item.subMenu) {
                                setExpandedMobileMenus(prev => 
                                  prev.includes(index) 
                                    ? prev.filter(i => i !== index)
                                    : [...prev, index]
                                );
                              } else {
                                window.location.href = item.path;
                              }
                            }}
                            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                              isActive(item.path)
                                ? 'bg-primary-50 text-primary-600 font-medium'
                                : 'text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span>{item.label}</span>
                            <div className="flex items-center">
                              {index === 0 && (state.molecules.contentPriority.get(item.path) || 0) > 5 && (
                                <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2" />
                              )}
                              {item.subMenu && (
                                <svg 
                                  className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          
                          {/* 子菜单 */}
                          <AnimatePresence>
                            {item.subMenu && isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="ml-4 mt-1 space-y-1">
                                  {item.subMenu.map((subItem) => (
                                    <Link
                                      key={subItem.path}
                                      to={subItem.path}
                                      className="block px-4 py-2 text-sm text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors duration-200"
                                    >
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* 底部CTA */}
                <div className="p-6 border-t border-neutral-100">
                  <button className="w-full px-6 py-3 bg-secondary-500 text-white font-medium rounded-lg shadow-sm hover:bg-secondary-600 hover:shadow-md transition-all duration-200">
                    免费体验
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 占位符 */}
      <div className="h-16 md:h-20" />
    </>
  );
};