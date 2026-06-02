
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, CheckCircle2, Clock, AlertTriangle, 
  Target, Users, Calendar, ArrowUpRight, Activity
} from 'lucide-react';

// Shared data structures from Ledger components (Simplified for Overview)
const MOCK_SUMMARY_DATA = [
  { name: '已办结', value: 42, color: '#10b981' },
  { name: '推进中', value: 35, color: '#4f46e5' },
  { name: '刚启动', value: 15, color: '#3b82f6' },
  { name: '滞后', value: 8, color: '#f59e0b' },
  { name: '未启动', value: 5, color: '#94a3b8' },
  { name: '遇阻', value: 3, color: '#ef4444' },
];

const DEPT_WORKLOAD_DATA = [
  { name: '医务处', tasks: 24, completed: 18, risk: 2 },
  { name: '人事处', tasks: 18, completed: 12, risk: 3 },
  { name: '科技处', tasks: 15, completed: 10, risk: 1 },
  { name: '信息中心', tasks: 28, completed: 15, risk: 5 },
  { name: '财务处', tasks: 12, completed: 12, risk: 0 },
  { name: '后勤保障处', tasks: 10, completed: 8, risk: 1 },
];

const MONTHLY_TREND_DATA = [
  { name: '1月', total: 45, completed: 38 },
  { name: '2月', total: 52, completed: 42 },
  { name: '3月', total: 48, completed: 40 },
  { name: '4月', total: 60, completed: 45 },
  { name: '5月', total: 65, completed: 52 },
  { name: '6月', total: 72, completed: 58 },
];

const CATEGORY_STATS = [
  { category: '高峰学科', count: 12, completion: 85 },
  { category: '高原学科', count: 8, completion: 72 },
  { category: '特色学科', count: 6, completion: 90 },
  { category: '新兴学科', count: 4, completion: 60 },
];

const WARNING_ITEMS = [
  { id: '1', matter: '智慧医疗HIS系统数据中台API接口开放', dept: '信息中心', deadline: '2026-06-15', status: '滞后', impact: '高' },
  { id: '2', matter: '学科专项绩效考核办法修订', dept: '人事处', deadline: '2026-07-20', status: '遇阻', impact: '高' },
  { id: '3', matter: '海外高层次人才引进配套经费拨付', dept: '财务处', deadline: '2026-06-10', status: '推进中', impact: '中', risk: '预计逾期' },
];

export const DisciplineOverview: React.FC = () => {
  const stats = useMemo(() => {
    const total = MOCK_SUMMARY_DATA.reduce((acc, item) => acc + item.value, 0);
    const completed = MOCK_SUMMARY_DATA.find(i => i.name === '已办结')?.value || 0;
    const abnormal = MOCK_SUMMARY_DATA.filter(i => ['滞后', '遇阻'].includes(i.name)).reduce((acc, item) => acc + item.value, 0);
    const rate = ((completed / total) * 100).toFixed(1);
    return { total, completed, abnormal, rate };
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-10">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm text-indigo-600">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">综合执行概览</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Comprehensive Execution Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
           <Calendar size={14} className="text-gray-400" />
           <span className="text-xs font-bold text-gray-600">统计周期: 2026年度 (截至今日)</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-6">
        {/* Total Periods Card - Special Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all active:scale-[0.98] cursor-default flex flex-col justify-between"
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">总期数</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-indigo-600">32</span>
                  <span className="text-xs font-bold text-gray-400">期</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Calendar size={20} />
              </div>
            </div>
            
            {/* Discipline Categories breakdown - Compact Inline Version */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap items-center gap-x-2 gap-y-1">
              {CATEGORY_STATS.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-500">{cat.category.substring(0, 2)}</span>
                  <span className="text-[10px] font-black text-indigo-600">{cat.count}</span>
                  {idx < CATEGORY_STATS.length - 1 && <span className="text-[10px] text-gray-200">/</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {[
          { label: '议定事项总数', value: stats.total, unit: '条', sub: '本年度累计决策', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: '累计办结完成', value: stats.completed, unit: '条', sub: '已审核归档事项', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: '异常/预警事项', value: stats.abnormal, unit: '条', sub: '滞后或遇阻事项', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
          { label: '总体办结率', value: stats.rate, unit: '%', sub: '同比提升 4.2%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (idx + 1) * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all active:scale-[0.98] cursor-default"
          >
            <div className="flex items-start justify-between relative z-10 text-nowrap">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black ${item.color}`}>{item.value}</span>
                  <span className="text-xs font-bold text-gray-400">{item.unit}</span>
                </div>
              </div>
              <div className={`p-3 ${item.bg} ${item.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                <item.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between relative z-10 pt-4 border-t border-gray-50">
               <span className="text-[10px] font-bold text-gray-400">{item.sub}</span>
               <ArrowUpRight size={14} className="text-gray-300" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 h-[400px]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">办结状态分布</h3>
            <span className="text-[10px] font-bold text-gray-400">STATUS DIST.</span>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_SUMMARY_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_SUMMARY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: '800', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {MOCK_SUMMARY_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">{item.name}</span>
                <span className="text-[11px] font-black text-gray-900 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Completion Trend */}
        <div className="col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 h-[400px]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">年度事项办结趋势</h3>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                  <span className="text-[10px] font-bold text-gray-400">总事项</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  <span className="text-[10px] font-bold text-gray-400">已完结</span>
               </div>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND_DATA}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#e2e8f0" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                <Area type="monotone" dataKey="completed" stroke="#4f46e5" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-5 gap-6">
        {/* Departmental Workload */}
        <div className="col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 h-[400px]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">各归口部门事项分布</h3>
            <span className="text-[10px] font-bold text-gray-400">DEPT WORKLOAD</span>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_WORKLOAD_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }}
                  width={80}
                />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="tasks" stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warning Items Table */}
        <div className="col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 h-[400px]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">高风险/异常事项速览</h3>
            <div className="flex items-center gap-1 text-rose-500">
               <AlertTriangle size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">Priority Warning</span>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
            {WARNING_ITEMS.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-white hover:border-rose-100 transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="text-xs font-black text-gray-900 leading-relaxed flex-1 group-hover:text-rose-600 transition-colors">
                    {item.matter}
                  </h4>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tight ${item.status === '遇阻' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                       <Users size={10} className="text-gray-400" />
                       <span className="text-[10px] font-bold text-gray-500">{item.dept}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Clock size={10} className="text-gray-400" />
                       <span className="text-[10px] font-bold text-gray-500">截止: {item.deadline}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-1 rounded uppercase">影响: {item.impact}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-2 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-xl border border-gray-100 hover:bg-white hover:text-indigo-600 hover:border-indigo-100 transition-all">
            查看更多预警事项 View All
          </button>
        </div>
      </div>

      {/* Discipline Category Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">各学科类别执行表现</h3>
          <span className="text-[10px] font-bold text-gray-400">DISCIPLINE CATEGORY ANALYSIS</span>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {CATEGORY_STATS.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-4 hover:shadow-md hover:bg-white transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-900">{item.category}</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  {item.count} 项
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400">整体办结进度</span>
                  <span className="text-xs font-black text-gray-900">{item.completion}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.completion}%` }}
                    className="h-full bg-indigo-600 rounded-full group-hover:bg-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold mt-1">
                 <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 size={10} />
                    按期完成
                 </span>
                 <span className="text-gray-400">平均周期: 12.4d</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
