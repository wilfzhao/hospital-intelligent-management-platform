import React from 'react';
import { BarChart3, FileText, Activity, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ERReturnMonitor: React.FC = () => {
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

export default ERReturnMonitor;
