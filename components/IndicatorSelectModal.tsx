
import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, ChevronRight, ChevronDown, AlertCircle, FileText, ChevronLeft, MoreHorizontal } from 'lucide-react';
import { INDICATORS } from '../constants';
import { Checkbox } from './ui/Checkbox';
import { Indicator } from '../types';

interface IndicatorSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
  initialSelection: string[];
  disabledIds?: string[]; // IDs that cannot be selected
}

const IndicatorSelectModal: React.FC<IndicatorSelectModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialSelection,
  disabledIds = [] 
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelection));
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(new Set(['g1', 'g2', 'g3']));
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // null means '全部指标'
  const [leftSearchTerm, setLeftSearchTerm] = useState('');
  const [rightSearchTerm, setRightSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(initialSelection));
      setSelectedCategoryId(null);
      setLeftSearchTerm('');
      setRightSearchTerm('');
      setCurrentPage(1);
    }
  }, [isOpen, initialSelection]);

  const toggleCategoryExpand = (id: string) => {
    const newExpanded = new Set(expandedCategoryIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategoryIds(newExpanded);
  };

  // Helper to get all leaf nodes (actual indicators)
  const getLeafNodes = (nodes: Indicator[]): Indicator[] => {
    let leaves: Indicator[] = [];
    nodes.forEach(node => {
      if (!node.children || node.children.length === 0) {
        leaves.push(node);
      } else {
        leaves = leaves.concat(getLeafNodes(node.children));
      }
    });
    return leaves;
  };

  // Helper to find a category node by ID
  const findCategoryNode = (nodes: Indicator[], id: string): Indicator | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findCategoryNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Get all indicators to display in the right pane
  const displayedIndicators = useMemo(() => {
    let sourceNodes = INDICATORS;
    if (selectedCategoryId) {
      const categoryNode = findCategoryNode(INDICATORS, selectedCategoryId);
      sourceNodes = categoryNode ? [categoryNode] : [];
    }
    
    let leaves = getLeafNodes(sourceNodes);
    
    if (rightSearchTerm) {
      leaves = leaves.filter(leaf => leaf.name.toLowerCase().includes(rightSearchTerm.toLowerCase()));
    }
    
    return leaves;
  }, [selectedCategoryId, rightSearchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(displayedIndicators.length / pageSize);
  const paginatedIndicators = displayedIndicators.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Helper to get all indicator objects for selected IDs (for the top selected area)
  const selectedIndicatorObjects = useMemo(() => {
    const allLeaves = getLeafNodes(INDICATORS);
    return allLeaves.filter(leaf => selectedIds.has(leaf.id));
  }, [selectedIds]);

  const handleSelectIndicator = (id: string) => {
    if (disabledIds.includes(id)) return;
    
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAllCurrentPage = () => {
    const newSelected = new Set(selectedIds);
    const selectableOnPage = paginatedIndicators.filter(ind => !disabledIds.includes(ind.id));
    
    const allSelectedOnPage = selectableOnPage.every(ind => newSelected.has(ind.id));
    
    if (allSelectedOnPage) {
      // Deselect all on page
      selectableOnPage.forEach(ind => newSelected.delete(ind.id));
    } else {
      // Select all on page
      selectableOnPage.forEach(ind => newSelected.add(ind.id));
    }
    setSelectedIds(newSelected);
  };

  const removeSelected = (id: string) => {
    const newSelected = new Set(selectedIds);
    newSelected.delete(id);
    setSelectedIds(newSelected);
  };

  // Render Left Category Tree (only nodes with children)
  const renderCategoryTree = (nodes: Indicator[], level = 0) => {
    return nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      if (!hasChildren) return null; // Only show categories in the left tree

      // Filter logic for left tree
      if (leftSearchTerm && !node.name.toLowerCase().includes(leftSearchTerm.toLowerCase())) {
         const match = JSON.stringify(node).toLowerCase().includes(leftSearchTerm.toLowerCase()); 
         if (!match) return null;
      }

      const isExpanded = expandedCategoryIds.has(node.id) || !!leftSearchTerm;
      const isSelected = selectedCategoryId === node.id;

      // Check if this category only contains leaf nodes (it's a bottom-level category)
      const isBottomCategory = node.children?.every(child => !child.children || child.children.length === 0);

      return (
        <div key={node.id}>
          <div 
            className={`flex items-center gap-1.5 py-2 pr-3 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
            onClick={() => setSelectedCategoryId(node.id)}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); toggleCategoryExpand(node.id); }}
              className={`text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center ${isBottomCategory ? 'invisible' : ''}`}
            >
               {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            {isBottomCategory && <FileText size={14} className={isSelected ? 'text-blue-500' : 'text-gray-400'} />}
            
            <span className="text-sm truncate flex-1 select-none">
                {node.name}
            </span>
          </div>
          
          {isExpanded && (
            <div>
              {renderCategoryTree(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white shadow-xl w-[1000px] h-full flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
           <h3 className="text-lg font-bold text-gray-800">选择指标</h3>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors">
             <X size={20} />
           </button>
        </div>

        {/* Selected Indicators Area */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-2 min-h-[80px] max-h-[120px] overflow-y-auto custom-scrollbar">
            <div className="text-sm text-gray-700 font-medium">已选指标：</div>
            <div className="flex flex-wrap gap-2">
                {selectedIndicatorObjects.length === 0 ? (
                    <span className="text-sm text-gray-400">暂无选择</span>
                ) : (
                    selectedIndicatorObjects.map(ind => (
                        <div key={ind.id} className="flex items-center gap-1.5 bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded text-sm shadow-sm">
                            <span>{ind.name}</span>
                            <button 
                                onClick={() => removeSelected(ind.id)}
                                className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded p-0.5 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Main Content: Two Panes */}
        <div className="flex-1 flex overflow-hidden">
            {/* Left Pane: Categories */}
            <div className="w-[280px] border-r border-gray-100 flex flex-col bg-white">
                <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="请输入关键字进行检索" 
                            value={leftSearchTerm}
                            onChange={(e) => setLeftSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <Search size={14} className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    <div 
                        className={`py-2 px-3 rounded-md cursor-pointer text-sm transition-colors mb-1 ${selectedCategoryId === null ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setSelectedCategoryId(null)}
                    >
                        全部指标
                    </div>
                    {renderCategoryTree(INDICATORS)}
                </div>
            </div>

            {/* Right Pane: Indicators Table */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-72">
                        <input 
                            type="text" 
                            placeholder="请输入关键字进行检索" 
                            value={rightSearchTerm}
                            onChange={(e) => {
                                setRightSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset page on search
                            }}
                            className="w-full bg-white border border-gray-200 rounded pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <Search size={14} className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                    {disabledIds.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-orange-500 bg-orange-50 px-2.5 py-1.5 rounded">
                            <AlertCircle size={12} />
                            <span>部分指标已关联，不可选</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 border-b border-gray-100 w-12 text-center">
                                    <Checkbox 
                                        checked={paginatedIndicators.length > 0 && paginatedIndicators.filter(i => !disabledIds.includes(i.id)).every(i => selectedIds.has(i.id))}
                                        indeterminate={
                                            paginatedIndicators.some(i => selectedIds.has(i.id)) && 
                                            !paginatedIndicators.filter(i => !disabledIds.includes(i.id)).every(i => selectedIds.has(i.id))
                                        }
                                        onChange={handleSelectAllCurrentPage}
                                        disabled={paginatedIndicators.filter(i => !disabledIds.includes(i.id)).length === 0}
                                    />
                                </th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600 border-b border-gray-100">指标名称</th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600 border-b border-gray-100 w-48">指标编码</th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600 border-b border-gray-100 w-32">指标类型</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedIndicators.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                                        未找到相关指标
                                    </td>
                                </tr>
                            ) : (
                                paginatedIndicators.map(ind => {
                                    const isDisabled = disabledIds.includes(ind.id);
                                    const isSelected = selectedIds.has(ind.id);
                                    // Mock code and type based on name for visual fidelity
                                    const mockCode = `L201${Math.floor(Math.random() * 100000000000000)}`;
                                    const mockType = ind.name.includes('复合') ? '复合指标' : '基础指标';
                                    
                                    return (
                                        <tr 
                                            key={ind.id} 
                                            className={`hover:bg-blue-50/30 transition-colors ${isDisabled ? 'bg-gray-50/50 opacity-60' : 'cursor-pointer'}`}
                                            onClick={() => !isDisabled && handleSelectIndicator(ind.id)}
                                        >
                                            <td className="px-4 py-3 text-center">
                                                <Checkbox 
                                                    checked={isSelected}
                                                    onChange={() => !isDisabled && handleSelectIndicator(ind.id)}
                                                    disabled={isDisabled}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-blue-600 hover:text-blue-800">
                                                {ind.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                                                {mockCode}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 ${mockType === '复合指标' ? 'bg-blue-50 text-blue-600' : ''}`}>
                                                    {mockType}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-3 border-t border-gray-100 flex items-center justify-end gap-4 text-sm text-gray-600 bg-white">
                    <span>共 {totalPages} 页，{displayedIndicators.length} 条</span>
                    <div className="flex items-center gap-2">
                        <span>每页</span>
                        <select className="border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-500">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span>条</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        
                        {/* Simple pagination numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button 
                                    key={pageNum}
                                    className={`w-7 h-7 rounded flex items-center justify-center text-sm ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {totalPages > 5 && <MoreHorizontal size={16} className="text-gray-400 mx-1" />}
                        
                        <button 
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end items-center shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-medium transition-all"
                >
                    取消
                </button>
                <button 
                    onClick={() => onConfirm(Array.from(selectedIds))}
                    className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 shadow-sm hover:shadow transition-all"
                >
                    确认
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorSelectModal;
