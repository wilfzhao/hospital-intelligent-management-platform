
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Users, Layers, Info, Search, ChevronRight, ChevronDown, 
  Check, X, Filter, Plus, Trash2, Edit2, Target, Percent, AlertCircle, 
  MoreHorizontal, FileText, Hash, Trophy
} from 'lucide-react';
import { Plan, Department, Indicator } from '../types';
import { DEPARTMENTS, INDICATORS } from '../constants';
import { Checkbox } from './ui/Checkbox';
import IndicatorSelectModal from './IndicatorSelectModal';

interface FeaturedPlanConfigProps {
  plan: Plan;
  onBack: () => void;
}

// --- Types for Dimension Configuration ---
interface AssociatedIndicatorConfig {
  id: string;
  name: string;
  weight: number;
  score: number; // Added score
}

interface DimensionNode {
  id: string;
  name: string;
  weight: number;
  score: number; // Added score
  children?: DimensionNode[];
  indicators?: AssociatedIndicatorConfig[];
}

// --- Mock Data ---
const MOCK_DISCIPLINES = [
    { id: 'dis-1', name: '内科学' },
    { id: 'dis-2', name: '外科学' },
    { id: 'dis-3', name: '儿科学' },
    { id: 'dis-4', name: '神经病学' },
    { id: 'dis-5', name: '急诊医学' },
    { id: 'dis-6', name: '肿瘤学' },
    { id: 'dis-7', name: '康复医学' },
    { id: 'dis-8', name: '麻醉学' },
    { id: 'dis-9', name: '皮肤病学' },
    { id: 'dis-10', name: '眼科学' },
];

const MOCK_PEOPLE = [
    { id: 'u1', name: '张伟', dept: '心血管内科', deptId: 'd2-1' },
    { id: 'u2', name: '王芳', dept: '心血管内科', deptId: 'd2-1' },
    { id: 'u3', name: '李娜', dept: '呼吸内科', deptId: 'd2-2' },
    { id: 'u4', name: '刘强', dept: '呼吸内科', deptId: 'd2-2' },
    { id: 'u5', name: '陈杰', dept: '普通外科', deptId: 'd2-4' },
    { id: 'u6', name: '杨敏', dept: '普通外科', deptId: 'd2-4' },
    { id: 'u7', name: '赵静', dept: '护理部', deptId: 'd1-2' },
    { id: 'u8', name: '孙勇', dept: '医务处', deptId: 'd1-1' },
    { id: 'u9', name: '周涛', dept: '骨科', deptId: 'd2-5' },
    { id: 'u10', name: '吴艳', dept: '妇产科', deptId: 'd2-7' },
];

const INITIAL_DIMENSIONS: DimensionNode[] = [
  {
    id: 'dim-1',
    name: '医疗质量',
    weight: 50,
    score: 500,
    children: [
        { id: 'dim-1-1', name: '过程质量', weight: 40, score: 200, indicators: [] },
        { id: 'dim-1-2', name: '终末质量', weight: 60, score: 300, indicators: [] }
    ]
  },
  {
    id: 'dim-2',
    name: '运营效率',
    weight: 30,
    score: 300,
    children: []
  },
  {
    id: 'dim-3',
    name: '持续发展',
    weight: 20,
    score: 200,
    children: []
  }
];

export const FeaturedPlanConfig: React.FC<FeaturedPlanConfigProps> = ({ plan, onBack }) => {
  const [activeTab, setActiveTab] = useState<'targets' | 'dimensions'>('targets');
  
  // --- Target Selection State ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDeptIds, setExpandedDeptIds] = useState<Set<string>>(new Set(['d1', 'd2', 'd3']));

  // --- Dimension Configuration State ---
  const [dimensions, setDimensions] = useState<DimensionNode[]>(INITIAL_DIMENSIONS);
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('dim-1');
  const [expandedDimIds, setExpandedDimIds] = useState<Set<string>>(new Set(['dim-1']));
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
  const [planTotalScore, setPlanTotalScore] = useState<number>(1000); // Default to 1000

  const targetType = plan.target || 'department';

  // --- Statistics Calculation ---
  const { totalWeight, currentTotalScore } = useMemo(() => {
    let w = 0;
    let s = 0;
    // Calculate based on root nodes
    dimensions.forEach(dim => {
      w += dim.weight || 0;
      s += dim.score || 0;
    });
    return { totalWeight: w, currentTotalScore: s };
  }, [dimensions]);

  // Calculate disabled indicator IDs (indicators used in OTHER dimensions)
  const disabledIndicatorIds = useMemo(() => {
    const ids = new Set<string>();
    const traverse = (node: DimensionNode) => {
        // Collect indicators from nodes OTHER than the currently selected one
        if (node.id !== selectedDimensionId) {
            node.indicators?.forEach(i => ids.add(i.id));
        }
        node.children?.forEach(traverse);
    };
    dimensions.forEach(traverse);
    return Array.from(ids);
  }, [dimensions, selectedDimensionId]);

  // --- Target Logic ---
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const clearSelection = () => setSelectedIds(new Set());

  const toggleDeptExpand = (id: string) => {
    const newSet = new Set(expandedDeptIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedDeptIds(newSet);
  };

  // --- Dimension Logic ---
  const toggleDimExpand = (id: string) => {
    const newSet = new Set(expandedDimIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedDimIds(newSet);
  };

  // Helper to find a node and its parent
  const findDimensionNode = (nodes: DimensionNode[], id: string): DimensionNode | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findDimensionNode(node.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Helper to find parent node
  const findParentNode = (nodes: DimensionNode[], childId: string): DimensionNode | null => {
    for (const node of nodes) {
      if (node.children) {
        if (node.children.some(child => child.id === childId)) return node;
        const found = findParentNode(node.children, childId);
        if (found) return found;
      }
    }
    return null;
  };

  const updateDimensionNode = (id: string, updates: Partial<DimensionNode>) => {
    const updateRecursive = (nodes: DimensionNode[]): DimensionNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, ...updates };
        }
        if (node.children) {
          return { ...node, children: updateRecursive(node.children) };
        }
        return node;
      });
    };
    setDimensions(updateRecursive(dimensions));
  };

  const addDimension = (parentId?: string) => {
    const newNode: DimensionNode = {
      id: `new-dim-${Date.now()}`,
      name: '新维度',
      weight: 0,
      score: 0,
      children: [],
      indicators: []
    };

    if (!parentId) {
      setDimensions([...dimensions, newNode]);
    } else {
      const updateRecursive = (nodes: DimensionNode[]): DimensionNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return { ...node, children: [...(node.children || []), newNode] };
          }
          if (node.children) {
            return { ...node, children: updateRecursive(node.children) };
          }
          return node;
        });
      };
      setDimensions(updateRecursive(dimensions));
      // Auto expand parent
      setExpandedDimIds(prev => new Set(prev).add(parentId));
    }
    setSelectedDimensionId(newNode.id);
  };

  const deleteDimension = (id: string) => {
     const deleteRecursive = (nodes: DimensionNode[]): DimensionNode[] => {
         return nodes.filter(node => node.id !== id).map(node => ({
             ...node,
             children: node.children ? deleteRecursive(node.children) : undefined
         }));
     };
     setDimensions(deleteRecursive(dimensions));
     if (selectedDimensionId === id) setSelectedDimensionId('');
  };

  // --- Dimension Linkage Logic ---
  const handleDimensionWeightChange = (newWeight: number) => {
    if (!currentSelectedDimension) return;
    
    const parentNode = findParentNode(dimensions, currentSelectedDimension.id);
    const baseScore = parentNode ? parentNode.score : planTotalScore;
    
    // Calculate score: Base Score * (Weight / 100)
    const newScore = baseScore ? (baseScore * newWeight / 100) : 0;
    
    updateDimensionNode(currentSelectedDimension.id, { 
      weight: newWeight,
      score: parseFloat(newScore.toFixed(1)) // Keep 1 decimal for score
    });
  };

  const handleDimensionScoreChange = (newScore: number) => {
    if (!currentSelectedDimension) return;

    const parentNode = findParentNode(dimensions, currentSelectedDimension.id);
    const baseScore = parentNode ? parentNode.score : planTotalScore;

    // Calculate weight: (Score / Base Score) * 100
    const newWeight = baseScore ? (newScore / baseScore * 100) : 0;

    updateDimensionNode(currentSelectedDimension.id, { 
      score: newScore,
      weight: parseFloat(newWeight.toFixed(2)) // Keep 2 decimals for weight
    });
  };

  // --- Indicator Association Logic ---
  const handleAddIndicators = (ids: string[]) => {
      const currentNode = findDimensionNode(dimensions, selectedDimensionId);
      if (currentNode) {
          // Create a map of existing indicators to preserve their configuration (weight, score)
          const existingMap = new Map(currentNode.indicators?.map(i => [i.id, i]) || []);

          // Helper to find names
          const findIndicatorName = (nodes: Indicator[], id: string): string => {
              for(const node of nodes) {
                  if (node.id === id) return node.name;
                  if (node.children) {
                      const found = findIndicatorName(node.children, id);
                      if (found) return found;
                  }
              }
              return id;
          };

          // Synchronize selection: 
          // 1. If ID exists, keep old config. 
          // 2. If new, create new config.
          // 3. Implicitly removes IDs not in the 'ids' array.
          const mergedIndicators: AssociatedIndicatorConfig[] = ids.map(id => {
              if (existingMap.has(id)) {
                  return existingMap.get(id)!;
              }
              return {
                  id,
                  name: findIndicatorName(INDICATORS, id),
                  weight: 0,
                  score: 0
              };
          });
          
          updateDimensionNode(selectedDimensionId, {
              indicators: mergedIndicators
          });
      }
      setIsIndicatorModalOpen(false);
  };

  // --- Indicator Linkage Logic ---
  const handleIndicatorWeightChange = (indId: string, newWeight: number) => {
      const currentNode = findDimensionNode(dimensions, selectedDimensionId);
      if(currentNode && currentNode.indicators) {
          const baseScore = currentNode.score;
          // Score = Dimension Score * (Weight / 100)
          const newScore = baseScore ? (baseScore * newWeight / 100) : 0;

          const updatedIndicators = currentNode.indicators.map(ind => 
              ind.id === indId ? { 
                  ...ind, 
                  weight: newWeight,
                  score: parseFloat(newScore.toFixed(1))
              } : ind
          );
          updateDimensionNode(selectedDimensionId, { indicators: updatedIndicators });
      }
  };

  const handleIndicatorScoreChange = (indId: string, newScore: number) => {
      const currentNode = findDimensionNode(dimensions, selectedDimensionId);
      if(currentNode && currentNode.indicators) {
          const baseScore = currentNode.score;
          // Weight = (Score / Dimension Score) * 100
          const newWeight = baseScore ? (newScore / baseScore * 100) : 0;

          const updatedIndicators = currentNode.indicators.map(ind => 
              ind.id === indId ? { 
                  ...ind, 
                  score: newScore,
                  weight: parseFloat(newWeight.toFixed(2))
              } : ind
          );
          updateDimensionNode(selectedDimensionId, { indicators: updatedIndicators });
      }
  };

  const removeIndicator = (indId: string) => {
      const currentNode = findDimensionNode(dimensions, selectedDimensionId);
      if(currentNode && currentNode.indicators) {
          const updatedIndicators = currentNode.indicators.filter(ind => ind.id !== indId);
          updateDimensionNode(selectedDimensionId, { indicators: updatedIndicators });
      }
  };

  const currentSelectedDimension = findDimensionNode(dimensions, selectedDimensionId);

  // --- Statistics for current dimension's indicators ---
  const { indTotalWeight, indTotalScore } = useMemo(() => {
      let w = 0;
      let s = 0;
      currentSelectedDimension?.indicators?.forEach(i => {
          w += i.weight || 0;
          s += i.score || 0;
      });
      // Handle floating point errors
      return { 
          indTotalWeight: parseFloat(w.toFixed(2)), 
          indTotalScore: parseFloat(s.toFixed(1)) 
      };
  }, [currentSelectedDimension]);

  const isScoreOverflow = currentSelectedDimension && indTotalScore > currentSelectedDimension.score;
  const isWeightOverflow = indTotalWeight > 100;

  // --- Render Helpers ---

  // 1. Render Department Tree (for 'department' mode)
  const renderDepartmentTree = (depts: Department[], level = 0) => {
    return depts.map(dept => {
        // Filter logic
        const hasChildren = dept.children && dept.children.length > 0;
        const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
        const childMatches = hasChildren && JSON.stringify(dept.children).toLowerCase().includes(searchTerm.toLowerCase());
        
        if (searchTerm && !matchesSearch && !childMatches) return null;

        const isExpanded = expandedDeptIds.has(dept.id) || (searchTerm.length > 0 && childMatches);

        return (
            <div key={dept.id}>
                <div 
                    className={`flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer transition-colors ${selectedIds.has(dept.id) ? 'bg-blue-50/50' : ''}`}
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                    onClick={() => toggleSelection(dept.id)}
                >
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleDeptExpand(dept.id); }}
                        className={`p-0.5 rounded hover:bg-gray-200 text-gray-400 ${!hasChildren ? 'invisible' : ''}`}
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    
                    <Checkbox 
                        checked={selectedIds.has(dept.id)}
                        onChange={() => {}} // Handled by parent div click
                        className="w-4 h-4"
                    />
                    
                    <span className={`text-sm ${selectedIds.has(dept.id) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                        {dept.name}
                    </span>
                </div>
                {hasChildren && isExpanded && (
                    <div className="border-l border-gray-100 ml-5">
                        {renderDepartmentTree(dept.children!, level + 1)}
                    </div>
                )}
            </div>
        );
    });
  };

  // 2. Render Discipline List (for 'discipline' mode)
  const renderDisciplineList = () => {
      const filtered = MOCK_DISCIPLINES.filter(d => d.name.includes(searchTerm));
      
      return (
          <div className="grid grid-cols-2 gap-2">
              {filtered.map(disc => (
                  <div 
                    key={disc.id}
                    onClick={() => toggleSelection(disc.id)}
                    className={`
                        flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                        ${selectedIds.has(disc.id) 
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'}
                    `}
                  >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedIds.has(disc.id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                          {selectedIds.has(disc.id) && <Check size={10} className="text-white" />}
                      </div>
                      <span className={`text-sm ${selectedIds.has(disc.id) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                          {disc.name}
                      </span>
                  </div>
              ))}
          </div>
      );
  };

  // 3. Render Person Tree (Department -> Person)
  const renderPersonTree = () => {
      // Flatten people into departments
      const peopleByDept: Record<string, typeof MOCK_PEOPLE> = {};
      MOCK_PEOPLE.forEach(p => {
          if (!peopleByDept[p.deptId]) peopleByDept[p.deptId] = [];
          peopleByDept[p.deptId].push(p);
      });

      // Recursive render like department tree, but leaf nodes are people
      const renderNodes = (depts: Department[], level = 0) => {
          return depts.map(dept => {
               // Find people in this dept
               const deptPeople = peopleByDept[dept.id] || [];
               const hasPeople = deptPeople.length > 0;
               const hasChildren = dept.children && dept.children.length > 0;
               
               // Filter
               const matchesSearch = dept.name.includes(searchTerm);
               const peopleMatch = deptPeople.some(p => p.name.includes(searchTerm));
               const childrenMatch = hasChildren && JSON.stringify(dept.children).includes(searchTerm); // Simple approximation
               
               if (searchTerm && !matchesSearch && !peopleMatch && !childrenMatch) return null;

               const isExpanded = expandedDeptIds.has(dept.id) || !!searchTerm;

               return (
                  <div key={dept.id}>
                      <div 
                        className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer"
                        style={{ paddingLeft: `${level * 16 + 8}px` }}
                        onClick={() => toggleDeptExpand(dept.id)}
                      >
                         <button className={`text-gray-400 ${(hasChildren || hasPeople) ? '' : 'invisible'}`}>
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                         </button>
                         <span className="text-sm font-bold text-gray-700">{dept.name}</span>
                         <span className="text-xs text-gray-400 bg-gray-100 px-1.5 rounded-full">{deptPeople.length}</span>
                      </div>

                      {isExpanded && (
                          <div className="border-l border-gray-100 ml-5">
                              {/* Render People */}
                              {deptPeople.map(person => {
                                  if (searchTerm && !person.name.includes(searchTerm)) return null;
                                  return (
                                    <div 
                                        key={person.id}
                                        onClick={() => toggleSelection(person.id)}
                                        className={`
                                            flex items-center gap-3 py-2 px-3 ml-4 mb-1 rounded-md cursor-pointer transition-colors
                                            ${selectedIds.has(person.id) ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'}
                                        `}
                                    >
                                        <Checkbox 
                                            checked={selectedIds.has(person.id)}
                                            onChange={() => {}} 
                                            className="w-3.5 h-3.5"
                                        />
                                        <span className="text-sm">{person.name}</span>
                                    </div>
                                  );
                              })}
                              {/* Render Sub-departments */}
                              {hasChildren && renderNodes(dept.children!, level + 1)}
                          </div>
                      )}
                  </div>
               );
          });
      };

      return renderNodes(DEPARTMENTS);
  };

  // 4. Render Dimension Tree
  const renderDimensionTree = (nodes: DimensionNode[], level = 0) => {
      return nodes.map(node => {
          const hasChildren = node.children && node.children.length > 0;
          const isExpanded = expandedDimIds.has(node.id);
          const isSelected = selectedDimensionId === node.id;

          return (
              <div key={node.id}>
                  <div 
                      className={`
                          flex items-center justify-between py-2 px-2 rounded-md cursor-pointer transition-all group mx-1
                          ${isSelected ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-gray-700 hover:bg-gray-100'}
                      `}
                      style={{ paddingLeft: `${level * 16 + 8}px` }}
                      onClick={() => setSelectedDimensionId(node.id)}
                  >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button 
                              onClick={(e) => { e.stopPropagation(); toggleDimExpand(node.id); }}
                              className={`p-0.5 rounded hover:bg-gray-200 text-gray-400 ${!hasChildren ? 'invisible' : ''}`}
                          >
                              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          <Layers size={14} className={isSelected ? 'text-blue-500' : 'text-gray-400'} />
                          <span className="truncate text-sm font-medium">{node.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                              {node.weight}%
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isSelected ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                              {node.score}分
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                              <button 
                                onClick={(e) => { e.stopPropagation(); addDimension(node.id); }}
                                className="p-1 hover:bg-white rounded text-gray-500 hover:text-blue-600 shadow-sm"
                                title="添加子维度"
                              >
                                  <Plus size={12} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteDimension(node.id); }}
                                className="p-1 hover:bg-white rounded text-gray-500 hover:text-red-600 shadow-sm"
                                title="删除维度"
                              >
                                  <Trash2 size={12} />
                              </button>
                          </div>
                      </div>
                  </div>
                  {hasChildren && isExpanded && (
                      <div className="border-l border-gray-200 ml-4 pl-1 my-1">
                          {renderDimensionTree(node.children!, level + 1)}
                      </div>
                  )}
              </div>
          );
      });
  };

  // --- Right Panel Helpers ---
  const getSelectedItems = () => {
      const items: {id: string, name: string, sub?: string}[] = [];
      if (targetType === 'department') {
          const findName = (depts: Department[]): void => {
              depts.forEach(d => {
                  if (selectedIds.has(d.id)) items.push({ id: d.id, name: d.name });
                  if (d.children) findName(d.children);
              });
          };
          findName(DEPARTMENTS);
      } else if (targetType === 'discipline') {
          MOCK_DISCIPLINES.forEach(d => {
              if (selectedIds.has(d.id)) items.push({ id: d.id, name: d.name });
          });
      } else if (targetType === 'person') {
          MOCK_PEOPLE.forEach(p => {
              if (selectedIds.has(p.id)) items.push({ id: p.id, name: p.name, sub: p.dept });
          });
      }
      return items;
  };

  const selectedItemsList = getSelectedItems();

  return (
    <div className="flex-1 w-full flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center px-4 flex-shrink-0 bg-white justify-between">
        <div className="flex items-center gap-4">
            <button 
                onClick={onBack}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">返回</span>
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex flex-col">
                <h2 className="text-lg font-bold text-gray-800 leading-tight">{plan.name}</h2>
                <span className="text-xs text-gray-400">方案配置</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                重置
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                保存配置
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
        <button
          onClick={() => setActiveTab('targets')}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors relative ${
            activeTab === 'targets' 
              ? 'border-blue-600 text-blue-600 bg-white' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users size={16} />
          配置考评对象
        </button>
        <button
          onClick={() => setActiveTab('dimensions')}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors relative ${
            activeTab === 'dimensions' 
              ? 'border-blue-600 text-blue-600 bg-white' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Layers size={16} />
          配置考核维度与指标
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 bg-gray-50 overflow-hidden flex flex-col">
        {activeTab === 'targets' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-1 w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                
                {/* Left Panel: Source Selection */}
                <div className="w-[60%] flex flex-col border-r border-gray-100">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            {targetType === 'department' && <Layers size={18} className="text-blue-500" />}
                            {targetType === 'discipline' && <Check size={18} className="text-purple-500" />}
                            {targetType === 'person' && <Users size={18} className="text-green-500" />}
                            
                            {targetType === 'department' && '选择科室'}
                            {targetType === 'discipline' && '选择学科'}
                            {targetType === 'person' && '选择人员'}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Filter size={12} />
                            <span>当前模式: {
                                targetType === 'department' ? '按科室' : 
                                targetType === 'discipline' ? '按学科' : '按人员'
                            }</span>
                        </div>
                    </div>
                    
                    {/* Search */}
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <input 
                                type="text" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder={`搜索${targetType === 'department' ? '科室' : targetType === 'discipline' ? '学科' : '人员'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    </div>

                    {/* Tree/List Content */}
                    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        {targetType === 'department' && (
                            <div className="space-y-1">
                                {renderDepartmentTree(DEPARTMENTS)}
                            </div>
                        )}
                        {targetType === 'discipline' && renderDisciplineList()}
                        {targetType === 'person' && (
                            <div className="space-y-1">
                                {renderPersonTree()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Selected Items */}
                <div className="w-[40%] flex flex-col bg-gray-50/20">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">已选择</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                {selectedIds.size}
                            </span>
                        </div>
                        <button 
                            onClick={clearSelection}
                            className="text-xs text-gray-500 hover:text-red-500 hover:underline transition-colors disabled:opacity-50"
                            disabled={selectedIds.size === 0}
                        >
                            清空全部
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                        {selectedItemsList.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Check size={20} className="text-gray-300" />
                                </div>
                                <span className="text-sm">暂无已选对象</span>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 content-start">
                                {selectedItemsList.map(item => (
                                    <div 
                                        key={item.id}
                                        className="bg-white border border-blue-100 text-blue-700 pl-3 pr-2 py-1.5 rounded-md text-sm shadow-sm flex items-center gap-2 animate-in zoom-in-95 duration-200 group hover:border-blue-300"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium leading-tight">{item.name}</span>
                                            {item.sub && <span className="text-[10px] text-blue-400 leading-tight">{item.sub}</span>}
                                        </div>
                                        <button 
                                            onClick={() => toggleSelection(item.id)}
                                            className="p-0.5 hover:bg-blue-100 rounded text-blue-400 hover:text-blue-700 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'dimensions' && (
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-1 w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                 
                 {/* Left Panel: Dimension Tree */}
                 <div className="w-[35%] flex flex-col border-r border-gray-100 bg-gray-50/20">
                     <div className="p-4 border-b border-gray-100 bg-white flex flex-col gap-3">
                         <div className="flex items-center justify-between">
                             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                 <Layers size={18} className="text-blue-600" />
                                 考核维度结构
                             </h3>
                             <button 
                                 onClick={() => addDimension()}
                                 className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors bg-white border border-gray-200 shadow-sm"
                                 title="添加一级维度"
                             >
                                 <Plus size={16} />
                             </button>
                         </div>
                         
                         {/* Plan Total Score Configuration */}
                         <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100 flex items-center justify-between">
                             <div className="flex items-center gap-1.5 text-blue-800">
                                <Trophy size={14} />
                                <span className="text-xs font-bold">方案总分设置</span>
                             </div>
                             <div className="flex items-center gap-2">
                                  <input 
                                    type="number" 
                                    className="w-20 h-7 text-sm font-bold text-blue-700 text-center border border-blue-200 rounded bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                                    value={planTotalScore}
                                    onChange={(e) => setPlanTotalScore(Number(e.target.value))}
                                  />
                                  <span className="text-xs text-gray-500">分</span>
                             </div>
                         </div>
                     </div>

                     <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                         {renderDimensionTree(dimensions)}
                     </div>

                     {/* Stats Footer */}
                     <div className="p-3 border-t border-gray-100 bg-white grid grid-cols-2 gap-3 text-xs">
                         <div className="flex flex-col items-center bg-gray-50 rounded-md p-2 border border-gray-200">
                             <span className="text-gray-500 mb-0.5">权重合计</span>
                             <span className={`font-mono font-bold text-sm ${totalWeight === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                                 {totalWeight}%
                             </span>
                         </div>
                         <div className={`flex flex-col items-center rounded-md p-2 border ${currentTotalScore === planTotalScore ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                             <span className="text-gray-500 mb-0.5">当前总分 / 方案总分</span>
                             <div className="flex items-baseline gap-1">
                                 <span className={`font-mono font-bold text-sm ${currentTotalScore === planTotalScore ? 'text-green-700' : 'text-orange-600'}`}>
                                     {currentTotalScore}
                                 </span>
                                 <span className="text-gray-400">/</span>
                                 <span className="font-mono text-gray-500">
                                     {planTotalScore}
                                 </span>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Right Panel: Dimension Details */}
                 <div className="w-[65%] flex flex-col bg-white">
                     {currentSelectedDimension ? (
                         <>
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Edit2 size={16} className="text-gray-400" />
                                    维度详情配置
                                </h3>
                                
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">维度名称</label>
                                        <input 
                                            type="text" 
                                            value={currentSelectedDimension.name}
                                            onChange={(e) => updateDimensionNode(currentSelectedDimension.id, { name: e.target.value })}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">权重设置 (%)</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                min="0"
                                                max="100"
                                                value={currentSelectedDimension.weight}
                                                onChange={(e) => handleDimensionWeightChange(Number(e.target.value))}
                                                className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                                            />
                                            <Percent size={14} className="absolute right-3 top-2.5 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">分值设置</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                min="0"
                                                value={currentSelectedDimension.score}
                                                onChange={(e) => handleDimensionScoreChange(Number(e.target.value))}
                                                className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                                            />
                                            <Hash size={14} className="absolute right-3 top-2.5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                        <Target size={16} className="text-purple-500" />
                                        关联指标
                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                                            {currentSelectedDimension.indicators?.length || 0}
                                        </span>
                                    </h4>
                                    <button 
                                        onClick={() => setIsIndicatorModalOpen(true)}
                                        className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1"
                                    >
                                        <Plus size={14} />
                                        添加指标
                                    </button>
                                </div>

                                {/* Validation Status Bar */}
                                {(currentSelectedDimension.indicators && currentSelectedDimension.indicators.length > 0) && (
                                    <div className={`mb-3 px-4 py-2 rounded-lg text-xs flex items-center justify-between border ${
                                        isScoreOverflow || isWeightOverflow 
                                            ? 'bg-orange-50 border-orange-200 text-orange-700' 
                                            : 'bg-blue-50 border-blue-100 text-blue-700'
                                    }`}>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="opacity-70">指标总分:</span>
                                                <span className={`font-bold font-mono ${isScoreOverflow ? 'text-red-600' : ''}`}>
                                                    {indTotalScore}
                                                </span>
                                                <span className="opacity-50">/ {currentSelectedDimension.score}</span>
                                            </div>
                                            <div className="w-px h-3 bg-current opacity-20"></div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="opacity-70">指标总权重:</span>
                                                <span className={`font-bold font-mono ${isWeightOverflow ? 'text-red-600' : ''}`}>
                                                    {indTotalWeight}%
                                                </span>
                                                <span className="opacity-50">/ 100%</span>
                                            </div>
                                        </div>
                                        {(isScoreOverflow || isWeightOverflow) && (
                                            <div className="flex items-center gap-1 font-medium animate-pulse">
                                                <AlertCircle size={12} />
                                                <span>已超出限制，请调整</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50/30">
                                    {!currentSelectedDimension.indicators || currentSelectedDimension.indicators.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                            <Target size={24} className="text-gray-300" />
                                            <span className="text-sm">暂无关联指标</span>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 border-b border-gray-200 w-[40%]">指标名称</th>
                                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 border-b border-gray-200 w-[25%]">指标权重 (%)</th>
                                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 border-b border-gray-200 w-[25%]">指标分值</th>
                                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 border-b border-gray-200 text-center w-[10%]">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {currentSelectedDimension.indicators.map((ind) => (
                                                    <tr key={ind.id} className="hover:bg-blue-50/30 group">
                                                        <td className="px-4 py-3 text-sm text-gray-800">
                                                            <div className="flex items-center gap-2">
                                                                <FileText size={14} className="text-gray-400" />
                                                                <span className="truncate">{ind.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <input 
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    className="w-16 border border-gray-200 rounded px-2 py-1 text-sm text-center focus:border-blue-500 outline-none"
                                                                    value={ind.weight}
                                                                    onChange={(e) => handleIndicatorWeightChange(ind.id, Number(e.target.value))}
                                                                />
                                                                <span className="text-gray-400 text-xs">%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <input 
                                                                    type="number"
                                                                    min="0"
                                                                    className="w-16 border border-gray-200 rounded px-2 py-1 text-sm text-center focus:border-blue-500 outline-none"
                                                                    value={ind.score}
                                                                    onChange={(e) => handleIndicatorScoreChange(ind.id, Number(e.target.value))}
                                                                />
                                                                <span className="text-gray-400 text-xs">分</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <button 
                                                                onClick={() => removeIndicator(ind.id)}
                                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                         </>
                     ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                             <Layers size={48} className="text-gray-200 mb-4" />
                             <p className="text-sm font-medium">请从左侧选择一个维度进行配置</p>
                         </div>
                     )}
                 </div>
             </div>
        )}
      </div>

      {/* Modals */}
      <IndicatorSelectModal 
        isOpen={isIndicatorModalOpen}
        onClose={() => setIsIndicatorModalOpen(false)}
        onConfirm={handleAddIndicators}
        initialSelection={currentSelectedDimension?.indicators?.map(i => i.id) || []}
        disabledIds={disabledIndicatorIds}
      />
    </div>
  );
};
