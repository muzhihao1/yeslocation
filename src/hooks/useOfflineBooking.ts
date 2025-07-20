/**
 * 离线预约管理 Hook
 * 处理离线状态下的预约提交和同步
 */

import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '../utils/offlineStorage';
import { registerBackgroundSync } from '../serviceWorkerRegistration';
import { BookingFormData } from '../types/models';

interface UseOfflineBookingReturn {
  submitBooking: (booking: BookingFormData) => Promise<{ success: boolean; offline?: boolean }>;
  pendingCount: number;
  syncBookings: () => Promise<void>;
  isOnline: boolean;
}

export function useOfflineBooking(): UseOfflineBookingReturn {
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 监听在线状态
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // 恢复在线后自动同步
      syncBookings();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 获取待同步预约数量
  const updatePendingCount = useCallback(async () => {
    try {
      const pendingBookings = await offlineStorage.getPendingBookings();
      setPendingCount(pendingBookings.length);
    } catch (error) {
      console.error('获取待同步预约失败:', error);
    }
  }, []);

  // 初始化时获取待同步数量
  useEffect(() => {
    updatePendingCount();
  }, [updatePendingCount]);

  // 提交预约
  const submitBooking = useCallback(async (booking: BookingFormData) => {
    if (isOnline) {
      try {
        // 在线时直接提交到服务器
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(booking),
        });

        if (response.ok) {
          return { success: true, offline: false };
        } else {
          throw new Error('提交失败');
        }
      } catch (error) {
        // 网络请求失败，保存到离线存储
        console.error('在线提交失败，保存到离线存储:', error);
      }
    }

    // 离线或在线提交失败时，保存到本地
    try {
      await offlineStorage.saveBooking(booking);
      await updatePendingCount();
      
      // 注册后台同步
      await registerBackgroundSync('sync-bookings');
      
      return { success: true, offline: true };
    } catch (error) {
      console.error('离线保存失败:', error);
      return { success: false };
    }
  }, [isOnline, updatePendingCount]);

  // 同步预约
  const syncBookings = useCallback(async () => {
    if (!isOnline) return;

    try {
      const pendingBookings = await offlineStorage.getPendingBookings();
      
      for (const booking of pendingBookings) {
        try {
          const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: booking.name,
              phone: booking.phone,
              date: booking.date,
              time: booking.time,
              storeId: booking.storeId,
              coachId: booking.coachId,
              message: booking.message,
            }),
          });

          if (response.ok) {
            await offlineStorage.markBookingAsSynced(booking.id);
          }
        } catch (error) {
          console.error('同步单个预约失败:', error);
          // 继续同步其他预约
        }
      }

      await updatePendingCount();
    } catch (error) {
      console.error('同步预约失败:', error);
    }
  }, [isOnline, updatePendingCount]);

  return {
    submitBooking,
    pendingCount,
    syncBookings,
    isOnline,
  };
}