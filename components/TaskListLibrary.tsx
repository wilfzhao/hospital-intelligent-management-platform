import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, ChevronDown, Calendar, CheckCircle2, Clock, AlertCircle, Eye, Upload } from 'lucide-react';
import { TaskSupervisionDetail } from './TaskSupervisionDetail';

// Mock Data
const MOCK_DATA = [
  {
    id: 1,
    category: '党的建设',
    target: '深入学习贯彻党的二十大精神，开展主题教育活动。',
    leader: '张书记',
    department: '党办',
    status: '进行中',
  },
  {
    id: 2,
    category: '医疗质量',
    target: '全面提升医疗服务质量，降低非计划二次手术率。',
    leader: '李院长',
    department: '医务处',
    status: '已完成',
  },
  {
    id: 3,
    category: '科研创新',
    target: '申报国家自然科学基金项目不少于10项。',
    leader: '王副院长',
    department: '科研处',
    status: '滞后',
  },
  {
    id: 4,
    category: '人才队伍',
    target: '引进高层次学科带头人3名。',
    leader: '赵副院长',
    department: '人事处',
    status: '进行中',
  },
  {
    id: 5,
    category: '信息化建设',
    target: '完成智慧医院三期工程建设并投入使用。',
    leader: '李院长',
    department: '信息中心',
    status: '进行中',
  }
];

const CATEGORIES = ['党的建设', '医疗质量', '科研创新', '人才队伍', '信息化建设', '后勤保障'];
const LEADERS = ['张书记', '李院长', '王副院长', '赵副院长', '刘总会'];

export const TaskListLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLeaders, setSelectedLeaders] = useState<string[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Toggle selection for multi-select
  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '已完成':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">已完成</span>;
      case '进行中':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">进行中</span>;
      case '滞后':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">滞后</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Filter data
  const filteredData = MOCK_DATA.filter(item => {
    const matchSearch = item.target.includes(searchQuery) || item.department.includes(searchQuery);
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchLeader = selectedLeaders.length === 0 || selectedLeaders.includes(item.leader);
    return matchSearch && matchCategory && matchLeader;
  });

  if (selectedTaskId !== null) {
    return <TaskSupervisionDetail taskId={selectedTaskId} onBack={() => setSelectedTaskId(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 p-6 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">任务清单库</h1>
          <p className="text-sm text-gray-500 mt-1">管理和追踪年度各项重点工作任务</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium">
            <Upload size={18} />
            <span>导入任务</span>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
            <Plus size={18} />
            <span>新增任务</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50 relative z-20">
          <div className="flex flex-wrap items-center gap-4">
            {/* Year Picker */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
              <Calendar className="text-gray-400" size={16} />
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent border-none text-sm focus:outline-none cursor-pointer font-medium text-gray-700"
              >
                <option value="2026">2026年度</option>
                <option value="2025">2025年度</option>
                <option value="2024">2024年度</option>
              </select>
            </div>

            {/* Leader Multi-select (Simplified with dropdown) */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                <Filter size={16} className="text-gray-400" />
                <span>责任领导 {selectedLeaders.length > 0 && `(${selectedLeaders.length})`}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                {LEADERS.map(leader => (
                  <label key={leader} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedLeaders.includes(leader)}
                      onChange={() => toggleSelection(leader, selectedLeaders, setSelectedLeaders)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{leader}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Multi-select */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                <Filter size={16} className="text-gray-400" />
                <span>大项分类 {selectedCategories.length > 0 && `(${selectedCategories.length})`}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                {CATEGORIES.map(category => (
                  <label key={category} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleSelection(category, selectedCategories, setSelectedCategories)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索任务目标或部门..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-16 text-center">编号</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">大项分类</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">年度工作任务目标</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">责任领导</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">主责部门</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-28">推进状态</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-28 text-center">执行督导</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500 text-center font-mono">{item.id}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.target}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.leader}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.department}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedTaskId(item.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-xs font-medium transition-colors border border-indigo-100"
                    >
                      详情
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="编辑">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="删除">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    没有找到匹配的任务
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
