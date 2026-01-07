
import React, { useState } from 'react';

const BaseConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('platform');
  const [sourceType, setSourceType] = useState<'platform' | 'datadev'>('platform');

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
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Title */}
                    <div className="mb-6">
                        <h2 className="text-base font-medium text-gray-800 flex items-center">
                            <span className="text-red-500 mr-1">*</span>
                            科室取值配置:
                        </h2>
                    </div>

                    {/* Options */}
                    <div className="flex items-center gap-8 mb-12">
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

                    {/* Button */}
                    <div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-8 py-2 rounded transition-colors shadow-sm">
                            保存
                        </button>
                    </div>
                </div>
            )}

            {activeTab !== 'platform' && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <p className="text-sm">该模块配置项正在开发中</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default BaseConfig;
