/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, PieChart, FileText, 
  Activity, GraduationCap, Settings, Layers, Binary,
  FileBarChart, ArrowRight,
  ChevronRight, Home, Search, ChevronLeft
} from 'lucide-react';
import {
  PieChart as RePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend, ReferenceLine, LabelList,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, ScatterChart, ReferenceArea, Scatter, Treemap
} from 'recharts';
import { RotateCcw, List, Calendar, Check, RefreshCw, Clock, AlertCircle, FlaskConical, Filter, Users, Hourglass, User, ArrowUpDown, ArrowDown, X, Pill, PieChart as PieChartIcon, CheckCircle, ArrowLeft, Target, Download, LayoutGrid, TrendingUp, BarChart3, ChevronDown, ChevronUp, Sparkles, Lightbulb, BrainCircuit, ArrowUpRight, ArrowDownRight, Split, Crosshair, GitCommit, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DeanCockpit from './operational-decision-center/cockpits/DeanCockpit';

// --- Talent Development Types & Helpers ---

type AnalysisView = 'strategy' | 'lateral' | 'longitudinal' | 'matrix';
type SortField = 'totalScore' | 'medical' | 'quality' | 'research' | 'teaching' | 'efficiency';
type SortOrder = 'asc' | 'desc';

interface AssessmentResult {
  id: string;
  schemeId: string;
  targetId: string;
  targetName: string;
  rank: number;
  totalScore: number;
  dimensions: {
    medical: { label: string; score: number; indicators: any[] };
    quality: { label: string; score: number; indicators: any[] };
    research: { label: string; score: number; indicators: any[] };
    teaching: { label: string; score: number; indicators: any[] };
    efficiency: { label: string; score: number; indicators: any[] };
  };
}

const getCategory = (name: string) => {
    if (name.includes('内科') || name.includes('儿科') || name.includes('中医')) return '内科系';
    if (name.includes('外科') || name.includes('骨科') || name.includes('妇产')) return '外科系';
    if (name.includes('医技') || name.includes('检验') || name.includes('放射')) return '医技系';
    return '其他';
};

const CATEGORY_COLORS: Record<string, string> = {
    '内科系': '#0052FF',
    '外科系': '#10B981',
    '医技系': '#A855F7',
    '其他': '#64748B'
};

const generateHistoryData = (assessment: any) => {
  const years = ['2020', '2021', '2022', '2023', '2024'];
  
  // Use a deterministic seed based on ID for consistency but variety
  const seed = assessment.id.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
  const getVar = (offset: number) => ((seed + offset) % 100) / 100; // 0 to 1
  
  // Determine the "growth profile" based on seed
  // 0: High growth, 1: Moderate growth, 2: Stagnant, 3: Decline
  const profile = seed % 4;
  
  return years.map((year, i) => {
    const progress = i / 4; // 0 to 1
    const isLastYear = year === '2024';
    
    let baseTrend = 1.0;
    if (profile === 0) baseTrend = 0.7 + progress * 0.4; // Strong growth (~10% CAGR)
    else if (profile === 1) baseTrend = 0.85 + progress * 0.2; // Moderate growth (~5% CAGR)
    else if (profile === 2) baseTrend = 0.95 + progress * 0.05; // Stagnant (~1% CAGR)
    else baseTrend = 1.0 - progress * 0.1; // Decline (~ -2.5% CAGR)

    // Add dimension-specific variance
    const mTrend = baseTrend * (0.95 + getVar(10) * 0.1);
    const qTrend = baseTrend * (0.95 + getVar(20) * 0.1);
    const rTrend = baseTrend * (0.9 + getVar(30) * 0.2);
    const tTrend = baseTrend * (0.95 + getVar(40) * 0.1);
    const eTrend = baseTrend * (0.95 + getVar(50) * 0.1);
    
    // For attribution (2024 vs 2023), we want only ONE negative.
    // Let's make Teaching the only one that drops in the final year.
    let finalTTrend = tTrend;
    let finalMTrend = mTrend;
    let finalQTrend = qTrend;
    let finalRTrend = rTrend;
    let finalETrend = eTrend;

    if (isLastYear) {
        const prevProgress = (i - 1) / 4;
        const prevBaseTrend = profile === 0 ? 0.7 + prevProgress * 0.4 : 
                             profile === 1 ? 0.85 + prevProgress * 0.2 :
                             profile === 2 ? 0.95 + prevProgress * 0.05 :
                             1.0 - prevProgress * 0.1;
        
        const prevTTrend = prevBaseTrend * (0.95 + getVar(40) * 0.1);
        finalTTrend = prevTTrend - 0.08; // Force drop
        
        // Ensure others are slightly higher than previous year to keep Teaching as the only negative
        finalMTrend = Math.max(mTrend, (prevBaseTrend * (0.95 + getVar(10) * 0.1)) + 0.01);
        finalQTrend = Math.max(qTrend, (prevBaseTrend * (0.95 + getVar(20) * 0.1)) + 0.01);
        finalRTrend = Math.max(rTrend, (prevBaseTrend * (0.9 + getVar(30) * 0.2)) + 0.01);
        finalETrend = Math.max(eTrend, (prevBaseTrend * (0.95 + getVar(50) * 0.1)) + 0.01);
    }

    const project = (val: number, trend: number) => Math.min(100, Math.max(10, Number((val * trend).toFixed(1))));

    const data: any = {
      year,
      medical: project(assessment.dimensions.medical.score, finalMTrend),
      quality: project(assessment.dimensions.quality.score, finalQTrend),
      research: project(assessment.dimensions.research.score, finalRTrend),
      teaching: project(assessment.dimensions.teaching.score, finalTTrend),
      efficiency: project(assessment.dimensions.efficiency.score, finalETrend),
    };
    
    data.score = Number(((data.medical + data.quality + data.research + data.teaching + data.efficiency) / 5).toFixed(1));
    
    return data;
  });
};

const generateIndicatorHistory = () => {
    const years = ['2020', '2021', '2022', '2023', '2024'];
    const indicators = [
        { id: 'ind1', name: 'CMI指数', category: '医疗能力', unit: '', format: '0.00' },
        { id: 'ind2', name: 'DRG总权重', category: '医疗能力', unit: '', format: '0' },
        { id: 'ind3', name: '四级手术占比', category: '医疗能力', unit: '%', format: '0.0' },
        { id: 'ind4', name: '低风险死亡率', category: '质量安全', unit: '%', format: '0.00' },
        { id: 'ind5', name: 'SCI论文数', category: '科研产出', unit: '篇', format: '0' },
        { id: 'ind6', name: '平均住院日', category: '运营效率', unit: '天', format: '0.0' },
    ];

    return indicators.map(ind => {
        const history = years.map((year, i) => {
            let rawValue = 0;
            let score = 0;
            const noise = (Math.random() - 0.5) * 20; // Add significant noise
            if (ind.id === 'ind1') {
                rawValue = 1.0 + (i * 0.05) + (Math.random() * 0.1);
                score = 70 + (rawValue - 1) * 50 + noise;
            } else if (ind.id === 'ind2') {
                rawValue = 2000 + (i * 200) + (Math.random() * 100);
                score = 60 + (rawValue / 4000) * 40 + noise;
            } else if (ind.id === 'ind3') {
                rawValue = 15 + (i * 1.5) + Math.random() * 2;
                score = 50 + rawValue * 1.5 + noise;
            } else if (ind.id === 'ind4') {
                rawValue = Math.max(0, 0.5 - (i * 0.05) + Math.random() * 0.1);
                score = 60 + (0.5 - rawValue) * 100 + noise;
            } else if (ind.id === 'ind5') {
                rawValue = Math.floor(2 + (i * i * 0.5));
                score = 40 + rawValue * 5 + noise; // Lower base for research
            } else {
                rawValue = 8 - (i * 0.4) + Math.random();
                score = 55 + (8 - rawValue) * 10 + noise;
            }
            return { year, rawValue: Number(rawValue.toFixed(2)), score: Math.min(100, Math.max(10, Number(score.toFixed(1)))) };
        });
        return { ...ind, history };
    });
};

const getAiInsight = (name: string, score: number) => {
    if (score >= 90) {
        return {
            status: '卓越领跑',
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            iconColor: 'text-emerald-500',
            analysis: `基于近五年数据分析，${name}处于强劲上升通道，CMI指数与科研产出呈现显著正相关（r=0.85）。学科影响力已辐射至周边省份，核心人才梯队结构稳固，是医院高质量发展的核心引擎。`,
            suggestion: '建议启动国家级重点专科申报筹备；加大在转化医学领域的投入，鼓励开展多中心临床研究；可作为院内标杆，输出科室管理经验。'
        };
    } else if (score >= 80) {
        return {
            status: '稳健发展',
            color: 'text-blue-600 bg-blue-50 border-blue-100',
            iconColor: 'text-blue-500',
            analysis: `${name}各项指标保持平稳，但在“四级手术占比”及“高水平论文产出”上遇到瓶颈。运营效率指标优于全院平均水平，但学科创新动力略显不足，存在“吃老本”风险。`,
            suggestion: '建议引入1-2名学科带头人或高层次科研PI；设立专项基金激励新技术新项目开展；优化亚专科设置，寻求差异化发展路径。'
        };
    } else {
        return {
            status: '亟待改进',
            color: 'text-amber-600 bg-amber-50 border-amber-100',
            iconColor: 'text-amber-500',
            analysis: `${name}综合绩效评分低于预期，主要受限于人才流失与医疗质量指标波动。DRG总权重增长乏力，且次均费用控制存在压力，运营模式需由粗放向精细化转变。`,
            suggestion: '建议进行科室管理层改组或进行深度运营诊断；加强医疗质量安全红线管理；重新梳理病种结构，剥离低效业务，聚焦优势病种。'
        };
    }
};

const MOCK_ASSESSMENTS: AssessmentResult[] = [
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

// --- Custom Ternary Plot Component ---
interface TernaryDataPoint {
    id: string;
    name: string;
    category: string;
    v1: number; // Top
    v2: number; // Right
    v3: number; // Left
    prevV1?: number;
    prevV2?: number;
    prevV3?: number;
    [key: string]: any;
}

const TernaryPlot: React.FC<{ 
    data: TernaryDataPoint[]; 
    labels: [string, string, string]; 
    showTrajectory?: boolean; 
}> = ({ data, labels, showTrajectory }) => {
    const [hovered, setHovered] = useState<TernaryDataPoint | null>(null);
    const S = 300; 
    const H = S * Math.sqrt(3) / 2;
    const paddingX = 60;
    const paddingY = 30; 
    const width = S + paddingX * 2;
    const height = H + paddingY * 2;

    const A = { x: width / 2, y: paddingY }; 
    const B = { x: width / 2 - S / 2, y: paddingY + H }; 
    const C = { x: width / 2 + S / 2, y: paddingY + H }; 

    const getCoords = (v1: number, v2: number, v3: number) => {
        const sum = v1 + v2 + v3 || 1;
        const a = v1 / sum; 
        const b = v2 / sum; 
        const c = v3 / sum; 
        const x = a * A.x + b * C.x + c * B.x;
        const y = a * A.y + b * C.y + c * B.y;
        return { x, y };
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center select-none">
            {hovered && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute z-10 bg-white/95 backdrop-blur shadow-xl border border-slate-200 p-3 rounded-lg text-xs pointer-events-none"
                    style={{ left: '50%', top: '10%', transform: 'translateX(-50%)' }}
                >
                    <div className="font-bold text-gray-900 mb-1 border-b border-slate-100 pb-1">{hovered.name}</div>
                    <div className="space-y-1">
                        <div className="flex justify-between gap-4"><span className="text-slate-500">{labels[0]}:</span> <span className="font-mono font-bold text-blue-600">{(hovered.v1 / (hovered.v1+hovered.v2+hovered.v3) * 100).toFixed(1)}%</span></div>
                        <div className="flex justify-between gap-4"><span className="text-slate-500">{labels[1]}:</span> <span className="font-mono font-bold text-emerald-600">{(hovered.v2 / (hovered.v1+hovered.v2+hovered.v3) * 100).toFixed(1)}%</span></div>
                        <div className="flex justify-between gap-4"><span className="text-slate-500">{labels[2]}:</span> <span className="font-mono font-bold text-purple-600">{(hovered.v3 / (hovered.v1+hovered.v2+hovered.v3) * 100).toFixed(1)}%</span></div>
                    </div>
                </motion.div>
            )}
            
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[380px] overflow-visible">
                <defs>
                    <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8" opacity="0.6"/>
                    </marker>
                </defs>
                <path d={`M${A.x},${A.y} L${C.x},${C.y} L${B.x},${B.y} Z`} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                {[0.2, 0.4, 0.6, 0.8].map(t => {
                    const l1_start = { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t };
                    const l1_end = { x: A.x + (C.x - A.x) * t, y: A.y + (C.y - A.y) * t };
                    const l2_start = { x: B.x + (A.x - B.x) * t, y: B.y + (A.y - B.y) * t };
                    const l2_end = { x: B.x + (C.x - B.x) * t, y: B.y + (C.y - B.y) * t };
                    const l3_start = { x: C.x + (A.x - C.x) * t, y: C.y + (A.y - C.y) * t };
                    const l3_end = { x: C.x + (B.x - C.x) * t, y: C.y + (B.y - C.y) * t };
                    return (
                        <g key={t} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3">
                            <line x1={l1_start.x} y1={l1_start.y} x2={l1_end.x} y2={l1_end.y} />
                            <line x1={l2_start.x} y1={l2_start.y} x2={l2_end.x} y2={l2_end.y} />
                            <line x1={l3_start.x} y1={l3_start.y} x2={l3_end.x} y2={l3_end.y} />
                        </g>
                    );
                })}
                <text x={A.x} y={A.y - 15} textAnchor="middle" className="text-xs font-bold fill-blue-600">{labels[0]}</text>
                <text x={C.x + 10} y={C.y + 10} textAnchor="start" className="text-xs font-bold fill-emerald-600">{labels[1]}</text>
                <text x={B.x - 10} y={B.y + 10} textAnchor="end" className="text-xs font-bold fill-purple-600">{labels[2]}</text>
                {data.map(d => {
                    const pos = getCoords(d.v1, d.v2, d.v3);
                    const color = CATEGORY_COLORS[d.category] || '#94a3b8';
                    const isHovered = hovered?.id === d.id;
                    const opacity = hovered ? (isHovered ? 1 : 0.2) : 0.8;
                    let prevPos = null;
                    if (showTrajectory && d.prevV1 !== undefined && d.prevV2 !== undefined && d.prevV3 !== undefined) {
                        prevPos = getCoords(d.prevV1, d.prevV2, d.prevV3);
                    }
                    return (
                        <g key={d.id} 
                           onMouseEnter={() => setHovered(d)} 
                           onMouseLeave={() => setHovered(null)}
                           className="transition-opacity duration-300"
                           style={{ opacity }}
                        >
                            <circle cx={pos.x} cy={pos.y} r={12} fill="transparent" />
                            <circle cx={pos.x} cy={pos.y} r={isHovered ? 6 : 4} fill={color} stroke="white" strokeWidth="1.5" />
                            {prevPos && (
                                <g>
                                    <circle cx={prevPos.x} cy={prevPos.y} r={2} fill={color} opacity="0.5" />
                                    <line x1={prevPos.x} y1={prevPos.y} x2={pos.x} y2={pos.y} stroke={color} strokeWidth="1.5" opacity="0.5" markerEnd="url(#arrowHead)" />
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// Mock Data for Department Selector
const MOCK_DEPARTMENTS = [
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

const MOCK_REPORTS = [
  {
    id: 1,
    status: 'submitted',
    name: '抗菌药物DDD值月度报告(科室) -202504',
    type: '科室',
    department: '神经外门诊(沿江)',
    timeType: '月',
    reportTime: '2025-04',
    submitTime: '2025-05-27 09:37:57',
    submitter: '林谦宏',
    progress: 100,
    progressText: '100.00% (1/1)'
  },
  {
    id: 2,
    status: 'submitted',
    name: '自定义模板三-全院-2025-10-10',
    type: '全院',
    department: '全院',
    timeType: '月',
    reportTime: '2025-08',
    submitTime: '2025-10-10 11:22:34',
    submitter: '林谦宏',
    progress: 100,
    progressText: '100.00% (1/1)'
  }
];

// Stats Data
const STATS = [
  { label: '分析主题', value: 12, unit: '个', icon: Layers },
  { label: '分析专题', value: 8, unit: '个', icon: Binary },
  { label: '统计报表', value: 156, unit: '张', icon: FileBarChart },
  { label: '指标总数', value: 2450, unit: '个', icon: Activity },
  { label: '发布报告', value: 56, unit: '份', icon: FileText },
];

// Modules Data
const MODULES = [
  { 
    id: 'cockpit', 
    title: '驾驶舱', 
    desc: '全院运营态势一屏统览', 
    icon: LayoutDashboard, 
    gradient: 'from-blue-500 to-indigo-600',
    shadowColor: 'shadow-blue-200'
  },
  { 
    id: 'theme', 
    title: '主题分析', 
    desc: '多维数据深度关联分析', 
    icon: PieChart, 
    gradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-200'
  },
  { 
    id: 'report', 
    title: '统计报表', 
    desc: '业务数据报表查询与定制', 
    icon: BarChart3, 
    gradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-200'
  },
  { 
    id: 'doc', 
    title: '报告中心', 
    desc: '质控报告生成与归档', 
    icon: FileText, 
    gradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-200'
  },
  { 
    id: 'surgery', 
    title: '手术非常准', 
    desc: '术前术中术后全链路分析', 
    icon: Activity, 
    gradient: 'from-rose-500 to-pink-600',
    shadowColor: 'shadow-rose-200'
  },
  { 
    id: 'talent', 
    title: '学科与人才发展', 
    desc: '学科发展与梯队建设', 
    icon: GraduationCap, 
    gradient: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-200'
  },
  { 
    id: 'config', 
    title: '配置管理', 
    desc: '参数设置与规则定义', 
    icon: Settings, 
    gradient: 'from-slate-500 to-gray-600',
    shadowColor: 'shadow-slate-200'
  },
  { 
    id: 'attending-kpi', 
    title: '主诊组KPI效能评价', 
    desc: '主诊组效能实时排行与分析', 
    icon: Users, 
    gradient: 'from-indigo-500 to-purple-600',
    shadowColor: 'shadow-indigo-200'
  },
  { 
    id: 'er_return_monitor', 
    title: '计划外重返急诊就诊监测', 
    desc: '急诊重返率监控与分析', 
    icon: Activity, 
    gradient: 'from-red-500 to-rose-600',
    shadowColor: 'shadow-red-200'
  },
];

import { StatisticalReport } from './operational-decision-center/StatisticalReport';

const IndicatorCard = ({ data }: { data: any }) => (
  <div className="bg-[#0b1a30]/80 border border-blue-500/30 rounded-lg p-4 flex flex-col gap-4 relative overflow-hidden backdrop-blur-sm">
    {/* Title */}
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-cyan-400"></div>
      <div className="w-2 h-2 bg-blue-600 -ml-1"></div>
      <h3 className="text-blue-100 font-bold text-sm tracking-wider">{data.title}</h3>
    </div>

    <div className="flex items-center flex-1 gap-6">
      {/* Left Group: Progress + Numbers */}
      <div className="flex items-center gap-6 border-r border-blue-500/20 pr-6">
        {/* Circular Progress */}
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#1e3a8a" strokeWidth="8" fill="none" />
            <circle 
              cx="50" cy="50" r="40" 
              stroke="#0ea5e9" 
              strokeWidth="8" 
              fill="none" 
              strokeDasharray={`${2 * Math.PI * 40}`} 
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.rate / 100)}`} 
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]"
            />
            {/* Decorative dashed circle */}
            <circle cx="50" cy="50" r="48" stroke="#0ea5e9" strokeWidth="1" fill="none" strokeDasharray="4 4" opacity="0.5" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-xl">{data.rate}%</span>
          </div>
        </div>

        {/* Numbers */}
        <div className="flex flex-col gap-4 min-w-[120px]">
          <div>
            <div className="text-blue-200/70 text-xs mb-1">{data.numLabel1}</div>
            <div className="text-cyan-300 font-mono text-xl">{data.numValue1}</div>
          </div>
          <div className="h-px w-full bg-blue-500/20"></div>
          <div>
            <div className="text-blue-200/70 text-xs mb-1">{data.numLabel2}</div>
            <div className="text-cyan-300 font-mono text-xl">{data.numValue2}</div>
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="flex-1 h-32 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.history} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" axisLine={true} stroke="#1e3a8a" tickLine={false} tick={{ fontSize: 10, fill: '#60a5fa' }} />
            <YAxis domain={[0, 100]} axisLine={true} stroke="#1e3a8a" tickLine={false} tick={{ fontSize: 10, fill: '#60a5fa' }} width={30} />
            <Tooltip 
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a', color: '#fff' }}
              isAnimationActive={false}
            />
            <Bar dataKey="value" fill="#0ea5e9" barSize={8} radius={[2, 2, 0, 0]} isAnimationActive={false}>
              <LabelList 
                dataKey="rate" 
                position="top" 
                content={(props: any) => {
                  const { x, y, width, value, index } = props;
                  const item = data.history[index];
                  return (
                    <g>
                      <text x={x + width / 2} y={y - 15} fill="#e0f2fe" fontSize="10" textAnchor="middle">{value}%</text>
                      <text x={x + width / 2} y={y - 5} fill="#93c5fd" fontSize="8" textAnchor="middle">{item.text}</text>
                    </g>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const QualityManagementView = () => {
  const topIndicators = [
    { title: '病理标本规范化固定率', value: '99.90%', history: [99.86, 99.92, 99.9] },
    { title: 'HE染色切片优良率', value: '97.58%', history: [97.83, 96.93, 97.58] },
    { title: '免疫组化染色切片优良率', value: '99.68%', history: [99.36, 99.75, 99.68] },
    { title: '各项分子病理检测室内质控合...', value: '100.00%', history: [100, 100, 100] },
  ];

  const column1 = [
    { name: '每百张病床病理医师数', value: '1.08', progress: 80 },
    { name: '病理标本规范化固定率', value: '99.9%', progress: 99.9 },
    { name: 'HE染色切片优良率', value: '97.58%', progress: 97.58 },
    { name: '免疫组化染色切片优良率', value: '99.68%', progress: 99.68 },
    { name: '各项分子病理检测室内质控合格率', value: '100%', progress: 100 },
    { name: '免疫组化染色室间质评合格率', value: '100%', progress: 100 },
    { name: '分子病理室间质评合格率', value: '100%', progress: 100 },
    { name: '术中快速病理诊断及时率', value: '87.05%', progress: 87.05 },
    { name: '组织病理诊断及时率', value: '99.35%', progress: 99.35 },
    { name: '细胞病理诊断及时率', value: '99.84%', progress: 99.84 },
  ];

  const column2 = [
    { name: '送检标本合格率', value: '100%', progress: 100 },
    { name: '包埋标本合格率', value: '99.94%', progress: 99.94 },
    { name: '肾穿检查制片合格率', value: '100%', progress: 100 },
    { name: '术中快速病理制片优良率', value: '96.72%', progress: 96.72 },
    { name: '细胞制片优良率', value: '100%', progress: 100 },
    { name: '特殊制片优良率', value: '99.22%', progress: 99.22 },
    { name: 'FISH制片优良率', value: '100%', progress: 100 },
    { name: '受委托实验室', value: '100%', progress: 100 },
  ];

  const column3 = [
    { name: 'TCT液基细胞病理诊断及时率', value: '100%', progress: 100 },
    { name: 'LCT液基细胞病理诊断及时率', value: '100%', progress: 100 },
    { name: 'P16免疫细胞病理诊断及时率', value: '100%', progress: 100 },
    { name: '常规活检每月随机抽查', value: '100%', progress: 100 },
    { name: '肾穿报告符合率', value: '100%', progress: 100 },
    { name: '病理诊断与临床诊断符合率', value: '100%', progress: 100 },
    { name: '细胞病理诊断与组织病理诊断符合率', value: '100%', progress: 100 },
    { name: '细胞学(细胞与细针)恶性复核率', value: '100%', progress: 100 },
    { name: '细胞学(细胞与细针)阴性复核率', value: '13.37%', progress: 13.37 },
    { name: '常规病理首诊恶性控率', value: '100%', progress: 100 },
    { name: 'FISH病理诊断及时率', value: '99.43%', progress: 99.43 },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-hidden">
      {/* Top Section: 4 Charts */}
      <div className="grid grid-cols-4 gap-4">
        {topIndicators.map((item, idx) => (
          <div key={idx} className="bg-[#0b1a30]/60 border border-blue-500/20 rounded-lg p-4 flex flex-col items-center relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
            <h4 className="text-blue-200 text-xs mb-4 text-center h-8 flex items-center">{item.title}</h4>
            <div className="text-yellow-400 text-2xl font-bold mb-4 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">{item.value}</div>
            <div className="w-full h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={item.history.map((v, i) => ({ value: v, month: `2025-${9+i}` }))} margin={{ left: -30, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a8a" opacity={0.3} />
                  <XAxis dataKey="month" hide />
                  <YAxis 
                    domain={['dataMin - 1', 'dataMax + 1']} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#60a5fa', opacity: 0.6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0ea5e9" 
                    strokeWidth={2} 
                    dot={{ fill: '#0ea5e9', r: 3 }} 
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between w-full mt-1 px-2">
              {['2025-09', '2025-10', '2025-11'].map(m => (
                <span key={m} className="text-[10px] text-blue-400/60">{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: 3 Columns of Progress Bars */}
      <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
        {/* Column 1 */}
        <div className="bg-[#0b1a30]/40 border border-blue-500/10 rounded-lg p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-3 bg-cyan-400"></div>
              <div className="w-1.5 h-3 bg-cyan-400/60"></div>
            </div>
            <h5 className="text-blue-100 font-bold text-sm">11月国家质控中心指标</h5>
          </div>
          {column1.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-200/80 flex items-center gap-1.5">
                  {item.name}
                </span>
                <span className="text-white font-mono">{item.value}</span>
              </div>
              <div className="h-1.5 w-full bg-blue-900/40 rounded-full overflow-hidden border border-blue-500/20">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2 */}
        <div className="bg-[#0b1a30]/40 border border-blue-500/10 rounded-lg p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-3 bg-cyan-400"></div>
              <div className="w-1.5 h-3 bg-cyan-400/60"></div>
            </div>
            <h5 className="text-blue-100 font-bold text-sm">11月技术质量指标</h5>
          </div>
          {column2.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-200/80">{item.name}</span>
                <span className="text-white font-mono">{item.value}</span>
              </div>
              <div className="h-1.5 w-full bg-blue-900/40 rounded-full overflow-hidden border border-blue-500/20">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Column 3 */}
        <div className="bg-[#0b1a30]/40 border border-blue-500/10 rounded-lg p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-3 bg-cyan-400"></div>
              <div className="w-1.5 h-3 bg-cyan-400/60"></div>
            </div>
            <h5 className="text-blue-100 font-bold text-sm">11月诊断质量指标</h5>
          </div>
          {column3.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-200/80">{item.name}</span>
                <span className="text-white font-mono">{item.value}</span>
              </div>
              <div className="h-1.5 w-full bg-blue-900/40 rounded-full overflow-hidden border border-blue-500/20">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PathologyCockpit = ({ onBack }: { onBack: () => void }) => {
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'indicators' | 'management'>('indicators');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const technicalData = [
    {
      title: '病理标本规范化固定率',
      rate: 99.9,
      numLabel1: '规范化固定标本数',
      numValue1: 8361,
      numLabel2: '标本总数',
      numValue2: 8369,
      history: [
        { month: '2025-09', rate: 99.86, text: '8486/8498', value: 99.86 },
        { month: '2025-10', rate: 99.92, text: '7160/7166', value: 99.92 },
        { month: '2025-11', rate: 99.9, text: '8361/8369', value: 99.9 }
      ]
    },
    {
      title: '送检标本合格率',
      rate: 100,
      numLabel1: '合格数',
      numValue1: 8369,
      numLabel2: '总数',
      numValue2: 8369,
      history: [
        { month: '2025-09', rate: 99.99, text: '8497/8498', value: 99.99 },
        { month: '2025-10', rate: 100, text: '7166/7166', value: 100 },
        { month: '2025-11', rate: 100, text: '8369/8369', value: 100 }
      ]
    },
    {
      title: '包埋标本合格率',
      rate: 99.94,
      numLabel1: '合格数',
      numValue1: 30813,
      numLabel2: '总数',
      numValue2: 30832,
      history: [
        { month: '2025-09', rate: 99.97, text: '31990/32000', value: 99.97 },
        { month: '2025-10', rate: 99.99, text: '25649/25652', value: 99.99 },
        { month: '2025-11', rate: 99.94, text: '30813/30832', value: 99.94 }
      ]
    },
    {
      title: '细胞制片优良率',
      rate: 100,
      numLabel1: '细胞优良制片数',
      numValue1: 641,
      numLabel2: '同期细胞制片评价总数',
      numValue2: 641,
      history: [
        { month: '2025-09', rate: 99.14, text: '688/694', value: 99.14 },
        { month: '2025-10', rate: 100, text: '620/620', value: 100 },
        { month: '2025-11', rate: 100, text: '641/641', value: 100 }
      ]
    }
  ];

  const diagnosticData = [
    {
      title: '术中快速病理诊断及时率',
      rate: 87.05,
      numLabel1: '在规定时间内完成诊断的病...',
      numValue1: 504,
      numLabel2: '同期完成诊断的病例数',
      numValue2: 579,
      history: [
        { month: '2025-09', rate: 88.11, text: '504/572', value: 88.11 },
        { month: '2025-10', rate: 91.05, text: '417/458', value: 91.05 },
        { month: '2025-11', rate: 87.05, text: '504/579', value: 87.05 }
      ]
    },
    {
      title: '组织病理诊断及时率',
      rate: 99.35,
      numLabel1: '在规定时间内完成诊断的病...',
      numValue1: 8315,
      numLabel2: '同期完成诊断的病例数',
      numValue2: 8369,
      history: [
        { month: '2025-09', rate: 99.48, text: '8454/8498', value: 99.48 },
        { month: '2025-10', rate: 99.67, text: '7142/7166', value: 99.67 },
        { month: '2025-11', rate: 99.35, text: '8315/8369', value: 99.35 }
      ]
    },
    {
      title: '细胞病理诊断及时率',
      rate: 99.84,
      numLabel1: '在规定时间内完成诊断的病...',
      numValue1: 631,
      numLabel2: '同期完成诊断的病例数',
      numValue2: 632,
      history: [
        { month: '2025-09', rate: 98.99, text: '687/694', value: 98.99 },
        { month: '2025-10', rate: 100, text: '620/620', value: 100 },
        { month: '2025-11', rate: 99.84, text: '631/632', value: 99.84 }
      ]
    },
    {
      title: 'FISH病理诊断及时率',
      rate: 99.43,
      numLabel1: '合格数',
      numValue1: 351,
      numLabel2: '总数',
      numValue2: 353,
      history: [
        { month: '2025-09', rate: 99.36, text: '312/314', value: 99.36 },
        { month: '2025-10', rate: 100, text: '229/229', value: 100 },
        { month: '2025-11', rate: 99.43, text: '351/353', value: 99.43 }
      ]
    }
  ];

  return (
    <div className="w-full h-screen bg-[#020617] text-white p-4 font-sans flex flex-col overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          
          {/* Tabs */}
          <div className="flex items-center bg-blue-900/30 rounded-lg p-1 border border-blue-500/20 ml-4">
            <button 
              onClick={() => setActiveTab('indicators')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'indicators' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'text-blue-300 hover:text-white'}`}
            >
              质控指标
            </button>
            <button 
              onClick={() => setActiveTab('management')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'management' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'text-blue-300 hover:text-white'}`}
            >
              质量管理
            </button>
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Decorative wings */}
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-r from-transparent to-blue-500"></div>
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-l from-transparent to-blue-500"></div>
            
            <h1 className="text-3xl font-bold tracking-widest bg-gradient-to-b from-white via-blue-100 to-blue-300 bg-clip-text text-transparent whitespace-nowrap drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
              病理驾驶舱
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-blue-200 text-sm">
          <div className="flex items-center gap-2 bg-blue-900/40 px-3 py-1.5 rounded-full border border-blue-500/30 backdrop-blur-md">
            <Calendar size={16} className="text-blue-400" />
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-white outline-none text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
            />
          </div>
          <button className="hover:text-white transition-colors">
            <RefreshCw size={16} />
          </button>
          <div className="text-right leading-tight font-mono">
            <div className="text-lg text-white">{currentTime.toLocaleTimeString('en-US', { hour12: false })}</div>
            <div className="text-xs text-blue-300">{currentTime.toLocaleDateString('zh-CN').replace(/\//g, '-')}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'indicators' ? (
        <div className="flex-1 grid grid-cols-2 gap-8 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
          {/* Left Column */}
          <div className="flex flex-col gap-6 pb-6">
            <div className="relative flex justify-center mb-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-500/30"></div>
              </div>
              <div className="relative bg-[#020617] px-6 text-blue-300 font-bold tracking-widest border border-blue-500/50 rounded-full py-1 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                技术质量指标
              </div>
            </div>
            {technicalData.map((data, idx) => (
              <React.Fragment key={idx}>
                <IndicatorCard data={data} />
              </React.Fragment>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 pb-6">
            <div className="relative flex justify-center mb-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-500/30"></div>
              </div>
              <div className="relative bg-[#020617] px-6 text-blue-300 font-bold tracking-widest border border-blue-500/50 rounded-full py-1 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                诊断质量指标
              </div>
            </div>
            {diagnosticData.map((data, idx) => (
              <React.Fragment key={idx}>
                <IndicatorCard data={data} />
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <QualityManagementView />
      )}
    </div>
  );
};

const OperationalDecisionCenter: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Theme Analysis State
  const [activeThemeId, setActiveThemeId] = useState('emergency');
  const [activeEmergencyTab, setActiveEmergencyTab] = useState<'realtime' | 'history'>('realtime');
  const [activePharmacyTab, setActivePharmacyTab] = useState<'antibacterial' | 'prescription' | 'monitoring'>('antibacterial');
  const [ultrasoundCampus, setUltrasoundCampus] = useState('全部');
  const [endoscopyCampus, setEndoscopyCampus] = useState('全部');
  const [endoscopyDateRange, setEndoscopyDateRange] = useState('本月');
  const [endoscopyMod1Tab, setEndoscopyMod1Tab] = useState('全院');
  const [endoscopyMod2Tab, setEndoscopyMod2Tab] = useState('全院');
  const [endoscopyMod4Tab, setEndoscopyMod4Tab] = useState('全院');
  const [endoscopyMod6Tab, setEndoscopyMod6Tab] = useState('全院');

  // Report Center State
  const [isDeptSelectorOpen, setIsDeptSelectorOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string[]>([]);
  const deptSelectorRef = useRef<HTMLDivElement>(null);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [activeCockpitId, setActiveCockpitId] = useState<string | null>(null);
  const [activeLabTab, setActiveLabTab] = useState<'lab' | 'blood'>('lab');
  const [selectedCampus, setSelectedCampus] = useState('全院');
  const [selectedDoctorId, setSelectedDoctorId] = useState(1);

  // Attending Group KPI State
  const [kpiSearchQuery, setKpiSearchQuery] = useState('');
  const [kpiSelectedType, setKpiSelectedType] = useState('全部');
  const [kpiSelectedLabel, setKpiSelectedLabel] = useState('全部');
  const [kpiSelectedMonth, setKpiSelectedMonth] = useState('2026-03');
  const [kpiSortDirection, setKpiSortDirection] = useState<'desc' | 'asc' | null>('desc');

  // Drill Down State
  const [drillDownConfig, setDrillDownConfig] = useState<{isOpen: boolean, title: string, type: string} | null>(null);
  const [workloadDrillDown, setWorkloadDrillDown] = useState<string | null>(null);

  // Talent Development State
  const [selectedTalentPlanId, setSelectedTalentPlanId] = useState<string | null>(null);
  const [talentActiveView, setTalentActiveView] = useState<AnalysisView>('strategy');
  const [talentCategoryFilter, setTalentCategoryFilter] = useState<string>('All');
  const [talentSortField] = useState<SortField>('totalScore');
  const [talentSortOrder] = useState<SortOrder>('desc');
  const [talentCompareList, setTalentCompareList] = useState<string[]>([]);
  const [talentExpandedRowId, setTalentExpandedRowId] = useState<string | null>(null);
  const [talentTrendTargetId, setTalentTrendTargetId] = useState<string>('');
  const [talentEvolutionChartMode, setTalentEvolutionChartMode] = useState<'normalized' | 'stacked'>('normalized');
  const [talentSelectedIndicatorId, setTalentSelectedIndicatorId] = useState<string | null>(null);
  const [talentStructureDims, setTalentStructureDims] = useState<string[]>(['medical', 'research', 'teaching']);
  const [talentShowTrajectory, setTalentShowTrajectory] = useState(false);
  const [talentShowCharts, setTalentShowCharts] = useState(false);

  // Close switcher when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsSwitcherOpen(false);
      }
      if (deptSelectorRef.current && !deptSelectorRef.current.contains(event.target as Node)) {
        setIsDeptSelectorOpen(false);
      }
    };
    if (isSwitcherOpen || isDeptSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSwitcherOpen, isDeptSelectorOpen]);

  // --------------------------------------------------------------------------
  // View 1: Dashboard Grid (Entry Point)
  // --------------------------------------------------------------------------
  const renderDashboard = () => (
    <div className="flex flex-col h-full w-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 max-w-7xl mx-auto">
      {/* Header / Welcome Section */}
      <div className="flex flex-col gap-1 mb-2">
         <h1 className="text-2xl font-bold text-gray-800 tracking-tight">运营决策中心</h1>
         <p className="text-gray-500 text-sm">
           基于全院数据的智能化分析与决策支持平台，助力医院精细化管理
         </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATS.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                <stat.icon size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-800 tracking-tight">{stat.value}</span>
              <span className="text-xs text-gray-400">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MODULES.map((mod) => (
          <div 
            key={mod.id}
            onClick={() => setActiveModuleId(mod.id)}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            {/* Top Gradient Line */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${mod.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className="flex items-start gap-5 relative z-10">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.gradient} text-white flex items-center justify-center shadow-lg ${mod.shadowColor} transform group-hover:scale-110 transition-transform duration-300`}>
                 <mod.icon size={28} strokeWidth={1.5} />
              </div>

              {/* Text */}
              <div className="flex-1">
                 <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                    {mod.title}
                    <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                 </h3>
                 <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-600">
                    {mod.desc}
                 </p>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform rotate-12 scale-150 pointer-events-none">
               <mod.icon size={120} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderERReturnMonitor = () => {
    return (
      <div className="flex flex-col w-full bg-[#eef2f6] min-h-full">
        {/* Main Content Area */}
        <div className="px-6 pt-6 relative z-10 flex flex-col gap-4 pb-6">
          
          {/* Tabs */}
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-lg w-fit">
              <button className="px-4 py-1.5 bg-white text-blue-600 shadow-sm rounded-md text-sm font-medium flex items-center gap-2">
                <BarChart3 size={16} />
                数据分析
              </button>
              <button className="px-4 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-md text-sm font-medium flex items-center gap-2 transition-all">
                <FileText size={16} />
                患者列表
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg p-3 shadow-sm flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center bg-gray-100 rounded p-1 flex-wrap">
              <button className="px-3 py-1 bg-blue-500 text-white rounded shadow-sm">近一年</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors">近6月</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors">近3月</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors">上月</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors">自定义</button>
            </div>
            
            <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 bg-white">
              <span className="text-gray-400">📅</span>
              <span className="text-gray-600">2025-03 - 2026-02</span>
            </div>
            
            <div className="flex items-center gap-4 ml-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="type" defaultChecked className="text-blue-500" />
                <span className="text-gray-700">全部</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="type" className="text-blue-500" />
                <span className="text-gray-700">门诊</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="type" className="text-blue-500" />
                <span className="text-gray-700">住院</span>
              </label>
            </div>
            
            <div className="ml-2 border border-gray-200 rounded px-3 py-1.5 bg-white flex items-center justify-between w-32 cursor-pointer hover:border-blue-300 transition-colors">
              <span className="text-gray-500">全部科室</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            
            <button className="ml-auto px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm transition-colors">
              重置
            </button>
          </div>

          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-50 to-transparent"></div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 relative z-10">
                <FileText size={32} />
              </div>
              <div className="relative z-10">
                <div className="text-gray-500 text-sm mb-1">病例总数</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-800">20</span>
                  <span className="text-sm text-gray-500">人次</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-50 to-transparent"></div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 relative z-10">
                <FileText size={32} />
              </div>
              <div className="relative z-10">
                <div className="text-gray-500 text-sm mb-1">来源门诊病例数</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-800">15</span>
                  <span className="text-sm text-gray-500">人次</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-50 to-transparent"></div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 relative z-10">
                <FileText size={32} />
              </div>
              <div className="relative z-10">
                <div className="text-gray-500 text-sm mb-1">来源住院病例数</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-800">5</span>
                  <span className="text-sm text-gray-500">人次</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-gray-500 text-sm mb-2">当日总数</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-800">0</span>
                  <span className="text-sm text-gray-500">人次</span>
                </div>
                <div className="text-xs text-gray-400">实时更新：2026-03-05 11:45</div>
              </div>
              <div className="relative z-10 opacity-80">
                <div className="w-24 h-20 bg-blue-50 rounded-lg transform rotate-12 flex items-center justify-center border border-blue-100 shadow-sm">
                   <Activity className="text-blue-300" size={32} />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Chart 1: 年龄分布 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <h3 className="text-base font-bold text-gray-800 mb-4">年龄分布</h3>
              <div className="flex-1 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={[
                        { name: '0-18', value: 12, color: '#3b82f6' },
                        { name: '19-44', value: 0, color: '#4ade80' },
                        { name: '45-64', value: 0, color: '#60a5fa' },
                        { name: '65-74', value: 8, color: '#f59e0b' },
                        { name: '>=75', value: 0, color: '#e5e7eb' },
                      ]}
                      cx="40%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {
                        [
                          { name: '0-18', value: 12, color: '#3b82f6' },
                          { name: '19-44', value: 0, color: '#4ade80' },
                          { name: '45-64', value: 0, color: '#60a5fa' },
                          { name: '65-74', value: 8, color: '#f59e0b' },
                          { name: '>=75', value: 0, color: '#e5e7eb' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-xs text-gray-500">总</div>
                  <div className="text-2xl font-bold text-gray-800">20</div>
                </div>
                
                {/* Custom Legend */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                  {[
                    { name: '0-18', color: '#3b82f6' },
                    { name: '19-44', color: '#4ade80' },
                    { name: '45-64', color: '#60a5fa' },
                    { name: '65-74', color: '#f59e0b' },
                    { name: '>=75', color: '#e5e7eb' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: 重返急诊间隔时间分布 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-800">重返急诊间隔时间分布</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-3 h-1 bg-blue-500"></div>
                  <span>间隔时间</span>
                </div>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: '0-3', value: 17 },
                      { name: '3-7', value: 0 },
                      { name: '7-14', value: 0 },
                      { name: '14-30', value: 3 },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="value" fill="#60a5fa" barSize={20} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: 急诊分级分布 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <h3 className="text-base font-bold text-gray-800 mb-4">急诊分级分布</h3>
              <div className="flex-1 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={[
                        { name: '一级', value: 0, color: '#ef4444' },
                        { name: '二级', value: 25, color: '#f97316' },
                        { name: '三级', value: 50, color: '#eab308' },
                        { name: '四级', value: 25, color: '#22c55e' },
                      ]}
                      cx="40%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {
                        [
                          { name: '一级', value: 0, color: '#ef4444' },
                          { name: '二级', value: 25, color: '#f97316' },
                          { name: '三级', value: 50, color: '#eab308' },
                          { name: '四级', value: 25, color: '#22c55e' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
                
                {/* Custom Legend */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                  {[
                    { name: '一级', value: '0.0%', color: '#ef4444' },
                    { name: '二级', value: '25.0%', color: '#f97316' },
                    { name: '三级', value: '50.0%', color: '#eab308' },
                    { name: '四级', value: '25.0%', color: '#22c55e' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 w-12">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-600 w-10 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 4: 反馈结果分类 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <h3 className="text-base font-bold text-gray-800 mb-4">反馈结果分类</h3>
              <div className="flex-1 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={[
                        { name: '常规就诊', value: 50, color: '#38bdf8' },
                        { name: '因并发症重返急诊', value: 50, color: '#3b82f6' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {
                        [
                          { name: '常规就诊', value: 50, color: '#38bdf8' },
                          { name: '因并发症重返急诊', value: 50, color: '#3b82f6' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
                
                {/* Custom Labels for Donut */}
                <div className="absolute top-4 left-10 text-xs text-gray-600">
                  <div>常规就诊</div>
                  <div className="text-blue-400">0%</div>
                </div>
                <div className="absolute bottom-4 right-10 text-xs text-gray-600 text-right">
                  <div>因并发症重返急诊</div>
                  <div className="text-blue-500">0%</div>
                </div>
              </div>
            </div>

            {/* Chart 5: 月度总病例数 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-800">月度总病例数</h3>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div>感染科</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-sky-400 rounded-sm"></div>皮肤科</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded-sm"></div>消化内科</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400 rounded-sm"></div>呼吸内科</div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <ChevronLeft size={14} className="cursor-pointer hover:text-gray-600" />
                    <span>1/3</span>
                    <ChevronRight size={14} className="cursor-pointer hover:text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: '2025-06', d1: 1, d2: 1, d3: 1, d4: 1, d5: 0, d6: 0 },
                      { name: '2025-05', d1: 1, d2: 1, d3: 2, d4: 1, d5: 1, d6: 1 },
                      { name: '2025-04', d1: 0, d2: 1, d3: 1, d4: 1, d5: 1, d6: 1 },
                    ]}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="d1" stackId="a" fill="#3b82f6" barSize={24} />
                    <Bar dataKey="d2" stackId="a" fill="#38bdf8" />
                    <Bar dataKey="d3" stackId="a" fill="#4ade80" />
                    <Bar dataKey="d4" stackId="a" fill="#f97316" />
                    <Bar dataKey="d5" stackId="a" fill="#f472b6" />
                    <Bar dataKey="d6" stackId="a" fill="#a78bfa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 6: 关联主要诊断分布 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
              <h3 className="text-base font-bold text-gray-800 mb-4">关联主要诊断分布</h3>
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-7 grid-rows-5 gap-0.5 h-full w-full text-[10px] sm:text-xs">
                  {/* Row 1 */}
                  <div className="col-span-2 row-span-2 bg-[#f59e0b] text-white flex items-center justify-center text-center p-1">偏头痛</div>
                  <div className="col-span-1 row-span-1 bg-[#d9f99d] text-gray-700 flex items-center justify-center text-center p-1">腰椎间盘...</div>
                  <div className="col-span-1 row-span-1 bg-[#fbcfe8] text-gray-700 flex items-center justify-center text-center p-1">不稳...</div>
                  <div className="col-span-1 row-span-1 bg-[#d8b4fe] text-white flex items-center justify-center text-center p-1">重症...</div>
                  <div className="col-span-1 row-span-1 bg-[#a855f7] text-white flex items-center justify-center text-center p-1">癫痫</div>
                  <div className="col-span-1 row-span-1 bg-[#a7f3d0] text-gray-700 flex items-center justify-center text-center p-1">急性...</div>
                  
                  {/* Row 2 */}
                  <div className="col-span-1 row-span-1 bg-[#c4b5fd] text-white flex items-center justify-center text-center p-1">心律失常</div>
                  <div className="col-span-1 row-span-1 bg-[#bae6fd] text-gray-700 flex items-center justify-center text-center p-1">COPD急性...</div>
                  <div className="col-span-1 row-span-2 bg-[#2dd4bf] text-white flex items-center justify-center text-center p-1">急性心...</div>
                  <div className="col-span-1 row-span-2 bg-[#bfdbfe] text-gray-700 flex items-center justify-center text-center p-1">病毒性...</div>

                  {/* Row 3 */}
                  <div className="col-span-2 row-span-1 bg-[#6ee7b7] text-white flex items-center justify-center text-center p-1">急性肾盂肾炎</div>
                  <div className="col-span-1 row-span-1 bg-[#fde047] text-gray-700 flex items-center justify-center text-center p-1">急性荨麻疹</div>
                  <div className="col-span-1 row-span-1 bg-[#7dd3fc] text-gray-700 flex items-center justify-center text-center p-1">前臂骨折</div>

                  {/* Row 4 */}
                  <div className="col-span-2 row-span-1 bg-[#e879f9] text-white flex items-center justify-center text-center p-1">热射病</div>
                  <div className="col-span-1 row-span-1 bg-[#34d399] text-white flex items-center justify-center text-center p-1">急性阑尾炎</div>
                  <div className="col-span-1 row-span-1 bg-[#38bdf8] text-white flex items-center justify-center text-center p-1">细菌性痢疾</div>
                  <div className="col-span-1 row-span-1 bg-[#93c5fd] text-white flex items-center justify-center text-center p-1">急性胃...</div>
                  <div className="col-span-1 row-span-1 bg-[#60a5fa] text-white flex items-center justify-center text-center p-1">社区获...</div>

                  {/* Row 5 */}
                  <div className="col-span-2 row-span-1 bg-[#f1f5f9] text-gray-700 flex items-center justify-center text-center p-1">踝关节扭伤</div>
                  <div className="col-span-1 row-span-1 bg-[#34d399] text-white flex items-center justify-center text-center p-1">急性阑尾炎</div>
                  <div className="col-span-2 row-span-1 bg-[#38bdf8] text-white flex items-center justify-center text-center p-1">细菌性痢疾</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const renderEmergencyRealtime = () => (
    <div className="space-y-6">
      {/* Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '当前候诊总人数', value: '142', unit: '人', trend: '较平时 +45%', isWarning: true, icon: Users },
          { label: '预计最长等候', value: '85', unit: '分钟', trend: '超阈值 25 分钟', isWarning: true, icon: Hourglass },
          { label: '今日累计接诊', value: '856', unit: '人次', trend: '较昨日同时段 +12%', isWarning: false, icon: Activity },
          { label: '抢救室空床数', value: '1', unit: '张', trend: '使用率 95%', isWarning: true, icon: AlertCircle },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`p-5 rounded-xl border shadow-sm ${kpi.isWarning ? 'bg-rose-50 border-rose-200' : 'bg-white border-gray-100'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className={`text-sm font-medium ${kpi.isWarning ? 'text-rose-700' : 'text-gray-500'}`}>{kpi.label}</div>
                <Icon size={18} className={kpi.isWarning ? 'text-rose-500' : 'text-blue-500'} />
              </div>
              <div className="flex items-end gap-2">
                <div className={`text-3xl font-bold ${kpi.isWarning ? 'text-rose-700' : 'text-gray-900'}`}>{kpi.value}</div>
                <div className={`text-sm mb-1 ${kpi.isWarning ? 'text-rose-600' : 'text-gray-500'}`}>{kpi.unit}</div>
              </div>
              <div className={`text-xs font-medium mt-2 flex items-center gap-1 ${kpi.isWarning ? 'text-rose-600' : 'text-gray-500'}`}>
                {kpi.trend}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 分诊进度与患者流向 */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Filter size={18} className="text-blue-600" />
            实时分诊级别分布
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { level: 'I级 (濒危)', count: 3, color: '#ef4444' },
                { level: 'II级 (危重)', count: 12, color: '#f97316' },
                { level: 'III级 (急症)', count: 58, color: '#eab308' },
                { level: 'IV级 (非急症)', count: 69, color: '#22c55e' },
              ]} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="level" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} width={80} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" name="候诊人数" radius={[0, 4, 4, 0]} barSize={24}>
                  {
                    [
                      { level: 'I级 (濒危)', count: 3, color: '#ef4444' },
                      { level: 'II级 (危重)', count: 12, color: '#f97316' },
                      { level: 'III级 (急症)', count: 58, color: '#eab308' },
                      { level: 'IV级 (非急症)', count: 69, color: '#22c55e' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                  }
                  <LabelList dataKey="count" position="right" fill="#6b7280" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 各诊室实时压力 */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-rose-600" />
            各诊室实时候诊压力
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { room: '急诊内科', waiting: 68, doctors: 3 },
                { room: '急诊外科', waiting: 25, doctors: 2 },
                { room: '儿科急诊', waiting: 42, doctors: 2 },
                { room: '发热门诊', waiting: 15, doctors: 1 },
                { room: '急诊妇产', waiting: 8, doctors: 1 },
                { room: '急诊眼科', waiting: 4, doctors: 1 },
              ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="room" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any, name: any) => [value, name === 'waiting' ? '候诊人数' : '出诊医生数']}
                />
                <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '拥挤阈值 (30人)', fill: '#ef4444', fontSize: 12 }} />
                <Bar dataKey="waiting" name="候诊人数" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32}>
                  {
                    [
                      { room: '急诊内科', waiting: 68, doctors: 3 },
                      { room: '急诊外科', waiting: 25, doctors: 2 },
                      { room: '儿科急诊', waiting: 42, doctors: 2 },
                      { room: '发热门诊', waiting: 15, doctors: 1 },
                      { room: '急诊妇产', waiting: 8, doctors: 1 },
                      { room: '急诊眼科', waiting: 4, doctors: 1 },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.waiting > 30 ? '#ef4444' : '#3b82f6'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 智能调度与行动项 */}
      <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={18} className="text-rose-600" />
            智能调度建议 (AI 实时生成)
          </h3>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">急诊内科候诊严重积压</h4>
                <p className="text-sm text-gray-700">
                  当前急诊内科候诊 68 人，仅 3 名医生出诊，预计最长等候时间将超过 85 分钟。
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-rose-800 bg-rose-100 px-2 py-1 rounded">调度建议</span>
                  <span className="text-sm text-gray-600">建议立即从住院部心血管内科、呼吸内科各抽调 1 名二线医生前往急诊内科支援。</span>
                </div>
              </div>
            </div>
            <button className="shrink-0 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2">
              <User size={16} />
              一键发送调度指令
            </button>
          </div>
          
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">儿科急诊压力上升预警</h4>
                <p className="text-sm text-gray-700">
                  儿科急诊候诊 42 人，已超拥挤阈值。当前为流感高发期，预计夜间就诊量将持续增加。
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded">调度建议</span>
                  <span className="text-sm text-gray-600">建议通知儿科病房备班医生做好支援准备，并增开 1 个儿科急诊诊室。</span>
                </div>
              </div>
            </div>
            <button className="shrink-0 px-4 py-2 bg-white border border-amber-300 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-2">
              <ArrowUpDown size={16} />
              预警通知科室
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyHistory = () => (
    <div className="space-y-6">
      {/* Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '急诊人次数', value: '13,560', unit: '人次', trend: '+5.2%', isPositive: false },
          { label: '抢救室平均滞留时间', value: '3.5', unit: '小时', trend: '-12%', isPositive: true },
          { label: '胸痛D2W时间', value: '65', unit: '分钟', trend: '-5%', isPositive: true },
          { label: '急诊转住院率', value: '18.5', unit: '%', trend: '+1.2%', isPositive: true },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-2">{kpi.label}</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
              <div className="text-sm text-gray-500 mb-1">{kpi.unit}</div>
            </div>
            <div className={`text-xs font-medium mt-2 flex items-center gap-1 ${kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              <TrendingUp size={14} className={kpi.isPositive ? 'rotate-180' : ''} />
              较上期 {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* 急诊人次数趋势 */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={18} className="text-blue-600" />
          急诊人次数趋势 (最近一个月)
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { date: '1日', current: 420, previous: 380 },
              { date: '4日', current: 450, previous: 410 },
              { date: '7日', current: 410, previous: 430 },
              { date: '10日', current: 520, previous: 460 },
              { date: '13日', current: 490, previous: 450 },
              { date: '16日', current: 460, previous: 440 },
              { date: '19日', current: 470, previous: 420 },
              { date: '22日', current: 510, previous: 480 },
              { date: '25日', current: 530, previous: 490 },
              { date: '28日', current: 460, previous: 450 },
              { date: '30日', current: 440, previous: 410 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="current" name="本期人次数" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="previous" name="同期人次数" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 滞留时间分析 */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-blue-600" />
            急诊各区域平均滞留时间趋势
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { time: '1日', resus: 4.2, obs: 24, normal: 1.5 },
                { time: '5日', resus: 3.8, obs: 22, normal: 1.4 },
                { time: '10日', resus: 4.5, obs: 26, normal: 1.8 },
                { time: '15日', resus: 3.5, obs: 20, normal: 1.2 },
                { time: '20日', resus: 3.2, obs: 18, normal: 1.1 },
                { time: '25日', resus: 3.6, obs: 21, normal: 1.3 },
                { time: '30日', resus: 3.4, obs: 19, normal: 1.2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="resus" name="抢救室(h)" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="obs" name="留观室(h)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="normal" name="普通急诊(h)" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 绿色通道达标率 */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-emerald-600" />
            三大中心绿色通道达标率
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: '胸痛中心(D2W<90m)', rate: 92, target: 90 },
                { name: '卒中中心(DNT<60m)', rate: 85, target: 80 },
                { name: '创伤中心(严重创伤救治)', rate: 88, target: 85 },
              ]} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="rate" name="实际达标率(%)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                <Bar dataKey="target" name="目标值(%)" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 落地建议与行动项 */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-500" />
          智能诊断与落地建议
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-4">
            <div className="mt-0.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">抢救室滞留时间存在周期性波动</h4>
              <p className="text-sm text-gray-700 mb-2">
                分析发现，每月 10 日左右抢救室滞留时间明显上升（峰值 4.5 小时）。经下钻分析，主要原因为该时段重症患者转入 ICU 的床位周转不畅。
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded">行动建议</span>
                <span className="text-sm text-gray-600">建议医务处协调重症医学科，在每月上旬预留 1-2 张应急床位，或建立急诊-ICU快速流转绿色通道。</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-4">
            <div className="mt-0.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">卒中中心 DNT 达标率稳步提升</h4>
              <p className="text-sm text-gray-700 mb-2">
                本月卒中中心 DNT 达标率达到 85%，超过目标值 5 个百分点。主要得益于上月实施的“急诊CT优先叫号”策略。
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded">行动建议</span>
                <span className="text-sm text-gray-600">建议将此流程固化为标准化制度，并在胸痛中心推广类似的影像检查优先策略。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyTheme = () => {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {activeEmergencyTab === 'realtime' ? '急诊实时调度大屏' : '急诊历史运行分析'}
              {activeEmergencyTab === 'realtime' && (
                <>
                  <span className="flex h-3 w-3 relative ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-normal text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">Live</span>
                </>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeEmergencyTab === 'realtime' 
                ? '实时监控患者流量与诊室压力，支持一键资源调度，有效缩短等候时间'
                : '聚焦急诊长期运行效率与医疗质量趋势，辅助流程优化与资源调配'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeEmergencyTab === 'realtime' ? (
              <>
                <span className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14}/> 数据更新于刚刚</span>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <RefreshCw size={16} />
                  手动刷新
                </button>
              </>
            ) : (
              <>
                <select className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>本月</option>
                  <option>上月</option>
                  <option>本季度</option>
                  <option>本年度</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <FileText size={16} />
                  生成分析报告
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveEmergencyTab('realtime')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeEmergencyTab === 'realtime'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            实时监测
          </button>
          <button
            onClick={() => setActiveEmergencyTab('history')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeEmergencyTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            历史回看
          </button>
        </div>

        {activeEmergencyTab === 'realtime' ? renderEmergencyRealtime() : renderEmergencyHistory()}
      </div>
    );
  };

  const renderPharmacyTheme = () => (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            药学主题分析大屏
            {activePharmacyTab === 'monitoring' && (
              <>
                <span className="flex h-3 w-3 relative ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Live</span>
              </>
            )}
          </h2>
          <p className="text-sm text-gray-500 mt-1">抗菌药物使用、处方结构分析及药房实时运营监控</p>
        </div>
        <div className="flex items-center gap-3">
          {activePharmacyTab === 'monitoring' ? (
            <>
              <span className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14}/> 数据更新于刚刚</span>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                手动刷新
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-50 text-blue-600">本月</button>
                <button className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50">上月</button>
                <button className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50">本年</button>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <FileText size={16} />
                生成分析报告
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activePharmacyTab === 'antibacterial' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActivePharmacyTab('antibacterial')}
        >
          抗菌药物与合理用药
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activePharmacyTab === 'prescription' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActivePharmacyTab('prescription')}
        >
          门诊处方结构分析
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activePharmacyTab === 'monitoring' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActivePharmacyTab('monitoring')}
        >
          药房运营监控
        </button>
      </div>

      {/* Tab Content */}
      {activePharmacyTab === 'antibacterial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1">
              <div className="text-sm text-gray-500 mb-2">住院DDDs抗菌药物使用强度</div>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold text-gray-900">38.5</div>
                <div className="text-sm text-gray-500 mb-1">DDDs</div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">同比 (YoY)</span>
                  <span className="text-emerald-600 font-medium flex items-center"><TrendingUp size={14} className="rotate-180 mr-1"/> 2.4%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">环比 (MoM)</span>
                  <span className="text-emerald-600 font-medium flex items-center"><TrendingUp size={14} className="rotate-180 mr-1"/> 1.1%</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
                  <span className="text-gray-500">目标值</span>
                  <span className="text-gray-900 font-medium">&lt; 40.0</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-2">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={18} className="text-blue-600" />
                住院DDDs抗菌药物使用强度趋势
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: '1月', ddds: 39.2 },
                    { month: '2月', ddds: 38.8 },
                    { month: '3月', ddds: 39.5 },
                    { month: '4月', ddds: 38.1 },
                    { month: '5月', ddds: 37.9 },
                    { month: '6月', ddds: 38.5 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis domain={[35, 45]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <ReferenceLine y={40} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '目标线 (40)', fill: '#ef4444', fontSize: 12 }} />
                    <Line type="monotone" dataKey="ddds" name="使用强度" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-600" />
                抗菌药物处方数与金额趋势
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> 处方数 (张)</span>
                <span className="flex items-center gap-1 ml-3"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> 金额 (万元)</span>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { date: '1日', count: 120, amount: 1.5 },
                  { date: '5日', count: 135, amount: 1.8 },
                  { date: '10日', count: 110, amount: 1.4 },
                  { date: '15日', count: 145, amount: 2.1 },
                  { date: '20日', count: 125, amount: 1.6 },
                  { date: '25日', count: 150, amount: 2.3 },
                  { date: '30日', count: 130, amount: 1.7 },
                ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#ef4444" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar yAxisId="left" dataKey="count" name="处方数" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                  <Line yAxisId="right" type="monotone" dataKey="amount" name="金额(万元)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activePharmacyTab === 'prescription' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart size={18} className="text-blue-600" />
                门诊处方数结构
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: '1月', western: 12000, patent: 4000, herbal: 2500 },
                    { month: '2月', western: 11500, patent: 3800, herbal: 2200 },
                    { month: '3月', western: 13000, patent: 4500, herbal: 2800 },
                    { month: '4月', western: 12500, patent: 4200, herbal: 2600 },
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="western" name="西药处方" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="patent" name="中成药处方" stackId="a" fill="#10b981" />
                    <Bar dataKey="herbal" name="中药饮片处方" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-emerald-600" />
                门诊处方金额结构
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: '1月', western: 180, patent: 60, herbal: 40 },
                    { month: '2月', western: 175, patent: 58, herbal: 38 },
                    { month: '3月', western: 195, patent: 68, herbal: 45 },
                    { month: '4月', western: 185, patent: 65, herbal: 42 },
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip formatter={(value: any) => `${value} 万元`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="western" name="西药金额(万)" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="patent" name="中成药金额(万)" stackId="a" fill="#10b981" />
                    <Bar dataKey="herbal" name="中药饮片金额(万)" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-2">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FlaskConical size={18} className="text-purple-600" />
                中药制剂 / 中药颗粒 使用情况
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '中药制剂', count: 1250, amount: 15.2 },
                    { name: '中药颗粒', count: 850, amount: 12.5 },
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#ec4899" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar yAxisId="left" dataKey="count" name="处方数" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar yAxisId="right" dataKey="amount" name="金额(万元)" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 flex flex-col">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Check size={18} className="text-emerald-600" />
                国家基本药物使用占比
              </h3>
              <div className="flex-1 flex flex-col justify-center">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={[
                          { name: '基本药物', value: 65, color: '#10b981' },
                          { name: '非基本药物', value: 35, color: '#e5e7eb' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        {
                          [
                            { name: '基本药物', value: 65, color: '#10b981' },
                            { name: '非基本药物', value: 35, color: '#e5e7eb' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Pie>
                      <Tooltip formatter={(value: any) => `${value}%`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-12">
                    <span className="text-3xl font-bold text-gray-900">65%</span>
                    <span className="text-xs text-gray-500">处方数占比</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">处方数</div>
                    <div className="text-lg font-bold text-gray-900">8,900</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">金额(万元)</div>
                    <div className="text-lg font-bold text-emerald-600">120.5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePharmacyTab === 'monitoring' && (
        <div className="space-y-6 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-100 text-gray-800 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px]"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 blur-[100px]"></div>
          </div>

          <div className="relative z-10 flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              药房实时运营指挥舱
            </h3>
            <div className="flex items-center gap-2 text-blue-600 text-sm font-mono bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              SYSTEM ONLINE // {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {/* KPI 1 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform origin-left scale-x-100 transition-transform"></div>
              <div className="text-sm text-gray-500 mb-2">当前总排队人数</div>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-mono font-bold text-blue-600">40</div>
                <div className="text-sm text-gray-500 mb-1">人</div>
              </div>
              <div className="text-xs text-blue-500 mt-2 flex items-center"><TrendingUp size={14} className="mr-1"/> 较过去1小时增加 12 人</div>
            </div>
            {/* KPI 2 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
              <div className="text-sm text-gray-500 mb-2">当日发药处方数</div>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-mono font-bold text-emerald-600">1,002</div>
                <div className="text-sm text-gray-500 mb-1">单</div>
              </div>
              <div className="text-xs text-emerald-500 mt-2 flex items-center"><TrendingUp size={14} className="mr-1"/> 较昨日同期 +5%</div>
            </div>
            {/* KPI 3 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400"></div>
              <div className="text-sm text-gray-500 mb-2">当日发药金额</div>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-mono font-bold text-purple-600">28.5</div>
                <div className="text-sm text-gray-500 mb-1">万元</div>
              </div>
              <div className="text-xs text-purple-500 mt-2 flex items-center"><TrendingUp size={14} className="mr-1"/> 较昨日同期 +2%</div>
            </div>
          </div>

          <div className="relative z-10">
            {/* Windows Grid */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Layers size={16} />
                各窗口实时负载监控
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { window: '1号窗口 (西药)', queue: 12, workload: 345, status: 'busy', maxQueue: 15, waitTime: '18 min' },
                  { window: '2号窗口 (西药)', queue: 8, workload: 312, status: 'normal', maxQueue: 15, waitTime: '10 min' },
                  { window: '3号窗口 (中成药)', queue: 5, workload: 189, status: 'normal', maxQueue: 15, waitTime: '6 min' },
                  { window: '4号窗口 (中药饮片)', queue: 15, workload: 156, status: 'busy', maxQueue: 15, waitTime: '25 min' },
                  { window: '5号窗口 (急诊用药)', queue: 3, workload: 210, status: 'normal', maxQueue: 10, waitTime: '3 min' },
                  { window: '6号窗口 (慢性病)', queue: 14, workload: 420, status: 'busy', maxQueue: 20, waitTime: '20 min' },
                  { window: '7号窗口 (特病用药)', queue: 2, workload: 85, status: 'normal', maxQueue: 10, waitTime: '2 min' },
                  { window: '8号窗口 (综合咨询)', queue: 6, workload: 120, status: 'normal', maxQueue: 10, waitTime: '8 min' },
                ].map((w, idx) => (
                  <div key={idx} className={`bg-white p-4 rounded-xl border ${w.status === 'busy' ? 'border-rose-200 shadow-[0_4px_15px_rgba(244,63,94,0.05)]' : 'border-gray-100 shadow-sm'} transition-all`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-gray-900 font-bold">{w.window}</div>
                        <div className="text-xs text-gray-500 mt-1">预计等候: <span className={w.status === 'busy' ? 'text-rose-500 font-medium' : 'text-blue-500 font-medium'}>{w.waitTime}</span></div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-mono border ${w.status === 'busy' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                        {w.status === 'busy' ? '高负载' : '正常'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">排队人数</span>
                        <span className="font-mono text-gray-700 font-medium">{w.queue} / {w.maxQueue}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200/50">
                        <div 
                          className={`h-full rounded-full relative ${w.status === 'busy' ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`} 
                          style={{ width: `${(w.queue / w.maxQueue) * 100}%` }}
                        >
                          <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-[pulse_2s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                      <span className="text-gray-500">累计处理单量</span>
                      <span className="font-mono text-gray-700 font-medium">{w.workload} 单</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUltrasoundTheme = () => {
    const getUltrasoundData = (campus: string) => {
      const multipliers: Record<string, number> = {
        '全部': 1,
        '天河': 0.5,
        '同德': 0.3,
        '珠玑': 0.2
      };
      const m = multipliers[campus] || 1;

      return {
        target: {
          completed: Math.round(12000 * m),
          total: Math.round(15000 * m),
          rate: 80,
        },
        cost: {
          equipment: Math.round(500 * m),
          consumables: Math.round(200 * m),
          personnel: Math.round(300 * m),
        },
        income: {
          total: Math.round(3500 * m),
          yoy: '+12%',
        },
        efficiency: {
          avgPerDoctor: Math.round(45 * (m === 1 ? 1 : (m * 2))),
          avgWaitTime: Math.round(25 * (m === 1 ? 1 : (m * 1.5))),
          reportTime: Math.round(30 * (m === 1 ? 1 : (m * 1.2))),
        }
      };
    };

    const data = getUltrasoundData(ultrasoundCampus);

    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* 1. 顶部：全局筛选区 */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">院区:</span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['全部', '天河', '同德', '珠玑'].map(campus => (
                <button
                  key={campus}
                  onClick={() => setUltrasoundCampus(campus)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    ultrasoundCampus === campus
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">时间范围:</span>
            <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <option>本月</option>
              <option>本周</option>
              <option>今日</option>
              <option>本年</option>
            </select>
          </div>
          
          <div className="ml-auto">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <FileText size={16} />
              导出报告
            </button>
          </div>
        </div>

        {/* 2. 核心指标卡区（KPI） */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '检查总量', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">检查总量</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.target.completed.toLocaleString()}</div>
              <div className="text-xs text-gray-500">人次</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 同比 +5.2%</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '总收入', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">总收入</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.income.total.toLocaleString()}</div>
              <div className="text-xs text-gray-500">万元</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 同比 {data.income.yoy}</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '平均检查时长', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">平均检查时长</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">8.5</div>
              <div className="text-xs text-gray-500">分钟</div>
            </div>
            <div className="text-xs font-medium mt-2 text-gray-500">较上月缩短 0.5 分钟</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '平均等候时长', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">平均等候时长</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">{data.efficiency.avgWaitTime}</div>
              <div className="text-xs text-gray-500">分钟</div>
            </div>
            <div className="text-xs font-medium mt-2 text-rose-500 flex items-center gap-1"><TrendingUp size={12}/> 较上月增加 2 分钟</div>
          </div>
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '报告及时率', type: 'kpi'})}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">报告及时率</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">95.8</div>
              <div className="text-xs text-gray-500">%</div>
            </div>
            <div className="text-xs font-medium mt-2 text-emerald-600">达标 (目标 &gt;95%)</div>
          </div>
        </div>

        {/* 3. 分析模块区（重点） - 6大模块 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 模块一：运营数据分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '运营数据分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              模块一：运营数据分析
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">检查量趋势</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: '1周', value: 2400 }, { name: '2周', value: 2600 },
                      { name: '3周', value: 2300 }, { name: '4周', value: 2800 },
                    ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">检查结构分布</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie data={[
                          { name: '腹部', value: 40, color: '#3b82f6' },
                          { name: '心脏', value: 30, color: '#10b981' },
                          { name: '妇产', value: 20, color: '#f59e0b' },
                          { name: '血管', value: 10, color: '#8b5cf6' },
                        ]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                          {
                            [
                              { name: '腹部', value: 40, color: '#3b82f6' },
                              { name: '心脏', value: 30, color: '#10b981' },
                              { name: '妇产', value: 20, color: '#f59e0b' },
                              { name: '血管', value: 10, color: '#8b5cf6' },
                            ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                          }
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">患者来源结构</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: '门诊', value: 60 },
                        { name: '住院', value: 25 },
                        { name: '体检', value: 15 },
                      ]} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={40} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 模块二：运营成本分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '运营成本分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChartIcon size={18} className="text-emerald-600" />
              模块二：运营成本分析
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">单次检查成本</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {((data.cost.equipment + data.cost.consumables + data.cost.personnel) * 10000 / data.target.completed).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">元/次</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">总成本</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(data.cost.equipment + data.cost.consumables + data.cost.personnel)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">万元</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">成本结构占比</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={[
                        { name: '人员薪酬', value: data.cost.personnel, color: '#f59e0b' },
                        { name: '设备折旧', value: data.cost.equipment, color: '#3b82f6' },
                        { name: '耗材成本', value: data.cost.consumables, color: '#10b981' },
                      ]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                        {
                          [
                            { name: '人员薪酬', value: data.cost.personnel, color: '#f59e0b' },
                            { name: '设备折旧', value: data.cost.equipment, color: '#3b82f6' },
                            { name: '耗材成本', value: data.cost.consumables, color: '#10b981' },
                          ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                        }
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块三：超声体检收入分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '超声体检收入分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-600" />
              模块三：超声体检收入分析
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">体检收入趋势</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { month: '1月', value: 120 }, { month: '2月', value: 100 },
                      { month: '3月', value: 150 }, { month: '4月', value: 180 },
                      { month: '5月', value: 160 }, { month: '6月', value: 210 },
                    ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">各检查项目收入分布</h4>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '腹部彩超', value: 85 },
                      { name: '甲状腺', value: 45 },
                      { name: '乳腺', value: 40 },
                      { name: '颈动脉', value: 30 },
                    ]} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块四：医生效率分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '医生效率分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={18} className="text-orange-500" />
              模块四：医生效率分析
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">医生工作量排名 (Top 5)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '张医生', value: 1250 },
                      { name: '李医生', value: 1180 },
                      { name: '王医生', value: 1050 },
                      { name: '赵医生', value: 980 },
                      { name: '陈医生', value: 920 },
                    ]} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={50} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-800 mb-1">最高/最低工作量差值</div>
                  <div className="text-2xl font-bold text-orange-600">330</div>
                  <div className="text-xs text-orange-700 mt-1">需关注排班均衡性</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-800 mb-1">平均检查时长</div>
                  <div className="text-2xl font-bold text-orange-600">8.5</div>
                  <div className="text-xs text-orange-700 mt-1">分钟/人次</div>
                </div>
              </div>
            </div>
          </div>

          {/* 模块五：服务质量分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '服务质量分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-teal-600" />
              模块五：服务质量分析
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">报告及时率</div>
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-teal-500" strokeDasharray="95.8, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">95.8%</div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">复检率</div>
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-rose-500" strokeDasharray="1.2, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">1.2%</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">阳性检出率趋势</h4>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: '1月', value: 15 }, { month: '2月', value: 16 },
                      { month: '3月', value: 14 }, { month: '4月', value: 17 },
                      { month: '5月', value: 15 }, { month: '6月', value: 18 },
                    ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块六：服务效率分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '服务效率分析', type: 'module'})}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              模块六：服务效率分析
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">各时段候诊人数分布 (高峰期分析)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '8:00', value: 20 }, { time: '9:00', value: 45 },
                      { time: '10:00', value: 60 }, { time: '11:00', value: 55 },
                      { time: '12:00', value: 15 }, { time: '14:00', value: 30 },
                      { time: '15:00', value: 50 }, { time: '16:00', value: 40 },
                      { time: '17:00', value: 10 },
                    ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorWait)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-sm text-indigo-800 mb-1">设备利用率</div>
                  <div className="text-2xl font-bold text-indigo-600">82%</div>
                  <div className="text-xs text-indigo-700 mt-1">计算公式: 实际检查时长/开机时长</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-sm text-indigo-800 mb-1">平均出报告时间</div>
                  <div className="text-2xl font-bold text-indigo-600">{data.efficiency.reportTime}</div>
                  <div className="text-xs text-indigo-700 mt-1">分钟/份</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderEndoscopyTheme = () => {
    const getEndoscopyData = (campus: string) => {
      const multipliers: Record<string, number> = {
        '全部': 1,
        '天河': 0.5,
        '同德': 0.3,
        '珠玑': 0.2
      };
      const m = multipliers[campus] || 1;

      return {
        target: {
          completed: Math.round(8500 * m),
          surgery: Math.round(1200 * m),
          treatment: Math.round(3400 * m),
          total: Math.round(10000 * m),
          rate: 85,
        },
        income: {
          total: Math.round(4200 * m),
          yoy: '+15%',
        },
        efficiency: {
          avgPerDoctor: Math.round(35 * (m === 1 ? 1 : (m * 2))),
          avgTreatmentPerDoctor: Math.round(12 * (m === 1 ? 1 : (m * 1.8))),
          avgSurgeryPerDoctor: Math.round(5 * (m === 1 ? 1 : (m * 1.5))),
          avgWaitTime: Math.round(45 * (m === 1 ? 1 : (m * 1.5))),
          examTime: Math.round(20 * (m === 1 ? 1 : (m * 1.2))),
          avgAppointmentWaitTime: (3.5 * (m === 1 ? 1 : (m * 1.1))).toFixed(1),
          sameDayWaitTime: Math.round(65 * (m === 1 ? 1 : (m * 1.3))),
        },
        quality: {
          painlessRatio: 68,
          complicationRate: 0.15,
          positiveRate: 42.5,
        }
      };
    };

    const data = getEndoscopyData(endoscopyCampus);

    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* 1. 顶部：全局筛选区 */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">院区:</span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['全部', '天河', '同德', '珠玑'].map(campus => (
                <button
                  key={campus}
                  onClick={() => setEndoscopyCampus(campus)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    endoscopyCampus === campus
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">时间范围:</span>
            <select 
              value={endoscopyDateRange}
              onChange={(e) => setEndoscopyDateRange(e.target.value)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option>本月</option>
              <option>本周</option>
              <option>今日</option>
              <option>本年</option>
            </select>
          </div>
          
          <div className="ml-auto flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <RotateCcw size={16} />
              重置
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Search size={16} />
              查询
            </button>
          </div>
        </div>

        {/* 2. 核心指标卡区（KPI） */}
        <div className="space-y-6">
          {/* 工作量与收入 */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Activity size={16} className="text-blue-500" />
              工作量与收入
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '检查量', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">检查量</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.target.completed.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">人次</div>
                </div>
                <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 同比 +8.5%</div>
              </div>
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '治疗量', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">治疗量</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.target.treatment.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">人次</div>
                </div>
                <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 同比 +9.1%</div>
              </div>
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '手术量', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">手术量</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.target.surgery.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">人次</div>
                </div>
                <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 同比 +12.3%</div>
              </div>
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '总收入', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">总收入</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.income.total.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">万元</div>
                </div>
                <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 同比 {data.income.yoy}</div>
              </div>
            </div>
          </div>

          {/* 效率指标 */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" />
              效率指标
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '医生人均检查量', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">医生人均检查量</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.efficiency.avgPerDoctor}</div>
                  <div className="text-xs text-gray-500">人次/天</div>
                </div>
                <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上月提升 3 人次</div>
              </div>
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '医生人均治疗量', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">医生人均治疗量</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.efficiency.avgTreatmentPerDoctor}</div>
                  <div className="text-xs text-gray-500">人次/天</div>
                </div>
                <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上月提升 1.5 人次</div>
              </div>
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '医生人均手术量', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">医生人均手术量</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.efficiency.avgSurgeryPerDoctor}</div>
                  <div className="text-xs text-gray-500">人次/天</div>
                </div>
                <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上月提升 0.8 人次</div>
              </div>
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '平均检查时长', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">平均检查时长</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.efficiency.examTime}</div>
                  <div className="text-xs text-gray-500">分钟</div>
                </div>
                <div className="text-xs font-medium mt-2 text-gray-500">较上月缩短 1.2 分钟</div>
              </div>
            </div>
          </div>

          {/* 患者体验与质量 */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Users size={16} className="text-purple-500" />
              患者体验与质量
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '检查预约等待时长', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">检查预约等待时长</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.efficiency.avgAppointmentWaitTime}</div>
                  <div className="text-xs text-gray-500">天</div>
                </div>
                <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上月缩短 0.5 天</div>
              </div>
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '当日报到至检查等待时长', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">当日报到至检查等待时长</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.efficiency.sameDayWaitTime}</div>
                  <div className="text-xs text-gray-500">分钟</div>
                </div>
                <div className="text-xs font-medium mt-2 text-rose-500 flex items-center gap-1"><TrendingUp size={12}/> 较上月增加 3 分钟</div>
              </div>
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '无痛占比', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">无痛占比</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.quality.painlessRatio}</div>
                  <div className="text-xs text-gray-500">%</div>
                </div>
                <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上月提升 4.5%</div>
              </div>
              <div 
                onClick={() => setDrillDownConfig({isOpen: true, title: '阳性率', type: 'kpi'})}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-sm font-medium text-gray-500 mb-1">阳性率</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">{data.quality.positiveRate}</div>
                  <div className="text-xs text-gray-500">%</div>
                </div>
                <div className="text-xs font-medium mt-2 text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> 较上月提升 1.2%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 分析模块区（重点） - 4大模块 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 模块一：运营概览 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '运营概览', type: 'module'})}
            className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Activity size={18} className="text-blue-600" />
                模块一：运营概览
              </h3>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg" onClick={(e) => e.stopPropagation()}>
                {['全院', '门诊', '住院'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setEndoscopyMod1Tab(tab)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${endoscopyMod1Tab === tab ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">工作量趋势</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: '1月', exam: 1800, examYoy: '+5.2%', examMom: '+2.1%', treatment: 720, treatmentYoy: '+8.1%', treatmentMom: '+1.5%', surgery: 250, surgeryYoy: '+12.3%', surgeryMom: '+4.2%' },
                        { name: '2月', exam: 2100, examYoy: '+6.1%', examMom: '+16.6%', treatment: 840, treatmentYoy: '+9.2%', treatmentMom: '+16.6%', surgery: 290, surgeryYoy: '+14.1%', surgeryMom: '+16.0%' },
                        { name: '3月', exam: 1950, examYoy: '+4.8%', examMom: '-7.1%', treatment: 780, treatmentYoy: '+7.5%', treatmentMom: '-7.1%', surgery: 270, surgeryYoy: '+11.5%', surgeryMom: '-6.8%' },
                        { name: '4月', exam: 2300, examYoy: '+8.5%', examMom: '+17.9%', treatment: 920, treatmentYoy: '+10.1%', treatmentMom: '+17.9%', surgery: 320, surgeryYoy: '+15.2%', surgeryMom: '+18.5%' },
                        { name: '5月', exam: 2450, examYoy: '+9.2%', examMom: '+6.5%', treatment: 980, treatmentYoy: '+11.2%', treatmentMom: '+6.5%', surgery: 350, surgeryYoy: '+16.5%', surgeryMom: '+9.3%' },
                        { name: '6月', exam: 2600, examYoy: '+10.5%', examMom: '+6.1%', treatment: 1050, treatmentYoy: '+12.5%', treatmentMom: '+7.1%', surgery: 380, surgeryYoy: '+18.2%', surgeryMom: '+8.5%' },
                      ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
                                  <p className="font-medium text-gray-900 mb-2">{label}</p>
                                  {payload.map((entry: any, index: number) => (
                                    <div key={index} className="mb-2 last:mb-0">
                                      <div className="flex items-center justify-between gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                          <span className="text-gray-600">{entry.name}</span>
                                        </div>
                                        <span className="font-bold text-gray-900">{entry.value}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs mt-1 pl-4">
                                        <span className={entry.payload[`${entry.dataKey}Yoy`].startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}>
                                          同比 {entry.payload[`${entry.dataKey}Yoy`]}
                                        </span>
                                        <span className={entry.payload[`${entry.dataKey}Mom`].startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}>
                                          环比 {entry.payload[`${entry.dataKey}Mom`]}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                        <Line name="检查量" type="monotone" dataKey="exam" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line name="治疗量" type="monotone" dataKey="treatment" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line name="手术量" type="monotone" dataKey="surgery" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="relative">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">收入趋势</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: '1月', exam: 450, examYoy: '+4.2%', examMom: '+1.1%', treatment: 320, treatmentYoy: '+6.1%', treatmentMom: '+2.5%', surgery: 180, surgeryYoy: '+10.3%', surgeryMom: '+3.2%' },
                        { name: '2月', exam: 520, examYoy: '+5.1%', examMom: '+15.5%', treatment: 380, treatmentYoy: '+8.2%', treatmentMom: '+18.7%', surgery: 200, surgeryYoy: '+12.1%', surgeryMom: '+11.1%' },
                        { name: '3月', exam: 480, examYoy: '+3.8%', examMom: '-7.6%', treatment: 360, treatmentYoy: '+5.5%', treatmentMom: '-5.2%', surgery: 210, surgeryYoy: '+9.5%', surgeryMom: '+5.0%' },
                        { name: '4月', exam: 550, examYoy: '+7.5%', examMom: '+14.5%', treatment: 410, treatmentYoy: '+9.1%', treatmentMom: '+13.8%', surgery: 240, surgeryYoy: '+14.2%', surgeryMom: '+14.2%' },
                        { name: '5月', exam: 600, examYoy: '+8.2%', examMom: '+9.0%', treatment: 460, treatmentYoy: '+10.2%', treatmentMom: '+12.1%', surgery: 290, surgeryYoy: '+15.5%', surgeryMom: '+20.8%' },
                        { name: '6月', exam: 650, examYoy: '+9.5%', examMom: '+8.3%', treatment: 510, treatmentYoy: '+11.5%', treatmentMom: '+10.8%', surgery: 340, surgeryYoy: '+17.2%', surgeryMom: '+17.2%' },
                      ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
                                  <p className="font-medium text-gray-900 mb-2">{label}</p>
                                  {payload.map((entry: any, index: number) => (
                                    <div key={index} className="mb-2 last:mb-0">
                                      <div className="flex items-center justify-between gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                          <span className="text-gray-600">{entry.name}</span>
                                        </div>
                                        <span className="font-bold text-gray-900">{entry.value}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs mt-1 pl-4">
                                        <span className={entry.payload[`${entry.dataKey}Yoy`].startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}>
                                          同比 {entry.payload[`${entry.dataKey}Yoy`]}
                                        </span>
                                        <span className={entry.payload[`${entry.dataKey}Mom`].startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}>
                                          环比 {entry.payload[`${entry.dataKey}Mom`]}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                        <Line name="检查收入" type="monotone" dataKey="exam" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line name="治疗收入" type="monotone" dataKey="treatment" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line name="手术收入" type="monotone" dataKey="surgery" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 模块二：收入与结构分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '收入与结构分析', type: 'module'})}
            className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <PieChartIcon size={18} className="text-emerald-600" />
                模块二：收入与结构分析
              </h3>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg" onClick={(e) => e.stopPropagation()}>
                {['全院', '门诊', '住院'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setEndoscopyMod2Tab(tab)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${endoscopyMod2Tab === tab ? 'bg-white text-emerald-600 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">收费类型分布 (按收入)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '检查', value: 1800 },
                      { name: '治疗', value: 1200 },
                      { name: '耗材', value: 800 },
                      { name: '手术', value: 600 },
                      { name: '病理', value: 400 },
                    ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">无痛 vs 普通占比 (按人次)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={[
                        { name: '无痛', value: 68, color: '#8b5cf6' },
                        { name: '普通', value: 32, color: '#9ca3af' },
                      ]} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                        {
                          [
                            { name: '无痛', value: 68, color: '#8b5cf6' },
                            { name: '普通', value: 32, color: '#9ca3af' },
                          ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                        }
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">手术分级占比 (按人次)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={[
                        { name: '一级手术', value: 15, color: '#9ca3af' },
                        { name: '二级手术', value: 35, color: '#3b82f6' },
                        { name: '三级手术', value: 40, color: '#f59e0b' },
                        { name: '四级手术', value: 10, color: '#ef4444' },
                      ]} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                        {
                          [
                            { name: '一级手术', value: 15, color: '#9ca3af' },
                            { name: '二级手术', value: 35, color: '#3b82f6' },
                            { name: '三级手术', value: 40, color: '#f59e0b' },
                            { name: '四级手术', value: 10, color: '#ef4444' },
                          ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                        }
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块三：医护人效分析 */}
          <div 
            className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-orange-500" />
                模块三：医护人效分析
              </h3>
              <button 
                onClick={() => setDrillDownConfig({isOpen: true, title: '医护人效分析', type: 'module'})}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600 flex items-center gap-1 text-xs font-normal"
                title="查看明细"
              >
                <FileText size={16} />
                <span>明细</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">医生检查量排名 (Top 5)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '张医生', value: 450 },
                      { name: '李医生', value: 420 },
                      { name: '王医生', value: 380 },
                      { name: '赵医生', value: 350 },
                      { name: '陈医生', value: 310 },
                    ]} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">医生治疗量排名 (Top 5)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '王医生', value: 120 },
                      { name: '张医生', value: 115 },
                      { name: '李医生', value: 108 },
                      { name: '陈医生', value: 95 },
                      { name: '赵医生', value: 88 },
                    ]} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">医生手术量排名 (Top 5)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '李医生', value: 45 },
                      { name: '赵医生', value: 38 },
                      { name: '王医生', value: 32 },
                      { name: '张医生', value: 28 },
                      { name: '陈医生', value: 20 },
                    ]} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">护士工作量排名 (Top 5)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '林护士', value: 520 },
                      { name: '周护士', value: 480 },
                      { name: '吴护士', value: 450 },
                      { name: '郑护士', value: 410 },
                      { name: '黄护士', value: 390 },
                    ]} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块四：服务效率分析 */}
          <div 
            onClick={() => setDrillDownConfig({isOpen: true, title: '服务效率分析', type: 'module'})}
            className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                模块四：服务效率分析
              </h3>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg" onClick={(e) => e.stopPropagation()}>
                {['全院', '门诊', '住院'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setEndoscopyMod4Tab(tab)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${endoscopyMod4Tab === tab ? 'bg-white text-indigo-600 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">预约等候时长趋势 (天)</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: '1周', value: 4.2 }, { name: '2周', value: 3.8 },
                        { name: '3周', value: 3.5 }, { name: '4周', value: 3.2 },
                      ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorApptWait" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorApptWait)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">预约等候时长分布 (天)</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: '<1天', value: 15 }, { name: '1-3天', value: 45 },
                        { name: '3-7天', value: 30 }, { name: '>7天', value: 10 },
                      ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">检查操作时长趋势 (分钟)</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: '1月', value: 22 }, { name: '2月', value: 21 },
                        { name: '3月', value: 20.5 }, { name: '4月', value: 20 },
                      ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 模块五：医疗质量与阳性率分析 */}
          <div 
            className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Target size={18} className="text-rose-500" />
                模块五：医疗质量与阳性率分析
              </h3>
              <button 
                onClick={() => setDrillDownConfig({isOpen: true, title: '医疗质量与阳性率分析', type: 'module'})}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600 flex items-center gap-1 text-xs font-normal"
                title="查看明细"
              >
                <FileText size={16} />
                <span>明细</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">胃肠镜阳性率趋势 (%)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: '1月', gastro: 35.2, entero: 42.1 },
                      { name: '2月', gastro: 36.1, entero: 43.5 },
                      { name: '3月', gastro: 34.8, entero: 41.2 },
                      { name: '4月', gastro: 37.5, entero: 44.8 },
                      { name: '5月', gastro: 38.2, entero: 45.2 },
                      { name: '6月', gastro: 39.5, entero: 46.5 },
                    ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Line name="胃镜阳性率" type="monotone" dataKey="gastro" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line name="肠镜阳性率" type="monotone" dataKey="entero" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">医生阳性率排名 (Top 5)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '张医生', value: 48.5 },
                      { name: '王医生', value: 45.2 },
                      { name: '李医生', value: 42.8 },
                      { name: '赵医生', value: 40.1 },
                      { name: '陈医生', value: 38.5 },
                    ]} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">阳性病变类型分布</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={[
                        { name: '息肉', value: 55, color: '#3b82f6' },
                        { name: '炎症', value: 25, color: '#10b981' },
                        { name: '溃疡', value: 12, color: '#f59e0b' },
                        { name: '肿瘤', value: 5, color: '#ef4444' },
                        { name: '其他', value: 3, color: '#9ca3af' },
                      ]} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                        {
                          [
                            { name: '息肉', value: 55, color: '#3b82f6' },
                            { name: '炎症', value: 25, color: '#10b981' },
                            { name: '溃疡', value: 12, color: '#f59e0b' },
                            { name: '肿瘤', value: 5, color: '#ef4444' },
                            { name: '其他', value: 3, color: '#9ca3af' },
                          ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                        }
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">活检送检率趋势 (%)</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: '1月', value: 82.5 }, { name: '2月', value: 84.1 },
                      { name: '3月', value: 83.2 }, { name: '4月', value: 86.5 },
                      { name: '5月', value: 88.0 }, { name: '6月', value: 91.2 },
                    ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBiopsy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorBiopsy)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 模块六：患者年龄与性别结构分析 */}
          <div 
            className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <User size={18} className="text-cyan-600" />
                模块六：患者年龄与性别结构分析
              </h3>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg" onClick={(e) => e.stopPropagation()}>
                {['全院', '门诊', '住院'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setEndoscopyMod6Tab(tab)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${endoscopyMod6Tab === tab ? 'bg-white text-cyan-600 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 检查组 */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-4 text-center border-b border-gray-200 pb-2">检查人群画像</h4>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-medium">年龄分布</div>
                    <div className="h-[140px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { age: '<18', value: 5 }, { age: '18-30', value: 15 },
                          { age: '31-50', value: 40 }, { age: '51-65', value: 30 }, { age: '>65', value: 10 }
                        ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                          <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={16} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-medium">性别比例</div>
                    <div className="h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie data={[
                            { name: '男', value: 55, color: '#3b82f6' },
                            { name: '女', value: 45, color: '#ec4899' },
                          ]} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value">
                            {
                              [
                                { name: '男', value: 55, color: '#3b82f6' },
                                { name: '女', value: 45, color: '#ec4899' },
                              ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                            }
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* 治疗组 */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-4 text-center border-b border-gray-200 pb-2">治疗人群画像</h4>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-medium">年龄分布</div>
                    <div className="h-[140px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { age: '<18', value: 2 }, { age: '18-30', value: 10 },
                          { age: '31-50', value: 35 }, { age: '51-65', value: 38 }, { age: '>65', value: 15 }
                        ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                          <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="value" fill="#10b981" radius={[2, 2, 0, 0]} barSize={16} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-medium">性别比例</div>
                    <div className="h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie data={[
                            { name: '男', value: 60, color: '#3b82f6' },
                            { name: '女', value: 40, color: '#ec4899' },
                          ]} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value">
                            {
                              [
                                { name: '男', value: 60, color: '#3b82f6' },
                                { name: '女', value: 40, color: '#ec4899' },
                              ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                            }
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* 手术组 */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-4 text-center border-b border-gray-200 pb-2">手术人群画像</h4>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-medium">年龄分布</div>
                    <div className="h-[140px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { age: '<18', value: 1 }, { age: '18-30', value: 8 },
                          { age: '31-50', value: 25 }, { age: '51-65', value: 45 }, { age: '>65', value: 21 }
                        ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                          <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="value" fill="#f59e0b" radius={[2, 2, 0, 0]} barSize={16} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-medium">性别比例</div>
                    <div className="h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie data={[
                            { name: '男', value: 65, color: '#3b82f6' },
                            { name: '女', value: 35, color: '#ec4899' },
                          ]} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value">
                            {
                              [
                                { name: '男', value: 65, color: '#3b82f6' },
                                { name: '女', value: 35, color: '#ec4899' },
                              ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                            }
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderPathologyTheme = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4">
          <div className="text-sm text-gray-500">全局筛选区 (病理科)</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="col-span-8 text-sm text-gray-500">核心指标区 (病理科)</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="col-span-2 text-sm text-gray-500">主分析区 (6大模块 - 病理科)</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">明细数据区 (病理科)</div>
        </div>
      </div>
    );
  };

  const renderThemeAnalysis = () => {
    const THEMES = [
      { id: 'emergency', name: '急诊主题分析', icon: Activity },
      { id: 'pharmacy', name: '药学主题分析', icon: Pill },
      { id: 'surgery', name: '手术主题分析', icon: Activity },
      { id: 'outpatient', name: '门诊主题分析', icon: Users },
      { id: 'inpatient', name: '住院主题分析', icon: Home },
      { id: 'ultrasound', name: '超声科主题分析', icon: Activity },
      { id: 'endoscopy', name: '内镜中心主题分析', icon: Activity },
      { id: 'pathology', name: '病理科主题分析', icon: Activity },
    ];

    return (
      <div className="flex h-full overflow-hidden bg-gray-50/30">
        {/* Left Sidebar - Theme Catalog */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">主题目录</h2>
          </div>
          <div className="p-2 space-y-1">
            {THEMES.map(theme => {
              const Icon = theme.icon;
              const isActive = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveThemeId(theme.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                  {theme.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeThemeId === 'emergency' ? renderEmergencyTheme() : 
           activeThemeId === 'pharmacy' ? renderPharmacyTheme() : 
           activeThemeId === 'ultrasound' ? renderUltrasoundTheme() : 
           activeThemeId === 'endoscopy' ? renderEndoscopyTheme() : 
           activeThemeId === 'pathology' ? renderPathologyTheme() : (
            <div className="flex items-center justify-center h-full text-gray-400">
              请选择左侧主题目录查看详情
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGenericDetail = () => {
    const activeModule = MODULES.find(m => m.id === activeModuleId);
    return (
      <div className="grid grid-cols-12 gap-6">
          {/* Top KPIs */}
          <div className="col-span-12 grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                 <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                    <div className="text-gray-500 text-xs font-medium mb-1">关键指标 {i}</div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-gray-800 tracking-tight">1,2{i}4.00</div>
                        <div className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium mb-1">
                           <TrendingUp size={10} />
                           <span>+5.{i}%</span>
                        </div>
                    </div>
                 </div>
              ))}
          </div>

          {/* Main Chart Area */}
          <div className="col-span-12 lg:col-span-9 bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] min-h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="font-bold text-gray-800 text-lg">{activeModule?.title} - 核心趋势</h3>
                    <p className="text-xs text-gray-400 mt-1">数据来源：全院集成平台 (T+1)</p>
                 </div>
                 <div className="flex bg-gray-100/50 p-1 rounded-lg">
                    <button className="px-3 py-1 text-xs font-medium bg-white text-gray-800 shadow-sm rounded-md">趋势图</button>
                    <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">分布图</button>
                    <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">明细表</button>
                 </div>
              </div>
              <div className="flex-1 flex items-center justify-center border border-dashed border-gray-100 rounded-lg bg-gray-50/30 text-gray-400 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="text-center">
                    <BarChart3 size={64} className="mx-auto mb-3 text-gray-200" />
                    <span className="text-gray-400">交互式数据可视化区域</span>
                    <div className="mt-4 flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                       <button className="px-3 py-1.5 border border-gray-200 bg-white rounded text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600">下钻分析</button>
                       <button className="px-3 py-1.5 border border-gray-200 bg-white rounded text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600">查看SQL</button>
                    </div>
                 </div>
              </div>
          </div>

          {/* Right Side Cards */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
              {/* Alert Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                     异常监控
                     <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">3</span>
                  </h3>
                  <div className="space-y-3">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-start gap-3 p-2.5 bg-gray-50/50 hover:bg-red-50/30 border border-transparent hover:border-red-100 rounded-lg transition-colors cursor-pointer group">
                           <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                           <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-800 group-hover:text-red-700 truncate">门诊量环比下降异常</div>
                              <div className="text-xs text-gray-400 mt-0.5">同比下降 15% • 心内科</div>
                           </div>
                           <ChevronRight size={14} className="text-gray-300 group-hover:text-red-400" />
                        </div>
                     ))}
                  </div>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-xl shadow-lg text-white flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Activity size={100} />
                  </div>
                  <h3 className="font-bold text-lg mb-1 relative z-10">智能洞察</h3>
                  <p className="text-blue-100 text-xs mb-4 relative z-10 leading-relaxed">
                     AI分析发现，本月手术耗材占比呈现下降趋势，主要受骨科集采政策落地影响。建议关注...
                  </p>
                  <button className="mt-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-medium py-2 rounded-lg transition-colors w-full relative z-10">
                     查看完整报告
                  </button>
              </div>
          </div>
      </div>
    );
  };

  const renderBloodCockpitContent = () => {
    const bloodInventoryData = [
      { name: 'A型', value: 350, fill: '#ef4444' }, // Red
      { name: 'B型', value: 280, fill: '#3b82f6' }, // Blue
      { name: 'O型', value: 420, fill: '#10b981' }, // Emerald
      { name: 'AB型', value: 120, fill: '#f97316' }, // Orange
    ];

    const plasmaInventoryData = [
      { name: 'A型', value: 250, fill: '#ef4444' }, // Red
      { name: 'B型', value: 180, fill: '#3b82f6' }, // Blue
      { name: 'O型', value: 320, fill: '#10b981' }, // Emerald
      { name: 'AB型', value: 90, fill: '#f97316' }, // Orange
    ];

    const cryoInventoryData = [
      { name: 'A型', value: 150, fill: '#ef4444' },
      { name: 'B型', value: 120, fill: '#3b82f6' },
      { name: 'O型', value: 200, fill: '#10b981' },
      { name: 'AB型', value: 50, fill: '#f97316' },
    ];

    const plateletInventoryData = [
      { name: 'A型', value: 80, fill: '#ef4444' },
      { name: 'B型', value: 60, fill: '#3b82f6' },
      { name: 'O型', value: 110, fill: '#10b981' },
      { name: 'AB型', value: 30, fill: '#f97316' },
    ];

    const bloodTypeDistData = [
      { name: 'A型', transfusion: 120, surgery: 80 },
      { name: 'B型', transfusion: 90, surgery: 60 },
      { name: 'O型', transfusion: 150, surgery: 110 },
      { name: 'AB型', transfusion: 40, surgery: 30 },
    ];

    const deptRankingRBC = [
      { dept: '重症医学科', value: 450 },
      { dept: '血液科', value: 320 },
      { dept: '急诊科', value: 280 },
      { dept: '心胸外科', value: 210 },
      { dept: '骨科', value: 150 },
    ];

    const deptRankingPlasma = [
      { dept: '重症医学科', value: 350 },
      { dept: '肝胆外科', value: 280 },
      { dept: '急诊科', value: 220 },
      { dept: '消化内科', value: 180 },
      { dept: '心胸外科', value: 120 },
    ];

    const deptRankingPlatelet = [
      { dept: '血液科', value: 150 },
      { dept: '重症医学科', value: 80 },
      { dept: '肿瘤科', value: 60 },
      { dept: '急诊科', value: 40 },
      { dept: '儿科', value: 20 },
    ];

    const deptRankingCryo = [
      { dept: '重症医学科', value: 120 },
      { dept: '急诊科', value: 90 },
      { dept: '产科', value: 60 },
      { dept: '心胸外科', value: 40 },
      { dept: '肝胆外科', value: 30 },
    ];

    return (
      <div className="flex flex-col gap-6 flex-shrink-0">
        {/* Row 1: 实时监控 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[320px] lg:col-span-4">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Activity className="text-rose-400" size={20} />
              实时监控
            </h3>
            <div className="flex flex-col justify-between flex-1 gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-slate-400 text-sm">实时库存 (U)</div>
                  <div className="text-[10px] text-slate-500 flex gap-2">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>总计</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>备血</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>活动</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-900/50 rounded py-2 px-1 border border-slate-800/50">
                    <div className="text-xs text-slate-400 mb-1 font-medium">A型</div>
                    <div className="font-bold text-rose-400 text-xl leading-none">350</div>
                    <div className="flex justify-between items-center text-[10px] bg-slate-950/50 rounded px-1 py-1 mt-2 mx-0.5">
                      <span className="text-slate-400 scale-90 origin-left whitespace-nowrap">备:50</span>
                      <span className="text-emerald-400 font-medium scale-90 origin-right whitespace-nowrap">活:300</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded py-2 px-1 border border-slate-800/50">
                    <div className="text-xs text-slate-400 mb-1 font-medium">B型</div>
                    <div className="font-bold text-rose-400 text-xl leading-none">280</div>
                    <div className="flex justify-between items-center text-[10px] bg-slate-950/50 rounded px-1 py-1 mt-2 mx-0.5">
                      <span className="text-slate-400 scale-90 origin-left whitespace-nowrap">备:40</span>
                      <span className="text-emerald-400 font-medium scale-90 origin-right whitespace-nowrap">活:240</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded py-2 px-1 border border-slate-800/50">
                    <div className="text-xs text-slate-400 mb-1 font-medium">O型</div>
                    <div className="font-bold text-rose-400 text-xl leading-none">420</div>
                    <div className="flex justify-between items-center text-[10px] bg-slate-950/50 rounded px-1 py-1 mt-2 mx-0.5">
                      <span className="text-slate-400 scale-90 origin-left whitespace-nowrap">备:80</span>
                      <span className="text-emerald-400 font-medium scale-90 origin-right whitespace-nowrap">活:340</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded py-2 px-1 border border-slate-800/50">
                    <div className="text-xs text-slate-400 mb-1 font-medium">AB型</div>
                    <div className="font-bold text-rose-400 text-xl leading-none">120</div>
                    <div className="flex justify-between items-center text-[10px] bg-slate-950/50 rounded px-1 py-1 mt-2 mx-0.5">
                      <span className="text-slate-400 scale-90 origin-left whitespace-nowrap">备:20</span>
                      <span className="text-emerald-400 font-medium scale-90 origin-right whitespace-nowrap">活:100</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 flex flex-col justify-center">
                  <div className="text-amber-400/80 text-xs mb-2">库存预警</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-amber-400">A型红细胞</span>
                      <span className="text-amber-400 font-medium">低于下限 (35U)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-amber-400">AB型血浆</span>
                      <span className="text-amber-400 font-medium">低于下限 (12U)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex flex-col justify-center">
                  <div className="text-red-400/80 text-xs mb-2">血液过期提醒 (近3天)</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-400 font-mono">B20260315001</span>
                      <span className="text-red-400">03-25</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-400 font-mono">B20260316023</span>
                      <span className="text-red-400">03-26</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[320px] lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-300 mb-2">红细胞库存分布</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={bloodInventoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2}>
                    {bloodInventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[320px] lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-300 mb-2">血浆库存分布</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={plasmaInventoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2}>
                    {plasmaInventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[320px] lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-300 mb-2">冷沉淀库存分布</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={cryoInventoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2}>
                    {cryoInventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[320px] lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-300 mb-2">血小板库存分布</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={plateletInventoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2}>
                    {plateletInventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 2: 科室用血 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px] lg:col-span-4">
            <h3 className="text-sm font-bold text-slate-300 mb-4">配发血比例 & 满足率</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                <div className="w-12 h-12 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={[{name: '已配血', value: 85}, {name: '未配血', value: 15}]} dataKey="value" cx="50%" cy="50%" innerRadius={16} outerRadius={24} startAngle={90} endAngle={-270} stroke="none">
                        <Cell fill="#3b82f6" />
                        <Cell fill="#1e293b" />
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 mb-0.5">配血比例</span>
                  <span className="text-xl font-bold text-blue-400 leading-none">85<span className="text-xs font-normal text-slate-500">%</span></span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                <div className="w-12 h-12 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={[{name: '已发血', value: 92}, {name: '未发血', value: 8}]} dataKey="value" cx="50%" cy="50%" innerRadius={16} outerRadius={24} startAngle={90} endAngle={-270} stroke="none">
                        <Cell fill="#10b981" />
                        <Cell fill="#1e293b" />
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 mb-0.5">发血比例</span>
                  <span className="text-xl font-bold text-emerald-400 leading-none">92<span className="text-xs font-normal text-slate-500">%</span></span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h4 className="text-xs text-slate-400 mb-3">申请与实际发血满足率</h4>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end text-xs">
                    <span className="text-slate-300">天河院区</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] text-slate-500">1150 / 1200 U</span>
                      <span className="text-emerald-400 font-bold">95.8%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '95.8%' }}></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end text-xs">
                    <span className="text-slate-300">珠玑院区</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] text-slate-500">708 / 800 U</span>
                      <span className="text-emerald-400 font-bold">88.5%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '88.5%' }}></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end text-xs">
                    <span className="text-slate-300">同德院区</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] text-slate-500">454 / 500 U</span>
                      <span className="text-emerald-400 font-bold">90.8%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '90.8%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px] lg:col-span-5">
            <div className="flex items-center gap-8 mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="text-blue-400" size={20} />
                科室用血 (30天)
              </h3>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs mb-0.5">申请人次</span>
                  <span className="text-xl font-bold text-blue-400 leading-none">1,245</span>
                </div>
                <div className="w-px h-8 bg-slate-700"></div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs mb-0.5">输血人次</span>
                  <span className="text-xl font-bold text-emerald-400 leading-none">1,180</span>
                </div>
              </div>
            </div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">30天血型分布（分输血患者和手术患者）</h4>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodTypeDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                  <Bar dataKey="transfusion" name="输血患者" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="surgery" name="手术患者" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px] lg:col-span-3 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-300">30天用血排名</h3>
              <button className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs">
                <span>查看明细</span>
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              <div>
                <h4 className="text-xs text-rose-400 mb-2 font-medium">红细胞 (U)</h4>
                <div className="space-y-2">
                  {deptRankingRBC.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 w-20 truncate">{item.dept}</span>
                      <div className="flex-1 mx-2 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-400 h-full rounded-full" style={{ width: `${(item.value / 450) * 100}%` }}></div>
                      </div>
                      <span className="text-slate-300 w-8 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-amber-400 mb-2 font-medium">血浆 (ml)</h4>
                <div className="space-y-2">
                  {deptRankingPlasma.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 w-20 truncate">{item.dept}</span>
                      <div className="flex-1 mx-2 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(item.value / 350) * 100}%` }}></div>
                      </div>
                      <span className="text-slate-300 w-8 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-blue-400 mb-2 font-medium">血小板 (治疗量)</h4>
                <div className="space-y-2">
                  {deptRankingPlatelet.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 w-20 truncate">{item.dept}</span>
                      <div className="flex-1 mx-2 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(item.value / 150) * 100}%` }}></div>
                      </div>
                      <span className="text-slate-300 w-8 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-purple-400 mb-2 font-medium">冷沉淀 (U)</h4>
                <div className="space-y-2">
                  {deptRankingCryo.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 w-20 truncate">{item.dept}</span>
                      <div className="flex-1 mx-2 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-400 h-full rounded-full" style={{ width: `${(item.value / 100) * 100}%` }}></div>
                      </div>
                      <span className="text-slate-300 w-8 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSurgeryCockpit = () => {
    return (
      <div className="w-full h-screen bg-[#0f172a] text-white p-4 font-sans flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 relative">
          <div className="flex items-center gap-4 z-10">
            <button 
              onClick={() => setActiveCockpitId(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              {['全院', '天河院区', '珠玑院区', '同德院区'].map(campus => (
                <button
                  key={campus}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    campus === '全院' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent whitespace-nowrap">
              手术室监控驾驶舱
            </h1>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-sm z-10">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>2026-03-31 18:30:24</span>
            </div>
            <div className="w-px h-4 bg-slate-700"></div>
            <button className="hover:text-white transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Left Column (2/3) */}
          <div className="xl:col-span-2 flex flex-col gap-4 min-h-0">
            {/* Top Left: 手术工作效率分析 */}
            <div className="bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm flex flex-col h-[48%] shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
              <div className="px-4 py-3 border-b border-[#1e3a8a]/50 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-transparent">
                <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500"></div>
                  手术工作效率分析
                </h3>
                <button className="text-xs text-blue-400 hover:text-blue-300" onClick={() => setDrillDownConfig({isOpen: true, title: '手术工作效率分析', type: 'module'})}>更多 &gt;</button>
              </div>
              <div className="p-4 flex-1 grid grid-cols-3 gap-4 min-h-0">
                {/* 手术工作量 */}
                <div className="col-span-1 flex flex-col min-h-0">
                  <h4 className="text-sm text-blue-300 mb-2 flex items-center gap-2 cursor-pointer" onClick={() => setDrillDownConfig({isOpen: true, title: '手术工作量', type: 'kpi'})}>
                    <ChevronRight size={16} className="text-blue-500"/> 手术工作量
                  </h4>
                  <div className="bg-[#0a1128]/50 border border-[#1e3a8a]/30 rounded p-3 flex-1 flex flex-col justify-center cursor-pointer" onClick={() => setDrillDownConfig({isOpen: true, title: '手术工作量详情', type: 'kpi'})}>
                    <div className="text-center mb-4">
                      <div className="text-xs text-gray-400 mb-1">今日手术工作量 (242)</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
                          <div className="text-[10px] text-gray-400">今日择期</div>
                          <div className="text-xl font-bold text-blue-400">153</div>
                        </div>
                        <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
                          <div className="text-[10px] text-gray-400">急诊</div>
                          <div className="text-xl font-bold text-blue-400">89</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700 text-center">
                        <div className="text-[9px] text-gray-400">等待</div>
                        <div className="text-base font-bold text-blue-400">76</div>
                      </div>
                      <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700 text-center">
                        <div className="text-[9px] text-gray-400">进行</div>
                        <div className="text-base font-bold text-blue-400">37</div>
                      </div>
                      <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700 text-center">
                        <div className="text-[9px] text-gray-400">完成</div>
                        <div className="text-base font-bold text-blue-400">129</div>
                      </div>
                      <div className="bg-slate-800/50 p-1.5 rounded border border-slate-700 text-center">
                        <div className="text-[9px] text-gray-400">取消</div>
                        <div className="text-base font-bold text-blue-400">0</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 各级手术开展情况 */}
                <div className="col-span-1 flex flex-col items-center justify-center relative cursor-pointer min-h-0" onClick={() => setDrillDownConfig({isOpen: true, title: '各级手术开展情况', type: 'kpi'})}>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-xs font-bold text-white">各级手术</div>
                      <div className="text-xs font-bold text-white">开展情况</div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={[
                          { name: '一级', value: 9, color: '#10b981' },
                          { name: '二级', value: 74, color: '#0ea5e9' },
                          { name: '三级', value: 128, color: '#f59e0b' },
                          { name: '四级', value: 31, color: '#ef4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {
                          [
                            { name: '一级', value: 9, color: '#10b981' },
                            { name: '二级', value: 74, color: '#0ea5e9' },
                            { name: '三级', value: 128, color: '#f59e0b' },
                            { name: '四级', value: 31, color: '#ef4444' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px' }} itemStyle={{ color: '#fff', fontSize: '12px' }} />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="flex gap-2 text-[10px] mt-1">
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>一级</div>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]"></div>二级</div>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></div>三级</div>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></div>四级</div>
                  </div>
                </div>

                {/* 手术间利用率 */}
                <div className="col-span-1 flex flex-col cursor-pointer min-h-0" onClick={() => setDrillDownConfig({isOpen: true, title: '手术间利用率', type: 'kpi'})}>
                  <div className="flex gap-2 mb-2">
                    <button className="bg-blue-600 text-white px-2 py-0.5 text-[10px] rounded">利用率</button>
                    <button className="bg-slate-800/50 text-gray-400 px-2 py-0.5 text-[10px] rounded border border-slate-700">效能监测</button>
                  </div>
                  <div className="bg-[#0a1128]/50 border border-[#1e3a8a]/30 rounded p-3 flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <div className="text-[9px] text-gray-400 text-center">利用率</div>
                        <div className="w-10 h-10 rounded-full border-2 border-cyan-500 flex items-center justify-center text-cyan-400 text-[9px] font-bold">
                          81.89%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[9px] text-gray-400">实际使用(h)</div>
                        <div className="text-lg font-bold text-blue-400 tracking-wider font-mono">233.7</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[9px] text-gray-400">开放时长(h)</div>
                        <div className="text-lg font-bold text-blue-400 tracking-wider font-mono">285.4</div>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: '天河', value: 160 },
                          { name: '同德', value: 120 },
                          { name: '珠玑', value: 140 },
                        ]} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a8a" opacity={0.2} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px' }} itemStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="value" fill="#0ea5e9" barSize={10} radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Left: 手术工作量分析 */}
            <div className="bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm flex flex-col h-[48%] shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
              <div className="px-4 py-3 border-b border-[#1e3a8a]/50 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-transparent">
                <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500"></div>
                  手术工作量分析
                </h3>
                <button className="text-xs text-blue-400 hover:text-blue-300" onClick={() => setDrillDownConfig({isOpen: true, title: '手术工作量分析', type: 'module'})}>更多 &gt;</button>
              </div>
              <div className="p-4 flex-1 flex flex-col min-h-0">
                <div className="flex gap-4 mb-3 border-b border-slate-700/50 pb-1">
                  <button className="text-blue-400 px-2 py-1 text-sm font-medium border-b-2 border-blue-500">介入手术工作量</button>
                  <button className="text-gray-400 px-2 py-1 text-sm hover:text-blue-400 transition-colors">手术完成情况</button>
                  <button className="text-gray-400 px-2 py-1 text-sm hover:text-blue-400 transition-colors">手术类型统计</button>
                </div>
                <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
                  {/* Left Stats */}
                  <div className="col-span-2 flex flex-col gap-2 cursor-pointer min-h-0" onClick={() => setDrillDownConfig({isOpen: true, title: '介入手术', type: 'kpi'})}>
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded p-2 text-center">
                      <div className="text-xs text-blue-400 font-bold">介入手术</div>
                    </div>
                    <div className="bg-slate-800/30 border border-slate-700 rounded p-2 text-center flex-1 flex flex-col justify-center">
                      <div className="text-[10px] text-gray-400 mb-0.5">计划</div>
                      <div className="text-xl font-bold text-blue-400">7</div>
                    </div>
                    <div className="bg-slate-800/30 border border-slate-700 rounded p-2 text-center flex-1 flex flex-col justify-center">
                      <div className="text-[10px] text-gray-400 mb-0.5">术中</div>
                      <div className="text-xl font-bold text-blue-400">2</div>
                    </div>
                    <div className="bg-slate-800/30 border border-slate-700 rounded p-2 text-center flex-1 flex flex-col justify-center">
                      <div className="text-[10px] text-gray-400 mb-0.5">完成</div>
                      <div className="text-xl font-bold text-blue-400">2</div>
                    </div>
                  </div>
                  
                  {/* Middle Chart */}
                  <div className="col-span-3 flex flex-col cursor-pointer min-h-0" onClick={() => setDrillDownConfig({isOpen: true, title: '院区分布', type: 'kpi'})}>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: '天河', value: 3 },
                          { name: '同德', value: 4 },
                          { name: '珠玑', value: 2 },
                        ]} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e3a8a" opacity={0.2} />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#d1d5db' }} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px' }} />
                          <Bar dataKey="value" fill="#0ea5e9" barSize={15} radius={[0, 4, 4, 0]}>
                            <LabelList dataKey="value" position="right" fill="#0ea5e9" fontSize={10} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right Table */}
                  <div className="col-span-7 flex flex-col bg-slate-900/50 rounded border border-slate-700 overflow-hidden cursor-pointer min-h-0" onClick={() => setDrillDownConfig({isOpen: true, title: '主刀医生手术情况统计表', type: 'kpi'})}>
                    <div className="bg-blue-600/20 text-blue-400 px-3 py-1.5 flex justify-between items-center border-b border-blue-500/30">
                      <span className="text-xs font-bold">主刀医生手术情况统计表</span>
                      <span className="text-[9px] opacity-60">2026-03-31</span>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      <table className="w-full text-[10px] text-center border-collapse">
                        <thead>
                          <tr className="bg-slate-800/50 text-slate-300 sticky top-0">
                            <th className="border border-slate-700 p-1.5">序号</th>
                            <th className="border border-slate-700 p-1.5">科室</th>
                            <th className="border border-slate-700 p-1.5">医生</th>
                            <th className="border border-slate-700 p-1.5">级别</th>
                            <th className="border border-slate-700 p-1.5">台数</th>
                            <th className="border border-slate-700 p-1.5">均时(h)</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-400">
                          {[
                            { id: 1, dept: '外科', doc: '张三', level: '四级', count: 3, time: 1.5 },
                            { id: 2, dept: '外科', doc: '李四', level: '三级', count: 2, time: 1.35 },
                            { id: 3, dept: '骨科', doc: '王五', level: '二级', count: 4, time: 1.01 },
                            { id: 4, dept: '神外', doc: '赵六', level: '四级', count: 1, time: 2.2 },
                            { id: 5, dept: '泌尿', doc: '孙七', level: '三级', count: 2, time: 1.8 },
                          ].map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-slate-800/20' : ''}>
                              <td className="border border-slate-700 p-1.5">{row.id}</td>
                              <td className="border border-slate-700 p-1.5">{row.dept}</td>
                              <td className="border border-slate-700 p-1.5 text-blue-400">{row.doc}</td>
                              <td className="border border-slate-700 p-1.5">{row.level}</td>
                              <td className="border border-slate-700 p-1.5 text-white font-bold">{row.count}</td>
                              <td className="border border-slate-700 p-1.5">{row.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="xl:col-span-1 flex flex-col min-h-0">
            <div className="bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm flex flex-col h-full shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
              <div className="px-4 py-3 border-b border-[#1e3a8a]/50 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-transparent">
                <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500"></div>
                  首台手术准点分析
                </h3>
                <button className="text-xs text-blue-400 hover:text-blue-300" onClick={() => setDrillDownConfig({isOpen: true, title: '首台手术准点分析', type: 'module'})}>更多 &gt;</button>
              </div>
              <div className="p-4 flex-1 flex flex-col min-h-0">
                <h4 className="text-sm text-blue-300 mb-3 flex items-center gap-2 cursor-pointer" onClick={() => setDrillDownConfig({isOpen: true, title: '实时首台手术开台准点分析', type: 'kpi'})}>
                  <ChevronRight size={16} className="text-blue-500"/> 实时准点分析 (8:45)
                </h4>
                
                <div className="grid grid-cols-3 gap-2 mb-4 cursor-pointer" onClick={() => setDrillDownConfig({isOpen: true, title: '准点概览', type: 'kpi'})}>
                  <div className="bg-slate-800/30 p-2 rounded border border-slate-700 text-center">
                    <div className="text-[10px] text-cyan-400 mb-1">排班总数</div>
                    <div className="text-xl font-bold text-blue-400">242</div>
                  </div>
                  <div className="bg-slate-800/30 p-2 rounded border border-slate-700 text-center">
                    <div className="text-[10px] text-cyan-400 mb-1">首台排班</div>
                    <div className="text-xl font-bold text-blue-400">37</div>
                  </div>
                  <div className="bg-slate-800/30 p-2 rounded border border-slate-700 text-center">
                    <div className="text-[10px] text-cyan-400 mb-1">开始/未开</div>
                    <div className="text-xl font-bold text-cyan-400">3/34</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 cursor-pointer" onClick={() => setDrillDownConfig({isOpen: true, title: '超时统计', type: 'kpi'})}>
                  <div className="bg-orange-500/10 p-2 rounded border border-orange-500/20 text-center">
                    <div className="text-[10px] text-orange-400 mb-1">超时15m</div>
                    <div className="text-xl font-bold text-orange-500">6</div>
                  </div>
                  <div className="bg-orange-500/10 p-2 rounded border border-orange-500/20 text-center">
                    <div className="text-[10px] text-orange-400 mb-1">超时30m</div>
                    <div className="text-xl font-bold text-orange-500">7</div>
                  </div>
                  <div className="bg-red-500/10 p-2 rounded border border-red-500/20 text-center">
                    <div className="text-[10px] text-red-500 mb-1">超时45m</div>
                    <div className="text-xl font-bold text-red-500">17</div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead className="text-slate-500 border-b border-slate-800 sticky top-0 bg-[#0a1128] z-10">
                      <tr>
                        <th className="pb-2 font-normal">院区</th>
                        <th className="pb-2 font-normal">手术间</th>
                        <th className="pb-2 font-normal">主刀</th>
                        <th className="pb-2 font-normal">延误(m)</th>
                        <th className="pb-2 font-normal">开始时间</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-400">
                      {[
                        { campus: '天河', room: '14', doctor: '夏成雨**', delay: '90.0', time: '10:15' },
                        { campus: '天河', room: '11', doctor: '何俊德**', delay: '90.0', time: '10:15' },
                        { campus: '珠玑', room: '二09', doctor: '刘永达**', delay: '86.0', time: '10:11' },
                        { campus: '珠玑', room: '二03', doctor: '陈劲松**', delay: '85.0', time: '10:10' },
                        { campus: '同德', room: '一3', doctor: '何永忠**', delay: '81.0', time: '10:06' },
                        { campus: '同德', room: '一10', doctor: '古迪**', delay: '75.0', time: '10:00' },
                        { campus: '天河', room: '15', doctor: '唐元章', delay: '65.0', time: '09:50' },
                        { campus: '天河', room: '01', doctor: '彭桂林*', delay: '60.0', time: '09:45' },
                        { campus: '天河', room: '10', doctor: '张鑫**', delay: '60.0', time: '09:45' },
                        { campus: '珠玑', room: '二05', doctor: '陈汉章**', delay: '55.0', time: '09:40' },
                        { campus: '天河', room: '06', doctor: '邵文龙**', delay: '55.0', time: '09:40' },
                        { campus: '同德', room: '一1', doctor: '黄炯强**', delay: '55.0', time: '09:40' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => setDrillDownConfig({isOpen: true, title: '延误详情', type: 'kpi'})}>
                          <td className="py-2">{row.campus}</td>
                          <td className="py-2">{row.room}</td>
                          <td className="py-2 text-blue-400">{row.doctor}</td>
                          <td className="py-2 text-red-500 font-bold">{row.delay}</td>
                          <td className="py-2 text-slate-500">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSurgeryOperationAnalysisCockpit = () => {
    // Mock data for surgery volume
    const surgeryVolumeData = [
      { dept: '普外科', volume: 450, yoy: 420 },
      { dept: '骨科', volume: 380, yoy: 350 },
      { dept: '泌尿外科', volume: 320, yoy: 300 },
      { dept: '神经外科', volume: 280, yoy: 260 },
      { dept: '妇产科', volume: 240, yoy: 220 },
      { dept: '胸外科', volume: 180, yoy: 170 },
    ];

    const surgeryLevelData = [
      { name: '一级', value: 15, color: '#3b82f6' },
      { name: '二级', value: 25, color: '#60a5fa' },
      { name: '三级', value: 35, color: '#93c5fd' },
      { name: '四级', value: 25, color: '#bfdbfe' },
    ];

    const surgeryTypeData = [
      { name: '择期', value: 75, color: '#10b981' },
      { name: '急诊', value: 25, color: '#f59e0b' },
    ];

    const anesthesiaMethodData = [
      { name: '全麻', value: 60, color: '#8b5cf6' },
      { name: '局麻', value: 20, color: '#a78bfa' },
      { name: '椎管内麻醉', value: 15, color: '#c4b5fd' },
      { name: '其他', value: 5, color: '#ddd6fe' },
    ];

    const timeAnalysisData = [
      { name: '一级', current: 45, yoy: 42 },
      { name: '二级', current: 65, yoy: 60 },
      { name: '三级', current: 120, yoy: 110 },
      { name: '四级', current: 210, yoy: 200 },
    ];

    return (
      <div className="w-full h-screen bg-[#0f172a] text-white p-4 font-sans flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 relative">
          <div className="flex items-center gap-4 z-10">
            <button 
              onClick={() => setActiveCockpitId(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent whitespace-nowrap">
              手术室运营分析大屏
            </h1>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-sm z-10">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>2026-03-31 18:46:40</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 grid grid-rows-3 gap-4 min-h-0 overflow-hidden">
          {/* Top Row */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 bg-[#1e293b]/50 border border-slate-700 rounded-lg p-3 flex flex-col shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <div className="w-1 h-3 bg-blue-500"></div>
                月度手术统计分析
              </h3>
              <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
                <div className="flex flex-col cursor-pointer" onClick={() => setDrillDownConfig({isOpen: true, title: '当月各科室手术业务量', type: 'kpi'})}>
                  <div className="text-[10px] text-slate-400 mb-1">1. 条形图展示：当月各科室手术业务量</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={surgeryVolumeData} layout="vertical" margin={{ left: -15, right: 20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="dept" type="category" tick={{ fontSize: 9, fill: '#94a3b8' }} width={55} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }} itemStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="volume" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col cursor-pointer" onClick={() => setDrillDownConfig({isOpen: true, title: '当月各科室同比手术业务量', type: 'kpi'})}>
                  <div className="text-[10px] text-slate-400 mb-1">2. 柱状图展示：当月各科室同比手术业务量</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={surgeryVolumeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="dept" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }} itemStyle={{ fontSize: '10px' }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 9, paddingTop: 5 }} />
                      <Bar dataKey="volume" name="本月" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={8} />
                      <Bar dataKey="yoy" name="同比" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-span-2 bg-[#1e293b]/50 border border-slate-700 rounded-lg p-3 flex flex-col cursor-pointer shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]" onClick={() => setDrillDownConfig({isOpen: true, title: '月度手术级别统计分析', type: 'kpi'})}>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <div className="w-1 h-3 bg-blue-500"></div>
                月度手术级别统计分析
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={surgeryLevelData} innerRadius="50%" outerRadius="80%" paddingAngle={5} dataKey="value">
                      {surgeryLevelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }} />
                    <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-span-2 bg-[#1e293b]/50 border border-slate-700 rounded-lg p-3 flex flex-col cursor-pointer shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]" onClick={() => setDrillDownConfig({isOpen: true, title: '月度手术类型统计分析', type: 'kpi'})}>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <div className="w-1 h-3 bg-blue-500"></div>
                月度手术类型统计分析
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={surgeryTypeData} innerRadius="50%" outerRadius="80%" paddingAngle={5} dataKey="value">
                      {surgeryTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }} />
                    <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-span-3 bg-[#1e293b]/50 border border-slate-700 rounded-lg p-3 flex flex-col cursor-pointer shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]" onClick={() => setDrillDownConfig({isOpen: true, title: '月度手术麻醉方式统计分析', type: 'kpi'})}>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <div className="w-1 h-3 bg-blue-500"></div>
                月度手术麻醉方式统计分析
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={anesthesiaMethodData} innerRadius="50%" outerRadius="80%" paddingAngle={5} dataKey="value">
                      {anesthesiaMethodData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }} />
                    <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Middle Row - Tables */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1e293b]/50 border border-slate-700 rounded-lg p-3 flex flex-col overflow-hidden shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] cursor-pointer" onClick={() => setDrillDownConfig({isOpen: true, title: '月度手术室使用情况分析', type: 'module'})}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <div className="w-1 h-3 bg-blue-500"></div>
                  月度手术室使用情况分析表
                </h3>
                <span className="text-[10px] text-slate-400">统计时间：2026年03月</span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-[9px] text-center border-collapse">
                  <thead className="sticky top-0 bg-slate-800 z-10">
                    <tr className="text-slate-300">
                      <th className="border border-slate-700 p-1">序号</th>
                      <th className="border border-slate-700 p-1">院区</th>
                      <th className="border border-slate-700 p-1">手术室名称</th>
                      <th className="border border-slate-700 p-1">当月手术总台数</th>
                      <th className="border border-slate-700 p-1">当月占用时长(h)</th>
                      <th className="border border-slate-700 p-1">平均每台时长(h)</th>
                      <th className="border border-slate-700 p-1">利用率(%)</th>
                      <th className="border border-slate-700 p-1">急诊台数</th>
                      <th className="border border-slate-700 p-1">急诊占比(%)</th>
                      <th className="border border-slate-700 p-1">四级台数</th>
                      <th className="border border-slate-700 p-1">四级占比(%)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                      <tr key={i} className="hover:bg-white/5 border-b border-slate-800/50">
                        <td className="p-1">{i}</td>
                        <td className="p-1">天河</td>
                        <td className="p-1">手术室{i}</td>
                        <td className="p-1">45</td>
                        <td className="p-1">120</td>
                        <td className="p-1">2.6</td>
                        <td className="p-1 text-blue-400 font-medium">82.5</td>
                        <td className="p-1">12</td>
                        <td className="p-1">26.7</td>
                        <td className="p-1">8</td>
                        <td className="p-1">17.8</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-[#1e293b]/50 border border-slate-700 rounded-lg p-3 flex flex-col overflow-hidden shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] cursor-pointer" onClick={() => setDrillDownConfig({isOpen: true, title: '月度主刀医生手术情况分析', type: 'module'})}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <div className="w-1 h-3 bg-blue-500"></div>
                  月度主刀医生手术情况分析表
                </h3>
                <span className="text-[10px] text-slate-400">统计时间：2026年03月</span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-[9px] text-center border-collapse">
                  <thead className="sticky top-0 bg-slate-800 z-10">
                    <tr className="text-slate-300">
                      <th className="border border-slate-700 p-1">序号</th>
                      <th className="border border-slate-700 p-1">科室</th>
                      <th className="border border-slate-700 p-1">主刀医生</th>
                      <th className="border border-slate-700 p-1">总手术台数</th>
                      <th className="border border-slate-700 p-1">总手术时长(h)</th>
                      <th className="border border-slate-700 p-1">平均每台时长(min)</th>
                      <th className="border border-slate-700 p-1">一级台数</th>
                      <th className="border border-slate-700 p-1">二级台数</th>
                      <th className="border border-slate-700 p-1">三级台数</th>
                      <th className="border border-slate-700 p-1">四级台数</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                      <tr key={i} className="hover:bg-white/5 border-b border-slate-800/50">
                        <td className="p-1">{i}</td>
                        <td className="p-1">普外科</td>
                        <td className="p-1 text-blue-400">张医生{i}</td>
                        <td className="p-1 font-medium text-white">28</td>
                        <td className="p-1">75.5</td>
                        <td className="p-1">162</td>
                        <td className="p-1">2</td>
                        <td className="p-1">8</td>
                        <td className="p-1">12</td>
                        <td className="p-1 text-orange-400">6</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Row - Time Analysis */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { title: '月度手术室术前准备时长', data: timeAnalysisData, color: '#3b82f6', ratio: '术前准备时长占比=术前准备时长/总手术时长*100%' },
              { title: '月度手术室麻醉时长', data: timeAnalysisData, color: '#8b5cf6', ratio: '麻醉时长占比=麻醉时长/总手术时长*100%' },
              { title: '术中操作时长', data: timeAnalysisData, color: '#10b981', ratio: '术中操作时长占比=术中操作时长/总手术时长*100%' },
              { title: '手术苏醒时长', data: timeAnalysisData, color: '#f59e0b', ratio: '手术苏醒时长占比=手术苏醒时长/总手术时长*100%' },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#1e293b]/50 border border-slate-700 rounded-lg p-3 flex flex-col cursor-pointer shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]" onClick={() => setDrillDownConfig({isOpen: true, title: item.title, type: 'kpi'})}>
                <h3 className="text-xs font-bold mb-1 flex items-center gap-2">
                  <div className="w-1 h-3 bg-blue-500"></div>
                  {item.title}
                </h3>
                <div className="text-[8px] text-slate-500 mb-2 leading-tight">{item.ratio}</div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={item.data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }} itemStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="current" name="本月" fill={item.color} radius={[2, 2, 0, 0]} barSize={8} />
                      <Bar dataKey="yoy" name="同比" fill="#475569" radius={[2, 2, 0, 0]} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLabCockpit = () => {
    const labBusinessData = [
      { name: '临检', value: 500 },
      { name: '生化', value: 460 },
      { name: '免疫', value: 250 },
      { name: '微生物', value: 160 },
      { name: '分子生物', value: 90 },
    ];

    const labTrendData = [
      { date: '03-18', current: 1200, previous: 1000, completed: 1100 },
      { date: '03-19', current: 1450, previous: 1380, completed: 1350 },
      { date: '03-20', current: 1300, previous: 1320, completed: 1280 },
      { date: '03-21', current: 1520, previous: 1480, completed: 1420 },
      { date: '03-22', current: 1380, previous: 1410, completed: 1300 },
      { date: '03-23', current: 850, previous: 880, completed: 800 },
      { date: '03-24', current: 1070, previous: 950, completed: 914 },
    ];

    const tatData = [
      { name: '临检', value: 0.5, target: 1.0 },
      { name: '生化', value: 1.2, target: 2.0 },
      { name: '免疫', value: 2.5, target: 4.0 },
      { name: '微生物', value: 48, target: 72 },
      { name: '外送', value: 72, target: 96 },
    ];

    const labFeeData = [
      { name: '临检', value: 35, amount: 12540, color: '#3b82f6' },
      { name: '生化', value: 25, amount: 8960, color: '#60a5fa' },
      { name: '免疫', value: 20, amount: 7160, color: '#93c5fd' },
      { name: '微生物', value: 10, amount: 3580, color: '#bfdbfe' },
      { name: '外送', value: 10, amount: 3580, color: '#dbeafe' },
    ];

    const criticalValues = [
      { dept: '心内科', name: '张三', item: 'TnI', result: '1.5', alert: '↑', status: '待处理' },
      { dept: '急诊科', name: '李四', item: 'K+', result: '6.2', alert: '↑', status: '处理中' },
      { dept: '呼吸科', name: '王五', item: 'WBC', result: '25.4', alert: '↑', status: '待处理' },
      { dept: '儿科', name: '赵六', item: 'CRP', result: '120', alert: '↑', status: '已通知' },
      { dept: '重症医学科', name: '孙七', item: 'PLT', result: '15', alert: '↓', status: '待处理' },
      { dept: '血液科', name: '周八', item: 'HGB', result: '45', alert: '↓', status: '待处理' },
      { dept: '神经内科', name: '吴九', item: 'GLU', result: '2.1', alert: '↓', status: '待处理' },
    ];

    const overTatAlerts = [
      { group: '生化流水线A', name: '李明', dept: '急诊科', item: '急诊生化全套', time: '超30分钟' },
      { group: '免疫流水线B', name: '王强', dept: '心内科', item: '心肌酶谱', time: '超15分钟' },
      { group: '临检流水线C', name: '张伟', dept: 'ICU', item: '血常规', time: '超45分钟' },
    ];

    const emergencyTestsData = {
      total: 128,
      pending: 15,
      completed: 113,
      recent: [
        { name: '王五', item: '急诊生化', time: '10分钟前', status: '检验中' },
        { name: '赵六', item: '血气分析', time: '5分钟前', status: '待接收' },
        { name: '钱七', item: '急诊凝血', time: '2分钟前', status: '待接收' },
      ]
    };

    const qcOutControlItems = [
      { instrument: '生化仪A', item: 'ALT', level: 'L1', rule: '1-3s', status: '待处理' },
      { instrument: '生化仪B', item: 'GLU', level: 'L2', rule: '2-2s', status: '待处理' },
      { instrument: '免疫仪A', item: 'TSH', level: 'L1', rule: '1-3s', status: '处理中' },
      { instrument: '血球仪A', item: 'WBC', level: 'L3', rule: 'R-4s', status: '待处理' },
      { instrument: '凝血仪A', item: 'PT', level: 'L1', rule: '1-3s', status: '待处理' },
    ];

    const missingTrackingInfo = [
      { barcode: 'A20260331001', patient: '王建国', dept: '呼吸内科', item: '生化全套', missingNode: '标本运送', status: '已签收' },
      { barcode: 'A20260331045', patient: '李秀兰', dept: '心内科', item: '凝血四项', missingNode: '标本采集', status: '已检验' },
      { barcode: 'A20260331088', patient: '张伟', dept: '急诊科', item: '血常规', missingNode: '标本接收', status: '已出报告' },
      { barcode: 'A20260331102', patient: '刘洋', dept: 'ICU', item: '血气分析', missingNode: '标本运送', status: '已签收' },
    ];

    const returnedSpecimens = [
      { barcode: 'A20260331012', patientId: 'O1234567', name: '刘建国', item: '生化全套', dept: '心内科', doctor: '张华', reason: '标本溶血', receiver: '李检验', handler: '王护士' },
      { barcode: 'A20260331055', patientId: 'I9876543', name: '王秀英', item: '凝血四项', dept: '呼吸内科', doctor: '李明', reason: '采血量不足', receiver: '赵检验', handler: '孙护士' },
      { barcode: 'A20260331099', patientId: 'O2345678', name: '陈伟', item: '血常规', dept: '急诊科', doctor: '王强', reason: '条码破损', receiver: '周检验', handler: '吴护士' },
      { barcode: 'A20260331120', patientId: 'I8765432', name: '林芳', item: '血气分析', dept: 'ICU', doctor: '赵刚', reason: '标本凝块', receiver: '吴检验', handler: '郑护士' },
    ];

    return (
      <div className="w-full bg-[#0f172a] flex-1 min-h-0 text-white p-6 pb-24 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 relative">
          <div className="flex items-center gap-4 z-10">
            <button 
              onClick={() => setActiveCockpitId(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              {['全院', '天河院区', '珠玑院区', '同德院区'].map(campus => (
                <button
                  key={campus}
                  onClick={() => setSelectedCampus(campus)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    selectedCampus === campus 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent whitespace-nowrap">
              智慧检验驾驶舱 V3.0
            </h1>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-sm z-10">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>2026-03-09 13:00:24</span>
            </div>
            <div className="w-px h-4 bg-slate-700"></div>
            <button className="hover:text-white transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {activeLabTab === 'lab' ? (
          <>
            {/* 顶部提醒区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 超TAT紧急提醒 */}
              {overTatAlerts.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse-slow">
                  <div className="bg-red-500 text-white p-2.5 rounded-lg flex items-center justify-center">
                    <AlertCircle size={24} className="animate-pulse" />
                  </div>
                  <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                    <div className="flex items-center gap-3">
                      <h3 className="text-red-400 font-bold text-lg leading-none">超TAT紧急提醒</h3>
                      <span className="text-xs bg-red-500/20 px-2 py-0.5 rounded-full text-red-300 border border-red-500/30">
                        {overTatAlerts.length} 项超时
                      </span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-1 custom-scrollbar">
                      {overTatAlerts.map((alert, idx) => (
                        <div key={idx} className="flex-shrink-0 bg-slate-900/80 border border-red-500/30 rounded-lg px-4 py-2 flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center min-w-[60px]">
                            <span className="text-red-400 font-bold text-sm">{alert.time}</span>
                          </div>
                          <div className="w-px h-8 bg-slate-700"></div>
                          <div className="flex flex-col justify-center min-w-[120px]">
                            <span className="text-slate-300 text-xs font-medium mb-0.5">{alert.group}</span>
                            <span className="text-slate-400 text-[10px]">{alert.item}</span>
                          </div>
                          <div className="w-px h-8 bg-slate-700"></div>
                          <div className="flex flex-col justify-center min-w-[80px]">
                            <span className="text-slate-200 font-medium text-sm">{alert.name}</span>
                            <span className="text-slate-400 text-[10px]">{alert.dept}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 急诊急查 */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <div className="bg-amber-500 text-white p-2.5 rounded-lg flex items-center justify-center">
                  <Zap size={24} className="animate-pulse" />
                </div>
                <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                  <div className="flex items-center gap-3">
                    <h3 className="text-amber-400 font-bold text-lg leading-none">急诊急查</h3>
                    <span className="text-xs bg-amber-500/20 px-2 py-0.5 rounded-full text-amber-300 border border-amber-500/30">
                      待处理 {emergencyTestsData.pending} 项
                    </span>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-1 custom-scrollbar">
                    {emergencyTestsData.recent.map((test, idx) => (
                      <div key={idx} className="flex-shrink-0 bg-slate-900/80 border border-amber-500/30 rounded-lg px-4 py-2 flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center min-w-[60px]">
                          <span className="text-amber-400 font-bold text-sm">{test.time}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-700"></div>
                        <div className="flex flex-col justify-center min-w-[100px]">
                          <span className="text-slate-300 text-xs font-medium mb-0.5">{test.item}</span>
                          <span className="text-slate-400 text-[10px]">{test.status}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-700"></div>
                        <div className="flex flex-col justify-center min-w-[60px]">
                          <span className="text-slate-200 font-medium text-sm">{test.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 标本业务量 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FlaskConical className="text-blue-400" size={20} />
                标本业务量
              </h3>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="text-slate-400 text-[10px] mb-1">今日标本</div>
                <div className="text-lg font-bold text-blue-400">1,070<span className="text-[10px] font-normal text-slate-500 ml-1">个</span></div>
              </div>
              <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="text-slate-400 text-[10px] mb-1">未完成</div>
                <div className="text-lg font-bold text-amber-400">156<span className="text-[10px] font-normal text-slate-500 ml-1">个</span></div>
              </div>
              <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="text-slate-400 text-[10px] mb-1">待审核</div>
                <div className="text-lg font-bold text-emerald-400">45<span className="text-[10px] font-normal text-slate-500 ml-1">个</span></div>
              </div>
              <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="text-slate-400 text-[10px] mb-1">危急值</div>
                <div className="text-lg font-bold text-red-400">20<span className="text-[10px] font-normal text-slate-500 ml-1">条</span></div>
              </div>
            </div>

            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={labBusinessData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => [`${value} 个`, '标本数']}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30}>
                    {labBusinessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#60a5fa' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 标本高峰趋势监控 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="text-emerald-400" size={20} />
                标本高峰趋势监控
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span className="text-slate-400">本周</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-emerald-500"></div>
                  <span className="text-slate-400">已完成</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-slate-500"></div>
                  <span className="text-slate-400">上周</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={labTrendData}>
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(value: any, name: any) => [value, name === 'current' ? '本周标本' : name === 'completed' ? '已完成' : '上周标本']}
                  />
                  <Area type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                  <Area type="monotone" dataKey="previous" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TAT时效分析 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Clock className="text-amber-400" size={20} />
              TAT时效分析
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tatData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={60} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any, name: any) => [`${value} h`, name === 'value' ? '平均时长' : '目标时长']}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                  <Bar dataKey="value" name="平均时长" fill="#f59e0b" barSize={12} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target" name="目标时长" fill="#3b82f6" barSize={12} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 检验服务费用 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="text-violet-400" size={20} />
                检验服务费用
              </h3>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={labFeeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {labFeeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any, name: any, item: any) => {
                        const amount = item?.payload?.amount || 0;
                        return [
                          <div key="fee-tooltip" className="flex flex-col gap-1">
                            <div>占比: {value}%</div>
                            <div>金额: ¥{amount.toLocaleString()}</div>
                          </div>,
                          name || ''
                        ];
                      }} 
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {labFeeData.map(item => (
                  <div key={item.name} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="font-medium text-slate-300">¥{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[10px] text-slate-500">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 实时危急值预警 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="text-red-400" size={20} />
                实时危急值预警
              </h3>
              <div className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">
                未处理: {criticalValues.filter(row => row.status === '待处理').length}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="pb-2 font-medium">科室</th>
                    <th className="pb-2 font-medium">姓名</th>
                    <th className="pb-2 font-medium">项目</th>
                    <th className="pb-2 font-medium">结果</th>
                    <th className="pb-2 font-medium">预警</th>
                    <th className="pb-2 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {criticalValues.filter(row => row.status === '待处理').map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-slate-300">{row.dept}</td>
                      <td className="py-3 text-slate-300">{row.name}</td>
                      <td className="py-3 text-slate-300 font-medium">{row.item}</td>
                      <td className="py-3 text-red-400 font-bold">{row.result}</td>
                      <td className="py-3 text-red-400">{row.alert}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          row.status === '待处理' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          row.status === '处理中' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 质控失控未处理项目 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[360px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="text-amber-400" size={20} />
                质控失控未处理
              </h3>
              <div className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                未处理: {qcOutControlItems.filter(row => row.status === '待处理').length}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="pb-2 font-medium">仪器</th>
                    <th className="pb-2 font-medium">项目</th>
                    <th className="pb-2 font-medium">水平</th>
                    <th className="pb-2 font-medium">规则</th>
                    <th className="pb-2 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {qcOutControlItems.filter(row => row.status === '待处理').map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-slate-300">{row.instrument}</td>
                      <td className="py-3 text-slate-300 font-medium">{row.item}</td>
                      <td className="py-3 text-slate-400">{row.level}</td>
                      <td className="py-3 text-amber-400 font-bold">{row.rule}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          row.status === '待处理' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          row.status === '处理中' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 标本全流程追踪缺失信息 & 当日回退标本数 */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Search className="text-blue-400" size={20} />
                标本全流程追踪缺失信息
              </h3>
              <div className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
                异常标本: {missingTrackingInfo.length}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="pb-2 font-medium">条码号</th>
                    <th className="pb-2 font-medium">姓名</th>
                    <th className="pb-2 font-medium">科室</th>
                    <th className="pb-2 font-medium">项目</th>
                    <th className="pb-2 font-medium">缺失节点</th>
                    <th className="pb-2 font-medium">当前状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {missingTrackingInfo.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-slate-300 font-mono">{row.barcode}</td>
                      <td className="py-3 text-slate-300">{row.patient}</td>
                      <td className="py-3 text-slate-400">{row.dept}</td>
                      <td className="py-3 text-slate-300 font-medium">{row.item}</td>
                      <td className="py-3 text-amber-400 font-medium">{row.missingNode}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="text-rose-400" size={20} />
                当日回退标本数
              </h3>
              <div className="text-xs text-rose-400 bg-rose-400/10 px-2 py-1 rounded border border-rose-400/20">
                回退标本: {returnedSpecimens.length}
              </div>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10">
                  <tr>
                    <th className="pb-2 font-medium whitespace-nowrap pr-4">条码号</th>
                    <th className="pb-2 font-medium whitespace-nowrap pr-4">门诊号/住院号</th>
                    <th className="pb-2 font-medium whitespace-nowrap pr-4">姓名</th>
                    <th className="pb-2 font-medium whitespace-nowrap pr-4">项目</th>
                    <th className="pb-2 font-medium whitespace-nowrap pr-4">开单科室</th>
                    <th className="pb-2 font-medium whitespace-nowrap pr-4">开单医生</th>
                    <th className="pb-2 font-medium whitespace-nowrap pr-4">回退原因</th>
                    <th className="pb-2 font-medium whitespace-nowrap pr-4">接受人</th>
                    <th className="pb-2 font-medium whitespace-nowrap">处理人</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {returnedSpecimens.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-slate-300 font-mono pr-4">{row.barcode}</td>
                      <td className="py-3 text-slate-300 font-mono pr-4">{row.patientId}</td>
                      <td className="py-3 text-slate-300 pr-4">{row.name}</td>
                      <td className="py-3 text-slate-300 font-medium pr-4">{row.item}</td>
                      <td className="py-3 text-slate-400 pr-4">{row.dept}</td>
                      <td className="py-3 text-slate-400 pr-4">{row.doctor}</td>
                      <td className="py-3 text-rose-400 font-medium pr-4">{row.reason}</td>
                      <td className="py-3 text-slate-400 pr-4">{row.receiver}</td>
                      <td className="py-3 text-slate-400">{row.handler}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
          </>
        ) : (
          renderBloodCockpitContent()
        )}

        {/* Floating Tabs at Bottom Center */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full px-8 py-2 shadow-2xl flex items-center gap-12">
          <button 
            onClick={() => setActiveLabTab('lab')}
            className={`text-lg font-medium py-2 transition-colors relative ${activeLabTab === 'lab' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            检验
            {activeLabTab === 'lab' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveLabTab('blood')}
            className={`text-lg font-medium py-2 transition-colors relative ${activeLabTab === 'blood' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            输血
            {activeLabTab === 'blood' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-400 rounded-full"></div>}
          </button>
        </div>
      </div>
    );
  };

  const renderExamCockpit = () => {
    // Data for charts
    const workloadBarData = [
      { name: 'DR', value: 300, 天河: 120, 珠玑: 100, 同德: 80 },
      { name: 'CT', value: 390, 天河: 150, 珠玑: 130, 同德: 110 },
      { name: 'MR', value: 240, 天河: 90, 珠玑: 80, 同德: 70 },
      { name: '其他', value: 150, 天河: 60, 珠玑: 50, 同德: 40 },
    ];

    const drillDownData: Record<string, { name: string; value: number; 天河: number; 珠玑: number; 同德: number; color: string }[]> = {
      '其他': [
        { name: '乳腺钼靶', value: 45, 天河: 20, 珠玑: 15, 同德: 10, color: '#8b5cf6' },
        { name: 'DSA', value: 35, 天河: 15, 珠玑: 12, 同德: 8, color: '#a855f7' },
        { name: '胃肠造影', value: 40, 天河: 15, 珠玑: 13, 同德: 12, color: '#c084fc' },
      ]
    };

    const currentBarData = workloadDrillDown ? (drillDownData[workloadDrillDown] || []) : workloadBarData;
    
    const getWorkloadDonutData = () => {
      const baseData = workloadDrillDown ? (drillDownData[workloadDrillDown] || []) : workloadBarData;
      const colors = ['#0ea5e9', '#10b981', '#3b82f6', '#8b5cf6', '#a855f7', '#c084fc'];
      
      if (selectedCampus === '全院') {
        return baseData.map((item, index) => ({
          name: item.name,
          value: item.value,
          color: (item as { color?: string }).color || colors[index % colors.length]
        }));
      }
      const campusKey = selectedCampus.replace('院区', '');
      return baseData.map((item, index) => ({
        name: item.name,
        value: (item as Record<string, number | string>)[campusKey] || 0,
        color: (item as { color?: string }).color || colors[index % colors.length]
      }));
    };

    const currentDonutData = getWorkloadDonutData();

    const trafficTrendData = [
      { day: '星期一', 天河: 220, 珠玑: 200, 同德: 180, total: 600, lastWeek: 550 },
      { day: '星期二', 天河: 250, 珠玑: 230, 同德: 200, total: 680, lastWeek: 620 },
      { day: '星期三', 天河: 300, 珠玑: 280, 同德: 220, total: 800, lastWeek: 750 },
      { day: '星期四', 天河: 280, 珠玑: 260, 同德: 210, total: 750, lastWeek: 700 },
      { day: '星期五', 天河: 350, 珠玑: 320, 同德: 280, total: 950, lastWeek: 900 },
      { day: '星期六', 天河: 240, 珠玑: 220, 同德: 190, total: 650, lastWeek: 600 },
      { day: '星期日', 天河: 260, 珠玑: 240, 同德: 200, total: 700, lastWeek: 650 },
    ];

    const reportTimeData = [
      { name: 'DR', 天河: 0.8, 珠玑: 0.7, 同德: 0.9, 全院: 0.8 },
      { name: 'CT', 天河: 1.5, 珠玑: 1.4, 同德: 1.6, 全院: 1.5 },
      { name: 'MR', 天河: 2.1, 珠玑: 2.0, 同德: 2.2, 全院: 2.1 },
    ];

    const costDonutData = [
      { name: 'CT', value: 45, color: '#10b981' },
      { name: 'DR', value: 25, color: '#0ea5e9' },
      { name: 'MR', value: 20, color: '#3b82f6' },
      { name: '其他', value: 10, color: '#8b5cf6' },
    ];

    const campusCostDonutData = [
      { name: '天河院区', value: 40, color: '#f59e0b' },
      { name: '珠玑院区', value: 35, color: '#ec4899' },
      { name: '同德院区', value: 25, color: '#8b5cf6' },
    ];

    const radiologyEfficiencyData = [
      { name: 'DR', 天河: 1.2, 珠玑: 1.5, 同德: 1.3, 全院: 1.3 },
      { name: 'CT', 天河: 2.5, 珠玑: 2.8, 同德: 2.6, 全院: 2.6 },
      { name: 'MR', 天河: 4.2, 珠玑: 4.5, 同德: 4.0, 全院: 4.2 },
    ];

    const kpiData: Record<string, Record<string, number>> = {
      '已检人数': { '全院': 1300, '天河': 520, '珠玑': 450, '同德': 330 },
      '等待人数': { '全院': 1248, '天河': 480, '珠玑': 420, '同德': 348 },
      '预约人数': { '全院': 1248, '天河': 500, '珠玑': 400, '同德': 348 },
      '今日收入': { '全院': 1300, '天河': 500, '珠玑': 450, '同德': 350 },
      '门诊收入': { '全院': 2736, '天河': 1000, '珠玑': 900, '同德': 836 },
      '住院收入': { '全院': 2736, '天河': 1000, '珠玑': 900, '同德': 836 },
    };

    // Helper for Panel Title
    const PanelTitle = ({ title }: { title: string }) => (
      <div className="flex items-center gap-2 mb-4 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
        <div className="absolute left-0 bottom-0 w-32 h-[1px] bg-gradient-to-r from-cyan-400 to-transparent"></div>
        <h3 className="text-lg font-bold text-white tracking-wider italic">{title}</h3>
      </div>
    );

    // Helper for KPI Box
    const KpiBox = ({ title, value, unit, trend, trendValue, icon, campusData }: {
      title: string;
      value: number | string;
      unit?: string;
      trend: 'up' | 'down';
      trendValue: string;
      icon?: React.ReactNode;
      campusData?: { name: string; value: number | string }[] | null;
    }) => (
      <div className="relative group overflow-hidden bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-3 transition-all hover:bg-cyan-500/10 hover:border-cyan-500/30">
        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
          {icon}
        </div>
        <div className="flex flex-col gap-1 relative z-10">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <div className="w-1 h-3 bg-cyan-500 rounded-full"></div>
            {title}
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{value}</span>
            {unit && <span className="text-xs text-slate-500">{unit}</span>}
          </div>
          
          {campusData ? (
            <div className="grid grid-cols-3 gap-1 mt-1 py-1 border-t border-white/5">
              {campusData.map((c: { name: string; value: number | string }) => (
                <div key={c.name} className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">{c.name}</span>
                  <span className="text-xs font-semibold text-cyan-400/90">{c.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] mt-1">
              <span className={trend === 'up' ? 'text-rose-500' : 'text-emerald-500'}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}%
              </span>
              <span className="text-slate-500">较昨日</span>
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div className="w-full flex-1 min-h-0 bg-[#050b14] text-white p-6 pb-24 space-y-6 font-sans relative overflow-y-auto">
        {/* Background styling */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 50% 0%, #0c2b5e 0%, #050b14 50%)',
        }}></div>

        {/* Header */}
        <div className="relative flex justify-between items-center mb-4 z-10">
          <div className="flex items-center gap-4 w-1/3">
            <button 
              onClick={() => {
                setActiveCockpitId(null);
                setWorkloadDrillDown(null);
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          
          {/* Stylized Title Background */}
          <div className="relative px-20 py-4 w-1/3 flex justify-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNjAiPjxwYXRoIGQ9Ik0wLDYwIEw0MCwwIEwzNjAsMCBMNDAwLDYwIFoiIGZpbGw9InJnYmEoMTQsIDE2NSwgMjMzLCAwLjE1KSIgc3Ryb2tlPSIjMGVhNWU5IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-no-repeat bg-center bg-contain"></div>
            <h1 className="text-3xl font-bold tracking-[0.2em] text-white text-shadow-lg relative z-10 whitespace-nowrap">
              放射驾驶舱
            </h1>
          </div>

          <div className="flex items-center justify-end gap-4 w-1/3">
            <div className="flex items-center gap-1 bg-[#0a1128]/80 p-1 rounded-lg border border-[#1e3a8a] shadow-[inset_0_0_10px_rgba(14,165,233,0.1)]">
              {['全院', '天河院区', '珠玑院区', '同德院区'].map(campus => (
                <button
                  key={campus}
                  onClick={() => setSelectedCampus(campus)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    selectedCampus === campus 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6 z-10">
          {/* Top Row: Workload & Traffic Trend */}
          <div className="col-span-12 lg:col-span-12 grid grid-cols-12 gap-6">
            {/* Workload */}
            <div className="col-span-12 lg:col-span-5 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <PanelTitle title={workloadDrillDown ? `放射服务工作量 - ${workloadDrillDown}` : "放射服务工作量"} />
                {workloadDrillDown && (
                  <button 
                    onClick={() => setWorkloadDrillDown(null)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30 transition-all hover:bg-cyan-500/20"
                  >
                    <ChevronLeft size={12} /> 返回
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
                <KpiBox 
                  title="已检人数" 
                  value={kpiData['已检人数'][selectedCampus.replace('院区', '')]} 
                  trend="up" 
                  trendValue="12.5" 
                  icon={<Users size={20}/>}
                  campusData={selectedCampus === '全院' ? [
                    { name: '天河', value: kpiData['已检人数']['天河'] },
                    { name: '珠玑', value: kpiData['已检人数']['珠玑'] },
                    { name: '同德', value: kpiData['已检人数']['同德'] },
                  ] : null}
                />
                <KpiBox 
                  title="等待人数" 
                  value={kpiData['等待人数'][selectedCampus.replace('院区', '')]} 
                  trend="up" 
                  trendValue="8.2" 
                  icon={<Hourglass size={20}/>}
                  campusData={selectedCampus === '全院' ? [
                    { name: '天河', value: kpiData['等待人数']['天河'] },
                    { name: '珠玑', value: kpiData['等待人数']['珠玑'] },
                    { name: '同德', value: kpiData['等待人数']['同德'] },
                  ] : null}
                />
                <KpiBox 
                  title="预约人数" 
                  value={kpiData['预约人数'][selectedCampus.replace('院区', '')]} 
                  trend="up" 
                  trendValue="15.4" 
                  icon={<Calendar size={20}/>}
                  campusData={selectedCampus === '全院' ? [
                    { name: '天河', value: kpiData['预约人数']['天河'] },
                    { name: '珠玑', value: kpiData['预约人数']['珠玑'] },
                    { name: '同德', value: kpiData['预约人数']['同德'] },
                  ] : null}
                />
              </div>

              <div className="flex h-[260px] relative z-10">
                <div className="w-[55%] h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={currentBarData} 
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      onClick={(data: any) => {
                        if (data && data.activeLabel && (drillDownData as any)[data.activeLabel]) {
                          setWorkloadDrillDown(data.activeLabel as any);
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a8a" opacity={0.3} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(34, 211, 238, 0.05)' }}
                        contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#22d3ee', fontSize: '12px' }}
                      />
                      {selectedCampus === '全院' && (
                        <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
                      )}
                      {selectedCampus === '全院' ? (
                        <>
                          <Bar dataKey="天河" fill="#0ea5e9" barSize={10} radius={[2, 2, 0, 0]} />
                          <Bar dataKey="珠玑" fill="#10b981" barSize={10} radius={[2, 2, 0, 0]} />
                          <Bar dataKey="同德" fill="#3b82f6" barSize={10} radius={[2, 2, 0, 0]} />
                        </>
                      ) : (
                        <Bar dataKey={selectedCampus.replace('院区', '')} fill="#0ea5e9" barSize={20} radius={[2, 2, 0, 0]}>
                          {currentBarData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={(entry as { color?: string }).color || '#0ea5e9'} className="cursor-pointer hover:opacity-80 transition-opacity" />
                          ))}
                        </Bar>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-[45%] h-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={currentDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        onClick={(data: { name?: string }) => {
                          if (data && data.name && drillDownData[data.name]) {
                            setWorkloadDrillDown(data.name);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        {currentDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-white">
                      {Number(currentDonutData.reduce((acc, cur) => acc + Number(cur.value), 0)).toFixed(workloadDrillDown ? 1 : 0)}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">{workloadDrillDown ? '分项' : '总量'}</span>
                  </div>
                  {/* Legend for Donut */}
                  <div className="absolute -right-2 top-0 bottom-0 flex flex-col justify-center gap-2 text-[10px] text-slate-400">
                    {currentDonutData.map(item => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="whitespace-nowrap">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic Trend */}
            <div className="col-span-12 lg:col-span-7 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <PanelTitle title="流量趋势" />
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[10px] text-cyan-400">
                    实时更新
                  </div>
                </div>
              </div>
              <div className="h-[340px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficTrendData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorTianhe" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorZhuji" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTongde" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a8a" opacity={0.2} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a1128', border: '1px solid #1e3a8a', borderRadius: '4px', boxShadow: '0 8px 16px rgba(0,0,0,0.6)' }}
                      itemStyle={{ fontSize: '12px', padding: '2px 0' }}
                    />
                    {selectedCampus === '全院' ? (
                      <>
                        <Area type="monotone" dataKey="天河" name="天河院区" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorTianhe)" dot={{ r: 3, fill: '#0ea5e9' }} activeDot={{ r: 5 }} />
                        <Area type="monotone" dataKey="珠玑" name="珠玑院区" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorZhuji)" dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
                        <Area type="monotone" dataKey="同德" name="同德院区" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTongde)" dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="total" name="全院本周" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3, fill: '#22d3ee' }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="lastWeek" name="全院上周" stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                      </>
                    ) : (
                      <>
                        <Area 
                          type="monotone" 
                          dataKey={selectedCampus.replace('院区', '')} 
                          name={selectedCampus} 
                          stroke="#0ea5e9" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorTianhe)" 
                          dot={{ r: 4, fill: '#0ea5e9' }} 
                          activeDot={{ r: 6 }} 
                        />
                        <Line type="monotone" dataKey="lastWeek" name="上周" stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                      </>
                    )}
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle" 
                      wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '20px' }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          {/* Quality */}
          <div className="col-span-12 lg:col-span-3 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
            <PanelTitle title="放射服务质量" />
            
            <div className="mb-6">
              <div className="text-sm text-slate-300 mb-3">平均报告发布时长 (小时)</div>
              <div className="space-y-3">
                {reportTimeData.map(item => {
                  const campusesToShow = selectedCampus === '全院' ? ['全院', '天河', '珠玑', '同德'] : [selectedCampus];
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="text-xs text-slate-400">{item.name}</div>
                      <div className="space-y-1">
                        {campusesToShow.map(campus => (
                          <div key={campus} className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 w-8">{campus}</span>
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full ${campus === '全院' ? 'bg-amber-500' : 'bg-cyan-500'}`} style={{ width: `${(item[campus as keyof typeof item] as number / 3) * 100}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-white w-6 text-right">{item[campus as keyof typeof item]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cost */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
            <div className="flex-1 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
              <PanelTitle title="放射服务费用" />
              <div className="grid grid-cols-3 gap-4 mb-6">
                <KpiBox 
                  title="今日收入(万元)" 
                  value={kpiData['今日收入'][selectedCampus.replace('院区', '')]} 
                  trend="up" 
                  trendValue="12.5" 
                  campusData={selectedCampus === '全院' ? [
                    { name: '天河', value: kpiData['今日收入']['天河'] },
                    { name: '珠玑', value: kpiData['今日收入']['珠玑'] },
                    { name: '同德', value: kpiData['今日收入']['同德'] },
                  ] : null}
                />
                <KpiBox 
                  title="门诊收入(万元)" 
                  value={kpiData['门诊收入'][selectedCampus.replace('院区', '')]} 
                  trend="up" 
                  trendValue="12.5" 
                  campusData={selectedCampus === '全院' ? [
                    { name: '天河', value: kpiData['门诊收入']['天河'] },
                    { name: '珠玑', value: kpiData['门诊收入']['珠玑'] },
                    { name: '同德', value: kpiData['门诊收入']['同德'] },
                  ] : null}
                />
                <KpiBox 
                  title="住院收入(万元)" 
                  value={kpiData['住院收入'][selectedCampus.replace('院区', '')]} 
                  trend="up" 
                  trendValue="12.5" 
                  campusData={selectedCampus === '全院' ? [
                    { name: '天河', value: kpiData['住院收入']['天河'] },
                    { name: '珠玑', value: kpiData['住院收入']['珠玑'] },
                    { name: '同德', value: kpiData['住院收入']['同德'] },
                  ] : null}
                />
              </div>
              
              <div className="flex gap-4">
                {/* Pie Chart 1: Item Breakdown */}
                <div className="flex-1 relative h-[180px] flex items-center justify-center">
                  <div className="absolute top-0 left-4 text-xs text-slate-400">项目占比</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={costDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {costDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a', color: '#f8fafc' }}
                        itemStyle={{ color: '#e2e8f0' }}
                        formatter={(value: any) => [`${value}%`, '占比']}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  {/* Legend for Donut 1 */}
                  <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-center gap-3 text-xs text-slate-300">
                    {costDonutData.map(item => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie Chart 2: Campus Breakdown (Hidden when specific campus selected) */}
                {selectedCampus === '全院' && (
                  <div className="flex-1 relative h-[180px] flex items-center justify-center">
                    <div className="absolute top-0 left-4 text-xs text-slate-400">院区占比</div>
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={campusCostDonutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {campusCostDonutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a', color: '#f8fafc' }}
                          itemStyle={{ color: '#e2e8f0' }}
                          formatter={(value: any) => [`${value}%`, '占比']}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    {/* Legend for Donut 2 */}
                    <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-center gap-3 text-xs text-slate-300">
                      {campusCostDonutData.map(item => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Radiology Efficiency */}
          <div className="col-span-12 lg:col-span-3 bg-[#0a1128]/80 border border-[#1e3a8a] rounded-sm p-5 relative shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
            <div className="relative">
              <PanelTitle title="放射服务效率" />
              <div className="absolute left-4 top-6 text-[10px] text-slate-400">(平均预约时长 - 小时)</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 mt-4">
              <div className="bg-[#0f172a] p-2 rounded border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400">{selectedCampus}DR</div>
                <div className="text-sm font-bold text-cyan-400">
                  {(() => {
                    const drData = radiologyEfficiencyData.find(d => d.name === 'DR') as Record<string, string | number>;
                    const key = selectedCampus === '全院' ? '全院' : selectedCampus.replace('院区', '');
                    return drData?.[key] || 0;
                  })()}
                </div>
              </div>
              <div className="bg-[#0f172a] p-2 rounded border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400">{selectedCampus}CT</div>
                <div className="text-sm font-bold text-emerald-400">
                  {(() => {
                    const ctData = radiologyEfficiencyData.find(d => d.name === 'CT') as Record<string, string | number>;
                    const key = selectedCampus === '全院' ? '全院' : selectedCampus.replace('院区', '');
                    return ctData?.[key] || 0;
                  })()}
                </div>
              </div>
              <div className="bg-[#0f172a] p-2 rounded border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400">{selectedCampus}MR</div>
                <div className="text-sm font-bold text-amber-400">
                  {(() => {
                    const mrData = radiologyEfficiencyData.find(d => d.name === 'MR') as Record<string, string | number>;
                    const key = selectedCampus === '全院' ? '全院' : selectedCampus.replace('院区', '');
                    return mrData?.[key] || 0;
                  })()}
                </div>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={radiologyEfficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a8a" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a1128', borderColor: '#1e3a8a', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                  {selectedCampus === '全院' ? (
                    <>
                      <Bar dataKey="天河" fill="#0ea5e9" barSize={10} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="珠玑" fill="#10b981" barSize={10} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="同德" fill="#f59e0b" barSize={10} radius={[2, 2, 0, 0]} />
                    </>
                  ) : (
                    <Bar dataKey={selectedCampus.replace('院区', '')} fill="#0ea5e9" barSize={20} radius={[2, 2, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderAttendingGroupKPI = () => {
    // Mock data for Attending Group KPI
    const attendingGroups = [
      { id: 1, name: '张三', type: '内科', score: 95.2, label: '优秀', month: '2026-03' },
      { id: 2, name: '李四', type: '外科', score: 92.8, label: '良好', month: '2026-03' },
      { id: 3, name: '王五', type: '内科', score: 88.5, label: '达标', month: '2026-03' },
      { id: 4, name: '赵六', type: '外科', score: 85.0, label: '达标', month: '2026-03' },
      { id: 5, name: '孙七', type: '内科', score: 78.4, label: '预警', month: '2026-03' },
      { id: 6, name: '周八', type: '外科', score: 75.1, label: '预警', month: '2026-03' },
      { id: 7, name: '吴九', type: '内科', score: 96.5, label: '优秀', month: '2026-03' },
      { id: 8, name: '郑十', type: '外科', score: 89.2, label: '良好', month: '2026-03' },
      { id: 9, name: '张三', type: '内科', score: 94.0, label: '优秀', month: '2026-02' },
      { id: 10, name: '李四', type: '外科', score: 91.5, label: '良好', month: '2026-02' },
    ];

    const filteredGroups = attendingGroups.filter(g => {
      const matchSearch = g.name.includes(kpiSearchQuery);
      const matchType = kpiSelectedType === '全部' || g.type === kpiSelectedType;
      const matchLabel = kpiSelectedLabel === '全部' || g.label === kpiSelectedLabel;
      const matchMonth = !kpiSelectedMonth || kpiSelectedMonth === '全部' || g.month === kpiSelectedMonth;
      return matchSearch && matchType && matchLabel && matchMonth;
    });

    if (kpiSortDirection) {
      filteredGroups.sort((a, b) => {
        if (kpiSortDirection === 'asc') return a.score - b.score;
        return b.score - a.score;
      });
    }

    const selectedDoctor = filteredGroups.find(g => g.id === selectedDoctorId) || filteredGroups[0] || attendingGroups[0];

    // KPI Data based on type
    const internalKPIs = [
      { name: 'CMI', value: '1.25', score: 25, maxScore: 25, icon: Activity },
      { name: '时间消耗指数', value: '0.92', score: 20, maxScore: 25, icon: Hourglass },
      { name: 'RW 总权重值', value: '1500', score: 25, maxScore: 25, icon: Layers },
      { name: '医疗质量安全总得分', value: '98', score: 25.2, maxScore: 25, icon: Check },
    ];

    const surgeryKPIs = [
      { name: '四级手术占比', value: '25%', score: 22, maxScore: 25, icon: PieChart },
      { name: '非计划二次手术率', value: '0.5%', score: 24, maxScore: 25, icon: RotateCcw },
      { name: '床位周转率', value: '95%', score: 23, maxScore: 25, icon: RefreshCw },
      { name: '费用消耗指数', value: '0.88', score: 23.8, maxScore: 25, icon: TrendingUp },
    ];

    const currentKPIs = selectedDoctor.type === '内科' ? internalKPIs : surgeryKPIs;

    return (
      <div className="w-full min-h-full bg-[#f8fafc] p-6 flex flex-col gap-6 font-sans">
        {/* Filter Bar */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索主诊医师..." 
                value={kpiSearchQuery}
                onChange={(e) => setKpiSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 font-medium">模型分类:</label>
              <select 
                value={kpiSelectedType}
                onChange={(e) => setKpiSelectedType(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="全部">全部</option>
                <option value="内科">内科</option>
                <option value="外科">外科</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 font-medium">结论标签:</label>
              <select 
                value={kpiSelectedLabel}
                onChange={(e) => setKpiSelectedLabel(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="全部">全部</option>
                <option value="优秀">优秀</option>
                <option value="良好">良好</option>
                <option value="达标">达标</option>
                <option value="预警">预警</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <Calendar className="text-gray-400" size={16} />
            <input 
              type="month"
              value={kpiSelectedMonth === '全部' ? '' : kpiSelectedMonth}
              onChange={(e) => setKpiSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-sm focus:outline-none cursor-pointer font-medium text-gray-700 w-[110px]"
            />
            {kpiSelectedMonth && kpiSelectedMonth !== '全部' && (
              <button 
                onClick={() => setKpiSelectedMonth('')}
                className="text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                title="清除月份筛选"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6 h-[calc(100vh-210px)]">
          {/* Left Panel: Ranking Table */}
          <div className="w-1/2 bg-white border border-gray-100 rounded-xl p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                全院主诊组效能排行
              </h3>
              <div className="text-sm text-gray-500 flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                共 {filteredGroups.length} 条记录
              </div>
            </div>
            
            <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-gray-100 text-gray-500 text-sm">
                    <th className="py-3 px-2 font-medium">排名</th>
                    <th className="py-3 px-2 font-medium">主诊医师</th>
                    <th className="py-3 px-2 font-medium">模型分类</th>
                    <th 
                      className="py-3 px-2 font-medium cursor-pointer hover:text-blue-600 transition-colors group flex items-center gap-1"
                      onClick={() => setKpiSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                    >
                      效能分
                      <ArrowUpDown size={14} className={`transition-colors ${kpiSortDirection ? 'text-blue-500' : 'text-gray-300 group-hover:text-blue-400'}`} />
                    </th>
                    <th className="py-3 px-2 font-medium">结论标签</th>
                    <th className="py-3 px-2 font-medium">月份</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.length > 0 ? filteredGroups.map((group, index) => (
                    <tr 
                      key={group.id} 
                      onClick={() => setSelectedDoctorId(group.id)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedDoctorId === group.id ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''}`}
                    >
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index < 3 && kpiSortDirection === 'desc' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-medium text-gray-800">{group.name}</td>
                      <td className="py-4 px-2 text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{group.type}</span>
                      </td>
                      <td className="py-4 px-2 font-bold text-gray-900">{group.score}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          group.label === '优秀' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          group.label === '良好' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          group.label === '达标' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {group.label}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-xs text-gray-500 font-mono">{group.month}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        没有找到匹配的数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel: Details */}
          <div className="w-1/2 flex flex-col gap-6">
            {/* Top: Score & Warning */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-blue-100 text-blue-600 shadow-sm">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-3">
                    {selectedDoctor.name} 
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{selectedDoctor.type}</span>
                  </h2>
                  <div className="text-gray-500 text-sm flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {selectedDoctor.month} 月度综合效能分
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8 relative z-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">{selectedDoctor.score}</div>
                  <div className="text-xs text-gray-500 font-medium">总分 100</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    selectedDoctor.label === '预警' ? 'text-red-600' : 
                    selectedDoctor.label === '优秀' ? 'text-emerald-600' :
                    selectedDoctor.label === '良好' ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {selectedDoctor.label}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">效能结论</div>
                </div>
              </div>
            </div>

            {/* Bottom: KPI Indicators */}
            <div className="flex-1 bg-white border border-gray-100 rounded-xl p-6 flex flex-col shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
                  KPI指标详情
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                {currentKPIs.map((kpi, idx) => {
                  const percentage = (kpi.score / kpi.maxScore) * 100;
                  let colorConfig = {
                    bar: 'bg-red-500',
                    text: 'text-red-600',
                    hoverBg: 'group-hover:bg-red-50',
                    hoverText: 'group-hover:text-red-600',
                    hoverBorder: 'group-hover:border-red-100',
                    gradient: 'from-red-50/50',
                    border: 'hover:border-red-200'
                  };
                  
                  if (percentage >= 95) {
                    colorConfig = {
                      bar: 'bg-emerald-500',
                      text: 'text-emerald-600',
                      hoverBg: 'group-hover:bg-emerald-50',
                      hoverText: 'group-hover:text-emerald-600',
                      hoverBorder: 'group-hover:border-emerald-100',
                      gradient: 'from-emerald-50/50',
                      border: 'hover:border-emerald-200'
                    };
                  } else if (percentage >= 90) {
                    colorConfig = {
                      bar: 'bg-blue-500',
                      text: 'text-blue-600',
                      hoverBg: 'group-hover:bg-blue-50',
                      hoverText: 'group-hover:text-blue-600',
                      hoverBorder: 'group-hover:border-blue-100',
                      gradient: 'from-blue-50/50',
                      border: 'hover:border-blue-200'
                    };
                  } else if (percentage >= 80) {
                    colorConfig = {
                      bar: 'bg-amber-500',
                      text: 'text-amber-600',
                      hoverBg: 'group-hover:bg-amber-50',
                      hoverText: 'group-hover:text-amber-600',
                      hoverBorder: 'group-hover:border-amber-100',
                      gradient: 'from-amber-50/50',
                      border: 'hover:border-amber-200'
                    };
                  }

                  return (
                    <div key={idx} className={`bg-white border border-gray-100 p-6 rounded-2xl flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${colorConfig.border} transition-all duration-300 group relative overflow-hidden`}>
                      {/* Subtle background gradient on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 ${colorConfig.hoverText} ${colorConfig.hoverBg} ${colorConfig.hoverBorder} transition-colors`}>
                              <kpi.icon size={16} />
                            </div>
                            <div className="text-gray-600 text-sm font-medium">{kpi.name}</div>
                          </div>
                          <div className={`bg-gray-50 text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-gray-100 ${colorConfig.hoverBg} ${colorConfig.hoverText} ${colorConfig.hoverBorder} transition-colors`}>
                            {kpi.score} <span className="text-[10px] font-normal opacity-70">分</span>
                          </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 tracking-tight mb-6 group-hover:text-gray-950 transition-colors">
                          {kpi.value}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium text-gray-400">
                            <span>达成率</span>
                            <span className={`font-bold ${colorConfig.text}`}>{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colorConfig.bar} rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCockpitDetail = () => {
    if (activeCockpitId === 'lab') return renderLabCockpit();
    if (activeCockpitId === 'exam') return renderExamCockpit();
    if (activeCockpitId === 'surgery') return renderSurgeryCockpit();
    if (activeCockpitId === 'surgery_analysis') return renderSurgeryOperationAnalysisCockpit();
    if (activeCockpitId === 'pathology') return <PathologyCockpit onBack={() => setActiveCockpitId(null)} />;
    if (activeCockpitId === 'dean') return <DeanCockpit onBack={() => setActiveCockpitId(null)} />;

    return (
      <div className="w-full flex-1 min-h-0 overflow-y-auto flex flex-col items-center pt-12 px-8 relative bg-[#f8fafc]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(45deg, #e2e8f0 1px, transparent 1px), linear-gradient(-45deg, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.4
        }}></div>
        
        <div className="relative z-10 w-full max-w-6xl">
          {/* Search Bar */}
          <div className="w-full max-w-4xl mx-auto mb-12 flex bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex-1 flex items-center px-5">
              <Search className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="输入关键词搜索" 
                className="flex-1 outline-none text-gray-600 py-4 text-base bg-transparent" 
              />
            </div>
            <button className="bg-[#2563eb] hover:bg-blue-700 text-white px-12 py-4 font-medium transition-colors text-base tracking-widest">
              搜索
            </button>
          </div>

          {/* Cockpit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: 院长驾驶舱 */}
            <div 
              onClick={() => setActiveCockpitId('dean')}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col"
            >
              <div className="aspect-[16/9] bg-gray-900 relative overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/dash1/800/450" 
                  alt="院长驾驶舱" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="p-5 text-center bg-white">
                <h3 className="text-lg font-medium text-gray-800">院长驾驶舱</h3>
              </div>
            </div>

            {/* Card 2: 检查驾驶舱 */}
            <div 
              onClick={() => setActiveCockpitId('exam')}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col"
            >
              <div className="aspect-[16/9] bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-900/40 z-10"></div>
                <img 
                  src="https://picsum.photos/seed/exam-cockpit/800/450" 
                  alt="检查驾驶舱" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="p-5 text-center bg-white">
                <h3 className="text-lg font-medium text-gray-800">检查驾驶舱</h3>
              </div>
            </div>

            {/* Card 3: 检验驾驶舱 */}
            <div 
              onClick={() => setActiveCockpitId('lab')}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col"
            >
              <div className="aspect-[16/9] bg-blue-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 z-10"></div>
                <img 
                  src="https://picsum.photos/seed/lab-cockpit/800/450" 
                  alt="检验驾驶舱" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white text-sm font-medium">
                      进入驾驶舱
                   </div>
                </div>
              </div>
              <div className="p-5 text-center bg-white">
                <h3 className="text-lg font-medium text-gray-800">检验驾驶舱</h3>
              </div>
            </div>

            {/* Card 4: 手术室监控驾驶舱 */}
            <div 
              onClick={() => setActiveCockpitId('surgery')}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col"
            >
              <div className="aspect-[16/9] bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-900/40 z-10"></div>
                <img 
                  src="https://picsum.photos/seed/surgery-cockpit/800/450" 
                  alt="手术室监控驾驶舱" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white text-sm font-medium">
                      进入驾驶舱
                   </div>
                </div>
              </div>
              <div className="p-5 text-center bg-white">
                <h3 className="text-lg font-medium text-gray-800">手术室监控驾驶舱</h3>
              </div>
            </div>

            {/* Card 5: 手术室运营分析 */}
            <div 
              onClick={() => setActiveCockpitId('surgery_analysis')}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col"
            >
              <div className="aspect-[16/9] bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-900/40 z-10"></div>
                <img 
                  src="https://picsum.photos/seed/surgery-analysis/800/450" 
                  alt="手术室运营分析" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white text-sm font-medium">
                      进入驾驶舱
                   </div>
                </div>
              </div>
              <div className="p-5 text-center bg-white">
                <h3 className="text-lg font-medium text-gray-800">手术室运营分析</h3>
              </div>
            </div>

            {/* Card 6: 病理驾驶舱 */}
            <div 
              onClick={() => setActiveCockpitId('pathology')}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col"
            >
              <div className="aspect-[16/9] bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 z-10"></div>
                <img 
                  src="https://picsum.photos/seed/pathology-cockpit/800/450" 
                  alt="病理驾驶舱" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white text-sm font-medium">
                      进入驾驶舱
                   </div>
                </div>
              </div>
              <div className="p-5 text-center bg-white">
                <h3 className="text-lg font-medium text-gray-800">病理驾驶舱</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReportCenter = () => {
    return (
      <div className="flex flex-col w-full bg-[#f8fafc] min-h-full p-6 gap-6">
        {/* Filter Section */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4">
            {/* Report Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">报告名称</label>
              <input 
                type="text" 
                placeholder="请输入报告名称" 
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">科室</label>
              <div className="relative" ref={deptSelectorRef}>
                <div 
                  className={`w-full px-3 py-2 bg-white border ${isDeptSelectorOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200'} rounded-lg text-sm flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all`}
                  onClick={() => setIsDeptSelectorOpen(!isDeptSelectorOpen)}
                >
                  <span className={selectedDept.length > 0 ? 'text-gray-800' : 'text-gray-500'}>
                    {selectedDept.length > 0 
                      ? (selectedDept.length > 1 ? `已选择 ${selectedDept.length} 个科室` : selectedDept[0]) 
                      : '请选择科室'}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDeptSelectorOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isDeptSelectorOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                      {MOCK_DEPARTMENTS.map(dept => {
                        const isSelected = selectedDept.includes(dept.name);
                        return (
                          <div 
                            key={dept.id}
                            className={`px-3 py-2 text-sm rounded-md cursor-pointer flex items-center justify-between ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            style={{ paddingLeft: `${(dept.level * 12) + 12}px` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isSelected) {
                                setSelectedDept(selectedDept.filter(d => d !== dept.name));
                              } else {
                                setSelectedDept([...selectedDept, dept.name]);
                              }
                            }}
                          >
                            <span>{dept.name}</span>
                            {isSelected && <Check size={14} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Report Time */}
            <div className="flex flex-col gap-1.5 xl:col-span-2">
              <label className="text-sm font-medium text-gray-700">报告时间</label>
              <div className="flex gap-2">
                <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all">年</button>
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all">季</button>
                  <button className="px-3 py-1 text-xs font-medium bg-white text-blue-600 shadow-sm rounded-md transition-all">月</button>
                </div>
                <div className="flex-1 relative">
                   <div className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center gap-2 cursor-pointer hover:border-blue-300 transition-colors">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-700">2025-04</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Report Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">报告类型</label>
              <div className="flex items-center gap-4 h-[38px]">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600">全部</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">全院报告</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">科室报告</span>
                </label>
              </div>
            </div>

            {/* Report Status */}
            <div className="flex flex-col gap-1.5 xl:col-span-2">
              <label className="text-sm font-medium text-gray-700">报告状态</label>
              <div className="flex items-center gap-4 h-[38px]">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600">全部</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">已提交</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">待提交</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">部分提交</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-3 justify-end md:col-span-2 lg:col-span-3 xl:col-span-1">
              <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm font-medium">
                <RotateCcw size={16} />
                重置
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all flex items-center gap-2 text-sm font-medium">
                <Search size={16} />
                查询
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col min-h-[500px] overflow-hidden">
           {/* Tabs: Card/List */}
           <div className="border-b border-gray-100 px-6 pt-4 flex justify-between items-center">
              <div className="flex gap-6">
                 <button className="pb-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-200 transition-all flex items-center gap-2">
                    <LayoutGrid size={16} />
                    卡片视图
                 </button>
                 <button className="pb-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-all flex items-center gap-2">
                    <List size={16} />
                    列表视图
                 </button>
              </div>
              
              {/* Batch Actions */}
              <div>
                <button 
                  disabled={selectedReports.length === 0}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-2 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    // Batch regenerate logic
                    console.log('Batch regenerate:', selectedReports);
                  }}
                >
                  <RefreshCw size={14} />
                  批量重新生成
                </button>
              </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={selectedReports.length === MOCK_REPORTS.length && MOCK_REPORTS.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReports(MOCK_REPORTS.map(r => r.id));
                          } else {
                            setSelectedReports([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-4 font-medium">序号</th>
                    <th className="px-6 py-4 font-medium">报告状态</th>
                    <th className="px-6 py-4 font-medium">报告名称</th>
                    <th className="px-6 py-4 font-medium">报告类型</th>
                    <th className="px-6 py-4 font-medium">科室</th>
                    <th className="px-6 py-4 font-medium">时间类型</th>
                    <th className="px-6 py-4 font-medium">报告时间</th>
                    <th className="px-6 py-4 font-medium">提交时间</th>
                    <th className="px-6 py-4 font-medium">提交人</th>
                    <th className="px-6 py-4 font-medium w-48">查看进度</th>
                    <th className="px-6 py-4 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_REPORTS.map((row, index) => {
                    const isSelected = selectedReports.includes(row.id);
                    return (
                      <tr key={row.id} className={`hover:bg-gray-50/50 transition-colors group ${isSelected ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedReports([...selectedReports, row.id]);
                              } else {
                                setSelectedReports(selectedReports.filter(id => id !== row.id));
                              }
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-sm text-gray-700">已提交</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{row.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.timeType}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{row.reportTime}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{row.submitTime}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.submitter}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.progress}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{row.progressText}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">查看</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
           </div>
           
           {/* Pagination */}
           <div className="mt-auto border-t border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">共 2 条记录</div>
              <div className="flex gap-2">
                 <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-500 disabled:opacity-50" disabled>上一页</button>
                 <button className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded text-sm font-medium">1</button>
                 <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-500 disabled:opacity-50" disabled>下一页</button>
              </div>
           </div>
        </div>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // View 2: Detailed Module View (Full Width with Header Switcher)
  // --------------------------------------------------------------------------
  const renderDetailView = () => {
    const activeModule = MODULES.find(m => m.id === activeModuleId);
    
    return (
      <div className="flex flex-col h-full w-full bg-white relative overflow-hidden">
        
        {/* Modern Header with Module Switcher - Sticky */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 bg-white z-20 sticky top-0 shadow-sm">
           
           {/* Breadcrumb / Switcher Area */}
           <div className="flex items-center gap-2" ref={switcherRef}>
              <button 
                onClick={() => setActiveModuleId(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors px-2 py-1.5 rounded-md hover:bg-gray-50"
              >
                 <Home size={16} />
                 <span className="text-sm font-medium">总览</span>
              </button>
              
              <span className="text-gray-300">/</span>

              <div className="relative">
                <button 
                   onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                   className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-50 group"
                >
                   <div className={`w-5 h-5 rounded flex items-center justify-center text-white bg-gradient-to-br ${activeModule?.gradient} shadow-sm`}>
                      {activeModule && <activeModule.icon size={12} />}
                   </div>
                   <span className="font-bold text-sm">{activeModule?.title}</span>
                   <ChevronDown size={14} className={`text-gray-400 group-hover:text-blue-600 transition-transform duration-200 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* MEGA MENU DROPDOWN */}
                {isSwitcherOpen && (
                   <div className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-xl shadow-xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                         <span>切换功能模块</span>
                         <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">ESC 关闭</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1">
                         {MODULES.map(mod => {
                           const isCurrent = mod.id === activeModuleId;
                           return (
                             <button
                               key={mod.id}
                               onClick={() => {
                                 setActiveModuleId(mod.id);
                                 setIsSwitcherOpen(false);
                               }}
                               className={`
                                  flex items-start gap-3 p-3 rounded-lg text-left transition-all group
                                  ${isCurrent ? 'bg-blue-50 ring-1 ring-blue-100' : 'hover:bg-gray-50'}
                               `}
                             >
                                <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isCurrent ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm group-hover:text-blue-600'}`}>
                                   <mod.icon size={16} />
                                </div>
                                <div>
                                   <div className={`text-sm font-bold ${isCurrent ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                      {mod.title}
                                   </div>
                                   <div className={`text-xs ${isCurrent ? 'text-blue-500/80' : 'text-gray-400 group-hover:text-gray-500'} line-clamp-1`}>
                                      {mod.desc}
                                   </div>
                                </div>
                                {isCurrent && <div className="ml-auto mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
                             </button>
                           )
                         })}
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-50 px-2 flex justify-end">
                         <button 
                           onClick={() => { setActiveModuleId(null); setIsSwitcherOpen(false); }}
                           className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 py-1 px-2 rounded hover:bg-gray-50 transition-colors"
                         >
                            <LayoutGrid size={12} />
                            返回总览看板
                         </button>
                      </div>
                   </div>
                )}
              </div>
           </div>
        </header>

        {/* Full Width Content Area */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-white relative z-0">
           {/* Content Body */}
           <div className={`flex-1 flex flex-col min-h-0 ${activeModuleId === 'cockpit' || activeModuleId === 'er_return_monitor' || activeModuleId === 'doc' || activeModuleId === 'attending-kpi' || activeModuleId === 'theme' || activeModuleId === 'report' ? 'bg-gray-50/30 p-0' : 'p-6 bg-gray-50/30'}`}>
              {activeModuleId === 'cockpit' ? renderCockpitDetail() : 
               activeModuleId === 'er_return_monitor' ? renderERReturnMonitor() : 
               activeModuleId === 'doc' ? renderReportCenter() :
               activeModuleId === 'attending-kpi' ? renderAttendingGroupKPI() :
               activeModuleId === 'theme' ? renderThemeAnalysis() :
               activeModuleId === 'talent' ? renderTalentDevelopment() :
               activeModuleId === 'report' ? <StatisticalReport /> :
               renderGenericDetail()}
           </div>
        </main>
      </div>
    );
  };

  const renderTalentDevelopment = () => {
    if (selectedTalentPlanId) {
      return renderTalentAnalysisDetail();
    }

    const plans = [
      {
        id: 'p1',
        title: '2024年度学科综合考评方案',
        desc: '全院临床学科年度绩效考核，重点关注CMI与科研产出。',
        status: '进行中',
        system: '临床医疗体系',
        type: '年度考核',
        updateTime: '2024-01-15',
        statusColor: 'text-blue-600 bg-blue-50 border-blue-100'
      },
      {
        id: 'p2',
        title: '2024年Q1医疗组长绩效考核',
        desc: '针对医疗组长的季度业务能力评估。',
        status: '进行中',
        system: '个人 (医疗组长)',
        type: '季度考核',
        updateTime: '2024-03-20',
        statusColor: 'text-blue-600 bg-blue-50 border-blue-100'
      },
      {
        id: 'p3',
        title: '2023年度学科综合考评方案',
        desc: '暂无描述',
        status: '已归档',
        system: '临床医疗体系',
        type: '年度考核',
        updateTime: '2023-12-10',
        statusColor: 'text-gray-500 bg-gray-100 border-gray-200'
      }
    ];

    return (
      <div className="flex-1 flex flex-col bg-gray-50/50 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4 border border-blue-100">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
              考评分析
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">选择考评方案</h1>
            <p className="text-gray-500 text-lg">请选择一个已发布的考评方案以查看详细分析报告。</p>
          </div>

          {/* Plan Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => setSelectedTalentPlanId(plan.id)}
                className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                    <FileText size={28} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${plan.statusColor}`}>
                    {plan.status === '进行中' && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
                    {plan.status}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{plan.title}</h3>
                <p className="text-sm text-gray-500 mb-8 line-clamp-2 flex-1">{plan.desc}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-sm">{plan.system}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm">{plan.type}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-400">更新于 {plan.updateTime}</span>
                  <div className="flex items-center gap-1 text-blue-600 font-bold text-sm group-hover:gap-2 transition-all">
                    进入分析
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTalentAnalysisDetail = () => {
    const plan = [
      { id: 'p1', title: '2024年度学科综合考评方案', updatedAt: '2024-01-15', cycle: '年度', targetName: '临床医疗体系' },
      { id: 'p2', title: '2024年Q1医疗组长绩效考核', updatedAt: '2024-03-20', cycle: '季度', targetName: '个人 (医疗组长)' },
      { id: 'p3', title: '2023年度学科综合考评方案', updatedAt: '2023-12-10', cycle: '年度', targetName: '临床医疗体系' }
    ].find(p => p.id === selectedTalentPlanId);

    const rawAssessments = MOCK_ASSESSMENTS.filter(a => a.schemeId === selectedTalentPlanId);

    if (rawAssessments.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
            <AlertCircle size={48} className="mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-gray-900">暂无考评数据</h3>
            <p className="text-gray-500 mt-2">方案“{plan?.title}”暂无任何考评结果数据。</p>
            <button onClick={() => setSelectedTalentPlanId(null)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                返回方案列表
            </button>
        </div>
      );
    }

    // --- Lateral View Logic ---
    const processedAssessments = [...rawAssessments]
      .filter(item => talentCategoryFilter === 'All' || getCategory(item.targetName) === talentCategoryFilter)
      .sort((a, b) => {
        const valA = talentSortField === 'totalScore' ? a.totalScore : (a.dimensions as any)[talentSortField]?.score || 0;
        const valB = talentSortField === 'totalScore' ? b.totalScore : (b.dimensions as any)[talentSortField]?.score || 0;
        return talentSortOrder === 'asc' ? valA - valB : valB - valA;
      });

    const comparisonData = talentCompareList.length > 0 
      ? processedAssessments.filter(a => talentCompareList.includes(a.id))
      : processedAssessments.slice(0, 5);

    const multiBarData = comparisonData.map(item => ({
        name: item.targetName,
        总分: item.totalScore,
        医疗: item.dimensions.medical.score,
        质量: item.dimensions.quality.score,
        科研: item.dimensions.research.score,
        教学: item.dimensions.teaching.score,
        效率: item.dimensions.efficiency.score,
    }));

    const radarComparisonData = [
        { key: 'medical', name: '医疗能力' },
        { key: 'quality', name: '质量安全' },
        { key: 'research', name: '科研产出' },
        { key: 'teaching', name: '教学培养' },
        { key: 'efficiency', name: '运营效率' },
    ].map(subj => {
        const point: any = { subject: subj.name, fullMark: 100 };
        comparisonData.forEach(item => {
            point[item.targetName] = (item.dimensions as any)[subj.key]?.score || 0;
        });
        return point;
    });

    const CHART_COLORS = ['#0052FF', '#10B981', '#A855F7', '#F59E0B', '#EC4899'];

    // --- Longitudinal View Logic ---
    const currentTrendTarget = rawAssessments.find(a => a.targetId === talentTrendTargetId) || rawAssessments[0];
    const trendData = generateHistoryData(currentTrendTarget);
    const indicatorHistoryData = generateIndicatorHistory();
    const selectedIndicatorTrend = indicatorHistoryData.find(i => i.id === talentSelectedIndicatorId) || indicatorHistoryData[0];
    const aiInsight = getAiInsight(currentTrendTarget.targetName, currentTrendTarget.totalScore);

    const growthDrivers = (() => {
        if (trendData.length < 2) return null;
        const current = trendData[trendData.length - 1];
        const previous = trendData[trendData.length - 2];
        const diffs = [
            { key: 'medical', name: '医疗能力', val: current.medical - previous.medical },
            { key: 'quality', name: '质量安全', val: current.quality - previous.quality },
            { key: 'research', name: '科研产出', val: current.research - previous.research },
            { key: 'teaching', name: '教学培养', val: current.teaching - previous.teaching },
            { key: 'efficiency', name: '运营效率', val: current.efficiency - previous.efficiency },
        ].map(d => ({...d, val: Number(d.val.toFixed(1))}));
        diffs.sort((a, b) => Math.abs(b.val) - Math.abs(a.val));
        return { totalDiff: Number((current.score - previous.score).toFixed(1)), diffs, maxVal: Math.max(...diffs.map(d => Math.abs(d.val))), prevYear: previous.year, currYear: current.year };
    })();

    // --- Matrix View Logic ---
    const catchUpData = rawAssessments.map(a => {
        const history = generateHistoryData(a);
        const start = history[0].score;
        const end = history[history.length - 1].score;
        const cagr = Math.pow(end / start, 1/4) - 1;
        return { id: a.id, name: a.targetName, score: a.totalScore, cagr: cagr * 100, category: getCategory(a.targetName) };
    });

    const structuralData = rawAssessments.map(a => {
        const dims = a.dimensions as any;
        const v1 = dims[talentStructureDims[0]]?.score || 0;
        const v2 = dims[talentStructureDims[1]]?.score || 0;
        const v3 = dims[talentStructureDims[2]]?.score || 0;
        const history = generateHistoryData(a);
        const prev = history[history.length - 2] || history[history.length - 1];
        return { id: a.id, name: a.targetName, category: getCategory(a.targetName), v1, v2, v3, prevV1: (prev as any)[talentStructureDims[0]], prevV2: (prev as any)[talentStructureDims[1]], prevV3: (prev as any)[talentStructureDims[2]] };
    });

    // --- Strategy View Logic ---
    const strategyData = (() => {
        const total = rawAssessments.length;
        const leading = rawAssessments.filter(a => a.totalScore >= 90).length;
        const potential = rawAssessments.filter(a => a.totalScore >= 80 && a.totalScore < 90).length;
        const warning = rawAssessments.filter(a => a.totalScore < 80).length;
        
        const categories = ['内科系', '外科系', '医技系', '其他'];
        const treemapData = categories.map(cat => ({
            name: cat,
            children: rawAssessments.filter(a => getCategory(a.targetName) === cat).map(a => ({
                name: a.targetName,
                size: a.totalScore,
                score: a.totalScore,
                category: cat
            }))
        })).filter(c => c.children.length > 0);

        const avgMedical = rawAssessments.reduce((sum, a) => sum + (a.dimensions.medical?.score || 0), 0) / (total || 1);
        const avgQuality = rawAssessments.reduce((sum, a) => sum + (a.dimensions.quality?.score || 0), 0) / (total || 1);
        const avgResearch = rawAssessments.reduce((sum, a) => sum + (a.dimensions.research?.score || 0), 0) / (total || 1);
        const avgTeaching = rawAssessments.reduce((sum, a) => sum + (a.dimensions.teaching?.score || 0), 0) / (total || 1);
        const avgEfficiency = rawAssessments.reduce((sum, a) => sum + (a.dimensions.efficiency?.score || 0), 0) / (total || 1);

        const radarData = [
            { subject: '医疗能力', A: Number(avgMedical.toFixed(1)), fullMark: 100 },
            { subject: '质量安全', A: Number(avgQuality.toFixed(1)), fullMark: 100 },
            { subject: '科研产出', A: Number(avgResearch.toFixed(1)), fullMark: 100 },
            { subject: '教学培养', A: Number(avgTeaching.toFixed(1)), fullMark: 100 },
            { subject: '运营效率', A: Number(avgEfficiency.toFixed(1)), fullMark: 100 },
        ];

        return { total, leading, potential, warning, treemapData, radarData };
    })();

    return (
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Sub Header */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-gray-50/30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedTalentPlanId(null)}
              className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex flex-col">
                <h2 className="font-bold text-gray-800 text-sm">{plan?.title}</h2>
                <span className="text-[10px] text-gray-400">最后更新: {plan?.updatedAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download size={14} />
              导出报告
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-6 border-b border-gray-100 flex gap-8 bg-white shrink-0">
            {[
                { id: 'strategy', label: '全院学科战略视图 (Strategy)', icon: Target },
                { id: 'lateral', label: '横向对比 (Rank)', icon: BarChart3 },
                { id: 'longitudinal', label: '纵向趋势 (Trend)', icon: TrendingUp },
                { id: 'matrix', label: '综合矩阵 (Matrix)', icon: LayoutGrid },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setTalentActiveView(tab.id as AnalysisView)}
                    className={`flex items-center gap-2 pb-3 pt-4 text-sm font-medium transition-all relative ${talentActiveView === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                    {talentActiveView === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
            <AnimatePresence mode="wait">
                {talentActiveView === 'strategy' && (
                    <motion.div 
                        key="strategy"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Top Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium">参评学科总数</div>
                                    <div className="text-2xl font-bold text-gray-800">{strategyData.total}</div>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium">优势学科 (≥90分)</div>
                                    <div className="text-2xl font-bold text-gray-800">{strategyData.leading}</div>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium">潜力学科 (80-89分)</div>
                                    <div className="text-2xl font-bold text-gray-800">{strategyData.potential}</div>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium">预警学科 (&lt;80分)</div>
                                    <div className="text-2xl font-bold text-gray-800">{strategyData.warning}</div>
                                </div>
                            </div>
                        </div>

                        {/* Main Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Treemap */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <LayoutGrid size={18} className="text-blue-600" />
                                        学科生态分布 (规模与绩效)
                                    </h3>
                                    <span className="text-xs text-gray-400">面积代表综合得分，颜色代表学科分类</span>
                                </div>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <Treemap
                                            data={strategyData.treemapData}
                                            dataKey="size"
                                            aspectRatio={4 / 3}
                                            stroke="#fff"
                                            fill="#8884d8"
                                            content={(props: any) => {
                                                const { depth, x, y, width, height, name, category, score } = props;
                                                if (depth === 2) {
                                                    const color = CATEGORY_COLORS[category] || '#94a3b8';
                                                    return (
                                                        <g>
                                                            <rect
                                                                x={x}
                                                                y={y}
                                                                width={width}
                                                                height={height}
                                                                style={{
                                                                    fill: color,
                                                                    stroke: '#fff',
                                                                    strokeWidth: 2,
                                                                    strokeOpacity: 1,
                                                                    fillOpacity: 0.8,
                                                                }}
                                                            />
                                                            {width > 50 && height > 30 && (
                                                                <>
                                                                    <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle" fill="#fff" fontSize={12} fontWeight="bold">
                                                                        {name}
                                                                    </text>
                                                                    <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle" fill="#fff" fontSize={10} opacity={0.9}>
                                                                        {score?.toFixed(1)}分
                                                                    </text>
                                                                </>
                                                            )}
                                                        </g>
                                                    );
                                                }
                                                return <g />;
                                            }}
                                        >
                                            <Tooltip 
                                                formatter={(value: any, name: any, props: any) => [
                                                    `${props.payload.score?.toFixed(1)}分`, 
                                                    '综合得分'
                                                ]}
                                            />
                                        </Treemap>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Radar Chart */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Crosshair size={18} className="text-purple-600" />
                                        全院核心能力画像
                                    </h3>
                                </div>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={strategyData.radarData}>
                                            <PolarGrid stroke="#e2e8f0" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                            <Radar name="全院平均" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                                            <Tooltip />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Strategic Insights */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <Lightbulb size={18} className="text-amber-500" />
                                战略发展建议 (AI 生成)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <span className="text-xs font-bold">1</span>
                                        </div>
                                        <h4 className="font-bold text-blue-900 text-sm">科研转化亟待突破</h4>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        全院科研产出平均得分（{strategyData.radarData.find(d => d.subject === '科研产出')?.A}分）为各项能力最低。建议设立专项科研基金，重点扶持心血管内科、神经外科等优势临床学科开展转化医学研究，提升SCI论文质量及国家级课题中标率。
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <span className="text-xs font-bold">2</span>
                                        </div>
                                        <h4 className="font-bold text-emerald-900 text-sm">医疗质量保持高位</h4>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        质量安全维度整体表现优异，平均得分（{strategyData.radarData.find(d => d.subject === '质量安全')?.A}分）。放射科、检验科等医技科室发挥了关键支撑作用。建议总结其质控经验，向全院推广标准化SOP。
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                            <span className="text-xs font-bold">3</span>
                                        </div>
                                        <h4 className="font-bold text-purple-900 text-sm">学科结构需优化</h4>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        当前存在 {strategyData.warning} 个预警学科（得分&lt;80），主要集中在部分传统内科及辅助科室。建议启动“学科结对帮扶”计划，由优势学科带动弱势学科，优化整体学科群落生态。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {talentActiveView === 'lateral' && (
                    <motion.div 
                        key="lateral"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Control Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Filter size={16} />
                                    <span className="font-bold">分类筛选:</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {['All', '内科系', '外科系', '医技系'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setTalentCategoryFilter(cat)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${talentCategoryFilter === cat ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            {cat === 'All' ? '全部' : cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {talentCompareList.length > 0 && (
                                <div className="flex items-center gap-3 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                    <span className="text-xs font-bold text-blue-600">已选 {talentCompareList.length} 个对比对象</span>
                                    <button onClick={() => setTalentCompareList([])} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Collapsible Charts Section */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <button 
                                onClick={() => setTalentShowCharts(!talentShowCharts)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <PieChartIcon size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-gray-800">多维能力与画像对比</h3>
                                    <span className="text-xs text-gray-400 font-normal ml-2">
                                        {talentShowCharts ? '点击收起图表' : '点击展开深度对比图表'}
                                    </span>
                                </div>
                                <div className={`transition-transform duration-300 ${talentShowCharts ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={20} className="text-gray-400" />
                                </div>
                            </button>

                            <AnimatePresence>
                                {talentShowCharts && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 grid grid-cols-1 xl:grid-cols-2 gap-6 border-t border-gray-50">
                                            <div className="pt-6">
                                                <h3 className="font-bold text-gray-800 mb-1 text-sm">多维能力对比</h3>
                                                <p className="text-[10px] text-gray-400 mb-6">各考核维度的得分分布情况</p>
                                                <div className="h-[300px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={multiBarData}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 100]} />
                                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                                            <Bar dataKey="医疗" fill="#0052FF" radius={[4, 4, 0, 0]} barSize={20} />
                                                            <Bar dataKey="科研" fill="#A855F7" radius={[4, 4, 0, 0]} barSize={20} />
                                                            <Bar dataKey="质量" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                            <div className="pt-6">
                                                <h3 className="font-bold text-gray-800 mb-1 text-sm">综合画像重叠</h3>
                                                <p className="text-[10px] text-gray-400 mb-6">识别优势领域与短板差异</p>
                                                <div className="h-[300px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarComparisonData}>
                                                            <PolarGrid stroke="#e2e8f0" />
                                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
                                                            <Tooltip />
                                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                                            {comparisonData.map((item, index) => (
                                                                <Radar
                                                                    key={item.id}
                                                                    name={item.targetName}
                                                                    dataKey={item.targetName}
                                                                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                                                                    strokeWidth={2}
                                                                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                                    fillOpacity={0.1}
                                                                />
                                                            ))}
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">考评数据明细</h3>
                                <div className="flex items-center gap-4 text-[10px]">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> 优秀 (&gt;95)</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> 预警 (&lt;75)</div>
                                    <div className="text-gray-400 ml-4">点击行展开查看指标详情</div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                            <th className="py-3 pl-6 w-10"></th>
                                            <th className="py-3 w-10">对比</th>
                                            <th className="py-3 font-bold">
                                                <div className="flex items-center gap-1">
                                                    排名/对象 <ArrowDown size={12} className="text-blue-600" />
                                                </div>
                                            </th>
                                            <th className="py-3 font-bold text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    总得分 <ArrowDown size={12} className="text-blue-600" />
                                                </div>
                                            </th>
                                            <th className="py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    医疗能力 <ArrowUpDown size={12} className="text-gray-200" />
                                                </div>
                                            </th>
                                            <th className="py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    质量安全 <ArrowUpDown size={12} className="text-gray-200" />
                                                </div>
                                            </th>
                                            <th className="py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    科研产出 <ArrowUpDown size={12} className="text-gray-200" />
                                                </div>
                                            </th>
                                            <th className="py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    教学培养 <ArrowUpDown size={12} className="text-gray-200" />
                                                </div>
                                            </th>
                                            <th className="py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    运营效率 <ArrowUpDown size={12} className="text-gray-200" />
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {processedAssessments.map((item) => (
                                            <React.Fragment key={item.id}>
                                                <tr 
                                                    onClick={() => setTalentExpandedRowId(talentExpandedRowId === item.id ? null : item.id)}
                                                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${talentExpandedRowId === item.id ? 'bg-blue-50/30' : ''} ${talentCompareList.includes(item.id) ? 'bg-blue-50/50' : ''}`}
                                                >
                                                    <td className="py-4 pl-6 text-gray-300">
                                                        {talentExpandedRowId === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                    </td>
                                                    <td className="py-4">
                                                        <div 
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                if (talentCompareList.includes(item.id)) {
                                                                    setTalentCompareList(prev => prev.filter(id => id !== item.id));
                                                                } else if (talentCompareList.length < 5) {
                                                                    setTalentCompareList(prev => [...prev, item.id]);
                                                                }
                                                            }}
                                                            className="cursor-pointer text-gray-300 hover:text-blue-600"
                                                        >
                                                            {talentCompareList.includes(item.id) ? <CheckCircle size={18} className="text-blue-600"/> : <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-200" />}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono text-xs text-gray-400 w-6">#{item.rank}</span>
                                                            <div>
                                                                <div className="text-gray-900">{item.targetName}</div>
                                                                <div className="text-[10px] text-gray-400 font-normal">{getCategory(item.targetName)}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-right font-bold text-blue-600 font-mono text-lg">{item.totalScore}</td>
                                                    {['medical', 'quality', 'research', 'teaching', 'efficiency'].map((dimKey) => {
                                                        const score = (item.dimensions as any)[dimKey]?.score || 0;
                                                        return (
                                                            <td key={dimKey} className="py-4 text-center">
                                                                <span className={`font-medium ${score >= 95 ? 'text-emerald-600' : score < 75 ? 'text-red-600' : 'text-gray-600'}`}>
                                                                    {score}
                                                                </span>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                                {talentExpandedRowId === item.id && (
                                                    <tr>
                                                        <td colSpan={9} className="p-0 border-b border-gray-100">
                                                            <motion.div 
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                className="bg-gray-50/50 p-6"
                                                            >
                                                                <h4 className="font-bold text-sm mb-6 text-gray-800">指标得分明细 ({item.targetName})</h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                                                    {['medical', 'quality', 'research', 'teaching', 'efficiency'].map((dimKey) => {
                                                                        const dim = (item.dimensions as any)[dimKey];
                                                                        const colorMap: any = {
                                                                            medical: { text: 'text-blue-600', bg: 'bg-blue-50' },
                                                                            quality: { text: 'text-emerald-600', bg: 'bg-emerald-50' },
                                                                            research: { text: 'text-purple-600', bg: 'bg-purple-50' },
                                                                            teaching: { text: 'text-cyan-600', bg: 'bg-cyan-50' },
                                                                            efficiency: { text: 'text-orange-500', bg: 'bg-orange-50' },
                                                                        };
                                                                        const theme = colorMap[dimKey];
                                                                        return (
                                                                            <div key={dimKey} className="flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                                                                                <div className={`px-4 py-3 flex justify-between items-center ${theme.bg}`}>
                                                                                    <span className={`font-bold text-sm ${theme.text}`}>{dim.label}</span>
                                                                                    <span className={`font-bold text-xl ${theme.text}`}>{dim.score}</span>
                                                                                </div>
                                                                                <div className="flex-1 p-4 space-y-5">
                                                                                    {dim.indicators && dim.indicators.length > 0 ? dim.indicators.map((ind: any) => (
                                                                                        <div key={ind.id} className="space-y-2">
                                                                                            <div className="flex justify-between items-baseline">
                                                                                                <span className="text-sm font-medium text-gray-700">{ind.label}</span>
                                                                                                <span className="text-sm font-bold text-gray-800">{ind.score}分</span>
                                                                                            </div>
                                                                                            <div className="flex justify-between text-xs text-gray-400">
                                                                                                <span>值: {ind.rawValue}</span>
                                                                                                <span>权: {ind.weight}</span>
                                                                                            </div>
                                                                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                                                <motion.div 
                                                                                                    initial={{ width: 0 }}
                                                                                                    animate={{ width: `${ind.score}%` }}
                                                                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                                                                    className="h-full bg-emerald-400"
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    )) : (
                                                                                        <div className="text-xs text-gray-400 text-center py-4">暂无指标明细数据</div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {talentActiveView === 'longitudinal' && (
                    <motion.div 
                        key="longitudinal"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                <label className="text-[10px] font-bold uppercase text-gray-400 mb-2">分析对象</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/20"
                                    value={talentTrendTargetId}
                                    onChange={(e) => setTalentTrendTargetId(e.target.value)}
                                >
                                    {rawAssessments.map(a => (
                                        <option key={a.targetId} value={a.targetId}>{a.targetName}</option>
                                    ))}
                                </select>
                                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-50">
                                    <div>
                                        <div className="text-[10px] text-gray-400 mb-1">当前得分 (2024)</div>
                                        <div className="text-3xl font-bold font-mono text-blue-600">{currentTrendTarget.totalScore}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 mb-1">复合增长率</div>
                                        <div className="text-3xl font-bold font-mono text-emerald-600">+4.2%</div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-white">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Sparkles size={120} className="text-blue-600" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                            <BrainCircuit size={18} />
                                        </div>
                                        <h3 className="font-bold text-blue-900">AI 智能决策辅助</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${aiInsight.color}`}>
                                            {aiInsight.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{aiInsight.analysis}</p>
                                    <div className="bg-white/80 p-3 rounded-lg border border-blue-100 flex gap-3 shadow-sm">
                                        <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                        <div className="text-xs text-gray-700">
                                            <span className="font-bold text-blue-900">管理建议：</span>
                                            {aiInsight.suggestion}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-6">绩效总分趋势与归因</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 h-[300px] border-r border-dashed border-gray-100 pr-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                            <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                            <Tooltip labelFormatter={(label) => `${label}年度`} />
                                            <Line type="monotone" dataKey="score" name="总得分" stroke="#0052FF" strokeWidth={3} dot={{r: 4, fill:'#0052FF', strokeWidth:2, stroke:'#fff'}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="lg:col-span-1 flex flex-col justify-center">
                                    {growthDrivers && (
                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">年度变化 ({growthDrivers.prevYear} → {growthDrivers.currYear})</div>
                                                <div className={`text-4xl font-mono font-bold flex items-center gap-2 ${growthDrivers.totalDiff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {growthDrivers.totalDiff > 0 ? '+' : ''}{growthDrivers.totalDiff}
                                                    {growthDrivers.totalDiff >= 0 ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {growthDrivers.diffs.map(d => (
                                                    <div key={d.key}>
                                                        <div className="flex justify-between text-[10px] mb-1">
                                                            <span className="text-gray-500">{d.name}</span>
                                                            <span className={`font-bold ${d.val >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{d.val > 0 ? '+' : ''}{d.val}</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden relative">
                                                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 z-10"></div>
                                                            <div 
                                                                className={`h-full absolute ${d.val >= 0 ? 'bg-emerald-500 left-1/2' : 'bg-red-500 right-1/2'}`} 
                                                                style={{ width: `${(Math.abs(d.val) / growthDrivers.maxVal) * 50}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800">关键能力维度演变</h3>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button 
                                        onClick={() => setTalentEvolutionChartMode('normalized')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${talentEvolutionChartMode === 'normalized' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                                    >
                                        占比 (100%)
                                    </button>
                                    <button 
                                        onClick={() => setTalentEvolutionChartMode('stacked')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${talentEvolutionChartMode === 'stacked' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                                    >
                                        数值 (Stack)
                                    </button>
                                </div>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={trendData} stackOffset={talentEvolutionChartMode === 'normalized' ? 'expand' : 'none'}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => talentEvolutionChartMode === 'normalized' ? `${(val * 100).toFixed(0)}%` : val} />
                                        <Tooltip 
                                            formatter={(value: any, name: string | undefined) => {
                                                if (!name) return [null, null];
                                                const val = talentEvolutionChartMode === 'normalized' ? `${(Number(value) * 100).toFixed(1)}%` : value;
                                                return [val, name];
                                            }}
                                            labelFormatter={(label) => `${label}年度`}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                        {[
                                            { key: 'medical', name: '医疗能力', color: '#0052FF' },
                                            { key: 'quality', name: '质量安全', color: '#10B981' },
                                            { key: 'research', name: '科研产出', color: '#A855F7' },
                                            { key: 'teaching', name: '教学培养', color: '#06b6d4' },
                                            { key: 'efficiency', name: '运营效率', color: '#f59e0b' },
                                        ].map(dim => (
                                            <React.Fragment key={dim.key}>
                                                <Area 
                                                    type="monotone" 
                                                    dataKey={dim.key} 
                                                    stackId="a" 
                                                    fill={dim.color} 
                                                    stroke="none" 
                                                    fillOpacity={0.1} 
                                                    legendType="none" 
                                                    activeDot={false}
                                                    name="" // Empty name to filter out in formatter
                                                />
                                                <Bar dataKey={dim.key} name={dim.name} stackId="b" fill={dim.color} barSize={30} />
                                            </React.Fragment>
                                        ))}
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-1">核心指标趋势热力图</h3>
                            <p className="text-xs text-gray-400 mb-6">点击单元格查看具体指标的时间序列分析</p>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 overflow-x-auto">
                                    <div className="min-w-[500px]">
                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                            <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase text-right pr-4">指标名称</div>
                                            {['2020', '2021', '2022', '2023', '2024'].map(year => (
                                                <div key={year} className="col-span-1 text-center text-[10px] font-bold text-gray-500">{year}</div>
                                            ))}
                                        </div>
                                        <div className="space-y-1">
                                            {indicatorHistoryData.map(ind => (
                                                <div 
                                                    key={ind.id} 
                                                    className={`grid grid-cols-7 gap-1 items-center p-1 rounded-lg transition-colors cursor-pointer ${talentSelectedIndicatorId === ind.id ? 'bg-blue-50 ring-1 ring-blue-100' : 'hover:bg-gray-50'}`}
                                                    onClick={() => setTalentSelectedIndicatorId(ind.id)}
                                                >
                                                    <div className="col-span-2 text-right pr-4">
                                                        <div className={`text-xs font-bold ${talentSelectedIndicatorId === ind.id ? 'text-blue-600' : 'text-gray-700'}`}>{ind.name}</div>
                                                        <div className="text-[9px] text-gray-400">{ind.category}</div>
                                                    </div>
                                                    {ind.history.map(point => (
                                                        <div key={point.year} className="col-span-1 flex justify-center group relative">
                                                            <div 
                                                                className={`w-full h-8 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-all hover:scale-105 ${point.score >= 90 ? 'bg-emerald-500' : point.score >= 80 ? 'bg-blue-500' : point.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                            >
                                                                {point.score}
                                                            </div>
                                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                                                                {point.year}: {point.rawValue}{ind.unit}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-1 bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center min-h-[250px]">
                                    <div className="mb-4 pb-4 border-b border-gray-200">
                                        <div className="text-[9px] font-bold text-gray-400 uppercase mb-1">{selectedIndicatorTrend.category}</div>
                                        <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            {selectedIndicatorTrend.name}
                                            <span className="text-[9px] px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-500">单位: {selectedIndicatorTrend.unit || '无'}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={selectedIndicatorTrend.history}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="year" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                                                <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={20} />
                                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={20}/>
                                                <Tooltip labelFormatter={(label) => `${label}年度`} />
                                                <Area yAxisId="left" type="monotone" dataKey="score" name="绩效得分" fill="#BFD0FF" stroke="none" />
                                                <Line yAxisId="right" type="monotone" dataKey="rawValue" name="原始数值" stroke="#0052FF" strokeWidth={2} dot={{ r: 3 }} />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                                            <div className="text-[8px] text-gray-400 bg-white/80 px-2 py-0.5 rounded border border-gray-100">
                                                蓝色曲线:指标结果 | 蓝灰色背景:绩效得分
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {talentActiveView === 'matrix' && (
                    <motion.div 
                        key="matrix"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <div>
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Crosshair size={18} className="text-blue-600"/> 追赶识别矩阵
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">X轴：当前绩效得分 | Y轴：复合增长率(CAGR)</p>
                                </div>
                                <div className="flex flex-wrap gap-2 text-[10px]">
                                     <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold">领跑</div>
                                     <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 border border-blue-100 text-blue-700 font-bold">追赶</div>
                                     <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 border border-amber-100 text-amber-700 font-bold">滞涨</div>
                                     <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-50 border border-gray-200 text-gray-600 font-bold">掉队</div>
                                </div>
                            </div>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" dataKey="score" name="当前绩效" domain={[60, 100]} tick={{fontSize: 10}} />
                                        <YAxis type="number" dataKey="cagr" name="增长率" unit="%" domain={[-4, 12]} tick={{fontSize: 10}} />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                        <ReferenceArea x1={60} x2={85} y1={5} y2={12} fill="#3b82f6" fillOpacity={0.03} />
                                        <ReferenceArea x1={85} x2={100} y1={5} y2={12} fill="#10b981" fillOpacity={0.03} />
                                        <ReferenceArea x1={60} x2={85} y1={-4} y2={5} fill="#f1f5f9" fillOpacity={0.2} />
                                        <ReferenceArea x1={85} x2={100} y1={-4} y2={5} fill="#f59e0b" fillOpacity={0.03} />
                                        <ReferenceLine x={85} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                                        <ReferenceLine y={5} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                                        <Scatter name="Disciplines" data={catchUpData}>
                                            {catchUpData.map((entry, index) => {
                                                let color = '#94a3b8';
                                                if (entry.score >= 85 && entry.cagr >= 5) color = '#10B981';
                                                else if (entry.score < 85 && entry.cagr >= 5) color = '#0052FF';
                                                else if (entry.score >= 85 && entry.cagr < 5) color = '#F59E0B';
                                                return <Cell key={`cell-${index}`} fill={color} />;
                                            })}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <div>
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Split size={18} className="text-purple-600" /> 结构分化识别 (三角分布)
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">点靠近顶点代表该维度优势显著</p>
                                </div>
                                <div className="flex items-center gap-3 text-[10px]">
                                     {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                                         <div key={cat} className="flex items-center gap-1.5">
                                             <div className="w-2 h-2 rounded-full" style={{backgroundColor: color}}></div>
                                             <span className="text-gray-500">{cat}</span>
                                         </div>
                                     ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-12 md:col-span-2 flex flex-col gap-4 border-r border-gray-50 pr-4">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">分析维度 (选3项)</label>
                                    <div className="space-y-1">
                                        {[
                                            { key: 'medical', label: '医疗' },
                                            { key: 'quality', label: '质量' },
                                            { key: 'research', label: '科研' },
                                            { key: 'teaching', label: '教学' },
                                            { key: 'efficiency', label: '效率' },
                                        ].map(d => {
                                            const isSelected = talentStructureDims.includes(d.key);
                                            return (
                                                <div 
                                                    key={d.key}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            if (talentStructureDims.length > 1) setTalentStructureDims(prev => prev.filter(k => k !== d.key));
                                                        } else if (talentStructureDims.length < 3) {
                                                            setTalentStructureDims(prev => [...prev, d.key]);
                                                        } else {
                                                            setTalentStructureDims(prev => [...prev.slice(1), d.key]);
                                                        }
                                                    }}
                                                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${isSelected ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50 text-gray-500'}`}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white'}`}>
                                                        {isSelected && <Check size={10} />}
                                                    </div>
                                                    <span className="text-xs">{d.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button 
                                        onClick={() => setTalentShowTrajectory(!talentShowTrajectory)}
                                        className={`mt-auto w-full flex items-center justify-between p-2 rounded text-[10px] transition-all border ${talentShowTrajectory ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-600'}`}
                                    >
                                        <span>显示演变轨迹</span>
                                        <GitCommit size={12} />
                                    </button>
                                </div>
                                <div className="col-span-12 md:col-span-7 h-[350px]">
                                    <TernaryPlot 
                                        data={structuralData} 
                                        labels={talentStructureDims.map(k => (({ medical: '医疗', quality: '质量', research: '科研', teaching: '教学', efficiency: '效率' } as any)[k] || '')) as any}
                                        showTrajectory={talentShowTrajectory}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-3 space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <h4 className="text-[10px] font-bold text-red-600 uppercase mb-2 flex items-center gap-1"><Crosshair size={12}/> 结构偏离最显著</h4>
                                        <div className="space-y-2">
                                            {structuralData.slice(0, 2).map(d => (
                                                <div key={d.id} className="bg-white p-2 rounded border border-gray-100 shadow-sm">
                                                    <div className="flex justify-between text-[10px] font-bold mb-1">
                                                        <span>{d.name}</span>
                                                        <span className="text-red-600">显著</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                                        <div className="h-full bg-blue-400" style={{width: '60%'}}></div>
                                                        <div className="h-full bg-emerald-400" style={{width: '20%'}}></div>
                                                        <div className="h-full bg-purple-400" style={{width: '20%'}}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-2 flex items-center gap-1"><RefreshCw size={12}/> 结构转型最快</h4>
                                        <div className="space-y-2">
                                            {structuralData.slice(2, 4).map(d => (
                                                <div key={d.id} className="bg-white p-2 rounded border border-gray-100 shadow-sm text-[10px]">
                                                    <div className="font-bold mb-1">{d.name}</div>
                                                    <div className="text-gray-400">主要驱动: 科研产出</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderDrillDownModal = () => {
    if (!drillDownConfig?.isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              {drillDownConfig.title} - 数据下钻明细
            </h3>
            <button onClick={() => setDrillDownConfig(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 bg-white">
            <div className="mb-4 flex gap-4">
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option>全部院区</option>
                <option>天河院区</option>
                <option>同德院区</option>
                <option>珠玑院区</option>
              </select>
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option>全部科室</option>
                <option>内镜中心</option>
                <option>超声科</option>
                <option>放射科</option>
              </select>
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option>全部类别</option>
                <option>检查</option>
                <option>治疗</option>
              </select>
              <input type="date" className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" defaultValue="2026-03-19" />
              <div className="ml-auto flex gap-2">
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
                  趋势分析
                </button>
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors">
                  明细数据
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">时间</th>
                    <th className="px-4 py-3 font-medium">患者ID</th>
                    <th className="px-4 py-3 font-medium">患者姓名</th>
                    <th className="px-4 py-3 font-medium">类别</th>
                    <th className="px-4 py-3 font-medium">项目名称</th>
                    <th className="px-4 py-3 font-medium">执行医生</th>
                    <th className="px-4 py-3 font-medium">状态</th>
                    <th className="px-4 py-3 font-medium text-right">金额(元)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">2026-03-19 10:2{i}</td>
                      <td className="px-4 py-3 font-mono text-gray-500">PT{10000+i}</td>
                      <td className="px-4 py-3 text-gray-900">{['张三', '李四', '王五', '赵六', '钱七'][i%5]}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${i % 3 === 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                          {i % 3 === 0 ? '治疗' : '检查'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {i % 3 === 0 
                          ? ['内镜下止血', '息肉切除术', 'EMR治疗', 'ESD手术'][i % 4] 
                          : ['普通胃镜', '无痛肠镜', '支气管镜', '胃肠同做'][i % 4]}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{['张医生', '李医生', '王医生', '赵医生'][i%4]}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium border border-emerald-100">已完成</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-gray-900">{i % 3 === 0 ? (800 + i*50) : (120 + i*15)}.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div>显示 1 到 10 条，共 1,245 条记录</div>
              <div className="flex gap-1">
                <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>上一页</button>
                <button className="px-2 py-1 border border-gray-200 rounded bg-blue-50 text-blue-600 font-medium">1</button>
                <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
                <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
                <span className="px-2 py-1">...</span>
                <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">下一页</button>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50 gap-3">
            <button onClick={() => setDrillDownConfig(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              关闭
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <FileText size={16} />
              导出明细
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50">
       {activeModuleId ? renderDetailView() : renderDashboard()}
       {renderDrillDownModal()}
    </div>
  );
};

export default OperationalDecisionCenter;