import {
  ArrowLeft, Edit2, Download, Share2, ChevronRight,
  CheckCircle, TrendingUp, Plus, MoreHorizontal,
  FileText, Users, Lightbulb, Link2, BarChart2,
  Calendar, Tag,
} from 'lucide-react';
import { scenes, solutions, caseStudies } from '../data/mockData';
import { useStore } from '../store/contentStore';

interface Props {
  sceneId: string;
  onBack: () => void;
}

/* ────────── 各场景的扩展静态数据 ────────── */
interface RoleItem {
  name: string;
  dept: string;
  avatarBg: string;
  avatarColor: string;
  desc: string;
  duties: string[];
}
interface ValueItem {
  title: string;
  desc: string;
  metric: string;
  metricLabel: string;
}
interface SolutionRow {
  name: string;
  tags: { label: string; color: string; bg: string }[];
  value: string;
  updatedAt: string;
}
interface CaseCard {
  title: string;
  industry: string;
  industryColor: string;
  desc: string;
  coverBg: string;
  metrics: { value: string; label: string }[];
}
interface DocItem {
  name: string;
  size: string;
  type: 'PDF' | 'Word' | 'Excel';
  uploadedAt: string;
}

const SCENE_EXTRA: Record<string, {
  roles: RoleItem[];
  values: ValueItem[];
  solutionRows: SolutionRow[];
  caseCards: CaseCard[];
  docs: DocItem[];
}> = {
  default: {
    roles: [
      {
        name: '信贷经理',
        dept: '信贷部',
        avatarBg: '#DBEAFE',
        avatarColor: '#2563EB',
        desc: '负责客户信用评估与审批，是信用评估流程的主要执行者和决策者。',
        duties: ['客户资料审核与信用评估', '信贷额度确定与风险控制', '客户信用等级评定'],
      },
      {
        name: '风险分析师',
        dept: '风控部',
        avatarBg: '#F3E8FF',
        avatarColor: '#9333EA',
        desc: '负责风险模型搭建与优化，提供数据支持和风险评估方法。',
        duties: ['信用风险模型开发与优化', '风险指标监控与分析', '风险报告编制与解读'],
      },
      {
        name: '客户',
        dept: '外部',
        avatarBg: '#DCFCE7',
        avatarColor: '#16A34A',
        desc: '申请信贷产品的企业或个人，是信用评估的对象。',
        duties: [],
      },
    ],
    values: [
      { title: '实现信用评估自动化', desc: '将审批时间从3天缩短至4小时，大幅提升审批效率', metric: '86.7%', metricLabel: '效率提升' },
      { title: '降低信用风险', desc: '通过多维度数据评估，降低坏账率15%，提高信贷资产质量', metric: '15%', metricLabel: '坏账率降低' },
      { title: '建立标准化评估流程', desc: '减少人为因素影响，提高评估结果的一致性和公正性', metric: '95%', metricLabel: '评估一致性' },
      { title: '整合多维度数据', desc: '提供更全面的客户信用画像，提升评估准确性', metric: '12+', metricLabel: '数据维度' },
    ],
    solutionRows: [
      { name: '智能风控解决方案v2.3', tags: [{ label: '风控引擎', color: '#1D4ED8', bg: '#DBEAFE' }, { label: '数据集成平台', color: '#1D4ED8', bg: '#DBEAFE' }], value: '提升审批效率30%，降低坏账率15%', updatedAt: '2023-11-15' },
      { name: '客户信用画像解决方案', tags: [{ label: '数据集成平台', color: '#1D4ED8', bg: '#DBEAFE' }, { label: 'AI分析引擎', color: '#6D28D9', bg: '#EDE9FE' }], value: '构建360°客户视图，提升评估准确性', updatedAt: '2023-11-08' },
      { name: '反欺诈检测系统实施方案', tags: [{ label: '风控引擎', color: '#1D4ED8', bg: '#DBEAFE' }, { label: 'AI分析引擎', color: '#6D28D9', bg: '#EDE9FE' }], value: '欺诈识别率提升40%，减少损失25%', updatedAt: '2023-10-25' },
    ],
    caseCards: [
      {
        title: '某国有银行智能风控系统实施',
        industry: '金融', industryColor: '#2563EB',
        desc: '通过实施智能风控解决方案，降低坏账率15%，提升审批效率40%',
        coverBg: 'linear-gradient(135deg,#1a3a5c 0%,#234e7a 60%,#1e5f74 100%)',
        metrics: [{ value: '15%', label: '坏账率降低' }, { value: '40%', label: '效率提升' }],
      },
      {
        title: '某城商行信用评估体系优化',
        industry: '金融', industryColor: '#2563EB',
        desc: '构建标准化信用评估模型，实现自动化审批，年处理贷款申请量提升2倍',
        coverBg: 'linear-gradient(135deg,#1c4532 0%,#276749 60%,#2f855a 100%)',
        metrics: [{ value: '2x', label: '处理量提升' }, { value: '98%', label: '准确率' }],
      },
    ],
    docs: [
      { name: '客户信用评估模型白皮书.pdf', size: '2.4 MB', type: 'PDF', uploadedAt: '2023-10-15' },
      { name: '信用评估流程规范.docx', size: '1.1 MB', type: 'Word', uploadedAt: '2023-10-10' },
      { name: '信用评估指标体系.xlsx', size: '850 KB', type: 'Excel', uploadedAt: '2023-09-28' },
    ],
  },
};

function getExtra(sceneId: string) {
  return SCENE_EXTRA[sceneId] ?? SCENE_EXTRA['default'];
}

const STATUS_CFG: Record<string, { bg: string; color: string }> = {
  已完善: { bg: '#DCFCE7', color: '#15803D' },
  进行中: { bg: '#DBEAFE', color: '#1D4ED8' },
  待完善: { bg: '#FEF9C3', color: '#A16207' },
};

const DOC_CFG: Record<string, { bg: string; color: string; abbr: string }> = {
  PDF:   { bg: '#FEE2E2', color: '#DC2626', abbr: 'PDF' },
  Word:  { bg: '#DBEAFE', color: '#1D4ED8', abbr: 'DOC' },
  Excel: { bg: '#DCFCE7', color: '#16A34A', abbr: 'XLS' },
};

/* ────────── 组件 ────────── */
export default function SceneDetailPage({ sceneId, onBack }: Props) {
  const { scenes: storedScenes } = useStore();
  const allScenes = [...storedScenes, ...scenes];
  const scene = allScenes.find((s) => s.id === sceneId);
  if (!scene) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
        <FileText size={40} className="text-gray-200" />
        <p>未找到场景数据</p>
        <button onClick={onBack} className="text-blue-500 text-sm hover:underline">返回列表</button>
      </div>
    );
  }

  const extra = getExtra(sceneId);
  const statusCfg = STATUS_CFG[scene.status] ?? STATUS_CFG['已完善'];
  const relatedSols = solutions.filter((s) => s.relatedScene === scene.title);
  const relatedCases = caseStudies.filter((c) => c.industry === scene.industry);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-6">

        {/* ── 面包屑 ── */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400">
          <button onClick={onBack} className="hover:text-blue-600 transition-colors">首页</button>
          <ChevronRight size={13} />
          <button onClick={onBack} className="hover:text-blue-600 transition-colors">场景库</button>
          <ChevronRight size={13} />
          <span className="text-gray-700 font-medium">{scene.title}</span>
        </nav>

        {/* ── 头部卡片 ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <button onClick={onBack} className="mt-1 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0">
                <ArrowLeft size={16} className="text-gray-600" />
              </button>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: scene.iconBg }}
              >
                {scene.industry === '金融' ? '💰' : scene.industry === '零售' ? '🛍️' : scene.industry === '医疗' ? '🏥' : scene.industry === '制造' ? '🏭' : scene.industry === '教育' ? '📚' : '📋'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{scene.title}</h1>
                  <span className="text-sm text-gray-400">{scene.code}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={statusCfg}>{scene.status}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: scene.iconBg, color: scene.iconColor }}>{scene.industry}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{scene.description}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <Tag size={12} />
                  {scene.tags.map((t) => <span key={t} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">{t}</span>)}
                  <span className="flex items-center gap-1"><Calendar size={11} />{scene.createdAt}</span>
                  {scene.product && <span className="flex items-center gap-1"><Link2 size={11} />{scene.product}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"><Share2 size={14} />分享</button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"><Download size={14} />导出</button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#2563EB' }}><Edit2 size={14} />编辑场景</button>
            </div>
          </div>

          {/* 统计数字 */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 text-center">
            {[
              { val: '95%+', label: '评分准确率', extra: '+12%' },
              { val: '3s',   label: '平均审批时长', extra: '-97%' },
              { val: '18%↓', label: '不良贷款率', extra: '' },
              { val: `${scene.solutionCount + scene.caseCount}`, label: '关联资源', extra: '' },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-2xl font-bold text-gray-900">{m.val}</span>
                  {m.extra && <span className="text-xs font-medium bg-green-50 text-green-600 px-1.5 py-0.5 rounded">{m.extra}</span>}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 相关角色 + 业务价值 ── */}
        <div className="grid grid-cols-5 gap-6">
          {/* 相关角色 */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              相关角色
            </h2>
            <div className="space-y-4">
              {extra.roles.map((role) => (
                <div key={role.name} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                      style={{ backgroundColor: role.avatarBg, color: role.avatarColor }}>
                      {role.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{role.name}</p>
                      <p className="text-xs text-gray-400">{role.dept}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 leading-relaxed pl-1">{role.desc}</p>
                  {role.duties.length > 0 && (
                    <ul className="space-y-1 pl-1">
                      {role.duties.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle size={12} className="text-blue-500 flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 业务价值 */}
          <div className="col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb size={16} className="text-yellow-500" />
              业务价值
            </h2>
            <div className="space-y-4">
              {extra.values.map((v) => (
                <div key={v.title} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#DCFCE7' }}>
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">{v.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <TrendingUp size={11} className="text-blue-500" />
                      <span className="text-xs font-medium" style={{ color: '#2563EB' }}>
                        {v.metricLabel}: {v.metric}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 关联解决方案 ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <BarChart2 size={16} className="text-orange-400" />
              关联解决方案
            </h2>
            <button className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#2563EB' }}>
              <Plus size={14} />
              添加关联
            </button>
          </div>
          {/* 表头 */}
          <div className="grid grid-cols-[2fr_2fr_3fr_1.5fr_1.5fr] gap-4 px-5 py-3 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
            <span>方案名称</span>
            <span>相关产品</span>
            <span>应用价值</span>
            <span>更新时间</span>
            <span>操作</span>
          </div>
          {/* 数据行 */}
          {(relatedSols.length > 0 ? relatedSols.map((s) => ({
            name: s.title,
            tags: [{ label: s.industry, color: s.industryColor, bg: s.industryBg }],
            value: s.description,
            updatedAt: s.updatedAt,
          })) : extra.solutionRows).map((row, i) => (
            <div key={i} className="grid grid-cols-[2fr_2fr_3fr_1.5fr_1.5fr] gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center">
              <span className="text-sm font-medium text-gray-800">{row.name}</span>
              <div className="flex flex-wrap gap-1">
                {row.tags.map((tag) => (
                  <span key={tag.label} className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: tag.bg, color: tag.color }}>{tag.label}</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">{row.value}</span>
              <span className="text-sm text-gray-400">{row.updatedAt}</span>
              <div className="flex items-center gap-3 text-sm">
                <button className="hover:text-blue-600 transition-colors" style={{ color: '#2563EB' }}>查看详情</button>
                <button className="text-gray-400 hover:text-red-500 transition-colors">解除关联</button>
              </div>
            </div>
          ))}
        </div>

        {/* ── 关联客户案例 ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              关联客户案例
            </h2>
            <button className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#2563EB' }}>
              <Plus size={14} />
              添加关联
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            {(relatedCases.length > 0 ? relatedCases.map((c) => ({
              title: c.title,
              industry: c.industry,
              industryColor: c.industryColor,
              desc: c.description,
              coverBg: `linear-gradient(135deg,${c.coverColor} 0%,${c.coverColor}cc 100%)`,
              metrics: c.metrics.slice(0, 2).map((m) => ({ value: m.value, label: m.label })),
            })) : extra.caseCards).map((card, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* 封面 */}
                <div className="h-36 relative flex items-end p-4" style={{ background: card.coverBg }}>
                  <div className="flex items-end justify-between w-full">
                    <h3 className="text-base font-semibold text-white leading-tight pr-2">{card.title}</h3>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-white bg-opacity-20 text-white flex-shrink-0">{card.industry}</span>
                  </div>
                </div>
                {/* 内容 */}
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{card.desc}</p>
                  <div className="flex items-center gap-4 mb-3">
                    {card.metrics.map((m) => (
                      <div key={m.label} className="flex items-center gap-1 text-sm">
                        <span className="font-bold text-gray-800">{m.value}</span>
                        <span className="text-gray-400">{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-4 pt-3 border-t border-gray-100 text-sm">
                    <button className="hover:text-blue-600 transition-colors" style={{ color: '#2563EB' }}>查看详情</button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">解除关联</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 相关文档 ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              相关文档
            </h2>
            <button className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#2563EB' }}>
              <Plus size={14} />
              上传文档
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {extra.docs.map((doc) => {
              const cfg = DOC_CFG[doc.type];
              return (
                <div key={doc.name} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  {/* 文件图标 */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    {cfg.abbr}
                  </div>
                  {/* 文件信息 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doc.size} | {doc.type} | 上传于 {doc.uploadedAt}
                    </p>
                  </div>
                  {/* 操作 */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="下载">
                      <Download size={15} />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="分享">
                      <Share2 size={15} />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="更多">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
