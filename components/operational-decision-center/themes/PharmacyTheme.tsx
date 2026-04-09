/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  Clock, RefreshCw, FileText, Activity, TrendingUp, BarChart3, 
  PieChart, FlaskConical, Check, Layers
} from 'lucide-react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Pie, Cell, PieChart as RePieChart
} from 'recharts';

interface PharmacyThemeProps {
  activePharmacyTab: 'antibacterial' | 'prescription' | 'monitoring';
  setActivePharmacyTab: (tab: 'antibacterial' | 'prescription' | 'monitoring') => void;
}

const PharmacyTheme: React.FC<PharmacyThemeProps> = ({
  activePharmacyTab,
  setActivePharmacyTab,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            药学主题分析大屏
            {activePharmacyTab === 'monitoring' && (
              <>
                <span className="flex h-3 w-3 relative ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Live</span>
              </>
            )}
          </h2>
          <p className="text-sm text-gray-500 mt-1">抗菌药物使用、处方结构分析及药房实时运营监控</p>
        </div>
        <div className="flex items-center gap-3">
          {activePharmacyTab === 'monitoring' ? (
            <>
              <span className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14}/> 数据更新于刚刚</span>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                手动刷新
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-50 text-blue-600">本月</button>
                <button className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50">上月</button>
                <button className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50">本年</button>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <FileText size={16} />
                生成分析报告
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activePharmacyTab === 'antibacterial' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActivePharmacyTab('antibacterial')}
        >
          抗菌药物与合理用药
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activePharmacyTab === 'prescription' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActivePharmacyTab('prescription')}
        >
          门诊处方结构分析
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activePharmacyTab === 'monitoring' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActivePharmacyTab('monitoring')}
        >
          药房运营监控
        </button>
      </div>

      {/* Tab Content */}
      {activePharmacyTab === 'antibacterial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1">
              <div className="text-sm text-gray-500 mb-2">住院DDDs抗菌药物使用强度</div>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold text-gray-900">38.5</div>
                <div className="text-sm text-gray-500 mb-1">DDDs</div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">同比 (YoY)</span>
                  <span className="text-emerald-600 font-medium flex items-center"><TrendingUp size={14} className="rotate-180 mr-1"/> 2.4%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">环比 (MoM)</span>
                  <span className="text-emerald-600 font-medium flex items-center"><TrendingUp size={14} className="rotate-180 mr-1"/> 1.1%</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
                  <span className="text-gray-500">目标值</span>
                  <span className="text-gray-900 font-medium">&lt; 40.0</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-2">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={18} className="text-blue-600" />
                住院DDDs抗菌药物使用强度趋势
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: '1月', ddds: 39.2 },
                    { month: '2月', ddds: 38.8 },
                    { month: '3月', ddds: 39.5 },
                    { month: '4月', ddds: 38.1 },
                    { month: '5月', ddds: 37.9 },
                    { month: '6月', ddds: 38.5 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis domain={[35, 45]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <ReferenceLine y={40} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '目标线 (40)', fill: '#ef4444', fontSize: 12 }} />
                    <Line type="monotone" dataKey="ddds" name="使用强度" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-600" />
                抗菌药物处方数与金额趋势
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> 处方数 (张)</span>
                <span className="flex items-center gap-1 ml-3"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> 金额 (万元)</span>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { date: '1日', count: 120, amount: 1.5 },
                  { date: '5日', count: 135, amount: 1.8 },
                  { date: '10日', count: 110, amount: 1.4 },
                  { date: '15日', count: 145, amount: 2.1 },
                  { date: '20日', count: 125, amount: 1.6 },
                  { date: '25日', count: 150, amount: 2.3 },
                  { date: '30日', count: 130, amount: 1.7 },
                ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#ef4444" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar yAxisId="left" dataKey="count" name="处方数" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                  <Line yAxisId="right" type="monotone" dataKey="amount" name="金额(万元)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activePharmacyTab === 'prescription' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart size={18} className="text-blue-600" />
                门诊处方数结构
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: '1月', western: 12000, patent: 4000, herbal: 2500 },
                    { month: '2月', western: 11500, patent: 3800, herbal: 2200 },
                    { month: '3月', western: 13000, patent: 4500, herbal: 2800 },
                    { month: '4月', western: 12500, patent: 4200, herbal: 2600 },
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="western" name="西药处方" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="patent" name="中成药处方" stackId="a" fill="#10b981" />
                    <Bar dataKey="herbal" name="中药饮片处方" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-emerald-600" />
                门诊处方金额结构
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: '1月', western: 180, patent: 60, herbal: 40 },
                    { month: '2月', western: 175, patent: 58, herbal: 38 },
                    { month: '3月', western: 195, patent: 68, herbal: 45 },
                    { month: '4月', western: 185, patent: 65, herbal: 42 },
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip formatter={(value: any) => `${value} 万元`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="western" name="西药金额(万)" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="patent" name="中成药金额(万)" stackId="a" fill="#10b981" />
                    <Bar dataKey="herbal" name="中药饮片金额(万)" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-2">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FlaskConical size={18} className="text-purple-600" />
                中药制剂 / 中药颗粒 使用情况
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '中药制剂', count: 1250, amount: 15.2 },
                    { name: '中药颗粒', count: 850, amount: 12.5 },
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#ec4899" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar yAxisId="left" dataKey="count" name="处方数" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar yAxisId="right" dataKey="amount" name="金额(万元)" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 flex flex-col">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Check size={18} className="text-emerald-600" />
                国家基本药物使用占比
              </h3>
              <div className="flex-1 flex flex-col justify-center">
                <div className="h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={[
                          { name: '基本药物', value: 65, color: '#10b981' },
                          { name: '非基本药物', value: 35, color: '#e5e7eb' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        {
                          [
                            { name: '基本药物', value: 65, color: '#10b981' },
                            { name: '非基本药物', value: 35, color: '#e5e7eb' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Pie>
                      <Tooltip formatter={(value: any) => `${value}%`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-gray-900">65%</span>
                    <span className="text-xs text-gray-500">处方数占比</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">处方数</div>
                    <div className="text-lg font-bold text-gray-900">8,900</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">金额(万元)</div>
                    <div className="text-lg font-bold text-emerald-600">120.5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePharmacyTab === 'monitoring' && (
        <div className="space-y-6 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-100 text-gray-800 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px]"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 blur-[100px]"></div>
          </div>

          <div className="relative z-10 flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              药房实时运营指挥舱
            </h3>
            <div className="flex items-center gap-2 text-blue-600 text-sm font-mono bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              SYSTEM ONLINE // {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {/* KPI 1 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform origin-left scale-x-100 transition-transform"></div>
              <div className="text-sm text-gray-500 mb-2">当前总排队人数</div>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-mono font-bold text-blue-600">40</div>
                <div className="text-sm text-gray-500 mb-1">人</div>
              </div>
              <div className="text-xs text-blue-500 mt-2 flex items-center"><TrendingUp size={14} className="mr-1"/> 较过去1小时增加 12 人</div>
            </div>
            {/* KPI 2 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
              <div className="text-sm text-gray-500 mb-2">当日发药处方数</div>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-mono font-bold text-emerald-600">1,002</div>
                <div className="text-sm text-gray-500 mb-1">单</div>
              </div>
              <div className="text-xs text-emerald-500 mt-2 flex items-center"><TrendingUp size={14} className="mr-1"/> 较昨日同期 +5%</div>
            </div>
            {/* KPI 3 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400"></div>
              <div className="text-sm text-gray-500 mb-2">当日发药金额</div>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-mono font-bold text-purple-600">28.5</div>
                <div className="text-sm text-gray-500 mb-1">万元</div>
              </div>
              <div className="text-xs text-purple-500 mt-2 flex items-center"><TrendingUp size={14} className="mr-1"/> 较昨日同期 +2%</div>
            </div>
          </div>

          <div className="relative z-10">
            {/* Windows Grid */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Layers size={16} />
                各窗口实时负载监控
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { window: '1号窗口 (西药)', queue: 12, workload: 345, status: 'busy', maxQueue: 15, waitTime: '18 min' },
                  { window: '2号窗口 (西药)', queue: 8, workload: 312, status: 'normal', maxQueue: 15, waitTime: '10 min' },
                  { window: '3号窗口 (中成药)', queue: 5, workload: 189, status: 'normal', maxQueue: 15, waitTime: '6 min' },
                  { window: '4号窗口 (中药饮片)', queue: 15, workload: 156, status: 'busy', maxQueue: 15, waitTime: '25 min' },
                  { window: '5号窗口 (急诊用药)', queue: 3, workload: 210, status: 'normal', maxQueue: 10, waitTime: '3 min' },
                  { window: '6号窗口 (慢性病)', queue: 14, workload: 420, status: 'busy', maxQueue: 20, waitTime: '20 min' },
                  { window: '7号窗口 (特病用药)', queue: 2, workload: 85, status: 'normal', maxQueue: 10, waitTime: '2 min' },
                  { window: '8号窗口 (综合咨询)', queue: 6, workload: 120, status: 'normal', maxQueue: 10, waitTime: '8 min' },
                ].map((w, idx) => (
                  <div key={idx} className={`bg-white p-4 rounded-xl border ${w.status === 'busy' ? 'border-rose-200 shadow-[0_4px_15px_rgba(244,63,94,0.05)]' : 'border-gray-100 shadow-sm'} transition-all`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-gray-900 font-bold">{w.window}</div>
                        <div className="text-xs text-gray-500 mt-1">预计等候: <span className={w.status === 'busy' ? 'text-rose-500 font-medium' : 'text-blue-500 font-medium'}>{w.waitTime}</span></div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-mono border ${w.status === 'busy' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                        {w.status === 'busy' ? '高负载' : '正常'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">排队人数</span>
                        <span className="font-mono text-gray-700 font-medium">{w.queue} / {w.maxQueue}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200/50">
                        <div 
                          className={`h-full rounded-full relative ${w.status === 'busy' ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`} 
                          style={{ width: `${(w.queue / w.maxQueue) * 100}%` }}
                        >
                          <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-[pulse_2s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                      <span className="text-gray-500">累计处理单量</span>
                      <span className="font-mono text-gray-700 font-medium">{w.workload} 单</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyTheme;
