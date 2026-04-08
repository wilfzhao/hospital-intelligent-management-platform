import React from 'react';
import { 
  FileText, TrendingUp, Activity, PieChart as PieChartIcon, Users, CheckCircle, Clock
} from 'lucide-react';
import {
  LineChart, Line, CartesianGrid, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, 
  Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';

interface UltrasoundThemeProps {
  ultrasoundCampus: string;
  setUltrasoundCampus: (campus: string) => void;
  setDrillDownConfig: (config: { isOpen: boolean; title: string; type: 'kpi' | 'module' }) => void;
}

const UltrasoundTheme: React.FC<UltrasoundThemeProps> = ({
  ultrasoundCampus,
  setUltrasoundCampus,
  setDrillDownConfig,
}) => {
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

export default UltrasoundTheme;
