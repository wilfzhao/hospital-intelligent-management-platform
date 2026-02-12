
import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, ChevronDown, AlertCircle } from 'lucide-react';
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['g1', 'g2', 'g3']));
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(initialSelection));
    }
  }, [isOpen, initialSelection]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const getAllChildIds = (node: Indicator): string[] => {
    let ids: string[] = [];
    if (node.children) {
      node.children.forEach(child => {
        ids.push(child.id);
        ids = ids.concat(getAllChildIds(child));
      });
    }
    return ids;
  };

  const handleSelect = (node: Indicator) => {
    // If the node itself is disabled, do nothing (though UI should prevent this)
    if (disabledIds.includes(node.id)) return;

    const newSelected = new Set(selectedIds);
    const childIds = getAllChildIds(node);
    
    // Filter out disabled children from being toggled
    const allIdsToToggle = [node.id, ...childIds].filter(id => !disabledIds.includes(id));
    
    if (allIdsToToggle.length === 0) return;

    // Check if current node is selected
    const isSelected = newSelected.has(node.id);

    if (isSelected) {
      // Deselect
      allIdsToToggle.forEach(id => newSelected.delete(id));
    } else {
      // Select
      allIdsToToggle.forEach(id => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  const renderTree = (nodes: Indicator[], level = 0) => {
    return nodes.map(node => {
      // Filter logic if searching
      if (searchTerm && !node.name.includes(searchTerm) && (!node.children || node.children.length === 0)) {
         const match = JSON.stringify(node).includes(searchTerm); 
         if (!match) return null;
      }

      const hasChildren = node.children && node.children.length > 0;
      const childIds = getAllChildIds(node);
      
      // Filter out disabled children for logic count
      const enabledChildIds = childIds.filter(id => !disabledIds.includes(id));
      
      const selectedChildrenCount = enabledChildIds.filter(id => selectedIds.has(id)).length;
      const isAllChildrenSelected = enabledChildIds.length > 0 && selectedChildrenCount === enabledChildIds.length;
      const isIndeterminate = selectedChildrenCount > 0 && selectedChildrenCount < enabledChildIds.length;
      const isSelected = selectedIds.has(node.id);
      
      const isDisabled = disabledIds.includes(node.id);

      // Visual state: Checked if self is checked OR all children checked (for parent nodes)
      const displayChecked = isSelected || (hasChildren && isAllChildrenSelected && enabledChildIds.length > 0);
      const displayIndeterminate = isIndeterminate && !displayChecked;

      return (
        <div key={node.id} className="mb-1">
          <div 
            className={`flex items-center gap-1 p-1.5 rounded transition-colors ${isDisabled ? 'bg-gray-50 opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
              className={`text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center ${!hasChildren && 'invisible'}`}
            >
               {expandedIds.has(node.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            <Checkbox 
               checked={displayChecked}
               indeterminate={displayIndeterminate}
               onChange={() => !isDisabled && handleSelect(node)}
               disabled={isDisabled}
            />
            <span 
                className={`text-sm ml-2 truncate flex-1 select-none ${isDisabled ? 'text-gray-400' : 'text-gray-700 cursor-pointer'}`}
                onClick={() => !isDisabled && handleSelect(node)}
            >
                {node.name}
                {isDisabled && <span className="text-xs text-orange-400 ml-2">(已关联)</span>}
            </span>
          </div>
          
          {hasChildren && expandedIds.has(node.id) && (
            <div>
              {renderTree(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-[600px] flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
           <h3 className="font-bold text-gray-800">选择指标</h3>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors">
             <X size={18} />
           </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="搜索指标名称..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            {disabledIds.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-500 bg-orange-50 px-2 py-1.5 rounded">
                    <AlertCircle size={12} />
                    <span>部分指标已在其他维度中被关联，不可重复选择</span>
                </div>
            )}
        </div>

        {/* Tree Content */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {renderTree(INDICATORS)}
            {searchTerm && renderTree(INDICATORS).every(i => i === null) && (
               <div className="text-center py-8 text-gray-400 text-sm">未找到相关指标</div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-between items-center">
            <span className="text-xs text-gray-500">
                已选择 <span className="font-bold text-blue-600">{selectedIds.size}</span> 个指标
            </span>
            <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                    取消
                </button>
                <button 
                    onClick={() => onConfirm(Array.from(selectedIds))}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
                >
                    确定
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorSelectModal;
