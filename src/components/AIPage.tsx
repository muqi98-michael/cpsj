import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Sparkles, Plus, Trash2, Globe, Paperclip, X,
  ChevronDown, Search, FileText, Image, MoreHorizontal,
  Clock, MessageSquare,
} from 'lucide-react';
import { aiExampleQuestions } from '../data/mockData';

/* ──────────────── 类型定义 ──────────────── */
interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
  attachments?: UploadedFile[];
  searching?: boolean;
}

interface UploadedFile {
  name: string;
  size: string;
  type: 'doc' | 'pdf' | 'image' | 'other';
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  messages: Message[];
}

/* ──────────────── 模型列表 ──────────────── */
interface ModelOption { id: string; name: string; badge?: string; }
const MODELS: ModelOption[] = [
  { id: 'deepseek-v3',    name: 'DeepSeek-V3',       badge: '推荐' },
  { id: 'gpt-4o',         name: 'GPT-4o'             },
  { id: 'claude-3-5',     name: 'Claude 3.5 Sonnet'  },
  { id: 'qwen-max',       name: '通义千问 Max'        },
  { id: 'doubao-pro',     name: '豆包 Pro'            },
];

/* ──────────────── AI 回复模拟 ──────────────── */
const AI_RESPONSES: Record<string, string> = {
  default: '感谢您的提问！基于产品实践库中的知识沉淀，我正在为您检索相关的解决方案和案例。请稍等片刻，我将为您提供精准的业务洞察和实践建议。',
  web: '已开启联网搜索，正在实时检索相关信息...\n\n根据最新搜索结果与产品实践库知识综合分析，以下是针对您问题的专业解答：\n\n该领域近期已有多家企业完成数字化转型，主要采用以下几种方案路径，成效显著。建议结合您的企业实际情况，选择适合的落地方案。',
  file:  '已接收您上传的文件，正在解析文档内容...\n\n通过分析文档信息，结合产品实践库知识体系，为您提供以下专业建议：\n\n文档中提及的核心业务问题在同类企业中较为普遍，我们有相关的成熟解决方案可供参考。',
};

function genId() { return Math.random().toString(36).slice(2); }
function nowTime() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

/* ──────────────── 初始对话历史（mock） ──────────────── */
const INIT_HISTORY: Conversation[] = [
  {
    id: 'h1',
    title: '金融行业信用评估解决方案',
    preview: '金融行业有哪些信用评估解决方案？',
    updatedAt: '今天 10:24',
    messages: [
      { id: 'm1', role: 'ai',  text: '您好！我是智能知识助手，有什么可以帮您？', time: '10:20' },
      { id: 'm2', role: 'user', text: '金融行业有哪些信用评估解决方案？', time: '10:23' },
      { id: 'm3', role: 'ai',  text: '金融行业信用评估解决方案通常包含以下几个核心方向：\n\n1. **AI 驱动的信用评分模型**：基于机器学习，整合多维数据提升评估准确率\n2. **实时风控决策引擎**：毫秒级审批，支持反欺诈与动态授信\n3. **行为数据分析平台**：挖掘用户行为特征，构建立体信用画像\n\n在产品实践库中，"某股份制银行智能风控系统建设"案例可供参考，该项目将不良贷款率降低了18%。', time: '10:24' },
    ],
  },
  {
    id: 'h2',
    title: '制造业生产流程优化方案',
    preview: '如何为制造企业设计生产流程优化方案？',
    updatedAt: '昨天 15:48',
    messages: [
      { id: 'm1', role: 'ai',  text: '您好！我是智能知识助手，有什么可以帮您？', time: '15:40' },
      { id: 'm2', role: 'user', text: '如何为制造企业设计生产流程优化方案？', time: '15:45' },
      { id: 'm3', role: 'ai',  text: '制造业生产流程优化通常包含：MES系统升级、产线数字孪生、质检AI化三大方向。', time: '15:48' },
    ],
  },
  {
    id: 'h3',
    title: '零售行业库存管理最佳实践',
    preview: '零售行业库存管理的最佳实践是什么？',
    updatedAt: '昨天 09:12',
    messages: [
      { id: 'm1', role: 'ai',  text: '您好！我是智能知识助手，有什么可以帮您？', time: '09:10' },
      { id: 'm2', role: 'user', text: '零售行业库存管理的最佳实践是什么？', time: '09:11' },
      { id: 'm3', role: 'ai',  text: '零售行业库存管理的核心在于：智能需求预测、自动补货决策与供应链可视化三个方向的协同联动。', time: '09:12' },
    ],
  },
];

/* ──────────────── 主组件 ──────────────── */
export default function AIPage() {
  const [history, setHistory] = useState<Conversation[]>(INIT_HISTORY);
  const [activeId, setActiveId] = useState<string | null>(null);   // null = 新建对话
  const [messages, setMessages] = useState<Message[]>([
    { id: genId(), role: 'ai', text: '您好！我是智能知识助手，可以帮您快速检索产品实践库中的场景、解决方案和案例。请直接输入您的问题，或点击下方示例问题开始探索。', time: nowTime() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 工具栏状态
  const [selectedModel, setSelectedModel] = useState<ModelOption>(MODELS[0]);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 自动撑高 textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [input]);

  /* 新建对话 */
  const newChat = useCallback(() => {
    setActiveId(null);
    setMessages([{ id: genId(), role: 'ai', text: '您好！我是智能知识助手，请问有什么可以帮您？', time: nowTime() }]);
    setInput('');
    setUploadedFiles([]);
  }, []);

  /* 切换历史对话 */
  const switchConv = useCallback((conv: Conversation) => {
    setActiveId(conv.id);
    setMessages(conv.messages);
    setInput('');
    setUploadedFiles([]);
  }, []);

  /* 删除历史 */
  const deleteConv = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(h => h.filter(c => c.id !== id));
    if (activeId === id) newChat();
  }, [activeId, newChat]);

  /* 处理文件上传 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const mapped: UploadedFile[] = files.map(f => {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
      const type: UploadedFile['type'] =
        ['pdf'].includes(ext) ? 'pdf' :
        ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext) ? 'doc' :
        ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? 'image' : 'other';
      const kb = f.size / 1024;
      const size = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
      return { name: f.name, size, type };
    });
    setUploadedFiles(prev => [...prev, ...mapped]);
    e.target.value = '';
  };

  /* 发送消息 */
  const sendMessage = (text: string = input) => {
    if (!text.trim() && uploadedFiles.length === 0) return;
    const now = nowTime();
    const userMsg: Message = {
      id: genId(), role: 'user', text: text.trim(),
      time: now,
      attachments: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setInput('');
    setUploadedFiles([]);
    setIsTyping(true);

    setTimeout(() => {
      const aiText = uploadedFiles.length > 0 ? AI_RESPONSES.file
        : webSearch ? AI_RESPONSES.web
        : AI_RESPONSES.default;
      const aiMsg: Message = { id: genId(), role: 'ai', text: aiText, time: nowTime() };
      const finalMsgs = [...nextMsgs, aiMsg];
      setMessages(finalMsgs);
      setIsTyping(false);

      // 保存 / 更新历史
      const title = text.slice(0, 18) || uploadedFiles[0]?.name.slice(0, 18) || '新对话';
      if (activeId) {
        setHistory(h => h.map(c => c.id === activeId
          ? { ...c, messages: finalMsgs, preview: text, updatedAt: '刚刚' }
          : c));
      } else {
        const newConv: Conversation = {
          id: genId(), title, preview: text,
          updatedAt: '刚刚', messages: finalMsgs,
        };
        setHistory(h => [newConv, ...h]);
        setActiveId(newConv.id);
      }
    }, 1200);
  };

  const currentTitle = activeId
    ? history.find(c => c.id === activeId)?.title ?? '对话'
    : '新建对话';

  /* 文件类型图标 */
  const FileIcon = ({ type }: { type: UploadedFile['type'] }) => {
    if (type === 'image') return <Image size={14} className="text-blue-500" />;
    if (type === 'pdf')   return <FileText size={14} className="text-red-500" />;
    return <FileText size={14} className="text-gray-500" />;
  };

  /* 简单 markdown 粗体渲染 */
  const renderText = (text: string) =>
    text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });

  return (
    <main className="bg-gray-50" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex h-full max-w-[1400px] mx-auto">

        {/* ── 左侧：历史记录侧栏 ── */}
        <aside className="w-60 flex-shrink-0 flex flex-col bg-white border-r border-gray-100 h-full">
          {/* 顶部 */}
          <div className="p-3 border-b border-gray-100">
            <button
              onClick={newChat}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #2563EB, #9333EA)' }}
            >
              <Plus size={15} /> 新建对话
            </button>
          </div>

          {/* 搜索 */}
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <Search size={13} className="text-gray-400 flex-shrink-0" />
              <input className="flex-1 text-xs text-gray-600 bg-transparent focus:outline-none placeholder-gray-400" placeholder="搜索历史对话…" />
            </div>
          </div>

          {/* 历史列表 */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
            <p className="text-[11px] text-gray-400 font-medium px-2 py-1.5 mt-1">最近对话</p>
            {history.map(conv => (
              <button
                key={conv.id}
                onClick={() => switchConv(conv)}
                className={`w-full text-left group flex items-start gap-2 px-2 py-2.5 rounded-xl transition-colors ${
                  activeId === conv.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'
                }`}
              >
                <MessageSquare size={13} className={`mt-0.5 flex-shrink-0 ${activeId === conv.id ? 'text-blue-500' : 'text-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${activeId === conv.id ? 'text-blue-700' : 'text-gray-700'}`}>{conv.title}</p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock size={10} /> {conv.updatedAt}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteConv(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50 transition-all flex-shrink-0 mt-0.5"
                >
                  <Trash2 size={12} className="text-gray-300 hover:text-red-400 transition-colors" />
                </button>
              </button>
            ))}
            {history.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">暂无历史对话</p>
            )}
          </div>
        </aside>

        {/* ── 主区域 ── */}
        <div className="flex-1 flex flex-col min-w-0 h-full">

          {/* 顶部标题栏 */}
          <div className="flex items-center gap-3 px-6 py-3 bg-white border-b border-gray-100 flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563EB, #9333EA)' }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-gray-800 truncate">{currentTitle}</h1>
              <p className="text-xs text-gray-400">智能知识助手 · {selectedModel.name}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              已就绪
            </div>
          </div>

          {/* 消息滚动区 */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* 头像 */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                  style={{ background: msg.role === 'ai'
                    ? 'linear-gradient(135deg, #2563EB, #1E40AF)'
                    : 'linear-gradient(135deg, #7C3AED, #9333EA)' }}>
                  {msg.role === 'ai' ? <Sparkles size={13} /> : '我'}
                </div>

                <div className={`max-w-[72%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* 附件 */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-1">
                      {msg.attachments.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-gray-100 shadow-sm text-xs text-gray-600">
                          <FileIcon type={f.type} />
                          <span className="max-w-[120px] truncate">{f.name}</span>
                          <span className="text-gray-400">{f.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* 气泡 */}
                  {msg.text && (
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white rounded-tr-sm'
                        : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'
                    }`}
                      style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #2563EB, #4F46E5)' } : {}}>
                      {renderText(msg.text)}
                    </div>
                  )}
                  <span className="text-[11px] text-gray-400 px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* 打字中 */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #1E40AF)' }}>
                  <Sparkles size={13} />
                </div>
                <div className="px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 示例问题 */}
          {messages.length <= 1 && (
            <div className="px-6 pb-2 flex gap-2 flex-wrap">
              {aiExampleQuestions.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 rounded-lg border border-blue-200 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ── 底部输入区 ── */}
          <div className="px-6 pb-4 pt-2 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              {/* 已上传文件预览 */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600">
                      <FileIcon type={f.type} />
                      <span className="max-w-[120px] truncate">{f.name}</span>
                      <span className="text-gray-400 flex-shrink-0">{f.size}</span>
                      <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}
                        className="ml-0.5 text-gray-300 hover:text-red-400 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 文本输入 */}
              <div className="px-4 pt-3 pb-1">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="输入问题，Shift+Enter 换行，Enter 发送…"
                  className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none bg-transparent leading-relaxed"
                  style={{ minHeight: '24px', maxHeight: '120px' }}
                />
              </div>

              {/* 工具栏 */}
              <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-50">

                {/* 模型选择器 */}
                <div className="relative">
                  <button
                    onClick={() => setShowModelPicker(p => !p)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
                  >
                    <Sparkles size={12} className="text-blue-500" />
                    <span>{selectedModel.name}</span>
                    <ChevronDown size={11} className={`text-gray-400 transition-transform ${showModelPicker ? 'rotate-180' : ''}`} />
                  </button>
                  {showModelPicker && (
                    <div className="absolute bottom-full left-0 mb-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 z-50">
                      <p className="text-[11px] text-gray-400 font-medium px-3 py-1">选择大模型</p>
                      {MODELS.map(m => (
                        <button key={m.id} onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${selectedModel.id === m.id ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                          <span>{m.name}</span>
                          <div className="flex items-center gap-1.5">
                            {m.badge && <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-500 text-[10px] font-medium">{m.badge}</span>}
                            {selectedModel.id === m.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 联网搜索 */}
                <button
                  onClick={() => setWebSearch(p => !p)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    webSearch
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  <Globe size={12} className={webSearch ? 'text-blue-500' : 'text-gray-400'} />
                  联网搜索
                  {webSearch && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                </button>

                {/* 上传文件 */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <Paperclip size={12} className="text-gray-400" />
                  上传文件
                </button>
                <input ref={fileInputRef} type="file" multiple className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileChange} />

                <div className="flex-1" />

                {/* 字数提示 */}
                {input.length > 0 && (
                  <span className="text-[11px] text-gray-300">{input.length}</span>
                )}

                {/* 更多 */}
                <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                  <MoreHorizontal size={15} />
                </button>

                {/* 发送 */}
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() && uploadedFiles.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #4F46E5)' }}
                >
                  <Send size={13} /> 发送
                </button>
              </div>
            </div>

            <p className="text-center text-[11px] text-gray-300 mt-2">
              AI 回复仅供参考，请结合实际业务情况判断
            </p>
          </div>
        </div>
      </div>

      {/* 关闭模型选择器的遮罩 */}
      {showModelPicker && (
        <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />
      )}
    </main>
  );
}
