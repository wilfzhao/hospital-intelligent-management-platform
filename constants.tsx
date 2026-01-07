import React from 'react';
import { 
  LayoutDashboard, FileText, Database, Settings, BarChart, Users, ClipboardList, Layout,
  Activity, Target, Zap, ClipboardCheck, ListTodo, TrendingUp, PieChart
} from 'lucide-react';
import { Indicator, Role, SidebarItem, Plan, ReportTemplate, ReportDocument } from './types';

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'plan_mgmt',
    label: '方案管理',
    icon: <ClipboardList size={20} />,
  },
  {
    id: 'rule_mgmt',
    label: '规则管理',
    icon: <Settings size={20} />,
    expanded: false,
    subItems: [
      { id: 'rule_1', label: '基础规则', icon: null },
      { id: 'rule_2', label: '高级规则', icon: null }
    ]
  },
  {
    id: 'base_data',
    label: '基础数据',
    icon: <Database size={20} />,
    expanded: false,
    subItems: [
      { id: 'data_1', label: '科室数据', icon: null },
      { id: 'data_2', label: '人员数据', icon: null }
    ]
  },
  {
    id: 'base_config',
    label: '基础配置',
    icon: <FileText size={20} />,
  },
  {
    id: 'indicator_auth',
    label: '指标权限',
    icon: <BarChart size={20} />,
  },
  {
    id: 'report_template',
    label: '报告模版',
    icon: <Layout size={20} />,
  },
];

export const HOSPITAL_REVIEW_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'review_overview',
    label: '医院评审全览',
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: 'resource_config',
    label: '资源配置与运行数据指标',
    icon: <Database size={20} />,
  },
  {
    id: 'medical_quality',
    label: '医疗服务能力与医院质量安全指标',
    icon: <Activity size={20} />,
  },
  {
    id: 'key_specialty',
    label: '重点专业质量控制指标',
    icon: <Target size={20} />,
  },
  {
    id: 'single_disease',
    label: '单病种（术种）质量控制指标',
    icon: <FileText size={20} />,
  },
  {
    id: 'key_tech',
    label: '重点医疗技术临床应用质量控制指标',
    icon: <Zap size={20} />,
  },
  {
    id: 'self_assessment',
    label: '自评与改进',
    icon: <ClipboardCheck size={20} />,
  },
  {
    id: 'issue_list',
    label: '问题清单',
    icon: <ListTodo size={20} />,
  },
  {
    id: 'continuous_improvement',
    label: '持续改进',
    icon: <TrendingUp size={20} />,
  },
  {
    id: 'report_center',
    label: '报告中心',
    icon: <PieChart size={20} />,
  },
];

export const ROLES: Role[] = [
  { id: 'r1', name: '医院管理平台2' },
  { id: 'r2', name: '医院管理平台' },
  { id: 'r3', name: '超级管理员(勿删)' },
  { id: 'r4', name: '消息推送角色', active: true },
];

export const INDICATORS: Indicator[] = [
  {
    id: 'g1',
    name: '资源配置与运行效率',
    scheme: '三级医院等级评审',
    readPermission: false,
    fillPermission: false,
    displayEntry: false,
    children: [
      { id: '1', name: '自定义统计方式指标 (基础指标二)', scheme: '三级医院等级评审', readPermission: false, fillPermission: false, displayEntry: false, tag: 'main' },
      { id: '2', name: '自定义统计方式指标 (手动转自动)', scheme: '三级医院等级评审', readPermission: false, fillPermission: false, displayEntry: false },
      { id: '3', name: '自定义统计方式指标 (手动转自动1)', scheme: '三级医院等级评审', readPermission: true, fillPermission: false, displayEntry: true },
      { id: '4', name: '自定义统计方式指标 (复合指标一)', scheme: '三级医院等级评审', readPermission: false, fillPermission: false, displayEntry: false },
    ]
  },
  {
    id: 'g2',
    name: '医疗服务能力与医院质量安全',
    scheme: '三级医院等级评审',
    readPermission: false,
    fillPermission: false,
    displayEntry: false,
    children: [
      { id: '5', name: '自定义统计方式指标 (基础指标一)', scheme: '三级医院等级评审', readPermission: false, fillPermission: false, displayEntry: false },
      { id: '6', name: '自定义统计方式指标 (基础指标二)', scheme: '', readPermission: false, fillPermission: false, displayEntry: false, tag: 'sub' },
      { id: '7', name: '自定义统计方式指标 (基础指标三)', scheme: '', readPermission: false, fillPermission: false, displayEntry: false, tag: 'sub' },
    ]
  },
  {
    id: 'g3',
    name: '重点专业质量控制',
    scheme: '三级医院等级评审',
    readPermission: false,
    fillPermission: false,
    displayEntry: false,
    children: [
      { id: '8', name: '填报配置测试十一', scheme: '三级医院等级评审', readPermission: false, fillPermission: false, displayEntry: false },
      {
        id: '9',
        name: '填报配置测试六',
        scheme: '三级医院等级评审',
        readPermission: true,
        fillPermission: false,
        displayEntry: true,
        children: [
          { id: '10', name: '填报配置测试十一', scheme: '三级医院等级评审', readPermission: true, fillPermission: false, displayEntry: true }, 
        ]
      },
    ]
  },
];

export const PLANS: Plan[] = [
  { id: 'p4', name: '三级医院等级评审', indicatorCount: 237, remark: '无', status: 'enabled', application: '三级医院等级评审' },
  { id: 'p5', name: '三级公立医院绩效考核（2022）', indicatorCount: 64, remark: '无', status: 'enabled', application: '公立医院绩效考核' },
  { id: 'p6', name: '公立医院高质量发展', indicatorCount: 2, remark: '无', status: 'enabled', application: '医疗质量管理' },
  { id: 'p8', name: '市级医院综合质量考核', indicatorCount: 1, remark: '无', status: 'enabled', application: '三级医院等级评审' },
  { id: 'p13', name: '三级医院等级评审（福建）', indicatorCount: 7, remark: '测试备注长度1234测试备注长度1234测试备注长度1234测试备注长度1234测试备注长度1234测试备注长度...', status: 'enabled', application: '三级医院等级评审' },
];

export const REPORT_TEMPLATES: ReportTemplate[] = [
  { id: 't1', name: '报告模版名称', type: '全院', creator: '赵伟峰' }
];

export const MOCK_REPORTS: ReportDocument[] = [
  { id: 'r1', title: '报告名称', date: '2025年12月8日', department: '医疗质量管理科', status: 'editing', type: 'annual' },
  { id: 'r2', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'published', type: 'annual' },
  { id: 'r3', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'editing', type: 'annual' },
  { id: 'r4', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'published', type: 'annual' },
  
  { id: 'r5', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'editing', type: 'quarterly' },
  { id: 'r6', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'published', type: 'quarterly' },
  { id: 'r7', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'editing', type: 'quarterly' },
  { id: 'r8', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'published', type: 'quarterly' },

  { id: 'r9', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'editing', type: 'monthly' },
  { id: 'r10', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'published', type: 'monthly' },
  { id: 'r11', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'editing', type: 'monthly' },
  { id: 'r12', title: '医院质量简报（2024年）', date: '2025年12月8日', department: '医疗质量管理科', status: 'published', type: 'monthly' },
];