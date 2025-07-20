/**
 * 表单管理 Hook
 * 提供表单状态管理、验证、提交等功能
 */

import { useState, useCallback, useEffect } from 'react';
import {
  FieldValidation,
  validateField,
  validateForm,
  getFieldStatus,
} from '../utils/formValidation';

interface UseFormConfig<T> {
  initialValues: T;
  validationRules?: FieldValidation;
  onSubmit?: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldTouched: (name: keyof T, touched?: boolean) => void;
  validateField: (name: keyof T) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
  resetField: (name: keyof T) => void;
  getFieldProps: (name: keyof T) => {
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<any>) => void;
    onBlur: (e: React.FocusEvent<any>) => void;
    error?: string;
    status: 'default' | 'error' | 'success';
  };
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
  resetOnSubmit = false,
}: UseFormConfig<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // 计算表单是否有效
  const isValid = Object.keys(errors).length === 0;

  // 验证单个字段
  const validateFieldHandler = useCallback(
    (name: keyof T): boolean => {
      const fieldName = name as string;
      const rules = validationRules[fieldName];
      
      if (!rules) return true;

      const result = validateField(values[name], rules, values);
      
      if (result.isValid) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return true;
      } else {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: result.error || '',
        }));
        return false;
      }
    },
    [values, validationRules]
  );

  // 验证整个表单
  const validateFormHandler = useCallback((): boolean => {
    const newErrors = validateForm(values, validationRules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  // 处理字段值变化
  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
      setIsDirty(true);

      if (validateOnChange && touched[name as string]) {
        setTimeout(() => {
          validateFieldHandler(name);
        }, 0);
      }
    },
    [validateOnChange, touched, validateFieldHandler]
  );

  // 处理字段失焦
  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({
        ...prev,
        [name as string]: true,
      }));

      if (validateOnBlur) {
        validateFieldHandler(name);
      }
    },
    [validateOnBlur, validateFieldHandler]
  );

  // 处理表单提交
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // 标记所有字段为已触碰
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // 验证表单
      const isFormValid = validateFormHandler();
      if (!isFormValid) return;

      // 提交表单
      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(values);
        }

        if (resetOnSubmit) {
          resetForm();
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, resetOnSubmit, validateFormHandler]
  );

  // 设置字段值
  const setFieldValue = useCallback((name: keyof T, value: any) => {
    handleChange(name, value);
  }, [handleChange]);

  // 设置字段错误
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name as string]: error,
    }));
  }, []);

  // 设置字段触碰状态
  const setFieldTouched = useCallback((name: keyof T, touched = true) => {
    setTouched((prev) => ({
      ...prev,
      [name as string]: touched,
    }));
  }, []);

  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialValues]);

  // 重置单个字段
  const resetField = useCallback(
    (name: keyof T) => {
      setValues((prev) => ({
        ...prev,
        [name]: initialValues[name],
      }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
      setTouched((prev) => ({
        ...prev,
        [name as string]: false,
      }));
    },
    [initialValues]
  );

  // 获取字段属性
  const getFieldProps = useCallback(
    (name: keyof T) => {
      const fieldName = name as string;
      return {
        name: fieldName,
        value: values[name],
        onChange: (e: React.ChangeEvent<any>) => {
          const value = e.target.type === 'checkbox' 
            ? e.target.checked 
            : e.target.value;
          handleChange(name, value);
        },
        onBlur: (e: React.FocusEvent<any>) => {
          handleBlur(name);
        },
        error: errors[fieldName],
        status: getFieldStatus(fieldName, errors, touched),
      };
    },
    [values, errors, touched, handleChange, handleBlur]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField: validateFieldHandler,
    validateForm: validateFormHandler,
    resetForm,
    resetField,
    getFieldProps,
  };
}