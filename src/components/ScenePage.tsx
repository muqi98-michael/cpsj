import { useState } from 'react';
import { Search, Download, Upload, Plus, ChevronDown, Eye, Edit2, Trash2, Layers, FileText, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { scenes } from '../data/mockData';
import { useStore } from '../store/contentStore';

// 痛点地图数据
const PAIN_POINT_ROLES = [
  {
    name: '采购员',
    dept: '采购部',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    points: [
      { title: '供应商管理', desc: '供应商资质审核流程繁琐，无法实时监控供应商绩效' },
      { title: '合同管理', desc: '合同审批周期长，纸质合同管理困难，易丢失' },
      { title: '入库管理', desc: '入库流程不规范，库存数据与实际不符' },
    ],
  },
  {
    name: '仓库管理员',
    dept: '仓储部',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    points: [
      { title: '库存管理', desc: '库存积压与短缺并存，库存周转率低' },
      { title: '出入库管理', desc: '出入库记录不及时，易出现账实不符' },
      { title: '盘点管理', desc: '人工盘点效率低，易出错' },
    ],
  },
  {
    name: '财务会计',
    dept: '财务部',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    points: [
      { title: '应付账款管理', desc: '付款审批流程长，易延误付款' },
      { title: '成本核算', desc: '成本计算复杂，准确性难以保证' },
      { title: '财务报表', desc: '报表编制耗时，难以满足决策需求' },
    ],
  },
];

// 行业场景地图数据
const INDUSTRY_SCENES = [
  {
    name: '装备制造业',
    desc: '涵盖机械制造、汽车制造、航空航天等领域的业务场景',
    imgBg: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #1a4a7a 100%)',
    total: 12,
    current: 2,
  },
  {
    name: '电子高科技',
    desc: '包括半导体、消费电子、人工智能等领域的业务场景',
    imgBg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    total: 9,
    current: 1,
  },
  {
    name: '汽车零部件',
    desc: '专注于汽车零部件生产、供应链管理等业务场景',
    imgBg: 'linear-gradient(135deg, #4a1942 0%, #c34a36 50%, #e8703a 100%)',
    total: 7,
    current: 1,
  },
];

const QUICK_TAGS = ['热门', '新场景', '高价值', '待完善', '金融', '零售', '医疗', '制造'];
const INDUSTRY_OPTIONS = ['全部行业', '金融', '零售', '医疗', '制造', '教育'];
const STATUS_OPTIONS = ['全部状态', '已完善', '进行中', '待完善'];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  已完善: { bg: '#DCFCE7', color: '#15803D' },
  进行中: { bg: '#DBEAFE', color: '#1D4ED8' },
  待完善: { bg: '#FEF9C3', color: '#A16207' },
};

interface ScenePageProps {
  onSceneClick?: (sceneId: string) => void;
  onAddScene?: () => void;
}

export default function ScenePage({ onSceneClick, onAddScene }: ScenePageProps) {
  const { scenes: storedScenes } = useStore();
  const [searchText, setSearchText] = useState('');
  const [industryFilter, setIndustryFilter] = useState('全部行业');
  const [statusFilter, setStatusFilter] = useState('全部状态');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allScenes = [...storedScenes, ...scenes];

  const filtered = allScenes.filter((s) => {
    const matchIndustry = industryFilter === '全部行业' || s.industry === industryFilter;
    const matchStatus = statusFilter === '全部状态' || s.status === statusFilter;
    const matchTag = !activeTag || s.tags.includes(activeTag);
    const matchSearch =
      !searchText ||
      s.title.includes(searchText) ||
      s.painPoint.includes(searchText) ||
      s.code.includes(searchText);
    return matchIndustry && matchStatus && matchTag && matchSearch;
  });

  const allChecked = filtered.length > 0 && filtered.every((s) => selected.has(s.id));

  function toggleAll() {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((s) => s.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function handleReset() {
    setSearchText('');
    setIndustryFilter('全部行业');
    setStatusFilter('全部状态');
    setActiveTag(null);
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 py-8">

        {/* 页面标题与操作区 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">场景库</h1>
            <p className="text-sm text-gray-500 mt-1">管理和维护所有业务场景，关联解决方案与案例资源</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Upload size={15} />
              导入
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={15} />
              导出
            </button>
            <button
              onClick={onAddScene}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#2563EB' }}
            >
              <Plus size={15} />
              新增场景
            </button>
          </div>
        </div>

        {/* 筛选与搜索区 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 space-y-3">
          {/* 搜索行 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索场景名称、编号或痛点描述..."
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <button
              className="px-4 h-9 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#2563EB' }}
            >
              搜索
            </button>
          </div>

          {/* 多维度筛选 */}
          <div className="flex items-center gap-3">
            {/* 行业筛选 */}
            <div className="relative">
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer"
              >
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* 产品筛选 */}
            <div className="relative">
              <select className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer">
                <option>全部产品</option>
                <option>风控平台</option>
                <option>供应链系统</option>
                <option>医疗数据平台</option>
                <option>MES系统</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* 状态筛选 */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* 创建时间 */}
            <div className="relative">
              <select className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer">
                <option>创建时间</option>
                <option>最近一周</option>
                <option>最近一月</option>
                <option>最近三月</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <button
              className="px-4 h-9 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#2563EB' }}
            >
              筛选
            </button>
            <button
              onClick={handleReset}
              className="px-4 h-9 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              重置
            </button>
          </div>

          {/* 快捷标签 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 flex-shrink-0">快速筛选：</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className="px-3 py-0.5 rounded-full text-xs font-medium transition-all"
                style={
                  activeTag === tag
                    ? { backgroundColor: '#DBEAFE', color: '#1D4ED8' }
                    : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 场景列表表格 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* 表头 */}
          <div
            className="flex items-center px-4 h-12 border-b border-gray-200 text-sm font-medium text-gray-500"
            style={{ backgroundColor: '#F9FAFB' }}
          >
            <div className="w-10 flex-shrink-0">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="w-3.5 h-3.5 rounded border-gray-300 accent-blue-600 cursor-pointer"
              />
            </div>
            <div className="flex-[3] min-w-0">场景名称</div>
            <div className="w-20 flex-shrink-0">行业</div>
            <div className="flex-[3] min-w-0">痛点描述</div>
            <div className="flex-[2] min-w-0">关联资源</div>
            <div className="w-20 flex-shrink-0">状态</div>
            <div className="w-20 flex-shrink-0 text-center">操作</div>
          </div>

          {/* 列表行 */}
          {filtered.length > 0 ? (
            filtered.map((scene) => {
              const statusStyle = STATUS_STYLE[scene.status] ?? { bg: '#F3F4F6', color: '#6B7280' };
              const isChecked = selected.has(scene.id);
              return (
                <div
                  key={scene.id}
                  className="flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                >
                  {/* 复选框 */}
                  <div className="w-10 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(scene.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* 场景名称 + 编号 */}
                  <div className="flex-[3] min-w-0 pr-4">
                    <button
                      onClick={() => onSceneClick?.(scene.id)}
                      className="text-sm font-medium text-gray-800 hover:text-blue-600 hover:underline truncate text-left transition-colors"
                    >
                      {scene.title}
                    </button>
                    <p className="text-xs text-gray-400 mt-0.5">{scene.code}</p>
                  </div>

                  {/* 行业标签 */}
                  <div className="w-20 flex-shrink-0">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: scene.iconBg, color: scene.iconColor }}
                    >
                      {scene.industry}
                    </span>
                  </div>

                  {/* 痛点描述 */}
                  <div className="flex-[3] min-w-0 pr-4">
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{scene.painPoint}</p>
                  </div>

                  {/* 关联资源 */}
                  <div className="flex-[2] min-w-0 pr-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Layers size={13} className="text-gray-400" />
                        <span>{scene.solutionCount} 个解决方案</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText size={13} className="text-gray-400" />
                        <span>{scene.caseCount} 个案例</span>
                      </div>
                    </div>
                  </div>

                  {/* 状态 */}
                  <div className="w-20 flex-shrink-0">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                    >
                      {scene.status}
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="w-20 flex-shrink-0 flex items-center justify-center gap-2">
                    <button
                      className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="查看"
                      onClick={() => onSceneClick?.(scene.id)}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="p-1 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                      title="编辑"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="删除"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-gray-400 text-sm">
              未找到符合条件的场景
            </div>
          )}

          {/* 分页区域 */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              共 {filtered.length} 条记录
              {selected.size > 0 && (
                <span className="ml-2 text-blue-600">已选 {selected.size} 条</span>
              )}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className="w-8 h-8 rounded text-sm font-medium transition-colors"
                  style={
                    p === 1
                      ? { backgroundColor: '#2563EB', color: '#fff' }
                      : { color: '#6B7280', backgroundColor: 'transparent' }
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== 痛点地图 ===== */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">痛点地图</h2>

          {/* 筛选行 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <select className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer">
                <option>角色</option>
                <option>采购员</option>
                <option>仓库管理员</option>
                <option>财务会计</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer">
                <option>行业</option>
                <option>全部</option>
                <option>制造业</option>
                <option>零售业</option>
                <option>金融业</option>
                <option>医疗业</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer">
                <option>业务域</option>
                <option>采购管理</option>
                <option>库存管理</option>
                <option>财务管理</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              className="px-4 h-9 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#2563EB' }}
            >
              筛选
            </button>
          </div>

          {/* 角色卡片 */}
          <div className="grid grid-cols-3 gap-4">
            {PAIN_POINT_ROLES.map((role) => (
              <div
                key={role.name}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
              >
                {/* 角色头部 */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: role.iconBg }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" fill={role.iconColor} />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={role.iconColor} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-800">{role.name}</p>
                    <p className="text-xs text-gray-400">{role.dept}</p>
                  </div>
                </div>

                {/* 痛点列表 */}
                <div className="space-y-3">
                  {role.points.map((point) => (
                    <div key={point.title} className="flex items-start gap-2">
                      <AlertTriangle
                        size={15}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: '#F59E0B' }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{point.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 行业场景地图 ===== */}
        <div className="mt-12 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">行业场景地图</h2>

          {/* 筛选行 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <select className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer">
                <option>行业</option>
                <option>制造业</option>
                <option>零售业</option>
                <option>金融业</option>
                <option>医疗业</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer">
                <option>业务域</option>
                <option>供应链管理</option>
                <option>生产制造</option>
                <option>销售管理</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              className="px-4 h-9 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#2563EB' }}
            >
              筛选
            </button>
          </div>

          {/* 行业图片卡片 */}
          <div className="grid grid-cols-3 gap-4">
            {INDUSTRY_SCENES.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                {/* 图片区域 */}
                <div
                  className="h-40 relative flex items-center justify-center"
                  style={{ background: item.imgBg }}
                >
                  <span className="text-white text-2xl font-bold opacity-30 select-none">
                    {item.name.charAt(0)}
                  </span>
                </div>

                {/* 内容区域 */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{ color: '#2563EB' }}>
                      查看详情
                      <ArrowRight size={14} />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={14} />
                      </button>
                      <span>{item.current} / {item.total}</span>
                      <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 领域场景地图 ===== */}
        <DomainSceneMap />

      </div>
    </main>
  );
}

// ---- 领域场景地图数据 ----
const DOMAIN_SCENES = [
  {
    name: '财务管理',
    subtitle: '财务核算、预算管理、资金管理',
    iconBg: '#F3F4F6',
    iconColor: '#6B7280',
    icon: 'finance',
    items: [
      { name: '预算编制与控制', count: 12 },
      { name: '成本核算与控制', count: 8 },
      { name: '资金管理', count: 5 },
      { name: '财务报表', count: 7 },
    ],
  },
  {
    name: '供应链管理',
    subtitle: '采购管理、库存管理、物流管理',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    icon: 'supply',
    items: [
      { name: '供应商管理', count: 15 },
      { name: '库存管理', count: 11 },
      { name: '物流管理', count: 8, pagination: { current: 2, total: 12 } },
      { name: '需求预测', count: 6 },
    ],
  },
  {
    name: '市场与销售',
    subtitle: '市场分析、销售管理、客户关系',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    icon: 'sales',
    items: [
      { name: '市场调研', count: 9 },
      { name: '销售预测', count: 7 },
      { name: '客户关系管理', count: 13 },
      { name: '销售数据分析', count: 8 },
    ],
  },
];

function DomainIcon({ type, bg, color }: { type: string; bg: string; color: string }) {
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
      {type === 'finance' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8" rx="1" fill={color} />
          <rect x="13" y="3" width="8" height="8" rx="1" fill={color} opacity="0.5" />
          <rect x="3" y="13" width="8" height="8" rx="1" fill={color} opacity="0.5" />
          <rect x="13" y="13" width="8" height="8" rx="1" fill={color} />
        </svg>
      )}
      {type === 'supply' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 7h4l2 5h8l2-5h2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="17" r="2" fill={color} />
          <circle cx="17" cy="17" r="2" fill={color} />
          <path d="M5 7L3 3H1" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {type === 'sales' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function DomainSceneMap() {
  const [domainPages, setDomainPages] = useState<Record<number, number>>({});

  function changePage(cardIdx: number, itemIdx: number, delta: number, total: number) {
    const key = cardIdx * 100 + itemIdx;
    const cur = domainPages[key] ?? 2;
    const next = Math.max(1, Math.min(total, cur + delta));
    setDomainPages((prev) => ({ ...prev, [key]: next }));
  }

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">领域场景地图</h2>

      {/* 筛选行 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <select className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer">
            <option>行业</option>
            <option>制造业</option>
            <option>零售业</option>
            <option>金融业</option>
            <option>医疗业</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer">
            <option>领域</option>
            <option>财务管理</option>
            <option>供应链管理</option>
            <option>市场与销售</option>
            <option>人力资源</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <button
          className="px-4 h-9 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
          style={{ backgroundColor: '#2563EB' }}
        >
          筛选
        </button>
      </div>

      {/* 领域卡片 */}
      <div className="grid grid-cols-3 gap-4">
        {DOMAIN_SCENES.map((domain, cardIdx) => (
          <div key={domain.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            {/* 卡片头部 */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <DomainIcon type={domain.icon} bg={domain.iconBg} color={domain.iconColor} />
              <div>
                <p className="text-base font-semibold text-gray-800">{domain.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{domain.subtitle}</p>
              </div>
            </div>

            {/* 领域条目列表 */}
            <div className="space-y-2">
              {domain.items.map((item, itemIdx) => {
                const pag = item.pagination;
                const curPage = pag ? (domainPages[cardIdx * 100 + itemIdx] ?? pag.current) : null;
                return (
                  <div key={item.name} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <div className="flex items-center gap-1.5">
                      {pag && curPage !== null && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <button
                            onClick={() => changePage(cardIdx, itemIdx, -1, pag.total)}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                          >
                            <ChevronLeft size={12} />
                          </button>
                          <span>{curPage} / {pag.total}</span>
                          <button
                            onClick={() => changePage(cardIdx, itemIdx, 1, pag.total)}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                          >
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      )}
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}
                      >
                        {item.count}个场景
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
