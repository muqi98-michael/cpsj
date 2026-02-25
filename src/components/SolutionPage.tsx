import { useState } from 'react';
import { Search, Calendar, Link, Plus } from 'lucide-react';
import { solutions, industries } from '../data/mockData';
import type { IndustryFilter } from '../types';
import { useStore } from '../store/contentStore';

const fileTypeColors: Record<string, string> = {
  PPT: '#EF4444',
  WORD: '#2563EB',
  PDF: '#EA580C',
  EXCEL: '#16A34A',
};

interface SolutionPageProps {
  onSolutionClick?: (solutionId: string) => void;
  onAddSolution?: () => void;
}

export default function SolutionPage({ onSolutionClick, onAddSolution }: SolutionPageProps) {
  const { solutions: storedSolutions } = useStore();
  const [activeFilter, setActiveFilter] = useState<IndustryFilter>('全部行业');
  const [searchText, setSearchText] = useState('');

  const allSolutions = [...storedSolutions, ...solutions];

  const filtered = allSolutions.filter((s) => {
    const matchIndustry = activeFilter === '全部行业' || s.industry === activeFilter;
    const matchSearch = !searchText || s.title.includes(searchText) || s.description.includes(searchText);
    return matchIndustry && matchSearch;
  });

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">解决方案库</h1>
            <p className="text-gray-500 text-sm mt-1">探索各行业经过实践验证的解决方案</p>
          </div>
          <button onClick={onAddSolution}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#2563EB' }}>
            <Plus size={16} />
            上传方案
          </button>
        </div>

        {/* 搜索 + 筛选 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索解决方案..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setActiveFilter(ind as IndustryFilter)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={activeFilter === ind
                  ? { backgroundColor: '#EFF6FF', color: '#2563EB' }
                  : { backgroundColor: '#F3F4F6', color: '#374151' }}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* 解决方案列表 */}
        <div className="flex flex-col gap-3">
          {filtered.map((sol) => (
            <div
              key={sol.id}
              onClick={() => onSolutionClick?.(sol.id)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-medium text-gray-800 hover:text-blue-600 transition-colors">{sol.title}</span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: sol.industryBg, color: sol.industryColor }}
                    >
                      {sol.industry}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{sol.description}</p>
                </div>
                <span
                  className="ml-4 text-xs font-semibold px-3 py-1 rounded-md flex-shrink-0"
                  style={{ backgroundColor: '#F3F4F6', color: fileTypeColors[sol.fileType] ?? '#6B7280' }}
                >
                  {sol.fileType}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Link size={13} />
                  <span>关联场景: {sol.relatedScene}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={13} />
                  <span>{sol.updatedAt}</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400">未找到相关解决方案</div>
          )}
        </div>
      </div>
    </main>
  );
}
