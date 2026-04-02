import React, { useState, useRef, useEffect } from 'react';
import { Grid, Settings, Activity, MoreHorizontal, ChevronDown } from 'lucide-react';

interface HeaderProps {
  items: string[];
  activeItem?: string;
  onSelectItem?: (item: string) => void;
}

const Header: React.FC<HeaderProps> = ({ items, activeItem, onSelectItem }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.slice(0, 7);
  const overflowItems = items.slice(7);
  const hasOverflow = overflowItems.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105">
             <Activity className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">智慧管理平台</span>
        </div>
        
        <nav className="hidden md:flex items-center h-16">
          {visibleItems.map((item, index) => (
            <button 
              key={index}
              onClick={() => { if (onSelectItem) onSelectItem(item); }}
              className={`px-5 h-full flex items-center text-[15px] font-medium transition-all relative group ${
                activeItem === item
                  ? 'text-blue-600' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {item === '管理配置' && <Grid size={16} className={activeItem === item ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />}
                {item}
              </div>
              {activeItem === item && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-t-full" />
              )}
              {activeItem !== item && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-slate-200 rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          ))}

          {hasOverflow && (
            <div className="relative h-full" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`px-4 h-full flex items-center text-sm font-medium transition-all gap-1.5 ${
                   isMenuOpen ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MoreHorizontal size={18} />
                <ChevronDown size={14} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute top-[calc(100%-8px)] left-0 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {overflowItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (onSelectItem) onSelectItem(item);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 text-[14px] text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-between group"
                    >
                      {item}
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
           <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
             <span className="text-[10px] text-white font-bold italic">Ai</span>
           </div>
           <span className="text-xs font-semibold text-slate-600">AI 助手已就绪</span>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
             <span className="text-sm font-bold text-slate-900 leading-none">赵伟峰</span>
             <span className="text-[11px] text-slate-400 mt-1 font-medium">超级管理员</span>
           </div>
           <div className="relative">
             <img 
               src="https://picsum.photos/40/40" 
               alt="User" 
               className="w-10 h-10 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm" 
               referrerPolicy="no-referrer"
             />
             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
           </div>
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-900 active:scale-95">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;