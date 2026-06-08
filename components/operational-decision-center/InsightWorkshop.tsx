import React, { useState } from 'react';
import { 
  Database, Plus, MoreHorizontal, 
  ChevronRight, BrainCircuit, Activity, Table as TableIcon, BarChart3, 
  LineChart, PieChart as PieChartIcon, Edit, Trash2,
  Puzzle, Layers, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type WorkshopTab = 'semantic' | 'component' | 'system';

interface InsightWorkshopProps {
  onBack?: () => void;
}

export const InsightWorkshop: React.FC<InsightWorkshopProps> = () => {
  const [activeTab, setActiveTab] = useState<WorkshopTab>('semantic');

  const tabs = [
    { id: 'semantic', label: '语义模型', icon: BrainCircuit },
    { id: 'component', label: '分析组件', icon: Puzzle },
    { id: 'system', label: '分析体系', icon: Layers },
  ];

  const renderSemanticModels = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">语义模型管理</h2>
          <p className="text-sm text-gray-500 mt-1">定义业务逻辑与数据指标的算子映射</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100">
          <Plus size={18} />
          新建模型
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: '住院收入模型', desc: '包含床位费、诊疗费、耗材费等明细映射', count: 24, status: '已发布' },
          { title: 'CMI效率因子', desc: 'DRG权重与资源消耗强度加权模型', count: 12, status: '开发中' },
          { title: '医疗服务质量', desc: '术后并发症与非计划重返关联模型', count: 8, status: '已发布' },
          { title: '科室绩效核算', desc: '成本支出与业务收入对比映射逻辑', count: 15, status: '已发布' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Database size={24} />
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === '已发布' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {item.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.desc}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs text-gray-400">
              <span>内含 {item.count} 个算子</span>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:text-indigo-600 transition-colors"><Edit size={14} /></button>
                <button className="p-1 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalysisComponents = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">分析组件库</h2>
          <p className="text-sm text-gray-500 mt-1">可视化卡片与交互组件库</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100">
          <Plus size={18} />
          新建组件
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: '各科室床位使用率', type: 'Bar', items: ['科室', '使用率'], icon: BarChart3 },
          { title: '费用结构分布', type: 'Pie', items: ['项目', '金额'], icon: PieChartIcon },
          { title: '月度就诊趋势', type: 'Line', items: ['日期', '人次'], icon: LineChart },
          { title: '异常科室列表', type: 'Table', items: ['指标', '波动'], icon: TableIcon },
          { title: '全院概况摘要', type: 'Metric', items: ['核心', '环比'], icon: Activity },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 transition-all group cursor-pointer relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                <span className="text-[10px] text-gray-400 uppercase font-black">{item.type} Component</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.items.map((it, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-medium">{it}</span>
              ))}
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal size={16} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalysisSystems = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">分析体系编排</h2>
          <p className="text-sm text-gray-500 mt-1">构建主题/驾驶舱的完整分析路径</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100">
          <Plus size={18} />
          新建体系
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">体系名称</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">包含组件</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">关联模型</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">创建时间</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { name: '门急诊实时运营监测体系', components: 12, models: ['住院收入-算子', '排班-映射'], time: '2024-03-20' },
              { name: 'DRG入组效能分析体系', components: 8, models: ['CMI效率-算子'], time: '2024-03-22' },
              { name: '财务综合收支监管体系', components: 15, models: ['绩效核算-主模型'], time: '2024-03-25' },
              { name: '智慧院务综合决策体系', components: 20, models: ['全域核心-聚合'], time: '2024-04-01' },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-indigo-50/10 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600">{row.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{row.components} 个组件</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1">
                    {row.models.map((m, mi) => (
                      <span key={mi} className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{m}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5 text-xs text-gray-400 font-mono">{row.time}</td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 text-gray-300 hover:text-indigo-600 transition-colors"><ChevronRight size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Workshop Header & Tabs */}
      <div className="bg-white border-b border-gray-100 px-10 pt-8 pb-0">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
              <Sparkles size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">洞察工坊</h1>
              <p className="text-sm text-gray-400 font-medium tracking-tight">语义化数据建模与多维分析中心</p>
           </div>
        </div>

        <div className="flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as WorkshopTab)}
              className={`flex items-center gap-2 pb-4 text-sm font-black transition-all relative ${
                activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabPlan"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Workshop Body */}
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'semantic' && renderSemanticModels()}
            {activeTab === 'component' && renderAnalysisComponents()}
            {activeTab === 'system' && renderAnalysisSystems()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InsightWorkshop;
