
import React, { useState, useRef, useEffect } from 'react';
import { X, Link as LinkIcon, FileText, ChevronDown, Plus, Check, ArrowRight, Layers, Award, Target, Clock, Calendar } from 'lucide-react';
import { Toggle } from './ui/Toggle';
import { Checkbox } from './ui/Checkbox';
import { Plan } from '../types';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<Plan>) => void;
}

type Step = 'select-type' | 'config';

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [step, setStep] = useState<Step>('select-type');
  const [planType, setPlanType] = useState<'standard' | 'featured'>('standard');
  
  // Form State
  const [name, setName] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');
  
  // Featured Specific State
  const [target, setTarget] = useState<'department' | 'discipline' | 'person'>('department');
  const [cycle, setCycle] = useState<'year' | 'quarter' | 'month'>('year');

  // Custom Dropdown State for Application
  const [applications, setApplications] = useState([
    '三级医院等级评审',
    '公立医院绩效考核',
    '医疗质量管理',
    '学科建设',
    '护理质量'
  ]);
  const [selectedApp, setSelectedApp] = useState('');
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [newAppValue, setNewAppValue] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('select-type');
      setPlanType('standard');
      setName('');
      setIsEnabled(true);
      setRemark('');
      setSelectedApp('');
      setTarget('department');
      setCycle('year');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAppDropdownOpen(false);
        setIsAddingApp(false);
      }
    };

    if (isAppDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAppDropdownOpen]);

  const handleAddApp = () => {
    if (newAppValue.trim()) {
      const newVal = newAppValue.trim();
      // Avoid duplicates
      if (!applications.includes(newVal)) {
          setApplications([...applications, newVal]);
      }
      setSelectedApp(newVal);
      setNewAppValue('');
      setIsAddingApp(false);
      setIsAppDropdownOpen(false);
    }
  };

  const handleNextStep = () => {
      setStep('config');
  };

  const handleConfirm = () => {
    if (!name.trim()) {
      setError('请输入方案名称');
      return;
    }
    
    // Only validate application for standard plans
    if (planType === 'standard' && !selectedApp) {
      setError('请选择应用');
      return;
    }

    onConfirm({
      name: name,
      type: planType,
      application: planType === 'standard' ? selectedApp : undefined,
      remark: remark,
      status: isEnabled ? 'enabled' : 'disabled',
      // Only include if featured
      target: planType === 'featured' ? target : undefined,
      cycle: planType === 'featured' ? cycle : undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className={`bg-white rounded-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col ${step === 'select-type' ? 'w-[700px] h-[500px]' : 'w-[600px]'}`}>
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">
            <div className="flex items-center gap-2">
                {step === 'config' && (
                    <button 
                        onClick={() => setStep('select-type')}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 mr-1 transition-colors"
                    >
                        <ArrowRight size={18} className="rotate-180"/>
                    </button>
                )}
                <h2 className="text-lg font-bold text-gray-800">
                    {step === 'select-type' ? '创建考评方案' : (planType === 'standard' ? '配置标准考评方案' : '配置特色考评方案')}
                </h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50">
            
            {/* STEP 1: SELECT TYPE */}
            {step === 'select-type' && (
                <div className="p-8 h-full flex flex-col justify-center">
                    <h3 className="text-center text-gray-600 mb-8 font-medium">请选择您要创建的方案类型</h3>
                    <div className="grid grid-cols-2 gap-6">
                        {/* Option 1: Standard */}
                        <div 
                           onClick={() => { setPlanType('standard'); handleNextStep(); }}
                           className="bg-white border-2 border-transparent hover:border-blue-500 hover:ring-4 hover:ring-blue-50 rounded-2xl p-6 cursor-pointer transition-all shadow-sm hover:shadow-xl group flex flex-col items-center text-center h-64 justify-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100">
                                <Layers size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600">标准考评方案</h4>
                            <p className="text-sm text-gray-500 leading-relaxed px-4">
                                适用于三级医院评审、公立医院绩效考核等外部下发的标准化考评体系
                            </p>
                        </div>

                        {/* Option 2: Featured */}
                        <div 
                           onClick={() => { setPlanType('featured'); handleNextStep(); }}
                           className="bg-white border-2 border-transparent hover:border-purple-500 hover:ring-4 hover:ring-purple-50 rounded-2xl p-6 cursor-pointer transition-all shadow-sm hover:shadow-xl group flex flex-col items-center text-center h-64 justify-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-purple-100">
                                <Award size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600">特色考评方案</h4>
                            <p className="text-sm text-gray-500 leading-relaxed px-4">
                                适用于院内医疗质量考核、学科评价、人员绩效等内部自定义考评体系
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: CONFIGURATION */}
            {step === 'config' && (
                <div className="p-8 space-y-6">
                    {error && (
                      <div className="bg-red-50 text-red-500 text-sm px-3 py-2 rounded flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        {error}
                      </div>
                    )}

                    {/* Plan Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <span className="text-red-500 mr-1">*</span>方案名称
                        </label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="请输入方案名称"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-400 shadow-sm"
                            autoFocus
                        />
                    </div>

                    {/* Application (Custom Dropdown) - Only for Standard Plans */}
                    {planType === 'standard' && (
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <span className="text-red-500 mr-1">*</span>所属应用
                            </label>
                            
                            {/* Trigger */}
                            <div 
                              className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-white cursor-pointer flex justify-between items-center transition-all shadow-sm ${isAppDropdownOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
                              onClick={() => {
                                  if (!isAddingApp) setIsAppDropdownOpen(!isAppDropdownOpen);
                              }}
                            >
                                <span className={selectedApp ? 'text-gray-800' : 'text-gray-400'}>
                                    {selectedApp || '请选择应用'}
                                </span>
                                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isAppDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Dropdown Menu */}
                            {isAppDropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-100">
                                    <div className="max-h-48 overflow-y-auto p-1">
                                        {applications.map((app) => (
                                            <div 
                                                key={app}
                                                className={`px-3 py-2 text-sm cursor-pointer rounded-md transition-colors ${selectedApp === app ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                                onClick={() => {
                                                    setSelectedApp(app);
                                                    setIsAppDropdownOpen(false);
                                                }}
                                            >
                                                {app}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="h-px bg-gray-100 my-0"></div>
                                    
                                    <div className="p-2 bg-gray-50/50">
                                        {isAddingApp ? (
                                            <div className="flex items-center gap-2 animate-in fade-in">
                                                <input 
                                                    type="text"
                                                    autoFocus
                                                    placeholder="输入新应用名称"
                                                    className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                                                    value={newAppValue}
                                                    onChange={(e) => setNewAppValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleAddApp();
                                                        if (e.key === 'Escape') {
                                                            setIsAddingApp(false);
                                                            setNewAppValue('');
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    onClick={handleAddApp}
                                                    className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                >
                                                    <Check size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setIsAddingApp(false);
                                                        setNewAppValue('');
                                                    }}
                                                    className="p-1.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                className="w-full flex items-center justify-center gap-1 text-sm text-blue-600 hover:bg-blue-50 py-1.5 rounded transition-colors border border-dashed border-blue-200 hover:border-blue-400"
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    setIsAddingApp(true);
                                                }}
                                            >
                                                <Plus size={14} />
                                                <span>添加新应用</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Featured Plan Specific Fields */}
                    {planType === 'featured' && (
                        <div className="grid grid-cols-2 gap-6 p-4 bg-purple-50/50 rounded-xl border border-purple-100 animate-in fade-in slide-in-from-top-2">
                             <div>
                                <label className="block text-sm font-bold text-purple-900 mb-2 flex items-center gap-1.5">
                                    <Target size={14} />
                                    考核对象
                                </label>
                                <select 
                                    className="w-full border border-purple-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-purple-500 text-gray-700 shadow-sm"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value as any)}
                                >
                                    <option value="department">科室 (Department)</option>
                                    <option value="discipline">学科 (Discipline)</option>
                                    <option value="person">人员 (Person)</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-purple-900 mb-2 flex items-center gap-1.5">
                                    <Clock size={14} />
                                    考核周期
                                </label>
                                <select 
                                    className="w-full border border-purple-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-purple-500 text-gray-700 shadow-sm"
                                    value={cycle}
                                    onChange={(e) => setCycle(e.target.value as any)}
                                >
                                    <option value="year">年度 (Yearly)</option>
                                    <option value="quarter">季度 (Quarterly)</option>
                                    <option value="month">月度 (Monthly)</option>
                                </select>
                             </div>
                        </div>
                    )}

                    {/* Standard Plan Specific Fields (Display Type) */}
                    {planType === 'standard' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <span className="text-red-500 mr-1">*</span>显示终端
                            </label>
                            <div className="flex gap-8 mt-2 bg-white p-3 rounded-lg border border-gray-200">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <Checkbox defaultChecked className="w-4 h-4 rounded text-blue-600" />
                                    <span className="text-sm text-gray-600">PC端 (Web)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <Checkbox defaultChecked className="w-4 h-4 rounded text-blue-600" />
                                    <span className="text-sm text-gray-600">移动端 (App/H5)</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            备注说明
                        </label>
                        <div className="relative">
                            <textarea 
                                placeholder="请输入方案的详细说明..."
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-400 h-24 resize-none shadow-sm"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                maxLength={200}
                            />
                            <span className="absolute bottom-2 right-3 text-xs text-gray-400 select-none">
                                {remark.length} / 200
                            </span>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <label className="text-sm font-bold text-gray-700">
                            启用状态
                        </label>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium ${isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                                {isEnabled ? '已启用' : '已停用'}
                            </span>
                            <Toggle checked={isEnabled} onChange={setIsEnabled} />
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        {step === 'config' && (
            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 z-10">
                <button 
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                    取消
                </button>
                <button 
                    onClick={handleConfirm}
                    className={`px-6 py-2.5 rounded-lg text-white shadow-sm text-sm font-medium transition-all hover:-translate-y-0.5 ${
                        planType === 'featured' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    确认创建
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CreatePlanModal;
