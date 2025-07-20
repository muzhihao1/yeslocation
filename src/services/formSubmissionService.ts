/**
 * 表单提交服务
 * 处理表单数据的存储和检索
 */

import { 
  FormSubmission, 
  FormType, 
  FormStatus, 
  FormFilter, 
  FormStatistics 
} from '../types/formSubmission';

class FormSubmissionService {
  private readonly STORAGE_KEY = 'yes_sports_form_submissions';

  /**
   * 获取所有表单提交
   */
  getAllSubmissions(): FormSubmission[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    try {
      const submissions = JSON.parse(data);
      // 转换日期字符串为Date对象
      return submissions.map((sub: any) => ({
        ...sub,
        submittedAt: new Date(sub.submittedAt),
        updatedAt: new Date(sub.updatedAt)
      }));
    } catch (error) {
      console.error('Error parsing form submissions:', error);
      return [];
    }
  }

  /**
   * 保存表单提交
   */
  saveSubmission(submission: Omit<FormSubmission, 'id' | 'submittedAt' | 'updatedAt'>): FormSubmission {
    const submissions = this.getAllSubmissions();
    
    const newSubmission: FormSubmission = {
      ...submission,
      id: this.generateId(),
      submittedAt: new Date(),
      updatedAt: new Date(),
      status: 'pending'
    } as FormSubmission;
    
    submissions.push(newSubmission);
    this.saveToStorage(submissions);
    
    return newSubmission;
  }

  /**
   * 更新表单状态
   */
  updateSubmissionStatus(id: string, status: FormStatus, notes?: string): FormSubmission | null {
    const submissions = this.getAllSubmissions();
    const index = submissions.findIndex(sub => sub.id === id);
    
    if (index === -1) return null;
    
    submissions[index] = {
      ...submissions[index],
      status,
      notes: notes || submissions[index].notes,
      updatedAt: new Date()
    };
    
    this.saveToStorage(submissions);
    return submissions[index];
  }

  /**
   * 获取单个表单提交
   */
  getSubmissionById(id: string): FormSubmission | null {
    const submissions = this.getAllSubmissions();
    return submissions.find(sub => sub.id === id) || null;
  }

  /**
   * 过滤表单提交
   */
  filterSubmissions(filter: FormFilter): FormSubmission[] {
    let submissions = this.getAllSubmissions();
    
    // 按类型过滤
    if (filter.type) {
      submissions = submissions.filter(sub => sub.type === filter.type);
    }
    
    // 按状态过滤
    if (filter.status) {
      submissions = submissions.filter(sub => sub.status === filter.status);
    }
    
    // 按日期范围过滤
    if (filter.dateFrom) {
      submissions = submissions.filter(sub => sub.submittedAt >= filter.dateFrom!);
    }
    
    if (filter.dateTo) {
      submissions = submissions.filter(sub => sub.submittedAt <= filter.dateTo!);
    }
    
    // 按搜索文本过滤
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      submissions = submissions.filter(sub => {
        const data = JSON.stringify(sub.data).toLowerCase();
        return data.includes(searchLower);
      });
    }
    
    // 按提交时间倒序排序
    return submissions.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  /**
   * 获取统计数据
   */
  getStatistics(): FormStatistics {
    const submissions = this.getAllSubmissions();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: submissions.length,
      pending: submissions.filter(sub => sub.status === 'pending').length,
      processing: submissions.filter(sub => sub.status === 'processing').length,
      completed: submissions.filter(sub => sub.status === 'completed').length,
      cancelled: submissions.filter(sub => sub.status === 'cancelled').length,
      todayCount: submissions.filter(sub => sub.submittedAt >= today).length,
      weekCount: submissions.filter(sub => sub.submittedAt >= weekAgo).length
    };
  }

  /**
   * 删除表单提交
   */
  deleteSubmission(id: string): boolean {
    const submissions = this.getAllSubmissions();
    const filtered = submissions.filter(sub => sub.id !== id);
    
    if (filtered.length === submissions.length) {
      return false; // 没有找到要删除的项
    }
    
    this.saveToStorage(filtered);
    return true;
  }

  /**
   * 批量更新状态
   */
  batchUpdateStatus(ids: string[], status: FormStatus): number {
    const submissions = this.getAllSubmissions();
    let updatedCount = 0;
    
    submissions.forEach(sub => {
      if (ids.includes(sub.id)) {
        sub.status = status;
        sub.updatedAt = new Date();
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      this.saveToStorage(submissions);
    }
    
    return updatedCount;
  }

  /**
   * 导出表单数据
   */
  exportSubmissions(filter?: FormFilter): string {
    const submissions = filter ? this.filterSubmissions(filter) : this.getAllSubmissions();
    
    // 转换为CSV格式
    const headers = ['ID', '类型', '状态', '提交时间', '姓名', '电话', '详情'];
    const rows = submissions.map(sub => {
      const name = (sub.data as any).name || '';
      const phone = (sub.data as any).phone || '';
      const details = JSON.stringify(sub.data);
      
      return [
        sub.id,
        this.getFormTypeName(sub.type),
        this.getStatusName(sub.status),
        sub.submittedAt.toLocaleString(),
        name,
        phone,
        details
      ].join(',');
    });
    
    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 保存到本地存储
   */
  private saveToStorage(submissions: FormSubmission[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(submissions));
  }

  /**
   * 获取表单类型名称
   */
  private getFormTypeName(type: FormType): string {
    const names = {
      booking: '预约',
      inquiry: '咨询',
      franchise: '加盟',
      contact: '联系'
    };
    return names[type] || type;
  }

  /**
   * 获取状态名称
   */
  private getStatusName(status: FormStatus): string {
    const names = {
      pending: '待处理',
      processing: '处理中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return names[status] || status;
  }

  /**
   * 生成模拟数据（用于测试）
   */
  generateMockData(): void {
    const mockSubmissions: Omit<FormSubmission, 'id' | 'submittedAt' | 'updatedAt'>[] = [
      {
        type: 'booking',
        status: 'pending',
        data: {
          name: '张三',
          phone: '13800138001',
          email: 'zhangsan@example.com',
          service: 'training',
          course: '基础入门班',
          date: '2025-01-20',
          time: '14:00',
          message: '想了解一下课程内容'
        }
      },
      {
        type: 'inquiry',
        status: 'processing',
        data: {
          name: '李四',
          phone: '13900139001',
          subject: '台球桌价格咨询',
          message: '请问你们的专业比赛台球桌多少钱？',
          productInterest: '耶氏专业系列'
        }
      },
      {
        type: 'franchise',
        status: 'pending',
        data: {
          name: '王五',
          phone: '13700137001',
          email: 'wangwu@example.com',
          city: '昆明',
          investment: '30-50万',
          experience: '有餐饮行业经验',
          message: '想在昆明开一家台球俱乐部'
        }
      },
      {
        type: 'contact',
        status: 'completed',
        data: {
          name: '赵六',
          phone: '13600136001',
          message: '合作意向咨询'
        }
      },
      {
        type: 'booking',
        status: 'completed',
        data: {
          name: '陈七',
          phone: '13500135001',
          service: 'venue',
          date: '2025-01-19',
          time: '19:00',
          store: '五华区旗舰店'
        }
      }
    ];

    // 为每个提交添加不同的时间
    const now = Date.now();
    mockSubmissions.forEach((submission, index) => {
      const timeOffset = index * 3600000; // 每个相差1小时
      const submittedAt = new Date(now - timeOffset);
      
      this.saveSubmission({
        ...submission,
        submittedAt,
        updatedAt: submittedAt
      } as any);
    });
  }
}

export const formSubmissionService = new FormSubmissionService();