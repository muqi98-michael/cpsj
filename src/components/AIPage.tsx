import { useState } from 'react';
import { Send, Sparkles, RotateCcw } from 'lucide-react';
import { aiExampleQuestions } from '../data/mockData';

interface Message {
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const aiResponses: Record<string, string> = {
  default:
    '感谢您的提问！基于产品实践库中的知识沉淀，我正在为您检索相关的解决方案和案例。请稍等片刻，我将为您提供精准的业务洞察和实践建议。',
};

export default function AIPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: '您好！我是智能知识助手，可以帮您快速检索产品实践库中的场景、解决方案和案例。请直接输入您的问题，或点击下方示例问题开始探索。',
      time: '刚刚',
    },
  ]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { role: 'user', text, time: now },
      {
        role: 'ai',
        text: aiResponses.default,
        time: now,
      },
    ]);
    setInput('');
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-8 h-[calc(100vh-64px)] flex flex-col">
        {/* 标题 */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB, #9333EA)' }}
          >
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">智能知识助手</h1>
            <p className="text-sm text-gray-500">基于产品实践库知识库，智能解答业务问题</p>
          </div>
          <button
            onClick={() =>
              setMessages([
                {
                  role: 'ai',
                  text: '对话已清空。请输入新的问题开始探索！',
                  time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw size={14} />
            清空对话
          </button>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 pr-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-medium"
                style={{
                  background:
                    msg.role === 'ai'
                      ? 'linear-gradient(135deg, #2563EB, #1E40AF)'
                      : 'linear-gradient(135deg, #2563EB, #9333EA)',
                }}
              >
                {msg.role === 'ai' ? 'AI' : '张'}
              </div>
              <div className={`max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-tr-sm'
                      : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'
                  }`}
                  style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #2563EB, #1E40AF)' } : {}}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 示例问题 */}
        {messages.length <= 1 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {aiExampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="px-3 py-2 rounded-lg border border-blue-200 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* 输入框 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="输入您的问题，按 Enter 发送..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: '#2563EB' }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </main>
  );
}
