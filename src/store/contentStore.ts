import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { Scene, Solution, CaseStudy } from '../types';

const KEYS = {
  scenes: 'cpsj_scenes',
  solutions: 'cpsj_solutions',
  cases: 'cpsj_cases',
} as const;

function loadFromStorage<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // localStorage 空间不足时（如存储了大文件 base64），忽略写入错误
    console.warn('[contentStore] localStorage 写入失败，可能超出容量限制:', e);
  }
}

export interface ContentStoreValue {
  scenes: Scene[];
  solutions: Solution[];
  cases: CaseStudy[];
  addScene: (scene: Scene) => void;
  addSolution: (solution: Solution) => void;
  addCase: (c: CaseStudy) => void;
  deleteScene: (id: string) => void;
  deleteSolution: (id: string) => void;
  deleteCase: (id: string) => void;
}

/** 根级 Hook —— 只在 App.tsx 调用一次，再通过 Context 下发 */
export function useContentStore(): ContentStoreValue {
  const [scenes, setScenes] = useState<Scene[]>(() => loadFromStorage<Scene>(KEYS.scenes));
  const [solutions, setSolutions] = useState<Solution[]>(() => loadFromStorage<Solution>(KEYS.solutions));
  const [cases, setCases] = useState<CaseStudy[]>(() => loadFromStorage<CaseStudy>(KEYS.cases));

  useEffect(() => { saveToStorage(KEYS.scenes, scenes); }, [scenes]);
  useEffect(() => { saveToStorage(KEYS.solutions, solutions); }, [solutions]);
  useEffect(() => { saveToStorage(KEYS.cases, cases); }, [cases]);

  const addScene = useCallback((scene: Scene) => {
    setScenes(prev => [scene, ...prev]);
  }, []);

  const addSolution = useCallback((solution: Solution) => {
    setSolutions(prev => [solution, ...prev]);
  }, []);

  const addCase = useCallback((c: CaseStudy) => {
    setCases(prev => [c, ...prev]);
  }, []);

  const deleteScene = useCallback((id: string) => {
    setScenes(prev => prev.filter(s => s.id !== id));
  }, []);

  const deleteSolution = useCallback((id: string) => {
    setSolutions(prev => prev.filter(s => s.id !== id));
  }, []);

  const deleteCase = useCallback((id: string) => {
    setCases(prev => prev.filter(c => c.id !== id));
  }, []);

  return { scenes, solutions, cases, addScene, addSolution, addCase, deleteScene, deleteSolution, deleteCase };
}

/** Context —— 所有子组件通过 useStore() 获取共享状态 */
export const ContentStoreContext = createContext<ContentStoreValue | null>(null);

export function useStore(): ContentStoreValue {
  const ctx = useContext(ContentStoreContext);
  if (!ctx) throw new Error('useStore must be used inside ContentStoreProvider');
  return ctx;
}
