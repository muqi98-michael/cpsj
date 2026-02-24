import { useState } from 'react';
import {
  Key, Plus, Copy, Eye, EyeOff, MoreHorizontal, RefreshCw,
  CheckCircle, Trash2, Edit2,
  Plug, Globe, BarChart2, AlertTriangle,
  Code, Download, ExternalLink, Activity, Zap, Database, Settings,
} from 'lucide-react';

/* ─────────── 类型 ─────────── */
type OpenTab = 'api' | 'webhooks' | 'integrations' | 'embed';

/* ─────────── Mock 数据 ─────────── */
const API_KEYS = [
  {
    id: '1', name: '生产环境 API Key', key: 'sk-prod-a8f3k2j9...d7x1', fullKey: 'sk-prod-a8f3k2j9mq8rtz4yd7x1',
    status: '启用', createdAt: '2024-01-15', lastUsed: '2024-04-10 09:23',
    calls: 12480, permissions: ['读取场景', '读取解决方案', '读取案例'],
  },
  {
    id: '2', name: '测试环境 API Key', key: 'sk-test-b4n7p1w5...e2m8', fullKey: 'sk-test-b4n7p1w5hz3qa6xe2m8',
    status: '启用', createdAt: '2024-02-20', lastUsed: '2024-04-09 16:45',
    calls: 3240, permissions: ['读取场景', '写入场景'],
  },
  {
    id: '3', name: '第三方集成 Key', key: 'sk-intg-c9r2s6v8...f5k4', fullKey: 'sk-intg-c9r2s6v8nj7pb0yf5k4',
    status: '禁用', createdAt: '2024-03-08', lastUsed: '2024-03-25 10:00',
    calls: 856, permissions: ['读取场景'],
  },
];

const WEBHOOKS = [
  { id: '1', name: '内容审核通知', url: 'https://hooks.company.com/content-review', events: ['内容.创建', '内容.审核'], status: '启用', lastTriggered: '2024-04-10 09:25', successRate: 98.5 },
  { id: '2', name: '用户行为分析', url: 'https://analytics.company.com/webhook', events: ['用户.登录', '用户.下载'], status: '启用', lastTriggered: '2024-04-10 08:55', successRate: 100 },
  { id: '3', name: 'CRM 系统同步', url: 'https://crm.company.com/api/webhook', events: ['案例.发布', '解决方案.更新'], status: '禁用', lastTriggered: '2024-03-28 14:30', successRate: 85.2 },
];

const INTEGRATIONS = [
  { id: '1', name: 'Salesforce CRM', logo: 'SF', logoColor: '#00A1E0', logoBg: '#E3F4FD', desc: '同步客户案例与解决方案到 Salesforce', status: '已连接', connectedAt: '2024-01-20', category: 'CRM' },
  { id: '2', name: '企业微信', logo: '企', logoColor: '#07C160', logoBg: '#E6F9EE', desc: '内容更新通知推送到企业微信群', status: '已连接', connectedAt: '2024-02-15', category: '通讯' },
  { id: '3', name: 'Confluence', logo: 'CF', logoColor: '#0052CC', logoBg: '#E3EDFF', desc: '将场景与解决方案同步至 Confluence 知识库', status: '未连接', connectedAt: '—', category: '知识库' },
  { id: '4', name: '钉钉', logo: '钉', logoColor: '#1677FF', logoBg: '#E6F0FF', desc: '工作流审批与消息通知', status: '未连接', connectedAt: '—', category: '通讯' },
  { id: '5', name: 'Power BI', logo: 'PB', logoColor: '#F2C811', logoBg: '#FFFBE6', desc: '将平台数据接入 Power BI 进行可视化分析', status: '已连接', connectedAt: '2024-03-10', category: '分析' },
  { id: '6', name: 'Slack', logo: 'SL', logoColor: '#4A154B', logoBg: '#F5EEF8', desc: '内容变更通知发送到 Slack 频道', status: '未连接', connectedAt: '—', category: '通讯' },
];

const EMBED_CODE = `<script>
  window.CPSJ_CONFIG = {
    apiKey: 'sk-prod-a8f3k2j9...d7x1',
    theme: 'light',
    language: 'zh-CN',
    features: ['search', 'scenes', 'solutions']
  };
</script>
<script src="https://cdn.cpsj.com/embed/v2/widget.js" async></script>`;

const API_STATS = [
  { label: '本月调用量', value: '16,576', delta: '+23%', icon: <Activity size={18} />, color: '#2563EB', bg: '#DBEAFE' },
  { label: '平均响应时间', value: '128ms', delta: '-8ms', icon: <Zap size={18} />, color: '#16A34A', bg: '#DCFCE7' },
  { label: '成功率', value: '99.2%', delta: '+0.3%', icon: <CheckCircle size={18} />, color: '#9333EA', bg: '#F3E8FF' },
  { label: '活跃 API Key', value: '2', delta: '', icon: <Key size={18} />, color: '#D97706', bg: '#FEF3C7' },
];

/* ─────────── 子组件 ─────────── */
const STATUS_CFG: Record<string, { bg: string; color: string }> = {
  启用:   { bg: '#DCFCE7', color: '#15803D' },
  禁用:   { bg: '#FEE2E2', color: '#DC2626' },
  已连接: { bg: '#DCFCE7', color: '#15803D' },
  未连接: { bg: '#F3F4F6', color: '#6B7280' },
};

function Badge({ label }: { label: string }) {
  const cfg = STATUS_CFG[label] ?? { bg: '#F3F4F6', color: '#6B7280' };
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={cfg}>{label}</span>;
}

/* ─────────── API 管理 ─────────── */
function ApiManagement() {
  const [showKeys, setShowKeys] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  function toggleShow(id: string) {
    setShowKeys((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-5">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {API_STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg, color: s.color }}>{s.icon}</div>
              {s.delta && <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{s.delta}</span>}
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* API Key 列表 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800">API 密钥管理</h3>
            <p className="text-xs text-gray-400 mt-0.5">用于第三方系统集成与 API 调用认证</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: '#2563EB' }}>
            <Plus size={14} />新建 API Key
          </button>
        </div>

        {/* 警告提示 */}
        <div className="mx-5 mt-4 flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">API 密钥具有访问权限，请勿在客户端代码中暴露。建议定期轮换密钥以保障安全。</p>
        </div>

        <div className="p-5 space-y-3">
          {API_KEYS.map((apiKey) => (
            <div key={apiKey.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <Key size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{apiKey.name}</p>
                    <p className="text-xs text-gray-400">创建于 {apiKey.createdAt} · 最后使用 {apiKey.lastUsed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={apiKey.status} />
                  <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><MoreHorizontal size={15} /></button>
                </div>
              </div>

              {/* Key 显示区 */}
              <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-gray-50 border border-gray-200 font-mono text-sm">
                <span className="flex-1 text-gray-700 truncate">
                  {showKeys.has(apiKey.id) ? apiKey.fullKey : apiKey.key}
                </span>
                <button onClick={() => toggleShow(apiKey.id)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  {showKeys.has(apiKey.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => handleCopy(apiKey.fullKey, apiKey.id)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0">
                  {copied === apiKey.id ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {apiKey.permissions.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>{p}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><BarChart2 size={12} /> {apiKey.calls.toLocaleString()} 次调用</span>
                  <button className="text-blue-600 hover:underline text-xs">编辑</button>
                  <button className="text-red-500 hover:underline text-xs">删除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API 文档入口 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 flex items-center justify-between text-white">
        <div>
          <p className="font-semibold text-lg mb-1">API 开发文档</p>
          <p className="text-blue-100 text-sm">查看完整 API 参考文档、SDK 下载和示例代码</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white text-sm font-medium hover:bg-opacity-30 transition-colors">
            <Code size={15} />查看文档
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors">
            <Download size={15} />下载 SDK
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Webhook 管理 ─────────── */
function WebhookManagement() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800">Webhook 配置</h3>
            <p className="text-xs text-gray-400 mt-0.5">当平台发生特定事件时，自动向目标 URL 推送通知</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: '#2563EB' }}>
            <Plus size={14} />添加 Webhook
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {WEBHOOKS.map((wh) => (
            <div key={wh.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
                    <Zap size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{wh.name}</p>
                    <p className="text-xs text-gray-400 font-mono truncate max-w-xs mt-0.5">{wh.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={wh.status} />
                  <button className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={14} /></button>
                  <button className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex flex-wrap gap-1.5">
                  {wh.events.map((e) => (
                    <span key={e} className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}>{e}</span>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-4 text-xs text-gray-400">
                  <span>成功率 <strong className="text-gray-700">{wh.successRate}%</strong></span>
                  <span>最近触发 {wh.lastTriggered}</span>
                  <button className="text-blue-600 hover:underline flex items-center gap-1">
                    <RefreshCw size={11} />测试
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 事件类型说明 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-3">支持的事件类型</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { category: '内容事件', events: ['内容.创建', '内容.更新', '内容.审核通过', '内容.发布', '内容.删除'] },
            { category: '用户事件', events: ['用户.登录', '用户.注册', '用户.下载', '用户.搜索'] },
            { category: '系统事件', events: ['系统.告警', 'API.限流', '存储.预警'] },
          ].map((group) => (
            <div key={group.category} className="p-3 rounded-lg bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 mb-2">{group.category}</p>
              <div className="space-y-1.5">
                {group.events.map((e) => (
                  <div key={e} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <div className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                    <span className="font-mono">{e}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── 第三方集成 ─────────── */
function IntegrationManagement() {
  const connected = INTEGRATIONS.filter((i) => i.status === '已连接');
  const notConnected = INTEGRATIONS.filter((i) => i.status === '未连接');

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-1">已启用集成 ({connected.length})</h3>
        <p className="text-xs text-gray-400 mb-4">以下第三方系统已连接至产品实践库</p>
        <div className="space-y-3">
          {connected.map((intg) => (
            <div key={intg.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: intg.logoBg, color: intg.logoColor }}>{intg.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-800">{intg.name}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>{intg.category}</span>
                </div>
                <p className="text-xs text-gray-500">{intg.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">连接于 {intg.connectedAt}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge label={intg.status} />
                <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
                  <Settings size={12} />配置
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">断开</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-1">可用集成 ({notConnected.length})</h3>
        <p className="text-xs text-gray-400 mb-4">连接更多第三方工具，扩展平台能力</p>
        <div className="grid grid-cols-3 gap-3">
          {notConnected.map((intg) => (
            <div key={intg.id} className="flex items-start gap-3 p-4 border border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: intg.logoBg, color: intg.logoColor }}>{intg.logo}</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{intg.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{intg.desc}</p>
                <button className="mt-2 text-xs font-medium flex items-center gap-1 transition-colors" style={{ color: '#2563EB' }}>
                  <Plus size={11} />立即连接
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── 嵌入与分享 ─────────── */
function EmbedManagement() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(EMBED_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-1">嵌入式 Widget</h3>
        <p className="text-sm text-gray-500 mb-4">将产品实践库以 Widget 形式嵌入到您的内部系统或网站中</p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: <Globe size={18} />, title: '网页嵌入', desc: '嵌入到公司内网或企业门户网站', color: '#2563EB', bg: '#DBEAFE' },
            { icon: <Database size={18} />, title: 'iFrame 嵌入', desc: '通过 iFrame 嵌入到现有系统', color: '#16A34A', bg: '#DCFCE7' },
            { icon: <Plug size={18} />, title: 'SDK 集成', desc: '使用 JavaScript SDK 深度集成', color: '#9333EA', bg: '#F3E8FF' },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: item.bg, color: item.color }}>{item.icon}</div>
              <p className="text-sm font-semibold text-gray-800 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-500" /></div>
              <span className="text-xs text-gray-400 font-mono">embed-code.html</span>
            </div>
            <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white hover:bg-white hover:bg-opacity-10 transition-colors">
              {copied ? <><CheckCircle size={12} className="text-green-400" />已复制</> : <><Copy size={12} />复制代码</>}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-300 text-xs p-4 overflow-x-auto font-mono leading-relaxed">{EMBED_CODE}</pre>
        </div>
      </div>

      {/* 访问权限控制 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">对外访问控制</h3>
        <div className="space-y-3">
          {[
            { label: '允许外部 API 访问', desc: '开放 REST API 供外部系统调用', value: true },
            { label: '允许嵌入到外部网站', desc: '允许通过 iFrame 嵌入到其他网站', value: true },
            { label: '公开场景库索引', desc: '搜索引擎可以索引已发布的场景', value: false },
            { label: '允许匿名读取', desc: '不登录也可以查看已发布内容', value: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <div className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors"
                  style={{ backgroundColor: item.value ? '#2563EB' : '#D1D5DB' }}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${item.value ? 'ml-auto' : ''}`} />
                </div>
                <span className={`text-xs font-medium ${item.value ? 'text-green-600' : 'text-gray-400'}`}>
                  {item.value ? '开启' : '关闭'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── 主组件 ─────────── */
const TABS: { id: OpenTab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'api',          label: 'API 管理',   icon: <Key size={16} />,      desc: 'API 密钥与调用统计' },
  { id: 'webhooks',     label: 'Webhook',    icon: <Zap size={16} />,      desc: '事件通知与推送配置' },
  { id: 'integrations', label: '第三方集成', icon: <Plug size={16} />,     desc: 'CRM、通讯、分析工具接入' },
  { id: 'embed',        label: '嵌入与分享', icon: <Globe size={16} />,    desc: 'Widget 嵌入与访问控制' },
];

export default function OpenManagePage() {
  const [activeTab, setActiveTab] = useState<OpenTab>('api');

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* 页头 */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">开放管理</h1>
            <p className="text-sm text-gray-500">管理 API 密钥、Webhook 推送、第三方集成与嵌入配置</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-white transition-colors">
            <ExternalLink size={14} />
            查看 API 文档
          </button>
        </div>

        {/* Tab 导航 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-start gap-3 p-4 rounded-xl border transition-all text-left"
              style={activeTab === tab.id
                ? { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }
                : { backgroundColor: '#fff', borderColor: '#E5E7EB' }
              }>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={activeTab === tab.id ? { backgroundColor: '#DBEAFE', color: '#2563EB' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                {tab.icon}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: activeTab === tab.id ? '#1D4ED8' : '#374151' }}>{tab.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* 内容区 */}
        {activeTab === 'api'          && <ApiManagement />}
        {activeTab === 'webhooks'     && <WebhookManagement />}
        {activeTab === 'integrations' && <IntegrationManagement />}
        {activeTab === 'embed'        && <EmbedManagement />}
      </div>
    </main>
  );
}
