
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ChevronDown } from 'lucide-react';
import { Toggle } from './ui/Toggle';
import { Checkbox } from './ui/Checkbox';

interface EditIndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicatorData: any; // Using any for flexibility with mock data
  onConfirm: (data: any) => void;
}

const MOCK_DB_TABLES = [
  { value: 'DW_PATIENT_BASE', label: 'DW_PATIENT_BASE (患者基础信息表)' },
  { value: 'DW_ORDER_ITEM', label: 'DW_ORDER_ITEM (医嘱明细表)' },
  { value: 'ODS_EMR_RECORD', label: 'ODS_EMR_RECORD (电子病历记录表)' },
  { value: 'DW_OPERATION_MASTER', label: 'DW_OPERATION_MASTER (手术主表)' },
  { value: 'DW_LAB_RESULT', label: 'DW_LAB_RESULT (检验结果表)' },
];

export const EditIndicatorModal: React.FC<EditIndicatorModalProps> = ({
  isOpen,
  onClose,
  indicatorData,
  onConfirm
}) => {
  // Form State
  const [displayName, setDisplayName] = useState('');
  const [sort, setSort] = useState(0);
  const [weight, setWeight] = useState<number | ''>('');
  
  const [showPC, setShowPC] = useState(true);
  const [showMobile, setShowMobile] = useState(false);
  
  const [isKeyMonitor, setIsKeyMonitor] = useState(false);
  
  // Dimensions (mock)
  const [dimensions, setDimensions] = useState<string[]>([]);
  
  // Associated Indicators
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  
  // Details
  const [numeratorDetail, setNumeratorDetail] = useState('');
  const [denominatorDetail, setDenominatorDetail] = useState('');
  
  // Toggles
  const [isDiff, setIsDiff] = useState(true); // 差集 default on in screenshot? Looks like on (blue)
  const [customDiffTable, setCustomDiffTable] = useState(''); // New State for Custom Diff Table
  const [isSummary, setIsSummary] = useState(true); // 指标汇总 default on
  
  const [spoType, setSpoType] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'unverified'>('unverified');

  useEffect(() => {
    if (isOpen && indicatorData) {
       // Initialize with data or defaults
       setDisplayName(indicatorData.displayName || '');
       setSort(indicatorData.sort || 0);
       // Reset other fields to defaults or mock values since they aren't in the list view
       setWeight('');
       setShowPC(true);
       setShowMobile(false);
       setIsKeyMonitor(false);
       setNumerator('指标权限测试（基础指标手动采集一）'); // Mock default from screenshot
       setDenominator('指标权限测试（基础指标手动采集二）'); // Mock default
       setIsDiff(true);
       setCustomDiffTable('');
       setIsSummary(true);
       setVerificationStatus('unverified');
    }
  }, [isOpen, indicatorData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-lg shadow-2xl w-[800px] max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
        
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white z-10">
           <h2 className="text-lg font-bold text-gray-800">编辑</h2>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
             <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-2 gap-x-12 gap-y-8">
           {/* Row 1 */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">指标名称：</label>
              <input 
                type="text" 
                value={indicatorData?.name || ''} 
                disabled 
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">指标展示名称：</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="请输入指标展示名称"
                className="w-full bg-white border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-400"
              />
           </div>

           {/* Row 2: Sort & Weight */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">排序：</label>
              <div className="flex border border-gray-200 rounded overflow-hidden">
                 <button 
                   onClick={() => setSort(prev => prev - 1)}
                   className="w-10 flex items-center justify-center bg-gray-50 border-r border-gray-200 hover:bg-gray-100 text-gray-600 active:bg-gray-200"
                 >
                   <Minus size={14} />
                 </button>
                 <input 
                   type="number" 
                   value={sort}
                   onChange={(e) => setSort(Number(e.target.value))}
                   className="flex-1 text-center text-sm outline-none appearance-none py-2.5"
                 />
                 <button 
                   onClick={() => setSort(prev => prev + 1)}
                   className="w-10 flex items-center justify-center bg-gray-50 border-l border-gray-200 hover:bg-gray-100 text-gray-600 active:bg-gray-200"
                 >
                   <Plus size={14} />
                 </button>
              </div>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">指标权重：</label>
              <div className="flex border border-gray-200 rounded overflow-hidden">
                 <button className="w-10 flex items-center justify-center bg-gray-50 border-r border-gray-200 hover:bg-gray-100 text-gray-600 active:bg-gray-200">
                   <Minus size={14} />
                 </button>
                 <input 
                   type="text" 
                   value={weight}
                   onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                   placeholder="请输入指标权重"
                   className="flex-1 text-center text-sm outline-none py-2.5 placeholder-gray-400"
                 />
                 <button className="w-10 flex items-center justify-center bg-gray-50 border-l border-gray-200 hover:bg-gray-100 text-gray-600 active:bg-gray-200">
                   <Plus size={14} />
                 </button>
              </div>
           </div>

           {/* Row 3: Display Type & Key Monitor */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">显示类型：</label>
              <div className="flex items-center gap-6 mt-3">
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox checked={showPC} onChange={() => setShowPC(!showPC)} />
                    <span className="text-sm text-gray-700">PC端</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox checked={showMobile} onChange={() => setShowMobile(!showMobile)} />
                    <span className="text-sm text-gray-700">移动端</span>
                 </label>
              </div>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">重点监测：</label>
              <div className="mt-2">
                <Toggle checked={isKeyMonitor} onChange={setIsKeyMonitor} />
              </div>
           </div>

           {/* Row 4: Analysis Dimension */}
           <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">分析维度：</label>
              <button className="flex items-center gap-1 px-4 py-2.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white w-32 justify-center mt-1">
                 <Plus size={14} />
                 选择
              </button>
           </div>

           {/* Row 5: Associated Indicators */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>关联分子指标：
              </label>
              <div className="relative">
                <select 
                  value={numerator} 
                  onChange={(e) => setNumerator(e.target.value)}
                  className="w-full appearance-none border border-gray-200 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
                >
                   <option>指标权限测试（基础指标手动采集一）</option>
                   <option>指标权限测试（基础指标手动采集二）</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <ChevronDown size={14} />
                </div>
              </div>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>关联分母指标：
              </label>
              <div className="relative">
                <select 
                  value={denominator} 
                  onChange={(e) => setDenominator(e.target.value)}
                  className="w-full appearance-none border border-gray-200 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
                >
                   <option>指标权限测试（基础指标手动采集二）</option>
                   <option>指标权限测试（基础指标手动采集一）</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <ChevronDown size={14} />
                </div>
              </div>
           </div>

           {/* Row 6: Details */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">分子展示明细：</label>
              <div className="relative">
                <select 
                   className="w-full appearance-none border border-gray-200 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-400"
                   value={numeratorDetail}
                   onChange={(e) => setNumeratorDetail(e.target.value)}
                >
                   <option value="" disabled selected>选择分子展示明细字段</option>
                   <option value="field1">字段1</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <ChevronDown size={14} />
                </div>
              </div>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">分母展示明细：</label>
              <div className="relative">
                <select 
                   className="w-full appearance-none border border-gray-200 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-400"
                   value={denominatorDetail}
                   onChange={(e) => setDenominatorDetail(e.target.value)}
                >
                   <option value="" disabled selected>选择分母展示明细字段</option>
                   <option value="field1">字段1</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <ChevronDown size={14} />
                </div>
              </div>
           </div>

           {/* Row 7: Summary & Diff */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">指标汇总信息：</label>
              <div className="mt-2">
                 <Toggle checked={isSummary} onChange={setIsSummary} />
              </div>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">差集：</label>
              <div className="mt-2">
                 <Toggle checked={isDiff} onChange={setIsDiff} />
              </div>
           </div>

           {/* Row 8: SPO & Custom Diff */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SPO分类：</label>
              <div className="relative">
                <select 
                   className="w-full appearance-none border border-gray-200 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-400"
                   value={spoType}
                   onChange={(e) => setSpoType(e.target.value)}
                >
                   <option value="" disabled>请选择SPO分类</option>
                   <option value="structure">结构 (Structure)</option>
                   <option value="process">过程 (Process)</option>
                   <option value="outcome">结果 (Outcome)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <ChevronDown size={14} />
                </div>
              </div>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">自定义差集：</label>
              <div className="relative">
                <select 
                   className="w-full appearance-none border border-gray-200 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
                   value={customDiffTable}
                   onChange={(e) => setCustomDiffTable(e.target.value)}
                   disabled={!isDiff} // Optional UX enhancement
                >
                   <option value="" disabled>请选择自定义差集数据表</option>
                   {MOCK_DB_TABLES.map(table => (
                     <option key={table.value} value={table.value}>{table.label}</option>
                   ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <ChevronDown size={14} />
                </div>
              </div>
           </div>
           
           {/* Row 9: Verification */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">是否已核对：</label>
              <div className="flex items-center gap-6 mt-3">
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="radio" 
                      name="verification" 
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked={verificationStatus === 'verified'}
                      onChange={() => setVerificationStatus('verified')}
                    />
                    <span className="text-sm text-gray-700">已核对</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="radio" 
                      name="verification" 
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked={verificationStatus === 'unverified'}
                      onChange={() => setVerificationStatus('unverified')}
                    />
                    <span className="text-sm text-gray-700">未核对</span>
                 </label>
              </div>
           </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-center gap-4 z-10">
           <button 
             onClick={onClose}
             className="w-32 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors font-medium"
           >
             取 消
           </button>
           <button 
             onClick={() => onConfirm({})}
             className="w-32 py-2.5 bg-blue-600 rounded text-sm text-white hover:bg-blue-700 shadow-sm transition-colors font-medium"
           >
             确 定
           </button>
        </div>

      </div>
    </div>
  );
};
