import { ChevronRight, Calendar, Link } from 'lucide-react';
import { solutions } from '../data/mockData';

const fileTypeColors: Record<string, string> = {
  PPT: '#EF4444',
  WORD: '#2563EB',
  PDF: '#EA580C',
  EXCEL: '#16A34A',
};

export default function LatestResources() {
  return (
    <div className="flex flex-col gap-4">
      {/* 区域标题 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">最新解决方案</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          查看全部
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 解决方案列表 */}
      <div className="flex flex-col gap-3">
        {solutions.slice(0, 3).map((sol) => (
          <div
            key={sol.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            {/* 头部：标题 + 标签 + 文件类型 */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-medium text-gray-800 truncate">
                    {sol.title}
                  </span>
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
                className="ml-4 text-xs font-medium px-3 py-1 rounded-md flex-shrink-0"
                style={{
                  backgroundColor: '#F3F4F6',
                  color: fileTypeColors[sol.fileType] ?? '#6B7280',
                }}
              >
                {sol.fileType}
              </span>
            </div>

            {/* 底部：关联场景 + 更新时间 */}
            <div className="flex items-center justify-between text-sm text-gray-500">
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
      </div>
    </div>
  );
}
