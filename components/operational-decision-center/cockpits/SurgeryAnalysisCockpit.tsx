/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  ChevronLeft, Clock, Activity, TrendingUp, BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, 
  AreaChart, Area, Legend
} from 'recharts';

interface SurgeryAnalysisCockpitProps {
  onBack: () => void;
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
}

const SurgeryAnalysisCockpit: React.FC<SurgeryAnalysisCockpitProps> = ({
  onBack,
  selectedCampus,
  setSelectedCampus
}) => {
  const surgeryEfficiencyData = [
    { name: '08:00', value: 85, target: 90 },
    { name: '10:00', value: 92, target: 90 },
    { name: '12:00', value: 78, target: 90 },
    { name: '14:00', value: 88, target: 90 },
    { name: '16:00', value: 95, target: 90 },
    { name: '18:00', value: 70, target: 90 },
  ];

  const surgeryWorkloadData = [
    { name: '普外科', value: 45, color: '#3b82f6' },
    { name: '骨科', value: 38, color: '#60a5fa' },
    { name: '妇产科', value: 32, color: '#93c5fd' },
    { name: '神经外科', value: 25, color: '#bfdbfe' },
    { name: '其他', value: 60, color: '#dbeafe' },
  ];

  const surgeryTimeData = [
    { name: '术前准备', value: 45, avg: 40 },
    { name: '麻醉实施', value: 30, avg: 25 },
    { name: '手术操作', value: 120, avg: 110 },
    { name: '术后复苏', value: 40, avg: 35 },
  ];

  const orUtilizationData = [
    { name: 'OR-01', value: 88 },
    { name: 'OR-02', value: 92 },
    { name: 'OR-03', value: 75 },
    { name: 'OR-04', value: 82 },
    { name: 'OR-05', value: 95 },
    { name: 'OR-06', value: 70 },
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
            手术运行分析驾驶舱
          </h1>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 手术效率监控 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Activity className="text-blue-400" size={20} />
            手术效率监控
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={surgeryEfficiencyData}>
                <defs>
                  <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value: any) => [`${value}%`, '效率']}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEfficiency)" />
                <Area type="monotone" dataKey="target" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 手术科室分布 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <BarChart3 className="text-emerald-400" size={20} />
            手术科室分布
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={surgeryWorkloadData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={70} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value: any) => [`${value} 台`, '手术量']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {surgeryWorkloadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 手术环节耗时分析 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Clock className="text-amber-400" size={20} />
            手术环节耗时分析
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={surgeryTimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} unit="min" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value: any, name: any) => [`${value} min`, name === 'value' ? '当前耗时' : '平均耗时']}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                <Bar dataKey="value" name="当前耗时" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="avg" name="平均耗时" fill="#64748b" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 手术室利用率监控 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <TrendingUp className="text-violet-400" size={20} />
            手术室利用率监控
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value: any) => [`${value}%`, '利用率']}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30}>
                  {orUtilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 90 ? '#ef4444' : entry.value < 75 ? '#f59e0b' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgeryAnalysisCockpit;
