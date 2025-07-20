/**
 * 优化后的预约表单组件
 * 使用新的表单组件和验证系统
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select, SelectOption } from '../atoms/Select';
import { Textarea } from '../atoms/Textarea';
import { useContextEngine } from '../../context/ContextEngine';
import { useForm } from '../../hooks/useForm';
import { ValidationRules } from '../../utils/formValidation';
import { formatters, restrictors } from '../../utils/formValidation';
import { useOfflineBooking } from '../../hooks/useOfflineBooking';
import { formSubmissionService } from '../../services/formSubmissionService';

interface BookingFormOptimizedProps {
  type: 'store' | 'training';
  storeId?: string;
  trainingId?: string;
  storeName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export const BookingFormOptimized: React.FC<BookingFormOptimizedProps> = ({
  type,
  storeId,
  trainingId,
  storeName,
  onSuccess,
  onCancel,
}) => {
  const { dispatch } = useContextEngine();
  const { submitBooking, isOnline, pendingCount } = useOfflineBooking();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // 表单验证规则
  const validationRules = {
    name: [
      ValidationRules.required('请输入您的姓名'),
      ValidationRules.chineseName('请输入有效的中文姓名'),
      ValidationRules.minLength(2, '姓名至少需要2个字符'),
      ValidationRules.maxLength(10, '姓名最多10个字符'),
    ],
    phone: [
      ValidationRules.required('请输入手机号码'),
      ValidationRules.phone('请输入有效的手机号码'),
    ],
    email: [
      ValidationRules.email('请输入有效的邮箱地址'),
    ],
    date: [
      ValidationRules.required('请选择预约日期'),
    ],
    time: [
      ValidationRules.required('请选择预约时间'),
    ],
  };

  // 使用表单 Hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
    validateForm,
    setFieldValue,
  } = useForm({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      duration: '2',
      participants: '1',
      notes: '',
    },
    validationRules,
    onSubmit: async (formData) => {
      setLoading(true);
      setSubmitError(null);

      try {
        // 使用离线预约 Hook 提交
        const result = await submitBooking({
          ...formData,
          storeId: storeId || '',
        });

        if (result.success) {
          // 保存到表单管理系统
          formSubmissionService.saveSubmission({
            type: 'booking',
            status: 'pending',
            data: {
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              service: type === 'training' ? 'training' : 'venue',
              date: formData.date,
              time: formData.time,
              store: storeName,
              message: formData.notes,
            }
          });

          // 更新 Context - 记录预约行为
          dispatch({
            type: 'UPDATE_ENGAGEMENT',
            payload: 'high',
          });

          if (result.offline) {
            setSubmitError('预约已保存，将在网络恢复后自动提交');
          }

          setTimeout(() => {
            onSuccess?.();
          }, 1500);
        } else {
          setSubmitError('预约失败，请稍后重试');
        }
      } catch (err) {
        setSubmitError('预约失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    },
  });

  // 获取可用时间段
  const fetchAvailableSlots = async (date: string) => {
    setLoading(true);
    try {
      // 模拟 API 调用
      const slots: TimeSlot[] = [];
      for (let hour = 10; hour <= 21; hour++) {
        slots.push({
          time: `${hour}:00`,
          available: Math.random() > 0.3,
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
      setSubmitError('获取可用时间失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理日期选择
  useEffect(() => {
    if (values.date) {
      fetchAvailableSlots(values.date);
      setFieldValue('time', ''); // 清空时间选择
    }
  }, [values.date]);

  // 获取日期限制
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // 时长选项
  const durationOptions: SelectOption[] = [
    { value: '1', label: '1小时' },
    { value: '2', label: '2小时' },
    { value: '3', label: '3小时' },
    { value: '4', label: '4小时' },
  ];

  // 参与人数选项
  const participantOptions: SelectOption[] = [
    { value: '1', label: '1人' },
    { value: '2', label: '2人' },
    { value: '3', label: '3人' },
    { value: '4', label: '4人' },
    { value: '5+', label: '5人以上' },
  ];

  // 验证当前步骤
  const validateStep = (currentStep: number): boolean => {
    const fieldsToValidate: Record<number, string[]> = {
      1: ['name', 'phone', 'email'],
      2: ['date', 'time'],
      3: [],
    };

    const fields = fieldsToValidate[currentStep];
    const stepErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const fieldErrors = errors[field];
      if (fieldErrors) {
        stepErrors[field] = fieldErrors;
      }
    });

    return Object.keys(stepErrors).length === 0;
  };

  // 处理步骤切换
  const handleNextStep = () => {
    // 验证当前步骤
    const fields = step === 1 ? ['name', 'phone', 'email'] : ['date', 'time'];
    let isStepValid = true;

    fields.forEach((field) => {
      if (!getFieldProps(field as any).value && field !== 'email') {
        isStepValid = false;
      }
    });

    if (isStepValid) {
      setStep(step + 1);
    }
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((num) => (
        <React.Fragment key={num}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: step >= num ? 1 : 0.8 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step >= num
                ? 'bg-yes-blue text-white shadow-lg'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step > num ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              num
            )}
          </motion.div>
          {num < 3 && (
            <div
              className={`w-16 h-1 mx-2 transition-all ${
                step > num ? 'bg-yes-blue' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 离线状态提示 */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">您当前处于离线状态</p>
              <p className="text-xs text-yellow-600">预约信息将在网络恢复后自动提交</p>
              {pendingCount > 0 && (
                <p className="text-xs text-yellow-600 mt-1">
                  您有 {pendingCount} 个待同步的预约
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {renderStepIndicator()}

      <form onSubmit={handleSubmit}>
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

              <Input
                {...getFieldProps('name')}
                label="姓名"
                placeholder="请输入您的姓名"
                restrictor={restrictors.chinese}
                clearable
                autoComplete="name"
              />

              <Input
                {...getFieldProps('phone')}
                label="手机号码"
                placeholder="请输入您的手机号码"
                type="tel"
                formatter={formatters.phone}
                restrictor={restrictors.numeric}
                clearable
                autoComplete="tel"
                maxLength={11}
              />

              <Input
                {...getFieldProps('email')}
                label="邮箱（选填）"
                placeholder="请输入您的邮箱"
                type="email"
                clearable
                autoComplete="email"
              />

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                  type="button"
                >
                  取消
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!values.name || !values.phone || loading}
                  type="button"
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

              <Input
                {...getFieldProps('date')}
                label="选择日期"
                type="date"
                min={getMinDate()}
                max={getMaxDate()}
              />

              {values.date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    选择时间段
                  </label>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <svg className="w-8 h-8 animate-spin text-yes-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableSlots.map((slot) => (
                        <motion.button
                          key={slot.time}
                          type="button"
                          whileHover={slot.available ? { scale: 1.05 } : {}}
                          whileTap={slot.available ? { scale: 0.95 } : {}}
                          onClick={() => handleChange('time', slot.time)}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            values.time === slot.time
                              ? 'border-yes-blue bg-blue-50 text-yes-blue font-semibold'
                              : slot.available
                              ? 'border-gray-200 hover:border-yes-blue/50'
                              : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </motion.button>
                      ))}
                    </div>
                  )}
                  {errors.time && touched.time && (
                    <p className="mt-2 text-sm text-red-600">{errors.time}</p>
                  )}
                </div>
              )}

              {type === 'store' && (
                <>
                  <Select
                    options={durationOptions}
                    value={values.duration}
                    onChange={(value) => handleChange('duration', value)}
                    label="预约时长"
                    placeholder="选择时长"
                  />

                  <Select
                    options={participantOptions}
                    value={values.participants}
                    onChange={(value) => handleChange('participants', value)}
                    label="参与人数"
                    placeholder="选择人数"
                  />
                </>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  type="button"
                >
                  上一步
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!values.date || !values.time || loading}
                  type="button"
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">预约类型</span>
                  <span className="font-medium">
                    {type === 'store' ? '门店预约' : '培训预约'}
                  </span>
                </div>
                {storeName && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">门店</span>
                    <span className="font-medium">{storeName}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">姓名</span>
                  <span className="font-medium">{values.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">电话</span>
                  <span className="font-medium">{values.phone}</span>
                </div>
                {values.email && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">邮箱</span>
                    <span className="font-medium">{values.email}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">日期</span>
                  <span className="font-medium">{values.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">时间</span>
                  <span className="font-medium">{values.time}</span>
                </div>
                {type === 'store' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">时长</span>
                      <span className="font-medium">{values.duration}小时</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">人数</span>
                      <span className="font-medium">
                        {values.participants === '5+' ? '5人以上' : `${values.participants}人`}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>

              <Textarea
                {...getFieldProps('notes')}
                label="备注信息（选填）"
                placeholder="如有特殊需求，请在此说明"
                rows={4}
                showCount
                maxLength={200}
                clearable
              />

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    submitError.includes('已保存')
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d={submitError.includes('已保存')
                          ? "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        }
                      />
                    </svg>
                    {submitError}
                  </div>
                </motion.div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={loading || isSubmitting}
                  type="button"
                >
                  上一步
                </Button>
                <Button
                  type="submit"
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      提交中...
                    </span>
                  ) : (
                    '确认预约'
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};