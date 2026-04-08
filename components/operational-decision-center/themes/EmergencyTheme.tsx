import React from 'react';
import { 
  Clock, RefreshCw, FileText, Users, Activity, TrendingUp, 
  AlertCircle, User, ArrowUpDown, Hourglass, Filter
} from 'lucide-react';
import {
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, LineChart, Line, 
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, Cell, LabelList, ReferenceLine
} from 'recharts';

interface EmergencyThemeProps {
  activeEmergencyTab: 'realtime' | 'history';
  setActiveEmergencyTab: (tab: 'realtime' | 'history') => void;
}

const EmergencyTheme: React.FC<EmergencyThemeProps> = ({
  activeEmergencyTab,
  setActiveEmergencyTab,
}) => {
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

export default EmergencyTheme;
