/**
 * 文案优化管理页面
 * 用于预览和应用优化后的文案
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Toast } from '../components/molecules/FeedbackAnimations';
import { SkeletonLoader } from '../components/molecules/LoadingStates';
import { 
  migrateCopyToCMS, 
  previewCopyChanges, 
  generateCopyReport 
} from '../utils/copyMigration';
import { OptimizedCopy } from '../utils/optimizedCopy';

const CopyOptimizationAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [changes, setChanges] = useState<Array<{
    key: string;
    label: string;
    oldValue: string;
    newValue: string;
    changed: boolean;
  }>>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadChanges();
  }, []);

  const loadChanges = async () => {
    setLoading(true);
    try {
      const previewData = await previewCopyChanges();
      setChanges(previewData);
      // 默认选中所有有变更的项
      const changedKeys = previewData
        .filter(item => item.changed)
        .map(item => item.key);
      setSelectedItems(new Set(changedKeys));
    } catch (error) {
      showMessage('加载预览失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleApplyChanges = async () => {
    if (selectedItems.size === 0) {
      showMessage('请至少选择一项要更新的内容', 'error');
      return;
    }

    const confirm = window.confirm(
      `确定要更新选中的 ${selectedItems.size} 项内容吗？\n这将覆盖现有的文案内容。`
    );
    if (!confirm) return;

    setApplying(true);
    try {
      const result = await migrateCopyToCMS();
      if (result.success) {
        showMessage(`成功更新 ${result.updated} 项内容`);
        // 刷新页面数据
        await loadChanges();
      } else {
        showMessage('更新失败：' + result.errors.join(', '), 'error');
      }
    } catch (error) {
      showMessage('更新过程中出现错误', 'error');
    } finally {
      setApplying(false);
    }
  };

  const handleExportReport = () => {
    const report = generateCopyReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `文案优化报告_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage('报告导出成功');
  };

  const toggleItem = (key: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    const allChangedKeys = changes
      .filter(item => item.changed)
      .map(item => item.key);
    setSelectedItems(new Set(allChangedKeys));
  };

  const selectNone = () => {
    setSelectedItems(new Set());
  };

  // 显示的变更项
  const displayedChanges = showAll ? changes : changes.filter(item => item.changed);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">文案优化工具</h1>
              <p className="text-gray-600 mt-2">预览并应用优化后的网站文案</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/admin/cms')}>
                返回CMS管理
              </Button>
              <Button variant="outline" onClick={handleExportReport}>
                导出优化报告
              </Button>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm text-gray-500">总内容数</h3>
            <p className="text-2xl font-bold text-gray-900">{changes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm text-gray-500">需要更新</h3>
            <p className="text-2xl font-bold text-blue-600">
              {changes.filter(item => item.changed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm text-gray-500">已选择</h3>
            <p className="text-2xl font-bold text-green-600">{selectedItems.size}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm text-gray-500">优化率</h3>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round((changes.filter(item => item.changed).length / changes.length) * 100)}%
            </p>
          </div>
        </div>

        {/* 操作栏 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                disabled={loading}
              >
                全选变更项
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={selectNone}
                disabled={loading}
              >
                取消全选
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? '只看变更' : '显示全部'}
              </Button>
            </div>
            <Button
              variant="primary"
              onClick={handleApplyChanges}
              disabled={loading || applying || selectedItems.size === 0}
              className="min-w-[120px]"
            >
              {applying ? '应用中...' : `应用 ${selectedItems.size} 项更新`}
            </Button>
          </div>
        </div>

        {/* 变更列表 */}
        <div className="bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="p-6">
              <SkeletonLoader height="h-20" className="mb-4" />
              <SkeletonLoader height="h-20" className="mb-4" />
              <SkeletonLoader height="h-20" />
            </div>
          ) : displayedChanges.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {showAll ? '暂无内容' : '所有文案都是最新的'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {displayedChanges.map((item) => (
                <motion.div
                  key={item.key}
                  className={`p-6 ${item.changed ? 'bg-blue-50' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-4">
                    {item.changed && (
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.key)}
                        onChange={() => toggleItem(item.key)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        <span className="text-xs text-gray-500">({item.key})</span>
                        {item.changed && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            有更新
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-1">当前文案</h4>
                          <p className="text-sm text-gray-800 bg-gray-100 p-3 rounded">
                            {item.oldValue}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-1">
                            优化后文案 {item.changed && '✨'}
                          </h4>
                          <p className={`text-sm p-3 rounded ${
                            item.changed 
                              ? 'bg-green-100 text-green-800 font-medium' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.newValue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 优化策略说明 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">文案优化策略</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🎯 核心策略</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 更强的价值主张和数字化证明</li>
                <li>• 行动导向的CTA文案</li>
                <li>• 情感化的表达方式</li>
                <li>• 社会证明和信任元素</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">💡 优化重点</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 突出20年行业经验和500+成功案例</li>
                <li>• 强调西南唯一制造商地位</li>
                <li>• 使用更有力的动词和形容词</li>
                <li>• 创造紧迫感和独特性</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Toast提示 */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          position="top"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default CopyOptimizationAdmin;