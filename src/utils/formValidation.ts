/**
 * 表单验证工具集
 * 提供常用的表单验证规则和验证函数
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule[];
}

/**
 * 常用验证规则
 */
export const ValidationRules = {
  // 必填
  required: (message = '此项为必填项'): ValidationRule => ({
    required: true,
    message,
  }),

  // 最小长度
  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `最少需要${length}个字符`,
  }),

  // 最大长度
  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `最多允许${length}个字符`,
  }),

  // 电子邮件
  email: (message = '请输入有效的电子邮件地址'): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message,
  }),

  // 手机号码（中国）
  phone: (message = '请输入有效的手机号码'): ValidationRule => ({
    pattern: /^1[3-9]\d{9}$/,
    message,
  }),

  // 仅数字
  numeric: (message = '请输入数字'): ValidationRule => ({
    pattern: /^\d+$/,
    message,
  }),

  // 仅字母
  alpha: (message = '请输入字母'): ValidationRule => ({
    pattern: /^[a-zA-Z]+$/,
    message,
  }),

  // 字母和数字
  alphanumeric: (message = '请输入字母或数字'): ValidationRule => ({
    pattern: /^[a-zA-Z0-9]+$/,
    message,
  }),

  // 中文姓名
  chineseName: (message = '请输入有效的中文姓名'): ValidationRule => ({
    pattern: /^[\u4e00-\u9fa5]{2,10}$/,
    message,
  }),

  // 身份证号
  idCard: (message = '请输入有效的身份证号'): ValidationRule => ({
    pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
    message,
  }),

  // 密码强度
  password: (level: 'weak' | 'medium' | 'strong' = 'medium'): ValidationRule => {
    const patterns = {
      weak: /^.{6,}$/, // 至少6位
      medium: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/, // 至少8位，包含字母和数字
      strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, // 至少8位，包含大小写字母、数字和特殊字符
    };
    const messages = {
      weak: '密码至少需要6个字符',
      medium: '密码至少需要8个字符，包含字母和数字',
      strong: '密码至少需要8个字符，包含大小写字母、数字和特殊字符',
    };
    return {
      pattern: patterns[level],
      message: messages[level],
    };
  },

  // 确认密码
  confirmPassword: (passwordFieldName: string = 'password'): ValidationRule => ({
    custom: (value: string, formData?: any) => {
      return formData && formData[passwordFieldName] === value;
    },
    message: '两次输入的密码不一致',
  }),

  // 日期格式
  date: (format: 'YYYY-MM-DD' | 'DD/MM/YYYY' = 'YYYY-MM-DD'): ValidationRule => {
    const patterns = {
      'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
      'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
    };
    return {
      pattern: patterns[format],
      message: `请输入正确的日期格式 (${format})`,
    };
  },

  // 时间格式
  time: (message = '请输入正确的时间格式 (HH:MM)'): ValidationRule => ({
    pattern: /^([01]\d|2[0-3]):([0-5]\d)$/,
    message,
  }),

  // URL
  url: (message = '请输入有效的网址'): ValidationRule => ({
    pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    message,
  }),

  // 自定义验证
  custom: (validator: (value: any) => boolean, message: string): ValidationRule => ({
    custom: validator,
    message,
  }),
};

/**
 * 验证单个字段
 */
export function validateField(
  value: any,
  rules: ValidationRule[],
  formData?: any
): ValidationResult {
  for (const rule of rules) {
    // 检查必填
    if (rule.required && (!value || value === '')) {
      return {
        isValid: false,
        error: rule.message || '此项为必填项',
      };
    }

    // 如果值为空且不是必填，跳过其他验证
    if (!value || value === '') {
      continue;
    }

    // 检查最小长度
    if (rule.minLength && value.length < rule.minLength) {
      return {
        isValid: false,
        error: rule.message || `最少需要${rule.minLength}个字符`,
      };
    }

    // 检查最大长度
    if (rule.maxLength && value.length > rule.maxLength) {
      return {
        isValid: false,
        error: rule.message || `最多允许${rule.maxLength}个字符`,
      };
    }

    // 检查正则表达式
    if (rule.pattern && !rule.pattern.test(value)) {
      return {
        isValid: false,
        error: rule.message || '格式不正确',
      };
    }

    // 检查自定义验证
    if (rule.custom && !rule.custom(value)) {
      return {
        isValid: false,
        error: rule.message || '验证失败',
      };
    }
  }

  return { isValid: true };
}

/**
 * 验证整个表单
 */
export function validateForm(
  formData: Record<string, any>,
  validationRules: FieldValidation
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const value = formData[fieldName];
    const result = validateField(value, rules, formData);
    
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
    }
  }

  return errors;
}

/**
 * 获取字段验证状态
 */
export function getFieldStatus(
  fieldName: string,
  errors: Record<string, string>,
  touched: Record<string, boolean>
): 'default' | 'error' | 'success' {
  if (!touched[fieldName]) {
    return 'default';
  }
  
  return errors[fieldName] ? 'error' : 'success';
}

/**
 * 格式化输入值
 */
export const formatters = {
  // 格式化手机号 (xxx xxxx xxxx)
  phone: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    return value;
  },

  // 格式化银行卡号 (xxxx xxxx xxxx xxxx)
  bankCard: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const parts = cleaned.match(/.{1,4}/g) || [];
    return parts.join(' ');
  },

  // 格式化金额 (千分位)
  currency: (value: string): string => {
    const cleaned = value.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  },

  // 格式化日期 (YYYY-MM-DD)
  date: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,2})(\d{0,2})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }
    return value;
  },
};

/**
 * 输入限制器
 */
export const restrictors = {
  // 仅允许数字
  numeric: (value: string): string => value.replace(/\D/g, ''),

  // 仅允许字母
  alpha: (value: string): string => value.replace(/[^a-zA-Z]/g, ''),

  // 仅允许字母和数字
  alphanumeric: (value: string): string => value.replace(/[^a-zA-Z0-9]/g, ''),

  // 仅允许中文
  chinese: (value: string): string => value.replace(/[^\u4e00-\u9fa5]/g, ''),

  // 限制最大长度
  maxLength: (value: string, max: number): string => value.slice(0, max),
};