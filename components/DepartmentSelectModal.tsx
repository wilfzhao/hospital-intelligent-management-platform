
import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { DEPARTMENTS } from '../constants';
import { Checkbox } from './ui/Checkbox';

interface DepartmentSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
  initialSelection: string[];
  title?: string;
}

const DepartmentSelectModal: React.FC<DepartmentSelectModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialSelection,
  title = "选择科室" 
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelection));
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['d1', 'd2', 'd3']));
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

  const handleSelect = (id: string, childrenIds: string[] = []) => {
    const newSelected = new Set(selectedIds);
    const isSelected = newSelected.has(id);

    if (isSelected) {
      newSelected.delete(id);
      childrenIds.forEach(childId => newSelected.delete(childId));
    } else {
      newSelected.add(id);
      childrenIds.forEach(childId => newSelected.add(childId));
    }
    setSelectedIds(newSelected);
  };

  // Logic to handle Parent/Child checkbox states
  const renderDepartmentTree = () => {
    // Flatten logic for search
    if (searchTerm) {
        let results: { id: string; name: string; path: string }[] = [];
        DEPARTMENTS.forEach(parent => {
            if (parent.children) {
                parent.children.forEach(child => {
                    if (child.name.includes(searchTerm)) {
                        results.push({ id: child.id, name: child.name, path: parent.name });
                    }
                });
            }
        });

        return (
            <div className="space-y-1">
                {results.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center py-4">未找到相关科室</div>
                ) : (
                    results.map(item => (
                        <div key={item.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                            <Checkbox 
                                checked={selectedIds.has(item.id)}
                                onChange={() => handleSelect(item.id)}
                            />
                            <div>
                                <div className="text-sm text-gray-800">{item.name}</div>
                                <div className="text-xs text-gray-400">{item.path}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    }

    // Default Tree View
    return DEPARTMENTS.map(parent => {
      const childIds = parent.children?.map(c => c.id) || [];
      const selectedChildrenCount = childIds.filter(id => selectedIds.has(id)).length;
      const isAllChildrenSelected = childIds.length > 0 && selectedChildrenCount === childIds.length;
      const isIndeterminate = selectedChildrenCount > 0 && selectedChildrenCount < childIds.length;
      const isParentSelected = selectedIds.has(parent.id) || isAllChildrenSelected; // Parent is visually selected if all kids are

      return (
        <div key={parent.id} className="mb-2">
          <div className="flex items-center gap-1 p-1 hover:bg-gray-50 rounded">
            <button onClick={() => toggleExpand(parent.id)} className="text-gray-400 hover:text-gray-600">
               {expandedIds.has(parent.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <Checkbox 
               checked={isParentSelected}
               indeterminate={isIndeterminate}
               onChange={() => handleSelect(parent.id, childIds)}
            />
            <span 
                className="text-sm font-bold text-gray-700 ml-2 cursor-pointer select-none"
                onClick={() => toggleExpand(parent.id)}
            >
                {parent.name}
            </span>
          </div>
          
          {expandedIds.has(parent.id) && parent.children && (
            <div className="pl-8 space-y-1 mt-1">
              {parent.children.map(child => (
                <div key={child.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded">
                  <Checkbox 
                    checked={selectedIds.has(child.id)}
                    onChange={() => handleSelect(child.id)}
                  />
                  <span className="text-sm text-gray-600 cursor-pointer select-none" onClick={() => handleSelect(child.id)}>
                      {child.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-[480px] flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
           <h3 className="font-bold text-gray-800">{title}</h3>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors">
             <X size={18} />
           </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="搜索科室名称..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
        </div>

        {/* Tree Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {renderDepartmentTree()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-between items-center">
            <span className="text-xs text-gray-500">
                已选择 <span className="font-bold text-blue-600">{selectedIds.size}</span> 个科室
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

export default DepartmentSelectModal;
