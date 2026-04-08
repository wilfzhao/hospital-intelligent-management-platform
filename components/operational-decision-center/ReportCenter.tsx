import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Search, RotateCcw, LayoutGrid, List, RefreshCw, ChevronDown, Check, Calendar
} from 'lucide-react';

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

const ReportCenter: React.FC = () => {
  const [isDeptSelectorOpen, setIsDeptSelectorOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string[]>([]);
  const deptSelectorRef = useRef<HTMLDivElement>(null);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);

  // Close dept selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deptSelectorRef.current && !deptSelectorRef.current.contains(event.target as Node)) {
        setIsDeptSelectorOpen(false);
      }
    };
    if (isDeptSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDeptSelectorOpen]);

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

export default ReportCenter;
