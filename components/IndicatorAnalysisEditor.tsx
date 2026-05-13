import React, { useState } from 'react';
import { 
  Save, 
  Table as TableIcon, 
  BarChart3, 
  LineChart, 
  Layout,
  Package,
  Plus,
  Check,
  Search,
  Move, 
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Type,
  Hash
} from 'lucide-react';
import AnalysisTableWidget from './AnalysisTableWidget';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  type: 'string' | 'number' | 'date';
}

const MOCK_EXISTING_COMPONENTS = [
  { id: 'comp-1', title: '门急诊人次月度汇总表', type: 'table', author: '张医生', time: '2024-03-20' },
  { id: 'comp-2', title: '手术室利用率效能表', type: 'table', author: '李科长', time: '2024-03-21' },
  { id: 'comp-3', title: '科室满意度排行报表', type: 'table', author: '王主任', time: '2024-03-21' },
  { id: 'comp-4', title: '全院平均住院日分析', type: 'bar', author: '张医生', time: '2024-03-22' },
  { id: 'comp-5', title: '财务收入构成趋势图', type: 'line', author: '刘会计', time: '2024-03-23' },
];

interface EditorProps {
  onBack: () => void;
  onSave: (name: string) => void;
}

type ComponentType = 'table' | 'bar' | 'line' | 'component';

interface CanvasComponent {
  id: string;
  type: ComponentType;
  title: string;
  isConfiguring?: boolean;
}

export default function IndicatorAnalysisEditor({ onBack, onSave }: EditorProps) {
  const [canvasItems, setCanvasItems] = useState<CanvasComponent[]>([]);
  const [systemTitle, setSystemTitle] = useState('新增指标分析体系');
  const [showComponentPicker, setShowComponentPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  // Global Filter states
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [matchMode, setMatchMode] = useState<'all' | 'any'>('all');
  const [filters, setFilters] = useState<FilterCondition[]>([
    { id: '1', field: 'Basket total', operator: 'is', value: '', type: 'number' },
    { id: '2', field: 'Item id', operator: 'is', value: '', type: 'string' },
    { id: '3', field: 'Currency', operator: 'is', value: '', type: 'string' }
  ]);

  const addFilter = () => {
    setFilters([...filters, { id: Date.now().toString(), field: 'New field', operator: 'is', value: '', type: 'string' }]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const clearAllFilters = () => {
    setFilters([]);
  };

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    setFilters(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSave = () => {
    if (!systemTitle.trim()) {
      alert('请输入体系名称');
      return;
    }
    onSave(systemTitle);
  };

  const updateComponentTitle = (id: string, newTitle: string) => {
    setCanvasItems(canvasItems.map(item => 
      item.id === id ? { ...item, title: newTitle } : item
    ));
  };

  const setComponentConfiguring = (id: string, isConfiguring: boolean) => {
    setCanvasItems(canvasItems.map(item => 
      item.id === id ? { ...item, isConfiguring } : item
    ));
  };

  const addComponent = (type: ComponentType) => {
    const titles = {
      table: '指标表格',
      bar: '柱状图分析',
      line: '折线图趋势',
      component: '分析组件'
    };
    if (type === 'component') {
      setShowComponentPicker(true);
      setTempSelectedIds([]);
      return;
    }
    setCanvasItems([...canvasItems, { id: Date.now().toString(), type, title: titles[type], isConfiguring: true }]);
  };

  const handleConfirmAddComponents = () => {
    const newItems: CanvasComponent[] = tempSelectedIds.map(id => {
      const comp = MOCK_EXISTING_COMPONENTS.find(c => c.id === id);
      return {
        id: `existing-${Date.now()}-${id}`,
        type: (comp?.type as ComponentType) || 'table',
        title: comp?.title || '分析组件',
        isConfiguring: false
      };
    });
    setCanvasItems([...canvasItems, ...newItems]);
    setShowComponentPicker(false);
    setTempSelectedIds([]);
  };

  const toggleTempSelection = (id: string) => {
    setTempSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const removeComponent = (id: string) => {
    setCanvasItems(canvasItems.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f8fafc] font-sans absolute inset-0 z-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0 shadow-sm relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-sm">
            <Layout size={18} />
          </div>
          <input 
            type="text"
            value={systemTitle}
            onChange={(e) => setSystemTitle(e.target.value)}
            className="text-lg font-semibold text-slate-800 tracking-tight bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none px-1 py-0.5 transition-colors w-64"
            placeholder="输入体系名称"
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <Save size={16} />
            保存
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        
        {/* Toolbar */}
        <div className="flex-none py-3 px-8 flex justify-start border-b border-slate-200 bg-white shadow-sm z-20 relative">
          <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl">
            <button 
              onClick={() => addComponent('table')} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all group"
            >
              <TableIcon size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              指标表格
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <button 
              onClick={() => addComponent('component')} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all group"
            >
              <Package size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              分析组件
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          className="flex-1 overflow-auto p-8 custom-scrollbar bg-white relative"
          style={{ 
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
            backgroundSize: '24px 24px',
            backgroundPosition: '-11px -11px'
          }}
        >
          <div className="max-w-6xl mx-auto min-h-full w-full relative">
            
            {/* Global Filters Section */}
            <div className="mb-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <button 
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                id="global-filters-toggle"
              >
                <div className="flex items-center gap-2">
                  {isFiltersExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  <span>全局筛选配置</span>
                  <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium uppercase tracking-wider">Global Filters</span>
                </div>
                {filters.length > 0 && !isFiltersExpanded && (
                  <span className="text-xs font-normal text-slate-400">已配置 {filters.length} 个条件</span>
                )}
              </button>

              {isFiltersExpanded && (
                <div className="p-6 border-t border-slate-100 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      <select 
                        value={matchMode}
                        onChange={(e) => setMatchMode(e.target.value as 'all' | 'any')}
                        className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-100"
                      >
                        <option value="all">All</option>
                        <option value="any">Any</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <span className="text-sm text-slate-400">of the following conditions match:</span>
                  </div>

                  <div className="relative pl-6 space-y-4">
                    {/* Vertical Line Connector */}
                    <div className="absolute left-[11px] top-0 bottom-0 w-px bg-slate-200" />
                    
                    {filters.map((filter) => (
                      <div key={filter.id} className="relative flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
                        {/* Horizontal Connector Hook */}
                        <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-[14px] h-px bg-slate-200" />
                        
                        {/* Field Selector */}
                        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all group shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                          {filter.type === 'number' ? (
                            <Hash size={18} className="text-blue-500 shrink-0" />
                          ) : (
                            <Type size={18} className="text-blue-500 shrink-0" />
                          )}
                          <input 
                            type="text" 
                            value={filter.field}
                            onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                            className="bg-transparent text-sm font-bold text-slate-700 outline-none w-full"
                          />
                          <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                        </div>

                        {/* Operator Selector */}
                        <div className="w-40 flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all group shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                          <span className="text-sm text-slate-700 font-medium">{filter.operator}</span>
                          <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                        </div>

                        {/* Value Input */}
                        <div className="flex-[2] flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                          <input 
                            type="text" 
                            placeholder={filter.type === 'number' ? "Enter value(s)" : "Start typing to filter results"}
                            value={filter.value}
                            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                            className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder:text-slate-300"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => removeFilter(filter.id)}
                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-slate-100 hover:border-red-100"
                            title="移除条件"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all" title="更多">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Filter Button */}
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-50">
                      <button 
                        onClick={addFilter}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-blue-500 text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                      >
                        <Plus size={20} strokeWidth={3} />
                        Add filter
                      </button>

                      <button 
                        onClick={clearAllFilters}
                        className="px-5 py-2.5 bg-slate-50 text-slate-500 text-sm font-bold rounded-xl hover:bg-slate-100 hover:text-slate-700 transition-all"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {canvasItems.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
                <div className="w-20 h-20 mb-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                  <Layout size={32} strokeWidth={1.5} className="text-slate-300" />
                </div>
                <p className="text-lg font-medium text-slate-600">画板为空</p>
                <p className="text-sm mt-2 text-slate-400">请从上方工具栏点击添加组件</p>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-6 relative z-10">
                {canvasItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group hover:shadow-md hover:border-slate-300 transition-all duration-200 ${
                      item.type === 'table' ? 'col-span-12' : 'col-span-6'
                    }`}
                  >
                    {/* Component Header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            item.type === 'table' ? 'bg-blue-100 text-blue-600' : 
                            item.type === 'bar' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            {item.type === 'table' ? <TableIcon size={16} /> : 
                             item.type === 'bar' ? <BarChart3 size={16} /> : <LineChart size={16} />}
                          </div>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateComponentTitle(item.id, e.target.value)}
                            className="text-sm font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none px-1 py-0.5 transition-colors w-64"
                            placeholder="输入组件名称"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => removeComponent(item.id)} 
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="删除"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="cursor-move p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors" title="拖拽排序">
                          <Move size={14} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Component Body */}
                    {item.type === 'table' ? (
                      <div className="p-0 border-t border-slate-50">
                        <AnalysisTableWidget 
                          isConfiguring={item.isConfiguring} 
                          onReconfigure={() => setComponentConfiguring(item.id, true)}
                          onGenerate={() => setComponentConfiguring(item.id, false)}
                        />
                      </div>
                    ) : (
                      <div className="p-4 flex items-center justify-center bg-slate-50/10 h-64 border-t border-slate-50">
                        <div className="flex flex-col items-center gap-3 text-slate-300">
                          {item.type === 'bar' && <BarChart3 size={48} strokeWidth={1} />}
                          {item.type === 'line' && <LineChart size={48} strokeWidth={1} />}
                          <span className="text-xs font-medium uppercase tracking-wider">{item.type} placeholder</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Component Picker Modal */}
      {showComponentPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Package size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-none">选择分析组件</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowComponentPicker(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                title="关闭"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-hidden flex flex-col flex-1">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="搜索组件名称或作者..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar">
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="w-12 px-4 py-3"></th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">组件名称</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">类型</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">创建人</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">更新时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_EXISTING_COMPONENTS
                        .filter(c => c.title.includes(pickerSearch) || c.author.includes(pickerSearch))
                        .map((comp) => (
                        <tr 
                          key={comp.id}
                          onClick={() => toggleTempSelection(comp.id)}
                          className={`group cursor-pointer transition-colors ${
                            tempSelectedIds.includes(comp.id) 
                              ? 'bg-indigo-50/50' 
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              tempSelectedIds.includes(comp.id)
                                ? 'bg-indigo-500 border-indigo-500 text-white'
                                : 'border-slate-200 group-hover:border-slate-300 bg-white'
                            }`}>
                              {tempSelectedIds.includes(comp.id) && <Check size={12} strokeWidth={3} />}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-slate-700">{comp.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <div className={`p-1 rounded ${
                                comp.type === 'table' ? 'bg-blue-50 text-blue-500' : 
                                comp.type === 'bar' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                              }`}>
                                {comp.type === 'table' ? <TableIcon size={12} /> : 
                                 comp.type === 'bar' ? <BarChart3 size={12} /> : <LineChart size={12} />}
                              </div>
                              {comp.type === 'table' ? '表格' : comp.type === 'bar' ? '柱状图' : '折线图'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{comp.author}</td>
                          <td className="px-4 py-3 text-xs text-slate-400 text-right font-mono">{comp.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {MOCK_EXISTING_COMPONENTS.filter(c => c.title.includes(pickerSearch) || c.author.includes(pickerSearch)).length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-sm text-slate-400">未找到匹配的组件</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                已选择 <span className="text-indigo-600 font-bold">{tempSelectedIds.length}</span> 个组件
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowComponentPicker(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmAddComponents}
                  disabled={tempSelectedIds.length === 0}
                  className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-md active:transform active:scale-95 flex items-center gap-2"
                >
                  <Plus size={16} />
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
