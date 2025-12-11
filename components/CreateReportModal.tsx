
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { REPORT_TEMPLATES } from '../constants';
import { ReportDocument } from '../types';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<ReportDocument>) => void;
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [reportType, setReportType] = useState<'annual' | 'quarterly' | 'monthly'>('annual');
  const [error, setError] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setName('');
      setTemplateId('');
      setReportType('annual');
      setError('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!name.trim()) {
      setError('请输入报告名称');
      return;
    }
    if (!templateId) {
      setError('请选择报告模版');
      return;
    }

    onConfirm({
      title: name,
      type: reportType,
      // Default values for new report
      status: 'editing',
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
      department: '医疗质量管理科' // Mock default department
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded shadow-2xl w-[500px] relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 relative z-10 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">新建报告</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
        </div>

        {/* Form Body */}
        <div className="px-8 pb-4 space-y-6 relative z-10">
            {error && (
              <div className="bg-red-50 text-red-500 text-sm px-3 py-2 rounded">
                {error}
              </div>
            )}

            {/* Report Name */}
            <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-600 flex-shrink-0">
                    <span className="text-red-500 mr-1">*</span>报告名称
                </label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入报告名称，稍后可在报告中修改"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-400"
                />
            </div>

            {/* Report Template */}
            <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-600 flex-shrink-0">
                    <span className="text-red-500 mr-1">*</span>报告模版
                </label>
                <div className="flex-1 relative">
                    <select
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-700 bg-white appearance-none"
                    >
                        <option value="" disabled>请选择内容</option>
                        {REPORT_TEMPLATES.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Report Type */}
            <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-600 flex-shrink-0">
                    <span className="text-red-500 mr-1">*</span>报告类型
                </label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                            type="radio" 
                            name="reportType" 
                            checked={reportType === 'annual'} 
                            onChange={() => setReportType('annual')}
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">年度报告</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                            type="radio" 
                            name="reportType" 
                            checked={reportType === 'quarterly'} 
                            onChange={() => setReportType('quarterly')}
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">季度报告</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                            type="radio" 
                            name="reportType" 
                            checked={reportType === 'monthly'} 
                            onChange={() => setReportType('monthly')}
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">月度报告</span>
                    </label>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 pb-8 pt-4">
            <button 
                onClick={onClose}
                className="px-6 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
            >
                取消
            </button>
            <button 
                onClick={handleConfirm}
                className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-sm font-medium transition-colors"
            >
                确认
            </button>
        </div>

      </div>
    </div>
  );
};

export default CreateReportModal;
