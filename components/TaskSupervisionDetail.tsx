import React, { useState } from 'react';
import { ArrowLeft, Upload, Download, CheckCircle2, Clock, AlertCircle, FileEdit, CheckSquare, MessageSquare, Activity, Plus, Edit, X } from 'lucide-react';

interface TaskSupervisionDetailProps {
  taskId: number;
  onBack: () => void;
}

// Mock data for the task
const MOCK_TASK = {
  id: 1,
  category: '党的建设',
  target: '深入学习贯彻党的二十大精神，开展主题教育活动。',
  leader: '张书记',
  department: '党办',
  status: '进行中',
  progress: 65,
  description: '全面落实新时代党的建设总要求，以高质量党建引领医院高质量发展。重点围绕理论学习、调查研究、推动发展、检视整改等方面开展工作。'
};

// Mock data for phased tasks
const MOCK_PHASES = [
  {
    id: 1,
    stage: '2026年第一季度',
    timeNode: '2026-03-31',
    content: '制定主题教育实施方案，召开动员部署会；开展集中学习研讨不少于3次。',
    kpi: '方案发布率100%，集中学习参会率>95%',
    status: '已完成'
  },
  {
    id: 2,
    stage: '2026年第二季度',
    timeNode: '2026-06-30',
    content: '院领导班子成员带头开展调查研究，形成高质量调研报告；讲授专题党课。',
    kpi: '调研报告不少于5篇，专题党课不少于5次',
    status: '待审核'
  },
  {
    id: 3,
    stage: '2026年第三季度',
    timeNode: '2026-09-30',
    content: '对照检视问题清单，抓好整改落实；开展专项整治工作。',
    kpi: '问题整改率>80%，专项整治取得阶段性成效',
    status: '已填报'
  },
  {
    id: 4,
    stage: '2026年第四季度',
    timeNode: '2026-12-31',
    content: '召开专题民主生活会和组织生活会；总结评估主题教育成效，建章立制。',
    kpi: '形成长效机制制度不少于3项，群众满意度>90%',
    status: '未开始'
  }
];

// Mock data for supervision traces
const MOCK_TRACES = [
  {
    id: 1,
    date: '2026-03-10 14:30',
    user: '王督导',
    action: '批示',
    content: '第一季度学习研讨开展扎实，请继续保持。第二季度调研工作要紧密结合医院实际业务痛点。'
  },
  {
    id: 2,
    date: '2026-02-15 09:00',
    user: '李干事',
    action: '进度更新',
    content: '已完成第一季度集中学习研讨3次，参会率98%。相关台账已上传。'
  },
  {
    id: 3,
    date: '2026-01-05 10:00',
    user: '张书记',
    action: '任务下达',
    content: '请按计划严格执行，确保主题教育取得实效。'
  }
];

export const TaskSupervisionDetail: React.FC<TaskSupervisionDetailProps> = ({ taskId, onBack }) => {
  const [phases, setPhases] = useState(MOCK_PHASES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<any>(null);
  const [formData, setFormData] = useState({
    stage: '',
    timeNode: '',
    content: '',
    kpi: ''
  });

  const handleOpenModal = (phase?: any) => {
    if (phase) {
      setEditingPhase(phase);
      setFormData({
        stage: phase.stage,
        timeNode: phase.timeNode,
        content: phase.content,
        kpi: phase.kpi
      });
    } else {
      setEditingPhase(null);
      setFormData({
        stage: '',
        timeNode: '',
        content: '',
        kpi: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSavePhase = () => {
    if (editingPhase) {
      setPhases(phases.map(p => p.id === editingPhase.id ? { ...p, ...formData } : p));
    } else {
      const newPhase = {
        id: Date.now(),
        ...formData,
        status: '未开始'
      };
      setPhases([...phases, newPhase]);
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '已完成':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 size={12} /> 已完成</span>;
      case '待审核':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={12} /> 待审核</span>;
      case '已填报':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><AlertCircle size={12} /> 已填报</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-200"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            任务督导详情
            <span className="text-sm font-normal px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md">编号: {MOCK_TASK.id}</span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
        
        {/* Top Section: Task Info & Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">{MOCK_TASK.category}</span>
                <h2 className="text-lg font-bold text-gray-900">{MOCK_TASK.target}</h2>
              </div>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{MOCK_TASK.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">责任领导</div>
                  <div className="font-medium text-gray-900">{MOCK_TASK.leader}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">主责部门</div>
                  <div className="font-medium text-gray-900">{MOCK_TASK.department}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">当前状态</div>
                  <div className="font-medium text-blue-600">{MOCK_TASK.status}</div>
                </div>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="w-full md:w-64 flex flex-col items-center justify-center p-6 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="text-sm font-medium text-gray-600 mb-4">总体完成进度</div>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-blue-100"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600 drop-shadow-sm"
                    strokeWidth="3"
                    strokeDasharray={`${MOCK_TASK.progress}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{MOCK_TASK.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Phased Tasks & KPI */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              阶段任务精细化拆解与 KPI 考核池
            </h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Plus size={16} />
                新增阶段
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                <Upload size={16} />
                上传导入
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                <Download size={16} />
                导出台账
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-48">推进阶段</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">阶段工作内容及目标</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-64">量化 KPI 考核指标</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">阶段任务进度</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-64 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {phases.map((phase) => (
                  <tr key={phase.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{phase.stage}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        截止: {phase.timeNode}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{phase.content}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 bg-gray-50/50">{phase.kpi}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(phase.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(phase)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Edit size={14} /> 编辑
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors">
                          <FileEdit size={14} /> 填报
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors">
                          <CheckSquare size={14} /> 督办审核
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded transition-colors">
                          <MessageSquare size={14} /> 评阅
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section: Supervision Traces */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-600" />
            督导痕迹与批示记录
          </h3>
          
          <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
            {MOCK_TRACES.map((trace, index) => (
              <div key={trace.id} className="relative pl-6">
                {/* Timeline dot */}
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{trace.user}</span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-600">{trace.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">{trace.date}</span>
                  </div>
                  <p className="text-sm text-gray-700">{trace.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal for Add/Edit Phase */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingPhase ? '编辑阶段任务' : '新增阶段任务'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">推进阶段名称</label>
                  <input 
                    type="text" 
                    value={formData.stage}
                    onChange={(e) => setFormData({...formData, stage: e.target.value})}
                    placeholder="例如：2026年第一季度"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
                  <input 
                    type="date" 
                    value={formData.timeNode}
                    onChange={(e) => setFormData({...formData, timeNode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">阶段工作内容及目标</label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={3}
                  placeholder="详细描述该阶段需要完成的工作内容和目标..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">量化 KPI 考核指标</label>
                <textarea 
                  value={formData.kpi}
                  onChange={(e) => setFormData({...formData, kpi: e.target.value})}
                  rows={2}
                  placeholder="例如：方案发布率100%，集中学习参会率>95%"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSavePhase}
                disabled={!formData.stage || !formData.timeNode || !formData.content || !formData.kpi}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
