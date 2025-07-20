/**
 * 管理员仪表盘
 * 用于查看和管理表单提交
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FormSubmission, 
  FormType, 
  FormStatus, 
  FormFilter,
  FormStatistics 
} from '../types/formSubmission';
import { formSubmissionService } from '../services/formSubmissionService';
import { Button } from '../components/atoms/Button';
import { Select } from '../components/atoms/Select';
import { Input } from '../components/atoms/Input';
import { Toast } from '../components/molecules/FeedbackAnimations';
import { SkeletonLoader } from '../components/molecules/LoadingStates';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [statistics, setStatistics] = useState<FormStatistics | null>(null);
  const [filter, setFilter] = useState<FormFilter>({});
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 加载数据
  useEffect(() => {
    loadData();
    // 生成模拟数据（仅用于演示）
    if (localStorage.getItem('yes_sports_form_submissions') === null) {
      formSubmissionService.generateMockData();
      loadData();
    }
  }, []);

  // 应用过滤
  useEffect(() => {
    const filtered = formSubmissionService.filterSubmissions(filter);
    setSubmissions(filtered);
  }, [filter]);

  const loadData = () => {
    setIsLoading(true);
    try {
      const allSubmissions = formSubmissionService.filterSubmissions(filter);
      const stats = formSubmissionService.getStatistics();
      setSubmissions(allSubmissions);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading submissions:', error);
      showMessage('加载数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleStatusUpdate = (id: string, status: FormStatus) => {
    const updated = formSubmissionService.updateSubmissionStatus(id, status);
    if (updated) {
      loadData();
      showMessage('状态更新成功');
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(updated);
      }
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个表单提交吗？')) {
      const deleted = formSubmissionService.deleteSubmission(id);
      if (deleted) {
        loadData();
        showMessage('删除成功');
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      }
    }
  };

  const handleExport = () => {
    const csv = formSubmissionService.exportSubmissions(filter);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `form_submissions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showMessage('导出成功');
  };

  const getFormTypeName = (type: FormType) => {
    const names = {
      booking: '预约',
      inquiry: '咨询',
      franchise: '加盟',
      contact: '联系'
    };
    return names[type];
  };

  const getStatusName = (status: FormStatus) => {
    const names = {
      pending: '待处理',
      processing: '处理中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return names[status];
  };

  const getStatusColor = (status: FormStatus) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50',
      processing: 'text-blue-600 bg-blue-50',
      completed: 'text-green-600 bg-green-50',
      cancelled: 'text-gray-600 bg-gray-50'
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">表单管理</h1>
              <p className="text-gray-600 mt-2">查看和管理所有提交的表单</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/admin/cms')}>
                内容管理
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/copy-optimization')}>
                文案优化
              </Button>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500">总提交</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{statistics.total}</p>
              <p className="text-sm text-gray-500 mt-1">今日 {statistics.todayCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-yellow-600">待处理</h3>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{statistics.pending}</p>
              <p className="text-sm text-gray-500 mt-1">需要处理</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-blue-600">处理中</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{statistics.processing}</p>
              <p className="text-sm text-gray-500 mt-1">正在跟进</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-green-600">已完成</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{statistics.completed}</p>
              <p className="text-sm text-gray-500 mt-1">本周 {statistics.weekCount}</p>
            </div>
          </div>
        )}

        {/* 过滤器 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              options={[
                { value: '', label: '所有类型' },
                { value: 'booking', label: '预约' },
                { value: 'inquiry', label: '咨询' },
                { value: 'franchise', label: '加盟' },
                { value: 'contact', label: '联系' }
              ]}
              value={filter.type || ''}
              onChange={(value) => setFilter({ ...filter, type: value as FormType || undefined })}
              placeholder="选择类型"
            />
            <Select
              options={[
                { value: '', label: '所有状态' },
                { value: 'pending', label: '待处理' },
                { value: 'processing', label: '处理中' },
                { value: 'completed', label: '已完成' },
                { value: 'cancelled', label: '已取消' }
              ]}
              value={filter.status || ''}
              onChange={(value) => setFilter({ ...filter, status: value as FormStatus || undefined })}
              placeholder="选择状态"
            />
            <Input
              type="text"
              value={filter.searchText || ''}
              onChange={(e) => setFilter({ ...filter, searchText: e.target.value })}
              placeholder="搜索姓名或电话"
            />
            <Button onClick={handleExport} variant="outline">
              导出数据
            </Button>
          </div>
        </div>

        {/* 表单列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 列表部分 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="divide-y divide-gray-200">
                {isLoading ? (
                  <div className="p-6">
                    <SkeletonLoader height="h-20" className="mb-4" />
                    <SkeletonLoader height="h-20" className="mb-4" />
                    <SkeletonLoader height="h-20" />
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    暂无提交的表单
                  </div>
                ) : (
                  submissions.map((submission) => (
                    <motion.div
                      key={submission.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedSubmission?.id === submission.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedSubmission(submission)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {(submission.data as any).name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {(submission.data as any).phone}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                              {getStatusName(submission.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{getFormTypeName(submission.type)}</span>
                            <span>{new Date(submission.submittedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 详情部分 */}
          <div>
            {selectedSubmission ? (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4">表单详情</h3>
                
                {/* 基本信息 */}
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="text-sm text-gray-500">类型</label>
                    <p className="font-medium">{getFormTypeName(selectedSubmission.type)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">状态</label>
                    <p className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedSubmission.status)}`}>
                      {getStatusName(selectedSubmission.status)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">提交时间</label>
                    <p className="font-medium">{new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* 表单数据 */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">提交内容</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedSubmission.data).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-sm text-gray-500">{key}</label>
                        <p className="text-sm font-medium">{value || '-'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="mt-6 space-y-2">
                  {selectedSubmission.status === 'pending' && (
                    <Button
                      fullWidth
                      onClick={() => handleStatusUpdate(selectedSubmission.id, 'processing')}
                    >
                      开始处理
                    </Button>
                  )}
                  {selectedSubmission.status === 'processing' && (
                    <Button
                      fullWidth
                      variant="primary"
                      onClick={() => handleStatusUpdate(selectedSubmission.id, 'completed')}
                    >
                      标记完成
                    </Button>
                  )}
                  {selectedSubmission.status !== 'cancelled' && (
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedSubmission.id, 'cancelled')}
                    >
                      取消
                    </Button>
                  )}
                  <Button
                    fullWidth
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(selectedSubmission.id)}
                  >
                    删除
                  </Button>
                </div>

                {/* 备注 */}
                {selectedSubmission.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">{selectedSubmission.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                <p>选择一个表单查看详情</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast提示 */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          position="top"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;