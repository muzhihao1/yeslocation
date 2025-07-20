import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../atoms/Button';
import { useContextEngine } from '../../context/ContextEngine';
import { api } from '../../services/api';

interface BookingFormProps {
  type: 'store' | 'training';
  storeId?: string;
  trainingId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  type,
  storeId,
  trainingId,
  onSuccess,
  onCancel,
}) => {
  const { dispatch } = useContextEngine();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    tableNumber: '',
    duration: '2',
    participants: '1',
    notes: '',
  });
  
  // 可用时间段（模拟数据）
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  
  // 获取可用时间段
  const fetchAvailableSlots = async (date: string) => {
    setLoading(true);
    try {
      // 模拟 API 调用
      const slots: TimeSlot[] = [];
      for (let hour = 10; hour <= 21; hour++) {
        slots.push({
          time: `${hour}:00`,
          available: Math.random() > 0.3, // 70% 可用率
        });
        if (hour < 21) {
          slots.push({
            time: `${hour}:30`,
            available: Math.random() > 0.3,
          });
        }
      }
      setAvailableSlots(slots);
    } catch (err) {
      setError('获取可用时间失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理日期选择
  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date, time: '' });
    fetchAvailableSlots(date);
  };
  
  // 处理表单提交
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 更新 Context - 记录预约行为
      dispatch({
        type: 'UPDATE_ENGAGEMENT',
        payload: 'high', // 预约行为表示高参与度
      });
      
      onSuccess?.();
    } catch (err) {
      setError('预约失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 获取今天的日期字符串
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // 获取最大预约日期（30天后）
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };
  
  // 渲染步骤指示器
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((num) => (
        <React.Fragment key={num}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
              step >= num
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-200 text-neutral-500'
            }`}
          >
            {num}
          </div>
          {num < 3 && (
            <div
              className={`w-16 h-1 mx-2 transition-colors ${
                step > num ? 'bg-primary-500' : 'bg-neutral-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      {renderStepIndicator()}
      
      <AnimatePresence mode="wait">
        {/* 步骤 1: 基本信息 */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold mb-6">填写联系信息</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                姓名 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="请输入您的姓名"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                手机号码 *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="请输入您的手机号码"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="请输入您的邮箱（选填）"
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                取消
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.phone}
              >
                下一步
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* 步骤 2: 选择时间 */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold mb-6">选择预约时间</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                选择日期 *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="input"
                required
              />
            </div>
            
            {formData.date && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-4">
                  选择时间段 *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setFormData({ ...formData, time: slot.time })}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.time === slot.time
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : slot.available
                          ? 'border-neutral-200 hover:border-primary-300'
                          : 'border-neutral-100 bg-neutral-50 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {type === 'store' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  时长
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="input"
                >
                  <option value="1">1小时</option>
                  <option value="2">2小时</option>
                  <option value="3">3小时</option>
                  <option value="4">4小时</option>
                </select>
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                上一步
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!formData.date || !formData.time}
              >
                下一步
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* 步骤 3: 确认信息 */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold mb-6">确认预约信息</h3>
            
            <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">姓名</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">电话</span>
                <span className="font-medium">{formData.phone}</span>
              </div>
              {formData.email && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">邮箱</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-600">日期</span>
                <span className="font-medium">{formData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">时间</span>
                <span className="font-medium">{formData.time}</span>
              </div>
              {type === 'store' && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">时长</span>
                  <span className="font-medium">{formData.duration}小时</span>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                备注信息
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input min-h-[100px]"
                placeholder="如有特殊需求，请在此说明"
              />
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                disabled={loading}
              >
                上一步
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? '提交中...' : '确认预约'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};