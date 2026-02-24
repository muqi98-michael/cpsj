import { useState } from 'react';
import { ChevronRight, Layers, FileText, Plus } from 'lucide-react';
import { scenes, industries } from '../data/mockData';
import type { IndustryFilter } from '../types';

const industryIconMap: Record<string, React.ReactNode> = {
  金融: <span className="text-lg">💰</span>,
  零售: <span className="text-lg">🛍️</span>,
  医疗健康: <span className="text-lg">🏥</span>,
  制造: <span className="text-lg">🏭</span>,
  教育: <span className="text-lg">📚</span>,
};

interface KnowledgeMapProps {
  onSceneClick?: (sceneId: string) => void;
}

export default function KnowledgeMap({ onSceneClick }: KnowledgeMapProps) {
  const [activeFilter, setActiveFilter] = useState<IndustryFilter>('全部行业');

  const filtered =
    activeFilter === '全部行业'
      ? scenes
      : scenes.filter((s) => s.industry === activeFilter);

  return (
    <section className="max-w-[1440px] mx-auto px-6 mb-8">
      {/* 区域标题 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">业务场景知识地图</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          查看全部
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 知识地图容器 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* 行业分类标签 */}
        <div className="flex items-center gap-2 mb-6">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveFilter(ind as IndustryFilter)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={
                activeFilter === ind
                  ? { backgroundColor: '#EFF6FF', color: '#2563EB' }
                  : { backgroundColor: '#F3F4F6', color: '#374151' }
              }
            >
              {ind}
            </button>
          ))}
        </div>

        {/* 场景卡片网格 */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((scene) => (
            <button
              key={scene.id}
              onClick={() => onSceneClick?.(scene.id)}
              className="flex flex-col p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              {/* 场景图标 */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: scene.iconBg }}
              >
                {industryIconMap[scene.industry] ?? (
                  <Layers size={18} style={{ color: scene.iconColor }} />
                )}
              </div>

              {/* 标题 */}
              <div className="text-base font-medium text-gray-800 mb-1">{scene.title}</div>

              {/* 描述 */}
              <div className="text-sm text-gray-500 mb-4 leading-relaxed">{scene.description}</div>

              {/* 关联信息 */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Layers size={14} />
                  <span>{scene.solutionCount}个解决方案</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <FileText size={14} />
                  <span>{scene.caseCount}个案例</span>
                </div>
              </div>
            </button>
          ))}

          {/* 添加新场景卡片 */}
          <button className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 min-h-[168px] group">
            <Plus
              size={28}
              className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
            />
            <span className="text-base font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
              添加新场景
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
