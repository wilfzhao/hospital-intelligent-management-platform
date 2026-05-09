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
  ChevronRight,
  Move, 
  Trash2,
  Settings2,
  X
} from 'lucide-react';
import AnalysisTableWidget from './AnalysisTableWidget';

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
        <div className="flex-none py-3 flex justify-center border-b border-slate-200 bg-white shadow-sm z-20 relative">
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
          <div className="min-h-full w-full relative">
            
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
                        <div className="cursor-move p-1 -ml-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors">
                          <Move size={14} />
                        </div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateComponentTitle(item.id, e.target.value)}
                          className="text-sm font-medium text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none px-1 py-0.5 transition-colors w-48"
                          placeholder="输入组件名称"
                        />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setComponentConfiguring(item.id, !item.isConfiguring)}
                          className={`p-1.5 rounded-md transition-colors ${item.isConfiguring ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                          title={item.isConfiguring ? "完成配置" : "重新配置"}
                        >
                          <Settings2 size={14} />
                        </button>
                        <button 
                          onClick={() => removeComponent(item.id)} 
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Component Body */}
                    {item.type === 'table' ? (
                      <div className="p-0">
                        <AnalysisTableWidget 
                          isConfiguring={item.isConfiguring} 
                          onReconfigure={() => setComponentConfiguring(item.id, true)}
                          onGenerate={() => setComponentConfiguring(item.id, false)}
                        />
                      </div>
                    ) : (
                      <div className="p-6 flex items-center justify-center bg-slate-50/30 h-72">
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
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Select existing analysis components</p>
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
                <div className="grid grid-cols-2 gap-4">
                  {MOCK_EXISTING_COMPONENTS
                    .filter(c => c.title.includes(pickerSearch) || c.author.includes(pickerSearch))
                    .map((comp) => (
                    <div 
                      key={comp.id}
                      onClick={() => toggleTempSelection(comp.id)}
                      className={`relative group cursor-pointer border-2 rounded-xl p-4 transition-all ${
                        tempSelectedIds.includes(comp.id) 
                          ? 'border-indigo-500 bg-indigo-50/30' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${
                          comp.type === 'table' ? 'bg-blue-100 text-blue-600' : 
                          comp.type === 'bar' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {comp.type === 'table' ? <TableIcon size={16} /> : 
                           comp.type === 'bar' ? <BarChart3 size={16} /> : <LineChart size={16} />}
                        </div>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          tempSelectedIds.includes(comp.id)
                            ? 'bg-indigo-500 border-indigo-500 text-white'
                            : 'border-slate-200 group-hover:border-slate-300 bg-white'
                        }`}>
                          {tempSelectedIds.includes(comp.id) && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">{comp.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">创建人: {comp.author}</span>
                        <span className="flex items-center gap-1">{comp.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
