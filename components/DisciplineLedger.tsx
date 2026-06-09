
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Upload, X, Calendar as CalendarIcon, AlertCircle
} from 'lucide-react';
import { DisciplineLedgerDetail } from './DisciplineLedgerDetail';

interface LedgerItem {
  id: string;
  issue: number;
  year: string;
  meetingDate: string;
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
    year: '2026-2027年度',
    meetingDate: '2026-05-15',
    reportedDiscipline: '心血管内科',
    reporter: '张志诚',
    agreedMattersCount: 9,
    progress: '2/9',
    overallStatus: '已召开-推进中',
    lastUpdated: '2026-05-28'
  },
  {
    id: '2',
    issue: 11,
    year: '2026-2027年度',
    meetingDate: '2026-05-15',
    reportedDiscipline: '神经外科',
    reporter: '林德华',
    agreedMattersCount: 7,
    progress: '4/7',
    overallStatus: '事项全部办结',
    lastUpdated: '2026-05-25'
  },
  {
    id: '3',
    issue: 10,
    year: '2026-2027年度',
    meetingDate: '2026-04-20',
    reportedDiscipline: '呼吸与危重症医学科',
    reporter: '王海滨',
    agreedMattersCount: 12,
    progress: '5/12',
    overallStatus: '已召开-推进滞后',
    lastUpdated: '2026-05-27'
  },
  {
    id: '4',
    issue: 9,
    year: '2026-2027年度',
    meetingDate: '2026-04-20',
    reportedDiscipline: '康复医学科',
    reporter: '陈静云',
    agreedMattersCount: 5,
    progress: '1/5',
    overallStatus: '已召开-推进受阻',
    lastUpdated: '2026-05-28'
  },
  {
    id: '5',
    issue: 8,
    year: '2026-2027年度',
    meetingDate: '2026-03-15',
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
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LedgerItem | null>(null);
  const [issueError, setIssueError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    year: YEARS[0],
    issue: '',
    meetingDate: '',
    reportedDiscipline: '',
    reporter: '',
    analysisSummary: '',
    painPoints: ''
  });

  const handleOpenAddModal = () => {
    const maxIssue = Math.max(...MOCK_LEDGER_DATA.map(item => item.issue), 0);
    setFormData({
      year: YEARS[0], 
      issue: (maxIssue + 1).toString(),
      meetingDate: new Date().toISOString().split('T')[0],
      reportedDiscipline: '',
      reporter: '',
      analysisSummary: '',
      painPoints: ''
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
      .filter(item => {
        const matchSearch = item.reportedDiscipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.reporter.toLowerCase().includes(searchTerm.toLowerCase());
        const matchYear = !selectedYear || item.year === selectedYear;
        return matchSearch && matchYear;
      })
      .sort((a, b) => b.issue - a.issue);
  }, [searchTerm, selectedYear]);

  if (selectedItem) {
    return <DisciplineLedgerDetail item={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col gap-5 overflow-hidden">
      {/* Header & Stats Summary */}
      <div className="flex items-center justify-between">
        <div />


        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center gap-3">
             <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">年度筛选</span>
             <select 
               value={selectedYear}
               onChange={(e) => setSelectedYear(e.target.value)}
               className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer transition-all min-w-[160px]"
             >
               {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
             </select>
          </div>

          <div className="h-6 w-px bg-gray-100"></div>

          <div className="relative group flex-1 max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="搜索报告学科或报告人..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all placeholder:text-gray-400"
            />
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
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">报告学科</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">报告人</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">议定事项</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">办结/跟踪</th>
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
                  <td className="px-6 py-5 text-right">
                    <div className="text-[13px] font-bold text-gray-700">{row.lastUpdated}</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-2 py-1 hover:bg-indigo-50 rounded-lg">编辑</button>
                      <button className="text-[13px] font-bold text-rose-500 hover:text-rose-700 transition-colors px-2 py-1 hover:bg-rose-50 rounded-lg">删除</button>
                    </div>
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
                  <h3 className="text-lg font-bold text-gray-900">新建</h3>
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

                {/* Section 2: Discipline Analysis Summary */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">学科剖析情况摘要</h4>
                  </div>
                  <div className="space-y-1.5">
                    <textarea 
                      rows={6}
                      placeholder="请输入学科剖析情况摘要（包含建设进展、梯队建设、新技术应用及对标差距等内容）..."
                      value={formData.analysisSummary}
                      onChange={(e) => setFormData({...formData, analysisSummary: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-4 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 outline-none transition-all resize-none placeholder:text-gray-300 leading-relaxed"
                    />
                  </div>
                </section>

                {/* Section 3: Pain Points */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">痛点</h4>
                  </div>
                  <div className="space-y-1.5">
                    <textarea 
                      rows={6}
                      placeholder="请输入核心痛点及院领导现场办公意见总结..."
                      value={formData.painPoints}
                      onChange={(e) => setFormData({...formData, painPoints: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-4 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 outline-none transition-all resize-none placeholder:text-gray-300 leading-relaxed"
                    />
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
