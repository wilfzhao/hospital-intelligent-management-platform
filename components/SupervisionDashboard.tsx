import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  LayoutDashboard, CheckCircle2, Clock, AlertTriangle, 
  TrendingUp, Activity, FileText, Users 
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

const CATEGORY_DATA = [
  { subject: '党的建设', A: 85, fullMark: 100 },
  { subject: '医疗质量', A: 90, fullMark: 100 },
  { subject: '运营管理', A: 75, fullMark: 100 },
  { subject: '学科建设', A: 80, fullMark: 100 },
  { subject: '人才培养', A: 70, fullMark: 100 },
  { subject: '科研创新', A: 65, fullMark: 100 },
];

const TREND_DATA = [
  { month: '1月', total: 45, completed: 10 },
  { month: '2月', total: 52, completed: 18 },
  { month: '3月', total: 68, completed: 25 },
  { month: '4月', total: 74, completed: 35 },
  { month: '5月', total: 89, completed: 48 },
  { month: '6月', total: 102, completed: 62 },
];

const RECENT_ALERTS = [
  { id: 1, task: '关于推进医院高质量发展的实施方案', dept: '院办', status: '即将逾期', time: '2小时前', type: 'warning' },
  { id: 2, task: '2026年度医疗质量安全专项检查', dept: '医务处', status: '进度滞后', time: '5小时前', type: 'danger' },
  { id: 5, task: '重点专科建设资金拨付审批', dept: '财务处', status: '即将逾期', time: '8小时前', type: 'warning' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Categories Radar Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            大项分类分布
          </h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={CATEGORY_DATA}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="项目数量" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Tooltip 
                  formatter={(value: any) => [`${value} 个`, '项目数量']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Trend Line Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
            项目趋势分析
          </h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                <Area type="monotone" dataKey="total" name="项目数" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAdded)" />
                <Area type="monotone" dataKey="completed" name="完成项目数" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
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
