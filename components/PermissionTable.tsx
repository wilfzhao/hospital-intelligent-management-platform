
import React, { useState } from 'react';
import { TabType, Indicator } from '../types';
import { INDICATORS } from '../constants';
import { Toggle } from './ui/Toggle';
import { Checkbox } from './ui/Checkbox';
import { Search, Info, ChevronRight, ChevronDown } from 'lucide-react';

const PermissionTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.INDICATOR_PERMISSION);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [indicators, setIndicators] = useState<Indicator[]>(INDICATORS);
  // Row selection state
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

  // 1. Dependency Logic (Single Node)
  // Ensures: Fill -> Read -> Display
  //          !Read -> !Fill, !Display
  const applyDependencies = (node: Indicator, key: keyof Indicator, value: boolean): Indicator => {
    const newNode = { ...node, [key]: value };

    // Rule 1: Fill Permission -> Read + Display
    if (key === 'fillPermission' && value === true) {
      newNode.readPermission = true;
      newNode.displayEntry = true;
    }

    // Rule 2: Read logic
    if (key === 'readPermission') {
      if (value === true) {
        // Checking Read enables Display (default)
        newNode.displayEntry = true;
      } else {
        // Unchecking Read disables Display and Fill
        newNode.displayEntry = false;
        newNode.fillPermission = false;
      }
    }

    // Rule 3: Display logic
    // Enforce: Cannot check display if read is false.
    if (key === 'displayEntry' && value === true) {
      if (!newNode.readPermission) {
        newNode.displayEntry = false; // Prevent change
      }
    }

    // Global Invariant: If Read is false, Display must be false.
    if (!newNode.readPermission) {
       newNode.displayEntry = false;
    }

    // Rule for 'sub' tag: Display Entry is always false
    if (newNode.tag === 'sub') {
      newNode.displayEntry = false;
    }

    return newNode;
  };

  // 2. Cascade Logic (Top-Down)
  const cascadeUpdate = (nodes: Indicator[], key: keyof Indicator, value: boolean): Indicator[] => {
    return nodes.map((node) => {
      let newNode = applyDependencies(node, key, value);
      if (hasChildren(newNode)) {
        newNode.children = cascadeUpdate(newNode.children!, key, value);
      }
      return newNode;
    });
  };

  // 3. Synchronization Logic (Bottom-Up)
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

  // 4. Main Toggle Handler
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
        /**
         * SPECIAL RULE: 
         * If type is 'display', only match by ID (isolate to current row/subtree).
         * For other types (read, fill), continue to match by Name as well (global sync).
         */
        const isTargetMatch = type === 'display' 
          ? node.id === targetId 
          : (node.id === targetId || node.name === targetName);

        if (isTargetMatch) {
          // Apply to self
          let updatedNode = applyDependencies(node, targetKey, nextValue);
          
          // Apply to subtree (Cascade Down)
          if (hasChildren(updatedNode)) {
             updatedNode.children = cascadeUpdate(updatedNode.children!, targetKey, nextValue);
          }
          return updatedNode;
        }
        
        // Recurse to find the node
        if (node.children) {
          return { ...node, children: updateTargetAndCascade(node.children) };
        }
        return node;
      });
    };

    let newIndicators = updateTargetAndCascade(indicators);

    // Sync Parents (Bubble Up)
    newIndicators = syncParents(newIndicators);

    setIndicators(newIndicators);
  };

  // Helper to determine indeterminate state for rendering
  const getCheckboxState = (node: Indicator, type: 'read' | 'fill' | 'display') => {
    const key =
      type === 'read'
        ? 'readPermission'
        : type === 'fill'
        ? 'fillPermission'
        : 'displayEntry';

    const checked = node[key];
    
    if (!hasChildren(node)) {
      return { checked, indeterminate: false };
    }

    const checkRecursive = (n: Indicator): boolean => {
        const k = key as keyof Indicator;
        if (n[k]) return true;
        if (n.children) return n.children.some(checkRecursive);
        return false;
    };
    
    const isActuallyChecked = checked;
    const isSomeChecked = checkRecursive(node);
    
    return {
        checked: isActuallyChecked,
        indeterminate: !isActuallyChecked && isSomeChecked
    };
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
    <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          className={`px-6 py-3 text-sm font-medium relative ${
            activeTab === TabType.INDICATOR_PERMISSION ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(TabType.INDICATOR_PERMISSION)}
        >
          指标权限
          {activeTab === TabType.INDICATOR_PERMISSION && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium relative ${
            activeTab === TabType.PERSONNEL ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(TabType.PERSONNEL)}
        >
          角色下人员
          {activeTab === TabType.PERSONNEL && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
          )}
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col overflow-hidden">
        {/* Super Permission Banner */}
        <div className="bg-gray-50 rounded-md p-4 mb-4 flex items-center gap-3">
          <span className="text-sm font-bold text-gray-700">超级权限</span>
          <Info size={14} className="text-gray-400" />
          <Toggle checked={superAdmin} onChange={setSuperAdmin} size="sm" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
             <div className="flex items-center gap-2">
                 <span className="text-sm text-gray-600">方案:</span>
                 <select className="border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-600 bg-white outline-none focus:border-blue-500 w-40">
                     <option>三级医院等级评审</option>
                     <option>公立医院绩效考核</option>
                 </select>
             </div>

             <div className="flex items-center gap-2">
                 <span className="text-sm text-gray-600">指标权限:</span>
                 <select className="border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-600 bg-white outline-none focus:border-blue-500 w-32">
                     <option>请选择</option>
                     <option>有查阅权限</option>
                     <option>无查阅权限</option>
                 </select>
             </div>

             <div className="flex rounded border border-gray-200 overflow-hidden bg-white">
                <input 
                    type="text" 
                    placeholder="请输入指标名称" 
                    className="px-3 py-1.5 text-sm outline-none text-gray-600 w-48 bg-white"
                />
                <button className="bg-gray-50 px-3 text-gray-500 border-l border-gray-200 hover:bg-gray-100">
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
        <div className="flex-1 overflow-auto border border-gray-100 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="p-3 w-10 border-b border-gray-100">
                    <Checkbox 
                        checked={isAllSelected}
                        indeterminate={isIndeterminateSelection}
                        onChange={handleSelectAll}
                    />
                </th>
                <th className="p-3 text-xs font-medium text-gray-500 border-b border-gray-100">指标名称</th>
                <th className="p-3 text-xs font-medium text-gray-500 border-b border-gray-100">应用方案</th>
                <th className="p-3 text-xs font-medium text-gray-500 border-b border-gray-100 w-24 text-center">查阅权限</th>
                <th className="p-3 text-xs font-medium text-gray-500 border-b border-gray-100 w-24 text-center">填报权限</th>
                <th className="p-3 text-xs font-medium text-gray-500 border-b border-gray-100 w-24 text-center">展示入口</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visibleRows.map((item) => {
                const readState = getCheckboxState(item, 'read');
                const fillState = getCheckboxState(item, 'fill');
                const displayState = getCheckboxState(item, 'display');

                const isSub = item.tag === 'sub';

                const isReadDisabled = !readState.checked && !readState.indeterminate;
                const isDisplayDisabled = isReadDisabled || isSub;

                return (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
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
                              <button onClick={() => toggleExpand(item.id)} className="text-gray-500 hover:text-blue-600 focus:outline-none">
                                  {expandedIds.has(item.id) ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                              </button>
                          )}
                         </div>
                         <span className="cursor-pointer hover:underline truncate">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{item.scheme}</td>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PermissionTable;
