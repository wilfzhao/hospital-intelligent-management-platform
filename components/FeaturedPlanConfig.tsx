
import React, { useState } from 'react';
import { ArrowLeft, Users, Layers, Info } from 'lucide-react';

interface FeaturedPlanConfigProps {
  planName: string;
  onBack: () => void;
}

export const FeaturedPlanConfig: React.FC<FeaturedPlanConfigProps> = ({ planName, onBack }) => {
  const [activeTab, setActiveTab] = useState<'targets' | 'dimensions'>('targets');

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
            <h2 className="text-lg font-bold text-gray-800">{planName} - 方案配置</h2>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center flex-1 w-full animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 border border-blue-100">
                    <Users size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">配置考评对象</h3>
                <p className="text-gray-500 max-w-md text-center leading-relaxed">
                    在此模块中，您可以设置该方案适用的考核对象范围。支持按科室、学科或人员维度进行筛选和批量导入。
                </p>
                <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-mono border border-gray-200">
                    <Info size={16} />
                    <span>功能区域待开发</span>
                </div>
            </div>
        )}

        {activeTab === 'dimensions' && (
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center flex-1 w-full animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-6 border border-purple-100">
                    <Layers size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">配置考核维度与指标</h3>
                <p className="text-gray-500 max-w-md text-center leading-relaxed">
                    在此模块中，您可以构建多级考核维度结构（如：医疗质量、运营效率、可持续发展），并为每个维度关联具体的考核指标及权重。
                </p>
                <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-mono border border-gray-200">
                    <Info size={16} />
                    <span>功能区域待开发</span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
