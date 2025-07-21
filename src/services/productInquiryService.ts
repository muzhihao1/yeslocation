/**
 * 产品咨询服务
 * 处理产品咨询表单的提交、存储和查询
 */

import { ProductInquiry, ProductInquiryFormData } from '../types/models';

/**
 * 产品咨询服务类
 */
class ProductInquiryService {
  private readonly STORAGE_KEY = 'yes_sports_product_inquiries';
  
  /**
   * 生成唯一的咨询ID
   * @returns 咨询ID (格式: INQ-YYYYMMDD-XXXX)
   */
  private generateInquiryId(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INQ-${dateStr}-${random}`;
  }
  
  /**
   * 获取所有咨询记录
   * @returns 咨询记录数组
   */
  private getAllInquiries(): ProductInquiry[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * 保存咨询记录到本地存储
   * @param inquiries 咨询记录数组
   */
  private saveInquiries(inquiries: ProductInquiry[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(inquiries));
  }
  
  /**
   * 提交产品咨询
   * @param formData 表单数据
   * @returns 创建的咨询记录
   */
  async submitInquiry(formData: ProductInquiryFormData): Promise<ProductInquiry> {
    // 验证表单数据
    if (!formData.name || !formData.phone || !formData.product || !formData.quantity) {
      throw new Error('请填写所有必填字段');
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      throw new Error('请输入正确的手机号');
    }
    
    // 创建咨询记录
    const inquiry: ProductInquiry = {
      ...formData,
      id: this.generateInquiryId(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // 保存到本地存储
    const inquiries = this.getAllInquiries();
    inquiries.unshift(inquiry); // 新记录放在最前面
    this.saveInquiries(inquiries);
    
    // 模拟异步提交到服务器
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 如果在生产环境，这里应该调用真实的API
    // const response = await api.productInquiries.submit(inquiry);
    
    return inquiry;
  }
  
  /**
   * 根据手机号查询咨询记录
   * @param phone 手机号
   * @returns 匹配的咨询记录数组
   */
  async getInquiriesByPhone(phone: string): Promise<ProductInquiry[]> {
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('请输入正确的手机号');
    }
    
    // 模拟异步查询
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const inquiries = this.getAllInquiries();
    return inquiries.filter(inquiry => inquiry.phone === phone);
  }
  
  /**
   * 根据ID获取单个咨询记录
   * @param id 咨询ID
   * @returns 咨询记录或null
   */
  async getInquiryById(id: string): Promise<ProductInquiry | null> {
    // 模拟异步查询
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const inquiries = this.getAllInquiries();
    return inquiries.find(inquiry => inquiry.id === id) || null;
  }
  
  /**
   * 获取最近的咨询记录
   * @param limit 返回记录数量限制
   * @returns 最近的咨询记录数组
   */
  async getRecentInquiries(limit: number = 10): Promise<ProductInquiry[]> {
    // 模拟异步查询
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const inquiries = this.getAllInquiries();
    return inquiries.slice(0, limit);
  }
  
  /**
   * 更新咨询状态
   * @param id 咨询ID
   * @param status 新状态
   * @param followUpNotes 跟进备注
   * @returns 更新后的咨询记录
   */
  async updateInquiryStatus(
    id: string, 
    status: ProductInquiry['status'], 
    followUpNotes?: string
  ): Promise<ProductInquiry | null> {
    const inquiries = this.getAllInquiries();
    const index = inquiries.findIndex(inquiry => inquiry.id === id);
    
    if (index === -1) {
      return null;
    }
    
    inquiries[index] = {
      ...inquiries[index],
      status,
      followUpNotes: followUpNotes || inquiries[index].followUpNotes
    };
    
    this.saveInquiries(inquiries);
    
    // 模拟异步更新
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return inquiries[index];
  }
  
  /**
   * 清理过期的咨询记录（超过90天）
   * @returns 清理的记录数量
   */
  cleanupOldInquiries(): number {
    const inquiries = this.getAllInquiries();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const filtered = inquiries.filter(inquiry => {
      const submittedDate = new Date(inquiry.submittedAt);
      return submittedDate > ninetyDaysAgo;
    });
    
    const removedCount = inquiries.length - filtered.length;
    this.saveInquiries(filtered);
    
    return removedCount;
  }
}

/**
 * 导出单例实例
 */
export const productInquiryService = new ProductInquiryService();