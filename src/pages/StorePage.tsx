import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useContextEngine } from '../context/ContextEngine';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { Button, Card, BookingModal } from '../components';
import { StoreCard } from '../components/molecules/StoreCard';
import { api, Store, DataResponse, StoreStatistics } from '../services/api';

export const StorePage: React.FC = () => {
  const { trackClick, engagementLevel } = useBehaviorTracking();
  const { state, dispatch } = useContextEngine();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [statistics, setStatistics] = useState<StoreStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  
  useEffect(() => {
    // 更新用户兴趣
    const currentInterests = state.molecules.userInterests || [];
    if (!currentInterests.includes('stores')) {
      dispatch({
        type: 'UPDATE_INTERESTS',
        payload: [...currentInterests, 'stores']
      });
    }
    
    // 获取门店数据
    fetchStoreData();
  }, [dispatch]); // 只依赖dispatch，避免无限循环
  
  const fetchStoreData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 并行获取门店列表和统计数据
      const [storesResponse, statsResponse] = await Promise.all([
        api.stores.getAll(),
        api.stores.getStatistics()
      ]);
      
      if (storesResponse.success && storesResponse.data) {
        setStores(storesResponse.data);
      } else {
        throw new Error(storesResponse.error?.message || '获取门店数据失败');
      }
      
      if (statsResponse.success && statsResponse.data) {
        setStatistics(statsResponse.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
      console.error('Failed to fetch store data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDistrictClick = (district: string) => {
    setSelectedDistrict(district);
    trackClick(`district-filter-${district}`);
  };
  
  const filteredStores = selectedDistrict === 'all' 
    ? stores 
    : stores.filter(store => store.district === selectedDistrict);
  
  // 方案1：使用iframe嵌入现有地图页面
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-4xl font-bold text-yes-dark text-center mb-4">
          门店分布
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          20家门店遍布昆明，总有一家在您身边
        </p>
        
        {/* 快速统计 */}
        {loading ? (
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yes-green"></div>
          </div>
        ) : error ? (
          <div className="text-center mb-8 text-red-600">
            <p>{error}</p>
            <Button onClick={fetchStoreData} variant="secondary" size="sm" className="mt-2">
              重试
            </Button>
          </div>
        ) : statistics ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleDistrictClick('all')}
              className={`bg-white p-4 rounded-lg shadow text-center cursor-pointer transition-all hover:shadow-lg ${
                selectedDistrict === 'all' ? 'ring-2 ring-yes-green' : ''
              }`}
            >
              <div className="text-2xl font-bold text-yes-green">{statistics.totalStores}</div>
              <div className="text-sm text-gray-600">全部门店</div>
            </motion.div>
            {Object.entries(statistics.distributionByDistrict).map(([district, count], index) => (
              <motion.div
                key={district}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleDistrictClick(district)}
                className={`bg-white p-4 rounded-lg shadow text-center cursor-pointer transition-all hover:shadow-lg ${
                  selectedDistrict === district ? 'ring-2 ring-yes-green' : ''
                }`}
              >
                <div className="text-2xl font-bold text-yes-green">{count}</div>
                <div className="text-sm text-gray-600">{district}</div>
              </motion.div>
            ))}
          </div>
        ) : null}
      </motion.div>
      
      {/* 门店总览 */}
      {!loading && statistics && stores.length > 0 && (
        <div className="container mx-auto px-4 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="text-xl font-semibold mb-4">门店总览</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-yes-dark">
                      耶氏台球连锁门店
                    </h3>
                    <p className="text-gray-600">
                      覆盖昆明市{Object.keys(statistics.distributionByDistrict).length}个区域
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-yes-green">
                        🎱 {statistics.totalTables || 0}张台球桌
                      </span>
                      <span className="text-sm text-gray-600">
                        月均访问 {Math.round((statistics.totalMonthlyVisitors || 0) / statistics.totalStores)}+ 人次/店
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      trackClick('view-all-stores');
                      setSelectedDistrict('all');
                    }}
                  >
                    查看全部
                  </Button>
                </div>
              </div>
            </motion.div>
        </div>
      )}
      
      {/* 地图容器 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: iframeLoaded ? 1 : 0.3 }}
        className="relative"
        style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}
      >
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yes-green mx-auto mb-4"></div>
              <p className="text-gray-600">加载地图中...</p>
            </div>
          </div>
        )}
        
        <iframe
          src="/yeslocation.html"
          className="w-full h-full border-0"
          onLoad={() => {
            setIframeLoaded(true);
            trackClick('map-loaded');
          }}
          title="耶氏台球门店地图"
        />
      </motion.div>
      
      {/* 底部CTA */}
      <div className="bg-white py-12 mt-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-yes-dark mb-4">
            找不到合适的门店？
          </h2>
          <p className="text-gray-600 mb-6">
            我们正在快速扩张中，了解加盟机会
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              trackClick('store-page-franchise-cta');
              window.location.href = '/franchise';
            }}
          >
            了解加盟详情
          </Button>
        </div>
      </div>
      
      {/* 门店列表（选中特定区域时显示） */}
      {selectedDistrict !== 'all' && filteredStores.length > 0 && (
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-yes-dark mb-6">
              {selectedDistrict}门店 ({filteredStores.length}家)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store, index) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onNavigate={() => {
                    trackClick(`store-navigate-${store.id}`);
                    // 导航功能
                    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(store.address)}`;
                    window.open(mapUrl, '_blank');
                  }}
                  onBook={() => {
                    trackClick(`store-book-${store.id}`);
                    setSelectedStore(store);
                    setBookingModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Context指示器（开发模式） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs max-w-xs">
          <p>地图集成方案：iframe + API</p>
          <p>参与度：{engagementLevel}</p>
          <p>门店总数：{statistics?.totalStores || 0}</p>
          <p>选中区域：{selectedDistrict}</p>
          <p>API状态：{loading ? '加载中' : error ? '错误' : '正常'}</p>
        </div>
      )}
      
      {/* 预约弹窗 */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedStore(null);
        }}
        type="store"
        storeId={selectedStore?.id.toString()}
      />
    </div>
  );
};

// 方案2：React组件化实现（未来优化）
// 将yeslocation.html的功能逐步迁移到React组件
// export const StoreMapComponent: React.FC = () => {
//   // 使用react-leaflet重新实现地图功能
//   // 优点：更好的集成、状态管理、性能优化
//   // 缺点：需要重写现有功能
// };