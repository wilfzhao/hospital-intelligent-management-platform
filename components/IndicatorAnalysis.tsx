import React, { useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

// --- Types ---
interface AnalysisSystem {
  id: string;
  name: string;
  url: string;
}

// --- Mock Data ---
const MOCK_DATA: AnalysisSystem[] = [
  { id: '1', name: '出院手术患者分析', url: 'http://zjeuzlikyp.ru/wgtmveywft' },
  { id: '2', name: '次均药费分析', url: 'http://wrpbxx.ag/wymmpfg' },
  { id: '3', name: '出院手术患者分析', url: 'http://shvdwpjh.bn/rvcsxvkbhe' },
  { id: '4', name: '出院手术患者分析', url: 'http://kslmcapmu.sz/ulvlfmk' },
  { id: '5', name: '出院手术患者分析', url: 'http://svxkqxh.ie/tpihro' },
];

interface IndicatorAnalysisProps {
  onAddSystem?: () => void;
}

export default function IndicatorAnalysis({ onAddSystem }: IndicatorAnalysisProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-full w-full bg-[#f5f7fa] overflow-hidden p-4">
      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Search Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-6 shrink-0">
          {/* Left: Search Input */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索指标分析体系" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 border border-gray-200 rounded text-sm pl-9 pr-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div>
            <button 
              onClick={onAddSystem}
              className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-1.5 rounded transition-colors shadow-sm text-sm"
            >
              <Plus size={16} />
              <span>新增</span>
            </button>
          </div>
        </div>

        {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-[#f8fafc] sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-sm font-medium text-gray-600 border-b border-gray-200">指标分析体系名称</th>
                    <th className="p-4 text-sm font-medium text-gray-600 border-b border-gray-200">URL地址</th>
                    <th className="p-4 text-sm font-medium text-gray-600 border-b border-gray-200 w-32 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_DATA.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 text-sm text-gray-800">{item.name}</td>
                      <td className="p-4 text-sm text-[#38bdf8] hover:underline cursor-pointer">{item.url}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <button className="text-[#3b82f6] hover:text-blue-800 hover:underline transition-colors">编辑</button>
                          <span className="text-gray-300">|</span>
                          <button className="text-[#38bdf8] hover:text-blue-500 hover:underline transition-colors">删除</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows to fill space if needed, matching the screenshot's empty lines */}
                  <tr><td colSpan={3} className="p-4 border-b border-gray-50"></td></tr>
                  <tr><td colSpan={3} className="p-4 border-b border-gray-50"></td></tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 shrink-0">
              <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white flex items-center justify-center">
                1
              </button>
              <MoreHorizontal size={16} className="text-gray-400 mx-1" />
              <button className="w-8 h-8 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white flex items-center justify-center">
                3
              </button>
              <button className="w-8 h-8 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white flex items-center justify-center">
                4
              </button>
              <button className="w-8 h-8 bg-[#3b82f6] text-white rounded text-sm font-medium shadow-sm flex items-center justify-center">
                5
              </button>
              <button className="w-8 h-8 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white flex items-center justify-center">
                6
              </button>
              <button className="w-8 h-8 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white flex items-center justify-center">
                7
              </button>
              <MoreHorizontal size={16} className="text-gray-400 mx-1" />
              <button className="w-8 h-8 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white flex items-center justify-center">
                99
              </button>
              <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                <ChevronRight size={16} />
              </button>
              
              <select className="ml-2 border border-gray-200 rounded text-sm text-gray-600 px-2 py-1.5 bg-white focus:outline-none focus:border-blue-500 transition-colors">
                <option>10条/页</option>
                <option>20条/页</option>
                <option>50条/页</option>
              </select>
            </div>

      </div>
    </div>
  );
}
