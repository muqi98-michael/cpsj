import QuickCards from './QuickCards';
import KnowledgeMap from './KnowledgeMap';
import ResourceSection from './ResourceSection';
import HotCases from './HotCases';

interface HomePageProps {
  onSceneClick?: (sceneId: string) => void;
  onUploadClick?: () => void;
  onAIClick?: () => void;
  onSearchClick?: () => void;
}

export default function HomePage({ onSceneClick, onUploadClick, onAIClick, onSearchClick }: HomePageProps) {
  return (
    <main className="bg-gray-50 min-h-screen">
      <QuickCards onUploadClick={onUploadClick} onAIClick={onAIClick} onSearchClick={onSearchClick} />
      <KnowledgeMap onSceneClick={onSceneClick} />
      <ResourceSection />
      <HotCases />
    </main>
  );
}
