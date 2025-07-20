import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ContextEngineProvider } from './context/ContextEngine';
import { Navigation, Breadcrumb, MobileBottomNav, PageLoader } from './components';
import { PWAInstallPrompt } from './components/molecules/PWAInstallPrompt';
import { ServiceWorkerUpdatePrompt } from './components/molecules/ServiceWorkerUpdatePrompt';
import { OfflineIndicator } from './components/molecules/OfflineIndicator';
import { ChatWidget } from './components/organisms/ChatWidget';
import { useAnalytics } from './hooks/useAnalytics';

// 懒加载页面组件
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const StorePage = lazy(() => import('./pages/StorePage').then(module => ({ default: module.StorePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const FranchisePage = lazy(() => import('./pages/FranchisePage').then(module => ({ default: module.FranchisePage })));
const TrainingPage = lazy(() => import('./pages/TrainingPage').then(module => ({ default: module.TrainingPage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then(module => ({ default: module.ProductsPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CMSAdmin = lazy(() => import('./pages/CMSAdmin'));
const CopyOptimizationAdmin = lazy(() => import('./pages/CopyOptimizationAdmin'));

// 应用内容组件（需要在 Router 内使用 hooks）
function AppContent() {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | undefined>();
  
  // 初始化分析
  useAnalytics();

  useEffect(() => {
    // 获取 Service Worker 注册信息
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        setSwRegistration(registration);
      });
    }
  }, []);

  return (
    <div className="App">
      <Navigation />
      <Breadcrumb />
      <OfflineIndicator />
      <Suspense fallback={<PageLoader />}>
        <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/stores" element={<StorePage />} />
                <Route path="/stores/map" element={<StorePage />} />
                <Route path="/stores/flagship" element={<StorePage />} />
                <Route path="/stores/appointment" element={<StorePage />} />
                <Route path="/franchise" element={<FranchisePage />} />
                <Route path="/training" element={<TrainingPage />} />
                <Route path="/training/courses" element={<TrainingPage />} />
                <Route path="/training/coaches" element={<TrainingPage />} />
                <Route path="/training/booking" element={<TrainingPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/tables" element={<ProductsPage />} />
                <Route path="/products/accessories" element={<ProductsPage />} />
                <Route path="/products/custom" element={<ProductsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/cms" element={<CMSAdmin />} />
                <Route path="/admin/copy-optimization" element={<CopyOptimizationAdmin />} />
        </Routes>
      </Suspense>
      <MobileBottomNav />
      <PWAInstallPrompt />
      <ServiceWorkerUpdatePrompt registration={swRegistration} />
      <ChatWidget />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ContextEngineProvider>
        <Router>
          <AppContent />
        </Router>
      </ContextEngineProvider>
    </HelmetProvider>
  );
}

export default App;
