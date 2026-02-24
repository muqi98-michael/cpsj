import LatestResources from './LatestResources';
import AIAssistant from './AIAssistant';

export default function ResourceSection() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 mb-8">
      <div className="grid grid-cols-[1fr_448px] gap-4 items-start">
        {/* 左侧：最新解决方案 */}
        <LatestResources />
        {/* 右侧：AI 助手卡片 */}
        <AIAssistant />
      </div>
    </section>
  );
}
