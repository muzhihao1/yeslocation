import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '../../utils/analytics';

interface FunnelStep {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  timestamp?: number;
}

interface ConversionFunnelProps {
  funnelName: string;
  steps: string[];
  currentStep: number;
  onStepComplete?: (stepIndex: number) => void;
  className?: string;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({
  funnelName,
  steps,
  currentStep,
  onStepComplete,
  className = '',
}) => {
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  
  // 初始化漏斗数据
  useEffect(() => {
    const initialData = steps.map((step, index) => ({
      id: `${funnelName}-step-${index}`,
      name: step,
      completed: index < currentStep,
      timestamp: index < currentStep ? Date.now() : undefined,
    }));
    setFunnelData(initialData);
    
    // 追踪漏斗开始
    if (currentStep === 0) {
      trackEvent('funnel_start', {
        funnel_name: funnelName,
        total_steps: steps.length,
      });
    }
  }, [funnelName, steps]);
  
  // 追踪步骤变化
  useEffect(() => {
    if (currentStep > 0 && currentStep <= steps.length) {
      const stepName = steps[currentStep - 1];
      
      // 更新漏斗数据
      setFunnelData(prev => 
        prev.map((step, index) => ({
          ...step,
          completed: index < currentStep,
          timestamp: index < currentStep && !step.timestamp ? Date.now() : step.timestamp,
        }))
      );
      
      // 追踪步骤完成
      trackEvent('funnel_step_complete', {
        funnel_name: funnelName,
        step_name: stepName,
        step_number: currentStep,
        total_steps: steps.length,
        completion_rate: (currentStep / steps.length) * 100,
      });
      
      // 如果完成所有步骤
      if (currentStep === steps.length) {
        trackEvent('funnel_complete', {
          funnel_name: funnelName,
          total_steps: steps.length,
          time_to_complete: calculateTotalTime(),
        });
      }
      
      onStepComplete?.(currentStep - 1);
    }
  }, [currentStep, funnelName, steps]);
  
  // 计算总耗时
  const calculateTotalTime = () => {
    const firstStep = funnelData.find(step => step.timestamp);
    if (!firstStep || !firstStep.timestamp) return 0;
    return Date.now() - firstStep.timestamp;
  };
  
  // 计算完成率
  const completionRate = (currentStep / steps.length) * 100;
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">
            {funnelName}
          </span>
          <span className="text-sm text-neutral-500">
            {currentStep} / {steps.length} 步骤
          </span>
        </div>
        <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
          />
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          完成率: {completionRate.toFixed(0)}%
        </p>
      </div>
      
      {/* 步骤列表 */}
      <div className="space-y-2">
        {funnelData.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center p-3 rounded-lg transition-all ${
              step.completed
                ? 'bg-green-50 border border-green-200'
                : index === currentStep
                ? 'bg-primary-50 border border-primary-200'
                : 'bg-neutral-50 border border-neutral-200'
            }`}
          >
            {/* 步骤编号 */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                step.completed
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-300 text-neutral-600'
              }`}
            >
              {step.completed ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            
            {/* 步骤信息 */}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  step.completed
                    ? 'text-green-700'
                    : index === currentStep
                    ? 'text-primary-700'
                    : 'text-neutral-600'
                }`}
              >
                {step.name}
              </p>
              {step.timestamp && (
                <p className="text-xs text-neutral-500">
                  完成于 {new Date(step.timestamp).toLocaleTimeString('zh-CN')}
                </p>
              )}
            </div>
            
            {/* 状态图标 */}
            {index === currentStep && (
              <div className="ml-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* 放弃漏斗按钮（用于追踪） */}
      {currentStep > 0 && currentStep < steps.length && (
        <button
          onClick={() => {
            trackEvent('funnel_abandon', {
              funnel_name: funnelName,
              abandoned_at_step: currentStep,
              completion_rate: completionRate,
            });
          }}
          className="mt-4 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          遇到问题？获取帮助
        </button>
      )}
    </div>
  );
};