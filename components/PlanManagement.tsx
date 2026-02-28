
import React, { useState, useMemo } from 'react';
import { Plus, Search, FileText, Award, Layers, Target, Clock, Filter, Grid, List } from 'lucide-react';
import { PLANS } from '../constants';
import { Plan } from '../types';
import CreatePlanModal from './CreatePlanModal';

interface PlanManagementProps {
  onAddPlan?: (name: string) => void;
  onAssociate?: (plan: Plan) => void;
}

const PlanManagement: React.FC<PlanManagementProps> = ({ onAddPlan, onAssociate }) => {
  const [plans, setPlans] = useState<Plan[]>(PLANS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'standard' | 'featured'>('standard');

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => plan.type === activeFilter);
  }, [plans, activeFilter]);

  const handleSavePlan = (data: Partial<Plan>) => {
    const newPlan: Plan = {
      id: Date.now().toString(),
      name: data.name || '未命名方案',
      type: data.type || 'standard',
      indicatorCount: 0,
      remark: data.remark || '无',
      status: data.status || 'enabled',
      application: data.application,
      target: data.target,
      cycle: data.cycle
    };
    setPlans([newPlan, ...plans]);
    
    // Add to Header
    if (onAddPlan && newPlan.name) {
      onAddPlan(newPlan.name);
    }
  };

  const handleAssociateClick = (plan: Plan) => {
    if (onAssociate) {
      onAssociate(plan);
    }
  };

  const getTargetLabel = (target?: string) => {
    switch (target) {
      case 'department': return '科室';
      case 'discipline': return '学科';
      case 'person': return '人员';
      default: return '-';
    }
  };

  const getCycleLabel = (cycle?: string) => {
    switch (cycle) {
      case 'year': return '年度';
      case 'quarter': return '季度';
      case 'month': return '月度';
      default: return '-';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
      {/* Top Bar with Filter Tabs */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col gap-4 border border-gray-100 flex-shrink-0">
        <div className="flex justify-between items-center">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100/80 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveFilter('standard')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeFilter === 'standard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Layers size={14} />
                  标准考评方案
                </button>
                <button 
                  onClick={() => setActiveFilter('featured')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeFilter === 'featured' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Award size={14} />
                  特色考评方案
                </button>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus size={16} />
              新建
            </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex rounded border border-gray-200 overflow-hidden bg-white shadow-sm focus-within:ring-1 focus-within:ring-blue-500 transition-all w-80">
            <div className="pl-3 py-2 text-gray-400">
               <Search size={16} />
            </div>
            <input 
                type="text" 
                placeholder="搜索方案名称或应用..." 
                className="px-2 py-2 text-sm outline-none text-gray-600 w-full bg-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">共 {filteredPlans.length} 个方案</span>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPlans.map((plan: Plan) => {
            const isFeatured = plan.type === 'featured';
            
            return (
              <div 
                key={plan.id} 
                className={`
                  bg-white rounded-xl shadow-sm border p-5 relative group hover:shadow-lg transition-all duration-300 flex flex-col
                  ${isFeatured ? 'border-purple-100 hover:border-purple-200' : 'border-gray-100 hover:border-blue-200'}
                `}
              >
                {/* Top Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border flex items-center gap-1.5 ${
                    isFeatured 
                      ? 'bg-purple-50 text-purple-600 border-purple-100' 
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {isFeatured ? <Award size={12} /> : <Layers size={12} />}
                    {isFeatured ? '特色考评' : '标准考评'}
                  </div>
                  
                  <div className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${
                      plan.status === 'enabled' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                     <div className={`w-1.5 h-1.5 rounded-full ${plan.status === 'enabled' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                     {plan.status === 'enabled' ? '已启用' : '已停用'}
                  </div>
                </div>

                {/* Header */}
                <div className="flex items-start gap-4 mb-3">
                  <div className={`
                    p-3 rounded-xl flex-shrink-0 text-white shadow-sm
                    ${isFeatured 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-200' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-200'}
                  `}>
                    {isFeatured ? <Award size={24} /> : <FileText size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base leading-snug mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {plan.name}
                    </h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        {plan.application}
                    </p>
                  </div>
                </div>

                {/* Metadata Grid (Featured Only) */}
                {isFeatured && (
                    <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded bg-white border border-gray-100 flex items-center justify-center text-purple-500">
                                <Target size={14} />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400">考核对象</span>
                                <span className="text-xs font-medium text-gray-700">{getTargetLabel(plan.target)}</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded bg-white border border-gray-100 flex items-center justify-center text-purple-500">
                                <Clock size={14} />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400">考核周期</span>
                                <span className="text-xs font-medium text-gray-700">{getCycleLabel(plan.cycle)}</span>
                             </div>
                        </div>
                    </div>
                )}

                {/* Description */}
                <div className="text-sm text-gray-500 space-y-1 mb-5 flex-1 relative z-10">
                  <div className="flex items-center justify-between text-xs border-t border-dashed border-gray-100 pt-2 mt-2">
                      <span className="text-gray-400">指标数量</span>
                      <span className="font-mono font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded">{plan.indicatorCount}</span>
                  </div>
                  <p className="line-clamp-2 text-xs text-gray-400 mt-2 min-h-[2.5em]" title={plan.remark}>
                    {plan.remark || '暂无备注说明'}
                  </p>
                </div>

                {/* Actions */}
                <div className={`border-t border-gray-100 pt-4 mt-auto grid ${isFeatured ? 'grid-cols-3' : 'grid-cols-4'} gap-1`}>
                    {!isFeatured && (
                        <button 
                        className="text-gray-500 hover:text-blue-600 hover:bg-gray-50 py-1.5 rounded text-xs transition-colors"
                        >
                        复制
                        </button>
                    )}
                    <button 
                      className="text-gray-500 hover:text-blue-600 hover:bg-gray-50 py-1.5 rounded text-xs transition-colors"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => handleAssociateClick(plan)}
                      className="text-blue-600 font-medium hover:bg-blue-50 py-1.5 rounded text-xs transition-colors"
                    >
                      {isFeatured ? '方案配置' : '关联指标'}
                    </button>
                    <button 
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 py-1.5 rounded text-xs transition-colors"
                    >
                      删除
                    </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredPlans.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText size={32} className="text-gray-300" />
                </div>
                <p>暂无该类型的考评方案</p>
            </div>
        )}
      </div>
      
      <CreatePlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleSavePlan}
      />
    </div>
  );
};

export default PlanManagement;
