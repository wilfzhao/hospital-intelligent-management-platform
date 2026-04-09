/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  ChevronLeft, Clock, Settings, AlertCircle, FlaskConical, TrendingUp, BarChart3, Search
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, 
  AreaChart, Area, Legend, PieChart as RePieChart, Pie 
} from 'recharts';

interface LabCockpitProps {
  onBack: () => void;
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  activeLabTab: 'lab' | 'blood';
  setActiveLabTab: (tab: 'lab' | 'blood') => void;
  renderBloodCockpitContent: () => React.ReactNode;
}

const LabCockpit: React.FC<LabCockpitProps> = ({
  onBack,
  selectedCampus,
  setSelectedCampus,
  activeLabTab,
  setActiveLabTab,
  renderBloodCockpitContent
}) => {
  const labBusinessData = [
    { name: '临检', value: 500 },
    { name: '生化', value: 460 },
    { name: '免疫', value: 250 },
    { name: '微生物', value: 160 },
    { name: '分子生物', value: 90 },
  ];

  const labTrendData = [
    { date: '03-18', current: 1200, previous: 1000, completed: 1100 },
    { date: '03-19', current: 1450, previous: 1380, completed: 1350 },
    { date: '03-20', current: 1300, previous: 1320, completed: 1280 },
    { date: '03-21', current: 1520, previous: 1480, completed: 1420 },
    { date: '03-22', current: 1380, previous: 1410, completed: 1300 },
    { date: '03-23', current: 850, previous: 880, completed: 800 },
    { date: '03-24', current: 1070, previous: 950, completed: 914 },
  ];

  const tatData = [
    { name: '临检', value: 0.5, target: 1.0 },
    { name: '生化', value: 1.2, target: 2.0 },
    { name: '免疫', value: 2.5, target: 4.0 },
    { name: '微生物', value: 48, target: 72 },
    { name: '外送', value: 72, target: 96 },
  ];

  const labFeeData = [
    { name: '临检', value: 35, amount: 12540, color: '#3b82f6' },
    { name: '生化', value: 25, amount: 8960, color: '#60a5fa' },
    { name: '免疫', value: 20, amount: 7160, color: '#93c5fd' },
    { name: '微生物', value: 10, amount: 3580, color: '#bfdbfe' },
    { name: '外送', value: 10, amount: 3580, color: '#dbeafe' },
  ];

  const criticalValues = [
    { dept: '心内科', name: '张三', item: 'TnI', result: '1.5', alert: '↑', status: '待处理' },
    { dept: '急诊科', name: '李四', item: 'K+', result: '6.2', alert: '↑', status: '处理中' },
    { dept: '呼吸科', name: '王五', item: 'WBC', result: '25.4', alert: '↑', status: '待处理' },
    { dept: '儿科', name: '赵六', item: 'CRP', result: '120', alert: '↑', status: '已通知' },
    { dept: '重症医学科', name: '孙七', item: 'PLT', result: '15', alert: '↓', status: '待处理' },
    { dept: '血液科', name: '周八', item: 'HGB', result: '45', alert: '↓', status: '待处理' },
    { dept: '神经内科', name: '吴九', item: 'GLU', result: '2.1', alert: '↓', status: '待处理' },
  ];

  const overTatAlerts = [
    { group: '生化流水线A', name: '李明', dept: '急诊科', item: '急诊生化全套', time: '超30分钟' },
    { group: '免疫流水线B', name: '王强', dept: '心内科', item: '心肌酶谱', time: '超15分钟' },
    { group: '临检流水线C', name: '张伟', dept: 'ICU', item: '血常规', time: '超45分钟' },
  ];

  const qcOutControlItems = [
    { instrument: '生化仪A', item: 'ALT', level: 'L1', rule: '1-3s', status: '待处理' },
    { instrument: '生化仪B', item: 'GLU', level: 'L2', rule: '2-2s', status: '待处理' },
    { instrument: '免疫仪A', item: 'TSH', level: 'L1', rule: '1-3s', status: '处理中' },
    { instrument: '血球仪A', item: 'WBC', level: 'L3', rule: 'R-4s', status: '待处理' },
    { instrument: '凝血仪A', item: 'PT', level: 'L1', rule: '1-3s', status: '待处理' },
  ];

  const missingTrackingInfo = [
    { barcode: 'A20260331001', patient: '王建国', dept: '呼吸内科', item: '生化全套', missingNode: '标本运送', status: '已签收' },
    { barcode: 'A20260331045', patient: '李秀兰', dept: '心内科', item: '凝血四项', missingNode: '标本采集', status: '已检验' },
    { barcode: 'A20260331088', patient: '张伟', dept: '急诊科', item: '血常规', missingNode: '标本接收', status: '已出报告' },
    { barcode: 'A20260331102', patient: '刘洋', dept: 'ICU', item: '血气分析', missingNode: '标本运送', status: '已签收' },
  ];

  return (
    <div className="w-full bg-[#0f172a] flex-1 min-h-0 text-white p-6 pb-24 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative">
        <div className="flex items-center gap-4 z-10">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            {['全院', '天河院区', '珠玑院区', '同德院区'].map(campus => (
              <button
                key={campus}
                onClick={() => setSelectedCampus(campus)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedCampus === campus 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {campus}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
          <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent whitespace-nowrap">
            智慧检验驾驶舱 V3.0
          </h1>
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-sm z-10">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>2026-03-09 13:00:24</span>
          </div>
          <div className="w-px h-4 bg-slate-700"></div>
          <button className="hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {activeLabTab === 'lab' ? (
        <>
          {/* 超TAT紧急提醒 */}
          {overTatAlerts.length > 0 && (
            <div className="bg-gradient-to-r from-red-500/20 via-red-500/10 to-red-500/20 border-2 border-red-500/50 rounded-2xl p-6 flex items-center gap-8 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse-slow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
              <div className="bg-red-500 text-white p-4 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                <AlertCircle size={40} className="animate-pulse" />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-red-400 font-black text-3xl leading-none tracking-tight drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">超TAT紧急提醒</h3>
                  <span className="text-sm bg-red-500 px-3 py-1 rounded-full text-white font-bold border border-red-400 shadow-lg animate-bounce">
                    {overTatAlerts.length} 项超时
                  </span>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
                  {overTatAlerts.map((alert, idx) => (
                    <div key={idx} className="flex-shrink-0 bg-slate-900/90 border-2 border-red-500/40 rounded-xl px-6 py-4 flex items-center gap-6 shadow-xl hover:border-red-500 transition-all">
                      <div className="flex flex-col items-center justify-center min-w-[80px]">
                        <span className="text-red-500 font-black text-xl">{alert.time}</span>
                        <span className="text-red-400/60 text-[10px] uppercase font-bold tracking-widest">超时时长</span>
                      </div>
                      <div className="w-px h-12 bg-slate-700"></div>
                      <div className="flex flex-col justify-center min-w-[140px]">
                        <span className="text-slate-100 text-base font-bold mb-1">{alert.group}</span>
                        <span className="text-slate-400 text-xs font-medium">{alert.item}</span>
                      </div>
                      <div className="w-px h-12 bg-slate-700"></div>
                      <div className="flex flex-col justify-center min-w-[100px]">
                        <span className="text-slate-100 font-bold text-base">{alert.name}</span>
                        <span className="text-slate-400 text-xs font-medium">{alert.dept}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 标本业务量 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FlaskConical className="text-blue-400" size={20} />
              标本业务量
            </h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
              <div className="text-slate-400 text-[10px] mb-1">今日标本</div>
              <div className="text-lg font-bold text-blue-400">1,070<span className="text-[10px] font-normal text-slate-500 ml-1">个</span></div>
            </div>
            <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
              <div className="text-slate-400 text-[10px] mb-1">未完成</div>
              <div className="text-lg font-bold text-amber-400">156<span className="text-[10px] font-normal text-slate-500 ml-1">个</span></div>
            </div>
            <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
              <div className="text-slate-400 text-[10px] mb-1">待审核</div>
              <div className="text-lg font-bold text-emerald-400">45<span className="text-[10px] font-normal text-slate-500 ml-1">个</span></div>
            </div>
            <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
              <div className="text-slate-400 text-[10px] mb-1">危急值</div>
              <div className="text-lg font-bold text-red-400">20<span className="text-[10px] font-normal text-slate-500 ml-1">条</span></div>
            </div>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={labBusinessData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => [`${value} 个`, '标本数']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30}>
                  {labBusinessData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#60a5fa' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 标本高峰趋势监控 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="text-emerald-400" size={20} />
              标本高峰趋势监控
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-blue-500"></div>
                <span className="text-slate-400">本周</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-emerald-500"></div>
                <span className="text-slate-400">已完成</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-slate-500"></div>
                <span className="text-slate-400">上周</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={labTrendData}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value: any, name: any) => [value, name === 'current' ? '本周标本' : name === 'completed' ? '已完成' : '上周标本']}
                />
                <Area type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="previous" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TAT时效分析 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Clock className="text-amber-400" size={20} />
            TAT时效分析
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tatData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={60} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any, name: any) => [`${value} h`, name === 'value' ? '平均时长' : '目标时长']}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                <Bar dataKey="value" name="平均时长" fill="#f59e0b" barSize={12} radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" name="目标时长" fill="#3b82f6" barSize={12} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 检验服务费用 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="text-violet-400" size={20} />
              检验服务费用
            </h3>
          </div>
          <div className="flex-1 flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={labFeeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {labFeeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any, name: any, item: any) => {
                      const amount = item?.payload?.amount || 0;
                      return [
                        <div key="fee-tooltip" className="flex flex-col gap-1">
                          <div>占比: {value}%</div>
                          <div>金额: ¥{amount.toLocaleString()}</div>
                        </div>,
                        name || ''
                      ];
                    }} 
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3">
              {labFeeData.map(item => (
                <div key={item.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                      <span className="text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-medium text-slate-300">¥{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[10px] text-slate-500">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 实时危急值预警 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="text-red-400" size={20} />
              实时危急值预警
            </h3>
            <div className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">
              未处理: {criticalValues.filter(row => row.status === '待处理').length}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="pb-2 font-medium">科室</th>
                  <th className="pb-2 font-medium">姓名</th>
                  <th className="pb-2 font-medium">项目</th>
                  <th className="pb-2 font-medium">结果</th>
                  <th className="pb-2 font-medium">预警</th>
                  <th className="pb-2 font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {criticalValues.filter(row => row.status === '待处理').map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-slate-300">{row.dept}</td>
                    <td className="py-3 text-slate-300">{row.name}</td>
                    <td className="py-3 text-slate-300 font-medium">{row.item}</td>
                    <td className="py-3 text-red-400 font-bold">{row.result}</td>
                    <td className="py-3 text-red-400">{row.alert}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        row.status === '待处理' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        row.status === '处理中' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 质控失控未处理项目 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="text-amber-400" size={20} />
              质控失控未处理
            </h3>
            <div className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
              未处理: {qcOutControlItems.filter(row => row.status === '待处理').length}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="pb-2 font-medium">仪器</th>
                  <th className="pb-2 font-medium">项目</th>
                  <th className="pb-2 font-medium">水平</th>
                  <th className="pb-2 font-medium">规则</th>
                  <th className="pb-2 font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {qcOutControlItems.filter(row => row.status === '待处理').map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-slate-300">{row.instrument}</td>
                    <td className="py-3 text-slate-300 font-medium">{row.item}</td>
                    <td className="py-3 text-slate-400">{row.level}</td>
                    <td className="py-3 text-amber-400 font-bold">{row.rule}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        row.status === '待处理' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        row.status === '处理中' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 标本全流程追踪缺失信息 */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Search className="text-blue-400" size={20} />
              标本全流程追踪缺失信息
            </h3>
            <div className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
              异常标本: {missingTrackingInfo.length}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="pb-2 font-medium">条码号</th>
                  <th className="pb-2 font-medium">姓名</th>
                  <th className="pb-2 font-medium">科室</th>
                  <th className="pb-2 font-medium">项目</th>
                  <th className="pb-2 font-medium">缺失节点</th>
                  <th className="pb-2 font-medium">当前状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {missingTrackingInfo.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-slate-300 font-mono">{row.barcode}</td>
                    <td className="py-3 text-slate-300">{row.patient}</td>
                    <td className="py-3 text-slate-400">{row.dept}</td>
                    <td className="py-3 text-slate-300 font-medium">{row.item}</td>
                    <td className="py-3 text-amber-400 font-medium">{row.missingNode}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </>
      ) : (
        renderBloodCockpitContent()
      )}

      {/* Floating Tabs at Bottom Center */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full px-8 py-2 shadow-2xl flex items-center gap-12">
        <button 
          onClick={() => setActiveLabTab('lab')}
          className={`text-lg font-medium py-2 transition-colors relative ${activeLabTab === 'lab' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
        >
          检验
          {activeLabTab === 'lab' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"></div>}
        </button>
        <button 
          onClick={() => setActiveLabTab('blood')}
          className={`text-lg font-medium py-2 transition-colors relative ${activeLabTab === 'blood' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-300'}`}
        >
          输血
          {activeLabTab === 'blood' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-400 rounded-full"></div>}
        </button>
      </div>
    </div>
  );
};

export default LabCockpit;
