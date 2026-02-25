import { useState, Component } from 'react';
import type { ReactNode } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ScenePage from './components/ScenePage';
import SolutionPage from './components/SolutionPage';
import CasePage from './components/CasePage';
import AIPage from './components/AIPage';
import SceneDetailPage from './components/SceneDetailPage';
import AdminPage from './components/AdminPage';
import OpenManagePage from './components/OpenManagePage';
import SolutionDetailPage from './components/SolutionDetailPage';
import NewContentModal from './components/NewContentModal';
import SearchResultsPage from './components/SearchResultsPage';
import CaseDetailPage from './components/CaseDetailPage';
import { useContentStore, ContentStoreContext } from './store/contentStore';
import type { Scene, Solution, CaseStudy } from './types';

/* ── 全局错误边界，防止未捕获异常白屏 ── */
class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 text-center px-6">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800">页面出现错误</h2>
          <p className="text-sm text-gray-500 max-w-md">{this.state.error.message}</p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

type PageId = 'home' | 'scenes' | 'solutions' | 'cases' | 'ai' | 'admin' | 'open';

export default function App() {
  const store = useContentStore();
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [sceneDetailId, setSceneDetailId] = useState<string | null>(null);
  const [solutionDetailId, setSolutionDetailId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadInitialType, setUploadInitialType] = useState<'场景' | '解决方案' | '案例'>('场景');
  const [caseDetailId, setCaseDetailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocusKey, setSearchFocusKey] = useState(0);

  function handleNavChange(id: string) {
    setCurrentPage(id as PageId);
    setSceneDetailId(null);
    setSolutionDetailId(null);
    setCaseDetailId(null);
    setSearchQuery('');
  }

  function handleCaseClick(caseId: string) {
    setCaseDetailId(caseId);
    setSearchQuery('');
  }

  function handleSearch(q: string) {
    setSearchQuery(q);
    setSceneDetailId(null);
    setSolutionDetailId(null);
  }

  function handleSearchFocus() {
    setSearchFocusKey(k => k + 1);
  }

  function handleSceneClick(sceneId: string) {
    setSolutionDetailId(null);
    setCaseDetailId(null);
    setSceneDetailId(sceneId);
    setSearchQuery('');
  }

  function handleSolutionClick(solutionId: string) {
    setSceneDetailId(null);
    setCaseDetailId(null);
    setSolutionDetailId(solutionId);
    setSearchQuery('');
  }

  function handleBackFromDetail() {
    setSceneDetailId(null);
    setSolutionDetailId(null);
    setCaseDetailId(null);
  }

  const renderContent = () => {
    // 搜索结果页优先级最高
    if (searchQuery) {
      return (
        <SearchResultsPage
          query={searchQuery}
          onBack={() => setSearchQuery('')}
          onSceneClick={handleSceneClick}
          onSolutionClick={handleSolutionClick}
          onQueryChange={setSearchQuery}
        />
      );
    }
    if (caseDetailId) {
      return (
        <CaseDetailPage
          caseId={caseDetailId}
          onBack={handleBackFromDetail}
          onSceneClick={handleSceneClick}
          onSolutionClick={handleSolutionClick}
        />
      );
    }
    if (sceneDetailId) {
      return <SceneDetailPage sceneId={sceneDetailId} onBack={handleBackFromDetail} />;
    }
    if (solutionDetailId) {
      return (
        <SolutionDetailPage
          solutionId={solutionDetailId}
          onBack={handleBackFromDetail}
          onSceneClick={handleSceneClick}
        />
      );
    }
    switch (currentPage) {
      case 'home':      return <HomePage onSceneClick={handleSceneClick} onUploadClick={() => { setUploadInitialType('场景'); setShowUploadModal(true); }} onAIClick={() => handleNavChange('ai')} onSearchClick={handleSearchFocus} />;
      case 'scenes':    return <ScenePage onSceneClick={handleSceneClick} onAddScene={() => { setUploadInitialType('场景'); setShowUploadModal(true); }} />;
      case 'solutions': return <SolutionPage onSolutionClick={handleSolutionClick} onAddSolution={() => { setUploadInitialType('解决方案'); setShowUploadModal(true); }} />;
      case 'cases':     return <CasePage onAddCase={() => { setUploadInitialType('案例'); setShowUploadModal(true); }} onCaseClick={handleCaseClick} />;
      case 'ai':        return <AIPage />;
      case 'admin':     return <AdminPage />;
      case 'open':      return <OpenManagePage />;
    }
  };

  function handleUploadSave(type: '场景' | '解决方案' | '案例', data: Scene | Solution | CaseStudy) {
    if (type === '场景') store.addScene(data as Scene);
    else if (type === '解决方案') store.addSolution(data as Solution);
    else store.addCase(data as CaseStudy);
  }

  return (
    <AppErrorBoundary>
      <ContentStoreContext.Provider value={store}>
        {showUploadModal && (
          <NewContentModal
            onClose={() => setShowUploadModal(false)}
            onSave={handleUploadSave}
            initialType={uploadInitialType}
          />
        )}
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar activeNav={currentPage} onNavChange={handleNavChange} onSearch={handleSearch} searchFocusKey={searchFocusKey} />
          <div className="flex-1">{renderContent()}</div>
          <Footer />
        </div>
      </ContentStoreContext.Provider>
    </AppErrorBoundary>
  );
}
