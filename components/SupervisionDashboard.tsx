import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  LayoutDashboard, CheckCircle2, Clock, AlertTriangle, 
  Activity, FileText, Users, ChevronRight
} from 'lucide-react';

// Mock Data
const KPI_DATA = [
  { title: '项目总数', value: 128, icon: FileText, color: 'blue' },
  { title: '进行中', value: 45, icon: Activity, color: 'indigo' },
  { title: '已完成', value: 76, icon: CheckCircle2, color: 'emerald' },
  { title: '逾期预警', value: 7, icon: AlertTriangle, color: 'rose' },
];

const DEPT_DATA = [
  { name: '党办', completed: 25, inProgress: 10, overdue: 1 },
  { name: '院办', completed: 18, inProgress: 8, overdue: 2 },
  { name: '医务处', completed: 15, inProgress: 12, overdue: 3 },
  { name: '护理部', completed: 10, inProgress: 5, overdue: 0 },
  { name: '人事处', completed: 8, inProgress: 10, overdue: 1 },
];

const FUNNEL_DATA = [
  { value: 128, name: '已拆解季度任务', fill: '#3b82f6', percent: '100%' },
  { value: 110, name: '已填报', fill: '#6366f1', percent: '86%' },
  { value: 95, name: '已审核', fill: '#8b5cf6', percent: '74%' },
  { value: 76, name: '已评阅', fill: '#10b981', percent: '59%' },
];

const RECENT_ALERTS = [
  { id: 1, task: '关于推进医院高质量发展的实施方案', dept: '院办', status: '即将逾期', time: '2小时前', type: 'warning' },
  { id: 2, task: '2026年度医疗质量安全专项检查', dept: '医务处', status: '进度滞后', time: '5小时前', type: 'danger' },
  { id: 5, task: '重点专科建设资金拨付审批', dept: '财务处', status: '即将逾期', time: '8小时前', type: 'warning' },
];

export const SupervisionDashboard: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            全景看板
          </h1>
          <p className="text-sm text-gray-500 mt-1">实时监控全院督办项目执行情况，辅助管理决策</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            <option>2026年度</option>
            <option>2025年度</option>
          </select>
          <select className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            <option>全院所有部门</option>
            <option>党办</option>
            <option>院办</option>
            <option>医务处</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi, index) => {
          const Icon = kpi.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            indigo: 'bg-indigo-50 text-indigo-600',
            emerald: 'bg-emerald-50 text-emerald-600',
            rose: 'bg-rose-50 text-rose-600',
          }[kpi.color] || 'bg-gray-50 text-gray-600';

          return (
            <div key={index} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${colorClasses}`}>
                  <Icon size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className="text-sm text-gray-500 font-medium">{kpi.title}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1: Project Execution Funnel */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
              项目执行全流程漏斗
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded border border-green-100 italic">
                整体完成率: 59%
              </span>
              <span className="text-xs text-gray-400 font-medium">数据更新至: 今天 08:30</span>
            </div>
          </div>
          
          <div className="flex-1 min-h-[350px] flex items-center justify-center">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Funnel Steps */}
              {FUNNEL_DATA.map((item, index) => (
                <div key={index} className="flex flex-col items-center relative group">
                  {/* The Trapezoid/Box represent the stage */}
                  <div className="w-full flex flex-col items-center">
                    <div 
                      className="w-full h-32 rounded-xl flex flex-col items-center justify-center text-white relative transition-all group-hover:shadow-lg group-hover:-translate-y-1 overflow-hidden"
                      style={{ 
                        backgroundColor: item.fill,
                        opacity: 1 - (index * 0.1),
                        clipPath: `polygon(${index * 10}% 0%, ${100 - (index * 10)}% 0%, ${100 - ((index + 1) * 10)}% 100%, ${(index + 1) * 10}% 100%)`
                      }}
                    >
                      <div className="text-2xl font-black mb-1 drop-shadow-sm">{item.value}</div>
                      <div className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">个项目</div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-sm font-bold text-gray-800">{item.name}</div>
                      <div className="text-[11px] text-gray-400 font-medium mt-1">
                        总占比: <span className="text-gray-600 font-bold">{item.percent}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow Connector */}
                  {index < FUNNEL_DATA.length - 1 && (
                    <div className="hidden md:flex absolute -right-6 top-16 -translate-y-1/2 z-20">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-300">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loss Labels between stages */}
              <div className="hidden md:grid grid-cols-3 absolute top-0 left-0 right-0 h-8 pointer-events-none translate-x-[16.6%]">
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">-14.1% 损耗</span>
                </div>
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">-13.6% 损耗</span>
                </div>
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">-20.0% 损耗</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
              <Activity size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-indigo-900 mb-1">执行链路分析建议</h4>
              <p className="text-xs text-indigo-700 leading-relaxed">
                当前项目流失主要集中在 <span className="font-bold underline">“已审核 → 已评阅”</span> 环节（减少了 19 个项目），反映部分中层管理者在终审评阅效率上存在卡点。建议优化评阅流程，或在督办系统中开启“一键批量评阅”功能以提高流转效率。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>
            各部门项目执行情况
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                <Bar dataKey="completed" name="已完成" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="inProgress" name="进行中" stackId="a" fill="#3b82f6" />
                <Bar dataKey="overdue" name="逾期" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts List */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-4 bg-rose-600 rounded-full"></div>
              督办预警动态
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">查看全部</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {RECENT_ALERTS.map((alert) => {
              const typeStyles = {
                warning: 'bg-amber-50 border-amber-100 text-amber-800',
                danger: 'bg-rose-50 border-rose-100 text-rose-800',
                info: 'bg-blue-50 border-blue-100 text-blue-800',
                success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
              }[alert.type];

              return (
                <div key={alert.id} className={`p-3 rounded-lg border ${typeStyles} flex flex-col gap-2`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-sm line-clamp-2 leading-snug">{alert.task}</span>
                    <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/60">
                      {alert.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs opacity-80">
                    <span className="flex items-center gap-1"><Users size={12} /> {alert.dept}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {alert.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
