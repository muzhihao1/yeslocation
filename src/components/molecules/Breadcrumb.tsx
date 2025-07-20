import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  // 路径映射
  const pathLabels: Record<string, string> = {
    '/': '首页',
    '/products': '产品',
    '/products/tables': '台球桌',
    '/products/accessories': '球杆配件',
    '/products/custom': '定制服务',
    '/training': '培训',
    '/training/courses': '课程体系',
    '/training/coaches': '教练团队',
    '/training/booking': '在线预约',
    '/stores': '门店',
    '/stores/map': '门店分布',
    '/stores/flagship': '旗舰店',
    '/stores/appointment': '预约到店',
    '/franchise': '加盟',
    '/about': '关于',
    '/contact': '联系我们'
  };
  
  // 生成面包屑路径
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: '首页', path: '/' }];
    
    // 如果在首页，不显示面包屑
    if (location.pathname === '/') {
      return [];
    }
    
    let currentPath = '';
    paths.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = pathLabels[currentPath] || segment;
      
      breadcrumbs.push({
        label,
        path: index === paths.length - 1 ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  // 不在首页时才显示面包屑
  if (breadcrumbs.length === 0) {
    return null;
  }
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-50 border-b border-neutral-200"
      aria-label="面包屑导航"
    >
      <div className="container">
        <ol className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              )}
              {item.path ? (
                <Link
                  to={item.path}
                  className="text-neutral-600 hover:text-primary-600 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-900 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </motion.nav>
  );
};