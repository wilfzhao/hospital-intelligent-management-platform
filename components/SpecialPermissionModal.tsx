
import React, { useState, useEffect } from 'react';
import { X, Check, Building, Users, Settings } from 'lucide-react';
import { SpecialPermission } from '../types';
import DepartmentSelectModal from './DepartmentSelectModal';
import IndicatorSelectModal from './IndicatorSelectModal';
import { INDICATORS } from '../constants';

interface SpecialPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permission: SpecialPermission) => void;
  initialData?: SpecialPermission;
}

const SpecialPermissionModal: React.FC<SpecialPermissionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialData
}) => {
  const [scope, setScope] = useState<'hospital' | 'department' | 'custom'>('department');
  const [targetIndicatorIds, setTargetIndicatorIds] = useState<string[]>([]);
  const [customDeptIds, setCustomDeptIds] = useState<string[]>([]);

  // Modals state
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setScope(initialData.scope);
        setTargetIndicatorIds(initialData.targetIndicatorIds);
        setCustomDeptIds(initialData.customDeptIds || []);
      } else {
        // Reset defaults for new
        setScope('hospital'); // Default to something distinctive
        setTargetIndicatorIds([]);
        setCustomDeptIds([]);
      }
    }
  }, [isOpen, initialData]);

  const handleConfirm = () => {
    if (targetIndicatorIds.length === 0) {
      // Could show error toast here
      alert('请至少选择一个目标指标');
      return;
    }
    if (scope === 'custom' && customDeptIds.length === 0) {
      alert('请选择自定义科室');
      return;
    }

    onConfirm({
      id: initialData?.id || Date.now().toString(),
      scope,
      targetIndicatorIds,
      customDeptIds: scope === 'custom' ? customDeptIds : undefined
    });
    onClose();
  };

  // Helper to count names for display
  const getIndicatorNames = () => {
    // Flatten logic just to find names (simple search)
    const findName = (nodes: any[], id: string): string | null => {
      for (const node of nodes) {
        if (node.id === id) return node.name;
        if (node.children) {
          const res = findName(node.children, id);
          if (res) return res;
        }
      }
      return null;
    };
    
    return targetIndicatorIds.map(id => findName(INDICATORS, id)).filter(Boolean).join(', ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-[600px] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
           <h3 className="font-bold text-gray-800 text-lg">
             {initialData ? '编辑特殊数据权限' : '添加特殊数据权限'}
           </h3>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors">
             <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
          
          {/* 1. Select Indicators */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              <span className="text-red-500 mr-1">*</span>应用指标范围
            </label>
            <div 
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-blue-50/30 hover:border-blue-200 cursor-pointer transition-all group"
              onClick={() => setIsIndicatorModalOpen(true)}
            >
               {targetIndicatorIds.length > 0 ? (
                 <div>
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-sm font-bold text-blue-700">已选择 {targetIndicatorIds.length} 个指标</span>
                   </div>
                   <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                     {getIndicatorNames()}
                   </p>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-2 text-gray-400 gap-2">
                   <Settings size={24} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                   <span className="text-sm">点击选择需应用此特殊规则的指标</span>
                 </div>
               )}
            </div>
          </div>

          {/* 2. Select Scope */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              <span className="text-red-500 mr-1">*</span>数据权限范围
            </label>
            <div className="grid grid-cols-3 gap-4">
               {/* Option 1: Hospital */}
               <label className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-3 transition-all relative ${scope === 'hospital' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input type="radio" name="scope" className="hidden" checked={scope === 'hospital'} onChange={() => setScope('hospital')} />
                  <div className={`p-2 rounded-full ${scope === 'hospital' ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    <Building size={20} />
                  </div>
                  <div className="text-center">
                    <span className={`block text-sm font-bold ${scope === 'hospital' ? 'text-blue-700' : 'text-gray-700'}`}>全院数据</span>
                    <span className="text-xs text-gray-400 mt-1">查看全院所有数据</span>
                  </div>
                  {scope === 'hospital' && <div className="absolute top-2 right-2 text-blue-600"><Check size={16} /></div>}
               </label>

               {/* Option 2: Department */}
               <label className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-3 transition-all relative ${scope === 'department' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input type="radio" name="scope" className="hidden" checked={scope === 'department'} onChange={() => setScope('department')} />
                  <div className={`p-2 rounded-full ${scope === 'department' ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    <Users size={20} />
                  </div>
                  <div className="text-center">
                    <span className={`block text-sm font-bold ${scope === 'department' ? 'text-blue-700' : 'text-gray-700'}`}>本人/本科室</span>
                    <span className="text-xs text-gray-400 mt-1">仅限所属科室数据</span>
                  </div>
                  {scope === 'department' && <div className="absolute top-2 right-2 text-blue-600"><Check size={16} /></div>}
               </label>

               {/* Option 3: Custom */}
               <label className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-3 transition-all relative ${scope === 'custom' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input type="radio" name="scope" className="hidden" checked={scope === 'custom'} onChange={() => setScope('custom')} />
                  <div className={`p-2 rounded-full ${scope === 'custom' ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    <Settings size={20} />
                  </div>
                  <div className="text-center">
                    <span className={`block text-sm font-bold ${scope === 'custom' ? 'text-blue-700' : 'text-gray-700'}`}>自定义范围</span>
                    <span className="text-xs text-gray-400 mt-1">指定特定科室</span>
                  </div>
                  {scope === 'custom' && <div className="absolute top-2 right-2 text-blue-600"><Check size={16} /></div>}
               </label>
            </div>

            {/* Custom Dept Selector */}
            {scope === 'custom' && (
               <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                 <div 
                   className="border border-dashed border-blue-300 bg-blue-50/50 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors"
                   onClick={() => setIsDeptModalOpen(true)}
                 >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-blue-800">选择可见科室</span>
                      <span className="text-xs text-blue-600/70">
                        {customDeptIds.length > 0 ? `已选择 ${customDeptIds.length} 个科室` : '点击配置科室列表'}
                      </span>
                    </div>
                    <Settings size={16} className="text-blue-500" />
                 </div>
               </div>
            )}
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-end gap-3">
             <button 
                onClick={onClose}
                className="px-6 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
             >
                取消
             </button>
             <button 
                onClick={handleConfirm}
                className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
             >
                保存配置
             </button>
        </div>

        {/* Child Modals */}
        <IndicatorSelectModal 
           isOpen={isIndicatorModalOpen}
           onClose={() => setIsIndicatorModalOpen(false)}
           onConfirm={(ids) => { setTargetIndicatorIds(ids); setIsIndicatorModalOpen(false); }}
           initialSelection={targetIndicatorIds}
        />
        
        <DepartmentSelectModal 
           isOpen={isDeptModalOpen}
           onClose={() => setIsDeptModalOpen(false)}
           onConfirm={(ids) => { setCustomDeptIds(ids); setIsDeptModalOpen(false); }}
           initialSelection={customDeptIds}
           title="选择自定义可见科室"
        />

      </div>
    </div>
  );
};

export default SpecialPermissionModal;
