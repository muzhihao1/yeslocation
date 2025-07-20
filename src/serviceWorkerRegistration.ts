/**
 * Service Worker 注册管理
 * 处理 PWA 的服务工作者注册、更新和卸载
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            '此应用程序正在从缓存中提供服务。' +
              '了解更多: https://cra.link/PWA'
          );
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log(
                '新内容可用，将在所有标签页关闭后使用。' +
                  '了解更多: https://cra.link/PWA'
              );

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('内容已缓存以供离线使用。');

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Service Worker 注册期间出错:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('未找到互联网连接。应用程序正在离线模式下运行。');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

/**
 * 检查是否有新的 Service Worker 等待激活
 */
export function checkForUpdates(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.ready.then((registration) => {
      return registration.update().then(() => {
        return registration.waiting !== null;
      });
    });
  }
  return Promise.resolve(false);
}

/**
 * 跳过等待并激活新的 Service Worker
 */
export function activateUpdate(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  }
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission;
  }
  return 'denied';
}

/**
 * 注册后台同步
 */
export async function registerBackgroundSync(tag: string): Promise<void> {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await (registration as any).sync.register(tag);
      console.log(`后台同步已注册: ${tag}`);
    } catch (error) {
      console.error('后台同步注册失败:', error);
    }
  }
}

/**
 * 检查 PWA 安装状态
 */
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

/**
 * 获取 Service Worker 注册状态
 */
export async function getRegistrationStatus(): Promise<{
  registered: boolean;
  waiting: boolean;
  active: boolean;
}> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      return {
        registered: true,
        waiting: registration.waiting !== null,
        active: registration.active !== null,
      };
    }
  }
  return {
    registered: false,
    waiting: false,
    active: false,
  };
}