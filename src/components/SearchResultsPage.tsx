import { useState, useMemo } from 'react';
import { Search, ArrowLeft, FileText, Layers, BookOpen, X, SlidersHorizontal } from 'lucide-react';
import { scenes, solutions, caseStudies } from '../data/mockData';
import { useStore } from '../store/contentStore';
import type { Scene, Solution, CaseStudy } from '../types';

type ResultType = '全部' | '场景' | '解决方案' | '案例';

interface SearchResult {
  id: string;
  type: '场景' | '解决方案' | '案例';
  title: string;
  description: string;
  industry: string;
  industryColor: string;
  industryBg: string;
  tags: string[];
  updatedAt: string;
  status?: string;
  extra?: string; // 额外摘要字段
  raw: Scene | Solution | CaseStudy;
}

interface Props {
  query: string;
  onBack: () => void;
  onSceneClick?: (id: string) => void;
  onSolutionClick?: (id: string) => void;
  onQueryChange?: (q: string) => void;
}

/* ── 高亮匹配文字 ── */
function Highlight({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase()
          ? <mark key={i} className="bg-yellow-100 text-yellow-800 rounded px-0.5">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  场景:   <Layers size={14} />,
  解决方案: <BookOpen size={14} />,
  案例:   <FileText size={14} />,
};
const TYPE_COLOR: Record<string, { bg: string; color: string }> = {
  场景:    { bg: '#DBEAFE', color: '#1D4ED8' },
  解决方案: { bg: '#F3E8FF', color: '#7C3AED' },
  案例:    { bg: '#FEF3C7', color: '#D97706' },
};

export default function SearchResultsPage({ query: initQuery, onBack, onSceneClick, onSolutionClick, onQueryChange }: Props) {
  const { scenes: storedScenes, solutions: storedSolutions, cases: storedCases } = useStore();
  const [localQuery, setLocalQuery] = useState(initQuery);
  const [activeType, setActiveType] = useState<ResultType>('全部');
  const [sortBy, setSortBy] = useState<'relevance' | 'time'>('relevance');

  const searchQuery = localQuery.trim();

  /* ── 构建全量索引 ── */
  const allScenes: Scene[] = [...storedScenes, ...scenes];
  const allSolutions: Solution[] = [...storedSolutions, ...solutions];
  const allCases: CaseStudy[] = [...storedCases, ...caseStudies];

  /* ── 搜索逻辑 ── */
  const results = useMemo<SearchResult[]>(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();

    const sceneResults: SearchResult[] = allScenes
      .filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.painPoint.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q) ||
        (s.tags ?? []).some(t => t.toLowerCase().includes(q)) ||
        (s.code ?? '').toLowerCase().includes(q) ||
        (s.product ?? '').toLowerCase().includes(q)
      )
      .map(s => ({
        id: s.id,
        type: '场景' as const,
        title: s.title,
        description: s.description,
        industry: s.industry,
        industryColor: s.industryColor,
        industryBg: s.iconBg,
        tags: s.tags ?? [],
        updatedAt: s.createdAt,
        status: s.status,
        extra: s.painPoint,
        raw: s,
      }));

    const solutionResults: SearchResult[] = allSolutions
      .filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q) ||
        (s.tags ?? []).some(t => t.toLowerCase().includes(q)) ||
        (s.relatedScene ?? '').toLowerCase().includes(q) ||
        (s.author ?? '').toLowerCase().includes(q)
      )
      .map(s => ({
        id: s.id,
        type: '解决方案' as const,
        title: s.title,
        description: s.description,
        industry: s.industry,
        industryColor: s.industryColor,
        industryBg: s.industryBg,
        tags: s.tags ?? [],
        updatedAt: s.updatedAt,
        status: s.status,
        extra: s.relatedScene ? `关联场景：${s.relatedScene}` : undefined,
        raw: s,
      }));

    const caseResults: SearchResult[] = allCases
      .filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q)
      )
      .map(c => ({
        id: c.id,
        type: '案例' as const,
        title: c.title,
        description: c.description,
        industry: c.industry,
        industryColor: c.industryColor,
        industryBg: c.industryBg,
        tags: [],
        updatedAt: '',
        raw: c,
      }));

    return [...sceneResults, ...solutionResults, ...caseResults];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, storedScenes.length, storedSolutions.length, storedCases.length]);

  const filtered = activeType === '全部' ? results : results.filter(r => r.type === activeType);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'time') return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '');
    return 0;
  });

  const countByType = (t: '场景' | '解决方案' | '案例') => results.filter(r => r.type === t).length;

  function handleItemClick(r: SearchResult) {
    if (r.type === '场景') onSceneClick?.(r.id);
    else if (r.type === '解决方案') onSolutionClick?.(r.id);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    onQueryChange?.(localQuery.trim());
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-[960px] mx-auto px-6 py-8">

        {/* ── 顶部搜索栏 ── */}
        <div className="mb-6">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft size={15} /> 返回
          </button>

          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
                placeholder="搜索场景、解决方案、案例…"
                className="w-full h-12 pl-11 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 shadow-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
              />
              {localQuery && (
                <button type="button" onClick={() => { setLocalQuery(''); onQueryChange?.(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X size={15} />
                </button>
              )}
            </div>
            <button type="submit"
              className="px-6 h-12 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              搜索
            </button>
          </form>
        </div>

        {/* ── 无关键词状态 ── */}
        {!searchQuery && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search size={48} className="text-gray-200 mb-4" />
            <p className="text-base">输入关键词开始搜索</p>
            <p className="text-sm mt-1">可搜索场景、解决方案、案例的标题、描述、标签等</p>
          </div>
        )}

        {/* ── 有结果 ── */}
        {searchQuery && (
          <>
            {/* 结果统计 + 过滤器 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  搜索 <span className="font-semibold text-gray-800">「{searchQuery}」</span> 找到{' '}
                  <span className="font-semibold text-blue-600">{results.length}</span> 条结果
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <SlidersHorizontal size={14} />
                <span>排序：</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'relevance' | 'time')}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400 bg-white"
                >
                  <option value="relevance">按相关性</option>
                  <option value="time">按时间</option>
                </select>
              </div>
            </div>

            {/* 类型 Tab */}
            <div className="flex gap-2 mb-5">
              {([
                { label: '全部', count: results.length },
                { label: '场景', count: countByType('场景') },
                { label: '解决方案', count: countByType('解决方案') },
                { label: '案例', count: countByType('案例') },
              ] as { label: ResultType; count: number }[]).map(({ label, count }) => (
                <button key={label} onClick={() => setActiveType(label)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeType === label
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                  }`}>
                  {label}
                  <span className={`ml-1.5 text-xs ${activeType === label ? 'text-blue-200' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* 无结果 */}
            {sorted.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
                <Search size={40} className="text-gray-200 mb-3" />
                <p className="text-gray-500 font-medium">未找到相关内容</p>
                <p className="text-sm text-gray-400 mt-1">尝试更换关键词，或切换内容类型</p>
              </div>
            )}

            {/* 结果列表 */}
            <div className="space-y-3">
              {sorted.map((r, idx) => {
                const typeCfg = TYPE_COLOR[r.type];
                const isClickable = r.type === '场景' || r.type === '解决方案';
                return (
                  <div
                    key={`${r.type}-${r.id}-${idx}`}
                    onClick={() => isClickable && handleItemClick(r)}
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all ${
                      isClickable ? 'cursor-pointer hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* 类型图标 */}
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}>
                        {TYPE_ICON[r.type]}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* 标题行 */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="px-1.5 py-0.5 rounded text-xs font-medium"
                            style={typeCfg}>{r.type}</span>
                          <h3 className={`text-base font-semibold text-gray-900 ${isClickable ? 'hover:text-blue-600' : ''} transition-colors`}>
                            <Highlight text={r.title} keyword={searchQuery} />
                          </h3>
                          {r.status && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              {r.status}
                            </span>
                          )}
                        </div>

                        {/* 描述 */}
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                          <Highlight text={r.description} keyword={searchQuery} />
                        </p>

                        {/* 痛点/关联场景摘要 */}
                        {r.extra && (
                          <p className="text-xs text-gray-400 line-clamp-1 mb-2 italic">
                            <Highlight text={r.extra} keyword={searchQuery} />
                          </p>
                        )}

                        {/* 底部元信息 */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: r.industryBg, color: r.industryColor }}>
                            {r.industry}
                          </span>
                          {r.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                              {t}
                            </span>
                          ))}
                          {r.updatedAt && (
                            <span className="text-xs text-gray-300 ml-auto">{r.updatedAt}</span>
                          )}
                          {isClickable && (
                            <span className="text-xs text-blue-500 ml-auto flex items-center gap-0.5 font-medium">
                              查看详情 →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
