
import React, { useState, useMemo } from 'react';
import { 
  Search, Target, ChevronRight, Plus, Upload, X, Calendar as CalendarIcon, AlertCircle
} from 'lucide-react';
import { DisciplineLedgerDetail } from './DisciplineLedgerDetail';

interface LedgerItem {
  id: string;
  issue: number;
  meetingDate: string;
  category: '高峰学科' | '高原学科' | '特色学科' | '新兴学科';
  reportedDiscipline: string;
  reporter: string;
  agreedMattersCount: number;
  progress: string; // "x/y"
  overallStatus: '待召开' | '已召开-推进中' | '已召开-推进滞后' | '已召开-推进受阻' | '事项全部办结';
  lastUpdated: string;
}

const YEARS = [
  '2026-2027年度', 
  '2027-2028年度', 
  '2028-2029年度', 
  '2029-2030年度', 
  '2030-2031年度', 
  '2031-2032年度',
  '2032-2033年度',
  '2033-2034年度',
  '2034-2035年度',
  '2035-2036年度'
];
const DISCIPLINES = ['心血管内科', '神经外科', '呼吸与危重症医学科', '康复医学科', '生物信息医学中心', '消化内科', '肾内科', '妇产科', '儿科'];
const REPORTERS = ['张志诚', '林德华', '王海滨', '陈静云', '李明远', '赵继武', '孙博才', '钱晓芳'];

const MOCK_LEDGER_DATA: LedgerItem[] = [
  {
    id: '1',
    issue: 12,
    meetingDate: '2026-05-15',
    category: '高峰学科',
    reportedDiscipline: '心血管内科',
    reporter: '张志诚',
    agreedMattersCount: 9,
    progress: '2/9',
    overallStatus: '已召开-推进中',
    lastUpdated: '2026-05-28'
  },
  {
    id: '2',
    issue: 12,
    meetingDate: '2026-05-15',
    category: '高峰学科',
    reportedDiscipline: '神经外科',
    reporter: '林德华',
    agreedMattersCount: 7,
    progress: '4/7',
    overallStatus: '事项全部办结',
    lastUpdated: '2026-05-25'
  },
  {
    id: '3',
    issue: 11,
    meetingDate: '2026-04-20',
    category: '高原学科',
    reportedDiscipline: '呼吸与危重症医学科',
    reporter: '王海滨',
    agreedMattersCount: 12,
    progress: '5/12',
    overallStatus: '已召开-推进滞后',
    lastUpdated: '2026-05-27'
  },
  {
    id: '4',
    issue: 11,
    meetingDate: '2026-04-20',
    category: '特色学科',
    reportedDiscipline: '康复医学科',
    reporter: '陈静云',
    agreedMattersCount: 5,
    progress: '1/5',
    overallStatus: '已召开-推进受阻',
    lastUpdated: '2026-05-28'
  },
  {
    id: '5',
    issue: 10,
    meetingDate: '2026-03-15',
    category: '新兴学科',
    reportedDiscipline: '生物信息医学中心',
    reporter: '李明远',
    agreedMattersCount: 8,
    progress: '7/8',
    overallStatus: '待召开',
    lastUpdated: '2026-05-20'
  }
];

export const DisciplineLedger: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LedgerItem | null>(null);
  const [issueError, setIssueError] = useState('');

  const stats = useMemo(() => {
    const totalMatters = MOCK_LEDGER_DATA.reduce((acc, item) => acc + item.agreedMattersCount, 0);
    const completedMatters = MOCK_LEDGER_DATA.reduce((acc, item) => {
      const [done] = item.progress.split('/').map(Number);
      return acc + done;
    }, 0);
    const percentage = totalMatters > 0 ? ((completedMatters / totalMatters) * 100).toFixed(1) : '0';
    return { totalMatters, completedMatters, percentage };
  }, []);
  
  // Form State
  const [formData, setFormData] = useState({
    year: YEARS[0],
    issue: '',
    meetingDate: '',
    category: '高峰学科',
    reportedDiscipline: '',
    reporter: '',
    constructionSummary: '',
    benchmarkingGap: '',
    developmentDirection: '',
    corePainPoints: '',
    leadershipOpinions: ''
  });

  const handleOpenAddModal = () => {
    const maxIssue = Math.max(...MOCK_LEDGER_DATA.map(item => item.issue), 0);
    setFormData({
      year: YEARS[0], 
      issue: (maxIssue + 1).toString(),
      meetingDate: new Date().toISOString().split('T')[0],
      category: '高峰学科',
      reportedDiscipline: '',
      reporter: '',
      constructionSummary: '',
      benchmarkingGap: '',
      developmentDirection: '',
      corePainPoints: '',
      leadershipOpinions: ''
    });
    setIssueError('');
    setShowAddModal(true);
  };

  const handleIssueChange = (val: string) => {
    setFormData({ ...formData, issue: val });
    if (MOCK_LEDGER_DATA.some(item => item.issue.toString() === val)) {
      setIssueError('该期数已存在，请勿重复输入');
    } else {
      setIssueError('');
    }
  };

  const filteredData = useMemo(() => {
    return [...MOCK_LEDGER_DATA]
      .sort((a, b) => a.issue - b.issue)
      .filter(item => {
        const matchSearch = item.reportedDiscipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.reporter.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = categoryFilter === '全部' || item.category === categoryFilter;
        const matchStatus = statusFilter === '全部' || item.overallStatus === statusFilter;
        return matchSearch && matchCategory && matchStatus;
      });
  }, [searchTerm, categoryFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '待召开':
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200 uppercase tracking-tight">待召开</span>;
      case '已召开-推进中':
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-tight">推进中</span>;
      case '已召开-推进滞后':
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-tight">推进滞后</span>;
      case '已召开-推进受阻':
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-tight">推进受阻</span>;
      case '事项全部办结':
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tight">全部办结</span>;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '高峰学科': return 'text-indigo-600 bg-indigo-50/50';
      case '高原学科': return 'text-emerald-600 bg-emerald-50/50';
      case '特色学科': return 'text-amber-600 bg-amber-50/50';
      case '新兴学科': return 'text-purple-600 bg-purple-50/50';
      default: return 'text-gray-600 bg-gray-50/50';
    }
  };

  if (selectedItem) {
    return <DisciplineLedgerDetail item={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col gap-5 overflow-hidden">
      {/* Header & Stats Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-indigo-600">
            <Target size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">会议跟踪台账</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500 font-bold">数据更新: 2026-05-28</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm overflow-hidden mr-2">
                <div className="px-4 py-2 flex flex-col items-center border-r border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">议定合计数</span>
                    <span className="text-sm font-black text-gray-900">{stats.totalMatters} <span className="text-[10px] font-medium text-gray-400 ml-0.5">条</span></span>
                </div>
                <div className="px-4 py-2 flex flex-col items-center border-r border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">已完成</span>
                    <span className="text-sm font-black text-emerald-600">{stats.completedMatters} <span className="text-[10px] font-medium text-gray-400 ml-0.5">条</span></span>
                </div>
                <div className="px-4 py-2 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">总体进度</span>
                    <span className="text-sm font-black text-blue-600">{stats.percentage}%</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                  <Plus size={16} />
                  新建
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95">
                  <Upload size={16} className="text-gray-400" />
                  导入
              </button>
            </div>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative group flex-1 max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="搜索报告学科、报告人..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">学科类别:</span>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-50 border-none rounded-xl px-3 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="全部">全部类别</option>
              <option value="高峰学科">高峰学科</option>
              <option value="高原学科">高原学科</option>
              <option value="特色学科">特色学科</option>
              <option value="新兴学科">新兴学科</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">推进状态:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border-none rounded-xl px-3 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="全部">全部状态</option>
              <option value="待召开">待召开</option>
              <option value="已召开-推进中">已召开-推进中</option>
              <option value="已召开-推进滞后">已召开-推进滞后</option>
              <option value="已召开-推进受阻">已召开-推进受阻</option>
              <option value="事项全部办结">事项全部办结</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">期数</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">会议日期</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">类别</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">报告学科</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">报告人</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">议定事项</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">办结/跟踪</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">总体推进状态</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">最近更新</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-black text-gray-600 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                      {row.issue}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-semibold text-gray-700">
                      {row.meetingDate}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded text-[10px] font-black tracking-tight ${getCategoryColor(row.category)}`}>
                      {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => setSelectedItem(row)}
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-800 leading-tight hover:underline transition-all cursor-pointer text-left"
                    >
                      {row.reportedDiscipline}
                    </button>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-medium text-gray-700">{row.reporter}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-sm font-black text-gray-900">{row.agreedMattersCount} <span className="text-[10px] font-medium text-gray-400 ml-0.5">条</span></div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="text-sm font-black text-indigo-600">{row.progress}</div>
                        <div className="w-16 h-1 bg-gray-50 rounded-full overflow-hidden">
                            {(() => {
                              const [done, total] = row.progress.split('/').map(Number);
                              const percentage = total > 0 ? (done / total) * 100 : 0;
                              return (
                                <div 
                                    className="h-full bg-indigo-600 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                ></div>
                              );
                            })()}
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(row.overallStatus)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="text-[13px] font-bold text-gray-700">{row.lastUpdated}</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-none hover:shadow-sm">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search size={40} className="text-gray-200" />
                </div>
                <h3 className="text-base font-bold text-gray-800">未找到匹配的台账记录</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">请尝试调整搜索关键词或选择不同的筛选条件</p>
            </div>
          )}
        </div>


      </div>
      {/* New Matter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">新建议定事项</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 gap-8">
                {/* Section 1: Basic Info */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">基础信息</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">年度</label>
                      <select 
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
                      >
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">期数</label>
                      <input 
                        type="number" 
                        placeholder="请输入期数"
                        value={formData.issue}
                        onChange={(e) => handleIssueChange(e.target.value)}
                        className={`w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 outline-none transition-all placeholder:text-gray-400 font-mono ${issueError ? 'ring-2 ring-rose-500/20' : 'focus:ring-indigo-500/20'}`}
                      />
                      {issueError && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-rose-500">
                          <AlertCircle size={10} />
                          {issueError}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">会议日期</label>
                      <div className="relative">
                        <CalendarIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="date" 
                          value={formData.meetingDate}
                          onChange={(e) => setFormData({...formData, meetingDate: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">类别</label>
                      <div className="flex gap-2">
                        {['高峰学科', '高原学科', '特色学科', '新兴学科'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setFormData({...formData, category: cat as LedgerItem['category']})}
                            className={`flex-1 px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${formData.category === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-200'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">报告学科</label>
                      <select 
                        value={formData.reportedDiscipline}
                        onChange={(e) => setFormData({...formData, reportedDiscipline: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
                      >
                        <option value="">请选择报告学科</option>
                        {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">报告人</label>
                      <select 
                        value={formData.reporter}
                        onChange={(e) => setFormData({...formData, reporter: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
                      >
                        <option value="">请选择报告人</option>
                        {REPORTERS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </section>

                {/* Section 2: Discipline Analysis */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">学科剖析情况摘要</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">建设 / 梯队 / 新技术</label>
                      <textarea 
                        rows={3}
                        placeholder="请输入建设进展、梯队建设及新技术应用情况..."
                        value={formData.constructionSummary}
                        onChange={(e) => setFormData({...formData, constructionSummary: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none placeholder:text-gray-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">对标差距</label>
                        <textarea 
                          rows={3}
                          placeholder="请输入与对标学科的实际差距分析..."
                          value={formData.benchmarkingGap}
                          onChange={(e) => setFormData({...formData, benchmarkingGap: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none placeholder:text-gray-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">发展方向</label>
                        <textarea 
                          rows={3}
                          placeholder="请输入未来发展重点及具体方向..."
                          value={formData.developmentDirection}
                          onChange={(e) => setFormData({...formData, developmentDirection: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: Pain Points & Opinions */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">痛点和院领导意见</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">核心痛点 (归口)</label>
                      <textarea 
                        rows={4}
                        placeholder="请输入学科发展中亟待解决的核心痛点问题..."
                        value={formData.corePainPoints}
                        onChange={(e) => setFormData({...formData, corePainPoints: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">院领导现场办公意见摘要</label>
                      <textarea 
                        rows={4}
                        placeholder="请输入院领导在现场办公中给出的具体指导意见..."
                        value={formData.leadershipOpinions}
                        onChange={(e) => setFormData({...formData, leadershipOpinions: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-50 bg-gray-50/50 flex items-center justify-end">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  取消
                </button>
                <button 
                  className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  提交
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
