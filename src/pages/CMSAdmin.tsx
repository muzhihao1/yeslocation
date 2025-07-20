/**
 * CMS管理页面
 * 用于编辑网站内容
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCMSAdmin } from '../hooks/useCMS';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Textarea } from '../components/atoms/Textarea';
import { Toast } from '../components/molecules/FeedbackAnimations';
import { SkeletonLoader } from '../components/molecules/LoadingStates';
import { CMSContent, CMSCategories } from '../types/cms';

const CMSAdmin: React.FC = () => {
  const navigate = useNavigate();
  const {
    contents,
    loading,
    error,
    updateContent,
    resetToDefault,
    exportContent,
    importContent,
  } = useCMSAdmin();

  const [selectedCategory, setSelectedCategory] = useState<string>('home');
  const [editingContent, setEditingContent] = useState<CMSContent | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤内容
  const filteredContents = contents.filter(content => {
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    const matchesSearch = content.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.value.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 显示消息
  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 开始编辑
  const startEdit = (content: CMSContent) => {
    setEditingContent(content);
    setEditValue(content.value);
  };

  // 保存编辑
  const saveEdit = async () => {
    if (!editingContent) return;

    const success = await updateContent(editingContent.key, editValue);
    if (success) {
      showMessage('内容更新成功');
      setEditingContent(null);
    } else {
      showMessage('更新失败', 'error');
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingContent(null);
    setEditValue('');
  };

  // 重置内容
  const handleReset = async (key?: string) => {
    const confirm = window.confirm(key ? '确定要重置此内容为默认值吗？' : '确定要重置所有内容为默认值吗？');
    if (!confirm) return;

    const success = await resetToDefault(key);
    if (success) {
      showMessage('重置成功');
      if (editingContent?.key === key) {
        setEditingContent(null);
      }
    } else {
      showMessage('重置失败', 'error');
    }
  };

  // 导出内容
  const handleExport = async () => {
    const json = await exportContent();
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cms_content_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage('导出成功');
    } else {
      showMessage('导出失败', 'error');
    }
  };

  // 导入内容
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const json = event.target?.result as string;
        const success = await importContent(json);
        if (success) {
          showMessage('导入成功');
        } else {
          showMessage('导入失败', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">内容管理</h1>
            <p className="text-gray-600 mt-2">编辑网站的文字内容</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              表单管理
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/copy-optimization')}>
              文案优化
            </Button>
            <Button variant="outline" onClick={handleExport}>
              导出内容
            </Button>
            <Button variant="outline" onClick={handleImport}>
              导入内容
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleReset()}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              重置所有
            </Button>
          </div>
        </div>

        {/* 搜索和过滤 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索内容..."
            />
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                全部
              </Button>
              {CMSCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 内容列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 列表部分 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {loading ? (
                <div className="p-6">
                  <SkeletonLoader height="h-20" className="mb-4" />
                  <SkeletonLoader height="h-20" className="mb-4" />
                  <SkeletonLoader height="h-20" />
                </div>
              ) : filteredContents.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  暂无内容
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredContents.map((content) => (
                    <motion.div
                      key={content.key}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        editingContent?.key === content.key ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => startEdit(content)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{content.label}</h3>
                          <p className="text-sm text-gray-500 mt-1">{content.key}</p>
                          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{content.value}</p>
                        </div>
                        <span className="text-xs text-gray-400 ml-4">
                          {new Date(content.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 编辑部分 */}
          <div>
            <AnimatePresence mode="wait">
              {editingContent ? (
                <motion.div
                  key={editingContent.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-lg shadow-md p-6 sticky top-4"
                >
                  <h3 className="text-lg font-semibold mb-4">编辑内容</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">标签</label>
                      <p className="font-medium">{editingContent.label}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500">键值</label>
                      <p className="text-sm font-mono text-gray-600">{editingContent.key}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500">内容</label>
                      {editingContent.type === 'richtext' ? (
                        <Textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          rows={6}
                          className="mt-1"
                        />
                      ) : (
                        <Input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="mt-1"
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={saveEdit}
                        disabled={editValue === editingContent.value}
                      >
                        保存
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={cancelEdit}
                      >
                        取消
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      fullWidth
                      className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      onClick={() => handleReset(editingContent.key)}
                    >
                      重置为默认
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500"
                >
                  <p>选择一个内容进行编辑</p>
                </motion.div>
              )}
            </AnimatePresence>
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

export default CMSAdmin;