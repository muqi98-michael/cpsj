import { useState } from 'react';
import {
  ArrowLeft, ChevronRight, Download, Share2,
  Eye, Clock, Calendar, User, Tag, Layers,
  FileText, CheckCircle, BookOpen, BarChart2,
  MessageSquare, ThumbsUp, ChevronDown, ChevronUp,
  Package, Lightbulb, Users, TrendingUp,
} from 'lucide-react';
import { solutions, scenes, caseStudies } from '../data/mockData';
import { useStore } from '../store/contentStore';

interface Props {
  solutionId: string;
  onBack: () => void;
  onSceneClick?: (sceneId: string) => void;
}

/* ──── 各方案的扩展静态详情 ──── */
const SOLUTION_EXTRA: Record<string, {
  background: string;
  targetAudience: string[];
  highlights: { icon: React.ReactNode; title: string; desc: string; metric: string }[];
  chapters: { title: string; pages: number; desc: string }[];
  versions: { version: string; date: string; changes: string }[];
  comments: { author: string; avatar: string; avatarBg: string; content: string; date: string; likes: number }[];
}> = {
  '1': {
    background: '金融机构面临信贷风险识别准确率低、审批效率不足的双重挑战。本方案通过引入多维度AI评分模型与实时监控引擎，构建从申请、评估到放款全流程自动化风控体系。',
    targetAudience: ['银行信贷部门', '消费金融公司', '互联网金融平台', '保险风控团队'],
    highlights: [
      { icon: <TrendingUp size={16} />, title: '审批效率提升', desc: '自动化审批决策，秒级响应', metric: '30%↑' },
      { icon: <BarChart2 size={16} />, title: '坏账率降低', desc: '多维数据模型精准识别风险', metric: '15%↓' },
      { icon: <CheckCircle size={16} />, title: '评分准确率', desc: 'AI模型持续学习迭代优化', metric: '95%+' },
      { icon: <Clock size={16} />, title: '平均审批时长', desc: '从3天缩短至4小时', metric: '3s' },
    ],
    chapters: [
      { title: '第一章：行业背景与痛点分析', pages: 12, desc: '金融风控现状、挑战与市场机遇分析' },
      { title: '第二章：解决方案总体架构', pages: 18, desc: '系统架构、技术选型与数据流设计' },
      { title: '第三章：核心模块详解', pages: 32, desc: '评分模型、决策引擎、监控中心功能说明' },
      { title: '第四章：实施路径与里程碑', pages: 15, desc: '分阶段实施计划、资源投入与交付标准' },
      { title: '第五章：成功案例参考', pages: 10, desc: '3个已落地案例的数据指标与经验分享' },
      { title: '第六章：ROI 测算与商务方案', pages: 8, desc: '投入产出分析与定价参考' },
    ],
    versions: [
      { version: 'v2.3', date: '2023-11-15', changes: '新增联邦学习模块，优化反欺诈模型，更新监管合规章节' },
      { version: 'v2.2', date: '2023-08-20', changes: '增加实时流处理架构，性能提升40%' },
      { version: 'v2.1', date: '2023-05-10', changes: '重构决策引擎，支持多策略并行执行' },
      { version: 'v2.0', date: '2023-01-08', changes: '全面升级，引入AI评分模型替代传统规则引擎' },
    ],
    comments: [
      { author: '张顾问', avatar: '张', avatarBg: '#2563EB', content: '方案架构非常完整，特别是第三章的决策引擎部分，对我们的项目很有参考价值！', date: '2023-11-20', likes: 12 },
      { author: '陈顾问', avatar: '陈', avatarBg: '#16A34A', content: 'ROI 测算模型很实用，直接用在客户方案里了，客户反馈很好。', date: '2023-11-18', likes: 8 },
      { author: '李销售', avatar: '李', avatarBg: '#9333EA', content: '建议增加小型银行的轻量化部署方案，很多客户对成本比较敏感。', date: '2023-11-17', likes: 5 },
    ],
  },
};

function getExtra(id: string) {
  return SOLUTION_EXTRA[id] ?? SOLUTION_EXTRA['1'];
}

const FILE_TYPE_CFG: Record<string, { bg: string; color: string; label: string }> = {
  PPT:   { bg: '#FEE2E2', color: '#DC2626', label: 'PPT' },
  WORD:  { bg: '#DBEAFE', color: '#1D4ED8', label: 'WORD' },
  PDF:   { bg: '#FEF3C7', color: '#D97706', label: 'PDF' },
  EXCEL: { bg: '#DCFCE7', color: '#15803D', label: 'EXCEL' },
};

const STATUS_CFG: Record<string, { bg: string; color: string }> = {
  已发布: { bg: '#DCFCE7', color: '#15803D' },
  审核中: { bg: '#FEF9C3', color: '#A16207' },
  草稿:   { bg: '#F3F4F6', color: '#6B7280' },
};

/* ──── 章节展开组件 ──── */
function ChapterList({ chapters }: { chapters: { title: string; pages: number; desc: string }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {chapters.map((ch, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>{i + 1}</span>
              <span className="text-sm font-medium text-gray-800 text-left">{ch.title}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-gray-400">{ch.pages} 页</span>
              {openIdx === i ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </div>
          </button>
          {openIdx === i && (
            <div className="px-4 pb-3 pt-1 border-t border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-500">{ch.desc}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ──── 主组件 ──── */
export default function SolutionDetailPage({ solutionId, onBack, onSceneClick }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'cases' | 'versions' | 'comments'>('overview');
  const [liked, setLiked] = useState(false);
  const { solutions: storedSolutions, scenes: storedScenes } = useStore();

  const allSolutions = [...storedSolutions, ...solutions];
  const allScenes = [...storedScenes, ...scenes];

  const solution = allSolutions.find((s) => s.id === solutionId);
  if (!solution) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
        <FileText size={40} className="text-gray-200" />
        <p>未找到解决方案数据</p>
        <button onClick={onBack} className="text-blue-500 text-sm hover:underline">返回列表</button>
      </div>
    );
  }

  const extra = getExtra(solutionId);
  const fileCfg = FILE_TYPE_CFG[solution.fileType] ?? { bg: '#F3F4F6', color: '#6B7280', label: solution.fileType };
  const statusCfg = STATUS_CFG[solution.status ?? '已发布'];
  const relatedScene = allScenes.find((s) => s.title === solution.relatedScene);
  const relatedCases = caseStudies.filter((c) => c.industry === solution.industry);

  const TABS = [
    { id: 'overview' as const, label: '方案概述', icon: <BookOpen size={14} /> },
    { id: 'content'  as const, label: '方案内容', icon: <FileText size={14} /> },
    { id: 'cases'    as const, label: `关联案例 (${relatedCases.length})`, icon: <Layers size={14} /> },
    { id: 'versions' as const, label: '版本历史', icon: <Clock size={14} /> },
    { id: 'comments' as const, label: `评论 (${extra.comments.length})`, icon: <MessageSquare size={14} /> },
  ];

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">

        {/* ── 面包屑 ── */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400">
          <button onClick={onBack} className="hover:text-blue-600 transition-colors">首页</button>
          <ChevronRight size={13} />
          <button onClick={onBack} className="hover:text-blue-600 transition-colors">解决方案库</button>
          <ChevronRight size={13} />
          <span className="text-gray-700 font-medium truncate max-w-xs">{solution.title}</span>
        </nav>

        {/* ── 头部卡片 ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <button onClick={onBack} className="mt-1 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0">
              <ArrowLeft size={16} className="text-gray-600" />
            </button>

            {/* 文件类型图标 */}
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
              style={{ backgroundColor: fileCfg.bg, color: fileCfg.color }}>
              {fileCfg.label}
            </div>

            {/* 标题区 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{solution.title}</h1>
                {solution.version && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600">{solution.version}</span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={statusCfg}>{solution.status ?? '已发布'}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: solution.industryBg, color: solution.industryColor }}>{solution.industry}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{solution.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                {solution.author && (
                  <span className="flex items-center gap-1"><User size={11} />{solution.author} · {solution.authorDept}</span>
                )}
                <span className="flex items-center gap-1"><Calendar size={11} />更新于 {solution.updatedAt}</span>
                <span className="flex items-center gap-1"><Eye size={11} />{solution.views?.toLocaleString()} 次浏览</span>
                <span className="flex items-center gap-1"><Download size={11} />{solution.downloads?.toLocaleString()} 次下载</span>
                {solution.fileSize && <span className="flex items-center gap-1"><FileText size={11} />{solution.fileSize}</span>}
              </div>
              {solution.tags && (
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <Tag size={11} className="text-gray-400" />
                  {solution.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all"
                style={liked ? { borderColor: '#2563EB', color: '#2563EB', backgroundColor: '#EFF6FF' } : { borderColor: '#E5E7EB', color: '#6B7280' }}
              >
                <ThumbsUp size={14} />收藏
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Share2 size={14} />分享
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#2563EB' }}>
                <Download size={14} />下载文件
              </button>
            </div>
          </div>

          {/* 亮点指标 */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-gray-100">
            {extra.highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                  {h.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{h.title}</p>
                    <span className="text-xs font-bold" style={{ color: '#2563EB' }}>{h.metric}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 shadow-sm px-2 py-1.5 w-fit">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={activeTab === tab.id ? { backgroundColor: '#EFF6FF', color: '#2563EB' } : { color: '#6B7280' }}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab 内容 ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-5">
            {/* 左列（2/3） */}
            <div className="col-span-2 space-y-5">
              {/* 方案背景 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full" style={{ backgroundColor: '#2563EB' }} />
                  方案背景
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{extra.background}</p>
              </div>

              {/* 适用对象 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Users size={14} className="text-blue-500" />
                  适用客户群体
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {extra.targetAudience.map((t) => (
                    <div key={t} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                      <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 适用产品 */}
              {solution.applicableProducts && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Package size={14} className="text-purple-500" />
                    适用产品
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {solution.applicableProducts.map((p) => (
                      <span key={p} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}>
                        <Package size={12} />{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 右列（1/3） */}
            <div className="space-y-4">
              {/* 关联场景 */}
              {relatedScene && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Lightbulb size={14} className="text-yellow-500" />
                    关联场景
                  </h3>
                  <button
                    onClick={() => onSceneClick?.(relatedScene.id)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ backgroundColor: relatedScene.iconBg }}>
                      {relatedScene.industry === '金融' ? '💰' : relatedScene.industry === '零售' ? '🛍️' : '📋'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{relatedScene.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{relatedScene.description}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  </button>
                </div>
              )}

              {/* 基本信息 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">基本信息</h3>
                <div className="space-y-2.5">
                  {[
                    { label: '文件格式', value: solution.fileType },
                    { label: '文件大小', value: solution.fileSize ?? '—' },
                    { label: '当前版本', value: solution.version ?? '—' },
                    { label: '创建时间', value: solution.createdAt ?? '—' },
                    { label: '最后更新', value: solution.updatedAt },
                    { label: '作者', value: solution.author ?? '—' },
                    { label: '所属部门', value: solution.authorDept ?? '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className="text-xs font-medium text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 同行业方案 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">同行业方案</h3>
                <div className="space-y-2">
                  {solutions.filter((s) => s.industry === solution.industry && s.id !== solution.id).slice(0, 3).map((s) => (
                    <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: FILE_TYPE_CFG[s.fileType]?.bg ?? '#F3F4F6', color: FILE_TYPE_CFG[s.fileType]?.color ?? '#6B7280' }}>
                        {s.fileType}
                      </span>
                      <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors truncate">{s.title}</span>
                    </div>
                  ))}
                  {solutions.filter((s) => s.industry === solution.industry && s.id !== solution.id).length === 0 && (
                    <p className="text-xs text-gray-400">暂无同行业其他方案</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FileText size={15} className="text-blue-500" />
                方案目录
              </h3>
              <span className="text-xs text-gray-400">
                共 {extra.chapters.reduce((s, c) => s + c.pages, 0)} 页
              </span>
            </div>
            <ChapterList chapters={extra.chapters} />
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-center">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#2563EB' }}>
                <Download size={15} />下载完整文档 ({solution.fileSize})
              </button>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="grid grid-cols-2 gap-4">
            {relatedCases.length > 0 ? relatedCases.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-20 flex items-center px-5" style={{ backgroundColor: c.coverColor }}>
                  <h4 className="text-base font-semibold text-white">{c.title}</h4>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">{c.description}</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {c.metrics.map((m) => (
                      <div key={m.label} className="text-center p-2 rounded-lg bg-gray-50">
                        <p className="text-sm font-bold text-gray-800">{m.value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-2 border-t border-gray-50">
                    <button className="text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-1" style={{ color: '#2563EB' }}>
                      查看详情 <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
                暂无关联案例
              </div>
            )}
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">版本历史</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {extra.versions.map((v, i) => (
                <div key={v.version} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'text-white' : 'border border-gray-200 text-gray-400 bg-white'}`}
                      style={i === 0 ? { backgroundColor: '#2563EB' } : {}}>
                      {i === 0 ? '新' : v.version.replace('v', '')}
                    </div>
                    {i < extra.versions.length - 1 && <div className="w-0.5 h-8 bg-gray-100" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{v.version}</span>
                      {i === 0 && <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>当前版本</span>}
                      <span className="text-xs text-gray-400">{v.date}</span>
                    </div>
                    <p className="text-sm text-gray-500">{v.changes}</p>
                  </div>
                  {i > 0 && (
                    <button className="flex-shrink-0 text-xs text-blue-600 hover:underline px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                      下载此版本
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">发表评论</h3>
              <textarea
                placeholder="分享您对此方案的使用经验或建议..."
                className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all resize-none"
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#2563EB' }}>
                  提交评论
                </button>
              </div>
            </div>

            {extra.comments.map((comment, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: comment.avatarBg }}>
                    {comment.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-gray-800">{comment.author}</span>
                      <span className="text-xs text-gray-400">{comment.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors">
                        <ThumbsUp size={12} />{comment.likes} 赞
                      </button>
                      <button className="text-xs text-gray-400 hover:text-blue-600 transition-colors">回复</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
