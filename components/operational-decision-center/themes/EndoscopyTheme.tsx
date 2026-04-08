import React from 'react';
import { 
  RotateCcw, Search, TrendingUp, Activity, PieChart as PieChartIcon, Users, Clock, FileText
} from 'lucide-react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, Pie, Cell, PieChart as RePieChart
} from 'recharts';

interface EndoscopyThemeProps {
  endoscopyCampus: string;
  setEndoscopyCampus: (campus: string) => void;
  endoscopyDateRange: string;
  setEndoscopyDateRange: (range: string) => void;
  setDrillDownConfig: (config: { isOpen: boolean; title: string; type: 'kpi' | 'module' }) => void;
}

const EndoscopyTheme: React.FC<EndoscopyThemeProps> = ({
  endoscopyCampus,
  setEndoscopyCampus,
  endoscopyDateRange,
  setEndoscopyDateRange,
  setDrillDownConfig,
}) => {
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
        sameDayWaitTime: Math.round(65 * (m === 1 ? 1 : (m * 1.3))),
      },
      quality: {
        painlessRatio: 68,
        complicationRate: 0.15,
        positiveRate: 42.5,
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
        <div 
          onClick={() => setDrillDownConfig({isOpen: true, title: '当日报到至检查等待时长', type: 'kpi'})}
          className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
        >
          <div className="text-sm font-medium text-gray-500 mb-1">当日报到至检查等待时长</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-gray-900">{data.efficiency.sameDayWaitTime}</div>
            <div className="text-xs text-gray-500">分钟</div>
          </div>
          <div className="text-xs font-medium mt-2 text-rose-500 flex items-center gap-1"><TrendingUp size={12}/> 较上月增加 3 分钟</div>
        </div>
        <div 
          onClick={() => setDrillDownConfig({isOpen: true, title: '阳性率', type: 'kpi'})}
          className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
        >
          <div className="text-sm font-medium text-gray-500 mb-1">阳性率</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-gray-900">{data.quality.positiveRate}</div>
            <div className="text-xs text-gray-500">%</div>
          </div>
          <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上月提升 1.2%</div>
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
              <h4 className="text-sm font-medium text-gray-700 mb-2">医疗类型结构</h4>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '检查', value: 6500 },
                    { name: '治疗', value: 1500 },
                    { name: '手术', value: 500 },
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
              <h4 className="text-sm font-medium text-gray-700 mb-2">收费类型分布</h4>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '检查', value: 1800 },
                    { name: '治疗', value: 1200 },
                    { name: '耗材', value: 800 },
                    { name: '手术', value: 600 },
                    { name: '病理', value: 400 },
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
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">手术分级占比</h4>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={[
                      { name: '一级手术', value: 15, color: '#9ca3af' },
                      { name: '二级手术', value: 35, color: '#3b82f6' },
                      { name: '三级手术', value: 40, color: '#f59e0b' },
                      { name: '四级手术', value: 10, color: '#ef4444' },
                    ]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                      {
                        [
                          { name: '一级手术', value: 15, color: '#9ca3af' },
                          { name: '二级手术', value: 35, color: '#3b82f6' },
                          { name: '三级手术', value: 40, color: '#f59e0b' },
                          { name: '四级手术', value: 10, color: '#ef4444' },
                        ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                      }
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* 模块三：医护人效分析 */}
        <div 
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-orange-500" />
              模块三：医护人效分析
            </h3>
            <button 
              onClick={() => setDrillDownConfig({isOpen: true, title: '医护人效分析', type: 'module'})}
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
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">护士工作量排名 (Top 5)</h4>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '林护士', value: 520 },
                    { name: '周护士', value: 480 },
                    { name: '吴护士', value: 450 },
                    { name: '郑护士', value: 410 },
                    { name: '黄护士', value: 390 },
                  ]} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
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

export default EndoscopyTheme;
