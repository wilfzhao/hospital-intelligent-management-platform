
import React, { useState, useMemo } from 'react';
import { TabType, Indicator, Department, SpecialPermission } from '../types';
import { INDICATORS, ROLES, DEPARTMENTS } from '../constants';
import { Toggle } from './ui/Toggle';
import { Checkbox } from './ui/Checkbox';
import SpecialPermissionModal from './SpecialPermissionModal';
import { Search, Info, ChevronRight, ChevronDown, Shield, Users, Building, AlertCircle, Edit2, RotateCcw, CheckCircle2, LayoutGrid, Check, FolderTree, ShieldAlert, Plus, Trash2 } from 'lucide-react';

type DataScope = 'department' | 'hospital' | 'custom';

interface PermissionTableProps {
  activeRoleId: string;
}

const PermissionTable: React.FC<PermissionTableProps> = ({ activeRoleId }) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.INDICATOR_PERMISSION);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [indicators, setIndicators] = useState<Indicator[]>(INDICATORS);
  
  // Data Permission State: Role Defaults
  const [roleScopeDefaults, setRoleScopeDefaults] = useState<Record<string, DataScope>>({
    'r1': 'hospital',
    'r2': 'hospital',
    'r3': 'hospital',
    'r4': 'custom', 
  });

  // Data Permission State: Custom Scope Data { key: departmentIds[] }
  // Keys: "role-{roleId}"
  // Default mock data for r4 custom scope
  const [customScopeData, setCustomScopeData] = useState<Record<string, string[]>>({
    'role-r4': ['d1-1', 'd1-2', 'd2-1', 'd2-2'] 
  });

  // --- SPECIAL PERMISSIONS STATE ---
  const [specialPermissions, setSpecialPermissions] = useState<SpecialPermission[]>([]);
  const [isSpecialModalOpen, setIsSpecialModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<SpecialPermission | undefined>(undefined);

  const handleAddSpecialPermission = () => {
    setEditingPermission(undefined);
    setIsSpecialModalOpen(true);
  };

  const handleEditSpecialPermission = (perm: SpecialPermission) => {
    setEditingPermission(perm);
    setIsSpecialModalOpen(true);
  };

  const handleDeleteSpecialPermission = (id: string) => {
    setSpecialPermissions(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveSpecialPermission = (perm: SpecialPermission) => {
    if (editingPermission) {
        setSpecialPermissions(prev => prev.map(p => p.id === perm.id ? perm : p));
    } else {
        setSpecialPermissions(prev => [...prev, perm]);
    }
  };

  // Helper to get indicator names from IDs for display
  const getIndicatorNamesSummary = (ids: string[]) => {
     // Naive lookup for mock data
     const findName = (nodes: Indicator[], id: string): string | null => {
         for (const node of nodes) {
             if (node.id === id) return node.name;
             if (node.children) {
                 const res = findName(node.children, id);
                 if (res) return res;
             }
         }
         return null;
     };
     const names = ids.map(id => findName(INDICATORS, id)).filter(Boolean);
     if (names.length === 0) return '未知指标';
     if (names.length <= 2) return names.join(', ');
     return `${names[0]}, ${names[1]} 等${names.length}个指标`;
  };

  // Tree View State for Departments
  const [expandedDeptIds, setExpandedDeptIds] = useState<Set<string>>(new Set(['d1', 'd2', 'd3']));

  // Row selection state (for indicator tab)
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['g1', 'g2', 'g3', '9']));

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const toggleDeptExpand = (id: string) => {
    const newExpanded = new Set(expandedDeptIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedDeptIds(newExpanded);
  };

  // Helper to check if a node has children
  const hasChildren = (node: Indicator) => node.children && node.children.length > 0;

  // Helper to get all IDs recursively for Select All
  const getAllIds = (nodes: Indicator[]): string[] => {
    let ids: string[] = [];
    nodes.forEach(node => {
      ids.push(node.id);
      if (node.children) {
        ids = ids.concat(getAllIds(node.children));
      }
    });
    return ids;
  };

  const allIds = getAllIds(indicators);
  const isAllSelected = allIds.length > 0 && selectedRowIds.size === allIds.length;
  const isIndeterminateSelection = selectedRowIds.size > 0 && selectedRowIds.size < allIds.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(allIds));
    }
  };

  const handleSelectRow = (id: string) => {
    // Helper to find node by ID
    const findNode = (nodes: Indicator[], targetId: string): Indicator | undefined => {
      for (const node of nodes) {
        if (node.id === targetId) return node;
        if (node.children) {
          const found = findNode(node.children, targetId);
          if (found) return found;
        }
      }
      return undefined;
    };

    // Helper to get all descendant IDs
    const getSubtreeIds = (node: Indicator): string[] => {
      let ids = [node.id];
      if (node.children) {
        node.children.forEach(child => {
          ids = ids.concat(getSubtreeIds(child));
        });
      }
      return ids;
    };

    const targetNode = findNode(indicators, id);
    if (!targetNode) return;

    const idsToToggle = getSubtreeIds(targetNode);
    const newSet = new Set(selectedRowIds);
    
    // Check if we are selecting or deselecting based on the clicked node's current state
    const isSelecting = !newSet.has(id);

    idsToToggle.forEach(nodeId => {
      if (isSelecting) {
        newSet.add(nodeId);
      } else {
        newSet.delete(nodeId);
      }
    });

    setSelectedRowIds(newSet);
  };

  // --- Data Permission Logic ---

  const currentRoleName = ROLES.find(r => r.id === activeRoleId)?.name || '未知角色';
  const currentRoleDefaultScope = roleScopeDefaults[activeRoleId] || 'department';

  const updateRoleDefaultScope = (scope: DataScope) => {
    setRoleScopeDefaults(prev => ({
      ...prev,
      [activeRoleId]: scope
    }));
  };

  const handleToggleDepartment = (deptId: string) => {
    const key = `role-${activeRoleId}`;
    const currentList = customScopeData[key] || [];
    let newList = [...currentList];
    
    if (newList.includes(deptId)) {
        newList = newList.filter(id => id !== deptId);
    } else {
        newList.push(deptId);
    }
    
    setCustomScopeData(prev => ({ ...prev, [key]: newList }));
  };

  const handleToggleGroup = (group: Department) => {
    const key = `role-${activeRoleId}`;
    const currentList = customScopeData[key] || [];
    const childrenIds = group.children?.map(c => c.id) || [];
    
    // Check if all children are currently selected
    const allSelected = childrenIds.length > 0 && childrenIds.every(id => currentList.includes(id));
    
    let newList = [...currentList];
    
    if (allSelected) {
        // Deselect all children
        newList = newList.filter(id => !childrenIds.includes(id));
    } else {
        // Select all children
        childrenIds.forEach(id => {
            if (!newList.includes(id)) newList.push(id);
        });
    }
    
    setCustomScopeData(prev => ({ ...prev, [key]: newList }));
  };

  // Helper to render the visible departments based on current scope
  const renderVisibleDepartments = () => {
     if (currentRoleDefaultScope === 'department') {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-gray-500 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200 animate-in fade-in zoom-in-95 duration-300">
                 <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Users size={32} className="text-blue-500" />
                 </div>
                 <h3 className="text-base font-bold text-gray-800 mb-2">动态匹配所属科室</h3>
                 <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed px-4">
                    该配置应用于角色。当用户被分配此角色时，系统将自动识别其所属科室，并限制其仅能查看本段科室的数据。
                 </p>
                 <div className="mt-6 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                    <Info size={12} />
                    无需手动勾选科室明细
                 </div>
            </div>
        );
     }

     const isEditable = currentRoleDefaultScope === 'custom';
     
     // Determine active IDs for display
     let currentSelectedIds: string[] = [];
     if (isEditable) {
         currentSelectedIds = customScopeData[`role-${activeRoleId}`] || [];
     }

     const getStatus = (childrenIds: string[]) => {
        if (currentRoleDefaultScope === 'hospital') return { checked: true, indeterminate: false };
        
        const selectedCount = childrenIds.filter(id => currentSelectedIds.includes(id)).length;
        const allSelected = childrenIds.length > 0 && selectedCount === childrenIds.length;
        const someSelected = selectedCount > 0 && selectedCount < childrenIds.length;
        
        return { checked: allSelected, indeterminate: someSelected };
     };

     return (
         <div className="flex flex-col gap-3">
             <div className="border border-gray-200 rounded-lg bg-white select-none shadow-sm">
                 {DEPARTMENTS.map(group => {
                     const childrenIds = group.children?.map(c => c.id) || [];
                     const { checked, indeterminate } = getStatus(childrenIds);
                     const isExpanded = expandedDeptIds.has(group.id);

                     return (
                         <div key={group.id} className="border-b border-gray-100 last:border-0">
                             {/* Group Header */}
                             <div className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50/50' : ''}`}>
                                  <button 
                                     onClick={(e) => { e.stopPropagation(); toggleDeptExpand(group.id); }}
                                     className="p-1 mr-2 text-gray-400 hover:text-blue-600 rounded transition-colors"
                                  >
                                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                  </button>
                                  
                                  <div 
                                     className={`flex items-center gap-3 flex-1 ${isEditable ? 'cursor-pointer' : ''}`}
                                     onClick={() => isEditable && handleToggleGroup(group)}
                                  >
                                      <div className={`
                                          w-4 h-4 rounded border flex items-center justify-center transition-all
                                          ${checked || indeterminate ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}
                                          ${!isEditable ? 'opacity-60 bg-blue-600 border-blue-600' : ''} 
                                      `}>
                                          {checked && <Check size={12} className="text-white" />}
                                          {indeterminate && !checked && <div className="w-2 h-0.5 bg-white rounded-full" />}
                                          {!isEditable && !checked && <Check size={12} className="text-white" />}
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                          <span className="text-sm font-bold text-gray-700">{group.name}</span>
                                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{childrenIds.length}</span>
                                      </div>
                                  </div>
                             </div>

                             {/* Children */}
                             {isExpanded && (
                                 <div className="bg-gray-50/30 border-t border-gray-100">
                                     {group.children?.map(dept => {
                                         const isChildSelected = currentRoleDefaultScope === 'hospital' || currentSelectedIds.includes(dept.id);
                                         
                                         return (
                                             <div 
                                                 key={dept.id}
                                                 onClick={() => isEditable && handleToggleDepartment(dept.id)}
                                                 className={`
                                                     flex items-center pl-14 pr-4 py-2.5 border-b border-gray-50/50 last:border-0 transition-colors
                                                     ${isEditable ? 'cursor-pointer hover:bg-blue-50/30' : ''}
                                                     ${!isEditable && isChildSelected ? 'bg-blue-50/20' : ''}
                                                 `}
                                             >
                                                 <div className={`
                                                     w-4 h-4 rounded border flex items-center justify-center mr-3 transition-all
                                                     ${isChildSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}
                                                     ${!isEditable ? 'opacity-60' : ''}
                                                 `}>
                                                     {isChildSelected && <Check size={12} className="text-white" />}
                                                 </div>
                                                 <span className={`text-sm ${isChildSelected ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                                                     {dept.name}
                                                 </span>
                                             </div>
                                         )
                                     })}
                                 </div>
                             )}
                         </div>
                     );
                 })}
             </div>
         </div>
     );
  };


  // --- Indicator Permission Logic ---
  const applyDependencies = (node: Indicator, key: keyof Indicator, value: boolean): Indicator => {
    const newNode = { ...node, [key]: value };
    if (key === 'fillPermission' && value === true) {
      newNode.readPermission = true;
      newNode.displayEntry = true;
    }
    if (key === 'readPermission') {
      if (value === true) {
        newNode.displayEntry = true;
      } else {
        newNode.displayEntry = false;
        newNode.fillPermission = false;
      }
    }
    if (key === 'displayEntry' && value === true) {
      if (!newNode.readPermission) {
        newNode.displayEntry = false; 
      }
    }
    if (!newNode.readPermission) {
       newNode.displayEntry = false;
    }
    if (newNode.tag === 'sub') {
      newNode.displayEntry = false;
    }
    return newNode;
  };

  const cascadeUpdate = (nodes: Indicator[], key: keyof Indicator, value: boolean): Indicator[] => {
    return nodes.map((node) => {
      let newNode = applyDependencies(node, key, value);
      if (hasChildren(newNode)) {
        newNode.children = cascadeUpdate(newNode.children!, key, value);
      }
      return newNode;
    });
  };

  const syncParents = (nodes: Indicator[]): Indicator[] => {
    return nodes.map((node) => {
      if (hasChildren(node)) {
        const syncedChildren = syncParents(node.children!);
        
        const allRead = syncedChildren.every(c => c.readPermission);
        const allFill = syncedChildren.every(c => c.fillPermission);
        const allDisplay = syncedChildren.every(c => c.displayEntry);

        return {
          ...node,
          children: syncedChildren,
          readPermission: allRead,
          fillPermission: allFill,
          displayEntry: allDisplay
        };
      }
      return node;
    });
  };

  const togglePermission = (targetId: string, type: 'read' | 'fill' | 'display') => {
    const targetKey =
      type === 'read'
        ? 'readPermission'
        : type === 'fill'
        ? 'fillPermission'
        : 'displayEntry';

    let nextValue = true;
    let targetName = '';
    
    const findTargetInfo = (nodes: Indicator[]) => {
      for (const node of nodes) {
        if (node.id === targetId) {
          nextValue = !node[targetKey];
          targetName = node.name;
          return;
        }
        if (node.children) findTargetInfo(node.children);
      }
    };
    findTargetInfo(indicators);

    if (!targetName) return;

    const updateTargetAndCascade = (nodes: Indicator[]): Indicator[] => {
      return nodes.map((node) => {
        const isTargetMatch = type === 'display' 
          ? node.id === targetId 
          : (node.id === targetId || node.name === targetName);

        if (isTargetMatch) {
          let updatedNode = applyDependencies(node, targetKey, nextValue);
          if (hasChildren(updatedNode)) {
             updatedNode.children = cascadeUpdate(updatedNode.children!, targetKey, nextValue);
          }
          return updatedNode;
        }
        if (node.children) {
          return { ...node, children: updateTargetAndCascade(node.children) };
        }
        return node;
      });
    };

    let newIndicators = updateTargetAndCascade(indicators);
    newIndicators = syncParents(newIndicators);
    setIndicators(newIndicators);
  };

  const getCheckboxState = (node: Indicator, type: 'read' | 'fill' | 'display') => {
    const key = type === 'read' ? 'readPermission' : type === 'fill' ? 'fillPermission' : 'displayEntry';
    const checked = node[key];
    if (!hasChildren(node)) return { checked, indeterminate: false };
    const checkRecursive = (n: Indicator): boolean => {
        const k = key as keyof Indicator;
        if (n[k]) return true;
        if (n.children) return n.children.some(checkRecursive);
        return false;
    };
    const isActuallyChecked = checked;
    const isSomeChecked = checkRecursive(node);
    return { checked: isActuallyChecked, indeterminate: !isActuallyChecked && isSomeChecked };
  };

  const getVisibleRows = (nodes: Indicator[], level = 0): Array<Indicator & { level: number }> => {
    let rows: Array<Indicator & { level: number }> = [];
    nodes.forEach(node => {
      rows.push({ ...node, level });
      if (node.children && expandedIds.has(node.id)) {
        rows = rows.concat(getVisibleRows(node.children, level + 1));
      }
    });
    return rows;
  };

  const visibleRows = getVisibleRows(indicators);

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col h-full overflow-hidden relative">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        <button
          className={`px-6 py-3 text-sm font-medium relative transition-colors ${
            activeTab === TabType.INDICATOR_PERMISSION ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(TabType.INDICATOR_PERMISSION)}
        >
          指标权限
          {activeTab === TabType.INDICATOR_PERMISSION && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in zoom-in-x duration-200"></div>
          )}
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium relative transition-colors ${
            activeTab === TabType.DATA_PERMISSION ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(TabType.DATA_PERMISSION)}
        >
          数据权限
          {activeTab === TabType.DATA_PERMISSION && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in zoom-in-x duration-200"></div>
          )}
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium relative transition-colors ${
            activeTab === TabType.PERSONNEL ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(TabType.PERSONNEL)}
        >
          角色下人员
          {activeTab === TabType.PERSONNEL && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in zoom-in-x duration-200"></div>
          )}
        </button>
      </div>

      {/* --- CONTENT AREA SWITCHER --- */}
      {activeTab === TabType.DATA_PERMISSION ? (
        // === DATA PERMISSION VIEW ===
        <div className="flex flex-col h-full overflow-hidden p-6 gap-6 bg-gray-50/50">
           
           {/* Section 1: Role Default Scope */}
           <div className="bg-white border border-blue-100 rounded-lg shadow-sm p-5 animate-in fade-in slide-in-from-top-2 duration-300 flex-shrink-0">
              <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                     <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <Shield size={20} />
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-800">角色默认数据范围</h3>
                        <p className="text-xs text-gray-500 mt-0.5">设置该角色下所有人员的默认数据可见性</p>
                     </div>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-medium border border-blue-100">
                      当前配置角色：{currentRoleName}
                  </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center gap-8">
                      <label className={`flex items-center gap-3 cursor-pointer select-none transition-all p-3 rounded-lg border ${currentRoleDefaultScope === 'department' ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500' : 'border-transparent hover:bg-gray-200/50'}`}>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${currentRoleDefaultScope === 'department' ? 'border-blue-600' : 'border-gray-400'}`}>
                              {currentRoleDefaultScope === 'department' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                          </div>
                          <div className="flex flex-col">
                             <span className={`text-sm font-bold ${currentRoleDefaultScope === 'department' ? 'text-blue-700' : 'text-gray-700'}`}>仅本人/本科室</span>
                             <span className="text-xs text-gray-500">只能查看归属于自己科室的数据</span>
                          </div>
                          <button onClick={() => updateRoleDefaultScope('department')} className="hidden" />
                      </label>

                      <label className={`flex items-center gap-3 cursor-pointer select-none transition-all p-3 rounded-lg border ${currentRoleDefaultScope === 'hospital' ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500' : 'border-transparent hover:bg-gray-200/50'}`}>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${currentRoleDefaultScope === 'hospital' ? 'border-blue-600' : 'border-gray-400'}`}>
                              {currentRoleDefaultScope === 'hospital' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                          </div>
                          <div className="flex flex-col">
                             <span className={`text-sm font-bold ${currentRoleDefaultScope === 'hospital' ? 'text-blue-700' : 'text-gray-700'}`}>全院数据</span>
                             <span className="text-xs text-gray-500">可查看全院所有科室的数据指标</span>
                          </div>
                          <button onClick={() => updateRoleDefaultScope('hospital')} className="hidden" />
                      </label>

                      <label className={`flex items-center gap-3 cursor-pointer select-none transition-all p-3 rounded-lg border ${currentRoleDefaultScope === 'custom' ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500' : 'border-transparent hover:bg-gray-200/50'}`}>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${currentRoleDefaultScope === 'custom' ? 'border-blue-600' : 'border-gray-400'}`}>
                              {currentRoleDefaultScope === 'custom' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                          </div>
                          <div className="flex flex-col">
                             <span className={`text-sm font-bold ${currentRoleDefaultScope === 'custom' ? 'text-blue-700' : 'text-gray-700'}`}>自定义范围</span>
                             <span className="text-xs text-gray-500">手动勾选可见的科室列表</span>
                          </div>
                          <button onClick={() => updateRoleDefaultScope('custom')} className="hidden" />
                      </label>
                  </div>
              </div>
           </div>

           {/* Section 2: Special Permissions (New) */}
           <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 animate-in fade-in slide-in-from-top-3 duration-400 flex-shrink-0">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                     <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                        <ShieldAlert size={20} />
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-800">特殊数据权限</h3>
                        <p className="text-xs text-gray-500 mt-0.5">为特定指标设置独立的数据可见范围，优先级高于默认配置</p>
                     </div>
                  </div>
                  <button 
                    onClick={handleAddSpecialPermission}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm font-medium shadow-sm"
                  >
                     <Plus size={16} />
                     添加例外规则
                  </button>
               </div>

               {specialPermissions.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg border border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-gray-400 gap-2">
                     <ShieldAlert size={24} className="text-gray-300" />
                     <span className="text-sm">暂无特殊规则配置</span>
                  </div>
               ) : (
                  <div className="space-y-3">
                     {specialPermissions.map(perm => {
                       const scopeLabel = perm.scope === 'hospital' ? '全院数据' : perm.scope === 'department' ? '本科室' : '自定义';
                       const scopeColor = perm.scope === 'hospital' ? 'bg-blue-100 text-blue-700 border-blue-200' : perm.scope === 'department' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-purple-100 text-purple-700 border-purple-200';
                       
                       return (
                         <div key={perm.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all bg-white group flex items-center justify-between">
                            <div className="flex items-center gap-4 overflow-hidden">
                               <div className={`px-2.5 py-1 rounded text-xs font-bold border whitespace-nowrap ${scopeColor}`}>
                                  {scopeLabel}
                               </div>
                               <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-bold text-gray-700 truncate">
                                     应用于: {getIndicatorNamesSummary(perm.targetIndicatorIds)}
                                  </span>
                                  {perm.scope === 'custom' && (
                                     <span className="text-xs text-gray-400">
                                        包含 {perm.customDeptIds?.length || 0} 个自定义科室
                                     </span>
                                  )}
                               </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => handleEditSpecialPermission(perm)}
                                 className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="编辑"
                               >
                                  <Edit2 size={14} />
                               </button>
                               <button 
                                 onClick={() => handleDeleteSpecialPermission(perm.id)}
                                 className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="删除"
                               >
                                  <Trash2 size={14} />
                               </button>
                            </div>
                         </div>
                       );
                     })}
                  </div>
               )}
           </div>

           {/* Section 3: Visible Departments Preview (Replaced Personnel) */}
           <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                  <div className="flex items-center gap-2">
                     <FolderTree size={18} className="text-gray-600" />
                     <h3 className="font-bold text-gray-800">默认可见科室预览</h3>
                  </div>
                  <div className="text-xs text-gray-400">
                     {currentRoleDefaultScope === 'custom' ? '点击可直接进行配置' : '根据上方默认配置自动生成'}
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-5 bg-white">
                  {renderVisibleDepartments()}
               </div>
           </div>
        </div>
      ) : (
        // === ORIGINAL INDICATOR PERMISSION VIEW ===
        <div className="p-5 flex-1 flex flex-col overflow-hidden">
          {/* Super Permission Banner */}
          <div className="bg-gray-50 rounded-md p-4 mb-4 flex items-center gap-3 border border-gray-100">
            <span className="text-sm font-bold text-gray-700">超级权限</span>
            <Info size={14} className="text-gray-400" />
            <Toggle checked={superAdmin} onChange={setSuperAdmin} size="sm" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">方案:</span>
                  <select className="border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-600 bg-white outline-none focus:border-blue-500 w-40 transition-colors">
                      <option>三级医院等级评审</option>
                      <option>公立医院绩效考核</option>
                  </select>
              </div>

              <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">指标权限:</span>
                  <select className="border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-600 bg-white outline-none focus:border-blue-500 w-32 transition-colors">
                      <option>请选择</option>
                      <option>有查阅权限</option>
                      <option>无查阅权限</option>
                  </select>
              </div>

              <div className="flex rounded border border-gray-200 overflow-hidden bg-white transition-colors focus-within:border-blue-500">
                  <input 
                      type="text" 
                      placeholder="请输入指标名称" 
                      className="px-3 py-1.5 text-sm outline-none text-gray-600 w-48 bg-white placeholder-gray-400"
                  />
                  <button className="bg-gray-50 px-3 text-gray-500 border-l border-gray-200 hover:bg-gray-100 transition-colors">
                      <span className="text-sm">搜索</span>
                  </button>
              </div>
            </div>

            <button 
              disabled={selectedRowIds.size === 0}
              className={`px-4 py-1.5 rounded text-sm transition-colors shadow-sm ${
                selectedRowIds.size > 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              批量操作
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="p-3 w-10 border-b border-gray-200 bg-gray-50">
                      <Checkbox 
                          checked={isAllSelected}
                          indeterminate={isIndeterminateSelection}
                          onChange={handleSelectAll}
                      />
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-600 border-b border-gray-200 w-[35%] bg-gray-50">指标名称</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 border-b border-gray-200 bg-gray-50">应用方案</th>
                  
                  {activeTab === TabType.INDICATOR_PERMISSION ? (
                    <>
                      <th className="p-3 text-xs font-semibold text-gray-600 border-b border-gray-200 w-24 text-center bg-gray-50">查阅权限</th>
                      <th className="p-3 text-xs font-semibold text-gray-600 border-b border-gray-200 w-24 text-center bg-gray-50">填报权限</th>
                      <th className="p-3 text-xs font-semibold text-gray-600 border-b border-gray-200 w-24 text-center bg-gray-50">展示入口</th>
                    </>
                  ) : (
                    <th className="p-3 text-xs font-semibold text-gray-600 border-b border-gray-200 bg-gray-50">人员列表</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleRows.map((item) => {
                  const readState = getCheckboxState(item, 'read');
                  const fillState = getCheckboxState(item, 'fill');
                  const displayState = getCheckboxState(item, 'display');
                  const isSub = item.tag === 'sub';
                  const isReadDisabled = !readState.checked && !readState.indeterminate;
                  const isDisplayDisabled = isReadDisabled || isSub;

                  return (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="p-3">
                        <Checkbox 
                            checked={selectedRowIds.has(item.id)}
                            onChange={() => handleSelectRow(item.id)}
                        />
                      </td>
                      <td className={`p-3 text-sm ${isSub ? 'text-gray-500' : 'text-blue-600'}`}>
                        <div className="flex items-center" style={{ paddingLeft: `${item.level * 24}px` }}>
                          <div className="w-5 flex items-center justify-center flex-shrink-0 mr-1">
                            {hasChildren(item) && (
                                <button onClick={() => toggleExpand(item.id)} className="text-gray-500 hover:text-blue-600 focus:outline-none transition-colors">
                                    {expandedIds.has(item.id) ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                                </button>
                            )}
                          </div>
                          <span className="cursor-pointer hover:underline truncate">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{item.scheme}</td>
                      
                      {activeTab === TabType.INDICATOR_PERMISSION ? (
                        <>
                          <td className="p-3 text-center">
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={readState.checked}
                                    indeterminate={readState.indeterminate}
                                    onChange={() => togglePermission(item.id, 'read')}
                                    className="w-4 h-4"
                                />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={fillState.checked}
                                    indeterminate={fillState.indeterminate}
                                    onChange={() => togglePermission(item.id, 'fill')}
                                    className="w-4 h-4"
                                />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={displayState.checked}
                                    indeterminate={displayState.indeterminate}
                                    onChange={() => togglePermission(item.id, 'display')}
                                    disabled={isDisplayDisabled}
                                    className="w-4 h-4"
                                />
                            </div>
                          </td>
                        </>
                      ) : (
                        <td className="p-3 text-sm text-gray-400">暂无人员数据</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Special Permission Modal */}
      <SpecialPermissionModal 
         isOpen={isSpecialModalOpen}
         onClose={() => setIsSpecialModalOpen(false)}
         onConfirm={handleSaveSpecialPermission}
         initialData={editingPermission}
      />
    </div>
  );
};

export default PermissionTable;
