import React from 'react';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { SidebarItem } from '../types';
import { SIDEBAR_ITEMS } from '../constants';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[240px] bg-white flex flex-col h-full border-r border-gray-100 flex-shrink-0 relative group">
      <div className="flex-1 overflow-y-auto py-4">
        {SIDEBAR_ITEMS.map((item) => (
          <div key={item.id} className="mb-1">
            <div 
              className={`
                flex items-center justify-between px-4 py-3 cursor-pointer
                ${item.active ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {(item.subItems && item.subItems.length > 0) && (
                item.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              )}
            </div>
            
            {item.expanded && item.subItems && (
              <div className="bg-white">
                {item.subItems.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="pl-12 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-gray-50 cursor-pointer"
                  >
                    {sub.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Collapse button simulation */}
      <button className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-sm text-gray-400 hover:text-blue-600 z-10 hidden group-hover:block">
        <ChevronLeft size={14} />
      </button>
    </aside>
  );
};

export default Sidebar;