import { Plus } from 'lucide-react';
import { caseStudies } from '../data/mockData';

interface CasePageProps {
  onAddCase?: () => void;
  onCaseClick?: (caseId: string) => void;
}

export default function CasePage({ onAddCase, onCaseClick }: CasePageProps) {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">案例库</h1>
            <p className="text-gray-500 text-sm mt-1">真实企业数字化转型成功案例与经验沉淀</p>
          </div>
          <button
            onClick={onAddCase}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#2563EB' }}
          >
            <Plus size={16} />
            提交案例
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {caseStudies.map((c) => (
            <div
              key={c.id}
              onClick={() => onCaseClick?.(c.id)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div
                className="h-48 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: c.coverColor }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/30" />
                  <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-white/20" />
                </div>
                <div className="relative z-10 text-4xl">📊</div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-base font-medium text-gray-800 flex-1">{c.title}</h3>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: c.industryBg, color: c.industryColor }}
                  >
                    {c.industry}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {c.description}
                </p>
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
      </div>
    </main>
  );
}
