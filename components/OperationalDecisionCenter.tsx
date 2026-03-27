import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, PieChart, BarChart3, FileText, 
  Activity, GraduationCap, Settings, Layers, Binary,
  FileBarChart, ArrowRight, TrendingUp,
  ChevronRight, ChevronDown, LayoutGrid, Home, Search, ChevronLeft
} from 'lucide-react';
import {
  PieChart as RePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend, ReferenceLine, LabelList
} from 'recharts';
import { RotateCcw, List, Calendar, Check, RefreshCw, Clock, AlertCircle, FlaskConical, Filter, Users, Hourglass, User, ArrowUpDown, X, Pill, PieChart as PieChartIcon, CheckCircle } from 'lucide-react';

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
    id: 'attending-kpi', 
    title: '主诊组KPI效能评价', 
    desc: '主诊组效能实时排行与分析', 
    icon: Users, 
    gradient: 'from-indigo-500 to-purple-600',
    shadowColor: 'shadow-indigo-200'
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

  // Theme Analysis State
  const [activeThemeId, setActiveThemeId] = useState('emergency');
  const [activeEmergencyTab, setActiveEmergencyTab] = useState<'realtime' | 'history'>('realtime');
  const [activePharmacyTab, setActivePharmacyTab] = useState<'antibacterial' | 'prescription' | 'monitoring'>('antibacterial');
  const [ultrasoundCampus, setUltrasoundCampus] = useState('全部');
  const [endoscopyCampus, setEndoscopyCampus] = useState('全部');
  const [endoscopyDateRange, setEndoscopyDateRange] = useState('本月');

  // Report Center State
  const [isDeptSelectorOpen, setIsDeptSelectorOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string[]>([]);
  const deptSelectorRef = useRef<HTMLDivElement>(null);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [activeCockpitId, setActiveCockpitId] = useState<string | null>(null);
  const [activeLabTab, setActiveLabTab] = useState<'lab' | 'blood'>('lab');
  const [selectedCampus, setSelectedCampus] = useState('全院');
  const [selectedDoctorId, setSelectedDoctorId] = useState(1);

  // Attending Group KPI State
  const [kpiSearchQuery, setKpiSearchQuery] = useState('');
  const [kpiSelectedType, setKpiSelectedType] = useState('全部');
  const [kpiSelectedLabel, setKpiSelectedLabel] = useState('全部');
  const [kpiSelectedMonth, setKpiSelectedMonth] = useState('2026-03');
  const [kpiSortDirection, setKpiSortDirection] = useState<'desc' | 'asc' | null>('desc');

  // Drill Down State
  const [drillDownConfig, setDrillDownConfig] = useState<{isOpen: boolean, title: string, type: string} | null>(null);
  const [workloadDrillDown, setWorkloadDrillDown] = useState<string | null>(null);

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

  const renderEmergencyRealtime = () => (
    <div className="space-y-6">
      {/* Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '当前候诊总人数', value: '142', unit: '人', trend: '较平时 +45%', isWarning: true, icon: Users },
          { label: '预计最长等候', value: '85', unit: '分钟', trend: '超阈值 25 分钟', isWarning: true, icon: Hourglass },
          { label: '今日累计接诊', value: '856', unit: '人次', trend: '较昨日同时段 +12%', isWarning: false, icon: Activity },
          { label: '抢救室空床数', value: '1', unit: '张', trend: '使用率 95%', isWarning: true, icon: AlertCircle },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`p-5 rounded-xl border shadow-sm ${kpi.isWarning ? 'bg-rose-50 border-rose-200' : 'bg-white border-gray-100'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className={`text-sm font-medium ${kpi.isWarning ? 'text-rose-700' : 'text-gray-500'}`}>{kpi.label}</div>
                <Icon size={18} className={kpi.isWarning ? 'text-rose-500' : 'text-blue-500'} />
              </div>
              <div className="flex items-end gap-2">
                <div className={`text-3xl font-bold ${kpi.isWarning ? 'text-rose-700' : 'text-gray-900'}`}>{kpi.value}</div>
                <div className={`text-sm mb-1 ${kpi.isWarning ? 'text-rose-600' : 'text-gray-500'}`}>{kpi.unit}</div>
              </div>
              <div className={`text-xs font-medium mt-2 flex items-center gap-1 ${kpi.isWarning ? 'text-rose-600' : 'text-gray-500'}`}>
                {kpi.trend}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 分诊进度与患者流向 */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Filter size={18} className="text-blue-600" />
            实时分诊级别分布
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { level: 'I级 (濒危)', count: 3, color: '#ef4444' },
                { level: 'II级 (危重)', count: 12, color: '#f97316' },
                { level: 'III级 (急症)', count: 58, color: '#eab308' },
                { level: 'IV级 (非急症)', count: 69, color: '#22c55e' },
              ]} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="level" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} width={80} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" name="候诊人数" radius={[0, 4, 4, 0]} barSize={24}>
                  {
                    [
                      { level: 'I级 (濒危)', count: 3, color: '#ef4444' },
                      { level: 'II级 (危重)', count: 12, color: '#f97316' },
                      { level: 'III级 (急症)', count: 58, color: '#eab308' },
                      { level: 'IV级 (非急症)', count: 69, color: '#22c55e' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                  }
                  <LabelList dataKey="count" position="right" fill="#6b7280" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 各诊室实时压力 */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-rose-600" />
            各诊室实时候诊压力
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { room: '急诊内科', waiting: 68, doctors: 3 },
                { room: '急诊外科', waiting: 25, doctors: 2 },
                { room: '儿科急诊', waiting: 42, doctors: 2 },
                { room: '发热门诊', waiting: 15, doctors: 1 },
                { room: '急诊妇产', waiting: 8, doctors: 1 },
                { room: '急诊眼科', waiting: 4, doctors: 1 },
              ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="room" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any, name: any) => [value, name === 'waiting' ? '候诊人数' : '出诊医生数']}
                />
                <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '拥挤阈值 (30人)', fill: '#ef4444', fontSize: 12 }} />
                <Bar dataKey="waiting" name="候诊人数" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32}>
                  {
                    [
                      { room: '急诊内科', waiting: 68, doctors: 3 },
                      { room: '急诊外科', waiting: 25, doctors: 2 },
                      { room: '儿科急诊', waiting: 42, doctors: 2 },
                      { room: '发热门诊', waiting: 15, doctors: 1 },
                      { room: '急诊妇产', waiting: 8, doctors: 1 },
                      { room: '急诊眼科', waiting: 4, doctors: 1 },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.waiting > 30 ? '#ef4444' : '#3b82f6'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 智能调度与行动项 */}
      <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={18} className="text-rose-600" />
            智能调度建议 (AI 实时生成)
          </h3>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">急诊内科候诊严重积压</h4>
                <p className="text-sm text-gray-700">
                  当前急诊内科候诊 68 人，仅 3 名医生出诊，预计最长等候时间将超过 85 分钟。
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-rose-800 bg-rose-100 px-2 py-1 rounded">调度建议</span>
                  <span className="text-sm text-gray-600">建议立即从住院部心血管内科、呼吸内科各抽调 1 名二线医生前往急诊内科支援。</span>
                </div>
              </div>
            </div>
            <button className="shrink-0 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2">
              <User size={16} />
              一键发送调度指令
            </button>
          </div>
          
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">儿科急诊压力上升预警</h4>
                <p className="text-sm text-gray-700">
                  儿科急诊候诊 42 人，已超拥挤阈值。当前为流感高发期，预计夜间就诊量将持续增加。
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded">调度建议</span>
                  <span className="text-sm text-gray-600">建议通知儿科病房备班医生做好支援准备，并增开 1 个儿科急诊诊室。</span>
                </div>
              </div>
            </div>
            <button className="shrink-0 px-4 py-2 bg-white border border-amber-300 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-2">
              <ArrowUpDown size={16} />
              预警通知科室
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyHistory = () => (
    <div className="space-y-6">
      {/* Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '急诊人次数', value: '13,560', unit: '人次', trend: '+5.2%', isPositive: false },
          { label: '抢救室平均滞留时间', value: '3.5', unit: '小时', trend: '-12%', isPositive: true },
          { label: '胸痛D2W时间', value: '65', unit: '分钟', trend: '-5%', isPositive: true },
          { label: '急诊转住院率', value: '18.5', unit: '%', trend: '+1.2%', isPositive: true },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-2">{kpi.label}</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
              <div className="text-sm text-gray-500 mb-1">{kpi.unit}</div>
            </div>
            <div className={`text-xs font-medium mt-2 flex items-center gap-1 ${kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              <TrendingUp size={14} className={kpi.isPositive ? 'rotate-180' : ''} />
              较上期 {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* 急诊人次数趋势 */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={18} className="text-blue-600" />
          急诊人次数趋势 (最近一个月)
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { date: '1日', current: 420, previous: 380 },
              { date: '4日', current: 450, previous: 410 },
              { date: '7日', current: 410, previous: 430 },
              { date: '10日', current: 520, previous: 460 },
              { date: '13日', current: 490, previous: 450 },
              { date: '16日', current: 460, previous: 440 },
              { date: '19日', current: 470, previous: 420 },
              { date: '22日', current: 510, previous: 480 },
              { date: '25日', current: 530, previous: 490 },
              { date: '28日', current: 460, previous: 450 },
              { date: '30日', current: 440, previous: 410 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="current" name="本期人次数" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="previous" name="同期人次数" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 滞留时间分析 */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-blue-600" />
            急诊各区域平均滞留时间趋势
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { time: '1日', resus: 4.2, obs: 24, normal: 1.5 },
                { time: '5日', resus: 3.8, obs: 22, normal: 1.4 },
                { time: '10日', resus: 4.5, obs: 26, normal: 1.8 },
                { time: '15日', resus: 3.5, obs: 20, normal: 1.2 },
                { time: '20日', resus: 3.2, obs: 18, normal: 1.1 },
                { time: '25日', resus: 3.6, obs: 21, normal: 1.3 },
                { time: '30日', resus: 3.4, obs: 19, normal: 1.2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="resus" name="抢救室(h)" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="obs" name="留观室(h)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="normal" name="普通急诊(h)" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 绿色通道达标率 */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-emerald-600" />
            三大中心绿色通道达标率
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: '胸痛中心(D2W<90m)', rate: 92, target: 90 },
                { name: '卒中中心(DNT<60m)', rate: 85, target: 80 },
                { name: '创伤中心(严重创伤救治)', rate: 88, target: 85 },
              ]} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="rate" name="实际达标率(%)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                <Bar dataKey="target" name="目标值(%)" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 落地建议与行动项 */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-500" />
          智能诊断与落地建议
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-4">
            <div className="mt-0.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">抢救室滞留时间存在周期性波动</h4>
              <p className="text-sm text-gray-700 mb-2">
                分析发现，每月 10 日左右抢救室滞留时间明显上升（峰值 4.5 小时）。经下钻分析，主要原因为该时段重症患者转入 ICU 的床位周转不畅。
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded">行动建议</span>
                <span className="text-sm text-gray-600">建议医务处协调重症医学科，在每月上旬预留 1-2 张应急床位，或建立急诊-ICU快速流转绿色通道。</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-4">
            <div className="mt-0.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">卒中中心 DNT 达标率稳步提升</h4>
              <p className="text-sm text-gray-700 mb-2">
                本月卒中中心 DNT 达标率达到 85%，超过目标值 5 个百分点。主要得益于上月实施的“急诊CT优先叫号”策略。
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded">行动建议</span>
                <span className="text-sm text-gray-600">建议将此流程固化为标准化制度，并在胸痛中心推广类似的影像检查优先策略。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyTheme = () => {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {activeEmergencyTab === 'realtime' ? '急诊实时调度大屏' : '急诊历史运行分析'}
              {activeEmergencyTab === 'realtime' && (
                <>
                  <span className="flex h-3 w-3 relative ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-normal text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">Live</span>
                </>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeEmergencyTab === 'realtime' 
                ? '实时监控患者流量与诊室压力，支持一键资源调度，有效缩短等候时间'
                : '聚焦急诊长期运行效率与医疗质量趋势，辅助流程优化与资源调配'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeEmergencyTab === 'realtime' ? (
              <>
                <span className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14}/> 数据更新于刚刚</span>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <RefreshCw size={16} />
                  手动刷新
                </button>
              </>
            ) : (
              <>
                <select className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>本月</option>
                  <option>上月</option>
                  <option>本季度</option>
                  <option>本年度</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <FileText size={16} />
                  生成分析报告
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveEmergencyTab('realtime')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeEmergencyTab === 'realtime'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            实时监测
          </button>
          <button
            onClick={() => setActiveEmergencyTab('history')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeEmergencyTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            历史回看
          </button>
        </div>

        {activeEmergencyTab === 'realtime' ? renderEmergencyRealtime() : renderEmergencyHistory()}
      </div>
    );
  };

  const renderPharmacyTheme = () => (
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
                <div className="h-[180px]">
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-12">
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

  const renderUltrasoundTheme = () => {
    const getUltrasoundData = (campus: string) => {
      const multipliers: Record<string, number> = {
        '全部': 1,
        '天河': 0.5,
        '同德': 0.3,
        '珠玑': 0.2
      };
      const m = multipliers[campus] || 1;

      return {
        target: {
          completed: Math.round(12000 * m),
          total: Math.round(15000 * m),
          rate: 80,
        },
        cost: {
          equipment: Math.round(500 * m),
          consumables: Math.round(200 * m),
          personnel: Math.round(300 * m),
        },
        income: {
          total: Math.round(3500 * m),
          yoy: '+12%',
        },
        efficiency: {
          avgPerDoctor: Math.round(45 * (m === 1 ? 1 : (m * 2))),
          avgWaitTime: Math.round(25 * (m === 1 ? 1 : (m * 1.5))),
          reportTime: Math.round(30 * (m === 1 ? 1 : (m * 1.2))),
        }
      };
    };

    const data = getUltrasoundData(ultrasoundCampus);

    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* 1. 顶部：全局筛选区 */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">院区:</span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['全部', '天河', '同德', '珠玑'].map(campus => (
                <button
                  key={campus}
                  onClick={() => setUltrasoundCampus(campus)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    ultrasoundCampus === campus
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">时间范围:</span>
            <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <option>本月</option>
              <option>本周</option>
              <option>今日</option>
              <option>本年</option>
            </select>
          </div>
          
          <div className="ml-auto">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <FileText size={16} />
              导出报告
            </button>
          </div>
        </div>

        {/* 2. 核心指标卡区（KPI） */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '检查总量', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">检查总量</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.target.completed.toLocaleString()}</div>
              <div className="text-xs text-gray-500">人次</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 同比 +5.2%</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '总收入', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">总收入</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.income.total.toLocaleString()}</div>
              <div className="text-xs text-gray-500">万元</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 同比 {data.income.yoy}</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '平均检查时长', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">平均检查时长</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">8.5</div>
              <div className="text-xs text-gray-500">分钟</div>
            </div>
            <div className="text-xs font-medium mt-2 text-gray-500">较上月缩短 0.5 分钟</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '平均等候时长', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">平均等候时长</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.efficiency.avgWaitTime}</div>
              <div className="text-xs text-gray-500">分钟</div>
            </div>
            <div className="text-xs font-medium mt-2 text-rose-500 flex items-center gap-1"><TrendingUp size={12}/> 较上月增加 2 分钟</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '报告及时率', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">报告及时率</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">95.8</div>
              <div className="text-xs text-gray-500">%</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600">达标 (目标 &gt;95%)</div>
          </div>
        </div>

        {/* 3. 分析模块区（重点） - 6大模块 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 模块一：运营数据分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '运营数据分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              模块一：运营数据分析
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">检查量趋势</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: '1周', value: 2400 }, { name: '2周', value: 2600 },
                      { name: '3周', value: 2300 }, { name: '4周', value: 2800 },
                    ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">检查结构分布</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie data={[
                          { name: '腹部', value: 40, color: '#3b82f6' },
                          { name: '心脏', value: 30, color: '#10b981' },
                          { name: '妇产', value: 20, color: '#f59e0b' },
                          { name: '血管', value: 10, color: '#8b5cf6' },
                        ]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                          {
                            [
                              { name: '腹部', value: 40, color: '#3b82f6' },
                              { name: '心脏', value: 30, color: '#10b981' },
                              { name: '妇产', value: 20, color: '#f59e0b' },
                              { name: '血管', value: 10, color: '#8b5cf6' },
                            ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                          }
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">患者来源结构</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: '门诊', value: 60 },
                        { name: '住院', value: 25 },
                        { name: '体检', value: 15 },
                      ]} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={40} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 模块二：运营成本分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '运营成本分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChartIcon size={18} className="text-emerald-600" />
              模块二：运营成本分析
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">单次检查成本</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {((data.cost.equipment + data.cost.consumables + data.cost.personnel) * 10000 / data.target.completed).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">元/次</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">总成本</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(data.cost.equipment + data.cost.consumables + data.cost.personnel)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">万元</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">成本结构占比</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={[
                        { name: '人员薪酬', value: data.cost.personnel, color: '#f59e0b' },
                        { name: '设备折旧', value: data.cost.equipment, color: '#3b82f6' },
                        { name: '耗材成本', value: data.cost.consumables, color: '#10b981' },
                      ]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                        {
                          [
                            { name: '人员薪酬', value: data.cost.personnel, color: '#f59e0b' },
                            { name: '设备折旧', value: data.cost.equipment, color: '#3b82f6' },
                            { name: '耗材成本', value: data.cost.consumables, color: '#10b981' },
                          ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                        }
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块三：超声体检收入分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '超声体检收入分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-600" />
              模块三：超声体检收入分析
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">体检收入趋势</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { month: '1月', value: 120 }, { month: '2月', value: 100 },
                      { month: '3月', value: 150 }, { month: '4月', value: 180 },
                      { month: '5月', value: 160 }, { month: '6月', value: 210 },
                    ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">各检查项目收入分布</h4>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '腹部彩超', value: 85 },
                      { name: '甲状腺', value: 45 },
                      { name: '乳腺', value: 40 },
                      { name: '颈动脉', value: 30 },
                    ]} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块四：医生效率分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '医生效率分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={18} className="text-orange-500" />
              模块四：医生效率分析
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">医生工作量排名 (Top 5)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '张医生', value: 1250 },
                      { name: '李医生', value: 1180 },
                      { name: '王医生', value: 1050 },
                      { name: '赵医生', value: 980 },
                      { name: '陈医生', value: 920 },
                    ]} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={50} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-800 mb-1">最高/最低工作量差值</div>
                  <div className="text-2xl font-bold text-orange-600">330</div>
                  <div className="text-xs text-orange-700 mt-1">需关注排班均衡性</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-800 mb-1">平均检查时长</div>
                  <div className="text-2xl font-bold text-orange-600">8.5</div>
                  <div className="text-xs text-orange-700 mt-1">分钟/人次</div>
                </div>
              </div>
            </div>
          </div>

          {/* 模块五：服务质量分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '服务质量分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-teal-600" />
              模块五：服务质量分析
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">报告及时率</div>
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-teal-500" strokeDasharray="95.8, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">95.8%</div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">复检率</div>
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-rose-500" strokeDasharray="1.2, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">1.2%</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">阳性检出率趋势</h4>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: '1月', value: 15 }, { month: '2月', value: 16 },
                      { month: '3月', value: 14 }, { month: '4月', value: 17 },
                      { month: '5月', value: 15 }, { month: '6月', value: 18 },
                    ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块六：服务效率分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '服务效率分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              模块六：服务效率分析
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">各时段候诊人数分布 (高峰期分析)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '8:00', value: 20 }, { time: '9:00', value: 45 },
                      { time: '10:00', value: 60 }, { time: '11:00', value: 55 },
                      { time: '12:00', value: 15 }, { time: '14:00', value: 30 },
                      { time: '15:00', value: 50 }, { time: '16:00', value: 40 },
                      { time: '17:00', value: 10 },
                    ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorWait)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-sm text-indigo-800 mb-1">设备利用率</div>
                  <div className="text-2xl font-bold text-indigo-600">82%</div>
                  <div className="text-xs text-indigo-700 mt-1">计算公式: 实际检查时长/开机时长</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-sm text-indigo-800 mb-1">平均出报告时间</div>
                  <div className="text-2xl font-bold text-indigo-600">{data.efficiency.reportTime}</div>
                  <div className="text-xs text-indigo-700 mt-1">分钟/份</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderEndoscopyTheme = () => {
    const getEndoscopyData = (campus: string) => {
      const multipliers: Record<string, number> = {
        '全部': 1,
        '天河': 0.5,
        '同德': 0.3,
        '珠玑': 0.2
      };
      const m = multipliers[campus] || 1;

      return {
        target: {
          completed: Math.round(8500 * m),
          total: Math.round(10000 * m),
          rate: 85,
        },
        income: {
          total: Math.round(4200 * m),
          yoy: '+15%',
        },
        efficiency: {
          avgPerDoctor: Math.round(35 * (m === 1 ? 1 : (m * 2))),
          avgTreatmentPerDoctor: Math.round(12 * (m === 1 ? 1 : (m * 1.8))),
          avgWaitTime: Math.round(45 * (m === 1 ? 1 : (m * 1.5))),
          examTime: Math.round(20 * (m === 1 ? 1 : (m * 1.2))),
          avgAppointmentWaitTime: (3.5 * (m === 1 ? 1 : (m * 1.1))).toFixed(1),
        },
        quality: {
          painlessRatio: 68,
          complicationRate: 0.15,
        }
      };
    };

    const data = getEndoscopyData(endoscopyCampus);

    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* 1. 顶部：全局筛选区 */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">院区:</span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['全部', '天河', '同德', '珠玑'].map(campus => (
                <button
                  key={campus}
                  onClick={() => setEndoscopyCampus(campus)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    endoscopyCampus === campus
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">时间范围:</span>
            <select 
              value={endoscopyDateRange}
              onChange={(e) => setEndoscopyDateRange(e.target.value)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option>本月</option>
              <option>本周</option>
              <option>今日</option>
              <option>本年</option>
            </select>
          </div>
          
          <div className="ml-auto flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <RotateCcw size={16} />
              重置
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Search size={16} />
              查询
            </button>
          </div>
        </div>

        {/* 2. 核心指标卡区（KPI） */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '检查总量', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">检查总量</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.target.completed.toLocaleString()}</div>
              <div className="text-xs text-gray-500">人次</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 同比 +8.5%</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '总收入', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">总收入</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.income.total.toLocaleString()}</div>
              <div className="text-xs text-gray-500">万元</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 同比 {data.income.yoy}</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '医生人均检查量', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">医生人均检查量</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.efficiency.avgPerDoctor}</div>
              <div className="text-xs text-gray-500">人次/天</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上月提升 3 人次</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '医生人均治疗量', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">医生人均治疗量</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.efficiency.avgTreatmentPerDoctor}</div>
              <div className="text-xs text-gray-500">人次/天</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上月提升 1.5 人次</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '平均检查时长', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">平均检查时长</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.efficiency.examTime}</div>
              <div className="text-xs text-gray-500">分钟</div>
            </div>
            <div className="text-xs font-medium mt-2 text-gray-500">较上月缩短 1.2 分钟</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '平均等候时长', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">平均等候时长</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.efficiency.avgWaitTime}</div>
              <div className="text-xs text-gray-500">分钟</div>
            </div>
            <div className="text-xs font-medium mt-2 text-rose-500 flex items-center gap-1"><TrendingUp size={12}/> 较上月增加 5 分钟</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '检查预约等待时长', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">检查预约等待时长</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.efficiency.avgAppointmentWaitTime}</div>
              <div className="text-xs text-gray-500">天</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上月缩短 0.5 天</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '无痛占比', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">无痛占比</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.quality.painlessRatio}</div>
              <div className="text-xs text-gray-500">%</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上年提升 4.5%</div>
          </div>
        </div>

        {/* 3. 分析模块区（重点） - 4大模块 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 模块一：运营概览 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '运营概览', type: 'module'})}
            className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              模块一：运营概览
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">检查量趋势</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: '1周', value: 1800, prevValue: 1650, lastYearValue: 1500 },
                        { name: '2周', value: 2100, prevValue: 1900, lastYearValue: 1750 },
                        { name: '3周', value: 1950, prevValue: 1850, lastYearValue: 1600 },
                        { name: '4周', value: 2300, prevValue: 2100, lastYearValue: 1900 },
                      ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                        <Line name="本期" type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line name="上期" type="monotone" dataKey="prevValue" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                        <Line name="同期" type="monotone" dataKey="lastYearValue" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="relative">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">收入趋势</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: '1周', value: 950, prevValue: 880, lastYearValue: 800 },
                        { name: '2周', value: 1100, prevValue: 1020, lastYearValue: 950 },
                        { name: '3周', value: 1050, prevValue: 980, lastYearValue: 900 },
                        { name: '4周', value: 1200, prevValue: 1150, lastYearValue: 1050 },
                      ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                        <Line name="本期" type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line name="上期" type="monotone" dataKey="prevValue" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                        <Line name="同期" type="monotone" dataKey="lastYearValue" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">检查类型结构</h4>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '胃镜', value: 4500 },
                      { name: '肠镜', value: 3200 },
                      { name: '胃肠同做', value: 1500 },
                      { name: '支气管镜', value: 800 },
                    ]} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块二：收入与结构分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '收入与结构分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChartIcon size={18} className="text-emerald-600" />
              模块二：收入与结构分析
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">无痛 vs 普通占比</h4>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={[
                        { name: '无痛', value: 68, color: '#8b5cf6' },
                        { name: '普通', value: 32, color: '#9ca3af' },
                      ]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                        {
                          [
                            { name: '无痛', value: 68, color: '#8b5cf6' },
                            { name: '普通', value: 32, color: '#9ca3af' },
                          ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                        }
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">单项收入分布</h4>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '无痛胃肠同做', value: 1800 },
                      { name: '无痛肠镜', value: 1200 },
                      { name: '无痛胃镜', value: 800 },
                      { name: '普通肠镜', value: 400 },
                      { name: '普通胃镜', value: 300 },
                    ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块三：医生人效分析 */}
          <div 
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-orange-500" />
                模块三：医生人效分析
              </h3>
              <button 
                onClick={() => setDrillDownConfig({isOpen: true, title: '医生人效分析', type: 'module'})}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600 flex items-center gap-1 text-xs font-normal"
                title="查看明细"
              >
                <FileText size={16} />
                <span>明细</span>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">医生检查量排名 (Top 5)</h4>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '张医生', value: 450 },
                      { name: '李医生', value: 420 },
                      { name: '王医生', value: 380 },
                      { name: '赵医生', value: 350 },
                      { name: '陈医生', value: 310 },
                    ]} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">医生治疗量排名 (Top 5)</h4>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '王医生', value: 120 },
                      { name: '张医生', value: 115 },
                      { name: '李医生', value: 108 },
                      { name: '陈医生', value: 95 },
                      { name: '赵医生', value: 88 },
                    ]} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块四：服务效率分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '服务效率分析', type: 'module'})}
            className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              模块四：服务效率分析
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">预约等候时长趋势 (天)</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: '1周', value: 4.2 }, { name: '2周', value: 3.8 },
                        { name: '3周', value: 3.5 }, { name: '4周', value: 3.2 },
                      ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorApptWait" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorApptWait)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">预约等候时长分布</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: '<1天', value: 15 }, { name: '1-3天', value: 45 },
                        { name: '3-7天', value: 30 }, { name: '>7天', value: 10 },
                      ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">检查操作时长趋势</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: '1周', value: 22 }, { name: '2周', value: 21 },
                        { name: '3周', value: 20.5 }, { name: '4周', value: 20 },
                      ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderPathologyTheme = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4">
          <div className="text-sm text-gray-500">全局筛选区 (病理科)</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="col-span-8 text-sm text-gray-500">核心指标区 (病理科)</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="col-span-2 text-sm text-gray-500">主分析区 (6大模块 - 病理科)</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">明细数据区 (病理科)</div>
        </div>
      </div>
    );
  };

  const renderThemeAnalysis = () => {
    const THEMES = [
      { id: 'emergency', name: '急诊主题分析', icon: Activity },
      { id: 'pharmacy', name: '药学主题分析', icon: Pill },
      { id: 'surgery', name: '手术主题分析', icon: Activity },
      { id: 'outpatient', name: '门诊主题分析', icon: Users },
      { id: 'inpatient', name: '住院主题分析', icon: Home },
      { id: 'ultrasound', name: '超声科主题分析', icon: Activity },
      { id: 'endoscopy', name: '内镜中心主题分析', icon: Activity },
      { id: 'pathology', name: '病理科主题分析', icon: Activity },
    ];

    return (
      <div className="flex h-full overflow-hidden bg-gray-50/30">
        {/* Left Sidebar - Theme Catalog */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">主题目录</h2>
          </div>
          <div className="p-2 space-y-1">
            {THEMES.map(theme => {
              const Icon = theme.icon;
              const isActive = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveThemeId(theme.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                  {theme.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeThemeId === 'emergency' ? renderEmergencyTheme() : 
           activeThemeId === 'pharmacy' ? renderPharmacyTheme() : 
           activeThemeId === 'ultrasound' ? renderUltrasoundTheme() : 
           activeThemeId === 'endoscopy' ? renderEndoscopyTheme() : 
           activeThemeId === 'pathology' ? renderPathologyTheme() : (
            <div className="flex items-center justify-center h-full text-gray-400">
              请选择左侧主题目录查看详情
            </div>
          )}
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

  const renderBloodCockpitContent = () => {
    const bloodInventoryData = [
      { name: 'A型', value: 350, fill: '#ef4444' },
      { name: 'B型', value: 280, fill: '#f43f5e' },
      { name: 'O型', value: 420, fill: '#fb7185' },
      { name: 'AB型', value: 120, fill: '#fda4af' },
    ];

    const plasmaInventoryData = [
      { name: 'A型', value: 250, fill: '#eab308' },
      { name: 'B型', value: 180, fill: '#facc15' },
      { name: 'O型', value: 320, fill: '#fde047' },
      { name: 'AB型', value: 90, fill: '#fef08a' },
    ];

    const bloodTypeDistData = [
      { name: 'A型', transfusion: 120, surgery: 80 },
      { name: 'B型', transfusion: 90, surgery: 60 },
      { name: 'O型', transfusion: 150, surgery: 110 },
      { name: 'AB型', transfusion: 40, surgery: 30 },
    ];

    const bloodTrendData = [
      { date: '03-22', rbc: 45, plasma: 30, platelet: 12, cryo: 5 },
      { date: '03-23', rbc: 52, plasma: 35, platelet: 15, cryo: 8 },
      { date: '03-24', rbc: 38, plasma: 25, platelet: 10, cryo: 4 },
    ];

    const bloodPrepTimeData = [
      { name: '30min内', value: 45 },
      { name: '1h内', value: 30 },
      { name: '2h内', value: 15 },
      { name: '3h内', value: 7 },
      { name: '3h+', value: 3 },
    ];

    const emergencyBloodTimeData = [
      { name: '30min内', value: 65 },
      { name: '1h内', value: 20 },
      { name: '2h内', value: 10 },
      { name: '3h内', value: 4 },
      { name: '3h+', value: 1 },
    ];

    const deptRankingRBC = [
      { dept: '重症医学科', value: 450 },
      { dept: '血液科', value: 320 },
      { dept: '急诊科', value: 280 },
      { dept: '心胸外科', value: 210 },
      { dept: '骨科', value: 150 },
    ];

    const deptRankingPlasma = [
      { dept: '重症医学科', value: 350 },
      { dept: '肝胆外科', value: 280 },
      { dept: '急诊科', value: 220 },
      { dept: '消化内科', value: 180 },
      { dept: '心胸外科', value: 120 },
    ];

    const deptRankingPlatelet = [
      { dept: '血液科', value: 150 },
      { dept: '重症医学科', value: 80 },
      { dept: '肿瘤科', value: 60 },
      { dept: '急诊科', value: 40 },
      { dept: '儿科', value: 20 },
    ];

    const deptRankingCryo = [
      { dept: '重症医学科', value: 120 },
      { dept: '急诊科', value: 90 },
      { dept: '产科', value: 60 },
      { dept: '心胸外科', value: 40 },
      { dept: '肝胆外科', value: 30 },
    ];

    const todayApplications = [
      { patient: '张三', dept: '重症医学科', type: '红细胞', amount: '2U', status: '已发血' },
      { patient: '李四', dept: '急诊科', type: '血浆', amount: '400ml', status: '配血中' },
      { patient: '王五', dept: '血液科', type: '血小板', amount: '1治疗量', status: '已发血' },
      { patient: '赵六', dept: '心胸外科', type: '红细胞', amount: '4U', status: '待配血' },
    ];

    return (
      <div className="flex flex-col gap-6">
        {/* Row 1: 实时监控 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[320px] lg:col-span-4">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Activity className="text-rose-400" size={20} />
              实时监控
            </h3>
            <div className="flex flex-col justify-between flex-1 gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">实时库存 (U)</div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-slate-900/50 rounded py-2"><div className="text-xs text-slate-500 mb-1">A型</div><div className="font-bold text-rose-400 text-xl">350</div></div>
                  <div className="bg-slate-900/50 rounded py-2"><div className="text-xs text-slate-500 mb-1">B型</div><div className="font-bold text-rose-400 text-xl">280</div></div>
                  <div className="bg-slate-900/50 rounded py-2"><div className="text-xs text-slate-500 mb-1">O型</div><div className="font-bold text-rose-400 text-xl">420</div></div>
                  <div className="bg-slate-900/50 rounded py-2"><div className="text-xs text-slate-500 mb-1">AB型</div><div className="font-bold text-rose-400 text-xl">120</div></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 flex flex-col justify-center">
                  <div className="text-amber-400/80 text-xs mb-2">库存预警</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-amber-400">A型红细胞</span>
                      <span className="text-amber-400 font-medium">低于下限 (35U)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-amber-400">AB型血浆</span>
                      <span className="text-amber-400 font-medium">低于下限 (12U)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex flex-col justify-center">
                  <div className="text-red-400/80 text-xs mb-2">血液过期提醒 (近3天)</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-400 font-mono">B20260315001</span>
                      <span className="text-red-400">03-25</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-400 font-mono">B20260316023</span>
                      <span className="text-red-400">03-26</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[320px] lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-300 mb-2">红细胞库存分布</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={bloodInventoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2}>
                    {bloodInventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[320px] lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-300 mb-2">血浆库存分布</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={plasmaInventoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2}>
                    {plasmaInventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-row items-center justify-around h-[320px] lg:col-span-4">
            <div className="flex flex-col items-center justify-center w-1/2 h-full relative">
              <h3 className="text-sm font-bold text-slate-300 absolute top-0 left-0">配血比例</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={[{name: '已配血', value: 85}, {name: '未配血', value: 15}]} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={70} startAngle={90} endAngle={-270} stroke="none">
                    <Cell fill="#3b82f6" />
                    <Cell fill="#1e293b" />
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-bold text-blue-400">85<span className="text-sm font-normal text-slate-500">%</span></span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2 h-full relative">
              <h3 className="text-sm font-bold text-slate-300 absolute top-0 left-0">发血比例</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={[{name: '已发血', value: 92}, {name: '未发血', value: 8}]} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={70} startAngle={90} endAngle={-270} stroke="none">
                    <Cell fill="#10b981" />
                    <Cell fill="#1e293b" />
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-bold text-emerald-400">92<span className="text-sm font-normal text-slate-500">%</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: 科室用血 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px] lg:col-span-2">
            <div className="flex items-center gap-8 mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="text-blue-400" size={20} />
                科室用血 (30天)
              </h3>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs mb-0.5">申请人次</span>
                  <span className="text-xl font-bold text-blue-400 leading-none">1,245</span>
                </div>
                <div className="w-px h-8 bg-slate-700"></div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs mb-0.5">输血人次</span>
                  <span className="text-xl font-bold text-emerald-400 leading-none">1,180</span>
                </div>
              </div>
            </div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">30天血型分布（分输血患者和手术患者）</h4>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodTypeDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                  <Bar dataKey="transfusion" name="输血患者" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="surgery" name="手术患者" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-300">30天用血排名</h3>
              <button className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs">
                <span>查看明细</span>
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              <div>
                <h4 className="text-xs text-rose-400 mb-2 font-medium">红细胞 (U)</h4>
                <div className="space-y-2">
                  {deptRankingRBC.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 w-20 truncate">{item.dept}</span>
                      <div className="flex-1 mx-2 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-400 h-full rounded-full" style={{ width: `${(item.value / 450) * 100}%` }}></div>
                      </div>
                      <span className="text-slate-300 w-8 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-amber-400 mb-2 font-medium">血浆 (ml)</h4>
                <div className="space-y-2">
                  {deptRankingPlasma.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 w-20 truncate">{item.dept}</span>
                      <div className="flex-1 mx-2 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(item.value / 350) * 100}%` }}></div>
                      </div>
                      <span className="text-slate-300 w-8 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-blue-400 mb-2 font-medium">血小板 (治疗量)</h4>
                <div className="space-y-2">
                  {deptRankingPlatelet.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 w-20 truncate">{item.dept}</span>
                      <div className="flex-1 mx-2 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(item.value / 150) * 100}%` }}></div>
                      </div>
                      <span className="text-slate-300 w-8 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-purple-400 mb-2 font-medium">冷沉淀 (U)</h4>
                <div className="space-y-2">
                  {deptRankingCryo.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 w-20 truncate">{item.dept}</span>
                      <div className="flex-1 mx-2 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-400 h-full rounded-full" style={{ width: `${(item.value / 120) * 100}%` }}></div>
                      </div>
                      <span className="text-slate-300 w-8 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: 备血输血 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px] lg:col-span-2">
            <div className="flex items-center gap-8 mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="text-emerald-400" size={20} />
                备血输血趋势 (3天内)
              </h3>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs mb-0.5">申请人次</span>
                  <span className="text-xl font-bold text-blue-400 leading-none">135</span>
                </div>
                <div className="w-px h-8 bg-slate-700"></div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs mb-0.5">输血人次</span>
                  <span className="text-xl font-bold text-emerald-400 leading-none">125</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bloodTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                  <Line type="monotone" dataKey="rbc" name="红细胞" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="plasma" name="血浆" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: '#eab308', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="platelet" name="血小板" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="cryo" name="冷沉淀" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Clock className="text-amber-400" size={20} />
              时效与明细
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700 h-[140px] flex flex-col">
                <div className="text-slate-400 text-[10px] mb-1">3天内备血发血比例 (%)</div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bloodPrepTimeData} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 8 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 8 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '10px' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700 h-[140px] flex flex-col">
                <div className="text-slate-400 text-[10px] mb-1">30天抢救备血用时 (%)</div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={emergencyBloodTimeData} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 8 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 8 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '10px' }} />
                      <Bar dataKey="value" fill="#10b981" radius={[2, 2, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">今日输血申请</h4>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur-sm">
                  <tr>
                    <th className="pb-2 font-medium">患者</th>
                    <th className="pb-2 font-medium">科室</th>
                    <th className="pb-2 font-medium">类型</th>
                    <th className="pb-2 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {todayApplications.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-2 text-slate-300">{row.patient}</td>
                      <td className="py-2 text-slate-400">{row.dept}</td>
                      <td className="py-2 text-slate-300">{row.type} {row.amount}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          row.status === '待配血' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          row.status === '配血中' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
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

  const renderLabCockpit = () => {
    const labBusinessData = [
      { name: '临检', value: 500 },
      { name: '生化', value: 460 },
      { name: '免疫', value: 250 },
      { name: '微生物', value: 160 },
      { name: '分子生物', value: 90 },
    ];

    const labTrendData = [
      { date: '03-18', current: 1200, previous: 1000, completed: 1100 },
      { date: '03-19', current: 1450, previous: 1380, completed: 1350 },
      { date: '03-20', current: 1300, previous: 1320, completed: 1280 },
      { date: '03-21', current: 1520, previous: 1480, completed: 1420 },
      { date: '03-22', current: 1380, previous: 1410, completed: 1300 },
      { date: '03-23', current: 850, previous: 880, completed: 800 },
      { date: '03-24', current: 1070, previous: 950, completed: 914 },
    ];

    const tatData = [
      { name: '临检', value: 0.5, target: 1.0 },
      { name: '生化', value: 1.2, target: 2.0 },
      { name: '免疫', value: 2.5, target: 4.0 },
      { name: '微生物', value: 48, target: 72 },
      { name: '外送', value: 72, target: 96 },
    ];

    const labFeeData = [
      { name: '临检', value: 35, amount: 12540, color: '#3b82f6' },
      { name: '生化', value: 25, amount: 8960, color: '#60a5fa' },
      { name: '免疫', value: 20, amount: 7160, color: '#93c5fd' },
      { name: '微生物', value: 10, amount: 3580, color: '#bfdbfe' },
      { name: '外送', value: 10, amount: 3580, color: '#dbeafe' },
    ];

    const criticalValues = [
      { dept: '心内科', item: 'TnI', result: '1.5', alert: '↑', status: '待处理' },
      { dept: '急诊科', item: 'K+', result: '6.2', alert: '↑', status: '处理中' },
      { dept: '呼吸科', item: 'WBC', result: '25.4', alert: '↑', status: '待处理' },
      { dept: '儿科', item: 'CRP', result: '120', alert: '↑', status: '已通知' },
      { dept: '重症医学科', item: 'PLT', result: '15', alert: '↓', status: '待处理' },
      { dept: '血液科', item: 'HGB', result: '45', alert: '↓', status: '待处理' },
      { dept: '神经内科', item: 'GLU', result: '2.1', alert: '↓', status: '待处理' },
    ];

    return (
      <div className="flex flex-col w-full bg-[#0f172a] min-h-full text-white p-6 pb-24 gap-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 relative">
          <div className="flex items-center gap-4 z-10">
            <button 
              onClick={() => setActiveCockpitId(null)}
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
              智慧检验驾驶舱 V3.0
            </h1>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-sm z-10">
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

        {activeLabTab === 'lab' ? (
          <>
            {/* Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 标本业务量 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FlaskConical className="text-blue-400" size={20} />
                标本业务量
              </h3>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="text-slate-400 text-[10px] mb-1">今日标本</div>
                <div className="text-lg font-bold text-blue-400">1,070<span className="text-[10px] font-normal text-slate-500 ml-1">个</span></div>
              </div>
              <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="text-slate-400 text-[10px] mb-1">未完成</div>
                <div className="text-lg font-bold text-amber-400">156<span className="text-[10px] font-normal text-slate-500 ml-1">个</span></div>
              </div>
              <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="text-slate-400 text-[10px] mb-1">待审核</div>
                <div className="text-lg font-bold text-emerald-400">45<span className="text-[10px] font-normal text-slate-500 ml-1">个</span></div>
              </div>
              <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="text-slate-400 text-[10px] mb-1">危急值</div>
                <div className="text-lg font-bold text-red-400">20<span className="text-[10px] font-normal text-slate-500 ml-1">条</span></div>
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
                  <span className="text-slate-400">本周</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-emerald-500"></div>
                  <span className="text-slate-400">已完成</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-slate-500"></div>
                  <span className="text-slate-400">上周</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={labTrendData}>
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(value: any, name: any) => [value, name === 'current' ? '本周标本' : name === 'completed' ? '已完成' : '上周标本']}
                  />
                  <Area type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                  <Area type="monotone" dataKey="previous" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="none" />
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
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tatData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={60} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any, name: any) => [`${value} h`, name === 'value' ? '平均时长' : '目标时长']}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                  <Bar dataKey="value" name="平均时长" fill="#f59e0b" barSize={12} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target" name="目标时长" fill="#3b82f6" barSize={12} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 检验服务费用 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="text-violet-400" size={20} />
                检验服务费用
              </h3>
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

          {/* 实时危急值预警 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="text-red-400" size={20} />
                实时危急值预警
              </h3>
              <div className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">
                未处理: {criticalValues.filter(row => row.status === '待处理').length}
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
                  {criticalValues.filter(row => row.status === '待处理').map((row, i) => (
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
          </>
        ) : (
          renderBloodCockpitContent()
        )}

        {/* Floating Tabs at Bottom Center */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full px-8 py-2 shadow-2xl flex items-center gap-12">
          <button 
            onClick={() => setActiveLabTab('lab')}
            className={`text-lg font-medium py-2 transition-colors relative ${activeLabTab === 'lab' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            检验
            {activeLabTab === 'lab' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveLabTab('blood')}
            className={`text-lg font-medium py-2 transition-colors relative ${activeLabTab === 'blood' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            输血
            {activeLabTab === 'blood' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-400 rounded-full"></div>}
          </button>
        </div>
      </div>
    );
  };

  const renderExamCockpit = () => {
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
          color: (item as any).color || colors[index % colors.length]
        }));
      }
      const campusKey = selectedCampus.replace('院区', '');
      return baseData.map((item, index) => ({
        name: item.name,
        value: (item as any)[campusKey] || 0,
        color: (item as any).color || colors[index % colors.length]
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

    return (
      <div className="w-full min-h-screen bg-[#050b14] text-white p-6 flex flex-col gap-6 font-sans relative overflow-hidden">
        {/* Background styling */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 50% 0%, #0c2b5e 0%, #050b14 50%)',
        }}></div>

        {/* Header */}
        <div className="relative flex justify-between items-center mb-4 z-10">
          <div className="flex items-center gap-4 w-1/3">
            <button 
              onClick={() => {
                setActiveCockpitId(null);
                setWorkloadDrillDown(null);
              }}
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
                        if (data && data.activeLabel && drillDownData[data.activeLabel]) {
                          setWorkloadDrillDown(data.activeLabel);
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
                            <Cell key={`cell-${index}`} fill={(entry as any).color || '#0ea5e9'} className="cursor-pointer hover:opacity-80 transition-opacity" />
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
                      {currentDonutData.reduce((acc, cur) => acc + cur.value, 0).toFixed(workloadDrillDown ? 1 : 0)}
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
                {/* Pie Chart 1: Item Breakdown */}
                <div className="flex-1 relative h-[180px] flex items-center justify-center">
                  <div className="absolute top-0 left-4 text-xs text-slate-400">项目占比</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={costDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {costDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a', color: '#f8fafc' }}
                        itemStyle={{ color: '#e2e8f0' }}
                        formatter={(value: any) => [`${value}%`, '占比']}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  {/* Legend for Donut 1 */}
                  <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-center gap-3 text-xs text-slate-300">
                    {costDonutData.map(item => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie Chart 2: Campus Breakdown (Hidden when specific campus selected) */}
                {selectedCampus === '全院' && (
                  <div className="flex-1 relative h-[180px] flex items-center justify-center">
                    <div className="absolute top-0 left-4 text-xs text-slate-400">院区占比</div>
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={campusCostDonutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {campusCostDonutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a', color: '#f8fafc' }}
                          itemStyle={{ color: '#e2e8f0' }}
                          formatter={(value: any) => [`${value}%`, '占比']}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    {/* Legend for Donut 2 */}
                    <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-center gap-3 text-xs text-slate-300">
                      {campusCostDonutData.map(item => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Radiology Efficiency */}
          <div className="col-span-12 lg:col-span-3 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
            <div className="relative">
              <PanelTitle title="放射服务效率" />
              <div className="absolute left-4 top-6 text-[10px] text-slate-400">(平均预约时长 - 小时)</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 mt-4">
              <div className="bg-[#0f172a] p-2 rounded border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400">{selectedCampus}DR</div>
                <div className="text-sm font-bold text-cyan-400">{(radiologyEfficiencyData.find(d => d.name === 'DR') as any)![selectedCampus === '全院' ? '全院' : selectedCampus.replace('院区', '')]}</div>
              </div>
              <div className="bg-[#0f172a] p-2 rounded border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400">{selectedCampus}CT</div>
                <div className="text-sm font-bold text-emerald-400">{(radiologyEfficiencyData.find(d => d.name === 'CT') as any)![selectedCampus === '全院' ? '全院' : selectedCampus.replace('院区', '')]}</div>
              </div>
              <div className="bg-[#0f172a] p-2 rounded border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400">{selectedCampus}MR</div>
                <div className="text-sm font-bold text-amber-400">{(radiologyEfficiencyData.find(d => d.name === 'MR') as any)![selectedCampus === '全院' ? '全院' : selectedCampus.replace('院区', '')]}</div>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={radiologyEfficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a8a" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a1128', borderColor: '#1e3a8a', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                  {selectedCampus === '全院' ? (
                    <>
                      <Bar dataKey="天河" fill="#0ea5e9" barSize={10} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="珠玑" fill="#10b981" barSize={10} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="同德" fill="#f59e0b" barSize={10} radius={[2, 2, 0, 0]} />
                    </>
                  ) : (
                    <Bar dataKey={selectedCampus.replace('院区', '')} fill="#0ea5e9" barSize={20} radius={[2, 2, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderAttendingGroupKPI = () => {
    // Mock data for Attending Group KPI
    const attendingGroups = [
      { id: 1, name: '张三', type: '内科', score: 95.2, label: '优秀', month: '2026-03' },
      { id: 2, name: '李四', type: '外科', score: 92.8, label: '良好', month: '2026-03' },
      { id: 3, name: '王五', type: '内科', score: 88.5, label: '达标', month: '2026-03' },
      { id: 4, name: '赵六', type: '外科', score: 85.0, label: '达标', month: '2026-03' },
      { id: 5, name: '孙七', type: '内科', score: 78.4, label: '预警', month: '2026-03' },
      { id: 6, name: '周八', type: '外科', score: 75.1, label: '预警', month: '2026-03' },
      { id: 7, name: '吴九', type: '内科', score: 96.5, label: '优秀', month: '2026-03' },
      { id: 8, name: '郑十', type: '外科', score: 89.2, label: '良好', month: '2026-03' },
      { id: 9, name: '张三', type: '内科', score: 94.0, label: '优秀', month: '2026-02' },
      { id: 10, name: '李四', type: '外科', score: 91.5, label: '良好', month: '2026-02' },
    ];

    const filteredGroups = attendingGroups.filter(g => {
      const matchSearch = g.name.includes(kpiSearchQuery);
      const matchType = kpiSelectedType === '全部' || g.type === kpiSelectedType;
      const matchLabel = kpiSelectedLabel === '全部' || g.label === kpiSelectedLabel;
      const matchMonth = !kpiSelectedMonth || kpiSelectedMonth === '全部' || g.month === kpiSelectedMonth;
      return matchSearch && matchType && matchLabel && matchMonth;
    });

    if (kpiSortDirection) {
      filteredGroups.sort((a, b) => {
        if (kpiSortDirection === 'asc') return a.score - b.score;
        return b.score - a.score;
      });
    }

    const selectedDoctor = filteredGroups.find(g => g.id === selectedDoctorId) || filteredGroups[0] || attendingGroups[0];

    // KPI Data based on type
    const internalKPIs = [
      { name: 'CMI', value: '1.25', score: 25, maxScore: 25, icon: Activity },
      { name: '时间消耗指数', value: '0.92', score: 20, maxScore: 25, icon: Hourglass },
      { name: 'RW 总权重值', value: '1500', score: 25, maxScore: 25, icon: Layers },
      { name: '医疗质量安全总得分', value: '98', score: 25.2, maxScore: 25, icon: Check },
    ];

    const surgeryKPIs = [
      { name: '四级手术占比', value: '25%', score: 22, maxScore: 25, icon: PieChart },
      { name: '非计划二次手术率', value: '0.5%', score: 24, maxScore: 25, icon: RotateCcw },
      { name: '床位周转率', value: '95%', score: 23, maxScore: 25, icon: RefreshCw },
      { name: '费用消耗指数', value: '0.88', score: 23.8, maxScore: 25, icon: TrendingUp },
    ];

    const currentKPIs = selectedDoctor.type === '内科' ? internalKPIs : surgeryKPIs;

    return (
      <div className="w-full min-h-full bg-[#f8fafc] p-6 flex flex-col gap-6 font-sans">
        {/* Filter Bar */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索主诊医师..." 
                value={kpiSearchQuery}
                onChange={(e) => setKpiSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 font-medium">模型分类:</label>
              <select 
                value={kpiSelectedType}
                onChange={(e) => setKpiSelectedType(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="全部">全部</option>
                <option value="内科">内科</option>
                <option value="外科">外科</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 font-medium">结论标签:</label>
              <select 
                value={kpiSelectedLabel}
                onChange={(e) => setKpiSelectedLabel(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="全部">全部</option>
                <option value="优秀">优秀</option>
                <option value="良好">良好</option>
                <option value="达标">达标</option>
                <option value="预警">预警</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <Calendar className="text-gray-400" size={16} />
            <input 
              type="month"
              value={kpiSelectedMonth === '全部' ? '' : kpiSelectedMonth}
              onChange={(e) => setKpiSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-sm focus:outline-none cursor-pointer font-medium text-gray-700 w-[110px]"
            />
            {kpiSelectedMonth && kpiSelectedMonth !== '全部' && (
              <button 
                onClick={() => setKpiSelectedMonth('')}
                className="text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                title="清除月份筛选"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6 h-[calc(100vh-210px)]">
          {/* Left Panel: Ranking Table */}
          <div className="w-1/2 bg-white border border-gray-100 rounded-xl p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                全院主诊组效能排行
              </h3>
              <div className="text-sm text-gray-500 flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                共 {filteredGroups.length} 条记录
              </div>
            </div>
            
            <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-gray-100 text-gray-500 text-sm">
                    <th className="py-3 px-2 font-medium">排名</th>
                    <th className="py-3 px-2 font-medium">主诊医师</th>
                    <th className="py-3 px-2 font-medium">模型分类</th>
                    <th 
                      className="py-3 px-2 font-medium cursor-pointer hover:text-blue-600 transition-colors group flex items-center gap-1"
                      onClick={() => setKpiSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                    >
                      效能分
                      <ArrowUpDown size={14} className={`transition-colors ${kpiSortDirection ? 'text-blue-500' : 'text-gray-300 group-hover:text-blue-400'}`} />
                    </th>
                    <th className="py-3 px-2 font-medium">结论标签</th>
                    <th className="py-3 px-2 font-medium">月份</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.length > 0 ? filteredGroups.map((group, index) => (
                    <tr 
                      key={group.id} 
                      onClick={() => setSelectedDoctorId(group.id)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedDoctorId === group.id ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''}`}
                    >
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index < 3 && kpiSortDirection === 'desc' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-medium text-gray-800">{group.name}</td>
                      <td className="py-4 px-2 text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{group.type}</span>
                      </td>
                      <td className="py-4 px-2 font-bold text-gray-900">{group.score}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          group.label === '优秀' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          group.label === '良好' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          group.label === '达标' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {group.label}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-xs text-gray-500 font-mono">{group.month}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        没有找到匹配的数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel: Details */}
          <div className="w-1/2 flex flex-col gap-6">
            {/* Top: Score & Warning */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-blue-100 text-blue-600 shadow-sm">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-3">
                    {selectedDoctor.name} 
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{selectedDoctor.type}</span>
                  </h2>
                  <div className="text-gray-500 text-sm flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {selectedDoctor.month} 月度综合效能分
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8 relative z-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">{selectedDoctor.score}</div>
                  <div className="text-xs text-gray-500 font-medium">总分 100</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    selectedDoctor.label === '预警' ? 'text-red-600' : 
                    selectedDoctor.label === '优秀' ? 'text-emerald-600' :
                    selectedDoctor.label === '良好' ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {selectedDoctor.label}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">效能结论</div>
                </div>
              </div>
            </div>

            {/* Bottom: KPI Indicators */}
            <div className="flex-1 bg-white border border-gray-100 rounded-xl p-6 flex flex-col shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
                  KPI指标详情
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                {currentKPIs.map((kpi, idx) => {
                  const percentage = (kpi.score / kpi.maxScore) * 100;
                  let colorConfig = {
                    bar: 'bg-red-500',
                    text: 'text-red-600',
                    hoverBg: 'group-hover:bg-red-50',
                    hoverText: 'group-hover:text-red-600',
                    hoverBorder: 'group-hover:border-red-100',
                    gradient: 'from-red-50/50',
                    border: 'hover:border-red-200'
                  };
                  
                  if (percentage >= 95) {
                    colorConfig = {
                      bar: 'bg-emerald-500',
                      text: 'text-emerald-600',
                      hoverBg: 'group-hover:bg-emerald-50',
                      hoverText: 'group-hover:text-emerald-600',
                      hoverBorder: 'group-hover:border-emerald-100',
                      gradient: 'from-emerald-50/50',
                      border: 'hover:border-emerald-200'
                    };
                  } else if (percentage >= 90) {
                    colorConfig = {
                      bar: 'bg-blue-500',
                      text: 'text-blue-600',
                      hoverBg: 'group-hover:bg-blue-50',
                      hoverText: 'group-hover:text-blue-600',
                      hoverBorder: 'group-hover:border-blue-100',
                      gradient: 'from-blue-50/50',
                      border: 'hover:border-blue-200'
                    };
                  } else if (percentage >= 80) {
                    colorConfig = {
                      bar: 'bg-amber-500',
                      text: 'text-amber-600',
                      hoverBg: 'group-hover:bg-amber-50',
                      hoverText: 'group-hover:text-amber-600',
                      hoverBorder: 'group-hover:border-amber-100',
                      gradient: 'from-amber-50/50',
                      border: 'hover:border-amber-200'
                    };
                  }

                  return (
                    <div key={idx} className={`bg-white border border-gray-100 p-6 rounded-2xl flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${colorConfig.border} transition-all duration-300 group relative overflow-hidden`}>
                      {/* Subtle background gradient on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 ${colorConfig.hoverText} ${colorConfig.hoverBg} ${colorConfig.hoverBorder} transition-colors`}>
                              <kpi.icon size={16} />
                            </div>
                            <div className="text-gray-600 text-sm font-medium">{kpi.name}</div>
                          </div>
                          <div className={`bg-gray-50 text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-gray-100 ${colorConfig.hoverBg} ${colorConfig.hoverText} ${colorConfig.hoverBorder} transition-colors`}>
                            {kpi.score} <span className="text-[10px] font-normal opacity-70">分</span>
                          </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 tracking-tight mb-6 group-hover:text-gray-950 transition-colors">
                          {kpi.value}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium text-gray-400">
                            <span>达成率</span>
                            <span className={`font-bold ${colorConfig.text}`}>{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colorConfig.bar} rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
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

  const renderCockpitDetail = () => {
    if (activeCockpitId === 'lab') return renderLabCockpit();
    if (activeCockpitId === 'exam') return renderExamCockpit();

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
            <div 
              onClick={() => setActiveCockpitId('exam')}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col"
            >
              <div className="aspect-[16/9] bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-900/40 z-10"></div>
                <img 
                  src="https://picsum.photos/seed/exam-cockpit/800/450" 
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
           <div className={`flex-1 min-h-screen ${activeModuleId === 'cockpit' || activeModuleId === 'er_return_monitor' || activeModuleId === 'doc' || activeModuleId === 'attending-kpi' || activeModuleId === 'theme' ? 'bg-gray-50/30 p-0' : 'p-6 bg-gray-50/30'}`}>
              {activeModuleId === 'cockpit' ? renderCockpitDetail() : 
               activeModuleId === 'er_return_monitor' ? renderERReturnMonitor() : 
               activeModuleId === 'doc' ? renderReportCenter() :
               activeModuleId === 'attending-kpi' ? renderAttendingGroupKPI() :
               activeModuleId === 'theme' ? renderThemeAnalysis() :
               renderGenericDetail()}
           </div>
        </main>
      </div>
    );
  };

  const renderDrillDownModal = () => {
    if (!drillDownConfig?.isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              {drillDownConfig.title} - 数据下钻明细
            </h3>
            <button onClick={() => setDrillDownConfig(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 bg-white">
            <div className="mb-4 flex gap-4">
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option>全部院区</option>
                <option>天河院区</option>
                <option>同德院区</option>
                <option>珠玑院区</option>
              </select>
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option>全部科室</option>
                <option>内镜中心</option>
                <option>超声科</option>
                <option>放射科</option>
              </select>
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option>全部类别</option>
                <option>检查</option>
                <option>治疗</option>
              </select>
              <input type="date" className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" defaultValue="2026-03-19" />
              <div className="ml-auto flex gap-2">
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
                  趋势分析
                </button>
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors">
                  明细数据
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">时间</th>
                    <th className="px-4 py-3 font-medium">患者ID</th>
                    <th className="px-4 py-3 font-medium">患者姓名</th>
                    <th className="px-4 py-3 font-medium">类别</th>
                    <th className="px-4 py-3 font-medium">项目名称</th>
                    <th className="px-4 py-3 font-medium">执行医生</th>
                    <th className="px-4 py-3 font-medium">状态</th>
                    <th className="px-4 py-3 font-medium text-right">金额(元)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">2026-03-19 10:2{i}</td>
                      <td className="px-4 py-3 font-mono text-gray-500">PT{10000+i}</td>
                      <td className="px-4 py-3 text-gray-900">{['张三', '李四', '王五', '赵六', '钱七'][i%5]}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${i % 3 === 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                          {i % 3 === 0 ? '治疗' : '检查'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {i % 3 === 0 
                          ? ['内镜下止血', '息肉切除术', 'EMR治疗', 'ESD手术'][i % 4] 
                          : ['普通胃镜', '无痛肠镜', '支气管镜', '胃肠同做'][i % 4]}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{['张医生', '李医生', '王医生', '赵医生'][i%4]}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium border border-emerald-100">已完成</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-gray-900">{i % 3 === 0 ? (800 + i*50) : (120 + i*15)}.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div>显示 1 到 10 条，共 1,245 条记录</div>
              <div className="flex gap-1">
                <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>上一页</button>
                <button className="px-2 py-1 border border-gray-200 rounded bg-blue-50 text-blue-600 font-medium">1</button>
                <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
                <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
                <span className="px-2 py-1">...</span>
                <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">下一页</button>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50 gap-3">
            <button onClick={() => setDrillDownConfig(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              关闭
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <FileText size={16} />
              导出明细
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50">
       {activeModuleId ? renderDetailView() : renderDashboard()}
       {renderDrillDownModal()}
    </div>
  );
};

export default OperationalDecisionCenter;