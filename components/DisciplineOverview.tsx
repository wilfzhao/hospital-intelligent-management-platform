
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  CheckCircle2, Clock, 
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

const WARNING_ITEMS = [
  { id: '1', matter: '智慧医疗HIS系统数据中台API接口开放', dept: '信息中心', updatedAt: '2026-06-05', action: '填报' },
  { id: '2', matter: '学科专项绩效考核办法修订', dept: '人事处', updatedAt: '2026-06-07', action: '审核' },
  { id: '3', matter: '海外高层次人才引进配套经费拨付', dept: '财务处', updatedAt: '2026-06-06', action: '填报' },
];

export const DisciplineOverview: React.FC = () => {
  const stats = useMemo(() => {
    const total = MOCK_SUMMARY_DATA.reduce((acc, item) => acc + item.value, 0);
    const completed = MOCK_SUMMARY_DATA.find(i => i.name === '已办结')?.value || 0;
    return { total, completed };
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
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
           <Calendar size={14} className="text-gray-400" />
           <span className="text-xs font-bold text-gray-600">统计周期: 2026-2027年度</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6">
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
            
            {/* Meetings count - Opened/Not Opened */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400">已召开:</span>
                <span className="text-[10px] font-black text-emerald-600">28 期</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400">未召开:</span>
                <span className="text-[10px] font-black text-rose-500">4 期</span>
              </div>
            </div>
          </div>
        </motion.div>

        {[
          { label: '问题清单总数', value: stats.total, unit: '条', sub: '本年度累计决策', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: '累计办结完成', value: stats.completed, unit: '条', sub: '已审核归档事项', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
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

      {/* Main Charts Grid Area */}
      <div className="grid grid-cols-5 gap-6">
        {/* Left Side: Status and Workload */}
        <div className="col-span-3 space-y-6">
          {/* Departmental Workload */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 h-[824px]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">主责部门事项分布</h3>
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
        </div>

        {/* Right Side: Tall Work Records Section */}
        <div className="col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 h-[824px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">工作记录</h3>
            <div className="flex items-center gap-1 text-indigo-500">
               <Activity size={14} />
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
            {/* Added more items for a fuller list since height increased */}
            {[...WARNING_ITEMS, ...WARNING_ITEMS, ...WARNING_ITEMS].map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-white hover:border-indigo-100 transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="text-xs font-black text-gray-900 leading-relaxed flex-1 group-hover:text-indigo-600 transition-colors">
                    {item.matter}
                    {idx > 2 && <span className="ml-2 text-[10px] text-gray-300 font-normal">#复制项-{idx}</span>}
                  </h4>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tight ${item.action === '审核' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    {item.action}
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
                       <span className="text-[10px] font-bold text-gray-500">更新: {item.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-3 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-xl border border-gray-100 hover:bg-white hover:text-indigo-600 hover:border-indigo-100 transition-all mt-auto shadow-sm">
            查看更多记录
          </button>
        </div>
      </div>

    </div>
  );
};
