
import { LedgerItem, TrackingItem } from '../types/discipline';

export const MOCK_LEDGER_DATA: LedgerItem[] = [
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

export const MOCK_SUMMARY_DATA = [
  { name: '已办结', value: 42, color: '#10b981' },
  { name: '推进中', value: 35, color: '#4f46e5' },
  { name: '刚启动', value: 15, color: '#3b82f6' },
  { name: '滞后', value: 8, color: '#f59e0b' },
  { name: '未启动', value: 5, color: '#94a3b8' },
  { name: '遇阻', value: 3, color: '#ef4444' },
];

export const DEPT_WORKLOAD_DATA = [
  { name: '医务处', tasks: 24, completed: 18, risk: 2 },
  { name: '人事处', tasks: 18, completed: 12, risk: 3 },
  { name: '科技处', tasks: 15, completed: 10, risk: 1 },
  { name: '信息中心', tasks: 28, completed: 15, risk: 5 },
  { name: '财务处', tasks: 12, completed: 12, risk: 0 },
  { name: '后勤保障处', tasks: 10, completed: 8, risk: 1 },
];

export const WARNING_ITEMS = [
  { id: '1', matter: '智慧医疗HIS系统数据中台API接口开放', dept: '信息中心', updatedAt: '2026-06-05', action: '填报' },
  { id: '2', matter: '学科专项绩效考核办法修订', dept: '人事处', updatedAt: '2026-06-07', action: '审核' },
  { id: '3', matter: '海外高层次人才引进配套经费拨付', dept: '财务处', updatedAt: '2026-06-06', action: '填报' },
];

export const getMockTrackingItems = (issue: number, discipline: string): TrackingItem[] => {
  const baseItems: TrackingItem[] = [
    {
      id: '1',
      issue: issue,
      discipline: discipline,
      itemNo: `${issue}-01`,
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
      issue: issue,
      discipline: discipline,
      itemNo: `${issue}-02`,
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

  if (discipline === '生物信息医学中心') {
    const bioItems: TrackingItem[] = [
      {
        id: 'bio-1',
        issue: issue,
        discipline: discipline,
        itemNo: `${issue}-03`,
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
        issue: issue,
        discipline: discipline,
        itemNo: `${issue}-04`,
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
        issue: issue,
        discipline: discipline,
        itemNo: `${issue}-05`,
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
        issue: issue,
        discipline: discipline,
        itemNo: `${issue}-06`,
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
        issue: issue,
        discipline: discipline,
        itemNo: `${issue}-07`,
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
        issue: issue,
        discipline: discipline,
        itemNo: `${issue}-08`,
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
        issue: issue,
        discipline: discipline,
        itemNo: `${issue}-09`,
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
        issue: issue,
        discipline: discipline,
        itemNo: `${issue}-10`,
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
        issue: issue,
        discipline: discipline,
        itemNo: `${issue}-11`,
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
        issue: issue,
        discipline: discipline,
        itemNo: `${issue}-12`,
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
      issue: issue,
      discipline: discipline,
      itemNo: `${issue}-03`,
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
      issue: issue,
      discipline: discipline,
      itemNo: `${issue}-04`,
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
      issue: issue,
      discipline: discipline,
      itemNo: `${issue}-05`,
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
      issue: issue,
      discipline: discipline,
      itemNo: `${issue}-06`,
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
      issue: issue,
      discipline: discipline,
      itemNo: `${issue}-07`,
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
      issue: issue,
      discipline: discipline,
      itemNo: `${issue}-08`,
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
      issue: issue,
      discipline: discipline,
      itemNo: `${issue}-09`,
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
      issue: issue,
      discipline: discipline,
      itemNo: `${issue}-10`,
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
};
