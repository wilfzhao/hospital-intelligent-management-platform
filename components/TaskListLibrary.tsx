import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, ChevronDown, ChevronRight, Calendar, Upload, X } from 'lucide-react';
import { TaskSupervisionDetail } from './TaskSupervisionDetail';

// Mock Data
const MOCK_DATA = [
  {
    id: 1,
    year: '2026',
    category: '党的建设',
    target: '深入学习贯彻党的二十大精神，开展主题教育活动。',
    leader: '张书记',
    department: '党办',
    coDepartment: '无',
    status: '进行中',
  },
  {
    id: 2,
    year: '2026',
    category: '医疗质量',
    target: '全面提升医疗服务质量，降低非计划二次手术率。',
    leader: '李院长',
    department: '医务处',
    coDepartment: '护理部',
    status: '已完成',
  },
  {
    id: 3,
    year: '2026',
    category: '科研创新',
    target: '申报国家自然科学基金项目不少于10项。',
    leader: '王副院长',
    department: '科研处',
    coDepartment: '无',
    status: '滞后',
  },
  {
    id: 4,
    year: '2026',
    category: '人才队伍',
    target: '引进高层次学科带头人3名。',
    leader: '赵副院长',
    department: '人事处',
    coDepartment: '无',
    status: '进行中',
  },
  {
    id: 5,
    year: '2026',
    category: '信息化建设',
    target: '完成智慧医院三期工程建设并投入使用。',
    leader: '李院长',
    department: '信息中心',
    coDepartment: '基建处',
    status: '进行中',
  },
  {
    id: 6,
    year: '2026',
    category: '后勤保障',
    target: '完成新院区后勤服务招标工作。',
    leader: '刘总会',
    department: '后勤处',
    coDepartment: '无',
    status: '未开始',
  }
];

const INITIAL_CATEGORIES = ['党的建设', '医疗质量', '科研创新', '人才队伍', '信息化建设', '后勤保障'];
const LEADERS = ['张书记', '李院长', '王副院长', '赵副院长', '刘总会'];

const DEPARTMENTS_TREE = [
  {
    id: 'd1',
    name: '行政职能部门',
    children: [
      { id: 'd1-1', name: '党办' },
      { id: 'd1-2', name: '院办' },
      { id: 'd1-3', name: '人事处' },
      { id: 'd1-4', name: '医务处' },
      { id: 'd1-5', name: '科研处' },
      { id: 'd1-6', name: '财务处' },
      { id: 'd1-7', name: '信息中心' },
      { id: 'd1-8', name: '基建处' },
    ]
  },
  {
    id: 'd2',
    name: '临床业务部门',
    children: [
      { id: 'd2-1', name: '内科' },
      { id: 'd2-2', name: '外科' },
      { id: 'd2-3', name: '护理部' },
    ]
  }
];

interface Task {
  id: number;
  year: string;
  category: string;
  target: string;
  leader: string;
  department: string;
  coDepartment: string;
  status: string;
}

export const TaskListLibrary: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedStatus, setSelectedStatus] = useState<string>('全部');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLeaders, setSelectedLeaders] = useState<string[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showDeptSelector, setShowDeptSelector] = useState(false);
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['d1', 'd2']);
  const [showCoDeptSelector, setShowCoDeptSelector] = useState(false);
  const [expandedCoDepts, setExpandedCoDepts] = useState<string[]>(['d1', 'd2']);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{old: string, new: string} | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const toggleDeptExpand = (id: string) => {
    if (expandedDepts.includes(id)) {
      setExpandedDepts(expandedDepts.filter(deptId => deptId !== id));
    } else {
      setExpandedDepts([...expandedDepts, id]);
    }
  };

  const toggleCoDeptExpand = (id: string) => {
    if (expandedCoDepts.includes(id)) {
      setExpandedCoDepts(expandedCoDepts.filter(deptId => deptId !== id));
    } else {
      setExpandedCoDepts([...expandedCoDepts, id]);
    }
  };

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
      case '未开始':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">未开始</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Filter data
  const filteredData = tasks.filter(item => {
    const matchYear = item.year === selectedYear;
    const matchStatus = selectedStatus === '全部' || item.status === selectedStatus;
    const matchSearch = item.target.includes(searchQuery) || item.department.includes(searchQuery);
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchLeader = selectedLeaders.length === 0 || selectedLeaders.includes(item.leader);
    return matchYear && matchStatus && matchSearch && matchCategory && matchLeader;
  });

  if (selectedTaskId !== null) {
    return <TaskSupervisionDetail taskId={selectedTaskId} onBack={() => setSelectedTaskId(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 p-6 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium">
            <Upload size={18} />
            <span>导入任务</span>
          </button>
          <button 
            onClick={() => {
              setEditingTask({
                id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                year: selectedYear,
                category: categories[0] || '',
                target: '',
                leader: LEADERS[0],
                department: '',
                coDepartment: '无',
                status: '进行中'
              });
              setShowDeptSelector(false);
              setShowCoDeptSelector(false);
              setShowCategorySelector(false);
              setIsAddingCategory(false);
              setNewCategoryName('');
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} />
            <span>新增任务</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
        {/* Status Tabs */}
        <div className="flex items-center px-4 pt-4 border-b border-gray-100 gap-6">
          {['全部', '未开始', '进行中', '已完成', '滞后'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                selectedStatus === status
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

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
                <span>督办院领导 {selectedLeaders.length > 0 && `(${selectedLeaders.length})`}</span>
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
                {categories.map(category => (
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
              placeholder="搜索项目名称或部门..." 
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
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24 text-center">年度</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">大项分类</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">项目名称</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">督办院领导</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">主责部门</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">协办部门</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-28">推进状态</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500 text-center font-mono">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-center">{item.year}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button 
                      onClick={() => setSelectedTaskId(item.id)}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-left transition-colors"
                    >
                      {item.target}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.leader}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.coDepartment || '无'}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingTask({ ...item })}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        title="编辑"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => setTasks(tasks.filter(t => t.id !== item.id))}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                        title="删除"
                      >
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

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {tasks.some(t => t.id === editingTask.id) ? '编辑任务' : '新增任务'}
              </h3>
              <button 
                onClick={() => {
                  setEditingTask(null);
                  setShowDeptSelector(false);
                  setShowCoDeptSelector(false);
                  setShowCategorySelector(false);
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">年度</label>
                  <select 
                    value={editingTask.year}
                    onChange={(e) => setEditingTask({...editingTask, year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="2026">2026年度</option>
                    <option value="2025">2025年度</option>
                    <option value="2024">2024年度</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">大项分类</label>
                  <div 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all cursor-pointer flex justify-between items-center bg-white"
                    onClick={() => setShowCategorySelector(!showCategorySelector)}
                  >
                    <span className={editingTask.category ? 'text-gray-900' : 'text-gray-400'}>
                      {editingTask.category || '请选择大项分类'}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>

                  {showCategorySelector && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 flex flex-col">
                      <div className="overflow-y-auto">
                        <ul className="divide-y divide-gray-50">
                          {categories.map(c => (
                            <li key={c} className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors group">
                              {editingCategory?.old === c ? (
                                <div className="flex items-center gap-2 flex-1" onClick={e => e.stopPropagation()}>
                                  <input 
                                    type="text"
                                    value={editingCategory.new}
                                    onChange={(e) => setEditingCategory({...editingCategory, new: e.target.value})}
                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    autoFocus
                                  />
                                  <button 
                                    onClick={() => {
                                      const newName = editingCategory.new.trim();
                                      if (newName && newName !== c && !categories.includes(newName)) {
                                        setCategories(categories.map(cat => cat === c ? newName : cat));
                                        setTasks(tasks.map(t => t.category === c ? {...t, category: newName} : t));
                                        if (editingTask?.category === c) {
                                          setEditingTask({...editingTask, category: newName});
                                        }
                                      }
                                      setEditingCategory(null);
                                    }}
                                    className="text-green-600 hover:text-green-700 text-sm font-medium px-1"
                                  >
                                    保存
                                  </button>
                                  <button 
                                    onClick={() => setEditingCategory(null)}
                                    className="text-gray-500 hover:text-gray-700 text-sm font-medium px-1"
                                  >
                                    取消
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div 
                                    className="flex-1 cursor-pointer text-sm text-gray-700 py-1"
                                    onClick={() => {
                                      setEditingTask({...editingTask, category: c});
                                      setShowCategorySelector(false);
                                    }}
                                  >
                                    {c}
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                    <button 
                                      onClick={() => setEditingCategory({old: c, new: c})}
                                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                      title="编辑"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const newCategories = categories.filter(cat => cat !== c);
                                        setCategories(newCategories);
                                        if (editingTask?.category === c) {
                                          setEditingTask({...editingTask, category: newCategories[0] || ''});
                                        }
                                      }}
                                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                      title="删除"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </>
                              )}
                            </li>
                          ))}
                          {categories.length === 0 && !isAddingCategory && (
                            <li className="p-3 text-center text-sm text-gray-500">暂无分类</li>
                          )}
                          <li className="p-2 border-t border-gray-100 bg-gray-50/50 sticky bottom-0">
                            {isAddingCategory ? (
                              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <input 
                                  type="text"
                                  value={newCategoryName}
                                  onChange={(e) => setNewCategoryName(e.target.value)}
                                  placeholder="输入新分类..."
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                  autoFocus
                                />
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const trimmed = newCategoryName.trim();
                                    if (trimmed && !categories.includes(trimmed)) {
                                      setCategories([...categories, trimmed]);
                                      setNewCategoryName('');
                                      setIsAddingCategory(false);
                                    }
                                  }}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium px-1 whitespace-nowrap"
                                >
                                  完成
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewCategoryName('');
                                    setIsAddingCategory(false);
                                  }}
                                  className="text-gray-500 hover:text-gray-700 text-sm font-medium px-1 whitespace-nowrap"
                                >
                                  取消
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsAddingCategory(true);
                                }}
                                className="w-full flex items-center justify-center gap-1 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Plus size={14} />
                                新增
                              </button>
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                <textarea 
                  value={editingTask.target}
                  onChange={(e) => setEditingTask({...editingTask, target: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">督办院领导</label>
                  <select 
                    value={editingTask.leader}
                    onChange={(e) => setEditingTask({...editingTask, leader: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    {LEADERS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">主责部门</label>
                  <div 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all cursor-pointer flex justify-between items-center bg-white"
                    onClick={() => setShowDeptSelector(!showDeptSelector)}
                  >
                    <span className={editingTask.department ? 'text-gray-900' : 'text-gray-400'}>
                      {editingTask.department || '请选择主责部门'}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>

                  {showDeptSelector && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {DEPARTMENTS_TREE.map(group => (
                        <div key={group.id}>
                          <div 
                            className="flex items-center gap-1 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-800"
                            onClick={() => toggleDeptExpand(group.id)}
                          >
                            {expandedDepts.includes(group.id) ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
                            {group.name}
                          </div>
                          {expandedDepts.includes(group.id) && group.children.map(dept => (
                            <div 
                              key={dept.id}
                              className={`pl-8 pr-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${editingTask.department === dept.name ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}
                              onClick={() => {
                                setEditingTask({...editingTask, department: dept.name});
                                setShowDeptSelector(false);
                              }}
                            >
                              {dept.name}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">协办部门</label>
                  <div 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all cursor-pointer flex justify-between items-center bg-white"
                    onClick={() => setShowCoDeptSelector(!showCoDeptSelector)}
                  >
                    <span className={editingTask.coDepartment && editingTask.coDepartment !== '无' ? 'text-gray-900' : 'text-gray-400'}>
                      {editingTask.coDepartment && editingTask.coDepartment !== '无' ? editingTask.coDepartment : '请选择协办部门 (选填)'}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>

                  {showCoDeptSelector && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div 
                        className="flex items-center gap-1 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-500"
                        onClick={() => {
                          setEditingTask({...editingTask, coDepartment: '无'});
                          setShowCoDeptSelector(false);
                        }}
                      >
                        无 (清空)
                      </div>
                      {DEPARTMENTS_TREE.map(group => (
                        <div key={group.id}>
                          <div 
                            className="flex items-center gap-1 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-800"
                            onClick={() => toggleCoDeptExpand(group.id)}
                          >
                            {expandedCoDepts.includes(group.id) ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
                            {group.name}
                          </div>
                          {expandedCoDepts.includes(group.id) && group.children.map(dept => (
                            <div 
                              key={dept.id}
                              className={`pl-8 pr-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${editingTask.coDepartment === dept.name ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}
                              onClick={() => {
                                setEditingTask({...editingTask, coDepartment: dept.name});
                                setShowCoDeptSelector(false);
                              }}
                            >
                              {dept.name}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => {
                  setEditingTask(null);
                  setShowDeptSelector(false);
                  setShowCoDeptSelector(false);
                  setShowCategorySelector(false);
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (tasks.some(t => t.id === editingTask.id)) {
                    setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
                  } else {
                    setTasks([editingTask, ...tasks]);
                  }
                  setEditingTask(null);
                  setShowDeptSelector(false);
                  setShowCoDeptSelector(false);
                  setShowCategorySelector(false);
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
