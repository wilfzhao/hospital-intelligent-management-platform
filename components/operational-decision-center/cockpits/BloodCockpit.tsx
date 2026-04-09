/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  AlertCircle, Droplets, TrendingUp, PieChart as PieChartIcon 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, 
  AreaChart, Area, Legend, PieChart as RePieChart, Pie 
} from 'recharts';

interface BloodCockpitProps {
  selectedCampus: string;
}

const BloodCockpit: React.FC<BloodCockpitProps> = () => {
  const bloodInventoryData = [
    { type: 'A型', red: 15, plasma: 25, plate: 5, cryo: 10 },
    { type: 'B型', red: 18, plasma: 22, plate: 4, cryo: 8 },
    { type: 'O型', red: 25, plasma: 35, plate: 8, cryo: 15 },
    { type: 'AB型', red: 8, plasma: 12, plate: 2, cryo: 5 },
  ];

  const bloodUsageTrendData = [
    { date: '03-18', value: 45, previous: 42 },
    { date: '03-19', value: 52, previous: 48 },
    { date: '03-20', value: 48, previous: 50 },
    { date: '03-21', value: 55, previous: 52 },
    { date: '03-22', value: 50, previous: 51 },
    { date: '03-23', value: 35, previous: 38 },
    { date: '03-24', value: 42, previous: 40 },
  ];

  const bloodTypeDistributionData = [
    { name: '红细胞', value: 45, color: '#ef4444' },
    { name: '血浆', value: 35, color: '#f87171' },
    { name: '血小板', value: 12, color: '#fca5a5' },
    { name: '冷沉淀', value: 8, color: '#fee2e2' },
  ];

  const bloodSafetyAlerts = [
    { type: 'O型红细胞', status: '库存紧缺', value: '2U', level: 'red' },
    { type: 'AB型血小板', status: '库存紧缺', value: '0U', level: 'red' },
    { type: 'A型血浆', status: '库存充足', value: '25U', level: 'green' },
    { type: 'B型红细胞', status: '库存预警', value: '5U', level: 'amber' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row: Inventory & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 血液库存监控 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Droplets className="text-rose-400" size={20} />
            血液库存监控 (单位: U)
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloodInventoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                <Bar dataKey="red" name="红细胞" stackId="a" fill="#ef4444" barSize={30} />
                <Bar dataKey="plasma" name="血浆" stackId="a" fill="#f87171" barSize={30} />
                <Bar dataKey="plate" name="血小板" stackId="a" fill="#fca5a5" barSize={30} />
                <Bar dataKey="cryo" name="冷沉淀" stackId="a" fill="#fee2e2" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 用血趋势监控 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <TrendingUp className="text-rose-400" size={20} />
            用血趋势监控
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bloodUsageTrendData}>
                <defs>
                  <linearGradient id="colorBlood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value: any) => [`${value} U`, '用血量']}
                />
                <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorBlood)" />
                <Area type="monotone" dataKey="previous" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Distribution & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用血类型分布 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[300px]">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <PieChartIcon className="text-rose-400" size={20} />
            用血类型分布
          </h3>
          <div className="flex-1 flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={bloodTypeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bloodTypeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4">
              {bloodTypeDistributionData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-400 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 血液安全预警 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[300px]">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <AlertCircle className="text-rose-400" size={20} />
            血液安全预警
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-3">
              {bloodSafetyAlerts.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-lg border flex items-center justify-between ${
                  alert.level === 'red' ? 'bg-red-500/10 border-red-500/30' :
                  alert.level === 'amber' ? 'bg-amber-500/10 border-amber-500/30' :
                  'bg-emerald-500/10 border-emerald-500/30'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      alert.level === 'red' ? 'bg-red-500/20 text-red-400' :
                      alert.level === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      <Droplets size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{alert.type}</div>
                      <div className={`text-xs ${
                        alert.level === 'red' ? 'text-red-400' :
                        alert.level === 'amber' ? 'text-amber-400' :
                        'text-emerald-400'
                      }`}>{alert.status}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-white">{alert.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCockpit;
