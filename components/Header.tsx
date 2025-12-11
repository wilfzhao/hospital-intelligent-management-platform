import React from 'react';
import { Grid, Settings, Bell, User, Layout, BarChart2, Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-14 bg-blue-600 text-white flex items-center justify-between px-4 shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-white/20 p-1.5 rounded-lg">
             <Activity className="text-white" size={20} />
          </div>
          <span>智慧管理平台</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          {['医院等级评审', '公立医院绩效考核', '指标管理中心', '管理配置', '运营决策中心'].map((item, index) => (
            <button 
              key={index}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                item === '管理配置' 
                  ? 'bg-blue-700/50 text-white' 
                  : 'text-blue-100 hover:bg-blue-500/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                {item === '管理配置' && <Grid size={14} />}
                {item}
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-blue-100">
           <span className="text-lg font-bold italic">Ai</span> 助手
        </div>
        <div className="h-6 w-px bg-blue-400/50"></div>
        <div className="flex items-center gap-2">
           <img 
             src="https://picsum.photos/32/32" 
             alt="User" 
             className="w-8 h-8 rounded-full border-2 border-white/20" 
           />
           <span>赵伟峰</span>
        </div>
        <Settings size={18} className="cursor-pointer hover:text-blue-200" />
      </div>
    </header>
  );
};

export default Header;