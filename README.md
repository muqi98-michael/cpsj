# 产品实践库 - 前台页面

基于 Calicat 设计稿还原的产品实践库首页，使用 React + TypeScript + Tailwind CSS 构建。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式**: Tailwind CSS 3
- **图标**: Lucide React
- **路由**: 状态驱动（无需 react-router-dom）

## 页面结构

```
产品实践库/
├── 首页 (Home)
│   ├── 顶部导航栏 (Navbar)
│   ├── 欢迎语 + 快捷功能卡片 (QuickCards)
│   ├── 业务场景知识地图 (KnowledgeMap)
│   ├── 最新解决方案 + AI 助手 (ResourceSection)
│   ├── 热门案例 (HotCases)
│   └── 页脚 (Footer)
├── 场景库 (ScenePage) - 支持行业筛选 + 搜索
├── 解决方案库 (SolutionPage) - 支持行业筛选 + 搜索
├── 案例库 (CasePage)
└── AI 助手 (AIPage) - 可交互对话界面
```

## 设计规范（来自 Calicat 设计稿）

| 设计元素 | 值 |
|--------|-----|
| 主色 Primary | `#165DFF` / `#2563EB` |
| 文字主色 | `#1F2937` |
| 文字次色 | `#6B7280` |
| 边框色 | `#E5E7EB` |
| 背景色 | `#F9FAFB` |
| 卡片背景 | `#FFFFFF` |
| 圆角 | `8px` / `12px` |

### 行业色系

| 行业 | 标签背景 | 标签文字 |
|-----|---------|---------|
| 金融 | `#DBEAFE` | `#2563EB` |
| 零售 | `#DCFCE7` | `#16A34A` |
| 医疗健康 | `#F3E8FF` | `#9333EA` |
| 制造 | `#FEF3C7` | `#D97706` |
| 教育 | `#FEE2E2` | `#DC2626` |

## 快速启动

### 1. 安装 Node.js（如未安装）

**macOS (推荐使用 nvm):**
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc

# 安装 Node.js LTS
nvm install --lts
nvm use --lts
```

**或使用 Homebrew:**
```bash
brew install node
```

### 2. 安装依赖并启动

```bash
cd /Users/workplace/2026AI开发/cpsj
npm install
npm run dev
```

项目将在 http://localhost:5173 启动

### 3. 构建生产版本

```bash
npm run build
npm run preview
```

## 数据存储

Mock 数据位于 `src/data/mockData.ts`，包含：
- `scenes`: 业务场景数据（6条）
- `solutions`: 解决方案数据（5条）
- `caseStudies`: 案例数据（3条）
- `navItems`: 导航菜单配置
- `aiExampleQuestions`: AI 示例问题

后续可替换为真实 API 调用。
