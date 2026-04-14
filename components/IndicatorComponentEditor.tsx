/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Database, 
  BarChart2, 
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table as TableIcon, 
  Settings2, 
  Play, 
  Save,
  X,
  Filter,
  Plus,
  Code
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts';

interface IndicatorNode {
  id: string;
  label: string;
  type: 'folder' | 'indicator';
  children?: IndicatorNode[];
}

interface DimensionNode {
  id: string;
  label: string;
}

interface ReferenceLineConfig {
  id: string;
  value: number;
  label: string;
  position: 'start' | 'middle' | 'end';
  field?: string;
}

const MOCK_DIMENSIONS: DimensionNode[] = [
  { id: 'd1', label: '科室' },
  { id: 'd2', label: '院区' },
  { id: 'd3', label: '医生' },
  { id: 'd4', label: '手术等级' },
  { id: 'd5', label: '病种' },
  { id: 'd6', label: '时间' },
];

const INDICATOR_DIMENSION_MAP: Record<string, string[]> = {
  'i1': ['d1', 'd2', 'd3', 'd5', 'd6'], // 门诊人次
  'i2': ['d1', 'd2', 'd3', 'd6'],       // 急诊人次
  'i3': ['d1', 'd2', 'd3', 'd5', 'd6'], // 门诊均次费用
  'i4': ['d1', 'd2', 'd3', 'd5', 'd6'], // 出院人次
  'i5': ['d1', 'd2', 'd5', 'd6'],       // 平均住院日
  'i6': ['d1', 'd2', 'd6'],             // 床位使用率
  'i7': ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'], // 手术总例数
  'i8': ['d1', 'd2', 'd3', 'd4', 'd6'],       // 三四级手术占比
};

const MOCK_INDICATORS: IndicatorNode[] = [
  {
    id: 'f1',
    label: '门急诊指标',
    type: 'folder',
    children: [
      { id: 'i1', label: '门诊人次', type: 'indicator' },
      { id: 'i2', label: '急诊人次', type: 'indicator' },
      { id: 'i3', label: '门诊均次费用', type: 'indicator' },
    ]
  },
  {
    id: 'f2',
    label: '住院指标',
    type: 'folder',
    children: [
      { id: 'i4', label: '出院人次', type: 'indicator' },
      { id: 'i5', label: '平均住院日', type: 'indicator' },
      { id: 'i6', label: '床位使用率', type: 'indicator' },
    ]
  },
  {
    id: 'f3',
    label: '手术指标',
    type: 'folder',
    children: [
      { id: 'i7', label: '手术总例数', type: 'indicator' },
      { id: 'i8', label: '三四级手术占比', type: 'indicator' },
    ]
  }
];

const DIMENSION_MOCK_DATA: Record<string, string[]> = {
  'd1': ['内科', '外科', '儿科', '妇科', '急诊科'],
  'd2': ['总院区', '东院区', '西院区'],
  'd3': ['张医生', '李医生', '王医生', '赵医生'],
  'd4': ['一级手术', '二级手术', '三级手术', '四级手术'],
  'd5': ['肺炎', '高血压', '糖尿病', '冠心病'],
  'd6': ['一月', '二月', '三月', '四月', '五月', '六月'],
};

interface IndicatorComponentEditorProps {
  onBack: () => void;
}

export const IndicatorComponentEditor: React.FC<IndicatorComponentEditorProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['f1', 'f2', 'f3']);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(true);
  const [isSqlExpanded, setIsSqlExpanded] = useState(false);
  const [hasRunQuery, setHasRunQuery] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'horizontal-bar' | 'line' | 'pie'>('bar');
  const [configTab, setConfigTab] = useState<'layout' | 'data' | 'axis' | 'display'>('layout');
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [referenceLines, setReferenceLines] = useState<ReferenceLineConfig[]>([]);

  // Calculate available dimensions based on selected indicators
  const availableDimensions = selectedIndicators.length === 0 
    ? MOCK_DIMENSIONS.map(d => d.id)
    : MOCK_DIMENSIONS.filter(dim => 
        selectedIndicators.every(indId => INDICATOR_DIMENSION_MAP[indId]?.includes(dim.id))
      ).map(d => d.id);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleIndicator = (id: string) => {
    setSelectedIndicators(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      if (next.length === 0) setHasRunQuery(false);
      
      // Auto-remove dimensions that are no longer supported by the new set of indicators
      if (next.length > 0) {
        setSelectedDimensions(currentDims => 
          currentDims.filter(dimId => 
            next.every(indId => INDICATOR_DIMENSION_MAP[indId]?.includes(dimId))
          )
        );
      }
      
      return next;
    });
  };

  const toggleDimension = (id: string) => {
    if (!availableDimensions.includes(id)) return;
    setSelectedDimensions(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const calculateAverage = (field?: string) => {
    if (chartData.length === 0 || !field) return 0;
    const sum = chartData.reduce((acc, curr) => acc + (curr[field] || 0), 0);
    return Math.round(sum / chartData.length);
  };

  const addReferenceLine = () => {
    const newLine: ReferenceLineConfig = {
      id: Math.random().toString(36).substr(2, 9),
      value: 0,
      label: '辅助线',
      position: 'end'
    };
    setReferenceLines(prev => [...prev, newLine]);
  };

  const updateReferenceLine = (id: string, updates: Partial<ReferenceLineConfig>) => {
    setReferenceLines(prev => prev.map(line => line.id === id ? { ...line, ...updates } : line));
  };

  const removeReferenceLine = (id: string) => {
    setReferenceLines(prev => prev.filter(line => line.id !== id));
  };

  const getIndicatorLabel = (id: string) => {
    return MOCK_INDICATORS.flatMap(f => f.children || []).find(i => i.id === id)?.label || id;
  };

  const getDimensionLabel = (id: string) => {
    return MOCK_DIMENSIONS.find(d => d.id === id)?.label || id;
  };

  const handleRunQuery = () => {
    if (selectedIndicators.length > 0) {
      // Generate mock data based on selected dimensions and indicators
      const data = [];
      
      // Determine dimension values for X-axis
      let dimensionValues: string[] = [];
      if (selectedDimensions.length > 0) {
        // If multiple dimensions, combine them for labels
        const primaryDim = selectedDimensions[0];
        const values = DIMENSION_MOCK_DATA[primaryDim] || ['数据1', '数据2', '数据3', '数据4'];
        
        if (selectedDimensions.length > 1) {
          // Simple combination for preview
          dimensionValues = values.map(v => `${v}(多维)`);
        } else {
          dimensionValues = values;
        }
      } else {
        dimensionValues = ['全院'];
      }
      
      for (let i = 0; i < dimensionValues.length; i++) {
        const entry: Record<string, any> = { name: dimensionValues[i] };
        selectedIndicators.forEach(id => {
          entry[getIndicatorLabel(id)] = Math.floor(Math.random() * 1000 + 500);
        });
        data.push(entry);
      }
      
      setChartData(data);
      setPieData(selectedIndicators.map(id => ({
        name: getIndicatorLabel(id),
        value: Math.floor(Math.random() * 1000 + 500)
      })));
      
      setHasRunQuery(true);
      setIsChartExpanded(true);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const renderIndicatorTree = (nodes: IndicatorNode[], level = 0) => {
    return nodes.map(node => {
      const isExpanded = expandedFolders.includes(node.id);
      const isSelected = selectedIndicators.includes(node.id);

      if (node.type === 'folder') {
        return (
          <div key={node.id}>
            <div 
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-[13px] text-gray-700 font-semibold group"
              onClick={() => toggleFolder(node.id)}
              style={{ paddingLeft: `${level * 16 + 12}px` }}
            >
              <div className="text-gray-400 group-hover:text-gray-600">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
              <Database size={14} className="text-blue-500/70" />
              <span>{node.label}</span>
            </div>
            {isExpanded && node.children && renderIndicatorTree(node.children, level + 1)}
          </div>
        );
      }

      return (
        <div 
          key={node.id}
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-[13px] transition-all group relative ${
            isSelected 
              ? 'bg-blue-600 text-white font-medium shadow-sm z-10' 
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
          }`}
          onClick={() => toggleIndicator(node.id)}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          {isSelected && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
          )}
          <span className="truncate">{node.label}</span>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-4 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">指标分析 / 分析组件 /</span>
            <span className="text-gray-800 font-medium text-sm">未命名组件</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            取消
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
            <Save size={16} />
            保存组件
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Indicators & Dimensions */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0 relative">
          {/* Indicators Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="text-sm font-bold text-gray-800 mb-3">指标</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索指标..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-100 border-transparent rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </div>
            <div className="flex-1 overflow-auto py-2">
              {renderIndicatorTree(MOCK_INDICATORS)}
            </div>
          </div>

          {/* Dimensions Section */}
          <div className="h-1/3 border-t border-gray-200 flex flex-col bg-white">
            <div className="p-3 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">维度</h3>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <div className="grid grid-cols-2 gap-2">
                {MOCK_DIMENSIONS.map(dim => {
                  const isAvailable = availableDimensions.includes(dim.id);
                  const isSelected = selectedDimensions.includes(dim.id);
                  return (
                    <div 
                      key={dim.id}
                      onClick={() => toggleDimension(dim.id)}
                      className={`
                        px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-all border
                        ${isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                          : isAvailable 
                            ? 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50' 
                            : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-60'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{dim.label}</span>
                        {!isAvailable && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedIndicators.length > 0 && availableDimensions.length === 0 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-md border border-orange-100">
                  <p className="text-[10px] text-orange-600 leading-relaxed">
                    当前选择的指标没有共同支持的维度。
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Panel (Overlay on Left Sidebar) */}
          {isConfigOpen && (
            <div className="absolute inset-0 z-20 flex flex-col bg-white animate-in slide-in-from-left duration-200 shadow-xl border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/30">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Settings2 size={16} className="text-blue-600" />
                  图表配置
                </h3>
                <button 
                  onClick={() => setIsConfigOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-md text-gray-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Chart Type Selection (Global) */}
              <div className="p-4 border-b border-gray-100 bg-white shrink-0">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">选择图表类型</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { type: 'bar', icon: BarChart2, label: '柱状图' },
                    { type: 'horizontal-bar', icon: BarChart2, label: '条形图', rotate: true },
                    { type: 'line', icon: LineChartIcon, label: '折线图' },
                    { type: 'pie', icon: PieChartIcon, label: '饼图' }
                  ].map(({ type, icon: Icon, label, rotate }) => (
                    <button 
                      key={type}
                      onClick={() => setChartType(type as any)}
                      className={`aspect-square flex flex-col items-center justify-center border rounded-md transition-colors gap-1 ${chartType === type ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
                      title={label}
                    >
                      <Icon size={18} className={rotate ? 'rotate-90' : ''} />
                      <span className="text-[9px] font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Config Tabs */}
              <div className="flex border-b border-gray-100 bg-gray-50/50 shrink-0">
                {[
                  { id: 'layout', label: '布局' },
                  { id: 'data', label: '数据' },
                  { id: 'axis', label: '坐标轴' },
                  { id: 'display', label: '显示' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setConfigTab(tab.id as any)}
                    className={`flex-1 py-2.5 text-[11px] font-bold transition-colors relative ${configTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab.label}
                    {configTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-6">
                {configTab === 'layout' && (
                  <div className="space-y-4">
                    <section>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">基础信息</label>
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-gray-600 block mb-1">图表标题</span>
                          <input type="text" className="w-full h-8 border rounded px-2 text-xs" placeholder="未命名组件" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-600 block mb-1">图表描述</span>
                          <textarea className="w-full h-16 border rounded px-2 py-1 text-xs resize-none" placeholder="输入描述信息..." />
                        </div>
                      </div>
                    </section>
                    <section>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">画布设置</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">自适应宽度</span>
                          <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">内边距 (Padding)</span>
                          <select className="text-[10px] border rounded px-1 h-6 bg-white" defaultValue="适中">
                            <option>紧凑</option>
                            <option>适中</option>
                            <option>宽松</option>
                          </select>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {configTab === 'data' && (
                  <>
                    {/* X-Axis */}
                    <section>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">横轴 (X-Axis)</label>
                      <div className="space-y-2">
                        {selectedDimensions.map(id => {
                          const label = MOCK_DIMENSIONS.find(d => d.id === id)?.label;
                          return (
                            <div key={id} className="flex items-center justify-between px-3 py-2 bg-purple-50 border border-purple-100 rounded-md">
                              <span className="text-xs text-purple-700">{label}</span>
                              <X size={12} className="text-purple-400 cursor-pointer" onClick={() => toggleDimension(id)} />
                            </div>
                          );
                        })}
                        {selectedDimensions.length === 0 && (
                          <div className="p-2 bg-gray-50 border border-dashed border-gray-300 rounded-md text-center">
                            <span className="text-[10px] text-gray-400">拖拽维度到此处</span>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Y-Axis */}
                    <section>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">纵轴 (Y-Axis)</label>
                      <div className="space-y-2">
                        {selectedIndicators.map(id => {
                          const label = MOCK_INDICATORS.flatMap(f => f.children || []).find(i => i.id === id)?.label;
                          return (
                            <div key={id} className="flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-100 rounded-md">
                              <span className="text-xs text-blue-700">{label}</span>
                              <X size={12} className="text-blue-400 cursor-pointer" onClick={() => toggleIndicator(id)} />
                            </div>
                          );
                        })}
                        <div className="p-2 bg-gray-50 border border-dashed border-gray-300 rounded-md text-center">
                          <span className="text-[10px] text-gray-400">拖拽指标到此处</span>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {configTab === 'axis' && (
                  <div className="space-y-4">
                    <section>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">X轴设置</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">显示轴线</span>
                          <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">轴标题</span>
                          <input type="text" className="w-24 h-6 border rounded px-1 text-[10px]" placeholder="输入标题" />
                        </div>
                      </div>
                    </section>
                    <section>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Y轴设置</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">显示网格</span>
                          <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">最小值</span>
                          <input type="number" className="w-24 h-6 border rounded px-1 text-[10px]" placeholder="自动" />
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {configTab === 'display' && (
                  <div className="space-y-4">
                    <section>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">图例设置</label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">显示图例</span>
                          <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">图例位置</span>
                          <select className="text-[10px] border rounded px-1 h-6 bg-white" defaultValue="底部">
                            <option>顶部</option>
                            <option>底部</option>
                            <option>左侧</option>
                            <option>右侧</option>
                          </select>
                        </div>
                      </div>
                    </section>
                    <section>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">样式设置</label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">堆叠显示</span>
                          <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                            <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">显示数值标签</span>
                          <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                            <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">辅助线</label>
                        <button 
                          onClick={addReferenceLine}
                          className="p-1 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                          title="新增辅助线"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {referenceLines.map((line) => (
                          <div key={line.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative group">
                            <button 
                              onClick={() => removeReferenceLine(line.id)}
                              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                            
                            <div className="space-y-2">
                              <span className="text-[10px] text-gray-500 font-bold">应用字段</span>
                              <select 
                                value={line.field || ''}
                                onChange={(e) => updateReferenceLine(line.id, { field: e.target.value })}
                                className="w-full h-7 border rounded px-2 text-xs bg-white"
                              >
                                <option value="">选择字段</option>
                                {selectedIndicators.map(id => {
                                  const label = getIndicatorLabel(id);
                                  return <option key={id} value={label}>{label}</option>;
                                })}
                              </select>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-500 font-bold">数值</span>
                                <button 
                                  onClick={() => updateReferenceLine(line.id, { value: calculateAverage(line.field) })}
                                  disabled={!line.field}
                                  className={`text-[9px] ${line.field ? 'text-blue-600 hover:underline' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                  设为平均值
                                </button>
                              </div>
                              <input 
                                type="number" 
                                value={line.value}
                                onChange={(e) => updateReferenceLine(line.id, { value: Number(e.target.value) })}
                                className="w-full h-7 border rounded px-2 text-xs"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-500 font-bold">显示名</span>
                                <div className="flex gap-1">
                                  {[
                                    { id: 'start', label: '左' },
                                    { id: 'middle', label: '中' },
                                    { id: 'end', label: '右' }
                                  ].map(pos => (
                                    <button
                                      key={pos.id}
                                      onClick={() => updateReferenceLine(line.id, { position: pos.id as any })}
                                      className={`px-1.5 py-0.5 text-[9px] border rounded transition-colors ${line.position === pos.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                      {pos.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <input 
                                type="text" 
                                value={line.label}
                                onChange={(e) => updateReferenceLine(line.id, { label: e.target.value })}
                                className="w-full h-7 border rounded px-2 text-xs"
                                placeholder="输入显示名"
                              />
                            </div>
                          </div>
                        ))}
                        {referenceLines.length === 0 && (
                          <div className="p-4 border border-dashed border-gray-200 rounded-lg text-center">
                            <p className="text-[10px] text-gray-400">暂无辅助线</p>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100/30">
          {/* Query/Filters Bar */}
          <div className="p-3 border-b border-gray-200 bg-white flex items-center gap-4 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600">
              <Filter size={14} className="text-gray-400" />
              <span>时间范围: 最近30天</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600">
              <Filter size={14} className="text-gray-400" />
              <span>科室: 全部</span>
            </div>
            <button className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:underline">
              <Plus size={14} />
              添加筛选
            </button>
            <div className="flex-1"></div>
            <button 
              onClick={handleRunQuery}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-colors text-xs font-bold ${selectedIndicators.length > 0 ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}
              disabled={selectedIndicators.length === 0}
            >
              <Play size={14} fill="currentColor" />
              运行查询
            </button>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
            {/* Chart Area */}
            <div className={`bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${isChartExpanded ? 'flex-1' : 'h-10'}`}>
              <div 
                className="h-10 border-b border-gray-100 flex items-center justify-between px-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/50 transition-colors shrink-0"
                onClick={() => setIsChartExpanded(!isChartExpanded)}
              >
                <div className="flex items-center gap-2">
                  <div className="text-gray-400">
                    {isChartExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                  <BarChart2 size={14} className="text-blue-600" />
                  <span className="text-xs font-bold text-gray-700">图表预览</span>
                </div>
                {isChartExpanded && (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setIsConfigOpen(!isConfigOpen)}
                      className={`p-1.5 rounded transition-colors ${isConfigOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Settings2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              {isChartExpanded && (
                <div className="flex-1 flex items-center justify-center bg-gray-50/30 p-6">
                  {hasRunQuery && selectedIndicators.length > 0 ? (
                    <div className="w-full h-full min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 12, fill: '#64748b' }} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 12, fill: '#64748b' }} 
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend iconType="circle" />
                            {selectedIndicators.map((id, index) => (
                              <Bar 
                                key={id} 
                                dataKey={getIndicatorLabel(id)} 
                                fill={COLORS[index % COLORS.length]} 
                                radius={[4, 4, 0, 0]} 
                                barSize={32}
                              />
                            ))}
                            {referenceLines.map(line => (
                              <ReferenceLine 
                                key={line.id} 
                                y={line.value} 
                                stroke="#ef4444" 
                                strokeDasharray="3 3" 
                                label={{ value: line.label, position: line.position === 'start' ? 'insideTopLeft' : line.position === 'middle' ? 'top' : 'insideTopRight', fill: '#ef4444', fontSize: 10 }} 
                              />
                            ))}
                          </BarChart>
                        ) : chartType === 'horizontal-bar' ? (
                          <BarChart data={chartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis 
                              type="number"
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 12, fill: '#64748b' }} 
                            />
                            <YAxis 
                              dataKey="name" 
                              type="category"
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 12, fill: '#64748b' }} 
                              width={80}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend iconType="circle" />
                            {selectedIndicators.map((id, index) => (
                              <Bar 
                                key={id} 
                                dataKey={getIndicatorLabel(id)} 
                                fill={COLORS[index % COLORS.length]} 
                                radius={[0, 4, 4, 0]} 
                                barSize={20}
                              />
                            ))}
                            {referenceLines.map(line => (
                              <ReferenceLine 
                                key={line.id} 
                                x={line.value} 
                                stroke="#ef4444" 
                                strokeDasharray="3 3" 
                                label={{ value: line.label, position: line.position === 'start' ? 'insideBottomLeft' : line.position === 'middle' ? 'insideBottom' : 'insideBottomRight', fill: '#ef4444', fontSize: 10 }} 
                              />
                            ))}
                          </BarChart>
                        ) : chartType === 'line' ? (
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 12, fill: '#64748b' }} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 12, fill: '#64748b' }} 
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend iconType="circle" />
                            {selectedIndicators.map((id, index) => (
                              <Line 
                                key={id} 
                                type="monotone" 
                                dataKey={getIndicatorLabel(id)} 
                                stroke={COLORS[index % COLORS.length]} 
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                              />
                            ))}
                            {referenceLines.map(line => (
                              <ReferenceLine 
                                key={line.id} 
                                y={line.value} 
                                stroke="#ef4444" 
                                strokeDasharray="3 3" 
                                label={{ value: line.label, position: line.position === 'start' ? 'insideTopLeft' : line.position === 'middle' ? 'top' : 'insideTopRight', fill: '#ef4444', fontSize: 10 }} 
                              />
                            ))}
                          </LineChart>
                        ) : chartType === 'pie' ? (
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <TableIcon size={48} className="mb-4 opacity-20" />
                            <p>透视表视图暂未实现</p>
                          </div>
                        )}
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center max-w-xs">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus size={24} className="text-gray-400" />
                      </div>
                      <h4 className="text-gray-800 font-medium mb-1">开始构建组件</h4>
                      <p className="text-gray-500 text-xs">从左侧指标库中选择指标，然后点击“运行查询”来预览数据。</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Table Data Preview Area */}
            <div className={`bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${isTableExpanded ? 'flex-1' : 'h-10'}`}>
              <div 
                className="h-10 border-b border-gray-100 flex items-center justify-between px-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/50 transition-colors shrink-0"
                onClick={() => setIsTableExpanded(!isTableExpanded)}
              >
                <div className="flex items-center gap-2">
                  <div className="text-gray-400">
                    {isTableExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                  <TableIcon size={14} className="text-blue-600" />
                  <span className="text-xs font-bold text-gray-700">数据表格预览</span>
                </div>
              </div>
              {isTableExpanded && (
                <div className="flex-1 overflow-auto flex flex-col p-4 bg-gray-50/30">
                  {selectedIndicators.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <table className="w-full text-left border-collapse table-fixed">
                        <thead className="border-b border-gray-100">
                          <tr>
                            {selectedDimensions.map(id => (
                              <th key={id} className="px-4 py-3 text-[11px] font-bold text-indigo-500 bg-indigo-50/30 uppercase tracking-wider text-left border-r border-gray-100 last:border-r-0">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                  {getDimensionLabel(id)}
                                </div>
                              </th>
                            ))}
                            {selectedIndicators.map(id => (
                              <th key={id} className="px-4 py-3 text-[11px] font-bold text-emerald-600 bg-emerald-50/30 uppercase tracking-wider text-left border-r border-gray-100 last:border-r-0">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  {getIndicatorLabel(id)}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {hasRunQuery ? (
                            [1, 2, 3, 4, 5].map(rowIdx => (
                              <tr key={rowIdx} className="hover:bg-gray-50 transition-colors group">
                                {selectedDimensions.map(id => (
                                  <td key={id} className="px-4 py-3.5 text-[13px] text-indigo-600/80 font-medium text-left border-r border-gray-100 last:border-r-0 group-hover:text-indigo-700 transition-colors bg-indigo-50/5">
                                    {getDimensionLabel(id)} {rowIdx}
                                  </td>
                                ))}
                                {selectedIndicators.map(id => (
                                  <td key={id} className="px-4 py-3.5 text-[13px] text-emerald-700 font-medium text-left border-r border-gray-100 last:border-r-0 group-hover:text-emerald-800 transition-colors bg-emerald-50/5">
                                    <span className="font-mono">
                                      {(Math.random() * 1000 + 500).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td 
                                colSpan={selectedIndicators.length + selectedDimensions.length} 
                                className="px-4 py-20 text-center"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-400 mb-2">
                                    <Play size={20} fill="currentColor" />
                                  </div>
                                  <p className="text-sm text-gray-500 font-medium">待运行查询</p>
                                  <p className="text-xs text-gray-400">点击上方“运行查询”按钮以加载实时数据预览</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12 bg-white border border-dashed border-gray-200 rounded-xl">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <TableIcon size={32} className="opacity-20" />
                      </div>
                      <p className="text-sm font-bold text-gray-600">选取指标</p>
                      <p className="text-xs text-gray-400 mt-1">从左侧指标库中选择您想要分析的指标</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SQL Statement (Collapsible/Bottom) */}
            <div className={`bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${isSqlExpanded ? 'h-48' : 'h-10'}`}>
              <div 
                className="h-10 border-b border-gray-100 flex items-center px-4 bg-gray-50/50 justify-between cursor-pointer hover:bg-gray-100/50 transition-colors shrink-0"
                onClick={() => setIsSqlExpanded(!isSqlExpanded)}
              >
                <div className="flex items-center gap-2">
                  <div className="text-gray-400">
                    {isSqlExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                  <Code size={14} className="text-gray-500" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">SQL 语句</span>
                </div>
              </div>
              {isSqlExpanded && (
                <div className="flex-1 overflow-auto bg-gray-900 p-4">
                  <pre className="text-xs text-blue-300 font-mono">
                    {`SELECT 
  date_trunc('day', created_at) as date,
  indicator_name,
  SUM(value) as total_value
FROM hospital_indicators
WHERE indicator_id IN (${selectedIndicators.length > 0 ? selectedIndicators.map(id => `'${id}'`).join(', ') : "'...' "})
GROUP BY 1, 2
ORDER BY 1 DESC`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
