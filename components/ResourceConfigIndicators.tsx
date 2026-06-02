
import React, { useState } from 'react';
import { 
  Search, Calendar, ChevronDown, FileText, Download, 
  Activity, ArrowDownRight
} from 'lucide-react';
import { 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Line, ReferenceLine, Label, Legend, ComposedChart
} from 'recharts';

const INDICATOR_TREE = [
  {
    id: '1',
    label: '床位配置',
    children: [
      { id: '1-1', label: '基础指标没有visit_no' },
      { id: '1-2', label: '指标库迁移测试复合指标二', active: true },
      { id: '1-3', label: '指标库迁移测试复合指标' },
      { id: '1-4', label: '指标库迁移测试基础指标二' },
    ]
  },
  {
    id: '2',
    label: '期末值指标|年',
  },
  {
    id: '3',
    label: '复合指标（分子分母为填报指标）',
  },
  {
    id: '4',
    label: '科室填报优化测试二',
  },
  {
    id: '5',
    label: '科室填报优化测试一',
  },
  {
    id: '6',
    label: '指标监测值集复合指标',
  },
  {
    id: '7',
    label: '测试期末值复合指标',
  },
];

const TIME_ANALYSIS_DATA = [
  { name: '202512', value: 215, subValue1: 45, subValue2: 35 },
  { name: '202601', value: 55, subValue1: 85, subValue2: 195 },
  { name: '202602', value: 68, subValue1: 175, subValue2: 215 },
  { name: '202603', value: 68, subValue1: 168, subValue2: 215 },
  { name: '202604', value: 65, subValue1: 165, subValue2: 215 },
];

const DEPT_ANALYSIS_DATA = [
  { name: '急诊医学科', value: 65, subValue1: 45, subValue2: 85 },
  { name: '五官科', value: 62, subValue1: 42, subValue2: 82 },
  { name: '内科', value: 78, subValue1: 35, subValue2: 45 },
  { name: '外科', value: 52, subValue1: 15, subValue2: 15 },
  { name: '妇产科', value: 68, subValue1: 25, subValue2: 55 },
  { name: '儿科', value: 72, subValue1: 55, subValue2: 65 },
  { name: '肿瘤科', value: 82, subValue1: 48, subValue2: 82 },
];

interface TooltipPayload {
  color: string;
  name: string;
  value: number | string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CUSTOM_TOOLTIP = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-xl border border-gray-100 rounded-2xl">
        <p className="text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">{label}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center justify-between gap-8 py-1 first:pt-0 last:pb-0">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-[11px] font-bold text-gray-400">{entry.name}</span>
             </div>
             <span className="text-sm font-black text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ResourceConfigIndicators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  const [selectedIndicator, setSelectedIndicator] = useState('1-2');

  return (
    <div className="flex w-full h-full bg-[#f4f7fa] overflow-hidden">
      {/* Left Sidebar Indicator Tree */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder="请输入关键字进行搜索" 
              className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
           {INDICATOR_TREE.map(group => (
             <div key={group.id} className="mb-1">
                <div className="px-4 py-2 flex items-center gap-2 text-gray-400">
                    <ChevronDown size={14} className={group.children ? 'text-gray-400' : 'opacity-0'} />
                    <span className="text-xs font-black tracking-tight">{group.label}</span>
                </div>
                {group.children?.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setSelectedIndicator(item.id)}
                    className={`w-full text-left px-10 py-3 text-xs font-bold transition-all border-l-4 ${item.id === selectedIndicator ? 'bg-blue-50 text-blue-600 border-blue-600' : 'text-gray-500 hover:bg-gray-50 border-transparent'}`}
                  >
                    {item.label}
                  </button>
                ))}
             </div>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {/* Top Filters Block */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="flex bg-gray-50 p-1 rounded-lg">
                <button className="px-4 py-1.5 text-xs font-bold text-gray-400">年</button>
                <button className="px-4 py-1.5 text-xs font-bold text-blue-600 bg-white rounded shadow-sm">月</button>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-lg text-xs font-bold text-gray-500">
                <Calendar size={14} className="text-gray-300" />
                <span>2025-12</span>
                <span className="text-gray-200mx-2">-</span>
                <span>2026-05</span>
             </div>
             <div className="relative group">
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-lg text-xs font-bold text-gray-400 min-w-[180px] bg-white cursor-pointer group-hover:border-gray-200 transition-all">
                   请选择科室
                   <ChevronDown size={14} className="ml-auto" />
                </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-8 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
              查询
            </button>
            <div className="flex overflow-hidden rounded-lg shadow-lg shadow-blue-50 border border-blue-600">
                <button className="px-4 py-2 bg-blue-600 text-white flex items-center gap-2 text-xs font-bold hover:bg-blue-700 transition-all">
                    <Download size={14} />
                    导出数据
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white border-l border-white/20 hover:bg-blue-700 transition-all">
                    <ChevronDown size={14} />
                </button>
            </div>
          </div>
        </div>

        {/* Indicator Hero Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between gap-12">
            {/* Left Column: Name and Tags */}
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">指标库迁移测试复合指标二</h2>
              <div className="flex gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[10px] font-black rounded uppercase tracking-wider border border-blue-100">自动采集</span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-500 text-[10px] font-black rounded uppercase tracking-wider border border-purple-100">指标反馈</span>
                
                {/* Proof Materials Tag with Hover List */}
                <div className="relative group/docs">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded uppercase tracking-wider border border-emerald-100 cursor-pointer flex items-center gap-1 hover:bg-emerald-100 transition-colors">
                    证明材料 (3)
                  </span>
                  
                  {/* Hover List Overlay */}
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 opacity-0 invisible group-hover/docs:opacity-100 group-hover/docs:visible transition-all z-50 transform translate-y-1 group-hover/docs:translate-y-0">
                    <div className="space-y-1">
                      {[
                        { name: '2025年度资产负债表.pdf', size: '2.4MB' },
                        { name: '全院科室资产明细汇总.pdf', size: '1.1MB' },
                        { name: '医疗设备外购审批单-2026.png', size: '840KB' }
                      ].map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all group/item">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-700 truncate">{doc.name}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button 
                              onClick={(e) => { e.stopPropagation(); alert(`正在预览: ${doc.name}`); }}
                              className="px-2.5 py-1.5 bg-white border border-gray-200 text-blue-600 rounded-lg text-[10px] font-black shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95"
                            >
                              预览
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); alert(`正在下载: ${doc.name}`); }}
                              className="px-2.5 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg text-[10px] font-black shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95"
                            >
                              下载
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: Result and Trend */}
            <div className="flex-1 flex flex-col items-center justify-center border-x border-gray-100 px-12">
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-gray-900">63.86</span>
                <span className="text-2xl font-black text-gray-900">%</span>
              </div>
              <div className="flex items-center gap-8 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">同比:</span>
                  <span className="text-xs font-black text-rose-500 flex items-center gap-0.5">
                    <ArrowDownRight size={14} />
                    -7.11%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">环比:</span>
                  <span className="text-xs font-black text-gray-400">-</span>
                </div>
              </div>
            </div>

            {/* Right Column: Atomic Indicators */}
            <div className="flex-1 flex items-center justify-end gap-8">
                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <FileText size={18} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">指标库迁移测试基础指标一</p>
                        <p className="text-3xl font-black text-gray-900">790</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <Activity size={18} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">指标库迁移测试基础指标二</p>
                        <p className="text-3xl font-black text-gray-900">1237</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Business Time Analysis Chart Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">业务时间分析</h3>
            <div className="flex bg-gray-50 p-1 rounded-lg">
               <button 
                  onClick={() => setActiveTab('chart')}
                  className={`px-4 py-1.5 text-xs font-bold transition-all ${activeTab === 'chart' ? 'bg-white text-blue-600 rounded shadow-sm' : 'text-gray-400'}`}
               >图表</button>
               <button 
                  onClick={() => setActiveTab('table')}
                  className={`px-4 py-1.5 text-xs font-bold transition-all ${activeTab === 'table' ? 'bg-white text-blue-600 rounded shadow-sm' : 'text-gray-400'}`}
               >表格</button>
            </div>
          </div>

          <div className="h-[400px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={TIME_ANALYSIS_DATA} margin={{ top: 40, right: 80, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }}
                  dy={15}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }}
                  label={{ value: '指标值', angle: -90, position: 'insideLeft', offset: -10, style: { fill: '#94a3b8', fontSize: 10, fontWeight: 800 } }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }}
                />
                <Tooltip content={<CUSTOM_TOOLTIP />} cursor={{ fill: '#f8fafc' }} />
                
                {/* Visual Reference Lines */}
                <ReferenceLine yAxisId="left" y={100} stroke="#f59e0b" strokeDasharray="3 3">
                   <Label value="平均值 92.31%" position="right" style={{ fill: '#f59e0b', fontWeight: 800, fontSize: 10 }} offset={10} />
                </ReferenceLine>
                <ReferenceLine yAxisId="left" y={65} stroke="#10b981" strokeDasharray="3 3">
                   <Label value="中位数 64.31%" position="left" style={{ fill: '#10b981', fontWeight: 800, fontSize: 10 }} dy={-10} />
                </ReferenceLine>

                <Bar yAxisId="left" dataKey="subValue1" name="指标库迁移测试基础指标一" fill="#2563eb" barSize={32} radius={[2, 2, 0, 0]} />
                <Bar yAxisId="left" dataKey="subValue2" name="指标库迁移测试基础指标二" fill="#60a5fa" barSize={32} radius={[2, 2, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="value" name="指标值" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="rect" 
                  wrapperStyle={{ fontSize: 10, fontWeight: 800, color: '#64748b', paddingTop: 20 }}
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Top Legend Labels matching screenshot style if needed but Recharts legend is cleaner */}
            <div className="absolute top-0 right-0 space-y-1">
               <p className="text-[10px] font-bold text-gray-400 text-right">指标库迁移测试基础指标一</p>
               <p className="text-[10px] font-bold text-gray-400 text-right">指标库迁移测试基础指标二</p>
            </div>
          </div>
          
          {/* Scrollbar Mock */}
          <div className="w-[80%] mx-auto h-2 bg-gray-100 rounded-full overflow-hidden flex">
             <div className="w-[10%] bg-white h-full border border-gray-200 shadow-sm rounded-full"></div>
          </div>
        </div>

        {/* Department Name Analysis Chart Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">科室名称分析</h3>
            <div className="flex bg-gray-50 p-1 rounded-lg">
               <button className="px-4 py-1.5 text-xs font-bold bg-white text-blue-600 rounded shadow-sm">图表</button>
               <button className="px-4 py-1.5 text-xs font-bold text-gray-400">表格</button>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DEPT_ANALYSIS_DATA} margin={{ top: 20, right: 40, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                   angle={-30}
                   textAnchor="end"
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }}
                   domain={[40, 90]}
                />
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Bar dataKey="subValue1" name="指标库迁移测试基础指标一" fill="#2563eb" barSize={20} />
                <Bar dataKey="subValue2" name="指标库迁移测试基础指标二" fill="#60a5fa" barSize={20} />
                <Line type="monotone" dataKey="value" name="指标值" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
