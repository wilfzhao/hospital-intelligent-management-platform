import React, { useState } from 'react';
import { 
  Save, 
  Table as TableIcon, 
  BarChart3, 
  LineChart, 
  Layout, 
  Move, 
  Trash2,
  Settings2
} from 'lucide-react';
import AnalysisTableWidget from './AnalysisTableWidget';

interface EditorProps {
  onBack: () => void;
}

type ComponentType = 'table' | 'bar' | 'line';

interface CanvasComponent {
  id: string;
  type: ComponentType;
  title: string;
  isConfiguring?: boolean;
}

export default function IndicatorAnalysisEditor({ onBack }: EditorProps) {
  const [canvasItems, setCanvasItems] = useState<CanvasComponent[]>([]);
  const [systemTitle, setSystemTitle] = useState('新增指标分析体系');

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
      line: '折线图趋势'
    };
    setCanvasItems([...canvasItems, { id: Date.now().toString(), type, title: titles[type], isConfiguring: true }]);
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
              onClick={() => addComponent('bar')} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all group"
            >
              <BarChart3 size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              柱状图
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <button 
              onClick={() => addComponent('line')} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all group"
            >
              <LineChart size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              折线图
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
                {canvasItems.map((item, index) => (
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
    </div>
  );
}
