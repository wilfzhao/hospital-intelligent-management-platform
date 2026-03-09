import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, PieChart, BarChart3, FileText, 
  Activity, GraduationCap, Settings, Layers, Binary,
  FileBarChart, ArrowRight, TrendingUp,
  ChevronRight, ChevronDown, LayoutGrid, Home, Search, ChevronLeft
} from 'lucide-react';
import {
  PieChart as RePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter, ZAxis, Legend, ReferenceLine, LabelList
} from 'recharts';
import { RotateCcw, List, Calendar, Check, RefreshCw, Clock, AlertCircle, FlaskConical, Beaker, Filter } from 'lucide-react';

// Mock Data for Department Selector
const MOCK_DEPARTMENTS = [
  { id: 'all', name: '全院', level: 0 },
  { id: 'outpatient', name: '门诊部', level: 0 },
  { id: 'op_internal', name: '门诊内科', level: 1 },
  { id: 'op_surgery', name: '门诊外科', level: 1 },
  { id: 'op_neuro', name: '神经外门诊(沿江)', level: 1 },
  { id: 'inpatient', name: '住院部', level: 0 },
  { id: 'ip_internal', name: '心血管内科', level: 1 },
  { id: 'ip_surgery', name: '普外科', level: 1 },
  { id: 'ip_ortho', name: '骨科', level: 1 },
];

const MOCK_REPORTS = [
  {
    id: 1,
    status: 'submitted',
    name: '抗菌药物DDD值月度报告(科室) -202504',
    type: '科室',
    department: '神经外门诊(沿江)',
    timeType: '月',
    reportTime: '2025-04',
    submitTime: '2025-05-27 09:37:57',
    submitter: '林谦宏',
    progress: 100,
    progressText: '100.00% (1/1)'
  },
  {
    id: 2,
    status: 'submitted',
    name: '自定义模板三-全院-2025-10-10',
    type: '全院',
    department: '全院',
    timeType: '月',
    reportTime: '2025-08',
    submitTime: '2025-10-10 11:22:34',
    submitter: '林谦宏',
    progress: 100,
    progressText: '100.00% (1/1)'
  }
];

// Stats Data
const STATS = [
  { label: '分析主题', value: 12, unit: '个', icon: Layers },
  { label: '分析专题', value: 8, unit: '个', icon: Binary },
  { label: '统计报表', value: 156, unit: '张', icon: FileBarChart },
  { label: '指标总数', value: 2450, unit: '个', icon: Activity },
  { label: '发布报告', value: 56, unit: '份', icon: FileText },
];

// Modules Data
const MODULES = [
  { 
    id: 'cockpit', 
    title: '驾驶舱', 
    desc: '全院运营态势一屏统览', 
    icon: LayoutDashboard, 
    gradient: 'from-blue-500 to-indigo-600',
    shadowColor: 'shadow-blue-200'
  },
  { 
    id: 'theme', 
    title: '主题分析', 
    desc: '多维数据深度关联分析', 
    icon: PieChart, 
    gradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-200'
  },
  { 
    id: 'report', 
    title: '统计报表', 
    desc: '业务数据报表查询与定制', 
    icon: BarChart3, 
    gradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-200'
  },
  { 
    id: 'doc', 
    title: '报告中心', 
    desc: '质控报告生成与归档', 
    icon: FileText, 
    gradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-200'
  },
  { 
    id: 'surgery', 
    title: '手术非常准', 
    desc: '术前术中术后全链路分析', 
    icon: Activity, 
    gradient: 'from-rose-500 to-pink-600',
    shadowColor: 'shadow-rose-200'
  },
  { 
    id: 'talent', 
    title: '学科与人才发展', 
    desc: '学科发展与梯队建设', 
    icon: GraduationCap, 
    gradient: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-200'
  },
  { 
    id: 'config', 
    title: '配置管理', 
    desc: '参数设置与规则定义', 
    icon: Settings, 
    gradient: 'from-slate-500 to-gray-600',
    shadowColor: 'shadow-slate-200'
  },
  { 
    id: 'er_return_monitor', 
    title: '计划外重返急诊就诊监测', 
    desc: '急诊重返率监控与分析', 
    icon: Activity, 
    gradient: 'from-red-500 to-rose-600',
    shadowColor: 'shadow-red-200'
  },
];

const OperationalDecisionCenter: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Report Center State
  const [isDeptSelectorOpen, setIsDeptSelectorOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string[]>([]);
  const deptSelectorRef = useRef<HTMLDivElement>(null);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [activeCockpitId, setActiveCockpitId] = useState<string | null>(null);
  const [selectedCampus, setSelectedCampus] = useState('全院');

  // Close switcher when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsSwitcherOpen(false);
      }
      if (deptSelectorRef.current && !deptSelectorRef.current.contains(event.target as Node)) {
        setIsDeptSelectorOpen(false);
      }
    };
    if (isSwitcherOpen || isDeptSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSwitcherOpen, isDeptSelectorOpen]);

  // --------------------------------------------------------------------------
  // View 1: Dashboard Grid (Entry Point)
  // --------------------------------------------------------------------------
  const renderDashboard = () => (
    <div className="flex flex-col h-full w-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 max-w-7xl mx-auto">
      {/* Header / Welcome Section */}
      <div className="flex flex-col gap-1 mb-2">
         <h1 className="text-2xl font-bold text-gray-800 tracking-tight">运营决策中心</h1>
         <p className="text-gray-500 text-sm">
           基于全院数据的智能化分析与决策支持平台，助力医院精细化管理
         </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATS.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                <stat.icon size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-800 tracking-tight">{stat.value}</span>
              <span className="text-xs text-gray-400">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MODULES.map((mod) => (
          <div 
            key={mod.id}
            onClick={() => setActiveModuleId(mod.id)}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            {/* Top Gradient Line */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${mod.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className="flex items-start gap-5 relative z-10">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.gradient} text-white flex items-center justify-center shadow-lg ${mod.shadowColor} transform group-hover:scale-110 transition-transform duration-300`}>
                 <mod.icon size={28} strokeWidth={1.5} />
              </div>

              {/* Text */}
              <div className="flex-1">
                 <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                    {mod.title}
                    <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                 </h3>
                 <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-600">
                    {mod.desc}
                 </p>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform rotate-12 scale-150 pointer-events-none">
               <mod.icon size={120} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderERReturnMonitor = () => {
    return (
      <div className="flex flex-col w-full bg-[#eef2f6] min-h-full">
        {/* Main Content Area */}
        <div className="px-6 pt-6 relative z-10 flex flex-col gap-4 pb-6">
          
          {/* Tabs */}
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-lg w-fit">
              <button className="px-4 py-1.5 bg-white text-blue-600 shadow-sm rounded-md text-sm font-medium flex items-center gap-2">
                <BarChart3 size={16} />
                数据分析
              </button>
              <button className="px-4 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-md text-sm font-medium flex items-center gap-2 transition-all">
                <FileText size={16} />
                患者列表
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg p-3 shadow-sm flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center bg-gray-100 rounded p-1 flex-wrap">
              <button className="px-3 py-1 bg-blue-500 text-white rounded shadow-sm">近一年</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors">近6月</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors">近3月</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors">上月</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors">自定义</button>
            </div>
            
            <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 bg-white">
              <span className="text-gray-400">📅</span>
              <span className="text-gray-600">2025-03 - 2026-02</span>
            </div>
            
            <div className="flex items-center gap-4 ml-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="type" defaultChecked className="text-blue-500" />
                <span className="text-gray-700">全部</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="type" className="text-blue-500" />
                <span className="text-gray-700">门诊</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="type" className="text-blue-500" />
                <span className="text-gray-700">住院</span>
              </label>
            </div>
            
            <div className="ml-2 border border-gray-200 rounded px-3 py-1.5 bg-white flex items-center justify-between w-32 cursor-pointer hover:border-blue-300 transition-colors">
              <span className="text-gray-500">全部科室</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            
            <button className="ml-auto px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm transition-colors">
              重置
            </button>
          </div>

          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-50 to-transparent"></div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 relative z-10">
                <FileText size={32} />
              </div>
              <div className="relative z-10">
                <div className="text-gray-500 text-sm mb-1">病例总数</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-800">20</span>
                  <span className="text-sm text-gray-500">人次</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-50 to-transparent"></div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 relative z-10">
                <FileText size={32} />
              </div>
              <div className="relative z-10">
                <div className="text-gray-500 text-sm mb-1">来源门诊病例数</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-800">15</span>
                  <span className="text-sm text-gray-500">人次</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-50 to-transparent"></div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 relative z-10">
                <FileText size={32} />
              </div>
              <div className="relative z-10">
                <div className="text-gray-500 text-sm mb-1">来源住院病例数</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-800">5</span>
                  <span className="text-sm text-gray-500">人次</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-gray-500 text-sm mb-2">当日总数</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-800">0</span>
                  <span className="text-sm text-gray-500">人次</span>
                </div>
                <div className="text-xs text-gray-400">实时更新：2026-03-05 11:45</div>
              </div>
              <div className="relative z-10 opacity-80">
                <div className="w-24 h-20 bg-blue-50 rounded-lg transform rotate-12 flex items-center justify-center border border-blue-100 shadow-sm">
                   <Activity className="text-blue-300" size={32} />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Chart 1: 年龄分布 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <h3 className="text-base font-bold text-gray-800 mb-4">年龄分布</h3>
              <div className="flex-1 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={[
                        { name: '0-18', value: 12, color: '#3b82f6' },
                        { name: '19-44', value: 0, color: '#4ade80' },
                        { name: '45-64', value: 0, color: '#60a5fa' },
                        { name: '65-74', value: 8, color: '#f59e0b' },
                        { name: '>=75', value: 0, color: '#e5e7eb' },
                      ]}
                      cx="40%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {
                        [
                          { name: '0-18', value: 12, color: '#3b82f6' },
                          { name: '19-44', value: 0, color: '#4ade80' },
                          { name: '45-64', value: 0, color: '#60a5fa' },
                          { name: '65-74', value: 8, color: '#f59e0b' },
                          { name: '>=75', value: 0, color: '#e5e7eb' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-xs text-gray-500">总</div>
                  <div className="text-2xl font-bold text-gray-800">20</div>
                </div>
                
                {/* Custom Legend */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                  {[
                    { name: '0-18', color: '#3b82f6' },
                    { name: '19-44', color: '#4ade80' },
                    { name: '45-64', color: '#60a5fa' },
                    { name: '65-74', color: '#f59e0b' },
                    { name: '>=75', color: '#e5e7eb' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: 重返急诊间隔时间分布 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-800">重返急诊间隔时间分布</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-3 h-1 bg-blue-500"></div>
                  <span>间隔时间</span>
                </div>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: '0-3', value: 17 },
                      { name: '3-7', value: 0 },
                      { name: '7-14', value: 0 },
                      { name: '14-30', value: 3 },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="value" fill="#60a5fa" barSize={20} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: 急诊分级分布 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <h3 className="text-base font-bold text-gray-800 mb-4">急诊分级分布</h3>
              <div className="flex-1 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={[
                        { name: '一级', value: 0, color: '#ef4444' },
                        { name: '二级', value: 25, color: '#f97316' },
                        { name: '三级', value: 50, color: '#eab308' },
                        { name: '四级', value: 25, color: '#22c55e' },
                      ]}
                      cx="40%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {
                        [
                          { name: '一级', value: 0, color: '#ef4444' },
                          { name: '二级', value: 25, color: '#f97316' },
                          { name: '三级', value: 50, color: '#eab308' },
                          { name: '四级', value: 25, color: '#22c55e' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
                
                {/* Custom Legend */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                  {[
                    { name: '一级', value: '0.0%', color: '#ef4444' },
                    { name: '二级', value: '25.0%', color: '#f97316' },
                    { name: '三级', value: '50.0%', color: '#eab308' },
                    { name: '四级', value: '25.0%', color: '#22c55e' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 w-12">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-600 w-10 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 4: 反馈结果分类 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <h3 className="text-base font-bold text-gray-800 mb-4">反馈结果分类</h3>
              <div className="flex-1 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={[
                        { name: '常规就诊', value: 50, color: '#38bdf8' },
                        { name: '因并发症重返急诊', value: 50, color: '#3b82f6' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {
                        [
                          { name: '常规就诊', value: 50, color: '#38bdf8' },
                          { name: '因并发症重返急诊', value: 50, color: '#3b82f6' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
                
                {/* Custom Labels for Donut */}
                <div className="absolute top-4 left-10 text-xs text-gray-600">
                  <div>常规就诊</div>
                  <div className="text-blue-400">0%</div>
                </div>
                <div className="absolute bottom-4 right-10 text-xs text-gray-600 text-right">
                  <div>因并发症重返急诊</div>
                  <div className="text-blue-500">0%</div>
                </div>
              </div>
            </div>

            {/* Chart 5: 月度总病例数 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-800">月度总病例数</h3>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div>感染科</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-sky-400 rounded-sm"></div>皮肤科</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded-sm"></div>消化内科</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400 rounded-sm"></div>呼吸内科</div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <ChevronLeft size={14} className="cursor-pointer hover:text-gray-600" />
                    <span>1/3</span>
                    <ChevronRight size={14} className="cursor-pointer hover:text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: '2025-06', d1: 1, d2: 1, d3: 1, d4: 1, d5: 0, d6: 0 },
                      { name: '2025-05', d1: 1, d2: 1, d3: 2, d4: 1, d5: 1, d6: 1 },
                      { name: '2025-04', d1: 0, d2: 1, d3: 1, d4: 1, d5: 1, d6: 1 },
                    ]}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="d1" stackId="a" fill="#3b82f6" barSize={24} />
                    <Bar dataKey="d2" stackId="a" fill="#38bdf8" />
                    <Bar dataKey="d3" stackId="a" fill="#4ade80" />
                    <Bar dataKey="d4" stackId="a" fill="#f97316" />
                    <Bar dataKey="d5" stackId="a" fill="#f472b6" />
                    <Bar dataKey="d6" stackId="a" fill="#a78bfa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 6: 关联主要诊断分布 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <h3 className="text-base font-bold text-gray-800 mb-4">关联主要诊断分布</h3>
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-7 grid-rows-5 gap-0.5 h-full w-full text-[10px] sm:text-xs">
                  {/* Row 1 */}
                  <div className="col-span-2 row-span-2 bg-[#f59e0b] text-white flex items-center justify-center text-center p-1">偏头痛</div>
                  <div className="col-span-1 row-span-1 bg-[#d9f99d] text-gray-700 flex items-center justify-center text-center p-1">腰椎间盘...</div>
                  <div className="col-span-1 row-span-1 bg-[#fbcfe8] text-gray-700 flex items-center justify-center text-center p-1">不稳...</div>
                  <div className="col-span-1 row-span-1 bg-[#d8b4fe] text-white flex items-center justify-center text-center p-1">重症...</div>
                  <div className="col-span-1 row-span-1 bg-[#a855f7] text-white flex items-center justify-center text-center p-1">癫痫</div>
                  <div className="col-span-1 row-span-1 bg-[#a7f3d0] text-gray-700 flex items-center justify-center text-center p-1">急性...</div>
                  
                  {/* Row 2 */}
                  <div className="col-span-1 row-span-1 bg-[#c4b5fd] text-white flex items-center justify-center text-center p-1">心律失常</div>
                  <div className="col-span-1 row-span-1 bg-[#bae6fd] text-gray-700 flex items-center justify-center text-center p-1">COPD急性...</div>
                  <div className="col-span-1 row-span-2 bg-[#2dd4bf] text-white flex items-center justify-center text-center p-1">急性心...</div>
                  <div className="col-span-1 row-span-2 bg-[#bfdbfe] text-gray-700 flex items-center justify-center text-center p-1">病毒性...</div>

                  {/* Row 3 */}
                  <div className="col-span-2 row-span-1 bg-[#6ee7b7] text-white flex items-center justify-center text-center p-1">急性肾盂肾炎</div>
                  <div className="col-span-1 row-span-1 bg-[#fde047] text-gray-700 flex items-center justify-center text-center p-1">急性荨麻疹</div>
                  <div className="col-span-1 row-span-1 bg-[#7dd3fc] text-gray-700 flex items-center justify-center text-center p-1">前臂骨折</div>

                  {/* Row 4 */}
                  <div className="col-span-2 row-span-1 bg-[#e879f9] text-white flex items-center justify-center text-center p-1">热射病</div>
                  <div className="col-span-1 row-span-1 bg-[#34d399] text-white flex items-center justify-center text-center p-1">急性阑尾炎</div>
                  <div className="col-span-1 row-span-1 bg-[#38bdf8] text-white flex items-center justify-center text-center p-1">细菌性痢疾</div>
                  <div className="col-span-1 row-span-1 bg-[#93c5fd] text-white flex items-center justify-center text-center p-1">急性胃...</div>
                  <div className="col-span-1 row-span-1 bg-[#60a5fa] text-white flex items-center justify-center text-center p-1">社区获...</div>

                  {/* Row 5 */}
                  <div className="col-span-2 row-span-1 bg-[#f1f5f9] text-gray-700 flex items-center justify-center text-center p-1">踝关节扭伤</div>
                  <div className="col-span-1 row-span-1 bg-[#34d399] text-white flex items-center justify-center text-center p-1">急性阑尾炎</div>
                  <div className="col-span-2 row-span-1 bg-[#38bdf8] text-white flex items-center justify-center text-center p-1">细菌性痢疾</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const renderGenericDetail = () => {
    const activeModule = MODULES.find(m => m.id === activeModuleId);
    return (
      <div className="grid grid-cols-12 gap-6">
          {/* Top KPIs */}
          <div className="col-span-12 grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                 <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                    <div className="text-gray-500 text-xs font-medium mb-1">关键指标 {i}</div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-gray-800 tracking-tight">1,2{i}4.00</div>
                        <div className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium mb-1">
                           <TrendingUp size={10} />
                           <span>+5.{i}%</span>
                        </div>
                    </div>
                 </div>
              ))}
          </div>

          {/* Main Chart Area */}
          <div className="col-span-12 lg:col-span-9 bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] min-h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="font-bold text-gray-800 text-lg">{activeModule?.title} - 核心趋势</h3>
                    <p className="text-xs text-gray-400 mt-1">数据来源：全院集成平台 (T+1)</p>
                 </div>
                 <div className="flex bg-gray-100/50 p-1 rounded-lg">
                    <button className="px-3 py-1 text-xs font-medium bg-white text-gray-800 shadow-sm rounded-md">趋势图</button>
                    <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">分布图</button>
                    <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">明细表</button>
                 </div>
              </div>
              <div className="flex-1 flex items-center justify-center border border-dashed border-gray-100 rounded-lg bg-gray-50/30 text-gray-400 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="text-center">
                    <BarChart3 size={64} className="mx-auto mb-3 text-gray-200" />
                    <span className="text-gray-400">交互式数据可视化区域</span>
                    <div className="mt-4 flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                       <button className="px-3 py-1.5 border border-gray-200 bg-white rounded text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600">下钻分析</button>
                       <button className="px-3 py-1.5 border border-gray-200 bg-white rounded text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600">查看SQL</button>
                    </div>
                 </div>
              </div>
          </div>

          {/* Right Side Cards */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
              {/* Alert Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                     异常监控
                     <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">3</span>
                  </h3>
                  <div className="space-y-3">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-start gap-3 p-2.5 bg-gray-50/50 hover:bg-red-50/30 border border-transparent hover:border-red-100 rounded-lg transition-colors cursor-pointer group">
                           <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                           <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-800 group-hover:text-red-700 truncate">门诊量环比下降异常</div>
                              <div className="text-xs text-gray-400 mt-0.5">同比下降 15% • 心内科</div>
                           </div>
                           <ChevronRight size={14} className="text-gray-300 group-hover:text-red-400" />
                        </div>
                     ))}
                  </div>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-xl shadow-lg text-white flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Activity size={100} />
                  </div>
                  <h3 className="font-bold text-lg mb-1 relative z-10">智能洞察</h3>
                  <p className="text-blue-100 text-xs mb-4 relative z-10 leading-relaxed">
                     AI分析发现，本月手术耗材占比呈现下降趋势，主要受骨科集采政策落地影响。建议关注...
                  </p>
                  <button className="mt-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-medium py-2 rounded-lg transition-colors w-full relative z-10">
                     查看完整报告
                  </button>
              </div>
          </div>
      </div>
    );
  };

  const renderLabCockpit = () => {
    const labBusinessData = [
      { name: '门诊', value: 450 },
      { name: '住院', value: 380 },
      { name: '急诊', value: 120 },
      { name: '体检', value: 80 },
      { name: '外送', value: 40 },
    ];

    const labTrendData = [
      { time: '8:00', today: 120, yesterday: 100 },
      { time: '10:00', today: 450, yesterday: 380 },
      { time: '12:00', today: 300, yesterday: 320 },
      { time: '14:00', today: 520, yesterday: 480 },
      { time: '16:00', today: 380, yesterday: 410 },
      { time: '18:00', today: 150, yesterday: 180 },
    ];

    const labFeeData = [
      { name: '临检', value: 35, amount: 12540, color: '#3b82f6' },
      { name: '生化', value: 25, amount: 8960, color: '#60a5fa' },
      { name: '免疫', value: 20, amount: 7160, color: '#93c5fd' },
      { name: '微生物', value: 10, amount: 3580, color: '#bfdbfe' },
      { name: '外送', value: 10, amount: 3580, color: '#dbeafe' },
    ];

    const labReagentData = [
      { name: 'TnI (肌钙蛋白)', stock: 15, days: 2, consumption: '高', color: '#ef4444' },
      { name: 'CRP (反应蛋白)', stock: 45, days: 5, consumption: '中', color: '#f59e0b' },
      { name: 'D-D (二聚体)', stock: 32, days: 3, consumption: '高', color: '#f59e0b' },
      { name: 'ALT (谷丙转氨酶)', stock: 78, days: 12, consumption: '低', color: '#3b82f6' },
      { name: 'GLU (血糖试剂)', stock: 65, days: 10, consumption: '中', color: '#3b82f6' },
    ];

    const criticalValues = [
      { dept: '心内科', item: 'TnI', result: '1.5', alert: '↑', status: '待处理' },
      { dept: '急诊科', item: 'K+', result: '6.2', alert: '↑', status: '处理中' },
      { dept: '呼吸科', item: 'WBC', result: '25.4', alert: '↑', status: '待处理' },
      { dept: '儿科', item: 'CRP', result: '120', alert: '↑', status: '已通知' },
    ];

    return (
      <div className="flex flex-col w-full bg-[#0f172a] min-h-full text-white p-6 gap-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveCockpitId(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              智慧检验驾驶舱 V3.0
            </h1>
          </div>

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

          <div className="flex items-center gap-4 text-slate-400 text-sm">
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

        {/* KPI Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: '今日标本总数', value: '1,070', unit: '个', icon: <FlaskConical size={20} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: '未完成标本量', value: '156', unit: '个', icon: <Clock size={20} />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { label: '危急值待处理', value: '20', unit: '条', icon: <AlertCircle size={20} />, color: 'text-red-400', bg: 'bg-red-400/10' },
            { label: '平均报告时效', value: '1.2', unit: 'h', icon: <TrendingUp size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          ].map((kpi, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div className="flex-1">
                <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">{kpi.label}</div>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
                    <span className="text-slate-500 text-xs">{kpi.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 标本业务量 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FlaskConical className="text-blue-400" size={20} />
                标本业务量
              </h3>
            <div className="flex bg-slate-800 rounded p-0.5">
                {['今日标本', '未完成', '待审核', '危急值', 'TAT'].map((t, i) => (
                  <button key={t} className={`px-2 py-1 text-[10px] rounded ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                    {t}
                  </button>
                ))}
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
                  <span className="text-slate-400">今日</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-slate-500"></div>
                  <span className="text-slate-400">昨日</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={labTrendData}>
                  <defs>
                    <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(value: any, name: string | undefined) => [value, name === 'today' ? '今日标本' : '昨日标本']}
                  />
                  <Area type="monotone" dataKey="today" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorToday)" />
                  <Area type="monotone" dataKey="yesterday" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="none" />
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
            <div className="flex-1 flex flex-col justify-between">
              <div className="text-center mb-4">
                <div className="text-slate-400 text-sm mb-1">报告发布平均时长</div>
                <div className="text-4xl font-bold text-blue-400">1.2 <span className="text-sm font-normal text-slate-500">h</span></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: '≤1h', value: '82%', color: 'text-emerald-400' },
                  { label: '≤4h', value: '15%', color: 'text-blue-400' },
                  { label: '≤24h', value: '3%', color: 'text-slate-400' },
                ].map(item => (
                  <div key={item.label} className="text-center bg-slate-800/30 rounded-lg py-3 border border-slate-800">
                    <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                    <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { label: '急诊报告超时率', value: '0.5%', status: 'normal' },
                  { label: '标本不及格率', value: '1.2%', status: 'warning' },
                  { label: '报告审核通过率', value: '99.8%', status: 'success' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.value}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'success' ? 'bg-emerald-500' : 
                        item.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="flex bg-slate-800 rounded p-0.5">
                {['今日', '门诊', '住院'].map((t, i) => (
                  <button key={t} className={`px-2 py-1 text-[10px] rounded ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                    {t}
                  </button>
                ))}
              </div>
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
                      formatter={(value: any, name: string | undefined, item: any) => {
                        const amount = item.payload.amount;
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

          {/* 试剂耗材库存预警 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Beaker className="text-pink-400" size={20} />
                试剂耗材库存预警
              </h3>
              <span className="text-[10px] text-slate-500">单位: 库存百分比(%)</span>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
              {labReagentData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{item.name}</span>
                      <span className="text-[10px] text-slate-500">消耗强度: {item.consumption}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${
                        item.stock < 20 ? 'text-red-400' : 
                        item.stock < 50 ? 'text-amber-400' : 'text-blue-400'
                      }`}>
                        {item.stock}%
                      </span>
                      <span className="text-[10px] text-slate-500 ml-2">预计可用 {item.days} 天</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${item.stock}%`, 
                        backgroundColor: item.color,
                        boxShadow: `0 0 10px ${item.color}40`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-[10px] text-slate-400">紧急补货</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-[10px] text-slate-400">建议补货</span>
                </div>
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
                未处理: 20
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="pb-2 font-medium">科室</th>
                    <th className="pb-2 font-medium">项目</th>
                    <th className="pb-2 font-medium">结果</th>
                    <th className="pb-2 font-medium">预警</th>
                    <th className="pb-2 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {criticalValues.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-slate-300">{row.dept}</td>
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
        </div>
      </div>
    );
  };

  const renderCockpitDetail = () => {
    if (activeCockpitId === 'lab') return renderLabCockpit();

    return (
      <div className="w-full min-h-full flex flex-col items-center pt-12 px-8 relative bg-[#f8fafc]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(45deg, #e2e8f0 1px, transparent 1px), linear-gradient(-45deg, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.4
        }}></div>
        
        <div className="relative z-10 w-full max-w-6xl">
          {/* Search Bar */}
          <div className="w-full max-w-4xl mx-auto mb-12 flex bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex-1 flex items-center px-5">
              <Search className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="输入关键词搜索" 
                className="flex-1 outline-none text-gray-600 py-4 text-base bg-transparent" 
              />
            </div>
            <button className="bg-[#2563eb] hover:bg-blue-700 text-white px-12 py-4 font-medium transition-colors text-base tracking-widest">
              搜索
            </button>
          </div>

          {/* Cockpit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: 院长驾驶舱 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col">
              <div className="aspect-[16/9] bg-gray-900 relative overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/dash1/800/450" 
                  alt="院长驾驶舱" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="p-5 text-center bg-white">
                <h3 className="text-lg font-medium text-gray-800">院长驾驶舱</h3>
              </div>
            </div>

            {/* Card 2: 检查驾驶舱 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col">
              <div className="aspect-[16/9] bg-gray-900 relative overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/dash2/800/450" 
                  alt="检查驾驶舱" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="p-5 text-center bg-white">
                <h3 className="text-lg font-medium text-gray-800">检查驾驶舱</h3>
              </div>
            </div>

            {/* Card 3: 检验驾驶舱 */}
            <div 
              onClick={() => setActiveCockpitId('lab')}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col"
            >
              <div className="aspect-[16/9] bg-blue-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 z-10"></div>
                <img 
                  src="https://picsum.photos/seed/lab-cockpit/800/450" 
                  alt="检验驾驶舱" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white text-sm font-medium">
                      进入驾驶舱
                   </div>
                </div>
              </div>
              <div className="p-5 text-center bg-white">
                <h3 className="text-lg font-medium text-gray-800">检验驾驶舱</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReportCenter = () => {
    return (
      <div className="flex flex-col w-full bg-[#f8fafc] min-h-full p-6 gap-6">
        {/* Filter Section */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4">
            {/* Report Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">报告名称</label>
              <input 
                type="text" 
                placeholder="请输入报告名称" 
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">科室</label>
              <div className="relative" ref={deptSelectorRef}>
                <div 
                  className={`w-full px-3 py-2 bg-white border ${isDeptSelectorOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200'} rounded-lg text-sm flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all`}
                  onClick={() => setIsDeptSelectorOpen(!isDeptSelectorOpen)}
                >
                  <span className={selectedDept.length > 0 ? 'text-gray-800' : 'text-gray-500'}>
                    {selectedDept.length > 0 
                      ? (selectedDept.length > 1 ? `已选择 ${selectedDept.length} 个科室` : selectedDept[0]) 
                      : '请选择科室'}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDeptSelectorOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isDeptSelectorOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                      {MOCK_DEPARTMENTS.map(dept => {
                        const isSelected = selectedDept.includes(dept.name);
                        return (
                          <div 
                            key={dept.id}
                            className={`px-3 py-2 text-sm rounded-md cursor-pointer flex items-center justify-between ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            style={{ paddingLeft: `${(dept.level * 12) + 12}px` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isSelected) {
                                setSelectedDept(selectedDept.filter(d => d !== dept.name));
                              } else {
                                setSelectedDept([...selectedDept, dept.name]);
                              }
                            }}
                          >
                            <span>{dept.name}</span>
                            {isSelected && <Check size={14} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Report Time */}
            <div className="flex flex-col gap-1.5 xl:col-span-2">
              <label className="text-sm font-medium text-gray-700">报告时间</label>
              <div className="flex gap-2">
                <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all">年</button>
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all">季</button>
                  <button className="px-3 py-1 text-xs font-medium bg-white text-blue-600 shadow-sm rounded-md transition-all">月</button>
                </div>
                <div className="flex-1 relative">
                   <div className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center gap-2 cursor-pointer hover:border-blue-300 transition-colors">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-700">2025-04</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Report Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">报告类型</label>
              <div className="flex items-center gap-4 h-[38px]">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600">全部</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">全院报告</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">科室报告</span>
                </label>
              </div>
            </div>

            {/* Report Status */}
            <div className="flex flex-col gap-1.5 xl:col-span-2">
              <label className="text-sm font-medium text-gray-700">报告状态</label>
              <div className="flex items-center gap-4 h-[38px]">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600">全部</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">已提交</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">待提交</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">部分提交</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-3 justify-end md:col-span-2 lg:col-span-3 xl:col-span-1">
              <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm font-medium">
                <RotateCcw size={16} />
                重置
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all flex items-center gap-2 text-sm font-medium">
                <Search size={16} />
                查询
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col min-h-[500px] overflow-hidden">
           {/* Tabs: Card/List */}
           <div className="border-b border-gray-100 px-6 pt-4 flex justify-between items-center">
              <div className="flex gap-6">
                 <button className="pb-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-200 transition-all flex items-center gap-2">
                    <LayoutGrid size={16} />
                    卡片视图
                 </button>
                 <button className="pb-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-all flex items-center gap-2">
                    <List size={16} />
                    列表视图
                 </button>
              </div>
              
              {/* Batch Actions */}
              <div>
                <button 
                  disabled={selectedReports.length === 0}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-2 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    // Batch regenerate logic
                    console.log('Batch regenerate:', selectedReports);
                  }}
                >
                  <RefreshCw size={14} />
                  批量重新生成
                </button>
              </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={selectedReports.length === MOCK_REPORTS.length && MOCK_REPORTS.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReports(MOCK_REPORTS.map(r => r.id));
                          } else {
                            setSelectedReports([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-4 font-medium">序号</th>
                    <th className="px-6 py-4 font-medium">报告状态</th>
                    <th className="px-6 py-4 font-medium">报告名称</th>
                    <th className="px-6 py-4 font-medium">报告类型</th>
                    <th className="px-6 py-4 font-medium">科室</th>
                    <th className="px-6 py-4 font-medium">时间类型</th>
                    <th className="px-6 py-4 font-medium">报告时间</th>
                    <th className="px-6 py-4 font-medium">提交时间</th>
                    <th className="px-6 py-4 font-medium">提交人</th>
                    <th className="px-6 py-4 font-medium w-48">查看进度</th>
                    <th className="px-6 py-4 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_REPORTS.map((row, index) => {
                    const isSelected = selectedReports.includes(row.id);
                    return (
                      <tr key={row.id} className={`hover:bg-gray-50/50 transition-colors group ${isSelected ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedReports([...selectedReports, row.id]);
                              } else {
                                setSelectedReports(selectedReports.filter(id => id !== row.id));
                              }
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-sm text-gray-700">已提交</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{row.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.timeType}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{row.reportTime}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{row.submitTime}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.submitter}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.progress}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{row.progressText}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">查看</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
           </div>
           
           {/* Pagination */}
           <div className="mt-auto border-t border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">共 2 条记录</div>
              <div className="flex gap-2">
                 <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-500 disabled:opacity-50" disabled>上一页</button>
                 <button className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded text-sm font-medium">1</button>
                 <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-500 disabled:opacity-50" disabled>下一页</button>
              </div>
           </div>
        </div>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // View 2: Detailed Module View (Full Width with Header Switcher)
  // --------------------------------------------------------------------------
  const renderDetailView = () => {
    const activeModule = MODULES.find(m => m.id === activeModuleId);
    
    return (
      <div className="flex flex-col min-h-screen w-full bg-white relative">
        
        {/* Modern Header with Module Switcher - Sticky */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 bg-white z-20 sticky top-0 shadow-sm">
           
           {/* Breadcrumb / Switcher Area */}
           <div className="flex items-center gap-2" ref={switcherRef}>
              <button 
                onClick={() => setActiveModuleId(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors px-2 py-1.5 rounded-md hover:bg-gray-50"
              >
                 <Home size={16} />
                 <span className="text-sm font-medium">总览</span>
              </button>
              
              <span className="text-gray-300">/</span>

              <div className="relative">
                <button 
                   onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                   className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-50 group"
                >
                   <div className={`w-5 h-5 rounded flex items-center justify-center text-white bg-gradient-to-br ${activeModule?.gradient} shadow-sm`}>
                      {activeModule && <activeModule.icon size={12} />}
                   </div>
                   <span className="font-bold text-sm">{activeModule?.title}</span>
                   <ChevronDown size={14} className={`text-gray-400 group-hover:text-blue-600 transition-transform duration-200 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* MEGA MENU DROPDOWN */}
                {isSwitcherOpen && (
                   <div className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-xl shadow-xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                         <span>切换功能模块</span>
                         <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">ESC 关闭</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1">
                         {MODULES.map(mod => {
                           const isCurrent = mod.id === activeModuleId;
                           return (
                             <button
                               key={mod.id}
                               onClick={() => {
                                 setActiveModuleId(mod.id);
                                 setIsSwitcherOpen(false);
                               }}
                               className={`
                                  flex items-start gap-3 p-3 rounded-lg text-left transition-all group
                                  ${isCurrent ? 'bg-blue-50 ring-1 ring-blue-100' : 'hover:bg-gray-50'}
                               `}
                             >
                                <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isCurrent ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm group-hover:text-blue-600'}`}>
                                   <mod.icon size={16} />
                                </div>
                                <div>
                                   <div className={`text-sm font-bold ${isCurrent ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                      {mod.title}
                                   </div>
                                   <div className={`text-xs ${isCurrent ? 'text-blue-500/80' : 'text-gray-400 group-hover:text-gray-500'} line-clamp-1`}>
                                      {mod.desc}
                                   </div>
                                </div>
                                {isCurrent && <div className="ml-auto mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
                             </button>
                           )
                         })}
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-50 px-2 flex justify-end">
                         <button 
                           onClick={() => { setActiveModuleId(null); setIsSwitcherOpen(false); }}
                           className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 py-1 px-2 rounded hover:bg-gray-50 transition-colors"
                         >
                            <LayoutGrid size={12} />
                            返回总览看板
                         </button>
                      </div>
                   </div>
                )}
              </div>
           </div>
        </header>

        {/* Full Width Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-white relative z-0">
           {/* Content Body */}
           <div className={`flex-1 min-h-screen ${activeModuleId === 'cockpit' || activeModuleId === 'er_return_monitor' || activeModuleId === 'doc' ? 'bg-gray-50/30 p-0' : 'p-6 bg-gray-50/30'}`}>
              {activeModuleId === 'cockpit' ? renderCockpitDetail() : 
               activeModuleId === 'er_return_monitor' ? renderERReturnMonitor() : 
               activeModuleId === 'doc' ? renderReportCenter() :
               renderGenericDetail()}
           </div>
        </main>
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50">
       {activeModuleId ? renderDetailView() : renderDashboard()}
    </div>
  );
};

export default OperationalDecisionCenter;