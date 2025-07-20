import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// 注册 Service Worker 以启用 PWA 功能
// 仅在生产环境启用
if (process.env.NODE_ENV === 'production') {
  serviceWorkerRegistration.register({
    onSuccess: (registration) => {
      console.log('PWA 离线功能已就绪');
    },
    onUpdate: (registration) => {
      console.log('新版本可用，请刷新页面');
      // 可以在这里显示更新提示
    }
  });
} else {
  // 开发环境下注销所有 service workers
  serviceWorkerRegistration.unregister();
}
