import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { aiExampleQuestions } from '../data/mockData';

export default function AIAssistant() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      {
        role: 'ai',
        text: `正在检索产品实践库，为您分析"${text.substring(0, 20)}..."相关知识...`,
      },
    ]);
    setInputValue('');
  };

  return (
    <div
      className="rounded-xl p-6 flex flex-col h-full"
      style={{
        background: 'linear-gradient(180deg, #2563EB 0%, #1E40AF 100%)',
        minHeight: '459px',
      }}
    >
      {/* 标题区 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Sparkles size={22} className="text-white" />
        </div>
        <div>
          <div className="text-xl font-semibold text-white">智能知识助手</div>
          <div className="text-sm text-white/80">快速解答您的业务问题</div>
        </div>
      </div>

      {/* 消息区 or 示例问题 */}
      <div className="flex-1 flex flex-col gap-3 mb-4 overflow-y-auto">
        {messages.length === 0 ? (
          aiExampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="w-full text-left px-3 py-3 rounded-lg bg-white/10 text-white text-sm leading-relaxed hover:bg-white/20 transition-colors"
            >
              {q}
            </button>
          ))
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`px-3 py-3 rounded-lg text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-white/20 text-white ml-4'
                  : 'bg-white/10 text-white/90 mr-4'
              }`}
            >
              {msg.role === 'ai' && (
                <span className="text-xs text-white/60 block mb-1">AI助手</span>
              )}
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* 输入框 */}
      <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
          placeholder="输入您的问题..."
          className="flex-1 bg-transparent text-white placeholder-white/60 text-sm focus:outline-none"
        />
        <button
          onClick={() => handleSend(inputValue)}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 hover:bg-blue-100 transition-colors"
        >
          <Send size={14} style={{ color: '#2563EB' }} />
        </button>
      </div>
    </div>
  );
}
