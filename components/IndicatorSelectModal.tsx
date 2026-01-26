
import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { INDICATORS } from '../constants';
import { Checkbox } from './ui/Checkbox';
import { Indicator } from '../types';

interface IndicatorSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
  initialSelection: string[];
}

const IndicatorSelectModal: React.FC<IndicatorSelectModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialSelection 
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
    const newSelected = new Set(selectedIds);
    const childIds = getAllChildIds(node);
    const allIdsToToggle = [node.id, ...childIds];
    
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
         // Simple filter: if name matches or children match. 
         // For complexity, let's just do simple filtering or show all if search is empty
         // Ideally tree search requires rebuilding tree structure.
         // Here we'll stick to full tree render for simplicity or basic filtering.
         const match = JSON.stringify(node).includes(searchTerm); 
         if (!match) return null;
      }

      const hasChildren = node.children && node.children.length > 0;
      const childIds = getAllChildIds(node);
      
      const selectedChildrenCount = childIds.filter(id => selectedIds.has(id)).length;
      const isAllChildrenSelected = childIds.length > 0 && selectedChildrenCount === childIds.length;
      const isIndeterminate = selectedChildrenCount > 0 && selectedChildrenCount < childIds.length;
      const isSelected = selectedIds.has(node.id);

      // Visual state: Checked if self is checked OR all children checked (for parent nodes)
      // Note: In strict tree selection, usually parent check implies all children check.
      const displayChecked = isSelected || (hasChildren && isAllChildrenSelected);
      const displayIndeterminate = isIndeterminate && !displayChecked;

      return (
        <div key={node.id} className="mb-1">
          <div 
            className="flex items-center gap-1 p-1.5 hover:bg-gray-50 rounded transition-colors"
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
               onChange={() => handleSelect(node)}
            />
            <span 
                className="text-sm text-gray-700 ml-2 cursor-pointer select-none truncate flex-1"
                onClick={() => handleSelect(node)}
            >
                {node.name}
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
      <div className="bg-white rounded-lg shadow-xl w-[500px] flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
           <h3 className="font-bold text-gray-800">选择指标</h3>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors">
             <X size={18} />
           </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
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
        </div>

        {/* Tree Content */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {renderTree(INDICATORS)}
            {/* Empty state for search */}
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
