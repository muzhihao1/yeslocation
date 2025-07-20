import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../atoms/Button';
import { useContextEngine } from '../../context/ContextEngine';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'image';
  quickReplies?: string[];
  image?: string;
}

interface ChatWidgetProps {
  className?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ className = '' }) => {
  const { dispatch } = useContextEngine();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '您好！我是耶氏体育的智能助手小耶，有什么可以帮助您的吗？',
      sender: 'bot',
      timestamp: new Date(),
      type: 'quick-reply',
      quickReplies: ['查看门店', '预约场地', '培训课程', '产品咨询', '加盟合作'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 自动回复逻辑
  const generateReply = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let replyText = '';
    let quickReplies: string[] = [];
    
    // 关键词匹配
    if (lowerMessage.includes('门店') || lowerMessage.includes('地址')) {
      replyText = '我们在昆明有10多家连锁门店，您想查看哪个区域的门店呢？';
      quickReplies = ['五华区', '盘龙区', '官渡区', '西山区', '查看所有门店'];
    } else if (lowerMessage.includes('预约') || lowerMessage.includes('订场')) {
      replyText = '请问您想预约哪家门店？我可以帮您查看可用时段。';
      quickReplies = ['最近的门店', '旗舰店', '查看所有门店', '了解价格'];
    } else if (lowerMessage.includes('培训') || lowerMessage.includes('教练')) {
      replyText = '我们提供专业的台球培训课程，包括：\n• 零基础入门班\n• 进阶技巧班\n• 一对一私教\n• 青少年培训班';
      quickReplies = ['查看课程详情', '预约体验课', '了解教练团队', '查看价格'];
    } else if (lowerMessage.includes('价格') || lowerMessage.includes('费用')) {
      replyText = '我们的收费标准如下：\n• 散台：30-50元/小时\n• 包间：80-120元/小时\n• 培训课程：200-500元/课时\n具体价格因门店和时段而异。';
      quickReplies = ['立即预约', '查看优惠活动', '会员价格'];
    } else if (lowerMessage.includes('加盟') || lowerMessage.includes('合作')) {
      replyText = '感谢您对耶氏体育的关注！我们的加盟优势：\n• 15年品牌积淀\n• 完善的运营支持\n• 专业的培训体系\n• 灵活的合作模式';
      quickReplies = ['了解加盟详情', '申请加盟', '联系招商经理'];
    } else if (lowerMessage.includes('你好') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      replyText = '您好！很高兴为您服务，请问有什么可以帮助您的吗？';
      quickReplies = ['查看门店', '预约场地', '培训课程', '产品咨询'];
    } else {
      replyText = '抱歉，我可能没有完全理解您的问题。您可以试试以下选项，或者直接致电我们的客服热线：0871-12345678';
      quickReplies = ['转人工客服', '查看常见问题', '留下联系方式'];
    }
    
    return {
      id: Date.now().toString(),
      text: replyText,
      sender: 'bot',
      timestamp: new Date(),
      type: quickReplies.length > 0 ? 'quick-reply' : 'text',
      quickReplies,
    };
  };
  
  // 发送消息
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // 记录用户参与度
    dispatch({
      type: 'UPDATE_ENGAGEMENT',
      payload: 'high', // 使用聊天功能表示高参与度
    });
    
    // 模拟延迟后自动回复
    setTimeout(() => {
      const reply = generateReply(text);
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  
  // 处理快捷回复
  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };
  
  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };
  
  return (
    <>
      {/* 聊天按钮 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors z-40 ${className}`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {/* 未读消息提示 */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* 聊天窗口 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 ${className}`}
          >
            {/* 头部 */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg font-bold">耶</span>
                </div>
                <div>
                  <h3 className="font-semibold">智能客服</h3>
                  <p className="text-xs text-white/80">在线</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender === 'user'
                        ? 'bg-primary-500 text-white rounded-2xl rounded-br-sm'
                        : 'bg-neutral-100 text-neutral-800 rounded-2xl rounded-bl-sm'
                    } px-4 py-2`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-white/70'
                          : 'text-neutral-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* 快捷回复 */}
              {messages[messages.length - 1]?.quickReplies && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {messages[messages.length - 1].quickReplies?.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 bg-white border border-primary-500 text-primary-600 rounded-full text-sm hover:bg-primary-50 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
              
              {/* 输入提示 */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 rounded-2xl rounded-bl-sm px-4 py-2">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce animation-delay-100" />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce animation-delay-200" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* 输入区域 */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="输入您的问题..."
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:border-primary-500 transition-colors"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputValue.trim()}
                  className="rounded-full"
                >
                  发送
                </Button>
              </div>
              <p className="text-xs text-neutral-500 mt-2 text-center">
                输入消息或点击快捷回复
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};