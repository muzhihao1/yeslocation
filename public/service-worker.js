/* eslint-disable no-restricted-globals */

// 缓存版本号
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `yes-sports-${CACHE_VERSION}`;

// 需要缓存的静态资源
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/yes-logo.png',
  '/favicon.ico',
  // 离线页面
  '/offline.html'
];

// 需要网络优先的路径
const networkFirstPaths = [
  '/api/',
  '/training/booking',
  '/stores',
  '/products'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] 缓存静态资源');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // 立即激活新的 Service Worker
        return self.skipWaiting();
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('yes-sports-')) {
            console.log('[ServiceWorker] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即控制所有客户端
      return self.clients.claim();
    })
  );
});

// 获取请求事件 - 实现缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 忽略非同源请求
  if (url.origin !== location.origin) {
    return;
  }

  // 开发环境下，忽略 webpack 相关请求
  if (url.pathname.includes('webpack') || 
      url.pathname.includes('hot-update') ||
      url.pathname.includes('.chunk.js') ||
      url.pathname.includes('sockjs-node')) {
    return;
  }

  // 判断是否需要网络优先
  const isNetworkFirst = networkFirstPaths.some(path => 
    url.pathname.startsWith(path)
  );

  if (isNetworkFirst) {
    // 网络优先策略
    event.respondWith(networkFirst(request));
  } else {
    // 缓存优先策略
    event.respondWith(cacheFirst(request));
  }
});

// 缓存优先策略
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // 后台更新缓存
    fetchAndCache(request);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    // 缓存成功的响应
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // 只对导航请求返回离线页面
    if (request.mode === 'navigate' || request.destination === 'document') {
      return cache.match('/offline.html');
    }
    // 对于其他资源（JS, CSS等），让请求失败
    throw error;
  }
}

// 网络优先策略
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    // 缓存成功的响应
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // 尝试从缓存获取
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // 只对导航请求返回离线页面
    if (request.mode === 'navigate' || request.destination === 'document') {
      return cache.match('/offline.html');
    }
    // 对于其他资源（JS, CSS等），让请求失败
    throw error;
  }
}

// 后台更新缓存
async function fetchAndCache(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // 静默失败
  }
}

// 处理推送通知
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '您有新的消息',
    icon: '/yes-logo.png',
    badge: '/yes-logo.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/yes-logo.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/yes-logo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('耶氏体育', options)
  );
});

// 处理通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // 打开应用
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

// 同步预约数据
async function syncBookings() {
  try {
    // 直接使用 IndexedDB API
    const db = await openDB();
    const pendingBookings = await getBookingsFromDB(db);
    
    for (const booking of pendingBookings) {
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(booking)
        });
        
        if (response.ok) {
          // 标记为已同步
          await markBookingAsSyncedInDB(db, booking.id);
        }
      } catch (error) {
        console.error('同步失败:', error);
      }
    }
    
    db.close();
  } catch (error) {
    console.error('打开数据库失败:', error);
  }
}

// IndexedDB 辅助函数
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('YesSportsOfflineDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getBookingsFromDB(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookings'], 'readonly');
    const store = transaction.objectStore('bookings');
    const index = store.index('synced');
    // Get all records where synced = false
    const range = IDBKeyRange.only(false);
    const request = index.getAll(range);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function markBookingAsSyncedInDB(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookings'], 'readwrite');
    const store = transaction.objectStore('bookings');
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const booking = getRequest.result;
      if (booking) {
        booking.synced = true;
        const putRequest = store.put(booking);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        resolve();
      }
    };
    
    getRequest.onerror = () => reject(getRequest.error);
  });
}

// 消息处理
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});