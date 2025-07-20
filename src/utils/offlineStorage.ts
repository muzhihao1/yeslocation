/**
 * 离线存储工具
 * 使用 IndexedDB 存储离线数据，支持预约同步
 */

interface OfflineBooking {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  storeId: string;
  coachId?: string;
  message?: string;
  synced: boolean;
  createdAt: number;
}

class OfflineStorageManager {
  private dbName = 'YesSportsOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('无法打开离线数据库'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 创建预约存储
        if (!db.objectStoreNames.contains('bookings')) {
          const bookingStore = db.createObjectStore('bookings', { keyPath: 'id' });
          bookingStore.createIndex('synced', 'synced', { unique: false });
          bookingStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // 创建缓存数据存储
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  async saveBooking(booking: Omit<OfflineBooking, 'id' | 'synced' | 'createdAt'>): Promise<string> {
    if (!this.db) await this.init();

    const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const offlineBooking: OfflineBooking = {
      ...booking,
      id,
      synced: false,
      createdAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['bookings'], 'readwrite');
      const store = transaction.objectStore('bookings');
      const request = store.add(offlineBooking);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(new Error('保存预约失败'));
    });
  }

  async getPendingBookings(): Promise<OfflineBooking[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['bookings'], 'readonly');
      const store = transaction.objectStore('bookings');
      const index = store.index('synced');
      // Get all records where synced = false
      const range = IDBKeyRange.only(false);
      const request = index.getAll(range);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('获取待同步预约失败'));
    });
  }

  async markBookingAsSynced(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['bookings'], 'readwrite');
      const store = transaction.objectStore('bookings');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const booking = getRequest.result;
        if (booking) {
          booking.synced = true;
          const putRequest = store.put(booking);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(new Error('更新预约状态失败'));
        } else {
          reject(new Error('预约不存在'));
        }
      };

      getRequest.onerror = () => reject(new Error('获取预约失败'));
    });
  }

  async deleteBooking(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['bookings'], 'readwrite');
      const store = transaction.objectStore('bookings');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('删除预约失败'));
    });
  }

  async cacheData(key: string, data: any, ttl: number = 3600000): Promise<void> {
    if (!this.db) await this.init();

    const cacheEntry = {
      key,
      data,
      expiresAt: Date.now() + ttl,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.put(cacheEntry);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('缓存数据失败'));
    });
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expiresAt > Date.now()) {
          resolve(result.data);
        } else {
          // 数据已过期或不存在
          if (result) {
            // 删除过期数据
            this.deleteCachedData(key);
          }
          resolve(null);
        }
      };

      request.onerror = () => reject(new Error('获取缓存数据失败'));
    });
  }

  async deleteCachedData(key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('删除缓存数据失败'));
    });
  }

  async clearExpiredCache(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const index = store.index('expiresAt');
      const range = IDBKeyRange.upperBound(Date.now());
      const request = index.openCursor(range);

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(new Error('清理过期缓存失败'));
    });
  }
}

// 导出单例实例
export const offlineStorage = new OfflineStorageManager();

// 导出类型
export type { OfflineBooking };

// Service Worker 中使用的辅助函数
export async function getPendingBookings(): Promise<OfflineBooking[]> {
  return offlineStorage.getPendingBookings();
}

export async function markBookingAsSynced(id: string): Promise<void> {
  return offlineStorage.markBookingAsSynced(id);
}