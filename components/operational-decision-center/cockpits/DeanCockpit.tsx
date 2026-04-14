import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, ComposedChart, Legend
} from 'recharts';
import { ChevronLeft, Maximize2, ArrowUp, ArrowDown, X, Calendar, ChevronDown, Play } from 'lucide-react';

interface DeanCockpitProps {
  onBack: () => void;
}

// --- Mock Data ---
const hourlyVisitsData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  outpatient: i > 7 && i < 18 ? Math.floor(Math.random() * 300) + 100 : Math.floor(Math.random() * 50),
  emergency: Math.floor(Math.random() * 50) + 10,
}));

const paretoData = [
  { dept: '感染性疾病门诊', visits: 680, percentage: 10 },
  { dept: '肝胆外科门诊', visits: 500, percentage: 25 },
  { dept: '乳腺外科门诊', visits: 400, percentage: 40 },
  { dept: '针灸推拿门诊', visits: 300, percentage: 55 },
  { dept: '普通外科门诊', visits: 200, percentage: 70 },
  { dept: '心血管内科', visits: 150, percentage: 80 },
  { dept: '急诊妇科', visits: 50, percentage: 100 },
];

const financialPieData = [
  { name: '临床', value: 67.6, color: '#00E5FF' },
  { name: '行政', value: 18.1, color: '#0088FE' },
  { name: '医疗辅助', value: 2.7, color: '#3B82F6' },
  { name: '医疗技术', value: 11.5, color: '#F59E0B' },
];

const admissionTrendData = [
  { date: '2023\\06\\15', admission: 30, discharge: 25 },
  { date: '2023\\06\\17', admission: 40, discharge: 35 },
  { date: '2023\\06\\19', admission: 75, discharge: 70 },
  { date: '2023\\06\\21', admission: 35, discharge: 40 },
  { date: '2023\\06\\23', admission: 80, discharge: 60 },
  { date: '2023\\06\\25', admission: 70, discharge: 75 },
];

const scatterData = Array.from({ length: 30 }, () => ({
  x: Math.floor(Math.random() * 8000),
  y: Math.floor(Math.random() * 1000),
}));
scatterData.push({ x: 22000, y: 400 }); // Outlier
scatterData.push({ x: 100, y: 2800 }); // Outlier
scatterData.push({ x: 100, y: 2200 }); // Outlier
scatterData.push({ x: 100, y: 1800 }); // Outlier

const outpatientModalData = [
  { doctor: '王爱民', total: 20, outpatient: 3, emergency: 6, green: 23, blue: 15, orange: 10 },
  { doctor: '张瑞娟', total: 55, outpatient: 4, emergency: 8, green: 26, blue: 18, orange: 13 },
  { doctor: '曾冠全', total: 55, outpatient: 4, emergency: 8, green: 29, blue: 20, orange: 15 },
  { doctor: '王茂才', total: 55, outpatient: 4, emergency: 8, green: 27, blue: 18, orange: 12 },
  { doctor: '王东', total: 55, outpatient: 4, emergency: 8, green: 24, blue: 16, orange: 11 },
  { doctor: '甄娟', total: 55, outpatient: 4, emergency: 8, green: 27, blue: 19, orange: 14 },
  { doctor: '方子玉', total: 55, outpatient: 4, emergency: 8, green: 30, blue: 21, orange: 16 },
  { doctor: '林淑敏', total: 55, outpatient: 4, emergency: 8, green: 31, blue: 22, orange: 17 },
  { doctor: '陆科鸿', total: 55, outpatient: 4, emergency: 8, green: 35, blue: 27, orange: 22 },
  { doctor: '张关', total: 55, outpatient: 4, emergency: 8, green: 40, blue: 32, orange: 27 },
  { doctor: '王大伟', total: 55, outpatient: 4, emergency: 8, green: 34, blue: 26, orange: 20 },
];

// --- Components ---

const PanelHeader = ({ title, onMaximize }: { title: string, onMaximize?: () => void }) => (
  <div className="flex items-center justify-between mb-4 relative">
    <div className="flex items-center">
      <div className="w-2 h-4 bg-cyan-400 mr-2 skew-x-[-20deg]"></div>
      <h3 className="text-cyan-400 font-bold text-lg italic tracking-wider">{title}</h3>
    </div>
    <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-400/50 to-transparent ml-4"></div>
    {onMaximize && (
      <button onClick={onMaximize} className="text-cyan-400/70 hover:text-cyan-400 ml-2">
        <Maximize2 size={16} />
      </button>
    )}
  </div>
);

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subLabel?: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard = ({ label, value, unit = '', subLabel, subValue, trend }: MetricCardProps) => (
  <div className="flex flex-col">
    <div className="text-gray-400 text-sm mb-1">{label}</div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-cyan-400">{value}</span>
      <span className="text-sm text-cyan-400">{unit}</span>
    </div>
    {subLabel && (
      <div className="flex items-center gap-2 text-xs mt-1">
        <span className="text-gray-500">{subLabel}</span>
        <span className={`flex items-center ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
          {trend === 'up' && <ArrowUp size={10} className="mr-0.5" />}
          {trend === 'down' && <ArrowDown size={10} className="mr-0.5" />}
          {subValue}
        </span>
      </div>
    )}
  </div>
);

export const DeanCockpit: React.FC<DeanCockpitProps> = ({ onBack }) => {
  const [isOutpatientModalOpen, setIsOutpatientModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'time' | 'dept' | 'doctor'>('time');

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-[#070b19] text-white overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="h-20 relative flex items-center justify-center flex-shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://picsum.photos/seed/headerbg/1920/80')] bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full border-b border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.1)]"></div>
        
        <button 
          onClick={onBack}
          className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors z-10"
        >
          <ChevronLeft size={24} />
          <span className="font-medium">返回</span>
        </button>

        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-400 tracking-widest italic z-10" style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}>
          医院管理主题分析大屏
        </h1>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cyan-400/70 text-sm z-10">
          更新时间: 2026/04/13 09:23:36
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden">
        
        {/* Left Column */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
          {/* Outpatient Analysis */}
          <div className="bg-[#0b1426]/80 border border-cyan-500/20 rounded-lg p-4 flex-1 flex flex-col relative shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]">
            <PanelHeader title="门诊业务分析" onMaximize={() => setIsOutpatientModalOpen(true)} />
            
            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded text-sm">实时动态</button>
              <button className="px-3 py-1 text-gray-400 hover:text-cyan-400 text-sm">挂号趋势</button>
              <button className="px-3 py-1 text-gray-400 hover:text-cyan-400 text-sm">就诊趋势</button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <MetricCard label="今日挂号" value="2601" />
              <MetricCard label="今日已诊" value="1918" />
              <MetricCard label="门诊已诊" value="1839" />
              <MetricCard label="急诊已诊" value="79" />
            </div>

            <div className="text-right text-xs text-gray-500 mb-2">更新时间: 2026/04/13 09:23:36</div>

            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyVisitsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
                  <Bar dataKey="outpatient" name="门急诊人次" fill="#FBBF24" barSize={4} />
                  <Bar dataKey="emergency" name="门诊人次" fill="#06B6D4" barSize={4} />
                  <Bar dataKey="emergency" name="急诊人次" fill="#22C55E" barSize={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 80/20 Rule Analysis */}
          <div className="bg-[#0b1426]/80 border border-cyan-500/20 rounded-lg p-4 flex-1 flex flex-col relative shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]">
            <PanelHeader title="二八法则分析" />
            
            <div className="flex-1 min-h-[150px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={paretoData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dept" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#64748b'}} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
                  <Bar yAxisId="left" dataKey="visits" name="就诊人次" fill="#3B82F6" barSize={10} />
                  <Line yAxisId="right" type="monotone" dataKey="percentage" name="累计就诊人次占比" stroke="#00E5FF" dot={{ r: 2, fill: '#00E5FF' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs text-left text-gray-300">
                <thead className="text-cyan-400 bg-cyan-900/20">
                  <tr>
                    <th className="py-2 px-2 font-normal">序号</th>
                    <th className="py-2 px-2 font-normal">门诊科室</th>
                    <th className="py-2 px-2 font-normal text-right">就诊人次</th>
                    <th className="py-2 px-2 font-normal text-right">累计就诊量占比</th>
                  </tr>
                </thead>
                <tbody>
                  {paretoData.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-800 hover:bg-white/5">
                      <td className="py-2 px-2">{54 + idx}</td>
                      <td className="py-2 px-2">{row.dept}</td>
                      <td className="py-2 px-2 text-right">{row.visits}</td>
                      <td className="py-2 px-2 text-right">{(row.percentage / 100).toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Center Column */}
        <div className="col-span-6 flex flex-col gap-4 overflow-hidden">
          {/* 3D Graphic Area */}
          <div className="flex-[3] relative flex items-center justify-center">
             {/* Center Cube Graphic Placeholder */}
             <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
                <img src="https://picsum.photos/seed/cube/400/400" alt="3D Cube" className="w-full h-full object-contain mix-blend-screen opacity-80" referrerPolicy="no-referrer" />
                
                {/* Connecting Lines (Simulated) */}
                <svg className="absolute inset-[-100%] w-[300%] h-[300%] pointer-events-none z-0">
                   <path d="M 50% 50% L 20% 30%" stroke="rgba(0,255,255,0.3)" strokeWidth="2" fill="none" />
                   <path d="M 50% 50% L 80% 30%" stroke="rgba(0,255,255,0.3)" strokeWidth="2" fill="none" />
                   <path d="M 50% 50% L 30% 80%" stroke="rgba(0,255,255,0.3)" strokeWidth="2" fill="none" />
                   <path d="M 50% 50% L 70% 80%" stroke="rgba(0,255,255,0.3)" strokeWidth="2" fill="none" />
                </svg>
             </div>

             {/* Floating Metrics */}
             <div className="absolute top-[20%] left-[10%] bg-[#0b1426]/90 border border-cyan-500/50 p-3 rounded shadow-[0_0_15px_rgba(0,255,255,0.2)] text-center min-w-[120px] z-10">
                <div className="text-gray-300 text-sm mb-1">门诊就诊</div>
                <div className="text-cyan-400 text-2xl font-bold">1839</div>
             </div>
             <div className="absolute top-[20%] right-[10%] bg-[#0b1426]/90 border border-cyan-500/50 p-3 rounded shadow-[0_0_15px_rgba(0,255,255,0.2)] text-center min-w-[120px] z-10">
                <div className="text-gray-300 text-sm mb-1">出院人数</div>
                <div className="text-cyan-400 text-2xl font-bold">39</div>
             </div>
             <div className="absolute bottom-[20%] left-[20%] bg-[#0b1426]/90 border border-cyan-500/50 p-3 rounded shadow-[0_0_15px_rgba(0,255,255,0.2)] text-center min-w-[120px] z-10">
                <div className="text-gray-300 text-sm mb-1">急症就诊</div>
                <div className="text-cyan-400 text-2xl font-bold">79</div>
             </div>
             <div className="absolute bottom-[20%] right-[20%] bg-[#0b1426]/90 border border-cyan-500/50 p-3 rounded shadow-[0_0_15px_rgba(0,255,255,0.2)] text-center min-w-[120px] z-10">
                <div className="text-gray-300 text-sm mb-1">入院人数</div>
                <div className="text-cyan-400 text-2xl font-bold">41</div>
             </div>
          </div>

          {/* Financial Analysis */}
          <div className="bg-[#0b1426]/80 border border-cyan-500/20 rounded-lg p-4 flex-[2] flex flex-col relative shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]">
            <PanelHeader title="全院财务分析" />
            
            <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
              <button className="px-3 py-1 text-cyan-400 border-b-2 border-cyan-400 text-sm">全院收支分析</button>
              <button className="px-3 py-1 text-gray-400 hover:text-cyan-400 text-sm">门诊财务分析</button>
              <button className="px-3 py-1 text-gray-400 hover:text-cyan-400 text-sm">急诊财务分析</button>
              <button className="px-3 py-1 text-gray-400 hover:text-cyan-400 text-sm">住院财务分析</button>
            </div>

            <div className="flex items-center justify-center gap-8 mb-6">
               <div className="w-16 h-16 bg-cyan-900/30 rounded-full flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  <span className="text-cyan-400 text-2xl font-bold">¥</span>
               </div>
               <div>
                 <div className="text-gray-400 text-sm mb-1">医疗盈余</div>
                 <div className="text-cyan-400 text-4xl font-bold tracking-wider">38669343.34<span className="text-lg ml-1">元</span></div>
               </div>
               <div className="ml-8">
                 <div className="text-gray-400 text-sm mb-1">增长率</div>
                 <div className="text-green-400 text-xl font-bold flex items-center"><ArrowUp size={16} className="mr-1"/> 0.1%</div>
               </div>
            </div>

            <div className="flex-1 flex">
               <div className="flex-1 flex flex-col items-center">
                  <div className="text-gray-300 text-sm mb-2">医疗服务收入占比</div>
                  <div className="relative w-32 h-32">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie data={[{value: 19}, {value: 81}]} cx="50%" cy="50%" innerRadius={40} outerRadius={55} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                              <Cell fill="#00E5FF" />
                              <Cell fill="#1e293b" />
                           </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-xl font-bold text-white">19%</span>
                     </div>
                  </div>
                  <div className="text-green-400 text-xs mt-2 flex items-center"><ArrowUp size={12} className="mr-1"/> 增长率 5%</div>
               </div>
               
               <div className="flex-1 flex flex-col items-center">
                  <div className="text-gray-300 text-sm mb-2">支出结构分析</div>
                  <div className="flex items-center justify-center w-full h-full">
                     <div className="w-32 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie data={financialPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="#0b1426" strokeWidth={2}>
                                 {financialPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                              </Pie>
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="ml-4 flex flex-col gap-2">
                        {financialPieData.map((item, idx) => (
                           <div key={idx} className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 rounded-sm" style={{backgroundColor: item.color}}></div>
                              <span className="text-gray-400 w-16">{item.name}</span>
                              <span className="text-cyan-400">{item.value}%</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
          {/* Inpatient Analysis */}
          <div className="bg-[#0b1426]/80 border border-cyan-500/20 rounded-lg p-4 flex-1 flex flex-col relative shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]">
            <PanelHeader title="住院业务分析" />
            
            <div className="grid grid-cols-3 gap-2 mb-6">
              <MetricCard label="在院人数" value="576" subLabel="较昨日" subValue="0.3%" trend="up" />
              <MetricCard label="转科人数" value="0" subLabel="较昨日" subValue="0%" trend="neutral" />
              <MetricCard label="平均住院日" value="11.615" subLabel="较昨日" subValue="30.5%" trend="up" />
            </div>

            <div className="text-gray-300 font-bold text-sm mb-3 flex items-center gap-2">
               <div className="w-1 h-3 bg-cyan-400"></div>
               出入院趋势分析
            </div>

            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded text-sm">总人次</button>
              <button className="px-3 py-1 text-gray-400 hover:text-cyan-400 text-sm">传染病人次</button>
            </div>

            <div className="flex-1 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={admissionTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
                  <Area type="monotone" dataKey="discharge" name="出院人次" stroke="#00E5FF" fillOpacity={1} fill="url(#colorDis)" />
                  <Area type="monotone" dataKey="admission" name="入院人次" stroke="#FBBF24" fillOpacity={1} fill="url(#colorAd)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ratio Evaluation */}
          <div className="bg-[#0b1426]/80 border border-cyan-500/20 rounded-lg p-4 flex-1 flex flex-col relative shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]">
            <PanelHeader title="门诊诊位与住院床位配比评价" />
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center border-r border-gray-800">
                 <div className="text-gray-400 text-[10px] mb-1">门诊人次数与出院人次数比</div>
                 <div className="text-cyan-400 text-xl font-bold">4.37</div>
              </div>
              <div className="text-center border-r border-gray-800">
                 <div className="text-gray-400 text-[10px] mb-1">全院月均每诊位门诊量</div>
                 <div className="text-cyan-400 text-xl font-bold">195.146</div>
              </div>
              <div className="text-center">
                 <div className="text-gray-400 text-[10px] mb-1">全院累计多余床位数</div>
                 <div className="text-cyan-400 text-xl font-bold">176</div>
              </div>
            </div>

            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis type="number" dataKey="x" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 30000]} tickCount={7} />
                  <YAxis type="number" dataKey="y" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 3000]} tickCount={7} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Scatter data={scatterData} fill="#3B82F6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Outpatient Analysis Modal */}
      {isOutpatientModalOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
          <div className="bg-[#141b2d] border border-gray-800 w-full max-w-6xl h-full max-h-[85vh] rounded-lg shadow-2xl flex flex-col relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Play size={12} className="text-orange-500 fill-orange-500" />
                <h2 className="text-white text-lg font-medium">实时动态</h2>
              </div>
              <button 
                onClick={() => setIsOutpatientModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              {/* Controls */}
              <div className="flex flex-col gap-6">
                {/* Toggle */}
                <div className="flex border border-cyan-500/30 rounded w-fit overflow-hidden">
                  <button 
                    onClick={() => setActiveModalTab('time')}
                    className={`px-6 py-1.5 text-sm font-medium border-r border-cyan-500/30 transition-colors ${activeModalTab === 'time' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    时间
                  </button>
                  <button 
                    onClick={() => setActiveModalTab('dept')}
                    className={`px-6 py-1.5 text-sm font-medium border-r border-cyan-500/30 transition-colors ${activeModalTab === 'dept' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    科室
                  </button>
                  <button 
                    onClick={() => setActiveModalTab('doctor')}
                    className={`px-6 py-1.5 text-sm font-medium transition-colors ${activeModalTab === 'doctor' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    医生
                  </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm">医生：</span>
                    <div className="relative">
                      <select className="appearance-none bg-[#0b1426] border border-cyan-500/30 text-gray-300 text-sm rounded px-4 py-1.5 pr-10 outline-none focus:border-cyan-400 min-w-[200px]">
                        <option>请选择</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm">日期：</span>
                    <div className="relative">
                      <input type="text" placeholder="选择日期" className="bg-[#0b1426] border border-cyan-500/30 text-gray-300 text-sm rounded px-4 py-1.5 pr-10 outline-none focus:border-cyan-400 min-w-[200px]" readOnly />
                      <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={outpatientModalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="doctor" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 40]} tickCount={5} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="green" stroke="#22c55e" fillOpacity={1} fill="url(#colorGreen)" />
                    <Area type="monotone" dataKey="blue" stroke="#06b6d4" fillOpacity={1} fill="url(#colorBlue)" />
                    <Area type="monotone" dataKey="orange" stroke="#f97316" fillOpacity={1} fill="url(#colorOrange)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="w-full mt-4">
                <table className="w-full text-sm text-center text-gray-300">
                  <thead className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-t border-cyan-500/50">
                    <tr>
                      <th className="py-3 px-4 font-medium">医生</th>
                      <th className="py-3 px-4 font-medium">门急诊人次</th>
                      <th className="py-3 px-4 font-medium">门诊人次</th>
                      <th className="py-3 px-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {outpatientModalData.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5">
                        <td className="py-3 px-4">{row.doctor}</td>
                        <td className="py-3 px-4">{row.total}</td>
                        <td className="py-3 px-4">{row.outpatient}</td>
                        <td className="py-3 px-4">{row.emergency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default DeanCockpit;
