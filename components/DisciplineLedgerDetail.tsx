
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Plus, Upload, Clock, X, Calendar, Search, ChevronDown, Check,
  CheckCircle2, FileText, Eye, Download, Trash2,
  LayoutDashboard, ClipboardList, TrendingUp, MessageSquare
} from 'lucide-react';

interface ProgressPhase {
  id: string;
  date: string;
  content: string;
  reporter: string;
  status: TrackingItem['status'];
  attachments?: string[];
}

interface TrackingItem {
  id: string;
  issue: number;
  discipline: string;
  itemNo: string;
  agreedMatter: string;
  leadDept: string;
  supportingDepts: string[];
  completionTier?: '短期' | '中期' | '中长期' | '长期';
  agreedCompletionTime: string;
  deliverable?: string;
  feedbackFrequency: '月度' | '季度';
  status: '未启动' | '推进中' | '已办结';
  lastFeedbackDate: string;
  progressHistory?: ProgressPhase[];
}

interface LedgerItem {
  id: string;
  issue: number;
  meetingDate: string;
  reportedDiscipline: string;
  reporter: string;
  agreedMattersCount: number;
  progress: string;
  overallStatus: string;
  lastUpdated: string;
  attachments?: string[];
}

interface DisciplineLedgerDetailProps {
  item: LedgerItem;
  onBack: () => void;
}

const DEPARTMENTS = ['医务处', '护理部', '人事处', '财务处', '信息中心', '后勤保障处', '科技处', '教育处'];
const FREQUENCIES: Array<TrackingItem['feedbackFrequency']> = ['月度', '季度'];
const STATUSES: Array<TrackingItem['status']> = ['未启动', '推进中', '已办结'];

export const DisciplineLedgerDetail: React.FC<DisciplineLedgerDetailProps> = ({ item, onBack }) => {
  const [ledgerAttachments, setLedgerAttachments] = useState<string[]>(item.attachments || ['2026年度学科建设汇报PPT.pptx', '科室发展规划现状调研报告.pdf', '本周重点工作推进记录.docx', '外部专家初审意见汇总.pdf']);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        setLedgerAttachments(prev => [...prev, file.name]);
        setIsUploading(false);
        setShowUploadModal(false);
      }, 1500);
    }
  };

  const removeAttachment = (name: string) => {
    setLedgerAttachments(prev => prev.filter(f => f !== name));
  };

  const [trackingData, setTrackingData] = useState<TrackingItem[]>(() => {
    const baseItems: TrackingItem[] = [
      {
        id: '1',
        issue: item.issue,
        discipline: item.reportedDiscipline,
        itemNo: `${item.issue}-01`,
        agreedMatter: '开展心血管介入手术新技术准入，提升三四级手术占比',
        leadDept: '医务处',
        supportingDepts: ['科技处', '人事处'],
        completionTier: '短期',
        agreedCompletionTime: '2026-08-30',
        deliverable: '新技术准入报告、手术记录汇总',
        feedbackFrequency: '月度',
        status: '推进中',
        lastFeedbackDate: '2026-05-28',
        progressHistory: [
          { id: 'p1', date: '2026-04-15', content: '初步完成新技术准入目录梳理，并上报医务处。', reporter: '王建国', status: '推进中' },
          { id: 'p2', date: '2026-05-28', content: '首批3项技术已通过伦理委员会初审，正在准备科室论证材料。', reporter: '李晓明', status: '推进中' }
        ]
      },
      {
        id: '2',
        issue: item.issue,
        discipline: item.reportedDiscipline,
        itemNo: `${item.issue}-02`,
        agreedMatter: '引进2名海外高层次人才，完善学科梯队建设',
        leadDept: '人事处',
        supportingDepts: ['信息中心'],
        completionTier: '长期',
        agreedCompletionTime: '2027-05-30',
        deliverable: '入职合同、简历存档',
        feedbackFrequency: '季度',
        status: '推进中',
        lastFeedbackDate: '2026-05-20'
      }
    ];

    if (item.reportedDiscipline === '生物信息医学中心') {
      const bioItems: TrackingItem[] = [
        {
          id: 'bio-1',
          issue: item.issue,
          discipline: item.reportedDiscipline,
          itemNo: `${item.issue}-03`,
          agreedMatter: '生物信息资源公共服务平台二期建设启动',
          leadDept: '信息中心',
          supportingDepts: ['科技处'],
          completionTier: '中长期',
          agreedCompletionTime: '2026-12-30',
          deliverable: '平台架构设计说明书',
          feedbackFrequency: '月度',
          status: '推进中',
          lastFeedbackDate: '2026-05-25'
        },
        {
          id: 'bio-2',
          issue: item.issue,
          discipline: item.reportedDiscipline,
          itemNo: `${item.issue}-04`,
          agreedMatter: '与北京大学联合开展肿瘤精准医疗大数据分析项目',
          leadDept: '科技处',
          supportingDepts: ['医务处'],
          completionTier: '长期',
          agreedCompletionTime: '2027-06-15',
          deliverable: '联合研究协议、季度进展报告',
          feedbackFrequency: '季度',
          status: '推进中',
          lastFeedbackDate: '2026-05-28'
        },
        {
          id: 'bio-3',
          issue: item.issue,
          discipline: item.reportedDiscipline,
          itemNo: `${item.issue}-05`,
          agreedMatter: '全院生物样本库信息化系统对接联调',
          leadDept: '信息中心',
          supportingDepts: ['后勤保障处'],
          completionTier: '短期',
          agreedCompletionTime: '2026-07-20',
          deliverable: '接口调试报告',
          feedbackFrequency: '月度',
          status: '推进中',
          lastFeedbackDate: '2026-05-29'
        },
        {
          id: 'bio-4',
          issue: item.issue,
          discipline: item.reportedDiscipline,
          itemNo: `${item.issue}-06`,
          agreedMatter: '生物信息专业技术人才专项岗贴方案报批',
          leadDept: '人事处',
          supportingDepts: ['财务处'],
          completionTier: '短期',
          agreedCompletionTime: '2026-06-30',
          deliverable: '方案正式批复文件',
          feedbackFrequency: '月度',
          status: '已办结',
          lastFeedbackDate: '2026-05-30'
        },
        {
          id: 'bio-5',
          issue: item.issue,
          discipline: item.reportedDiscipline,
          itemNo: `${item.issue}-07`,
          agreedMatter: '高性能计算集群扩容及安全加固',
          leadDept: '信息中心',
          supportingDepts: ['科技处'],
          completionTier: '中期',
          agreedCompletionTime: '2026-09-15',
          deliverable: '验收测试报告',
          feedbackFrequency: '月度',
          status: '未启动',
          lastFeedbackDate: '2026-05-20'
        },
        {
          id: 'bio-6',
          issue: item.issue,
          discipline: item.reportedDiscipline,
          itemNo: `${item.issue}-08`,
          agreedMatter: '多组学数据临床转化应用试点（心内科/肾内科）',
          leadDept: '医务处',
          supportingDepts: ['信息中心'],
          completionTier: '长期',
          agreedCompletionTime: '2027-12-31',
          deliverable: '临床应用指南草案',
          feedbackFrequency: '季度',
          status: '推进中',
          lastFeedbackDate: '2026-05-28'
        },
        {
          id: 'bio-7',
          issue: item.issue,
          discipline: item.reportedDiscipline,
          itemNo: `${item.issue}-09`,
          agreedMatter: '年度生物信息核心算法专利申报（不少于5项）',
          leadDept: '科技处',
          supportingDepts: ['财务处', '信息中心'],
          completionTier: '中期',
          agreedCompletionTime: '2026-11-20',
          deliverable: '专利受理通知书',
          feedbackFrequency: '季度',
          status: '推进中',
          lastFeedbackDate: '2026-05-22'
        },
        {
          id: 'bio-8',
          issue: item.issue,
          discipline: item.reportedDiscipline,
          itemNo: `${item.issue}-10`,
          agreedMatter: '学科实验室生物安全专项审计',
          leadDept: '医务处',
          supportingDepts: ['后勤保障处'],
          completionTier: '短期',
          agreedCompletionTime: '2026-07-15',
          deliverable: '整改报告、审计合格确认书',
          feedbackFrequency: '月度',
          status: '已办结',
          lastFeedbackDate: '2026-05-25'
        },
        {
          id: 'bio-9',
          issue: item.issue,
          discipline: item.reportedDiscipline,
          itemNo: `${item.issue}-11`,
          agreedMatter: '海外生物信息学专家客座讲学交流活动',
          leadDept: '教育处',
          supportingDepts: ['科技处', '人事处'],
          completionTier: '短期',
          agreedCompletionTime: '2026-09-10',
          deliverable: '讲座总结、专家签到表',
          feedbackFrequency: '月度',
          status: '未启动',
          lastFeedbackDate: '2026-05-10'
        },
        {
          id: 'bio-10',
          issue: item.issue,
          discipline: item.reportedDiscipline,
          itemNo: `${item.issue}-12`,
          agreedMatter: '中心官网英文版上线及海外宣传推广',
          leadDept: '信息中心',
          supportingDepts: ['信息中心'],
          completionTier: '中期',
          agreedCompletionTime: '2026-10-15',
          deliverable: '网站访问量统计报告',
          feedbackFrequency: '月度',
          status: '推进中',
          lastFeedbackDate: '2026-05-28'
        }
      ];
      return [...baseItems, ...bioItems];
    }

    const otherItems: TrackingItem[] = [
      {
        id: '3',
        issue: item.issue,
        discipline: item.reportedDiscipline,
        itemNo: `${item.issue}-03`,
        agreedMatter: '完成新病区装修改造及医疗设备采购',
        leadDept: '后勤保障处',
        supportingDepts: ['财务处', '信息中心'],
        completionTier: '中长期',
        agreedCompletionTime: '2026-12-15',
        deliverable: '验收报告、设备固定资产清单',
        feedbackFrequency: '月度',
        status: '已办结',
        lastFeedbackDate: '2026-05-25'
      },
      {
        id: '4',
        issue: item.issue,
        discipline: item.reportedDiscipline,
        itemNo: `${item.issue}-04`,
        agreedMatter: '智慧医疗HIS系统数据中台API接口开放',
        leadDept: '信息中心',
        supportingDepts: ['科技处'],
        completionTier: '短期',
        agreedCompletionTime: '2026-06-15',
        deliverable: 'API文技术档、接口测试报告',
        feedbackFrequency: '月度',
        status: '推进中',
        lastFeedbackDate: '2026-05-30'
      },
      {
        id: '5',
        issue: item.issue,
        discipline: item.reportedDiscipline,
        itemNo: `${item.issue}-05`,
        agreedMatter: '申报3项国家自然科学基金重点项目',
        leadDept: '科技处',
        supportingDepts: ['财务处'],
        completionTier: '中期',
        agreedCompletionTime: '2026-10-30',
        deliverable: '项目申报书副本',
        feedbackFrequency: '季度',
        status: '推进中',
        lastFeedbackDate: '2026-05-15'
      },
      {
        id: '6',
        issue: item.issue,
        discipline: item.reportedDiscipline,
        itemNo: `${item.issue}-06`,
        agreedMatter: '学科专项绩效考核办法修订',
        leadDept: '人事处',
        supportingDepts: ['财务处', '医务处'],
        completionTier: '短期',
        agreedCompletionTime: '2026-07-20',
        deliverable: '正式印发文件',
        feedbackFrequency: '月度',
        status: '推进中',
        lastFeedbackDate: '2026-05-22'
      },
      {
        id: '7',
        issue: item.issue,
        discipline: item.reportedDiscipline,
        itemNo: `${item.issue}-07`,
        agreedMatter: '学科门诊诊间支付功能上线',
        leadDept: '信息中心',
        supportingDepts: ['财务处', '医务处'],
        completionTier: '短期',
        agreedCompletionTime: '2026-06-30',
        deliverable: '上线确认书',
        feedbackFrequency: '月度',
        status: '推进中',
        lastFeedbackDate: '2026-05-28'
      },
      {
        id: '8',
        issue: item.issue,
        discipline: item.reportedDiscipline,
        itemNo: `${item.issue}-08`,
        agreedMatter: '学科带头人任期考核及评估',
        leadDept: '人事处',
        supportingDepts: ['科技处'],
        completionTier: '中长期',
        agreedCompletionTime: '2026-11-15',
        deliverable: '考核报告汇总',
        feedbackFrequency: '季度',
        status: '推进中',
        lastFeedbackDate: '2026-05-10'
      },
      {
        id: '9',
        issue: item.issue,
        discipline: item.reportedDiscipline,
        itemNo: `${item.issue}-09`,
        agreedMatter: '临床医学实验中心共享平台使用率提升工程',
        leadDept: '科技处',
        supportingDepts: ['信息中心'],
        completionTier: '中期',
        agreedCompletionTime: '2026-10-30',
        deliverable: '季度使用率分析报表',
        feedbackFrequency: '季度',
        status: '未启动',
        lastFeedbackDate: '2026-05-15'
      },
      {
        id: '10',
        issue: item.issue,
        discipline: item.reportedDiscipline,
        itemNo: `${item.issue}-10`,
        agreedMatter: '学科发展专项经费年度使用审计',
        leadDept: '财务处',
        supportingDepts: ['审计处'],
        completionTier: '短期',
        agreedCompletionTime: '2026-07-15',
        deliverable: '专项审计报告',
        feedbackFrequency: '月度',
        status: '已办结',
        lastFeedbackDate: '2026-05-28'
      }
    ];
    return [...baseItems, ...otherItems];
  });

  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [showEditTrackModal, setShowEditTrackModal] = useState(false);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [deptSearch, setDeptSearch] = useState('');
  const [trackFormData, setTrackFormData] = useState({
    agreedMatter: '',
    leadDept: DEPARTMENTS[0],
    supportingDepts: [] as string[],
    agreedCompletionTime: new Date().toISOString().split('T')[0],
    feedbackFrequency: FREQUENCIES[0],
    status: STATUSES[0]
  });

  // Report Drawer State
  const [showReportDrawer, setShowReportDrawer] = useState(false);
  const [activeReportItem, setActiveReportItem] = useState<TrackingItem | null>(null);
  const [reportForm, setReportForm] = useState({
    progressContent: '',
    status: STATUSES[0],
    achievementName: '',
    isFileUploaded: false
  });

  // Audit Drawer State
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<TrackingItem['status']>('已办结');
  const [activeAuditItem, setActiveAuditItem] = useState<TrackingItem | null>(null);
  const [auditForm, setAuditForm] = useState({
    opinion: ''
  });

  // Review Drawer State
  const [showReviewDrawer, setShowReviewDrawer] = useState(false);
  const [activeReviewItem, setActiveReviewItem] = useState<TrackingItem | null>(null);
  const [reviewForm, setReviewForm] = useState({
    opinion: '',
    result: '通过' as '通过' | '退回'
  });

  const handleOpenReport = (task: TrackingItem) => {
    setActiveReportItem(task);
    setReportForm({
      progressContent: '',
      status: task.status,
      achievementName: '',
      isFileUploaded: false
    });
    setShowReportDrawer(true);
  };

  const handleOpenAudit = (task: TrackingItem) => {
    setActiveAuditItem(task);
    setAuditForm({ opinion: '' });
    setShowAuditDrawer(true);
  };

  const handleOpenReview = (task: TrackingItem) => {
    setActiveReviewItem(task);
    setReviewForm({ opinion: '', result: '通过' });
    setShowReviewDrawer(true);
  };

  const handleAuditAction = (action: 'pass' | 'reject') => {
    if (!activeAuditItem) return;
    
    setTrackingData(prev => prev.map(t => 
      t.id === activeAuditItem.id 
        ? { 
            ...t, 
            status: action === 'pass' ? '已办结' : '推进中',
            lastFeedbackDate: new Date().toISOString().split('T')[0] 
          }
        : t
    ));
    setShowAuditDrawer(false);
  };

  const handleSaveReport = () => {
    if (!activeReportItem) return;
    
    const newPhase: ProgressPhase = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: reportForm.progressContent,
      reporter: '当前用户', 
      status: activeReportItem.status, // Keep current status on simple save
      attachments: reportForm.isFileUploaded ? [reportForm.achievementName] : []
    };

    setTrackingData(prev => prev.map(t => 
      t.id === activeReportItem.id 
        ? { 
            ...t, 
            lastFeedbackDate: newPhase.date,
            progressHistory: [...(t.progressHistory || []), newPhase]
          }
        : t
    ));
    setShowReportDrawer(false);
  };

  const handleSubmitAuditAction = () => {
    if (!activeReportItem) return;

    const newPhase: ProgressPhase = {
      id: Date.now().toString() + '_audit',
      date: new Date().toISOString().split('T')[0],
      content: `[提交审核] ${reportForm.progressContent || '提交事项审核'}`,
      reporter: '当前用户',
      status: submitStatus,
      attachments: reportForm.isFileUploaded ? [reportForm.achievementName] : []
    };

    setTrackingData(prev => prev.map(t => 
      t.id === activeReportItem.id 
        ? { 
            ...t, 
            status: submitStatus,
            lastFeedbackDate: newPhase.date,
            progressHistory: [...(t.progressHistory || []), newPhase]
          }
        : t
    ));
    setShowSubmitModal(false);
    setShowReportDrawer(false);
  };

  const handleToggleSupportingDept = (dept: string) => {
    setTrackFormData(prev => ({
      ...prev,
      supportingDepts: prev.supportingDepts.includes(dept)
        ? prev.supportingDepts.filter(d => d !== dept)
        : [...prev.supportingDepts, dept]
    }));
  };

  const handleSaveTrack = () => {
    const nextNum = trackingData.length + 1;
    const newItem: TrackingItem = {
      id: Date.now().toString(),
      issue: item.issue,
      discipline: item.reportedDiscipline,
      itemNo: `${item.issue}-${nextNum.toString().padStart(2, '0')}`,
      ...trackFormData,
      lastFeedbackDate: new Date().toISOString().split('T')[0]
    };
    setTrackingData([newItem, ...trackingData]);
    setShowAddTrackModal(false);
    setTrackFormData({
      agreedMatter: '',
      leadDept: DEPARTMENTS[0],
      supportingDepts: [],
      agreedCompletionTime: new Date().toISOString().split('T')[0],
      feedbackFrequency: FREQUENCIES[0],
      status: STATUSES[0]
    });
  };

  const handleOpenEdit = (task: TrackingItem) => {
    setEditingTrackId(task.id);
    setTrackFormData({
      agreedMatter: task.agreedMatter,
      leadDept: task.leadDept,
      supportingDepts: [...task.supportingDepts],
      agreedCompletionTime: task.agreedCompletionTime,
      feedbackFrequency: task.feedbackFrequency,
      status: task.status
    });
    setShowEditTrackModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingTrackId) return;
    setTrackingData(prev => prev.map(t => 
      t.id === editingTrackId 
        ? { ...t, ...trackFormData }
        : t
    ));
    setShowEditTrackModal(false);
    setEditingTrackId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '推进中': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case '已办结': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case '未启动': return 'text-slate-400 bg-slate-50 border-slate-100';
      default: return 'text-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="flex flex-col gap-6 pb-20">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-bold group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            返回列表
          </button>
          <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  编辑基本信息
              </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-4 px-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-xl font-black text-gray-900 leading-tight">{item.reportedDiscipline}</h1>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 italic font-black text-[9px]">
                    {item.overallStatus}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 px-4 py-1.5 bg-gray-50/50 rounded-xl border border-gray-50">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">期数</span>
                <span className="text-base font-black text-gray-900 font-mono text-center">第 {item.issue} 期</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">会议日期</span>
                <span className="text-xs font-bold text-gray-700">{item.meetingDate}</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col text-center">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">报告人</span>
                <span className="text-xs font-bold text-gray-700">{item.reporter}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-50">
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ClipboardList size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">问题清单总数</p>
                  <p className="text-xs font-black text-gray-900">{item.agreedMattersCount} <span className="text-[10px] text-gray-400 font-medium ml-0.5">条</span></p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">当前办结进度</p>
                  <p className="text-xs font-black text-gray-900">{item.progress} <span className="text-[10px] text-gray-400 font-medium ml-0.5">已完成</span></p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">最近更新时间</p>
                  <p className="text-xs font-black text-gray-900">{item.lastUpdated}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/10">
                <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">学科剖析情况摘要</h3>
              </div>
              <div className="p-6 flex-1">
                <p className="text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                  目前学科建设稳步推进。梯队结构持续优化，正高职称占比提升至45%。本年度计划引入腔镜新技术3项，目前已进入准入论证阶段。与上海瑞金医院对标，在科研成果转化和单病种临床路径标准化方面仍有15%左右的效能差距。强化亚专科建设，聚焦智慧医疗结合的微创外科方向，打造区域性微创诊疗中心。
                </p>
              </div>
            </div>
 
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/10">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">痛点</h3>
              </div>
              <div className="p-6 flex-1">
                <p className="text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                  核心医疗大数据平台对接缓慢（信息中心归口），导致临床科研随访数据获取成本极高，严重阻碍了课题动态进度及数据清洗质量。
                  
                  院领导现场办公意见摘要：
                  "学科要把新技术应用落到实处，由医务处牵头解决多学科联合门诊的绩效分配难点。信息化痛点请林院长督办，两周内拿出数据中台API开放方案。"
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/10">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">附件列表</h3>
                </div>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1 px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all text-xs font-bold"
                >
                  <Upload size={14} />
                  上传
                </button>
              </div>
              <div className="p-6 flex-1 custom-scrollbar overflow-y-auto max-h-[160px]">
                {ledgerAttachments.length > 0 ? (
                  <div className="space-y-2">
                    {ledgerAttachments.slice(0, 3).map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100 group transition-all hover:bg-white hover:shadow-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1.5 bg-white text-emerald-600 rounded-lg shadow-sm border border-gray-50">
                            <FileText size={12} />
                          </div>
                          <span className="text-[11px] font-bold text-gray-700 truncate">{file}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="预览">
                            <Eye size={14} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="下载">
                            <Download size={14} />
                          </button>
                          <button 
                            onClick={() => removeAttachment(file)}
                            className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                            title="删除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {ledgerAttachments.length > 3 && (
                      <button 
                        onClick={() => setShowAttachmentsModal(true)}
                        className="w-full py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                      >
                        查看更多 ({ledgerAttachments.length})
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-4 border-2 border-dashed border-gray-100 rounded-2xl">
                    <Upload size={24} className="text-gray-200 mb-2" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">暂无附件</p>
                  </div>
                )}
              </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">问题清单</h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                  <Upload size={16} />
                  导入
              </button>
              <button 
                onClick={() => setShowAddTrackModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                  <Plus size={16} />
                  新建
              </button>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">期数-编号</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">议定内容</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">主责部门</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">协办部门</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">截止日期</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">状态</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">反馈频率与最新反馈日期</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {trackingData.map((task) => (
                  <tr key={task.id} className="hover:bg-indigo-50/10 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="w-14 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-black text-gray-600 font-mono group-hover:bg-white transition-colors">
                        {task.itemNo}
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-sm">
                      <div className="text-sm font-bold text-gray-800 leading-relaxed">
                        {task.agreedMatter}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-black px-2 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                        {task.leadDept}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {task.supportingDepts.map(dept => (
                          <span key={dept} className="text-[10px] font-bold text-gray-400 px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">
                            {dept}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-gray-900 font-mono">{task.agreedCompletionTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock size={10} />
                          剩余 12 天
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black border uppercase tracking-tight ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                            {task.feedbackFrequency}
                          </span>
                          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-indigo-100 bg-indigo-50">
                            <span className="text-[10px] font-bold text-indigo-600">
                              {task.lastFeedbackDate}
                            </span>
                            {task.progressHistory && task.progressHistory.some(p => p.attachments && p.attachments.length > 0) && (
                              <div className="text-indigo-400">
                                <FileText size={10} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleOpenEdit(task)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          编辑
                        </button>
                        <button 
                          onClick={() => handleOpenReport(task)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          填报
                        </button>
                        <button 
                          onClick={() => handleOpenAudit(task)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          审核
                        </button>
                        <button 
                          onClick={() => handleOpenReview(task)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          评阅
                        </button>
                        <button className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
              Last Synchronized: 2026-05-30 09:42
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                进行中: {trackingData.filter(t => t.status === '推进中').length}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                已办结: {trackingData.filter(t => t.status === '已办结').length}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                未启动: {trackingData.filter(t => t.status === '未启动').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Track Item Modal */}
      {showAddTrackModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">新增议定事项跟踪</h3>
                </div>
                <button 
                  onClick={() => setShowAddTrackModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">期数-科室</label>
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-bold text-gray-400 italic">
                      第{item.issue}期 - {item.reportedDiscipline}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">事项编号</label>
                    <div className="px-4 py-2.5 bg-indigo-50 rounded-xl text-sm font-black text-indigo-600 font-mono">
                      {item.issue}-{(trackingData.length + 1).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">议定事项内容</label>
                  <textarea 
                    placeholder="请输入议定事项的具体内容..."
                    value={trackFormData.agreedMatter}
                    onChange={(e) => setTrackFormData({...trackFormData, agreedMatter: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 h-24 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">主责部门</label>
                    <select 
                      value={trackFormData.leadDept}
                      onChange={(e) => setTrackFormData({...trackFormData, leadDept: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">协办部门</label>
                    <div 
                      onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                      className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-100/50 transition-all group min-h-[42px]"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {trackFormData.supportingDepts.length > 0 ? (
                          trackFormData.supportingDepts.map(dept => (
                            <span key={dept} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold flex items-center gap-1 group-hover:bg-indigo-200 transition-colors">
                              {dept}
                              <X 
                                size={10} 
                                className="cursor-pointer hover:text-indigo-900" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSupportingDept(dept);
                                }}
                              />
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm font-medium">请选择协办部门...</span>
                        )}
                      </div>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${showDeptDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showDeptDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-3 pt-3 pb-2 border-b border-gray-50">
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                            <input 
                              type="text"
                              placeholder="搜索部门..."
                              value={deptSearch}
                              onChange={(e) => setDeptSearch(e.target.value)}
                              className="w-full bg-gray-50 border-none rounded-lg pl-9 pr-4 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500/20"
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar p-2">
                          {DEPARTMENTS.filter(d => d.includes(deptSearch)).map(dept => (
                            <div 
                              key={dept}
                              onClick={() => handleToggleSupportingDept(dept)}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${trackFormData.supportingDepts.includes(dept) ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                              <span className="text-sm font-bold">{dept}</span>
                              {trackFormData.supportingDepts.includes(dept) && <Check size={14} />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">约定完成时间</label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={trackFormData.agreedCompletionTime}
                      onChange={(e) => setTrackFormData({...trackFormData, agreedCompletionTime: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none pl-10"
                    />
                    <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">反馈频率</label>
                  <div className="flex gap-3">
                    {FREQUENCIES.map(freq => (
                      <button 
                        key={freq}
                        onClick={() => setTrackFormData({...trackFormData, feedbackFrequency: freq})}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${trackFormData.feedbackFrequency === freq ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-gray-500 border-gray-100'}`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 py-5 border-t border-gray-50 bg-gray-50/50 flex items-center justify-end gap-3 sticky bottom-0">
                  <button 
                    onClick={() => setShowAddTrackModal(false)}
                    className="px-6 py-2.5 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-xl transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSaveTrack}
                    disabled={!trackFormData.agreedMatter}
                    className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
                  >
                    提交
                  </button>
              </div>
            </div>
          </div>
      )}

      {/* Edit Track Item Modal */}
      {showEditTrackModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">编辑</h3>
                </div>
                <button 
                  onClick={() => setShowEditTrackModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">期数-科室</label>
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-bold text-gray-400 italic">
                      第{item.issue}期 - {item.reportedDiscipline}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">事项编号</label>
                    <div className="px-4 py-2.5 bg-indigo-50 rounded-xl text-sm font-black text-indigo-600 font-mono">
                      {trackingData.find(t => t.id === editingTrackId)?.itemNo || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">议定事项内容</label>
                  <textarea 
                    placeholder="请输入议定事项的具体内容..."
                    value={trackFormData.agreedMatter}
                    onChange={(e) => setTrackFormData({...trackFormData, agreedMatter: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 h-24 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">主责部门</label>
                    <select 
                      value={trackFormData.leadDept}
                      onChange={(e) => setTrackFormData({...trackFormData, leadDept: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">协办部门</label>
                    <div 
                      onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                      className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-100/50 transition-all group min-h-[42px]"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {trackFormData.supportingDepts.length > 0 ? (
                          trackFormData.supportingDepts.map(dept => (
                            <span key={dept} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold flex items-center gap-1 group-hover:bg-indigo-200 transition-colors">
                              {dept}
                              <X 
                                size={10} 
                                className="cursor-pointer hover:text-indigo-900" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSupportingDept(dept);
                                }}
                              />
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm font-medium">请选择协办部门...</span>
                        )}
                      </div>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${showDeptDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showDeptDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-3 pt-3 pb-2 border-b border-gray-50">
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                            <input 
                              type="text"
                              placeholder="搜索部门..."
                              value={deptSearch}
                              onChange={(e) => setDeptSearch(e.target.value)}
                              className="w-full bg-gray-50 border-none rounded-lg pl-9 pr-4 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500/20"
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar p-2">
                          {DEPARTMENTS.filter(d => d.includes(deptSearch)).map(dept => (
                            <div 
                              key={dept}
                              onClick={() => handleToggleSupportingDept(dept)}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${trackFormData.supportingDepts.includes(dept) ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                              <span className="text-sm font-bold">{dept}</span>
                              {trackFormData.supportingDepts.includes(dept) && <Check size={14} />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">约定完成时间</label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={trackFormData.agreedCompletionTime}
                      onChange={(e) => setTrackFormData({...trackFormData, agreedCompletionTime: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none pl-10"
                    />
                    <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">反馈频率</label>
                  <div className="flex gap-3">
                    {FREQUENCIES.map(freq => (
                      <button 
                        key={freq}
                        onClick={() => setTrackFormData({...trackFormData, feedbackFrequency: freq})}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${trackFormData.feedbackFrequency === freq ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-gray-500 border-gray-100'}`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 py-5 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between sticky bottom-0">
                  <button 
                    onClick={() => {
                        // Revoke logic: reset to original values
                        const original = trackingData.find(t => t.id === editingTrackId);
                        if (original) {
                            setTrackFormData({
                                agreedMatter: original.agreedMatter,
                                leadDept: original.leadDept,
                                supportingDepts: [...original.supportingDepts],
                                agreedCompletionTime: original.agreedCompletionTime,
                                feedbackFrequency: original.feedbackFrequency,
                                status: original.status
                            });
                        }
                    }}
                    className="px-4 py-2 text-rose-500 text-sm font-bold hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                  >
                    撤销记录
                  </button>
                  <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowEditTrackModal(false)}
                        className="px-6 py-2.5 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-xl transition-all"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleSaveEdit}
                        disabled={!trackFormData.agreedMatter}
                        className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
                    >
                        保存
                    </button>
                  </div>
              </div>
            </div>
          </div>
      )}
      <AnimatePresence>
        {showReportDrawer && activeReportItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportDrawer(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[70]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-[80] flex flex-col"
            >
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">推进情况填报</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Report Execution Progress</p>
                </div>
                <button 
                  onClick={() => setShowReportDrawer(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                {/* Matter Summary Card */}
                <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm shadow-indigo-50/50">
                  <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 w-fit px-2 py-0.5 rounded border border-indigo-100">
                    事项摘要 Item Summary
                  </div>
                  <h4 className="text-sm font-black text-gray-900 leading-relaxed mb-4">
                    {activeReportItem.agreedMatter}
                  </h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">主责部门</span>
                      <p className="text-xs font-bold text-gray-700">{activeReportItem.leadDept}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">节点目标</span>
                      <p className="text-xs font-bold text-gray-700">{activeReportItem.agreedCompletionTime} ({activeReportItem.completionTier})</p>
                    </div>
                  </div>
                </div>

                {/* Progress History (Phased Reporting) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} />
                      历史进展 (阶段性跟踪)
                    </label>
                    <span className="text-[10px] font-bold text-indigo-400">已填报 {activeReportItem.progressHistory?.length || 0} 个阶段</span>
                  </div>
                  
                  <div className="space-y-6 pl-2 border-l-2 border-dashed border-gray-100 ml-1.5 py-1">
                    {activeReportItem.progressHistory && activeReportItem.progressHistory.length > 0 ? (
                      activeReportItem.progressHistory.map((phase) => (
                        <div key={phase.id} className="relative pl-6">
                            <div className={`absolute left-[-21px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ${phase.status === '已办结' ? 'bg-emerald-500 ring-emerald-100' : 'bg-indigo-500 ring-indigo-100'}`}></div>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-900 font-mono">{phase.date}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-widest ${getStatusColor(phase.status)}`}>
                                  {phase.status}
                                </span>
                                <span className="text-[10px] font-bold text-gray-300 ml-auto">{phase.reporter}</span>
                              </div>
                              <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-50">
                                <p className="text-xs text-gray-600 leading-relaxed">{phase.content}</p>
                                {phase.attachments && phase.attachments.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {phase.attachments.map((file, fIdx) => (
                                      <div key={fIdx} className="flex items-center justify-between gap-3 px-2 py-1 bg-white rounded-lg border border-indigo-100/50 shadow-sm group/file">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <FileText size={10} className="text-indigo-400 flex-shrink-0" />
                                          <span className="text-[9px] font-black text-gray-500 truncate max-w-[100px]">{file}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover/file:opacity-100 transition-opacity">
                                          <button className="p-1 hover:bg-indigo-50 rounded text-indigo-400" title="预览">
                                            <Eye size={10} />
                                          </button>
                                          <button className="p-1 hover:bg-emerald-50 rounded text-emerald-500" title="下载">
                                            <Download size={10} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 italic pl-4">暂无历史填报数据</div>
                    )}
                  </div>
                </div>

                {/* New Phase Reporting Form */}
                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={12} />
                      新增本阶段进展描述
                    </label>
                    <textarea 
                      placeholder="请详细录入该阶段的具体进展、已完成产出及待解决的问题..."
                      value={reportForm.progressContent}
                      onChange={(e) => setReportForm({...reportForm, progressContent: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-4 text-sm font-medium text-gray-700 h-32 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 outline-none transition-all placeholder:text-gray-300 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Upload size={12} />
                      阶段性佐证资料 (可选)
                    </label>
                    <div 
                      onClick={() => setReportForm(prev => ({ ...prev, isFileUploaded: true, achievementName: '学科进展汇报_' + new Date().toISOString().split('T')[0] + '.pdf' }))}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group ${reportForm.isFileUploaded ? 'bg-indigo-50/50 border-indigo-200' : 'border-gray-50 hover:bg-gray-50 hover:border-indigo-100'}`}
                    >
                      {reportForm.isFileUploaded ? (
                        <>
                          <div className="p-2 bg-white text-indigo-600 rounded-xl shadow-sm">
                            <Check size={20} />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-black text-indigo-600">{reportForm.achievementName}</p>
                            <p className="text-[9px] font-bold text-indigo-400 mt-1">文件已就绪</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-white group-hover:text-indigo-600 transition-all">
                            <Upload size={20} />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-bold text-gray-600">点击上传成果文件</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-0.5">支持 PDF, JPG (最大 20MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/30 flex items-center gap-4">
                <button 
                  onClick={() => setShowReportDrawer(false)}
                  className="flex-1 py-3 px-6 text-gray-400 text-sm font-bold hover:bg-gray-100 rounded-xl transition-all font-sans"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveReport}
                  className="flex-1 py-3 px-6 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all font-sans"
                >
                  保存
                </button>
                <button 
                  onClick={() => setShowSubmitModal(true)}
                  className="flex-[2] py-3 px-6 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                >
                  提交审核
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Submit for Audit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ClipboardList size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">确认提交审核</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Submit Resolution Status</p>
                 </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8">
                <p className="text-sm text-amber-800 font-bold leading-relaxed">
                  请选择提交的状态，确认提交后不允许再进行填报。
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  { value: '已办结' as const, label: '已办结', desc: '事项已按要求完整履行并达成目标' },
                  { value: '推进中' as const, label: '推进中', desc: '事项正在按计划执行中，尚未最终办结' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSubmitStatus(option.value)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all group ${
                      submitStatus === option.value 
                        ? 'border-indigo-600 bg-indigo-50/50' 
                        : 'border-gray-50 hover:border-gray-200 bg-gray-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        submitStatus === option.value ? 'border-indigo-600 bg-indigo-600' : 'border-gray-200'
                      }`}>
                        {submitStatus === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className={`text-sm font-black transition-colors ${
                          submitStatus === option.value ? 'text-indigo-900' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">{option.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl text-sm font-black hover:bg-gray-100 transition-all font-sans"
                >
                  回退修改
                </button>
                <button
                  onClick={handleSubmitAuditAction}
                  className="flex-[1.5] py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  确认提交
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Audit Action Drawer */}
      <AnimatePresence>
        {showAuditDrawer && activeAuditItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuditDrawer(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[70]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-[80] flex flex-col"
            >
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">议定事项审核</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Audit & Review Decision Items</p>
                </div>
                <button 
                  onClick={() => setShowAuditDrawer(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                {/* Matter Summary Card */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50/50 w-fit px-2 py-0.5 rounded">
                    事项摘要 Item Summary
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 leading-relaxed mb-4">
                    {activeAuditItem.agreedMatter}
                  </h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-12 px-1">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">主责部门</span>
                      <p className="text-xs font-bold text-gray-700">{activeAuditItem.leadDept}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">截止日期</span>
                      <p className="text-xs font-bold text-gray-700">{activeAuditItem.agreedCompletionTime}</p>
                    </div>
                  </div>
                </div>

                {/* Lead Dept Progress History */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} />
                      主责部门历史填报 (阶段性进展)
                    </label>
                    <span className="text-[10px] font-bold text-indigo-400">共 {activeAuditItem.progressHistory?.length || 0} 条反馈</span>
                  </div>
                  
                  <div className="space-y-6 pl-2 border-l-2 border-dashed border-gray-100 ml-1.5 py-1">
                    {activeAuditItem.progressHistory && activeAuditItem.progressHistory.length > 0 ? (
                      [...activeAuditItem.progressHistory].reverse().map((phase) => (
                        <div key={phase.id} className="relative pl-6">
                            <div className={`absolute left-[-21px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ${phase.status === '已办结' ? 'bg-emerald-500 ring-emerald-100' : 'bg-indigo-500 ring-indigo-100'}`}></div>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-900 font-mono">{phase.date}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-widest ${getStatusColor(phase.status)}`}>
                                  {phase.status}
                                </span>
                                <span className="text-[10px] font-bold text-gray-300 ml-auto">{phase.reporter}</span>
                              </div>
                              <div className="p-4 bg-indigo-50/20 border border-indigo-100/30 rounded-2xl">
                                <p className="text-xs text-gray-700 leading-relaxed font-medium">{phase.content}</p>
                                {phase.attachments && phase.attachments.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {phase.attachments.map((file, fIdx) => (
                                      <div key={fIdx} className="flex items-center justify-between gap-4 p-2 bg-white rounded-xl border border-indigo-50 group/file w-full max-w-sm">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg flex-shrink-0">
                                            <FileText size={12} />
                                          </div>
                                          <div className="min-w-0">
                                            <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-0.5">附件</p>
                                            <p className="text-[10px] font-bold text-gray-700 truncate max-w-[140px]">{file}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <button className="p-2 hover:bg-indigo-50 text-indigo-500 rounded-lg transition-colors" title="预览">
                                             <Eye size={12} />
                                          </button>
                                          <button className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-lg transition-colors" title="下载">
                                             <Download size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 italic pl-4">该事项尚无填报反馈记录</div>
                    )}
                  </div>
                </div>
 
                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <CheckCircle2 size={12} className="text-gray-400" />
                     审核工作区
                  </label>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400">审核意见 Audit Opinion</span>
                    <textarea 
                      placeholder="请输入审核意见或说明..."
                      value={auditForm.opinion}
                      onChange={(e) => setAuditForm({...auditForm, opinion: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-medium text-gray-700 h-32 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all placeholder:text-gray-300 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-50 bg-white flex items-center gap-3">
                <button 
                  onClick={() => setShowAuditDrawer(false)}
                  className="px-6 py-3 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-xl transition-all"
                >
                  取消
                </button>
                <div className="flex-1 flex gap-3">
                  <button 
                    onClick={() => alert('督办通知已成功发送至主责部门负责人')}
                    className="flex-1 py-3 px-6 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-sm font-black hover:bg-blue-100 transition-all active:scale-[0.98]"
                  >
                    发送督办通知
                  </button>
                  <button 
                    onClick={() => handleAuditAction('reject')}
                    className="flex-1 py-3 px-6 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl text-sm font-black hover:bg-amber-100 transition-all active:scale-[0.98]"
                  >
                    退回重填
                  </button>
                  <button 
                    onClick={() => handleAuditAction('pass')}
                    className="flex-[1.2] py-3 px-6 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                  >
                    审核通过
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {showReviewDrawer && activeReviewItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewDrawer(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[70]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-[80] flex flex-col"
            >
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">评阅议定事项</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Final Review and Feedback</p>
                </div>
                <button 
                  onClick={() => setShowReviewDrawer(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                {/* Matter Summary Card */}
                <div className="bg-emerald-50/30 rounded-2xl p-5 border border-emerald-100/30">
                  <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded">
                    评阅对象 Review Target
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 leading-relaxed mb-4">
                    {activeReviewItem.agreedMatter}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-xl border border-emerald-100/50 text-wrap min-w-0">
                      <span className="text-[9px] font-black text-gray-300 uppercase block mb-1">主责部门</span>
                      <p className="text-xs font-black text-gray-700 truncate">{activeReviewItem.leadDept}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-100/50 text-wrap min-w-0">
                      <span className="text-[9px] font-black text-gray-300 uppercase block mb-1">协办部门</span>
                      <p className="text-xs font-black text-gray-700 truncate">{activeReviewItem.supportingDepts.join('、')}</p>
                    </div>
                  </div>
                </div>

                {/* Lead Dept Progress History */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} />
                      主责部门历史填报 (阶段性进展)
                    </label>
                    <span className="text-[10px] font-bold text-indigo-400">共 {activeReviewItem.progressHistory?.length || 0} 条反馈</span>
                  </div>
                  
                  <div className="space-y-6 pl-2 border-l-2 border-dashed border-gray-100 ml-1.5 py-1">
                    {activeReviewItem.progressHistory && activeReviewItem.progressHistory.length > 0 ? (
                      [...activeReviewItem.progressHistory].reverse().map((phase) => (
                        <div key={phase.id} className="relative pl-6">
                            <div className={`absolute left-[-21px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ${phase.status === '已办结' ? 'bg-emerald-500 ring-emerald-100' : 'bg-indigo-500 ring-indigo-100'}`}></div>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-900 font-mono">{phase.date}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-widest ${getStatusColor(phase.status)}`}>
                                  {phase.status}
                                </span>
                                <span className="text-[10px] font-bold text-gray-300 ml-auto">{phase.reporter}</span>
                              </div>
                              <div className="p-4 bg-indigo-50/20 border border-indigo-100/30 rounded-2xl">
                                <p className="text-xs text-gray-700 leading-relaxed font-medium">{phase.content}</p>
                                {phase.attachments && phase.attachments.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {phase.attachments.map((file, fIdx) => (
                                      <div key={fIdx} className="flex items-center justify-between gap-4 p-2 bg-white rounded-xl border border-indigo-50 group/file w-full max-w-sm">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg flex-shrink-0">
                                            <FileText size={12} />
                                          </div>
                                          <div className="min-w-0">
                                            <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-0.5">附件</p>
                                            <p className="text-[10px] font-bold text-gray-700 truncate max-w-[140px]">{file}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <button className="p-2 hover:bg-indigo-50 text-indigo-500 rounded-lg transition-colors" title="预览">
                                             <Eye size={12} />
                                          </button>
                                          <button className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-lg transition-colors" title="下载">
                                             <Download size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 italic pl-4">该事项尚无填报反馈记录</div>
                    )}
                  </div>
                </div>

                {/* Review Workspace */}
                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-emerald-500" />
                       进度评阅 (Progress Review)
                    </label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setReviewForm({...reviewForm, result: '通过'})}
                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${reviewForm.result === '通过' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100' : 'border-gray-50 bg-gray-50 text-gray-400 overflow-hidden'}`}
                      >
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${reviewForm.result === '通过' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white'}`}>
                           {reviewForm.result === '通过' && <Check size={10} strokeWidth={4} />}
                         </div>
                         <span className="text-sm font-black">评阅通过</span>
                      </button>
                      
                      <button 
                        onClick={() => setReviewForm({...reviewForm, result: '退回'})}
                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${reviewForm.result === '退回' ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-lg shadow-rose-100' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                      >
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${reviewForm.result === '退回' ? 'border-rose-600 bg-rose-600 text-white' : 'border-gray-300 bg-white'}`}>
                           {reviewForm.result === '退回' && <X size={10} strokeWidth={4} />}
                         </div>
                         <span className="text-sm font-black">评阅退回</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400">评阅建议 Review Comments</span>
                    <textarea 
                      placeholder="请填写详细的评阅意见或改进建议..."
                      value={reviewForm.opinion}
                      onChange={(e) => setReviewForm({...reviewForm, opinion: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-medium text-gray-700 h-32 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all placeholder:text-gray-300 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-50 bg-gray-50/20 flex gap-4">
                <button 
                  onClick={() => setShowReviewDrawer(false)}
                  className="flex-1 py-4 px-6 bg-white border border-gray-100 text-gray-500 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all active:scale-[0.98]"
                >
                  返回
                </button>
                <button 
                  onClick={() => setShowReviewDrawer(false)}
                  className={`flex-[2] py-4 px-6 text-white rounded-2xl text-sm font-black shadow-xl transition-all active:scale-[0.98] ${reviewForm.result === '通过' ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-100 hover:bg-rose-700'}`}
                >
                  确认提交评阅
                </button>
              </div>
            </motion.div>
          </>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">上传会议附件</h3>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8">
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer hover:bg-gray-50 hover:border-emerald-200 transition-all group relative">
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleUploadAttachment}
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-gray-400">正在上传中...</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-700">点击或将文件拖拽至此处</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">支持 PDF, PPTX, DOCX, JPG (Max 20MB)</p>
                      </div>
                    </>
                  )}
                </label>
              </div>
              <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex justify-end">
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-xl transition-all"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {showAttachmentsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <FileText size={18} />
                  </div>
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-widest">所有附件清单</h3>
                </div>
                <button 
                  onClick={() => setShowAttachmentsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-3">
                  {ledgerAttachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:shadow-md">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-white text-emerald-600 rounded-xl shadow-sm border border-gray-50">
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{file}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-0.5">2.4 MB • 2026-06-08</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all text-xs font-bold">
                          <Eye size={14} />
                          预览
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all text-xs font-bold">
                          <Download size={14} />
                          下载
                        </button>
                        <button 
                          onClick={() => removeAttachment(file)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                <p className="text-xs font-bold text-gray-400">共计 {ledgerAttachments.length} 个附件</p>
                <button 
                  onClick={() => setShowAttachmentsModal(false)}
                  className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl transition-all hover:bg-gray-800"
                >
                  关闭窗口
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
