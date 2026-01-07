
import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Plus, MoreHorizontal, Filter, 
  ChevronRight, ChevronDown, FileText, Folder, FolderOpen,
  ChevronLeft, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { Checkbox } from './ui/Checkbox';
import { EditIndicatorModal } from './EditIndicatorModal';

// Mock Data for Directory Tree
interface Directory {
  id: string;
  name: string;
  children?: Directory[];
}

const MOCK_DIRECTORIES: Directory[] = [
  {
    id: 'dir-1',
    name: '目录一',
    children: [
      { id: 'dir-1-1', name: '目录1-1', children: [{ id: 'dir-1-2', name: '目录1-2' }] },
    ]
  },
  { id: 'dir-2', name: '目录二' },
  { id: 'dir-3', name: '目录三' },
  { id: 'dir-4', name: '目录四' },
];

// Mock Data for Indicators
interface AssociatedIndicator {
  id: string;
  name: string;
  displayName: string; // 指标展示名
  sort: number;
  type: 'basic' | 'composite'; // 基础指标 | 复合指标
}

const MOCK_INDICATORS: AssociatedIndicator[] = [
  { id: 'i1', name: '测试院级填报指标', displayName: '', sort: 0, type: 'basic' },
  { id: 'i2', name: '指标填报（半年）', displayName: '', sort: 0, type: 'basic' },
  { id: 'i3', name: '指标权限测试（基础指标手动采集二）', displayName: '', sort: 0, type: 'basic' },
  { id: 'i4', name: '指标权限测试（基础指标手动采集一）', displayName: '', sort: 0, type: 'basic' },
  { id: 'i5', name: '指标权限测试（复合指标）', displayName: '', sort: 0, type: 'composite' },
  { id: 'i6', name: '指标权限测试（基础指标自动采集二）', displayName: '', sort: 0, type: 'basic' },
  { id: 'i7', name: '指标权限测试（基础指标自动采集一）', displayName: '', sort: 0, type: 'basic' },
];

interface AssociateIndicatorsProps {
  planName: string;
  onBack: () => void;
}

export const AssociateIndicators: React.FC<AssociateIndicatorsProps> = ({ planName, onBack }) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['dir-1', 'dir-1-1']));
  const [selectedDirId, setSelectedDirId] = useState<string>('dir-1-2');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<AssociatedIndicator | null>(null);

  const toggleDir = (id: string) => {
    const newSet = new Set(expandedDirs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedDirs(newSet);
  };

  const toggleRow = (id: string) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  const toggleAll = () => {
    if (selectedRows.size === MOCK_INDICATORS.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(MOCK_INDICATORS.map(i => i.id)));
    }
  };

  const handleEditClick = (item: AssociatedIndicator) => {
    setEditingIndicator(item);
    setIsEditModalOpen(true);
  };

  const handleEditConfirm = (data: any) => {
    // In a real app, update logic here
    console.log('Update indicator:', editingIndicator?.id, data);
    setIsEditModalOpen(false);
    setEditingIndicator(null);
  };

  // Directory Tree Item Renderer
  const renderDirectory = (dir: Directory, level = 0) => {
    const isExpanded = expandedDirs.has(dir.id);
    const isSelected = selectedDirId === dir.id;
    const hasChildren = dir.children && dir.children.length > 0;

    return (
      <div key={dir.id}>
        <div 
          className={`
            group flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors rounded-md mx-2
            ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}
          `}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => setSelectedDirId(dir.id)}
        >
          <div className="flex items-center gap-2">
            <div 
              className={`w-4 h-4 flex items-center justify-center transition-transform ${hasChildren ? 'cursor-pointer' : 'invisible'}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleDir(dir.id);
              }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {/* Folder Icon Logic for visual flair */}
            {hasChildren ? (
                 isExpanded ? <FolderOpen size={16} className="text-blue-400" /> : <Folder size={16} className="text-gray-400" />
            ) : (
                 <FileText size={16} className="text-gray-400" />
            )}
            <span className="truncate">{dir.name}</span>
          </div>
          <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 p-1">
             <MoreHorizontal size={14} />
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {dir.children!.map(child => renderDirectory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 w-full flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden font-sans">
      {/* 1. Header */}
      <div className="h-14 border-b border-gray-200 flex items-center px-4 flex-shrink-0 bg-white">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-gray-800 hover:text-blue-600 font-bold text-lg transition-colors mr-4"
        >
          <ArrowLeft size={20} />
          <span>关联指标</span>
        </button>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">当前方案: {planName}</span>
      </div>

      <div className="flex flex-1 overflow-hidden bg-gray-50/30">
        
        {/* 2. Left Sidebar (Directory) */}
        <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* Sidebar Search */}
          <div className="p-3 flex items-center gap-2 border-b border-gray-100">
             <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="请输入关键字进行检索" 
                  className="w-full bg-gray-100 border-none rounded pl-8 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-400"
                />
                <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
             </div>
             <button className="bg-blue-600 hover:bg-blue-700 text-white rounded p-1.5 transition-colors shadow-sm">
                <Plus size={16} />
             </button>
          </div>
          
          {/* Directory List */}
          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            {MOCK_DIRECTORIES.map(dir => renderDirectory(dir))}
          </div>
          
        </div>

        {/* 3. Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white m-3 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
           
           {/* Toolbar */}
           <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                 <div className="flex rounded border border-gray-200 overflow-hidden bg-white shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <input 
                        type="text" 
                        placeholder="请输入关键词搜索" 
                        className="px-3 py-1.5 text-sm outline-none text-gray-600 w-64 bg-white placeholder-gray-400"
                    />
                    <button className="bg-gray-50 px-4 text-gray-600 border-l border-gray-200 hover:bg-gray-100 font-medium text-sm transition-colors">
                        搜索
                    </button>
                 </div>
                 <button className="p-2 border border-gray-200 rounded bg-white text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm">
                    <Filter size={16} />
                 </button>
              </div>

              <div className="flex items-center gap-3">
                 <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50 bg-white shadow-sm transition-colors">
                    移除
                 </button>
                 <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50 bg-white shadow-sm transition-colors">
                    更改目录
                 </button>
                 <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50 bg-white shadow-sm transition-colors">
                    批量编辑
                 </button>
                 <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 shadow-sm flex items-center gap-1 transition-colors">
                    <Plus size={14} />
                    新建
                 </button>
              </div>
           </div>

           {/* Table */}
           <div className="flex-1 overflow-auto">
             <table className="w-full text-left border-collapse">
               <thead className="bg-gray-50 sticky top-0 z-10">
                 <tr>
                   <th className="p-4 w-12 border-b border-gray-100">
                      <Checkbox 
                        checked={selectedRows.size === MOCK_INDICATORS.length && MOCK_INDICATORS.length > 0} 
                        indeterminate={selectedRows.size > 0 && selectedRows.size < MOCK_INDICATORS.length}
                        onChange={toggleAll}
                      />
                   </th>
                   <th className="p-4 text-xs font-bold text-gray-500 border-b border-gray-100">指标名称</th>
                   <th className="p-4 text-xs font-bold text-gray-500 border-b border-gray-100">指标展示名</th>
                   <th className="p-4 text-xs font-bold text-gray-500 border-b border-gray-100 w-20">排序</th>
                   <th className="p-4 text-xs font-bold text-gray-500 border-b border-gray-100 w-32">指标类型</th>
                   <th className="p-4 text-xs font-bold text-gray-500 border-b border-gray-100 w-64 text-center">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {MOCK_INDICATORS.map((item) => (
                   <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                     <td className="p-4">
                        <Checkbox 
                           checked={selectedRows.has(item.id)}
                           onChange={() => toggleRow(item.id)}
                        />
                     </td>
                     <td className="p-4 text-sm text-blue-600 font-medium cursor-pointer hover:underline">
                        {item.name}
                     </td>
                     <td className="p-4 text-sm text-gray-500">
                        {item.displayName || '-'}
                     </td>
                     <td className="p-4 text-sm text-gray-600">
                        {item.sort}
                     </td>
                     <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 text-xs rounded border ${
                            item.type === 'composite' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100' 
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                           {item.type === 'composite' ? '复合指标' : '基础指标'}
                        </span>
                     </td>
                     <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3 text-sm">
                           <button 
                             onClick={() => handleEditClick(item)}
                             className="text-blue-600 hover:text-blue-800 hover:underline"
                           >
                             编辑
                           </button>
                           <button className="text-blue-600 hover:text-blue-800 hover:underline">相似指标</button>
                           <button className="text-blue-600 hover:text-blue-800 hover:underline">关联规则</button>
                           <button className="text-red-400 hover:text-red-600 hover:underline">移除</button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             
           </div>

           {/* Pagination */}
           <div className="p-3 border-t border-gray-100 bg-white flex items-center justify-end gap-4 text-xs text-gray-500">
              <span>共 1 页，7 条</span>
              <div className="flex items-center gap-2">
                 <span>每页</span>
                 <select className="border border-gray-200 rounded py-0.5 px-1 bg-white outline-none">
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                 </select>
                 <span>条</span>
              </div>
              
              <div className="flex items-center gap-1">
                 <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled>
                    <ChevronLeft size={14} />
                 </button>
                 <button className="w-6 h-6 flex items-center justify-center rounded bg-blue-600 text-white font-medium shadow-sm">
                    1
                 </button>
                 <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled>
                    <ChevronRight size={14} />
                 </button>
              </div>
           </div>

        </div>
      </div>

      <EditIndicatorModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        indicatorData={editingIndicator}
        onConfirm={handleEditConfirm}
      />
    </div>
  );
};
