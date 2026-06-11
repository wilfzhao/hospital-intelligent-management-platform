
// Talent Development Mock Data extracted from OperationalDecisionCenter.tsx

export interface Indicator {
  id: string;
  label: string;
  score: number;
  rawValue: string;
  weight: string;
}

export interface AssessmentResult {
  id: string;
  schemeId: string;
  targetId: string;
  targetName: string;
  rank: number;
  totalScore: number;
  dimensions: {
    medical: { label: string; score: number; indicators: Indicator[] };
    quality: { label: string; score: number; indicators: Indicator[] };
    research: { label: string; score: number; indicators: Indicator[] };
    teaching: { label: string; score: number; indicators: Indicator[] };
    efficiency: { label: string; score: number; indicators: Indicator[] };
  };
}

export const CATEGORY_COLORS: Record<string, string> = {
    '内科系': '#0052FF',
    '外科系': '#10B981',
    '医技系': '#A855F7',
    '其他': '#64748B'
};

export const MOCK_ASSESSMENTS: AssessmentResult[] = [
  {
    id: 'a1', schemeId: 'p1', targetId: 't2', targetName: '心血管内科', rank: 1, totalScore: 96.5,
    dimensions: {
      medical: { 
        label: '医疗能力', score: 95, 
        indicators: [
          { id: 'i1', label: 'CMI指数', score: 93, rawValue: '1.62', weight: '40%' },
          { id: 'i2', label: 'DRG总权重', score: 93, rawValue: '4921', weight: '30%' },
          { id: 'i3', label: '四级手术占比', score: 96, rawValue: '32.1%', weight: '30%' }
        ] 
      },
      quality: { 
        label: '质量安全', score: 99, 
        indicators: [
          { id: 'i4', label: '低风险死亡率', score: 97, rawValue: '0.01%', weight: '40%' },
          { id: 'i5', label: 'I类切口感染率', score: 99, rawValue: '0.05%', weight: '30%' },
          { id: 'i6', label: '甲级病案率', score: 99, rawValue: '98.5%', weight: '30%' }
        ] 
      },
      research: { 
        label: '科研产出', score: 94, 
        indicators: [
          { id: 'i7', label: 'SCI论文影响因子', score: 96, rawValue: '3.8', weight: '50%' },
          { id: 'i8', label: '国家级课题', score: 95, rawValue: '2', weight: '30%' },
          { id: 'i9', label: '发明专利', score: 95, rawValue: '2', weight: '20%' }
        ] 
      },
      teaching: { 
        label: '教学培养', score: 92, 
        indicators: [
          { id: 'i10', label: '教学基地评估', score: 94, rawValue: '优秀', weight: '60%' },
          { id: 'i11', label: '继教项目举办', score: 90, rawValue: '3', weight: '40%' }
        ] 
      },
      efficiency: { 
        label: '运营效率', score: 98, 
        indicators: [
          { id: 'i12', label: '平均住院日', score: 97, rawValue: '8.5天', weight: '50%' },
          { id: 'i13', label: '次均费用', score: 98, rawValue: '14672', weight: '50%' }
        ] 
      }
    }
  },
  {
    id: 'a2', schemeId: 'p1', targetId: 't1', targetName: '放射科', rank: 2, totalScore: 94.5,
    dimensions: {
      medical: { 
        label: '医疗能力', score: 96, 
        indicators: [
          { id: 'i1', label: 'CMI指数', score: 95, rawValue: '1.58', weight: '40%' },
          { id: 'i2', label: 'DRG总权重', score: 97, rawValue: '5120', weight: '60%' }
        ] 
      },
      quality: { 
        label: '质量安全', score: 92, 
        indicators: [
          { id: 'i3', label: '低风险死亡率', score: 92, rawValue: '0.02%', weight: '100%' }
        ] 
      },
      research: { 
        label: '科研产出', score: 98, 
        indicators: [
          { id: 'i4', label: 'SCI论文', score: 98, rawValue: '5.2', weight: '100%' }
        ] 
      },
      teaching: { 
        label: '教学培养', score: 88, 
        indicators: [
          { id: 'i5', label: '教学评估', score: 88, rawValue: '良好', weight: '100%' }
        ] 
      },
      efficiency: { 
        label: '运营效率', score: 95, 
        indicators: [
          { id: 'i6', label: '平均住院日', score: 95, rawValue: '7.2天', weight: '100%' }
        ] 
      }
    }
  },
  {
    id: 'a3', schemeId: 'p1', targetId: 't3', targetName: '呼吸内科', rank: 3, totalScore: 93.8,
    dimensions: {
      medical: { label: '医疗能力', score: 97, indicators: [] },
      quality: { label: '质量安全', score: 90, indicators: [] },
      research: { label: '科研产出', score: 95, indicators: [] },
      teaching: { label: '教学培养', score: 89, indicators: [] },
      efficiency: { label: '运营效率', score: 91, indicators: [] }
    }
  },
  {
    id: 'a4', schemeId: 'p1', targetId: 't4', targetName: '神经外科', rank: 4, totalScore: 91.2,
    dimensions: {
      medical: { label: '医疗能力', score: 98, indicators: [] },
      quality: { label: '质量安全', score: 85, indicators: [] },
      research: { label: '科研产出', score: 90, indicators: [] },
      teaching: { label: '教学培养', score: 86, indicators: [] },
      efficiency: { label: '运营效率', score: 92, indicators: [] }
    }
  },
  {
    id: 'a5', schemeId: 'p1', targetId: 't5', targetName: '胸外科', rank: 5, totalScore: 88.7,
    dimensions: {
      medical: { label: '医疗能力', score: 92, indicators: [] },
      quality: { label: '质量安全', score: 94, indicators: [] },
      research: { label: '科研产出', score: 80, indicators: [] },
      teaching: { label: '教学培养', score: 85, indicators: [] },
      efficiency: { label: '运营效率', score: 89, indicators: [] }
    }
  },
  {
    id: 'a6', schemeId: 'p1', targetId: 't6', targetName: '骨科中心', rank: 6, totalScore: 85.4,
    dimensions: {
      medical: { label: '医疗能力', score: 88, indicators: [] },
      quality: { label: '质量安全', score: 90, indicators: [] },
      research: { label: '科研产出', score: 75, indicators: [] },
      teaching: { label: '教学培养', score: 82, indicators: [] },
      efficiency: { label: '运营效率', score: 94, indicators: [] }
    }
  },
  {
    id: 'a7', schemeId: 'p1', targetId: 't7', targetName: '消化内科', rank: 7, totalScore: 84.2,
    dimensions: {
      medical: { label: '医疗能力', score: 85, indicators: [] },
      quality: { label: '质量安全', score: 88, indicators: [] },
      research: { label: '科研产出', score: 78, indicators: [] },
      teaching: { label: '教学培养', score: 84, indicators: [] },
      efficiency: { label: '运营效率', score: 86, indicators: [] }
    }
  },
  {
    id: 'a8', schemeId: 'p1', targetId: 't8', targetName: '检验科', rank: 8, totalScore: 81.5,
    dimensions: {
      medical: { label: '医疗能力', score: 80, indicators: [] },
      quality: { label: '质量安全', score: 96, indicators: [] },
      research: { label: '科研产出', score: 72, indicators: [] },
      teaching: { label: '教学培养', score: 80, indicators: [] },
      efficiency: { label: '运营效率', score: 88, indicators: [] }
    }
  },
  {
    id: 'a9', schemeId: 'p1', targetId: 't9', targetName: '普外科', rank: 9, totalScore: 76.8,
    dimensions: {
      medical: { label: '医疗能力', score: 82, indicators: [] },
      quality: { label: '质量安全', score: 70, indicators: [] },
      research: { label: '科研产出', score: 65, indicators: [] },
      teaching: { label: '教学培养', score: 80, indicators: [] },
      efficiency: { label: '运营效率', score: 85, indicators: [] }
    }
  },
  {
    id: 'a10', schemeId: 'p1', targetId: 't10', targetName: '妇产科', rank: 10, totalScore: 72.4,
    dimensions: {
      medical: { label: '医疗能力', score: 75, indicators: [] },
      quality: { label: '质量安全', score: 68, indicators: [] },
      research: { label: '科研产出', score: 60, indicators: [] },
      teaching: { label: '教学培养', score: 78, indicators: [] },
      efficiency: { label: '运营效率', score: 82, indicators: [] }
    }
  },
  {
    id: 'a11', schemeId: 'p1', targetId: 't11', targetName: '儿科', rank: 11, totalScore: 70.5,
    dimensions: {
      medical: { label: '医疗能力', score: 72, indicators: [] },
      quality: { label: '质量安全', score: 65, indicators: [] },
      research: { label: '科研产出', score: 58, indicators: [] },
      teaching: { label: '教学培养', score: 85, indicators: [] },
      efficiency: { label: '运营效率', score: 80, indicators: [] }
    }
  },
  {
    id: 'a12', schemeId: 'p1', targetId: 't12', targetName: '神经内科', rank: 12, totalScore: 68.2,
    dimensions: {
      medical: { label: '医疗能力', score: 70, indicators: [] },
      quality: { label: '质量安全', score: 62, indicators: [] },
      research: { label: '科研产出', score: 55, indicators: [] },
      teaching: { label: '教学培养', score: 75, indicators: [] },
      efficiency: { label: '运营效率', score: 78, indicators: [] }
    }
  },
  {
    id: 'a13', schemeId: 'p1', targetId: 't13', targetName: '康复科', rank: 13, totalScore: 75.5,
    dimensions: {
      medical: { label: '医疗能力', score: 95, indicators: [] },
      quality: { label: '质量安全', score: 50, indicators: [] },
      research: { label: '科研产出', score: 40, indicators: [] },
      teaching: { label: '教学培养', score: 60, indicators: [] },
      efficiency: { label: '运营效率', score: 55, indicators: [] }
    }
  },
  {
    id: 'a14', schemeId: 'p1', targetId: 't14', targetName: '中医科', rank: 14, totalScore: 72.1,
    dimensions: {
      medical: { label: '医疗能力', score: 45, indicators: [] },
      quality: { label: '质量安全', score: 92, indicators: [] },
      research: { label: '科研产出', score: 35, indicators: [] },
      teaching: { label: '教学培养', score: 55, indicators: [] },
      efficiency: { label: '运营效率', score: 60, indicators: [] }
    }
  },
  {
    id: 'a15', schemeId: 'p1', targetId: 't15', targetName: '心理科', rank: 15, totalScore: 68.4,
    dimensions: {
      medical: { label: '医疗能力', score: 40, indicators: [] },
      quality: { label: '质量安全', score: 45, indicators: [] },
      research: { label: '科研产出', score: 98, indicators: [] },
      teaching: { label: '教学培养', score: 50, indicators: [] },
      efficiency: { label: '运营效率', score: 45, indicators: [] }
    }
  }
];

export const MOCK_DEPARTMENTS = [
  { id: 'all', name: '全院', level: 0 },
  { id: 'outpatient', name: '门诊部', level: 0 },
  { id: 'op_internal', name: '门诊内科', level: 1 },
  { id: 'op_surgery', name: '门诊外科', level: 1 },
  { id: 'op_neuro', name: '神经外门诊(沿江)', level: 1 },
  { id: 'inpatient', name: '住院部', level: 0 },
  { id: 'ip_internal', name: '心血管内科', level: 1 },
  { id: 'ip_surgery', name: '普外科', level: 1 },
  { id: 'ip_ortho', name: '骨科', level: 1 },
];
