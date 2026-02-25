import { useState } from 'react';
import {
  ArrowLeft, ChevronRight, Share2, Download, Bookmark,
  Calendar, Clock, Users, TrendingUp, CheckCircle,
  Layers, BookOpen, Building2, Tag, FileText, ChevronDown, ChevronUp,
} from 'lucide-react';
import { caseStudies } from '../data/mockData';
import { useStore } from '../store/contentStore';
import type { CaseStudy } from '../types';

interface Props {
  caseId: string;
  onBack: () => void;
  onSceneClick?: (id: string) => void;
  onSolutionClick?: (id: string) => void;
}

/* ── 每个案例的扩展静态内容 ── */
interface CaseExtra {
  client: string;
  clientSize: string;
  projectDuration: string;
  publishDate: string;
  readTime: string;
  authorName: string;
  authorRole: string;
  background: string;
  challenges: { title: string; desc: string }[];
  solution: { title: string; desc: string; icon: React.ReactNode }[];
  results: { value: string; label: string; desc: string; up?: boolean }[];
  timeline: { phase: string; duration: string; tasks: string[] }[];
  tags: string[];
  relatedSceneTitle: string;
  relatedSolutionTitle: string;
  testimonial?: { quote: string; author: string; role: string };
}

const CASE_EXTRA: Record<string, CaseExtra> = {
  '1': {
    client: '某股份制银行',
    clientSize: '资产规模 1.2 万亿',
    projectDuration: '8 个月',
    publishDate: '2024-03-15',
    readTime: '约 5 分钟',
    authorName: '王方案',
    authorRole: '金融解决方案专家',
    background:
      '该银行零售信贷规模持续扩大，但传统人工审批流程已无法满足业务增长需求。信用评估模型建立于2016年，准确率仅有63%，不良贷款率高达4.2%，远超行业均值。为此，银行决定引入AI技术对信贷风控体系进行全面升级。',
    challenges: [
      { title: '数据孤岛严重', desc: '客户数据分散于核心系统、CRM、外部征信等多个源头，无法有效整合用于模型训练。' },
      { title: '模型准确率低', desc: '现有评分卡模型基于传统统计方法，对新兴欺诈行为识别能力不足，误拒率达15%。' },
      { title: '审批效率瓶颈', desc: '人工审批平均耗时3-5个工作日，客户体验差，竞争对手已普遍实现"秒批"。' },
      { title: '风险预警滞后', desc: '贷后管理缺乏实时预警机制，逾期发现往往已错失最佳催收时机。' },
    ],
    solution: [
      { title: 'AI 信用评估引擎', desc: '基于XGBoost+深度学习融合模型，整合1000+特征变量，模型准确率提升至92%。', icon: <TrendingUp size={18} /> },
      { title: '实时风控决策平台', desc: '构建毫秒级决策引擎，支持申请反欺诈、实时授信、额度动态调整三大核心场景。', icon: <CheckCircle size={18} /> },
      { title: '数据中台建设', desc: '打通内外部15个数据源，建立统一客户画像标签体系，覆盖500+用户特征维度。', icon: <Layers size={18} /> },
      { title: '贷后监控系统', desc: '搭建客户健康度监控看板，识别高风险信号并自动触发预警，响应时效从72小时缩短至1小时。', icon: <BookOpen size={18} /> },
    ],
    results: [
      { value: '18%↓', label: '不良贷款率', desc: '从4.2%降至3.5%，节约拨备资金约2.3亿', up: false },
      { value: '3x', label: '审批效率提升', desc: '平均审批时长从3天缩短至2小时', up: true },
      { value: '30%↑', label: '客户满意度', desc: 'NPS评分从42提升至61，位列同业前三', up: true },
      { value: '92%', label: '模型准确率', desc: '较改造前提升29个百分点', up: true },
    ],
    timeline: [
      { phase: '阶段一：需求调研与数据治理', duration: '第1-2月', tasks: ['业务痛点梳理', '数据质量评估', '数据源接入与清洗'] },
      { phase: '阶段二：模型开发与验证', duration: '第3-5月', tasks: ['特征工程', 'AI模型训练', '冠军模型评估与AB测试'] },
      { phase: '阶段三：系统集成与上线', duration: '第6-7月', tasks: ['决策引擎集成', '生产环境部署', '灰度发布'] },
      { phase: '阶段四：优化与推广', duration: '第8月', tasks: ['模型持续迭代', '用户培训', '效果复盘'] },
    ],
    tags: ['金融科技', '信用风控', 'AI决策', '银行数字化'],
    relatedSceneTitle: '客户信用评估',
    relatedSolutionTitle: '智能风控解决方案v2.3',
    testimonial: {
      quote: '项目上线后，信贷审批效率大幅提升，客户体验显著改善。AI风控系统的准确性超出预期，为我们赢得了市场竞争优势。',
      author: '张行长',
      role: '某股份制银行零售金融部总经理',
    },
  },
  '2': {
    client: '某头部连锁超市',
    clientSize: '全国门店 800+ 家',
    projectDuration: '6 个月',
    publishDate: '2024-02-20',
    readTime: '约 4 分钟',
    authorName: '陈顾问',
    authorRole: '零售供应链专家',
    background:
      '该连锁超市在全国拥有800余家门店，但库存管理高度依赖人工经验，各门店库存水平差异极大。旺季频繁缺货，淡季又大量积压，年均库存损耗率达8%，供应链响应速度也严重影响新品上市效率。',
    challenges: [
      { title: '补货依赖人工判断', desc: '各门店采购员凭经验下单，缺货与积压并存，补货准确率不足60%。' },
      { title: '供应链可视性差', desc: '无法实时掌握各仓库与供应商库存状态，导致调拨决策滞后。' },
      { title: '需求预测不准确', desc: '未引入外部数据（天气、节假日、促销），预测准确率低于55%。' },
      { title: '损耗成本高', desc: '生鲜类商品因积压导致的损耗年损失约1.5亿元。' },
    ],
    solution: [
      { title: '智能需求预测', desc: '融合历史销售、天气、节假日、促销等多维度数据，预测准确率提升至85%。', icon: <TrendingUp size={18} /> },
      { title: '自动补货决策', desc: '建立全国统一补货中台，支持自动生成补货计划，采购员仅需审核确认。', icon: <CheckCircle size={18} /> },
      { title: '供应链可视化平台', desc: '实时展示全链路库存状态，支持一键调拨，异常库存自动预警。', icon: <Layers size={18} /> },
      { title: '智能调拨系统', desc: '基于历史销速与区域差异，自动推荐门店间调拨方案，平衡区域库存水位。', icon: <BookOpen size={18} /> },
    ],
    results: [
      { value: '35%↑', label: '库存周转率', desc: '周转天数从28天缩短至18天', up: true },
      { value: '60%↓', label: '缺货率', desc: '重点商品缺货率从12%降至4.8%', up: false },
      { value: '800+', label: '覆盖门店', desc: '全国所有门店完成系统接入', up: true },
      { value: '1.2亿', label: '年节约损耗', desc: '生鲜损耗成本显著降低', up: true },
    ],
    timeline: [
      { phase: '阶段一：数据基础建设', duration: '第1-2月', tasks: ['POS系统数据接入', '供应商数据集成', '历史数据清洗'] },
      { phase: '阶段二：预测模型开发', duration: '第2-4月', tasks: ['需求预测模型训练', '补货算法开发', '仿真验证'] },
      { phase: '阶段三：平台开发与测试', duration: '第4-5月', tasks: ['可视化平台开发', '试点门店上线', '效果验证'] },
      { phase: '阶段四：全国推广', duration: '第6月', tasks: ['全量门店上线', '人员培训', '运营优化'] },
    ],
    tags: ['供应链优化', '智能补货', '零售数字化', '库存管理'],
    relatedSceneTitle: '智能库存管理',
    relatedSolutionTitle: '智能库存管理解决方案',
    testimonial: {
      quote: '供应链可视化平台让我们第一次真正做到了全链路透明，库存问题从被动应对变成了主动预防。',
      author: '李总监',
      role: '某连锁超市供应链管理总监',
    },
  },
  '3': {
    client: '某三甲医院',
    clientSize: '日均门诊量 8,000+',
    projectDuration: '10 个月',
    publishDate: '2024-01-10',
    readTime: '约 4 分钟',
    authorName: '赵分析',
    authorRole: '医疗信息化专家',
    background:
      '该三甲医院是区域医疗中心，日均门诊量超8000人次。但患者数据分散于HIS、PACS、LIS等多个独立系统，医生在诊断时需频繁切换系统查阅，信息孤岛严重影响诊疗效率和患者体验。',
    challenges: [
      { title: '患者数据碎片化', desc: '电子病历、影像、检验数据分散于5个独立系统，无统一患者视图。' },
      { title: '诊断效率低下', desc: '医生平均花费约35%的时间在系统间切换查找数据，影响门诊效率。' },
      { title: '随访管理薄弱', desc: '慢病患者随访缺乏智能提醒，随访完成率不足40%。' },
      { title: '数据价值未释放', desc: '海量医疗数据未能有效用于科研和临床决策支持。' },
    ],
    solution: [
      { title: '患者数据中台', desc: '整合HIS/PACS/LIS等5大系统数据，建立统一患者360°视图，覆盖100万+患者档案。', icon: <Layers size={18} /> },
      { title: '智能诊断辅助', desc: '基于历史病历训练AI诊断辅助模型，自动推荐检查项目和用药建议，辅助诊断准确率92%。', icon: <CheckCircle size={18} /> },
      { title: '慢病管理平台', desc: '为慢性病患者建立个性化随访计划，自动发送提醒，随访完成率提升至78%。', icon: <Users size={18} /> },
      { title: '医院数据大屏', desc: '实时展示医院运营状态、床位使用率、设备状态等关键指标，支持管理决策。', icon: <BookOpen size={18} /> },
    ],
    results: [
      { value: '50%↑', label: '诊断效率', desc: '医生查阅患者信息时间减少50%', up: true },
      { value: '40%↓', label: '患者等待', desc: '平均门诊等待时间从45分钟降至27分钟', up: false },
      { value: '100万+', label: '患者档案', desc: '全院患者数据完成整合', up: true },
      { value: '78%', label: '随访完成率', desc: '较改造前提升近一倍', up: true },
    ],
    timeline: [
      { phase: '阶段一：系统调研与规划', duration: '第1-2月', tasks: ['现状调研', '数据标准制定', '架构设计'] },
      { phase: '阶段二：数据中台建设', duration: '第3-6月', tasks: ['数据源接入', '患者主索引建立', '数据质量治理'] },
      { phase: '阶段三：应用开发', duration: '第7-9月', tasks: ['医生工作站改造', 'AI辅助诊断模块', '患者随访平台'] },
      { phase: '阶段四：上线推广', duration: '第10月', tasks: ['全院上线', '医护培训', '效果评估'] },
    ],
    tags: ['医疗信息化', '患者管理', '数据中台', '智慧医院'],
    relatedSceneTitle: '患者数据管理',
    relatedSolutionTitle: '患者数据整合解决方案',
    testimonial: {
      quote: '数据中台的建立真正打通了院内信息壁垒，医生现在只需要在一个界面就能全面了解患者情况，极大提升了诊疗质量。',
      author: '李院长',
      role: '某三甲医院信息化主任',
    },
  },
};

function getExtra(id: string): CaseExtra {
  return CASE_EXTRA[id] ?? CASE_EXTRA['1'];
}

/* ── Tab 定义 ── */
type TabId = 'background' | 'solution' | 'results' | 'timeline';
const TABS: { id: TabId; label: string }[] = [
  { id: 'background', label: '项目背景' },
  { id: 'solution',   label: '解决方案' },
  { id: 'results',    label: '实施成果' },
  { id: 'timeline',   label: '项目历程' },
];

export default function CaseDetailPage({ caseId, onBack, onSceneClick, onSolutionClick }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('background');
  const [saved, setSaved] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([0]));

  const { cases: storedCases } = useStore();
  const allCases: CaseStudy[] = [...storedCases, ...caseStudies];
  const c = allCases.find(x => x.id === caseId);

  if (!c) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
        <FileText size={40} className="text-gray-200" />
        <p>未找到案例数据</p>
        <button onClick={onBack} className="text-blue-500 text-sm hover:underline">返回列表</button>
      </div>
    );
  }

  const extra = getExtra(caseId);

  function togglePhase(i: number) {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* ── 封面区 ── */}
      <div className="relative h-56 overflow-hidden" style={{ backgroundColor: c.coverColor }}>
        {/* 装饰圆 */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-8 left-1/2 w-32 h-32 rounded-full bg-white/5" />
        {/* 面包屑 */}
        <div className="relative max-w-[1200px] mx-auto px-6 pt-5">
          <div className="flex items-center gap-1.5 text-sm text-white/70 mb-4">
            <button onClick={onBack} className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> 返回
            </button>
            <ChevronRight size={13} />
            <span className="hover:text-white cursor-pointer" onClick={onBack}>案例库</span>
            <ChevronRight size={13} />
            <span className="text-white/90 truncate max-w-xs">{c.title}</span>
          </div>
          {/* 行业 */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm mb-3">
            {c.industry}
          </span>
          {/* 标题 */}
          <h1 className="text-2xl font-bold text-white leading-tight max-w-2xl">{c.title}</h1>
        </div>
        {/* 操作按钮 */}
        <div className="absolute top-5 right-6 flex items-center gap-2">
          <button onClick={() => setSaved(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm">
            <Bookmark size={14} className={saved ? 'fill-white' : ''} />
            {saved ? '已收藏' : '收藏'}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm">
            <Share2 size={14} /> 分享
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-gray-800 hover:bg-gray-100 transition-colors">
            <Download size={14} /> 下载报告
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 -mt-6 pb-12">
        <div className="flex gap-6 items-start">

          {/* ── 主内容区 ── */}
          <div className="flex-1 min-w-0">
            {/* 简介卡 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
              <p className="text-gray-600 leading-relaxed text-sm mb-4">{c.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1"><Building2 size={13} />{extra.client} · {extra.clientSize}</span>
                <span className="flex items-center gap-1"><Clock size={13} />项目周期：{extra.projectDuration}</span>
                <span className="flex items-center gap-1"><Calendar size={13} />发布：{extra.publishDate}</span>
                <span className="flex items-center gap-1"><FileText size={13} />{extra.readTime}</span>
              </div>
            </div>

            {/* 关键成果数字横幅 */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {extra.results.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                  <div className="text-2xl font-extrabold mb-1" style={{ color: c.industryColor }}>{r.value}</div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">{r.label}</div>
                  <div className="text-[11px] text-gray-400 leading-snug">{r.desc}</div>
                </div>
              ))}
            </div>

            {/* Tab 导航 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                      activeTab === t.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* 项目背景 */}
                {activeTab === 'background' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 mb-3">背景介绍</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{extra.background}</p>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 mb-3">核心挑战</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {extra.challenges.map((ch, i) => (
                          <div key={i} className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800 mb-1">{ch.title}</p>
                              <p className="text-xs text-gray-500 leading-relaxed">{ch.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* 客户证言 */}
                    {extra.testimonial && (
                      <div className="p-5 rounded-xl border-l-4 bg-blue-50" style={{ borderLeftColor: c.industryColor }}>
                        <p className="text-sm text-gray-700 italic leading-relaxed mb-3">「{extra.testimonial.quote}」</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: c.industryColor }}>
                            {extra.testimonial.author[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{extra.testimonial.author}</p>
                            <p className="text-xs text-gray-400">{extra.testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 解决方案 */}
                {activeTab === 'solution' && (
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">实施方案</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {extra.solution.map((s, i) => (
                        <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: c.industryBg, color: c.industryColor }}>
                              {s.icon}
                            </div>
                            <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 实施成果 */}
                {activeTab === 'results' && (
                  <div className="space-y-5">
                    <h3 className="text-base font-semibold text-gray-800">成果数据</h3>
                    <div className="space-y-3">
                      {extra.results.map((r, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-16 text-center">
                            <span className="text-xl font-extrabold" style={{ color: c.industryColor }}>{r.value}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">{r.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0 ${r.up !== false ? 'bg-green-500' : 'bg-blue-500'}`}>
                            <TrendingUp size={12} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* 客户标签 */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">案例标签</h4>
                      <div className="flex flex-wrap gap-2">
                        {extra.tags.map(t => (
                          <span key={t} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600 bg-white">
                            <Tag size={11} /> {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 项目历程 */}
                {activeTab === 'timeline' && (
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-gray-800 mb-4">实施阶段</h3>
                    {extra.timeline.map((phase, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => togglePhase(i)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: c.industryColor }}>
                              {i + 1}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{phase.phase}</p>
                              <p className="text-xs text-gray-400">{phase.duration}</p>
                            </div>
                          </div>
                          {expandedPhases.has(i) ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                        </button>
                        {expandedPhases.has(i) && (
                          <div className="px-4 py-3 bg-white">
                            <div className="flex flex-wrap gap-2">
                              {phase.tasks.map((task, j) => (
                                <span key={j} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-600">
                                  <CheckCircle size={11} className="text-green-500" /> {task}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── 侧边栏 ── */}
          <div className="w-64 flex-shrink-0 space-y-4">
            {/* 客户信息 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">客户信息</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
                  style={{ backgroundColor: c.coverColor }}>
                  🏢
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{extra.client}</p>
                  <p className="text-xs text-gray-400">{extra.clientSize}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span className="text-gray-400">所在行业</span>
                  <span className="font-medium" style={{ color: c.industryColor }}>{c.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">项目周期</span>
                  <span>{extra.projectDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">发布时间</span>
                  <span>{extra.publishDate}</span>
                </div>
              </div>
            </div>

            {/* 作者 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">撰写人</h4>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center"
                  style={{ backgroundColor: c.industryColor }}>
                  {extra.authorName[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{extra.authorName}</p>
                  <p className="text-xs text-gray-400">{extra.authorRole}</p>
                </div>
              </div>
            </div>

            {/* 关联场景 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                <Layers size={14} className="text-blue-500" /> 关联场景
              </h4>
              <button
                onClick={() => onSceneClick?.('1')}
                className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Layers size={13} className="text-blue-500" />
                </div>
                <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors leading-tight">{extra.relatedSceneTitle}</span>
                <ChevronRight size={12} className="text-gray-300 ml-auto flex-shrink-0" />
              </button>
            </div>

            {/* 关联解决方案 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                <BookOpen size={14} className="text-purple-500" /> 关联解决方案
              </h4>
              <button
                onClick={() => onSolutionClick?.('1')}
                className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={13} className="text-purple-500" />
                </div>
                <span className="text-xs text-gray-700 group-hover:text-purple-600 transition-colors leading-tight">{extra.relatedSolutionTitle}</span>
                <ChevronRight size={12} className="text-gray-300 ml-auto flex-shrink-0" />
              </button>
            </div>

            {/* 其他案例 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">更多案例</h4>
              <div className="space-y-2">
                {caseStudies.filter(x => x.id !== caseId).map(x => (
                  <button key={x.id}
                    onClick={() => window.dispatchEvent(new CustomEvent('caseClick', { detail: x.id }))}
                    className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ backgroundColor: x.coverColor }} />
                    <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors leading-tight line-clamp-2">{x.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
