import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  lastModified: string;
}

const MOCK_COMPONENTS: ComponentItem[] = [
  { id: '1', name: '门急诊收入分析组件', lastModified: '2026-04-08 10:23:45' },
  { id: '2', name: '手术量趋势分析组件', lastModified: '2026-04-07 15:12:30' },
  { id: '3', name: '病床使用率组件', lastModified: '2026-04-06 09:45:12' },
];

interface IndicatorAnalysisComponentsProps {
  onAddComponent: () => void;
}

export const IndicatorAnalysisComponents: React.FC<IndicatorAnalysisComponentsProps> = ({ onAddComponent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [components] = useState<ComponentItem[]>(MOCK_COMPONENTS);

  const filteredComponents = components.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="bg-white rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">分析组件</h2>
          <button 
            onClick={onAddComponent}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
          >
            <Plus size={16} />
            <span>新建组件</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="搜索组件名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b border-gray-200">名称</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b border-gray-200 w-64">最新修改日期</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b border-gray-200 w-48 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredComponents.map((component) => (
                <tr key={component.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800 text-sm">{component.name}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {component.lastModified}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="编辑">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="删除">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredComponents.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500 text-sm">
                    没有找到匹配的组件
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
