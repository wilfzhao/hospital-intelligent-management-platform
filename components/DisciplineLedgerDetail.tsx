
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Plus, Upload, Clock, X, Calendar, Search, ChevronDown, Check,
  CheckCircle2, AlertTriangle, FileText,
  LayoutDashboard, ClipboardList, TrendingUp, MessageSquare
} from 'lucide-react';

interface TrackingItem {
  id: string;
  issue: number;
  discipline: string;
  itemNo: string;
  agreedMatter: string;
  leadDept: string;
  supportingDepts: string[];
  completionTier: '短期' | '中期' | '中长期' | '长期';
  agreedCompletionTime: string;
  deliverable: string;
  feedbackFrequency: '月度' | '季度';
  status: '未启动' | '刚启动' | '推进中' | '滞后' | '遇阻' | '已办结';
  lastFeedbackDate: string;
}

interface LedgerItem {
  id: string;
  issue: number;
  meetingDate: string;
  category: string;
  reportedDiscipline: string;
  reporter: string;
  agreedMattersCount: number;
  progress: string;
  overallStatus: string;
  lastUpdated: string;
}

interface DisciplineLedgerDetailProps {
  item: LedgerItem;
  onBack: () => void;
}

const DEPARTMENTS = ['医务处', '护理部', '人事处', '财务处', '信息中心', '后勤保障处', '科技处', '教育处'];
const TIERS: Array<TrackingItem['completionTier']> = ['短期', '中期', '中长期', '长期'];
const FREQUENCIES: Array<TrackingItem['feedbackFrequency']> = ['月度', '季度'];
const STATUSES: Array<TrackingItem['status']> = ['未启动', '刚启动', '推进中', '滞后', '遇阻', '已办结'];

export const DisciplineLedgerDetail: React.FC<DisciplineLedgerDetailProps> = ({ item, onBack }) => {
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
        lastFeedbackDate: '2026-05-28'
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
        status: '刚启动',
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
          status: '刚启动',
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
          status: '刚启动',
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
        status: '滞后',
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
        status: '遇阻',
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
        status: '刚启动',
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
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [deptSearch, setDeptSearch] = useState('');
  const [trackFormData, setTrackFormData] = useState({
    agreedMatter: '',
    leadDept: DEPARTMENTS[0],
    supportingDepts: [] as string[],
    completionTier: TIERS[0],
    agreedCompletionTime: new Date().toISOString().split('T')[0],
    deliverable: '',
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
  const [activeAuditItem, setActiveAuditItem] = useState<TrackingItem | null>(null);
  const [auditForm, setAuditForm] = useState({
    opinion: ''
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

  const handleAuditAction = (action: 'pass' | 'reject') => {
    if (!activeAuditItem) return;
    
    setTrackingData(prev => prev.map(t => 
      t.id === activeAuditItem.id 
        ? { 
            ...t, 
            status: action === 'pass' ? '已办结' : '滞后',
            lastFeedbackDate: new Date().toISOString().split('T')[0] 
          }
        : t
    ));
    setShowAuditDrawer(false);
  };

  const handleSaveReport = () => {
    if (!activeReportItem) return;
    
    setTrackingData(prev => prev.map(t => 
      t.id === activeReportItem.id 
        ? { ...t, status: reportForm.status, lastFeedbackDate: new Date().toISOString().split('T')[0] }
        : t
    ));
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
      completionTier: TIERS[0],
      agreedCompletionTime: new Date().toISOString().split('T')[0],
      deliverable: '',
      feedbackFrequency: FREQUENCIES[0],
      status: STATUSES[0]
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '推进中': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case '已办结': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case '滞后': return 'text-amber-600 bg-amber-50 border-amber-100';
      case '遇阻': return 'text-rose-600 bg-rose-50 border-rose-100';
      case '未启动': return 'text-slate-400 bg-slate-50 border-slate-100';
      case '刚启动': return 'text-blue-500 bg-blue-50 border-blue-100';
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
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
                  打印汇报表
              </button>
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
                  <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    {item.category}
                  </span>
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
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">议定事项总数</p>
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

        <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/10">
                <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">学科剖析情况摘要</h3>
              </div>
              <div className="p-6 space-y-6 flex-1">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-indigo-400" />
                    建设 / 梯队 / 新技术
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    目前学科建设稳步推进。梯队结构持续优化，正高职称占比提升至45%。本年度计划引入腔镜新技术3项，目前已进入准入论证阶段。
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp size={12} className="text-gray-300" />
                      对标差距
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      与上海瑞金医院对标，在科研成果转化和单病种临床路径标准化方面仍有15%左右的效能差距。
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp size={12} className="text-gray-300" />
                      发展方向
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-gray-100 pl-4 py-1">
                      强化亚专科建设，聚焦智慧医疗结合的微创外科方向，打造区域性微创诊疗中心。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/10">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">痛点和院领导意见</h3>
              </div>
              <div className="p-6 space-y-6 flex-1">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle size={12} className="text-amber-400" />
                    核心痛点 (归口)
                  </span>
                  <div className="p-4 bg-amber-50/30 rounded-xl border border-amber-50">
                    <p className="text-sm text-amber-900/80 leading-relaxed font-medium">
                      核心医疗大数据平台对接缓慢（信息中心归口），导致临床科研随访数据获取成本极高，严重阻碍了课题动态进度及数据清洗质量。
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                    <MessageSquare size={12} className="text-indigo-400" />
                    院领导现场办公意见摘要
                  </span>
                  <div className="p-4 bg-indigo-50/20 rounded-xl border border-indigo-50/30">
                    <p className="text-sm text-indigo-900/80 leading-relaxed italic font-medium">
                      "学科要把新技术应用落到实处，由医务处牵头解决多学科联合门诊的绩效分配难点。信息化痛点请林院长督办，两周内拿出数据中台API开放方案。"
                    </p>
                  </div>
                </div>
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
                <h3 className="text-lg font-black text-gray-900 tracking-tight">工作清单议定事项跟踪</h3>
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
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">节点/截止</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">状态</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">交付物说明</th>
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
                          <span className={`text-[10px] px-1 rounded font-black ${task.completionTier === '长期' ? 'text-purple-600 bg-purple-50' : 'text-indigo-600 bg-indigo-50'}`}>
                            {task.completionTier}
                          </span>
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
                    <td className="px-6 py-5">
                      <div className="text-xs font-bold text-gray-500 max-w-[120px] leading-relaxed">
                        {task.deliverable}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                            {task.feedbackFrequency}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                            {task.lastFeedbackDate}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">编辑</button>
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
                进行中: {trackingData.filter(t => ['推进中', '刚启动'].includes(t.status)).length}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                已办结: {trackingData.filter(t => t.status === '已办结').length}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                预警/受阻: {trackingData.filter(t => ['滞后', '遇阻'].includes(t.status)).length}
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
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">协办部门 (多选)</label>
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

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">完成节点档</label>
                    <div className="flex gap-2">
                      {TIERS.map(tier => (
                        <button 
                          key={tier}
                          onClick={() => setTrackFormData({...trackFormData, completionTier: tier})}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all border ${trackFormData.completionTier === tier ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white text-gray-500 border-gray-100'}`}
                        >
                          {tier}
                        </button>
                      ))}
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
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">阶段性交付物说明</label>
                  <textarea 
                    placeholder="拟提供的成果、文档或报告具体描述..."
                    value={trackFormData.deliverable}
                    onChange={(e) => setTrackFormData({...trackFormData, deliverable: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 h-24 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
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
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">状态</label>
                    <select 
                      value={trackFormData.status}
                      onChange={(e) => setTrackFormData({...trackFormData, status: e.target.value as TrackingItem['status']})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
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
                    提交事项
                  </button>
              </div>
            </div>
          </div>
      )}

      {/* Progress Reporting Drawer */}
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
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50/50 w-fit px-2 py-0.5 rounded">
                    事项摘要 Item Summary
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 leading-relaxed mb-4">
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
                    <div className="space-y-1 col-span-2 border-t border-gray-100 pt-3">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">阶段性交付物说明</span>
                      <p className="text-xs font-medium text-gray-600 leading-relaxed mt-1">
                        {activeReportItem.deliverable || '暂无详细说明'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={12} />
                      当前推进情况填报
                    </label>
                    <textarea 
                      placeholder="详细描述本周期内的工作进展、已完成的具体里程碑、遇到的困难及下一步计划..."
                      value={reportForm.progressContent}
                      onChange={(e) => setReportForm({...reportForm, progressContent: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-medium text-gray-700 h-40 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-300 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Upload size={12} />
                      阶段性成果上传 (佐证资料)
                      <span className="text-rose-500">*必填</span>
                    </label>
                    <div 
                      onClick={() => setReportForm(prev => ({ ...prev, isFileUploaded: true, achievementName: '学科进展汇报_佐证材料.pdf' }))}
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group ${reportForm.isFileUploaded ? 'bg-indigo-50/50 border-indigo-200' : 'border-gray-100 hover:bg-gray-50 hover:border-indigo-100'}`}
                    >
                      {reportForm.isFileUploaded ? (
                        <>
                          <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-sm">
                            <Check size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-black text-indigo-600">{reportForm.achievementName}</p>
                            <p className="text-[10px] font-bold text-indigo-400 mt-1">文件已成功就绪</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-white group-hover:text-indigo-600 transition-all">
                            <Upload size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-600">点击或将文件拖拽至此上传</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-1">支持 PDF, JPG, PNG, DOCX (最大 20MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <LayoutDashboard size={12} />
                      当前执行状态
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {STATUSES.map(status => (
                        <button 
                          key={status}
                          onClick={() => setReportForm({...reportForm, status: status})}
                          className={`py-2.5 rounded-xl text-[11px] font-black transition-all border ${reportForm.status === status ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/30 flex items-center gap-4">
                <button 
                  onClick={() => setShowReportDrawer(false)}
                  className="flex-1 py-3 px-6 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-xl transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveReport}
                  disabled={!reportForm.progressContent || !reportForm.isFileUploaded || !reportForm.status}
                  className="flex-[2] py-3 px-6 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
                >
                  确认提交反馈
                </button>
              </div>
            </motion.div>
          </>
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
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">节点目标</span>
                      <p className="text-xs font-bold text-gray-700">{activeAuditItem.agreedCompletionTime}</p>
                    </div>
                    <div className="space-y-1 col-span-2 border-t border-gray-100 pt-3">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">阶段性交付物说明</span>
                      <p className="text-xs font-medium text-gray-600 leading-relaxed mt-1">
                        {activeAuditItem.deliverable || '暂无详细说明'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lead Dept Content Section */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={12} className="text-indigo-400" />
                      主责部门填报内容
                    </label>
                    <div className="bg-indigo-50/20 border border-indigo-100/50 rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">填报进度描述:</span>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          事项已按计划推进。目前已完成前期调研工作，相关的技术方案初稿已经通过科室内论证。下一步将联同协办部门进行接口安全性审计，预计在约定时间内能交付。
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-indigo-100/30">
                        <div className="flex-1 flex items-center gap-3 p-2.5 bg-white rounded-xl border border-indigo-50">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <FileText size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5">交付物 (PDF)</p>
                            <p className="text-xs font-bold text-gray-700 truncate">进展汇报_2026.pdf</p>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 h-fit">
                           <span className="text-[10px] font-black">{activeAuditItem.status}</span>
                        </div>
                      </div>
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
      </AnimatePresence>
    </div>
  );
};
