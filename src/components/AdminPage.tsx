import { useState } from 'react';
import {
  LayoutDashboard, Users, BookOpen, ShieldCheck, Settings,
  ClipboardList, ChevronRight, TrendingUp, TrendingDown,
  Search, Plus, Edit2, Trash2, MoreHorizontal, Download,
  CheckCircle, XCircle, Filter, RefreshCw,
  Layers, FileText, Eye, UserCheck, UserX, Key,
  Bell, LogOut, BarChart2,
} from 'lucide-react';
import { useStore } from '../store/contentStore';
import NewContentModal from './NewContentModal';
import type { Scene, Solution, CaseStudy } from '../types';

/* ─────────── 类型 ─────────── */
type AdminTab = 'dashboard' | 'users' | 'content' | 'permissions' | 'settings' | 'logs';

/* ─────────── Mock 数据 ─────────── */
const STATS = [
  { label: '注册用户', value: 128, delta: '+12', up: true, icon: <Users size={20} />, color: '#2563EB', bg: '#DBEAFE' },
  { label: '场景总数', value: 86,  delta: '+6',  up: true, icon: <Layers size={20} />, color: '#16A34A', bg: '#DCFCE7' },
  { label: '解决方案', value: 245, delta: '+18', up: true, icon: <BookOpen size={20} />, color: '#9333EA', bg: '#F3E8FF' },
  { label: '客户案例', value: 312, delta: '+24', up: true, icon: <FileText size={20} />, color: '#D97706', bg: '#FEF3C7' },
];

const USERS = [
  { id: '1', name: '张顾问', email: 'zhang@company.com', role: '管理员', dept: '产品部', status: '正常', lastLogin: '2024-04-10 09:23', avatar: '张' },
  { id: '2', name: '李销售', email: 'li@company.com',   role: '内容使用者', dept: '销售部', status: '正常', lastLogin: '2024-04-09 16:45', avatar: '李' },
  { id: '3', name: '王方案', email: 'wang@company.com', role: '内容贡献者', dept: '售前部', status: '正常', lastLogin: '2024-04-09 11:12', avatar: '王' },
  { id: '4', name: '赵分析', email: 'zhao@company.com', role: '内容贡献者', dept: '产品部', status: '正常', lastLogin: '2024-04-08 14:30', avatar: '赵' },
  { id: '5', name: '刘实施', email: 'liu@company.com',  role: '内容使用者', dept: '实施部', status: '禁用', lastLogin: '2024-03-25 10:00', avatar: '刘' },
  { id: '6', name: '陈顾问', email: 'chen@company.com', role: '内容贡献者', dept: '售前部', status: '正常', lastLogin: '2024-04-10 08:55', avatar: '陈' },
];

const CONTENT_ITEMS = [
  { id: '1', type: '场景', title: '客户信用评估', industry: '金融', status: '已发布', author: '王方案', updatedAt: '2024-04-08' },
  { id: '2', type: '场景', title: '智能库存管理', industry: '零售', status: '待审核', author: '赵分析', updatedAt: '2024-04-09' },
  { id: '3', type: '解决方案', title: '智能风控解决方案v2.3', industry: '金融', status: '已发布', author: '王方案', updatedAt: '2024-04-07' },
  { id: '4', type: '解决方案', title: '客户信用画像解决方案', industry: '金融', status: '已发布', author: '陈顾问', updatedAt: '2024-04-05' },
  { id: '5', type: '案例', title: '某国有银行智能风控系统实施', industry: '金融', status: '待审核', author: '王方案', updatedAt: '2024-04-09' },
  { id: '6', type: '案例', title: '某城商行信用评估体系优化', industry: '金融', status: '已发布', author: '陈顾问', updatedAt: '2024-04-03' },
];

const ROLES = [
  { name: '管理员', desc: '拥有所有权限，可进行系统配置和用户管理', count: 2, perms: ['内容管理', '用户管理', '权限配置', '系统设置', '操作日志'] },
  { name: '内容贡献者', desc: '可创建、编辑和提交内容，内容需经审核后发布', count: 5, perms: ['创建内容', '编辑内容', '提交审核', '查看统计'] },
  { name: '内容使用者', desc: '只读权限，可查看和下载所有已发布内容', count: 8, perms: ['查看内容', '下载文档', '搜索资源', 'AI助手'] },
];

const LOGS = [
  { time: '2024-04-10 09:23:14', user: '张顾问', action: '登录系统', target: '—', ip: '192.168.1.10', status: '成功' },
  { time: '2024-04-10 09:25:32', user: '张顾问', action: '编辑场景', target: '客户信用评估', ip: '192.168.1.10', status: '成功' },
  { time: '2024-04-10 08:55:01', user: '陈顾问', action: '上传文档', target: '信用评估白皮书.pdf', ip: '192.168.1.22', status: '成功' },
  { time: '2024-04-09 17:10:44', user: '李销售', action: '下载文档', target: '智能风控方案.pptx', ip: '10.0.0.5', status: '成功' },
  { time: '2024-04-09 16:45:20', user: '李销售', action: '登录系统', target: '—', ip: '10.0.0.5', status: '成功' },
  { time: '2024-04-09 14:30:08', user: '赵分析', action: '提交审核', target: '智能库存管理', ip: '192.168.1.15', status: '成功' },
  { time: '2024-04-09 11:12:55', user: '王方案', action: '新增解决方案', target: '反欺诈检测系统方案', ip: '192.168.1.8', status: '成功' },
  { time: '2024-04-08 09:00:00', user: '未知用户', action: '登录系统', target: '—', ip: '203.0.113.5', status: '失败' },
];

/* ─────────── 子组件 ─────────── */
const ROLE_COLOR: Record<string, { bg: string; color: string }> = {
  管理员: { bg: '#FEF3C7', color: '#D97706' },
  内容贡献者: { bg: '#DBEAFE', color: '#1D4ED8' },
  内容使用者: { bg: '#DCFCE7', color: '#15803D' },
};

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  正常: { bg: '#DCFCE7', color: '#15803D' },
  禁用: { bg: '#FEE2E2', color: '#DC2626' },
  已发布: { bg: '#DCFCE7', color: '#15803D' },
  待审核: { bg: '#FEF9C3', color: '#A16207' },
  成功: { bg: '#DCFCE7', color: '#15803D' },
  失败: { bg: '#FEE2E2', color: '#DC2626' },
};

function Badge({ label }: { label: string }) {
  const cfg = STATUS_COLOR[label] ?? { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={cfg}>
      {label}
    </span>
  );
}

/* ─────────── 仪表盘 ─────────── */
function Dashboard() {
  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <span className={`flex items-center gap-0.5 text-sm font-medium ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                {s.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {s.delta}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 内容审核 + 最近活动 */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">待审核内容</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF9C3', color: '#A16207' }}>2 条待处理</span>
          </div>
          <div className="space-y-3">
            {CONTENT_ITEMS.filter((c) => c.status === '待审核').map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.type} · 提交人：{item.author}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1 rounded-lg text-xs font-medium text-white hover:opacity-90" style={{ backgroundColor: '#2563EB' }}>审核</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">最近操作日志</h3>
          <div className="space-y-2.5">
            {LOGS.slice(0, 5).map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${log.status === '成功' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{log.user}</span> {log.action}
                    {log.target !== '—' && <span className="text-gray-500">「{log.target}」</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 用户角色分布 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">用户角色分布</h3>
        <div className="grid grid-cols-3 gap-4">
          {ROLES.map((role) => {
            const cfg = ROLE_COLOR[role.name] ?? { bg: '#F3F4F6', color: '#6B7280' };
            return (
              <div key={role.name} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  {role.count}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{role.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{role.desc.slice(0, 20)}…</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────── 用户管理 ─────────── */
function UserManagement() {
  const [search, setSearch] = useState('');
  const filtered = USERS.filter((u) => !search || u.name.includes(search) || u.email.includes(search));

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">用户列表</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索用户名或邮箱..."
                className="pl-8 pr-4 h-9 w-56 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium text-white hover:opacity-90"
              style={{ backgroundColor: '#2563EB' }}>
              <Plus size={14} />新增用户
            </button>
          </div>
        </div>

        {/* 表头 */}
        <div className="grid grid-cols-[2fr_2.5fr_1.5fr_1.5fr_1fr_2fr_1.5fr] gap-3 px-5 py-3 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
          <span>用户</span><span>邮箱</span><span>角色</span><span>部门</span><span>状态</span><span>最后登录</span><span>操作</span>
        </div>

        {filtered.map((user) => {
          const roleCfg = ROLE_COLOR[user.role] ?? { bg: '#F3F4F6', color: '#6B7280' };
          const colors = ['#2563EB', '#16A34A', '#9333EA', '#D97706', '#DC2626', '#0891B2'];
          const avatarColor = colors[parseInt(user.id) % colors.length];
          return (
            <div key={user.id} className="grid grid-cols-[2fr_2.5fr_1.5fr_1.5fr_1fr_2fr_1.5fr] gap-3 px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                  style={{ backgroundColor: avatarColor }}>{user.avatar}</div>
                <span className="text-sm font-medium text-gray-800 truncate">{user.name}</span>
              </div>
              <span className="text-sm text-gray-500 truncate">{user.email}</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium w-fit" style={roleCfg}>{user.role}</span>
              <span className="text-sm text-gray-500">{user.dept}</span>
              <Badge label={user.status} />
              <span className="text-xs text-gray-400">{user.lastLogin}</span>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="编辑">
                  <Edit2 size={14} />
                </button>
                {user.status === '正常'
                  ? <button className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="禁用"><UserX size={14} /></button>
                  : <button className="p-1 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="启用"><UserCheck size={14} /></button>
                }
                <button className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="更多"><MoreHorizontal size={14} /></button>
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-sm text-gray-400">共 {filtered.length} 名用户</span>
          <div className="flex items-center gap-1">
            {[1, 2].map((p) => (
              <button key={p} className="w-8 h-8 rounded text-sm font-medium transition-colors"
                style={p === 1 ? { backgroundColor: '#2563EB', color: '#fff' } : { color: '#6B7280' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── 内容管理 ─────────── */
type ContentTypeFilter = '全部' | '场景' | '解决方案' | '案例';

interface ContentRow {
  id: string;
  type: '场景' | '解决方案' | '案例';
  title: string;
  industry: string;
  status: string;
  author: string;
  updatedAt: string;
  fromStore?: boolean;
}

function sceneToRow(s: Scene): ContentRow {
  return { id: s.id, type: '场景', title: s.title, industry: s.industry, status: s.status, author: '我', updatedAt: s.createdAt, fromStore: true };
}
function solutionToRow(s: Solution): ContentRow {
  return { id: s.id, type: '解决方案', title: s.title, industry: s.industry, status: s.status ?? '草稿', author: s.author ?? '我', updatedAt: s.updatedAt, fromStore: true };
}
function caseToRow(c: CaseStudy): ContentRow {
  return { id: c.id, type: '案例', title: c.title, industry: c.industry, status: '已发布', author: '我', updatedAt: new Date().toISOString().slice(0, 10), fromStore: true };
}

function ContentManagement() {
  const [activeType, setActiveType] = useState<ContentTypeFilter>('全部');
  const [showModal, setShowModal] = useState(false);
  const store = useStore();

  const storeRows: ContentRow[] = [
    ...store.scenes.map(sceneToRow),
    ...store.solutions.map(solutionToRow),
    ...store.cases.map(caseToRow),
  ];

  const allRows: ContentRow[] = [...storeRows, ...CONTENT_ITEMS.map(c => ({ ...c, type: c.type as '场景' | '解决方案' | '案例' }))];
  const filtered = activeType === '全部' ? allRows : allRows.filter(c => c.type === activeType);

  const handleSave = (type: '场景' | '解决方案' | '案例', data: Scene | Solution | CaseStudy) => {
    if (type === '场景') store.addScene(data as Scene);
    else if (type === '解决方案') store.addSolution(data as Solution);
    else store.addCase(data as CaseStudy);
  };

  const handleDelete = (row: ContentRow) => {
    if (!row.fromStore) return;
    if (!confirm(`确认删除「${row.title}」？`)) return;
    if (row.type === '场景') store.deleteScene(row.id);
    else if (row.type === '解决方案') store.deleteSolution(row.id);
    else store.deleteCase(row.id);
  };

  return (
    <>
      {showModal && <NewContentModal onClose={() => setShowModal(false)} onSave={handleSave} />}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(['全部', '场景', '解决方案', '案例'] as const).map((t) => (
              <button key={t} onClick={() => setActiveType(t)}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                style={activeType === t ? { backgroundColor: '#fff', color: '#111827', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#6B7280' }}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              <Download size={14} />导出
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: '#2563EB' }}>
              <Plus size={14} />新增内容
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1.5fr_3fr_1fr_1fr_1.5fr_1.5fr] gap-3 px-5 py-3 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
          <span>类型</span><span>行业</span><span>标题</span><span>状态</span><span>作者</span><span>更新时间</span><span>操作</span>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">暂无内容，点击「新增内容」添加</div>
        )}

        {filtered.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_1.5fr_3fr_1fr_1fr_1.5fr_1.5fr] gap-3 px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-xs font-medium w-fit"
                style={item.type === '场景' ? { backgroundColor: '#DBEAFE', color: '#1D4ED8' }
                  : item.type === '解决方案' ? { backgroundColor: '#F3E8FF', color: '#7C3AED' }
                  : { backgroundColor: '#FEF3C7', color: '#D97706' }}>
                {item.type}
              </span>
              {item.fromStore && <span className="text-xs text-green-500" title="本地新增">●</span>}
            </div>
            <span className="text-sm text-gray-500">{item.industry}</span>
            <span className="text-sm font-medium text-gray-800 truncate">{item.title}</span>
            <Badge label={item.status} />
            <span className="text-sm text-gray-500">{item.author}</span>
            <span className="text-sm text-gray-400">{item.updatedAt}</span>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="查看"><Eye size={14} /></button>
              <button className="p-1 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="通过"><CheckCircle size={14} /></button>
              {item.fromStore
                ? <button onClick={() => handleDelete(item)} className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="删除"><Trash2 size={14} /></button>
                : <button className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="拒绝"><XCircle size={14} /></button>
              }
            </div>
          </div>
        ))}

        <div className="px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">共 {filtered.length} 条内容
            {storeRows.length > 0 && <span className="ml-2 text-green-600">（含 {storeRows.length} 条本地新增）</span>}
          </span>
        </div>
      </div>
    </>
  );
}

/* ─────────── 权限管理 ─────────── */
function PermissionManagement() {
  return (
    <div className="grid grid-cols-3 gap-5">
      {ROLES.map((role) => {
        const cfg = ROLE_COLOR[role.name] ?? { bg: '#F3F4F6', color: '#6B7280' };
        return (
          <div key={role.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={cfg}>{role.name}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{role.desc}</p>
              </div>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={14} /></button>
            </div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Users size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{role.count} 名用户</span>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 mb-2">权限列表</p>
              {role.perms.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{p}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Key size={13} />编辑权限
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────── 系统设置 ─────────── */
function SystemSettings() {
  return (
    <div className="space-y-5">
      {[
        { title: '基础配置', items: [
          { label: '系统名称', value: '产品实践库', type: 'text' },
          { label: '系统版本', value: '企业版 v2.1.0', type: 'text' },
          { label: '最大文件上传大小', value: '50 MB', type: 'text' },
        ]},
        { title: '通知设置', items: [
          { label: '内容审核通知', value: '开启', type: 'toggle' },
          { label: '新用户注册通知', value: '开启', type: 'toggle' },
          { label: '系统异常告警', value: '开启', type: 'toggle' },
        ]},
        { title: '安全配置', items: [
          { label: '登录失败锁定次数', value: '5 次', type: 'text' },
          { label: 'Session 超时时长', value: '8 小时', type: 'text' },
          { label: '密码最低强度', value: '中等', type: 'text' },
        ]},
      ].map((section) => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">{section.title}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-4">
                <span className="text-sm text-gray-700">{item.label}</span>
                {item.type === 'toggle' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer"
                      style={{ backgroundColor: '#2563EB' }}>
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">{item.value}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-800">{item.value}</span>
                    <button className="text-xs text-blue-600 hover:underline">修改</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────── 操作日志 ─────────── */
function AuditLogs() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">操作日志</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"><Filter size={13} />筛选</button>
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"><Download size={13} />导出</button>
          <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"><RefreshCw size={14} /></button>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1.5fr_2fr_2.5fr_1.5fr_1fr] gap-3 px-5 py-3 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
        <span>操作时间</span><span>操作人</span><span>操作类型</span><span>操作对象</span><span>IP 地址</span><span>结果</span>
      </div>

      {LOGS.map((log, i) => (
        <div key={i} className="grid grid-cols-[2fr_1.5fr_2fr_2.5fr_1.5fr_1fr] gap-3 px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center">
          <span className="text-sm text-gray-500">{log.time}</span>
          <span className="text-sm font-medium text-gray-800">{log.user}</span>
          <span className="text-sm text-gray-700">{log.action}</span>
          <span className="text-sm text-gray-500 truncate">{log.target}</span>
          <span className="text-xs text-gray-400 font-mono">{log.ip}</span>
          <Badge label={log.status} />
        </div>
      ))}
    </div>
  );
}

/* ─────────── 主组件 ─────────── */
const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',   label: '概览',     icon: <LayoutDashboard size={16} /> },
  { id: 'users',       label: '用户管理', icon: <Users size={16} /> },
  { id: 'content',     label: '内容管理', icon: <BookOpen size={16} /> },
  { id: 'permissions', label: '权限管理', icon: <ShieldCheck size={16} /> },
  { id: 'settings',    label: '系统设置', icon: <Settings size={16} /> },
  { id: 'logs',        label: '操作日志', icon: <ClipboardList size={16} /> },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const titles: Record<AdminTab, string> = {
    dashboard:   '概览',
    users:       '用户管理',
    content:     '内容管理',
    permissions: '权限管理',
    settings:    '系统设置',
    logs:        '操作日志',
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* ── 左侧边栏 ── */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        {/* 管理员信息 */}
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#2563EB,#9333EA)' }}>
              张
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">张顾问</p>
              <p className="text-xs text-gray-400">超级管理员</p>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === tab.id
                  ? { backgroundColor: '#EFF6FF', color: '#2563EB' }
                  : { color: '#6B7280' }
              }
            >
              <span style={{ color: activeTab === tab.id ? '#2563EB' : '#9CA3AF' }}>{tab.icon}</span>
              {tab.label}
              {tab.id === 'content' && <span className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#FEF9C3', color: '#A16207' }}>2</span>}
            </button>
          ))}
        </nav>

        {/* 底部 */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell size={16} className="text-gray-400" />通知设置
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={16} />退出登录
          </button>
        </div>
      </aside>

      {/* ── 主内容区 ── */}
      <main className="flex-1 min-w-0 p-6">
        {/* 页头 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <span>后台管理</span>
              <ChevronRight size={13} />
              <span className="text-gray-700 font-medium">{titles[activeTab]}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{titles[activeTab]}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
              <Bell size={16} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              <BarChart2 size={14} />数据报告
            </button>
          </div>
        </div>

        {/* 子页面内容 */}
        {activeTab === 'dashboard'   && <Dashboard />}
        {activeTab === 'users'       && <UserManagement />}
        {activeTab === 'content'     && <ContentManagement />}
        {activeTab === 'permissions' && <PermissionManagement />}
        {activeTab === 'settings'    && <SystemSettings />}
        {activeTab === 'logs'        && <AuditLogs />}
      </main>
    </div>
  );
}
