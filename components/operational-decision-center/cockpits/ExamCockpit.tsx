/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  ChevronLeft, Users, Hourglass, Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, 
  AreaChart, Area, Line, Legend, PieChart as RePieChart, Pie
} from 'recharts';

interface ExamCockpitProps {
  onBack: () => void;
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  workloadDrillDown: string | null;
  setWorkloadDrillDown: (drillDown: string | null) => void;
}

// Helper for Panel Title
const PanelTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-4 relative">
    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
    <div className="absolute left-0 bottom-0 w-32 h-[1px] bg-gradient-to-r from-cyan-400 to-transparent"></div>
    <h3 className="text-lg font-bold text-white tracking-wider italic">{title}</h3>
  </div>
);

// Helper for KPI Box
const KpiBox = ({ title, value, unit, trend, trendValue, icon, campusData }: {
  title: string;
  value: number | string;
  unit?: string;
  trend: 'up' | 'down';
  trendValue: string;
  icon?: React.ReactNode;
  campusData?: { name: string; value: number | string }[] | null;
}) => (
  <div className="relative group overflow-hidden bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-3 transition-all hover:bg-cyan-500/10 hover:border-cyan-500/30">
    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
      {icon}
    </div>
    <div className="flex flex-col gap-1 relative z-10">
      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
        <div className="w-1 h-3 bg-cyan-500 rounded-full"></div>
        {title}
      </div>
      <div className="flex items-baseline gap-1 my-1">
        <span className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{value}</span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
      
      {campusData ? (
        <div className="grid grid-cols-3 gap-1 mt-1 py-1 border-t border-white/5">
          {campusData.map((c: { name: string; value: number | string }) => (
            <div key={c.name} className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">{c.name}</span>
              <span className="text-xs font-semibold text-cyan-400/90">{c.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1 text-[10px] mt-1">
          <span className={trend === 'up' ? 'text-rose-500' : 'text-emerald-500'}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}%
          </span>
          <span className="text-slate-500">较昨日</span>
        </div>
      )}
    </div>
  </div>
);

const ExamCockpit: React.FC<ExamCockpitProps> = ({
  onBack,
  selectedCampus,
  setSelectedCampus,
  workloadDrillDown,
  setWorkloadDrillDown
}) => {
  // Data for charts
  const workloadBarData = [
    { name: 'DR', value: 300, 天河: 120, 珠玑: 100, 同德: 80 },
    { name: 'CT', value: 390, 天河: 150, 珠玑: 130, 同德: 110 },
    { name: 'MR', value: 240, 天河: 90, 珠玑: 80, 同德: 70 },
    { name: '其他', value: 150, 天河: 60, 珠玑: 50, 同德: 40 },
  ];

  const drillDownData: Record<string, { name: string; value: number; 天河: number; 珠玑: number; 同德: number; color: string }[]> = {
    '其他': [
      { name: '乳腺钼靶', value: 45, 天河: 20, 珠玑: 15, 同德: 10, color: '#8b5cf6' },
      { name: 'DSA', value: 35, 天河: 15, 珠玑: 12, 同德: 8, color: '#a855f7' },
      { name: '胃肠造影', value: 40, 天河: 15, 珠玑: 13, 同德: 12, color: '#c084fc' },
    ]
  };

  const currentBarData = workloadDrillDown ? (drillDownData[workloadDrillDown] || []) : workloadBarData;
  
  const getWorkloadDonutData = () => {
    const baseData = workloadDrillDown ? (drillDownData[workloadDrillDown] || []) : workloadBarData;
    const colors = ['#0ea5e9', '#10b981', '#3b82f6', '#8b5cf6', '#a855f7', '#c084fc'];
    
    if (selectedCampus === '全院') {
      return baseData.map((item, index) => ({
        name: item.name,
        value: item.value,
        color: (item as { color?: string }).color || colors[index % colors.length]
      }));
    }
    const campusKey = selectedCampus.replace('院区', '');
    return baseData.map((item, index) => ({
      name: item.name,
      value: (item as Record<string, number | string>)[campusKey] || 0,
      color: (item as { color?: string }).color || colors[index % colors.length]
    }));
  };

  const currentDonutData = getWorkloadDonutData();

  const trafficTrendData = [
    { day: '星期一', 天河: 220, 珠玑: 200, 同德: 180, total: 600, lastWeek: 550 },
    { day: '星期二', 天河: 250, 珠玑: 230, 同德: 200, total: 680, lastWeek: 620 },
    { day: '星期三', 天河: 300, 珠玑: 280, 同德: 220, total: 800, lastWeek: 750 },
    { day: '星期四', 天河: 280, 珠玑: 260, 同德: 210, total: 750, lastWeek: 700 },
    { day: '星期五', 天河: 350, 珠玑: 320, 同德: 280, total: 950, lastWeek: 900 },
    { day: '星期六', 天河: 240, 珠玑: 220, 同德: 190, total: 650, lastWeek: 600 },
    { day: '星期日', 天河: 260, 珠玑: 240, 同德: 200, total: 700, lastWeek: 650 },
  ];

  const reportTimeData = [
    { name: 'DR', 天河: 0.8, 珠玑: 0.7, 同德: 0.9, 全院: 0.8 },
    { name: 'CT', 天河: 1.5, 珠玑: 1.4, 同德: 1.6, 全院: 1.5 },
    { name: 'MR', 天河: 2.1, 珠玑: 2.0, 同德: 2.2, 全院: 2.1 },
  ];

  const costDonutData = [
    { name: 'CT', value: 45, color: '#10b981' },
    { name: 'DR', value: 25, color: '#0ea5e9' },
    { name: 'MR', value: 20, color: '#3b82f6' },
    { name: '其他', value: 10, color: '#8b5cf6' },
  ];

  const campusCostDonutData = [
    { name: '天河院区', value: 40, color: '#f59e0b' },
    { name: '珠玑院区', value: 35, color: '#ec4899' },
    { name: '同德院区', value: 25, color: '#8b5cf6' },
  ];

  const radiologyEfficiencyData = [
    { name: 'DR', 天河: 1.2, 珠玑: 1.5, 同德: 1.3, 全院: 1.3 },
    { name: 'CT', 天河: 2.5, 珠玑: 2.8, 同德: 2.6, 全院: 2.6 },
    { name: 'MR', 天河: 4.2, 珠玑: 4.5, 同德: 4.0, 全院: 4.2 },
  ];

  const kpiData: Record<string, Record<string, number>> = {
    '已检人数': { '全院': 1300, '天河': 520, '珠玑': 450, '同德': 330 },
    '等待人数': { '全院': 1248, '天河': 480, '珠玑': 420, '同德': 348 },
    '预约人数': { '全院': 1248, '天河': 500, '珠玑': 400, '同德': 348 },
    '今日收入': { '全院': 1300, '天河': 500, '珠玑': 450, '同德': 350 },
    '门诊收入': { '全院': 2736, '天河': 1000, '珠玑': 900, '同德': 836 },
    '住院收入': { '全院': 2736, '天河': 1000, '珠玑': 900, '同德': 836 },
  };

  return (
    <div className="w-full flex-1 min-h-0 bg-[#050b14] text-white p-6 pb-24 space-y-6 font-sans relative overflow-y-auto">
      {/* Background styling */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 0%, #0c2b5e 0%, #050b14 50%)',
      }}></div>

      {/* Header */}
      <div className="relative flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-4 w-1/3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        
        {/* Stylized Title Background */}
        <div className="relative px-20 py-4 w-1/3 flex justify-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNjAiPjxwYXRoIGQ9Ik0wLDYwIEw0MCwwIEwzNjAsMCBMNDAwLDYwIFoiIGZpbGw9InJnYmEoMTQsIDE2NSwgMjMzLCAwLjE1KSIgc3Ryb2tlPSIjMGVhNWU5IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-no-repeat bg-center bg-contain"></div>
          <h1 className="text-3xl font-bold tracking-[0.2em] text-white text-shadow-lg relative z-10 whitespace-nowrap">
            放射驾驶舱
          </h1>
        </div>

        <div className="flex items-center justify-end gap-4 w-1/3">
          <div className="flex items-center gap-1 bg-[#0a1128]/80 p-1 rounded-lg border border-[#1e3a8a] shadow-[inset_0_0_10px_rgba(14,165,233,0.1)]">
            {['全院', '天河院区', '珠玑院区', '同德院区'].map(campus => (
              <button
                key={campus}
                onClick={() => setSelectedCampus(campus)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  selectedCampus === campus 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                {campus}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6 z-10">
        {/* Top Row: Workload & Traffic Trend */}
        <div className="col-span-12 lg:col-span-12 grid grid-cols-12 gap-6">
          {/* Workload */}
          <div className="col-span-12 lg:col-span-5 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <PanelTitle title={workloadDrillDown ? `放射服务工作量 - ${workloadDrillDown}` : "放射服务工作量"} />
              {workloadDrillDown && (
                <button 
                  onClick={() => setWorkloadDrillDown(null)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30 transition-all hover:bg-cyan-500/20"
                >
                  <ChevronLeft size={12} /> 返回
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
              <KpiBox 
                title="已检人数" 
                value={kpiData['已检人数'][selectedCampus.replace('院区', '')]} 
                trend="up" 
                trendValue="12.5" 
                icon={<Users size={20}/>}
                campusData={selectedCampus === '全院' ? [
                  { name: '天河', value: kpiData['已检人数']['天河'] },
                  { name: '珠玑', value: kpiData['已检人数']['珠玑'] },
                  { name: '同德', value: kpiData['已检人数']['同德'] },
                ] : null}
              />
              <KpiBox 
                title="等待人数" 
                value={kpiData['等待人数'][selectedCampus.replace('院区', '')]} 
                trend="up" 
                trendValue="8.2" 
                icon={<Hourglass size={20}/>}
                campusData={selectedCampus === '全院' ? [
                  { name: '天河', value: kpiData['等待人数']['天河'] },
                  { name: '珠玑', value: kpiData['等待人数']['珠玑'] },
                  { name: '同德', value: kpiData['等待人数']['同德'] },
                ] : null}
              />
              <KpiBox 
                title="预约人数" 
                value={kpiData['预约人数'][selectedCampus.replace('院区', '')]} 
                trend="up" 
                trendValue="15.4" 
                icon={<Calendar size={20}/>}
                campusData={selectedCampus === '全院' ? [
                  { name: '天河', value: kpiData['预约人数']['天河'] },
                  { name: '珠玑', value: kpiData['预约人数']['珠玑'] },
                  { name: '同德', value: kpiData['预约人数']['同德'] },
                ] : null}
              />
            </div>

            <div className="flex h-[260px] relative z-10">
              <div className="w-[55%] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={currentBarData} 
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    onClick={(data: any) => {
                      if (data && data.activeLabel && (drillDownData as any)[data.activeLabel]) {
                        setWorkloadDrillDown(data.activeLabel as any);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a8a" opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(34, 211, 238, 0.05)' }}
                      contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#22d3ee', fontSize: '12px' }}
                    />
                    {selectedCampus === '全院' && (
                      <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
                    )}
                    {selectedCampus === '全院' ? (
                      <>
                        <Bar dataKey="天河" fill="#0ea5e9" barSize={10} radius={[2, 2, 0, 0]} />
                        <Bar dataKey="珠玑" fill="#10b981" barSize={10} radius={[2, 2, 0, 0]} />
                        <Bar dataKey="同德" fill="#3b82f6" barSize={10} radius={[2, 2, 0, 0]} />
                      </>
                    ) : (
                      <Bar dataKey={selectedCampus.replace('院区', '')} fill="#0ea5e9" barSize={20} radius={[2, 2, 0, 0]}>
                        {currentBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={(entry as { color?: string }).color || '#0ea5e9'} className="cursor-pointer hover:opacity-80 transition-opacity" />
                        ))}
                      </Bar>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-[45%] h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={currentDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      onClick={(data: { name?: string }) => {
                        if (data && data.name && drillDownData[data.name]) {
                          setWorkloadDrillDown(data.name);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {currentDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-white">
                    {Number(currentDonutData.reduce((acc, cur) => acc + Number(cur.value), 0)).toFixed(workloadDrillDown ? 1 : 0)}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">{workloadDrillDown ? '分项' : '总量'}</span>
                </div>
                {/* Legend for Donut */}
                <div className="absolute -right-2 top-0 bottom-0 flex flex-col justify-center gap-2 text-[10px] text-slate-400">
                  {currentDonutData.map(item => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="whitespace-nowrap">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Trend */}
          <div className="col-span-12 lg:col-span-7 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <PanelTitle title="流量趋势" />
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[10px] text-cyan-400">
                  实时更新
                </div>
              </div>
            </div>
            <div className="h-[340px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficTrendData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorTianhe" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorZhuji" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTongde" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a8a" opacity={0.2} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px', boxShadow: '0 8px 16px rgba(0,0,0,0.6)' }}
                    itemStyle={{ fontSize: '12px', padding: '2px 0' }}
                  />
                  {selectedCampus === '全院' ? (
                    <>
                      <Area type="monotone" dataKey="天河" name="天河院区" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorTianhe)" dot={{ r: 3, fill: '#0ea5e9' }} activeDot={{ r: 5 }} />
                      <Area type="monotone" dataKey="珠玑" name="珠玑院区" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorZhuji)" dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
                      <Area type="monotone" dataKey="同德" name="同德院区" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTongde)" dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="total" name="全院本周" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3, fill: '#22d3ee' }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="lastWeek" name="全院上周" stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                    </>
                  ) : (
                    <>
                      <Area 
                        type="monotone" 
                        dataKey={selectedCampus.replace('院区', '')} 
                        name={selectedCampus} 
                        stroke="#0ea5e9" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorTianhe)" 
                        dot={{ r: 4, fill: '#0ea5e9' }} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line type="monotone" dataKey="lastWeek" name="上周" stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                    </>
                  )}
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '20px' }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        {/* Quality */}
        <div className="col-span-12 lg:col-span-3 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
          <PanelTitle title="放射服务质量" />
          
          <div className="mb-6">
            <div className="text-sm text-slate-300 mb-3">平均报告发布时长 (小时)</div>
            <div className="space-y-3">
              {reportTimeData.map(item => {
                const campusesToShow = selectedCampus === '全院' ? ['全院', '天河', '珠玑', '同德'] : [selectedCampus];
                return (
                  <div key={item.name} className="space-y-2">
                    <div className="text-xs text-slate-400">{item.name}</div>
                    <div className="space-y-1">
                      {campusesToShow.map(campus => (
                        <div key={campus} className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 w-8">{campus}</span>
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${campus === '全院' ? 'bg-amber-500' : 'bg-cyan-500'}`} style={{ width: `${(item[campus as keyof typeof item] as number / 3) * 100}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-white w-6 text-right">{item[campus as keyof typeof item]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cost */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          <div className="flex-1 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
            <PanelTitle title="放射服务费用" />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <KpiBox 
                title="今日收入(万元)" 
                value={kpiData['今日收入'][selectedCampus.replace('院区', '')]} 
                trend="up" 
                trendValue="12.5" 
                campusData={selectedCampus === '全院' ? [
                  { name: '天河', value: kpiData['今日收入']['天河'] },
                  { name: '珠玑', value: kpiData['今日收入']['珠玑'] },
                  { name: '同德', value: kpiData['今日收入']['同德'] },
                ] : null}
              />
              <KpiBox 
                title="门诊收入(万元)" 
                value={kpiData['门诊收入'][selectedCampus.replace('院区', '')]} 
                trend="up" 
                trendValue="12.5" 
                campusData={selectedCampus === '全院' ? [
                  { name: '天河', value: kpiData['门诊收入']['天河'] },
                  { name: '珠玑', value: kpiData['门诊收入']['珠玑'] },
                  { name: '同德', value: kpiData['门诊收入']['同德'] },
                ] : null}
              />
              <KpiBox 
                title="住院收入(万元)" 
                value={kpiData['住院收入'][selectedCampus.replace('院区', '')]} 
                trend="up" 
                trendValue="12.5" 
                campusData={selectedCampus === '全院' ? [
                  { name: '天河', value: kpiData['住院收入']['天河'] },
                  { name: '珠玑', value: kpiData['住院收入']['珠玑'] },
                  { name: '同德', value: kpiData['住院收入']['同德'] },
                ] : null}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="w-1/2 h-[180px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={costDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {costDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px' }} />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-500">项目占比</span>
                </div>
              </div>
              <div className="w-1/2 h-[180px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={campusCostDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {campusCostDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px' }} />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-500">院区占比</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency */}
        <div className="col-span-12 lg:col-span-3 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
          <PanelTitle title="放射服务效率" />
          <div className="mb-6">
            <div className="text-sm text-slate-300 mb-3">平均检查时长 (小时)</div>
            <div className="space-y-4">
              {radiologyEfficiencyData.map(item => {
                const campusesToShow = selectedCampus === '全院' ? ['全院', '天河', '珠玑', '同德'] : [selectedCampus];
                return (
                  <div key={item.name} className="space-y-2">
                    <div className="text-xs text-slate-400">{item.name}</div>
                    <div className="space-y-1.5">
                      {campusesToShow.map(campus => (
                        <div key={campus} className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 w-8">{campus}</span>
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${campus === '全院' ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${(item[campus as keyof typeof item] as number / 6) * 100}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-white w-6 text-right">{item[campus as keyof typeof item]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCockpit;
