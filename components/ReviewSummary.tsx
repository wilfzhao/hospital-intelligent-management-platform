import React, { useState } from 'react';
import { 
  ListChecks, Folder, ClipboardList, TrendingUp, 
  ChevronDown, Info, BarChart2, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// --- Mock Data ---
const ACCURACY_DETAILS = [
  { id: '1', name: '出院患者手术占比', department: '普通儿科', checkStatus: '已核对', meetStatus: '达标' },
  { id: '2', name: '住院期间行溶栓治疗的高危急...', department: '急诊科', checkStatus: '已核对', meetStatus: '未达标' },
  { id: '3', name: '达标测试指标二', department: '心内科', checkStatus: '未核对', meetStatus: '达标' },
  { id: '4', name: '卫生技术人员数与开放床位数比', department: '人事处', checkStatus: '已核对', meetStatus: '未达标' },
  { id: '5', name: '心力衰竭出院患者数', department: '心内科', checkStatus: '未核对', meetStatus: '未达标' },
  { id: '6', name: '抗菌药物使用强度', department: '药剂科', checkStatus: '已核对', meetStatus: '达标' },
  { id: '7', name: '门诊患者次均费用', department: '财务处', checkStatus: '未核对', meetStatus: '达标' },
  { id: '8', name: '出院患者次均费用', department: '财务处', checkStatus: '已核对', meetStatus: '未达标' },
];

const BAR_CHART_DATA = [
  { name: '普通儿科', value: 50 },
  { name: '未知科室', value: 2 },
];

const WARNINGS = [
  { id: 1, type: '催办', content: '林谦宏反馈了出院患者手术占比', status: '已查看' },
  { id: 2, type: '催办', content: '林谦宏反馈了住院期间行溶栓治疗的高危急...', status: '已查看' },
  { id: 3, type: '催办', content: '冯祥东反馈了达标测试指标二', status: '已查看' },
  { id: 4, type: '催办', content: '冯祥东反馈了达标测试指标三', status: '已查看' },
  { id: 5, type: '催办', content: '林泽宏反馈了达标测试指标四', status: '已查看' },
  { id: 6, type: '催办', content: '林泽宏反馈了达标测试指标五', status: '已查看' },
  { id: 7, type: '催办', content: '任务处理进度滞后，请尽快处理', status: '已查看' },
  { id: 8, type: '催办', content: '主要内容2', status: '处理', actionRequired: true },
  { id: 9, type: '催办', content: '主要内容2', status: '处理', actionRequired: true },
  { id: 10, type: '催办', content: '赵伟峰卫生技术人员数与开放床位数比', status: '已查看' },
  { id: 11, type: '催办', content: '林谦宏反馈了卫生技术人员数与开放床位数比', status: '已查看' },
  { id: 12, type: '催办', content: '林谦宏反馈了心力衰竭出院患者数', status: '已查看' },
  { id: 13, type: '催办', content: '赵伟峰心力衰竭出院患者数', status: '已查看' },
];

const INDICATOR_CATEGORIES = [
  { id: 'c1', name: '资源配置与运行数据指标', active: true },
  { id: 'c2', name: '医疗服务能力与医院质量安全指标', active: false },
  { id: 'c3', name: '重点专业质量控制指标', active: false },
  { id: 'c4', name: '重点医疗技术临床应用质量控制指标', active: false },
  { id: 'c5', name: '单病种（术种）质量控制指标', active: false },
];

const PIE_COLORS = {
  collection: ['#3b82f6', '#f97316'], // Blue, Orange
  accuracy: ['#3b82f6', '#f97316'],
  compliance: ['#3b82f6', '#f97316'],
};

export default function ReviewSummary() {
  const [activeTab, setActiveTab] = useState<'department' | 'chapter'>('department');
  const [showAccuracyModal, setShowAccuracyModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('全部');

  return (
    <div className="flex-1 overflow-auto bg-[#f5f7fa] p-4 space-y-4 relative">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
            <ListChecks size={24} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-1">第一部分 前置要求</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-800">100%</span>
              <span className="text-xs text-gray-400">自评通过率</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-500">
            <Folder size={24} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              第二部分 医疗服务能力与质量安全监测数据
              <Info size={14} className="text-red-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-800">1.63%</span>
              <span className="text-xs text-gray-400">自评达标率 4达标/242未达标</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
            <ClipboardList size={24} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-1">指标自动采集率</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-800">85.37%</span>
              <span className="text-xs text-gray-400">210自动/36手动</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          className="bg-white rounded-lg p-4 shadow-sm flex items-start gap-4 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-emerald-100"
          onClick={() => setShowAccuracyModal(true)}
        >
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-500">
            <TrendingUp size={24} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-1 flex items-center justify-between">
              <span>指标准确率</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-800">4.07%</span>
              <span className="text-xs text-gray-400">10已核对/236未核对</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart and Warnings */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left: Chart */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-800">指标达标情况</h2>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded p-1">
                <button 
                  className={`px-4 py-1 text-sm rounded ${activeTab === 'department' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('department')}
                >
                  责任科室
                </button>
                <button 
                  className={`px-4 py-1 text-sm rounded ${activeTab === 'chapter' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('chapter')}
                >
                  指标章节
                </button>
              </div>
              <button className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50">
                降序 <ChevronDown size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_CHART_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#999', fontSize: 12 }} 
                  domain={[0, 50]}
                  ticks={[0, 10, 20, 30, 40, 50]}
                />
                <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
                <Bar dataKey="value" fill="#1d4ed8" barSize={30} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Warnings */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">预警提醒</h2>
            <button className="text-xs text-gray-400 hover:text-gray-600">查看更多</button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {WARNINGS.map(warning => (
              <div key={warning.id} className="flex items-start gap-2 text-sm">
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded text-xs whitespace-nowrap">
                  {warning.type}
                </span>
                <span className="flex-1 text-gray-600 truncate" title={warning.content}>
                  {warning.content}
                </span>
                <span className={`whitespace-nowrap ${warning.actionRequired ? 'text-blue-500 cursor-pointer hover:underline' : 'text-gray-400'}`}>
                  {warning.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Data and Pie Charts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-stretch">
          
          {/* Left: Categories */}
          <div className="w-[300px] flex flex-col">
            <h2 className="text-base font-bold text-gray-800 mb-4">指标数据</h2>
            <div className="space-y-4">
              {INDICATOR_CATEGORIES.map(cat => (
                <div 
                  key={cat.id} 
                  className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${
                    cat.active ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {cat.active ? (
                    <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
                  ) : (
                    <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                  )}
                  <span className="truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Middle: Total Count */}
          <div className="w-[150px] flex flex-col items-center justify-center mt-8">
            <div className="w-14 h-14 bg-[#4b8df8] rounded-xl flex items-center justify-center text-white mb-4 shadow-sm">
              <BarChart2 size={28} />
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">61</div>
            <div className="text-sm text-gray-500">指标数量</div>
          </div>

          {/* Right: Pie Charts */}
          <div className="flex-1 flex justify-around items-center pl-8">
            
            {/* Pie 1 */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-bold text-gray-800 mb-6">指标采集统计</h3>
              <div className="flex items-center gap-8">
                <div className="relative w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: 27 }, { value: 34 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        stroke="none"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        <Cell fill={PIE_COLORS.collection[0]} />
                        <Cell fill={PIE_COLORS.collection[1]} />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">44.26%</span>
                    <span className="text-xs text-gray-400 mt-1">自动采集率</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                    <span className="text-gray-500 w-16">自动采集</span>
                    <span className="font-medium text-gray-800">27 条</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                    <span className="text-gray-500 w-16">手动采集</span>
                    <span className="font-medium text-gray-800">34 条</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie 2 */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-bold text-gray-800 mb-6">指标准确率统计</h3>
              <div className="flex items-center gap-8">
                <div className="relative w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: 10 }, { value: 51 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        stroke="none"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        <Cell fill={PIE_COLORS.accuracy[0]} />
                        <Cell fill={PIE_COLORS.accuracy[1]} />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">16.39%</span>
                    <span className="text-xs text-gray-400 mt-1">指标准确率</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                    <span className="text-gray-500 w-12">已核对</span>
                    <span className="font-medium text-gray-800">10 条</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                    <span className="text-gray-500 w-12">未核对</span>
                    <span className="font-medium text-gray-800">51 条</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie 3 */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-bold text-gray-800 mb-6">指标达标统计</h3>
              <div className="flex items-center gap-8">
                <div className="relative w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: 4 }, { value: 57 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        stroke="none"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        <Cell fill={PIE_COLORS.compliance[0]} />
                        <Cell fill={PIE_COLORS.compliance[1]} />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">6.56%</span>
                    <span className="text-xs text-gray-400 mt-1">自评达标率</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                    <span className="text-gray-500 w-12">已达标</span>
                    <span className="font-medium text-gray-800">4 条</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                    <span className="text-gray-500 w-12">未达标</span>
                    <span className="font-medium text-gray-800">57 条</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Accuracy Details Modal */}
      {showAccuracyModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">指标准确率明细</h2>
              <button 
                onClick={() => setShowAccuracyModal(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="p-4 border-b border-gray-100 flex gap-2 bg-white">
               <button 
                 className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filterStatus === '全部' ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} 
                 onClick={() => setFilterStatus('全部')}
               >
                 全部
               </button>
               <button 
                 className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filterStatus === '已核对' ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} 
                 onClick={() => setFilterStatus('已核对')}
               >
                 已核对
               </button>
               <button 
                 className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filterStatus === '未核对' ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} 
                 onClick={() => setFilterStatus('未核对')}
               >
                 未核对
               </button>
            </div>

            {/* Modal Table */}
            <div className="flex-1 overflow-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-4 text-sm font-medium text-gray-600 border-b border-gray-200">指标名称</th>
                    <th className="p-4 text-sm font-medium text-gray-600 border-b border-gray-200">责任科室</th>
                    <th className="p-4 text-sm font-medium text-gray-600 border-b border-gray-200">核对状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ACCURACY_DETAILS.filter(d => filterStatus === '全部' || d.checkStatus === filterStatus).map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 text-sm text-gray-800">{item.name}</td>
                      <td className="p-4 text-sm text-gray-600">{item.department}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${item.checkStatus === '已核对' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                          {item.checkStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
