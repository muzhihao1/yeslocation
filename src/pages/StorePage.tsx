import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContextEngine } from '../context/ContextEngine';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { Button, Card, BookingModal } from '../components';
import { StoreCard } from '../components/molecules/StoreCard';
import { api, Store, DataResponse, StoreStatistics } from '../services/api';

// 路由路径到视图的映射
const pathToViewMap: Record<string, string> = {
  '/stores': 'map', // 默认显示门店分布
  '/stores/map': 'map',
  '/stores/flagship': 'flagship',
  '/stores/appointment': 'appointment'
};

export const StorePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  
  // 根据路由路径确定当前视图
  const currentView = pathToViewMap[location.pathname] || 'map';
  
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
            耶氏门店网络
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl mb-8 max-w-3xl mx-auto text-white/90"
          >
            20家门店遍布昆明，总有一家在您身边
          </motion.p>
        </div>
      </motion.section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'map'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                navigate('/stores/map');
                trackClick('stores-nav-map');
              }}
            >
              门店分布
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'flagship'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                navigate('/stores/flagship');
                trackClick('stores-nav-flagship');
              }}
            >
              旗舰店
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'appointment'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                navigate('/stores/appointment');
                trackClick('stores-nav-appointment');
              }}
            >
              预约到店
            </button>
          </nav>
        </div>
      </section>

      {/* Conditional Content Based on View */}
      {currentView === 'map' ? (
        <>
        
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
      
      {/* 底部CTA - 仅在map视图显示 */}
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
        </>
      ) : currentView === 'flagship' ? (
        /* 旗舰店展示 */
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-yes-dark text-center mb-12">
              耶氏旗舰店
            </h2>
            
            {/* 旗舰店特色 */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-4">昆明市中心旗舰店</h3>
                <p className="text-lg mb-6">
                  位于昆明市五华区青年路中心商圈，是耶氏台球品牌形象展示中心
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold mb-3">旗舰店特色</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-300">✓</span>
                        3000平米超大空间
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-300">✓</span>
                        32张国际标准比赛台
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-300">✓</span>
                        VIP包房服务
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-300">✓</span>
                        专业教练驻场指导
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">配套服务</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-300">✓</span>
                        高端餐饮服务
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-300">✓</span>
                        赛事直播观看区
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-300">✓</span>
                        会员专属休息区
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-300">✓</span>
                        地下停车场
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 旗舰店图片展示 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white text-4xl">🎱</span>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2">豪华大厅</h4>
                  <p className="text-gray-600 text-sm">宽敞明亮的比赛大厅，国际标准照明</p>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center">
                  <span className="text-white text-4xl">🏆</span>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2">VIP包房</h4>
                  <p className="text-gray-600 text-sm">私密专属空间，享受尊贵服务</p>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-neutral-600 to-neutral-800 flex items-center justify-center">
                  <span className="text-white text-4xl">☕</span>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2">休闲餐饮</h4>
                  <p className="text-gray-600 text-sm">精品咖啡与美食，完美的休憩体验</p>
                </div>
              </motion.div>
            </div>
            
            {/* 联系信息 */}
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-yes-dark mb-6 text-center">旗舰店信息</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold">地址</p>
                    <p className="text-gray-600">昆明市五华区青年路388号昆明走廊3楼</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold">电话</p>
                    <p className="text-gray-600">0871-65511888</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="font-semibold">营业时间</p>
                    <p className="text-gray-600">10:00 - 凌晨 02:00</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedStore(stores.find(s => s.name.includes('旗舰')) || stores[0]);
                    setBookingModalOpen(true);
                    trackClick('flagship-booking');
                  }}
                >
                  预约到店
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : currentView === 'appointment' ? (
        /* 预约到店 */
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-yes-dark text-center mb-12">
              预约到店
            </h2>
            
            {/* 预约优势 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold text-yes-dark mb-2">优先安排</h3>
                <p className="text-gray-600">预约客户优先安排台位，无需等待</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold text-yes-dark mb-2">专属优惠</h3>
                <p className="text-gray-600">预约到店享受会员价格优惠</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-semibold text-yes-dark mb-2">教练服务</h3>
                <p className="text-gray-600">可提前预约专业教练指导</p>
              </motion.div>
            </div>
            
            {/* 门店列表 - 用于预约 */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yes-green mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {stores.slice(0, 6).map((store) => (
                  <motion.div
                    key={store.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-lg shadow-lg p-6"
                  >
                    <h3 className="text-lg font-bold text-yes-dark mb-2">{store.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <span>📍</span>
                        <span>{store.address}</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span>📞</span>
                        <span>{store.phone}</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span>⏰</span>
                        <span>{store.businessHours}</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span>🎱</span>
                        <span>{store.tableCount || 8}张台球桌</span>
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedStore(store);
                        setBookingModalOpen(true);
                        trackClick(`appointment-store-${store.id}`);
                      }}
                    >
                      立即预约
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* 预约说明 */}
            <div className="max-w-2xl mx-auto mt-12 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yes-dark mb-4">预约说明</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-yes-green">•</span>
                  <span>预约时间：提前1-3天预约，确保台位充足</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yes-green">•</span>
                  <span>取消政策：如需取消，请提前2小时通知门店</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yes-green">•</span>
                  <span>会员权益：会员预约可享受专属台位和折扣优惠</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yes-green">•</span>
                  <span>团体预约：5人以上团体请电话联系门店安排</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      ) : null}
      
      {/* Context指示器（开发模式） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs max-w-xs">
          <p>地图集成方案：iframe + API</p>
          <p>参与度：{engagementLevel}</p>
          <p>门店总数：{statistics?.totalStores || 0}</p>
          <p>选中区域：{selectedDistrict}</p>
          <p>API状态：{loading ? '加载中' : error ? '错误' : '正常'}</p>
          <p>当前视图：{currentView}</p>
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