import React, { useState } from 'react';
import { ArrowLeft, Upload, Download, CheckCircle2, Clock, AlertCircle, FileEdit, CheckSquare, MessageSquare, Activity, Plus, Edit, X, FileText, Paperclip, Bot, Sparkles } from 'lucide-react';

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
  coDepartment: '无',
  status: '进行中',
  progress: 65,
  description: '全面落实新时代党的建设总要求，以高质量党建引领医院高质量发展。重点围绕理论学习、调查研究、推动发展、检视整改等方面开展工作。'
};

// Mock data for phased tasks
const MOCK_PHASES = [
  {
    id: 1,
    stage: '第一季度',
    timeNode: '2026-03-31',
    content: '制定主题教育实施方案，召开动员部署会；开展集中学习研讨不少于3次。',
    kpi: '方案发布率100%，集中学习参会率>95%',
    status: '已完成'
  },
  {
    id: 2,
    stage: '第二季度',
    timeNode: '2026-06-30',
    content: '院领导班子成员带头开展调查研究，形成高质量调研报告；讲授专题党课。',
    kpi: '调研报告不少于5篇，专题党课不少于5次',
    status: '待审核'
  },
  {
    id: 3,
    stage: '第三季度',
    timeNode: '2026-09-30',
    content: '对照检视问题清单，抓好整改落实；开展专项整治工作。',
    kpi: '问题整改率>80%，专项整治取得阶段性成效',
    status: '已填报'
  },
  {
    id: 4,
    stage: '第四季度',
    timeNode: '2026-12-31',
    content: '召开专题民主生活会和组织生活会；总结评估主题教育成效，建章立制。',
    kpi: '形成长效机制制度不少于3项，群众满意度>90%',
    status: '未开始'
  }
];

// Mock data for supervision traces
interface Trace {
  id: number;
  date: string;
  user: string;
  targetTask: string;
  action: string;
  content: string;
  progressStatus?: string;
  attachments?: { name: string; size: string }[];
}

const MOCK_TRACES: Trace[] = [
  {
    id: 1,
    date: '2026-03-10 14:30',
    user: '王督导',
    targetTask: '第一季度',
    action: '批示',
    content: '第一季度学习研讨开展扎实，请继续保持。第二季度调研工作要紧密结合医院实际业务痛点。'
  },
  {
    id: 2,
    date: '2026-02-15 09:00',
    user: '李干事',
    targetTask: '第一季度',
    action: '填报',
    content: '已完成第一季度集中学习研讨3次，参会率98%。相关台账已上传。',
    attachments: [
      { name: '第一季度学习研讨签到表.pdf', size: '1.2MB' },
      { name: '活动现场照片.jpg', size: '3.5MB' }
    ]
  },
  {
    id: 3,
    date: '2026-01-05 10:00',
    user: '张书记',
    targetTask: '总体任务',
    action: '任务下达',
    content: '请按计划严格执行，确保主题教育取得实效。'
  }
];

export const TaskSupervisionDetail: React.FC<TaskSupervisionDetailProps> = ({ taskId, onBack }) => {
  const [phases, setPhases] = useState(MOCK_PHASES);
  const [traces, setTraces] = useState<Trace[]>(MOCK_TRACES);
  const [modalType, setModalType] = useState<'edit' | 'fill' | 'audit' | 'review' | null>(null);
  const [editingPhase, setEditingPhase] = useState<any>(null);
  const [formData, setFormData] = useState({
    stage: '',
    timeNode: '',
    content: '',
    kpi: ''
  });
  const [actionComment, setActionComment] = useState('');
  const [progressStatus, setProgressStatus] = useState<'正常' | '滞后' | ''>('');

  const handleOpenModal = (type: 'edit' | 'fill' | 'audit' | 'review', phase?: any) => {
    setModalType(type);
    setActionComment('');
    setProgressStatus('');
    if (phase) {
      setEditingPhase(phase);
      if (type === 'edit') {
        setFormData({
          stage: phase.stage,
          timeNode: phase.timeNode,
          content: phase.content,
          kpi: phase.kpi
        });
      }
    } else {
      setEditingPhase(null);
      setFormData({
        stage: '',
        timeNode: '',
        content: '',
        kpi: ''
      });
    }
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
    setModalType(null);
  };

  const handleActionSubmit = (actionType: 'fill' | 'audit_pass' | 'audit_reject' | 'review') => {
    if (!editingPhase) return;
    
    const newTrace = {
      id: Date.now(),
      date: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      user: actionType === 'fill' ? '李干事' : actionType === 'review' ? '张书记' : '王督导',
      targetTask: editingPhase.stage,
      action: actionType === 'fill' ? '填报' : actionType === 'review' ? '批示' : (actionType === 'audit_pass' ? '审核通过' : '审核退回'),
      content: actionComment || (actionType === 'audit_pass' ? '已审核通过该阶段任务。' : ''),
      progressStatus: actionType === 'review' ? progressStatus : undefined,
      attachments: actionType === 'fill' ? [{ name: '最新进展汇报.pdf', size: '2.4MB' }] : undefined
    };

    setTraces(prev => [newTrace, ...prev]);

    if (actionType === 'fill') {
      setPhases(phases.map(p => p.id === editingPhase.id ? { 
        ...p, 
        status: 'AI初审中',
        progressDescription: actionComment,
        attachments: [{ name: '阶段进展佐证材料.pdf', size: '2.4 MB' }]
      } : p));

      // Simulate AI Review process
      setTimeout(() => {
        const aiTrace = {
          id: Date.now() + 1,
          date: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
          user: 'AI 智能助手',
          targetTask: editingPhase.stage,
          action: 'AI初审',
          content: `【AI初审通过】经语义分析与材料比对，填报内容与阶段目标（${editingPhase.kpi}）匹配度达 96%。佐证材料格式合规，无缺失。已自动流转至人工督办审核环节。`,
        };
        setTraces(prev => [aiTrace, ...prev]);
        setPhases(prevPhases => prevPhases.map(p => p.id === editingPhase.id ? { ...p, status: '待审核' } : p));
      }, 2000);

    } else if (actionType === 'audit_pass') {
      setPhases(phases.map(p => p.id === editingPhase.id ? { ...p, status: '已完成' } : p));
    } else if (actionType === 'audit_reject') {
      setPhases(phases.map(p => p.id === editingPhase.id ? { ...p, status: '未开始' } : p));
    }

    setModalType(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '已完成':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 size={12} /> 已完成</span>;
      case '待审核':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={12} /> 待审核</span>;
      case '已填报':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><AlertCircle size={12} /> 已填报</span>;
      case 'AI初审中':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Sparkles size={12} className="animate-pulse" /> AI初审中</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getActionIcon = (action: string) => {
    switch(action) {
      case '批示': return <MessageSquare size={14} className="text-purple-600" />;
      case '填报': return <Edit size={14} className="text-blue-600" />;
      case '审核通过': return <CheckCircle2 size={14} className="text-green-600" />;
      case '审核退回': return <AlertCircle size={14} className="text-red-600" />;
      case '任务下达': return <CheckSquare size={14} className="text-indigo-600" />;
      case 'AI初审': return <Bot size={14} className="text-purple-600" />;
      default: return <Activity size={14} className="text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch(action) {
      case '批示': return 'bg-purple-100 border-purple-200';
      case '填报': return 'bg-blue-100 border-blue-200';
      case '审核通过': return 'bg-green-100 border-green-200';
      case '审核退回': return 'bg-red-100 border-red-200';
      case '任务下达': return 'bg-indigo-100 border-indigo-200';
      case 'AI初审': return 'bg-purple-100 border-purple-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const renderActionSentence = (trace: any) => {
    if (trace.action === '任务下达') {
      return (
        <div className="text-sm text-gray-600 flex items-center gap-1.5 flex-wrap">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mr-1">
            {trace.user.charAt(0)}
          </div>
          <span className="font-bold text-gray-900">{trace.user}</span>
          <span>下达了</span>
          <span className="font-medium text-blue-700">{trace.targetTask}</span>
        </div>
      );
    }
    if (trace.action === 'AI初审') {
      return (
        <div className="text-sm text-gray-600 flex items-center gap-1.5 flex-wrap">
          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold mr-1">
            <Bot size={14} />
          </div>
          <span className="font-bold text-purple-700">{trace.user}</span>
          <span>对</span>
          <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">{trace.targetTask}</span>
          <span>进行了</span>
          <span className="font-medium px-2 py-0.5 rounded-md text-xs border bg-purple-50 text-purple-700 border-purple-200">
            {trace.action}
          </span>
        </div>
      );
    }
    return (
      <div className="text-sm text-gray-600 flex items-center gap-1.5 flex-wrap">
        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mr-1">
          {trace.user.charAt(0)}
        </div>
        <span className="font-bold text-gray-900">{trace.user}</span>
        <span>对</span>
        <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">{trace.targetTask}</span>
        <span>的完成情况进行了</span>
        <span className={`font-medium px-2 py-0.5 rounded-md text-xs border ${
          trace.action === '批示' ? 'bg-purple-50 text-purple-700 border-purple-200' :
          trace.action === '填报' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          trace.action === '审核通过' ? 'bg-green-50 text-green-700 border-green-200' :
          trace.action === '审核退回' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-gray-50 text-gray-700 border-gray-200'
        }`}>{trace.action}</span>
      </div>
    );
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
            项目详情
            <span className="text-sm font-normal px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md">编号: {MOCK_TASK.id}</span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
        
        {/* Top Section: Task Info & Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">{MOCK_TASK.category}</span>
                <h2 className="text-lg font-bold text-gray-900">{MOCK_TASK.target}</h2>
              </div>
              
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
                  <div className="text-xs text-gray-500 mb-1">协办科室</div>
                  <div className="font-medium text-gray-900">{MOCK_TASK.coDepartment}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">当前状态</div>
                  <div className="font-medium text-blue-600">{MOCK_TASK.status}</div>
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
                onClick={() => handleOpenModal('edit')}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Plus size={16} />
                拆解任务
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
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-40">推进阶段</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">阶段核心工作任务</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-48">阶段 KPI 考核内容</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-28">当前状态</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-64 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {phases.map((phase) => (
                  <tr key={phase.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{phase.stage}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        截止: {phase.timeNode}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{phase.content}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 bg-gray-50/50">{phase.kpi}</td>
                    <td className="px-4 py-4">
                      {getStatusBadge(phase.status)}
                    </td>
                    <td className="px-4 py-4 border-l border-gray-100">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {/* 模拟权限控制：实际应用中根据 currentUser.role 判断是否渲染对应按钮 */}
                        <button 
                          onClick={() => handleOpenModal('edit', phase)}
                          className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          title="编辑阶段"
                        >
                          编辑
                        </button>
                        <button 
                          onClick={() => handleOpenModal('fill', phase)}
                          className="px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors" 
                          title="主办部门操作"
                        >
                          填报
                        </button>
                        <button 
                          onClick={() => handleOpenModal('audit', phase)}
                          className="px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors" 
                          title="院办督办操作"
                        >
                          审核
                        </button>
                        <button 
                          onClick={() => handleOpenModal('review', phase)}
                          className="px-2.5 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded transition-colors" 
                          title="院领导操作"
                        >
                          评阅
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
          
          <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
            {traces.map((trace, index) => (
              <div key={trace.id} className="relative pl-8">
                {/* Timeline icon */}
                <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${getActionColor(trace.action)}`}>
                  {getActionIcon(trace.action)}
                </div>
                
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    {renderActionSentence(trace)}
                    <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap ml-4">
                      <Clock size={12} />
                      {trace.date}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-lg border border-gray-50">
                    {trace.progressStatus && (
                      <div className="mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                          trace.progressStatus === '正常' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          进度评定：{trace.progressStatus}
                        </span>
                      </div>
                    )}
                    {trace.content}
                  </div>

                  {trace.attachments && trace.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
                        <Paperclip size={14} />
                        附件材料
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {trace.attachments.map((att: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group">
                            <FileText size={16} className="text-blue-500" />
                            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{att.name}</span>
                            <span className="text-gray-400 text-xs ml-2">{att.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      {modalType === 'edit' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingPhase ? '编辑阶段任务' : '拆解任务'}
              </h3>
              <button 
                onClick={() => setModalType(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">推进阶段名称（按季度）</label>
                  <select 
                    value={formData.stage}
                    onChange={(e) => setFormData({...formData, stage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="">请选择季度</option>
                    <option value="第一季度">第一季度</option>
                    <option value="第二季度">第二季度</option>
                    <option value="第三季度">第三季度</option>
                    <option value="第四季度">第四季度</option>
                  </select>
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
                onClick={() => setModalType(null)}
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

      {/* Action Modals (Fill, Audit, Review) */}
      {(modalType === 'fill' || modalType === 'audit' || modalType === 'review') && editingPhase && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setModalType(null)}
          ></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {modalType === 'fill' ? '填报阶段进展' : modalType === 'audit' ? '督办审核' : '领导评阅'}
              </h3>
              <button 
                onClick={() => setModalType(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm font-medium text-gray-900 mb-1">{editingPhase.stage}</div>
                <div className="text-xs text-gray-500 mb-3">截止日期: {editingPhase.timeNode}</div>
                <div className="text-sm text-gray-700">{editingPhase.content}</div>
              </div>

              {(modalType === 'audit' || modalType === 'review') && editingPhase.progressDescription && (
                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-lg space-y-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <FileEdit size={16} className="text-blue-600" />
                    主办部门填报进展
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{editingPhase.progressDescription}</p>
                  
                  {editingPhase.attachments && editingPhase.attachments.length > 0 && (
                    <div className="pt-2 border-t border-blue-100/50">
                      <div className="text-xs font-medium text-gray-500 mb-2">佐证材料：</div>
                      <div className="space-y-2">
                        {editingPhase.attachments.map((file: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-md shadow-sm">
                            <FileText size={16} className="text-blue-500" />
                            <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                            <span className="text-xs text-gray-400">{file.size}</span>
                            <div className="flex items-center gap-1">
                              <button className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 hover:bg-blue-50 rounded transition-colors">预览</button>
                              <button className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 hover:bg-blue-50 rounded transition-colors">下载</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(modalType === 'audit' || modalType === 'review') && traces.find(t => t.action === 'AI初审' && t.targetTask === editingPhase.stage) && (
                <div className="p-4 border border-purple-100 bg-purple-50/50 rounded-lg space-y-3 mb-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-200/40 to-transparent rounded-bl-full pointer-events-none"></div>
                  <h4 className="text-sm font-medium text-purple-900 flex items-center gap-2">
                    <Bot size={16} className="text-purple-600" />
                    AI 智能初审结论
                  </h4>
                  <p className="text-sm text-purple-800 whitespace-pre-wrap leading-relaxed">
                    {traces.find(t => t.action === 'AI初审' && t.targetTask === editingPhase.stage)?.content}
                  </p>
                </div>
              )}

              {modalType === 'review' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500 mr-1">*</span>
                    进度批示
                  </label>
                  <div className="flex items-center gap-6 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="progressStatus" 
                        value="正常"
                        checked={progressStatus === '正常'}
                        onChange={(e) => setProgressStatus(e.target.value as any)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">正常</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="progressStatus" 
                        value="滞后"
                        checked={progressStatus === '滞后'}
                        onChange={(e) => setProgressStatus(e.target.value as any)}
                        className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">滞后</span>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {modalType === 'fill' ? '进展说明及佐证材料' : modalType === 'audit' ? '审核意见' : '评阅批示'}
                </label>
                <textarea 
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  rows={4}
                  placeholder={
                    modalType === 'fill' ? '请详细描述本阶段任务的完成情况...' : 
                    modalType === 'audit' ? '请输入审核意见（选填）...' : 
                    '请输入评阅批示内容...'
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              {modalType === 'fill' && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload size={20} className="mx-auto text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600">点击或拖拽上传佐证材料</div>
                  <div className="text-xs text-gray-400 mt-1">支持 PDF, Word, Excel, 图片等格式</div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 shrink-0">
              <button 
                onClick={() => setModalType(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              
              {modalType === 'audit' ? (
                <>
                  <button 
                    onClick={() => handleActionSubmit('audit_reject')}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    退回重填
                  </button>
                  <button 
                    onClick={() => handleActionSubmit('audit_pass')}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    审核通过
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleActionSubmit(modalType)}
                  disabled={modalType === 'review' && (!actionComment || !progressStatus)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  提交
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
