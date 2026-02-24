import { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { navItems } from '../data/mockData';

interface NavbarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
  onSearch?: (query: string) => void;
  searchFocusKey?: number; // 递增时自动 focus 搜索框
}

export default function Navbar({ activeNav, onNavChange, onSearch, searchFocusKey }: NavbarProps) {
  const [searchValue, setSearchValue] = useState('');

  // 当 searchFocusKey 变化时 focus 输入框
  const inputRef = (node: HTMLInputElement | null) => {
    if (node && searchFocusKey) node.focus();
  };

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (searchValue.trim()) onSearch?.(searchValue.trim());
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #165DFF 0%, #2563EB 100%)' }}
          >
            实
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold" style={{ color: '#165DFF' }}>
              产品实践库
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#DBEAFE', color: '#165DFF' }}
            >
              企业版
            </span>
          </div>
        </div>

        {/* 主导航 */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            if (item.id === 'admin' || item.id === 'open') {
              return (
                <button
                  key={item.id}
                  onClick={() => onNavChange(item.id)}
                  className="ml-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 border"
                  style={
                    activeNav === item.id
                      ? { backgroundColor: '#1E293B', color: '#fff', borderColor: '#1E293B' }
                      : { backgroundColor: 'transparent', color: '#475569', borderColor: '#E2E8F0' }
                  }
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  {item.label}
                </button>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={
                  activeNav === item.id
                    ? { backgroundColor: '#EFF6FF', color: '#165DFF' }
                    : { color: '#333333' }
                }
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* 右侧功能区 */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="relative">
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
              <Search size={16} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="搜索场景、方案或案例..."
              className="w-64 h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </form>

          {/* 通知图标 */}
          <button className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-500" />
            <span
              className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#EF4444' }}
            />
          </button>

          {/* 用户信息 */}
          <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #2563EB, #9333EA)' }}
            >
              张
            </div>
            <span className="text-sm font-medium text-gray-800">张顾问</span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
