import { ChevronRight } from 'lucide-react';
import { caseStudies } from '../data/mockData';

export default function HotCases() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 mb-8">
      {/* 区域标题 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">热门案例</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          查看全部
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 案例卡片网格 */}
      <div className="grid grid-cols-3 gap-4">
        {caseStudies.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            {/* 封面图 */}
            <div
              className="h-48 flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: c.coverColor }}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/30" />
                <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-white/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/10" />
              </div>
              <div className="relative z-10 text-center px-4">
                <div className="text-white/90 text-4xl mb-2">📊</div>
                <div className="text-white font-medium text-sm opacity-80">案例研究</div>
              </div>
            </div>

            {/* 内容区 */}
            <div className="p-5">
              {/* 标题行 */}
              <div className="flex items-start gap-2 mb-2">
                <h3 className="text-base font-medium text-gray-800 leading-snug flex-1">
                  {c.title}
                </h3>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: c.industryBg, color: c.industryColor }}
                >
                  {c.industry}
                </span>
              </div>

              {/* 描述 */}
              <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                {c.description}
              </p>

              {/* 指标数据 */}
              <div className="flex items-center divide-x divide-gray-100">
                {c.metrics.map((m, i) => (
                  <div key={i} className="flex-1 text-center px-2">
                    <div className="text-lg font-bold" style={{ color: c.industryColor }}>
                      {m.value}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
