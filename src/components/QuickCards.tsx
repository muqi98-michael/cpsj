import { Search, Upload, MessageCircle, Map } from 'lucide-react';

interface QuickCardsProps {
  onUploadClick?: () => void;
  onAIClick?: () => void;
  onSearchClick?: () => void;
}

export default function QuickCards({ onUploadClick, onAIClick, onSearchClick }: QuickCardsProps) {
  const cards = [
    {
      icon: <Search size={24} />,
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      title: '搜索资源',
      desc: '快速查找所需文档和资料',
      onClick: onSearchClick,
    },
    {
      icon: <Upload size={24} />,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      title: '上传文档',
      desc: '添加新的解决方案或案例',
      onClick: onUploadClick,
    },
    {
      icon: <MessageCircle size={24} />,
      iconBg: '#FAF5FF',
      iconColor: '#9333EA',
      title: 'AI问答',
      desc: '智能解答业务问题',
      onClick: onAIClick,
    },
    {
      icon: <Map size={24} />,
      iconBg: '#FFFBEB',
      iconColor: '#D97706',
      title: '知识地图',
      desc: '可视化浏览知识体系',
      onClick: undefined as (() => void) | undefined,
    },
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">欢迎回来，张顾问</h1>
        <p className="text-gray-500 mt-1 text-sm">探索产品实践库，快速找到您需要的知识资源</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={card.onClick}
            className="bg-white rounded-xl p-5 flex items-start gap-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left group"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: card.iconBg, color: card.iconColor }}
            >
              {card.icon}
            </div>
            <div>
              <div className="text-base font-medium text-gray-800 mb-1">{card.title}</div>
              <div className="text-sm text-gray-500">{card.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
