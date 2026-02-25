import { useState, useRef } from 'react';
import { X, Plus, Trash2, ChevronDown, Upload, Image as ImageIcon, Paperclip, FileText, File, AlertCircle, Lightbulb } from 'lucide-react';
import type { Scene, Solution, CaseStudy, AttachmentFile } from '../types';

type ContentType = '场景' | '解决方案' | '案例';

interface Props {
  onClose: () => void;
  onSave: (type: ContentType, data: Scene | Solution | CaseStudy) => void;
  initialType?: ContentType;
}

/* ─── 常量 ─── */
const INDUSTRIES = ['金融', '制造', '零售', '医疗健康', '教育', '政务', '能源'];
const INDUSTRY_COLORS: Record<string, { color: string; bg: string }> = {
  金融:    { color: '#1D4ED8', bg: '#DBEAFE' },
  制造:    { color: '#B45309', bg: '#FEF3C7' },
  零售:    { color: '#15803D', bg: '#DCFCE7' },
  医疗健康: { color: '#9333EA', bg: '#F3E8FF' },
  教育:    { color: '#0891B2', bg: '#CFFAFE' },
  政务:    { color: '#D97706', bg: '#FEF3C7' },
  能源:    { color: '#DC2626', bg: '#FEE2E2' },
};
const STATUSES_SCENE: Array<Scene['status']> = ['已完善', '进行中', '待完善'];
const STATUSES_SOL: Array<NonNullable<Solution['status']>> = ['已发布', '审核中', '草稿'];
const FILE_TYPES = ['PPT', 'PDF', 'Word', 'Excel'];
const COVER_COLORS = ['#1E40AF', '#166534', '#92400E', '#7E22CE', '#0E7490', '#9F1239'];
const COVER_LABELS = ['蓝色', '绿色', '橙色', '紫色', '青色', '红色'];
const ATTACHMENT_ACCEPT = '.ppt,.pptx,.doc,.docx,.pdf,.xls,.xlsx';
const MAX_IMG_BYTES = 1024 * 1024;   // 1 MB
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

/* ─── 示例数据 ─── */
const SCENE_EXAMPLE = {
  title: '客户信用智能评估',
  description: '基于AI与大数据分析，对企业客户的信用状况进行全面评估，涵盖财务健康度、历史还款记录、行业风险指数等维度，帮助金融机构快速精准地完成信贷审批决策。',
  painPoint: '传统信用评估依赖人工经验，数据来源单一，评估周期长达5-7个工作日，误判率高，无法满足业务快速增长的需求。',
  industry: '金融',
  product: '智能风控平台 · 信贷决策引擎',
  status: '进行中' as Scene['status'],
  tags: ['信用评估', '风控', '大数据', 'AI决策'],
};

const SOLUTION_EXAMPLE = {
  title: '智能信贷风控解决方案',
  version: 'v2.3',
  description: '整合内外部数据源，通过机器学习模型进行实时风险评分，支持批量审批与实时审批两种模式，系统准确率达到92%以上，较传统模型提升30%。',
  industry: '金融',
  fileType: 'PPT',
  fileSize: '18.6MB',
  relatedScene: '客户信用智能评估',
  author: '王方案',
  authorDept: '售前部',
  status: '草稿' as NonNullable<Solution['status']>,
  tags: ['风控', '机器学习', '信贷', '实时决策'],
  applicableProducts: ['智能风控平台', '信贷决策引擎'],
};

const CASE_EXAMPLE = {
  title: '某头部股份制银行信贷风控系统升级',
  description: '为该银行零售信贷业务提供端到端的智能风控解决方案，涵盖申请反欺诈、授信评分、贷后预警三大模块，项目历时6个月完成全量上线。',
  industry: '金融',
  coverColor: COVER_COLORS[0],
  metrics: [
    { value: '92%', label: '模型准确率' },
    { value: '↓65%', label: '坏账率下降' },
    { value: '3分钟', label: '审批时间' },
    { value: '¥2.4亿', label: '年节省损失' },
  ],
};

function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['ppt', 'pptx'].includes(ext)) return <File size={14} className="text-red-500" />;
  if (['doc', 'docx'].includes(ext)) return <FileText size={14} className="text-blue-500" />;
  if (ext === 'pdf') return <File size={14} className="text-orange-500" />;
  if (['xls', 'xlsx'].includes(ext)) return <File size={14} className="text-green-600" />;
  return <Paperclip size={14} className="text-gray-400" />;
}

/* ─── 封面图上传 ─── */
function CoverImageUpload({
  value, onChange,
}: { value: string; onChange: (dataUrl: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [warn, setWarn] = useState('');

  const handleFile = (file: File) => {
    setWarn('');
    if (file.size > MAX_IMG_BYTES) {
      setWarn(`图片较大（${fmtSize(file.size)}），建议压缩至 1MB 以内`);
    }
    const reader = new FileReader();
    reader.onload = e => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">封面图片</label>
      <div
        className="relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-colors hover:border-blue-400 group"
        style={{ borderColor: value ? 'transparent' : '#E5E7EB', height: 110 }}
        onClick={() => ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); }}
      >
        {value ? (
          <>
            <img src={value} alt="封面" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">点击更换</span>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onChange(''); }}
              className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              <X size={10} className="text-white" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-1.5 text-gray-400">
            <ImageIcon size={22} />
            <p className="text-xs">点击上传或拖拽图片</p>
            <p className="text-[10px] text-gray-300">PNG / JPG / WebP，建议 16:9</p>
          </div>
        )}
      </div>
      {warn && (
        <p className="flex items-center gap-1 text-[10px] text-amber-600 mt-1">
          <AlertCircle size={10} /> {warn}
        </p>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

/* ─── 附件上传 ─── */
function AttachmentUpload({
  value, onChange,
}: { value: AttachmentFile[]; onChange: (files: AttachmentFile[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [warn, setWarn] = useState('');

  const handleFiles = (files: FileList) => {
    setWarn('');
    const readers: Promise<AttachmentFile>[] = Array.from(files).map(file =>
      new Promise(resolve => {
        if (file.size > MAX_FILE_BYTES) {
          setWarn(`「${file.name}」超过 5MB 限制，已跳过`);
          resolve({ name: file.name, size: fmtSize(file.size), type: file.type });
          return;
        }
        const reader = new FileReader();
        reader.onload = e => resolve({
          name: file.name,
          size: fmtSize(file.size),
          type: file.type,
          dataUrl: e.target?.result as string,
        });
        reader.readAsDataURL(file);
      })
    );
    Promise.all(readers).then(newFiles => {
      onChange([...value, ...newFiles.filter(f => f.size !== '—')]);
    });
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">上传附件</label>
      <div
        className="border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-blue-400 transition-colors"
        onClick={() => ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        {value.length === 0 ? (
          <div className="flex items-center gap-2 justify-center py-2 text-gray-400">
            <Upload size={16} />
            <span className="text-xs">拖拽或点击上传 PPT / Word / PDF / Excel</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {value.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
                {fileIcon(f.name)}
                <span className="flex-1 text-xs text-gray-700 truncate">{f.name}</span>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{f.size}</span>
                <button onClick={e => { e.stopPropagation(); remove(i); }}
                  className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                  <X size={12} />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-1 mt-1 text-blue-500 text-xs hover:underline">
              <Plus size={12} /> 继续添加
            </div>
          </div>
        )}
      </div>
      {warn && (
        <p className="flex items-center gap-1 text-[10px] text-amber-600 mt-1">
          <AlertCircle size={10} /> {warn}
        </p>
      )}
      <input ref={ref} type="file" multiple accept={ATTACHMENT_ACCEPT} className="hidden"
        onChange={e => { if (e.target.files) handleFiles(e.target.files); }} />
    </div>
  );
}

/* ─── 示例提示条 ─── */
function ExampleBanner({ onUse }: { onUse: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl mb-1">
      <Lightbulb size={15} className="text-amber-500 flex-shrink-0" />
      <p className="flex-1 text-xs text-amber-700">不知道怎么填？可以一键载入完整参考示例，再按需修改。</p>
      <button onClick={onUse}
        className="px-2.5 py-1 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-600 transition-colors flex-shrink-0">
        填入示例
      </button>
      <button onClick={() => setDismissed(true)} className="text-amber-400 hover:text-amber-600">
        <X size={13} />
      </button>
    </div>
  );
}

/* ─── 公用组件 ─── */
const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-white';

function FormField({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-gray-400 font-normal">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="relative">
      <select className={`${inputCls} appearance-none pr-8`} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function TagInput({ tags, onChange, color = 'blue' }: {
  tags: string[]; onChange: (tags: string[]) => void; color?: 'blue' | 'purple';
}) {
  const [input, setInput] = useState('');
  const add = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) { onChange([...tags, t]); setInput(''); }
  };
  const colorCls = color === 'purple'
    ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
    : 'bg-blue-50 text-blue-700 hover:bg-blue-100';
  const badgeCls = color === 'purple'
    ? 'bg-purple-50 text-purple-700'
    : 'bg-blue-50 text-blue-700';
  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-2 min-h-[24px]">
        {tags.map(t => (
          <span key={t} className={`flex items-center gap-1 px-2 py-0.5 ${badgeCls} text-xs rounded-full`}>
            {t}
            <button onClick={() => onChange(tags.filter(x => x !== t))} className="hover:text-red-500"><X size={10} /></button>
          </span>
        ))}
        {tags.length === 0 && <span className="text-xs text-gray-300 italic">暂无标签</span>}
      </div>
      <div className="flex gap-2">
        <input className={`${inputCls} flex-1`} placeholder="输入后按 Enter 或点击添加"
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
        <button onClick={add} className={`px-3 py-1.5 ${colorCls} text-sm rounded-lg transition-colors`}>添加</button>
      </div>
    </div>
  );
}

function SubmitBtn({ onClick }: { onClick: () => void }) {
  return (
    <div className="pt-3 border-t border-gray-100">
      <button onClick={onClick}
        className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[.99] transition-all shadow-sm">
        保存到本地
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   场景表单
═══════════════════════════════════════════ */
interface SceneFormState {
  title: string; description: string; painPoint: string;
  industry: string; product: string; status: Scene['status'];
  tags: string[]; coverImage: string; attachments: AttachmentFile[];
}

const SCENE_INIT: SceneFormState = {
  title: '', description: '', painPoint: '',
  industry: '金融', product: '', status: '进行中',
  tags: [], coverImage: '', attachments: [],
};

function SceneForm({ onSubmit }: { onSubmit: (s: Scene) => void }) {
  const [form, setForm] = useState<SceneFormState>(SCENE_INIT);
  const set = (k: keyof SceneFormState, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const fillExample = () => setForm(f => ({ ...f, ...SCENE_EXAMPLE, tags: [...SCENE_EXAMPLE.tags] }));

  const handleSubmit = () => {
    if (!form.title.trim()) { alert('请填写场景名称'); return; }
    const colors = INDUSTRY_COLORS[form.industry] ?? INDUSTRY_COLORS['金融'];
    const now = new Date().toISOString().slice(0, 10);
    onSubmit({
      id: genId('scene'),
      code: `SC-${Date.now().toString().slice(-6)}`,
      title: form.title.trim(),
      description: form.description.trim() || '暂无描述',
      painPoint: form.painPoint.trim() || '暂无痛点描述',
      industry: form.industry,
      industryColor: colors.color,
      iconBg: colors.bg,
      iconColor: colors.color,
      solutionCount: 0, caseCount: 0,
      status: form.status,
      tags: form.tags,
      createdAt: now,
      product: form.product.trim() || undefined,
      coverImage: form.coverImage || undefined,
      attachments: form.attachments.length ? form.attachments : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <ExampleBanner onUse={fillExample} />

      {/* 封面图 */}
      <CoverImageUpload value={form.coverImage} onChange={v => set('coverImage', v)} />

      {/* 场景名称 */}
      <FormField label="场景名称" required hint="例：客户信用智能评估">
        <input className={inputCls} placeholder="请输入场景名称" value={form.title} onChange={e => set('title', e.target.value)} />
      </FormField>

      {/* 行业 + 状态 */}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="所属行业" required>
          <Select value={form.industry} onChange={v => set('industry', v)} options={INDUSTRIES} />
        </FormField>
        <FormField label="状态">
          <Select value={form.status as string} onChange={v => set('status', v as Scene['status'])} options={STATUSES_SCENE as string[]} />
        </FormField>
      </div>

      {/* 关联产品 */}
      <FormField label="关联产品" hint="例：智能风控平台">
        <input className={inputCls} placeholder="输入关联的产品或平台名称" value={form.product} onChange={e => set('product', e.target.value)} />
      </FormField>

      {/* 核心痛点 */}
      <FormField label="核心痛点" hint="描述现有业务困境">
        <textarea
          className={`${inputCls} h-20 resize-none`}
          placeholder="例：传统信用评估依赖人工经验，数据来源单一，评估周期长，误判率高…"
          value={form.painPoint} onChange={e => set('painPoint', e.target.value)} />
      </FormField>

      {/* 场景描述 */}
      <FormField label="场景描述" hint="详述解决方案与应用价值">
        <textarea
          className={`${inputCls} h-24 resize-none`}
          placeholder="例：基于AI与大数据，对企业客户信用进行多维度评估，覆盖财务健康、历史记录、行业风险指数…"
          value={form.description} onChange={e => set('description', e.target.value)} />
      </FormField>

      {/* 标签 */}
      <FormField label="标签" hint="如：风控、大数据、AI">
        <TagInput tags={form.tags} onChange={v => set('tags', v)} />
      </FormField>

      {/* 附件 */}
      <AttachmentUpload value={form.attachments} onChange={v => set('attachments', v)} />

      <SubmitBtn onClick={handleSubmit} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   解决方案表单
═══════════════════════════════════════════ */
interface SolFormState {
  title: string; version: string; description: string;
  industry: string; fileType: string; fileSize: string;
  relatedScene: string; author: string; authorDept: string;
  status: NonNullable<Solution['status']>;
  tags: string[]; applicableProducts: string[];
  coverImage: string; attachments: AttachmentFile[];
}

const SOL_INIT: SolFormState = {
  title: '', version: 'v1.0', description: '',
  industry: '金融', fileType: 'PPT', fileSize: '',
  relatedScene: '', author: '', authorDept: '',
  status: '草稿', tags: [], applicableProducts: [],
  coverImage: '', attachments: [],
};

function SolutionForm({ onSubmit }: { onSubmit: (s: Solution) => void }) {
  const [form, setForm] = useState<SolFormState>(SOL_INIT);
  const set = (k: keyof SolFormState, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const fillExample = () => setForm(f => ({
    ...f, ...SOLUTION_EXAMPLE,
    tags: [...SOLUTION_EXAMPLE.tags],
    applicableProducts: [...SOLUTION_EXAMPLE.applicableProducts],
  }));

  const handleSubmit = () => {
    if (!form.title.trim()) { alert('请填写方案标题'); return; }
    const colors = INDUSTRY_COLORS[form.industry] ?? INDUSTRY_COLORS['金融'];
    const now = new Date().toISOString().slice(0, 10);
    onSubmit({
      id: genId('sol'),
      title: form.title.trim(),
      version: form.version.trim(),
      description: form.description.trim() || '暂无描述',
      industry: form.industry,
      industryColor: colors.color,
      industryBg: colors.bg,
      fileType: form.fileType,
      fileSize: form.fileSize.trim() || '—',
      relatedScene: form.relatedScene.trim() || '—',
      updatedAt: now, createdAt: now,
      author: form.author.trim() || '未知',
      authorDept: form.authorDept.trim() || '—',
      downloads: 0, views: 0,
      tags: form.tags,
      status: form.status,
      applicableProducts: form.applicableProducts,
      coverImage: form.coverImage || undefined,
      attachments: form.attachments.length ? form.attachments : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <ExampleBanner onUse={fillExample} />

      {/* 封面图 */}
      <CoverImageUpload value={form.coverImage} onChange={v => set('coverImage', v)} />

      {/* 标题 + 版本 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <FormField label="方案标题" required hint="例：智能信贷风控解决方案">
            <input className={inputCls} placeholder="请输入解决方案名称" value={form.title} onChange={e => set('title', e.target.value)} />
          </FormField>
        </div>
        <FormField label="版本号">
          <input className={inputCls} placeholder="v1.0" value={form.version} onChange={e => set('version', e.target.value)} />
        </FormField>
      </div>

      {/* 行业 + 状态 + 文件类型 */}
      <div className="grid grid-cols-3 gap-3">
        <FormField label="所属行业" required>
          <Select value={form.industry} onChange={v => set('industry', v)} options={INDUSTRIES} />
        </FormField>
        <FormField label="发布状态">
          <Select value={form.status} onChange={v => set('status', v as Solution['status'])} options={STATUSES_SOL as string[]} />
        </FormField>
        <FormField label="文件类型">
          <Select value={form.fileType} onChange={v => set('fileType', v)} options={FILE_TYPES} />
        </FormField>
      </div>

      {/* 作者 + 部门 + 文件大小 */}
      <div className="grid grid-cols-3 gap-3">
        <FormField label="作者" hint="例：王方案">
          <input className={inputCls} placeholder="填写姓名" value={form.author} onChange={e => set('author', e.target.value)} />
        </FormField>
        <FormField label="所属部门">
          <input className={inputCls} placeholder="如：售前部" value={form.authorDept} onChange={e => set('authorDept', e.target.value)} />
        </FormField>
        <FormField label="文件大小">
          <input className={inputCls} placeholder="如：18.6MB" value={form.fileSize} onChange={e => set('fileSize', e.target.value)} />
        </FormField>
      </div>

      {/* 关联场景 */}
      <FormField label="关联场景" hint="例：客户信用智能评估">
        <input className={inputCls} placeholder="输入对应的场景名称" value={form.relatedScene} onChange={e => set('relatedScene', e.target.value)} />
      </FormField>

      {/* 方案描述 */}
      <FormField label="方案描述">
        <textarea
          className={`${inputCls} h-24 resize-none`}
          placeholder="例：整合内外部数据源，通过机器学习模型进行实时风险评分，支持批量审批与实时审批两种模式…"
          value={form.description} onChange={e => set('description', e.target.value)} />
      </FormField>

      {/* 适用产品 */}
      <FormField label="适用产品">
        <TagInput tags={form.applicableProducts} onChange={v => set('applicableProducts', v)} color="purple" />
      </FormField>

      {/* 标签 */}
      <FormField label="标签">
        <TagInput tags={form.tags} onChange={v => set('tags', v)} />
      </FormField>

      {/* 附件 */}
      <AttachmentUpload value={form.attachments} onChange={v => set('attachments', v)} />

      <SubmitBtn onClick={handleSubmit} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   案例表单
═══════════════════════════════════════════ */
interface Metric { value: string; label: string; }
interface CaseFormState {
  title: string; description: string; industry: string;
  coverColor: string; metrics: Metric[];
  coverImage: string; attachments: AttachmentFile[];
}

const CASE_INIT: CaseFormState = {
  title: '', description: '', industry: '金融',
  coverColor: COVER_COLORS[0],
  metrics: [{ value: '', label: '' }],
  coverImage: '', attachments: [],
};

function CaseForm({ onSubmit }: { onSubmit: (c: CaseStudy) => void }) {
  const [form, setForm] = useState<CaseFormState>(CASE_INIT);
  const set = (k: keyof CaseFormState, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const fillExample = () => setForm(f => ({
    ...f,
    title: CASE_EXAMPLE.title,
    description: CASE_EXAMPLE.description,
    industry: CASE_EXAMPLE.industry,
    coverColor: CASE_EXAMPLE.coverColor,
    metrics: [...CASE_EXAMPLE.metrics],
  }));

  const setMetric = (i: number, k: keyof Metric, v: string) =>
    setForm(f => { const m = [...f.metrics]; m[i] = { ...m[i], [k]: v }; return { ...f, metrics: m }; });

  const handleSubmit = () => {
    if (!form.title.trim()) { alert('请填写案例标题'); return; }
    const colors = INDUSTRY_COLORS[form.industry] ?? INDUSTRY_COLORS['金融'];
    onSubmit({
      id: genId('case'),
      title: form.title.trim(),
      description: form.description.trim() || '暂无描述',
      industry: form.industry,
      industryColor: colors.color,
      industryBg: colors.bg,
      coverColor: form.coverColor,
      metrics: form.metrics.filter(m => m.value.trim() && m.label.trim()),
      coverImage: form.coverImage || undefined,
      attachments: form.attachments.length ? form.attachments : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <ExampleBanner onUse={fillExample} />

      {/* 封面图 */}
      <CoverImageUpload value={form.coverImage} onChange={v => set('coverImage', v)} />

      {/* 案例标题 */}
      <FormField label="案例标题" required hint="例：某头部银行信贷风控系统升级">
        <input className={inputCls} placeholder="请输入客户案例名称" value={form.title} onChange={e => set('title', e.target.value)} />
      </FormField>

      {/* 行业 + 封面颜色 */}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="所属行业" required>
          <Select value={form.industry} onChange={v => set('industry', v)} options={INDUSTRIES} />
        </FormField>
        <FormField label="封面主色" hint="无封面图时使用">
          <div className="flex gap-2 flex-wrap pt-1">
            {COVER_COLORS.map((c, i) => (
              <button key={c} onClick={() => set('coverColor', c)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${form.coverColor === c ? 'border-gray-700 scale-110' : 'border-transparent'}`}
                style={{ background: c }} title={COVER_LABELS[i]} />
            ))}
          </div>
        </FormField>
      </div>

      {/* 案例描述 */}
      <FormField label="案例描述">
        <textarea
          className={`${inputCls} h-24 resize-none`}
          placeholder="例：为某银行零售信贷业务提供端到端智能风控方案，涵盖申请反欺诈、授信评分、贷后预警三大模块…"
          value={form.description} onChange={e => set('description', e.target.value)} />
      </FormField>

      {/* 关键指标 */}
      <FormField label="关键指标" hint="展示在案例卡片上的核心成果数字">
        <div className="space-y-2">
          {form.metrics.map((m, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input className={`${inputCls} w-28`} placeholder="如：92%"
                value={m.value} onChange={e => setMetric(i, 'value', e.target.value)} />
              <input className={`${inputCls} flex-1`} placeholder="如：模型准确率"
                value={m.label} onChange={e => setMetric(i, 'label', e.target.value)} />
              {form.metrics.length > 1 && (
                <button onClick={() => setForm(f => ({ ...f, metrics: f.metrics.filter((_, idx) => idx !== i) }))}
                  className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              )}
            </div>
          ))}
          {form.metrics.length < 4 && (
            <button onClick={() => setForm(f => ({ ...f, metrics: [...f.metrics, { value: '', label: '' }] }))}
              className="flex items-center gap-1 text-blue-500 text-xs hover:underline mt-1">
              <Plus size={13} /> 添加指标（最多 4 条）
            </button>
          )}
        </div>
      </FormField>

      {/* 附件 */}
      <AttachmentUpload value={form.attachments} onChange={v => set('attachments', v)} />

      <SubmitBtn onClick={handleSubmit} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   主 Modal
═══════════════════════════════════════════ */
const TYPE_TABS: ContentType[] = ['场景', '解决方案', '案例'];
const TYPE_DESC: Record<ContentType, string> = {
  场景: '描述业务痛点与应用场景，是内容库的核心分类单元',
  解决方案: '针对特定场景的方案文档，支持 PPT / PDF / Word 等格式',
  案例: '已落地的客户实施案例，展示真实的业务价值与成效',
};
const TYPE_ICON: Record<ContentType, string> = { 场景: '🗺️', 解决方案: '📋', 案例: '🏆' };

export default function NewContentModal({ onClose, onSave, initialType = '场景' }: Props) {
  const [activeType, setActiveType] = useState<ContentType>(initialType);

  const handleSave = (data: Scene | Solution | CaseStudy) => {
    onSave(activeType, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">新增内容</h2>
            <p className="text-xs text-gray-400 mt-0.5">保存至本地存储 · 刷新页面仍可见 · GitHub Pages 可用</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Type selector */}
        <div className="px-6 pt-4 pb-1">
          <div className="flex gap-2">
            {TYPE_TABS.map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl font-medium transition-all ${
                  activeType === t
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                <span>{TYPE_ICON[t]}</span>{t}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 mb-2">{TYPE_DESC[activeType]}</p>
        </div>

        {/* Form scrollable area */}
        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {activeType === '场景' && <SceneForm onSubmit={handleSave} />}
          {activeType === '解决方案' && <SolutionForm onSubmit={handleSave} />}
          {activeType === '案例' && <CaseForm onSubmit={handleSave} />}
        </div>
      </div>
    </div>
  );
}
