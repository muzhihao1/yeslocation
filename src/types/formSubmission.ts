/**
 * 表单提交类型定义
 */

export type FormType = 'booking' | 'inquiry' | 'franchise' | 'contact';

export type FormStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface BaseFormSubmission {
  id: string;
  type: FormType;
  status: FormStatus;
  submittedAt: Date;
  updatedAt: Date;
  notes?: string;
}

/**
 * 预约表单提交
 */
export interface BookingSubmission extends BaseFormSubmission {
  type: 'booking';
  data: {
    name: string;
    phone: string;
    email?: string;
    service: 'training' | 'experience' | 'venue';
    course?: string;
    date: string;
    time: string;
    store?: string;
    message?: string;
  };
}

/**
 * 咨询表单提交
 */
export interface InquirySubmission extends BaseFormSubmission {
  type: 'inquiry';
  data: {
    name: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
    productInterest?: string;
  };
}

/**
 * 加盟申请表单
 */
export interface FranchiseSubmission extends BaseFormSubmission {
  type: 'franchise';
  data: {
    name: string;
    phone: string;
    email: string;
    city: string;
    investment: string;
    experience: string;
    message: string;
  };
}

/**
 * 联系表单提交
 */
export interface ContactSubmission extends BaseFormSubmission {
  type: 'contact';
  data: {
    name: string;
    phone: string;
    email?: string;
    message: string;
  };
}

export type FormSubmission = 
  | BookingSubmission 
  | InquirySubmission 
  | FranchiseSubmission 
  | ContactSubmission;

/**
 * 表单统计数据
 */
export interface FormStatistics {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  todayCount: number;
  weekCount: number;
}

/**
 * 表单过滤条件
 */
export interface FormFilter {
  type?: FormType;
  status?: FormStatus;
  dateFrom?: Date;
  dateTo?: Date;
  searchText?: string;
}