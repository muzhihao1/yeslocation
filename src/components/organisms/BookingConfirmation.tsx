import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../atoms/Button';
import { useNavigate } from 'react-router-dom';

interface BookingDetails {
  id: string;
  type: 'store' | 'training';
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  storeName?: string;
  trainingName?: string;
  duration?: string;
  qrCode?: string;
}

interface BookingConfirmationProps {
  booking: BookingDetails;
  onClose?: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onClose,
}) => {
  const navigate = useNavigate();
  
  const handleAddToCalendar = () => {
    // 生成日历事件
    const startDate = new Date(`${booking.date} ${booking.time}`);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + (parseInt(booking.duration || '2')));
    
    const event = {
      title: booking.type === 'store' ? '台球预约' : '培训课程',
      start: startDate.toISOString().replace(/-|:|\.\d\d\d/g, ''),
      end: endDate.toISOString().replace(/-|:|\.\d\d\d/g, ''),
      location: booking.storeName || booking.trainingName || '耶氏体育',
    };
    
    // 生成 Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };
  
  const handleShare = () => {
    const shareText = `我已预约了${booking.date} ${booking.time}的${
      booking.type === 'store' ? '台球场地' : '培训课程'
    }，地点：${booking.storeName || booking.trainingName || '耶氏体育'}`;
    
    if (navigator.share) {
      navigator.share({
        title: '预约成功',
        text: shareText,
        url: window.location.href,
      });
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(shareText);
      alert('预约信息已复制到剪贴板');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* 成功标题 */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            className="w-10 h-10"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">预约成功！</h2>
        <p className="text-white/90">您的预约已确认，请准时到达</p>
      </div>
      
      {/* 预约详情 */}
      <div className="p-6 space-y-4">
        <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">预约编号</span>
            <span className="font-mono font-medium">{booking.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">姓名</span>
            <span className="font-medium">{booking.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">电话</span>
            <span className="font-medium">{booking.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">日期</span>
            <span className="font-medium">{booking.date}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">时间</span>
            <span className="font-medium">{booking.time}</span>
          </div>
          {booking.storeName && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">门店</span>
              <span className="font-medium">{booking.storeName}</span>
            </div>
          )}
          {booking.trainingName && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">课程</span>
              <span className="font-medium">{booking.trainingName}</span>
            </div>
          )}
        </div>
        
        {/* 二维码（如果有） */}
        {booking.qrCode && (
          <div className="text-center py-4">
            <img
              src={booking.qrCode}
              alt="预约二维码"
              className="w-32 h-32 mx-auto mb-2"
            />
            <p className="text-sm text-neutral-600">到店出示此二维码</p>
          </div>
        )}
        
        {/* 操作按钮 */}
        <div className="space-y-3">
          <Button
            fullWidth
            variant="secondary"
            onClick={handleAddToCalendar}
          >
            添加到日历
          </Button>
          <Button
            fullWidth
            variant="outline"
            onClick={handleShare}
          >
            分享预约信息
          </Button>
        </div>
        
        {/* 注意事项 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">温馨提示</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 请提前10分钟到达门店</li>
            <li>• 如需取消或修改，请提前2小时联系我们</li>
            <li>• 预约信息已发送至您的手机</li>
          </ul>
        </div>
        
        {/* 关闭按钮 */}
        <div className="flex gap-3">
          <Button
            fullWidth
            variant="outline"
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
          <Button
            fullWidth
            onClick={onClose || (() => navigate('/stores'))}
          >
            查看更多
          </Button>
        </div>
      </div>
    </motion.div>
  );
};