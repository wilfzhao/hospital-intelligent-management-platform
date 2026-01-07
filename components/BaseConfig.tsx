
import React, { useState, useRef } from 'react';
import { Link, Info, AlertCircle, Database } from 'lucide-react';

const BaseConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('platform');
  const [sourceType, setSourceType] = useState<'platform' | 'datadev'>('platform');
  
  // Patient 360 Configuration State
  const [patient360Url, setPatient360Url] = useState('');

  const tabs = [
    { id: 'platform', label: '全平台' },
    { id: 'review', label: '医院等级评审' },
    { id: 'performance', label: '公立医院绩效监测' },
    { id: 'mobile', label: '移动运营' },
  ];

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col h-full relative overflow-hidden">
        {/* Tabs Header */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`px-6 py-4 text-sm font-medium relative transition-colors ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in zoom-in-x duration-200"></div>
                    )}
                </button>
            ))}
        </div>

        {/* Tab Content */}
        <div className="p-8 flex-1 overflow-y-auto">
            {activeTab === 'platform' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 max-w-4xl">
                    
                    {/* --- Section 1: Department Config --- */}
                    <div className="mb-10 border-b border-dashed border-gray-200 pb-10">
                        <div className="mb-6">
                            <h2 className="text-base font-bold text-gray-800 flex items-center">
                                <span className="text-red-500 mr-1">*</span>
                                科室取值配置
                            </h2>
                        </div>

                        <div className="flex items-center gap-8 pl-3">
                            <label className="flex items-center gap-2 cursor-pointer select-none group">
                                <div className="relative flex items-center justify-center w-5 h-5">
                                    <input 
                                        type="radio" 
                                        name="dept_source"
                                        value="platform"
                                        checked={sourceType === 'platform'}
                                        onChange={() => setSourceType('platform')}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-600 checked:border-[5px] transition-all bg-white"
                                    />
                                </div>
                                <span className={`text-sm ${sourceType === 'platform' ? 'text-gray-800' : 'text-gray-500'}`}>取平台管理</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer select-none group">
                                <div className="relative flex items-center justify-center w-5 h-5">
                                    <input 
                                        type="radio" 
                                        name="dept_source"
                                        value="datadev"
                                        checked={sourceType === 'datadev'}
                                        onChange={() => setSourceType('datadev')}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-600 checked:border-[5px] transition-all bg-white"
                                    />
                                </div>
                                <span className={`text-sm ${sourceType === 'datadev' ? 'text-gray-800' : 'text-gray-500'}`}>取数开提供的科室表</span>
                            </label>
                        </div>
                    </div>

                    {/* --- Section 2: Patient 360 Config --- */}
                    <div className="mb-10">
                        <div className="mb-6">
                            <h2 className="text-base font-bold text-gray-800 flex items-center">
                                患者360视图集成
                            </h2>
                        </div>

                        <div className="pl-3 space-y-4">
                            
                            {/* Input Area */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Link size={16} className="text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-gray-700 bg-white"
                                    placeholder="输入URL，使用 {变量名} 作为参数占位符"
                                    value={patient360Url}
                                    onChange={(e) => setPatient360Url(e.target.value)}
                                />
                            </div>

                            {/* Logic Explanation & Legend */}
                            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100/50">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-blue-500 flex-shrink-0">
                                        <Database size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-blue-800 mb-2">取值逻辑说明 (ads_kyjs_patient_visit_id表映射)</h4>
                                        <p className="text-xs text-blue-700/80 mb-3 leading-relaxed">
                                            系统将根据当前选中患者的 <span className="font-mono bg-white px-1 rounded text-blue-800 border border-blue-100">visit_no</span> 在映射表中查询对应的字段值，并替换URL中的变量。
                                        </p>
                                        
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3 text-xs bg-white/60 p-2 rounded border border-blue-100/50 hover:bg-white/80 transition-colors">
                                                <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 min-w-[120px] text-center">{`{outpatient_no}`}</span>
                                                <span className="text-blue-300 flex-shrink-0">→</span>
                                                <span className="text-gray-600 truncate">取 <span className="font-mono text-gray-800 mx-0.5 font-medium">outpatient_no</span> 字段</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs bg-white/60 p-2 rounded border border-blue-100/50 hover:bg-white/80 transition-colors">
                                                <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 min-w-[120px] text-center">{`{patient_id}`}</span>
                                                <span className="text-blue-300 flex-shrink-0">→</span>
                                                <span className="text-gray-600 truncate">取 <span className="font-mono text-gray-800 mx-0.5 font-medium">patient_id</span> 字段</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs bg-white/60 p-2 rounded border border-blue-100/50 hover:bg-white/80 transition-colors">
                                                <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 min-w-[120px] text-center">{`{visit_no}`}</span>
                                                <span className="text-blue-300 flex-shrink-0">→</span>
                                                <span className="text-gray-600 truncate">直接使用当前 <span className="font-mono text-gray-800 mx-0.5 font-medium">visit_no</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-8 py-2.5 rounded-lg transition-colors shadow-sm active:scale-95 transform duration-100">
                            保存配置
                        </button>
                    </div>
                </div>
            )}

            {activeTab !== 'platform' && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Info className="text-gray-300" size={32} />
                    </div>
                    <p className="text-sm">该模块配置项正在开发中</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default BaseConfig;
