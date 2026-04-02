import React, { useState } from 'react';
import { 
  Calendar, 
  GripVertical, 
  Play, 
  X, 
  Table as TableIcon,
  Filter,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  Minus,
  Layout
} from 'lucide-react';

interface IndicatorNode {
  id: string;
  label: string;
  children?: IndicatorNode[];
}

const INDICATOR_TREE: IndicatorNode[] = [
  {
    id: '1',
    label: '资源配置与运行数据指标',
    children: [
      {
        id: '1-1',
        label: '床位配置',
        children: [
          { id: '门诊人次', label: '门诊人次' },
          { id: '急诊人次', label: '急诊人次' },
        ]
      },
      {
        id: '1-2',
        label: '卫生技术人员配备',
        children: [
          { id: '卫生技术人员数与开放床位数比', label: '卫生技术人员数与开放床位数比' },
          { id: '出院人次', label: '出院人次' },
        ]
      },
      {
        id: '1-3',
        label: '重点专业质量控制指标',
        children: [
          { id: '手术台次', label: '手术台次' },
          { id: '药占比', label: '药占比' },
          { id: '平均住院日', label: '平均住院日' },
          { id: '次均门诊费用', label: '次均门诊费用' },
          { id: '次均住院费用', label: '次均住院费用' },
        ]
      }
    ]
  }
];

const COMMON_DIMENSIONS = [
  '出院科室'
];

const MOCK_DEPARTMENTS = ['心血管内科', '神经内科', '呼吸内科', '消化内科', '普通外科', '骨科'];

interface AnalysisTableWidgetProps {
  isConfiguring?: boolean;
  onReconfigure?: () => void;
  onGenerate?: () => void;
}

export default function AnalysisTableWidget({ isConfiguring, onReconfigure, onGenerate }: AnalysisTableWidgetProps = {}) {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [rows, setRows] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('');
  const [internalShowPreview, setInternalShowPreview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['1', '1-2']);

  const showPreview = isConfiguring !== undefined ? !isConfiguring : internalShowPreview;

  const handleSetShowPreview = (val: boolean) => {
    if (val) {
      if (onGenerate) onGenerate();
      else setInternalShowPreview(true);
    } else {
      if (onReconfigure) onReconfigure();
      else setInternalShowPreview(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => 
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const getLeafLabels = (node: IndicatorNode): string[] => {
    if (!node.children) return [node.label];
    return node.children.flatMap(getLeafLabels);
  };

  const toggleNodeSelection = (node: IndicatorNode) => {
    const leaves = getLeafLabels(node);
    const allSelected = leaves.every(l => tempSelected.includes(l));
    
    if (allSelected) {
      setTempSelected(tempSelected.filter(l => !leaves.includes(l)));
    } else {
      const newSelected = [...tempSelected];
      leaves.forEach(l => {
        if (!newSelected.includes(l)) newSelected.push(l);
      });
      setTempSelected(newSelected);
    }
  };

  const isNodeSelected = (node: IndicatorNode) => {
    const leaves = getLeafLabels(node);
    return leaves.length > 0 && leaves.every(l => tempSelected.includes(l));
  };

  const isNodeIndeterminate = (node: IndicatorNode) => {
    const leaves = getLeafLabels(node);
    const selectedLeaves = leaves.filter(l => tempSelected.includes(l));
    return selectedLeaves.length > 0 && selectedLeaves.length < leaves.length;
  };

  const renderTreeNode = (node: IndicatorNode, level: number = 0) => {
    const isExpanded = expandedNodes.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const selected = isNodeSelected(node);
    const indeterminate = isNodeIndeterminate(node);

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center gap-2 py-2.5 px-2 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors ${level === 1 && isExpanded ? 'bg-slate-50' : ''}`}
          style={{ paddingLeft: `${level * 24 + 8}px` }}
          onClick={() => toggleNodeSelection(node)}
        >
          <div 
            className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleExpand(node.id);
            }}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            ) : <div className="w-4" />}
          </div>
          
          <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${selected ? 'bg-blue-600 border-blue-600' : indeterminate ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
            {selected && <Check size={12} strokeWidth={3} className="text-white" />}
            {indeterminate && <Minus size={12} strokeWidth={3} className="text-white" />}
          </div>
          <span className="text-[15px] text-slate-700">{node.label}</span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const openModal = () => {
    setTempSelected([...selectedIndicators]);
    setIsModalOpen(true);
  };

  const confirmSelection = () => {
    setSelectedIndicators(tempSelected);
    setIsModalOpen(false);
    handleSetShowPreview(false);
  };

  const removeIndicator = (indicator: string) => {
    setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
    handleSetShowPreview(false);
  };

  const handleDragStart = (e: React.DragEvent, type: 'dimension' | 'indicator_group' | 'indicator', value: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, value }));
  };

  const handleDrop = (e: React.DragEvent, target: 'rows' | 'columns') => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (target === 'rows' && !rows.includes(data.value)) {
        setRows([...rows, data.value]);
      } else if (target === 'columns' && !columns.includes(data.value)) {
        setColumns([...columns, data.value]);
      }
      handleSetShowPreview(false);
    } catch (err) {
      console.error('Drop error', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeItem = (target: 'rows' | 'columns', value: string) => {
    if (target === 'rows') setRows(rows.filter(r => r !== value));
    if (target === 'columns') setColumns(columns.filter(c => c !== value));
    handleSetShowPreview(false);
  };

  const generateTable = () => {
    handleSetShowPreview(true);
  };

  const normalizeAxis = (axisItems: string[]) => {
    const dims: string[] = [];
    const inds: string[] = [];
    let hasIndicatorGroup = false;

    axisItems.forEach(item => {
      if (item === '出院科室') {
        dims.push(item);
      } else if (item === '指标') {
        hasIndicatorGroup = true;
      } else {
        inds.push(item);
      }
    });

    let finalIndicators: string[] = [];
    if (hasIndicatorGroup) {
      finalIndicators = selectedIndicators.length > 0 ? selectedIndicators : ['无指标'];
    } else if (inds.length > 0) {
      finalIndicators = inds;
    }

    const effectiveAxis: { name: string, values: string[] }[] = [];
    let indicatorAdded = false;
    
    axisItems.forEach(item => {
      if (item === '出院科室') {
        effectiveAxis.push({ name: item, values: MOCK_DEPARTMENTS });
      } else if (!indicatorAdded && (item === '指标' || inds.includes(item))) {
        effectiveAxis.push({ name: '指标名称', values: finalIndicators });
        indicatorAdded = true;
      }
    });

    return effectiveAxis;
  };

  const getAxisCombinations = (effectiveAxis: { name: string, values: string[] }[], fallback: string) => {
    if (effectiveAxis.length === 0) return [[fallback]];
    let combinations: string[][] = [[]];
    effectiveAxis.forEach(axis => {
      const newCombinations: string[][] = [];
      const currentValues = axis.values.length > 0 ? axis.values : ['无数据'];
      combinations.forEach(combo => {
        currentValues.forEach(val => {
          newCombinations.push([...combo, val]);
        });
      });
      combinations = newCombinations;
    });
    return combinations;
  };

  const effectiveRowAxis = normalizeAxis(rows);
  const effectiveColAxis = normalizeAxis(columns);

  const rowCombinations = getAxisCombinations(effectiveRowAxis, '总计');
  const colCombinations = getAxisCombinations(effectiveColAxis, '数据');

  return (
    <div className="flex flex-col h-[600px] bg-white font-sans">
      {showPreview ? (
        <div className="flex flex-col h-full bg-white">
          {/* Preview Toolbar */}
          {dateRange && (
            <div className="flex items-center justify-end px-4 py-3 border-b border-slate-200 bg-slate-50/50">
              <span className="text-sm text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">{dateRange}</span>
            </div>
          )}

          {/* Table Content */}
          <div className="flex-1 p-6 overflow-auto custom-scrollbar bg-white">
            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {/* Render Row Headers */}
                    {effectiveRowAxis.map(axis => (
                      <th key={axis.name} className="px-4 py-3 text-sm font-semibold text-slate-700 border-r border-slate-200 bg-slate-100/50">
                        {axis.name}
                      </th>
                    ))}
                    {effectiveRowAxis.length === 0 && (
                      <th className="px-4 py-3 text-sm font-semibold text-slate-700 border-r border-slate-200 bg-slate-100/50">
                        汇总
                      </th>
                    )}
                    {/* Render Column Headers */}
                    {colCombinations.map((colCombo, i) => (
                      <th key={i} className="px-4 py-3 text-sm font-semibold text-slate-700 border-r border-slate-200">
                        {colCombo.join(' / ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Mock Data Rows */}
                  {rowCombinations.map((rowCombo, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors">
                      {rowCombo.map((rowVal, i) => (
                        <td key={i} className="px-4 py-3 text-sm text-slate-800 border-r border-slate-100 font-medium">
                          {rowVal}
                        </td>
                      ))}
                      {colCombinations.map((colCombo, colIndex) => (
                        <td key={colIndex} className="px-4 py-3 text-sm text-slate-600 border-r border-slate-100">
                          {Math.floor((rowIndex + 1) * (colIndex + 1) * 17.5) % 1000 + 100}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar: Data Selection */}
          <div className="w-64 border-r border-slate-200 bg-slate-50/30 flex flex-col overflow-hidden">
          
          {/* Indicators Selection */}
          <div className="p-4 border-b border-slate-200 flex-1 overflow-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                <Filter size={14} />
                已选指标
              </div>
              <button onClick={openModal} className="text-blue-500 hover:text-blue-600 text-xs flex items-center gap-1 font-medium">
                <Plus size={12} /> 选择指标
              </button>
            </div>
            
            <div className="space-y-1.5 mb-4">
              {selectedIndicators.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  暂无指标，请点击选择
                </div>
              ) : (
                selectedIndicators.map(ind => (
                  <div 
                    key={ind} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'indicator', ind)}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <GripVertical size={14} className="text-slate-300 group-hover:text-blue-400 shrink-0" />
                      <span className="text-sm text-slate-700 truncate" title={ind}>{ind}</span>
                    </div>
                    <button onClick={() => removeIndicator(ind)} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Draggable Indicator Group Pill */}
            {selectedIndicators.length > 0 && (
              <div 
                draggable
                onDragStart={(e) => handleDragStart(e, 'indicator_group', '指标')}
                className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg cursor-grab active:cursor-grabbing shadow-sm hover:bg-blue-100 transition-colors"
              >
                <GripVertical size={16} className="text-blue-400 opacity-50" />
                <span className="text-sm font-medium">所选指标项 ({selectedIndicators.length})</span>
              </div>
            )}
            {selectedIndicators.length > 0 && (
              <div className="text-[10px] text-slate-400 mt-2 text-center">
                拖拽上方单个指标或整个模块至行列配置
              </div>
            )}
          </div>

          {/* Dimensions Selection */}
          <div className="p-4 flex-1 overflow-auto custom-scrollbar">
            <div className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              共有维度 (拖拽至行列)
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_DIMENSIONS.map(dim => (
                <div 
                  key={dim}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'dimension', dim)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-full cursor-grab active:cursor-grabbing hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <GripVertical size={14} className="text-slate-400" />
                  {dim}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Area: Configuration & Preview */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          
          {/* Drop Zones & Toolbar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-4 shrink-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-slate-700">行列配置</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm">
                  <Calendar size={14} className="text-slate-400" />
                  <input 
                    type="text" 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className="outline-none w-40 bg-transparent"
                    placeholder="选择时间范围"
                  />
                </div>
                <button 
                  onClick={generateTable}
                  disabled={rows.length === 0 || columns.length === 0 || selectedIndicators.length === 0}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Play size={14} />
                  生成表格
                </button>
              </div>
            </div>

            {/* Rows Drop Zone */}
            <div className="flex items-start gap-3">
              <div className="w-16 pt-1.5 text-sm font-medium text-slate-600 text-right shrink-0">行维度:</div>
              <div 
                onDrop={(e) => handleDrop(e, 'rows')}
                onDragOver={handleDragOver}
                className="flex-1 min-h-[40px] p-1.5 bg-white border border-dashed border-slate-300 rounded-lg flex flex-wrap gap-2 items-center"
              >
                {rows.length === 0 && <span className="text-sm text-slate-400 px-2">拖拽维度到此处</span>}
                {rows.map(row => (
                  <div key={row} className="flex items-center gap-1 pl-3 pr-1.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700">
                    {row}
                    <button onClick={() => removeItem('rows', row)} className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Columns Drop Zone */}
            <div className="flex items-start gap-3">
              <div className="w-16 pt-1.5 text-sm font-medium text-slate-600 text-right shrink-0">列维度:</div>
              <div 
                onDrop={(e) => handleDrop(e, 'columns')}
                onDragOver={handleDragOver}
                className="flex-1 min-h-[40px] p-1.5 bg-white border border-dashed border-slate-300 rounded-lg flex flex-wrap gap-2 items-center"
              >
                {columns.length === 0 && <span className="text-sm text-slate-400 px-2">拖拽维度或指标到此处</span>}
                {columns.map(col => (
                  <div key={col} className={`flex items-center gap-1 pl-3 pr-1.5 py-1 border rounded-md text-sm ${col === '指标' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                    {col === '指标' ? '所选指标项' : col}
                    <button onClick={() => removeItem('columns', col)} className={`p-0.5 rounded ${col === '指标' ? 'hover:bg-blue-100 text-blue-400 hover:text-blue-600' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-600'}`}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Empty State / Placeholder for Config Mode */}
          {rows.length === 0 && columns.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
              <TableIcon size={48} strokeWidth={1} className="mb-4 text-slate-200" />
              <p>拖拽左侧维度或指标到上方配置区域</p>
            </div>
          ) : (
            <div className="flex-1 p-6 overflow-auto custom-scrollbar bg-slate-50/30">
              <div className="mb-3 text-sm font-medium text-slate-500 flex items-center gap-2">
                <Layout size={16} />
                表格结构预览
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white opacity-90">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {/* Render Row Headers */}
                      {effectiveRowAxis.map(axis => (
                        <th key={axis.name} className="px-4 py-3 text-sm font-semibold text-slate-700 border-r border-slate-200 bg-slate-100/50">
                          {axis.name}
                        </th>
                      ))}
                      {effectiveRowAxis.length === 0 && (
                        <th className="px-4 py-3 text-sm font-semibold text-slate-700 border-r border-slate-200 bg-slate-100/50">
                          汇总
                        </th>
                      )}
                      {/* Render Column Headers */}
                      {colCombinations.map((colCombo, i) => (
                        <th key={i} className="px-4 py-3 text-sm font-semibold text-slate-700 border-r border-slate-200">
                          {colCombo.join(' / ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Mock Data Rows */}
                    {rowCombinations.slice(0, 5).map((rowCombo, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors">
                        {rowCombo.map((rowVal, i) => (
                          <td key={i} className="px-4 py-3 text-sm text-slate-800 border-r border-slate-100 font-medium bg-slate-50/30">
                            {rowVal}
                          </td>
                        ))}
                        {colCombinations.map((colCombo, colIndex) => (
                          <td key={colIndex} className="px-4 py-3 text-sm text-slate-400 border-r border-slate-100 italic">
                            数据占位
                          </td>
                        ))}
                      </tr>
                    ))}
                    {rowCombinations.length > 5 && (
                      <tr>
                        <td colSpan={(effectiveRowAxis.length || 1) + colCombinations.length} className="px-4 py-3 text-center text-sm text-slate-400 bg-slate-50/50">
                          ... 更多数据行 ...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Indicator Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[85vh] flex flex-col overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-br from-blue-50 to-transparent opacity-50 pointer-events-none" />
            
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between relative z-10">
              <h3 className="text-lg font-bold text-slate-800">选择指标</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-4 flex flex-col gap-4 relative z-10">
              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="输入关键字进行过滤" 
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              {/* Dropdown */}
              <div className="relative">
                <select className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-blue-500 transition-colors text-slate-700">
                  <option>三级医院等级评审</option>
                  <option>公立医院绩效考核</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Selected count */}
              <div className="text-sm text-slate-500 mt-2">
                已选择 <span className="text-blue-600 font-medium">{tempSelected.length}</span> 个指标
              </div>
            </div>

            {/* Tree Area */}
            <div className="flex-1 overflow-auto px-4 pb-6 custom-scrollbar relative z-10">
              {INDICATOR_TREE.map(node => renderTreeNode(node, 0))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-center gap-4 relative z-10">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={confirmSelection}
                className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                确 定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
