
import React, { useState } from 'react';
import { Plus, ChevronRight, PieChart, Layers, FileBarChart } from 'lucide-react';
import { MOCK_REPORTS } from '../constants';
import { ReportDocument } from '../types';
import CreateReportModal from './CreateReportModal';

const ReportIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
    <rect x="12" y="8" width="40" height="48" rx="4" fill="white" stroke="#374151" strokeWidth="2"/>
    <path d="M12 18H52" stroke="#374151" strokeWidth="2"/>
    <circle cx="20" cy="13" r="1.5" fill="#374151"/>
    <circle cx="26" cy="13" r="1.5" fill="#374151"/>
    <path d="M20 28H44" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 36H36" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 44H32" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    
    <path d="M42 42C42 46.4183 38.4183 50 34 50C29.5817 50 26 46.4183 26 42C26 37.5817 29.5817 34 34 34C38.4183 34 42 37.5817 42 42Z" fill="#3B82F6" fillOpacity="0.2"/>
    <path d="M34 42L38 38" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="34" cy="42" r="8" stroke="#374151" strokeWidth="2"/>
    <path d="M34 42L34 36" stroke="#374151" strokeWidth="2"/>
    <path d="M34 42L40 42" stroke="#374151" strokeWidth="2"/>

    <path d="M18 24L24 30L30 24L36 30L46 20" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
    <path d="M48 6L54 12" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <path d="M50 10L56 16" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SectionIcon = ({ type }: { type: 'annual' | 'quarterly' | 'monthly' }) => {
  if (type === 'annual') return <Layers size={32} className="text-blue-400" />;
  if (type === 'quarterly') return <PieChart size={32} className="text-blue-400" />;
  return <FileBarChart size={32} className="text-blue-400" />;
};

const ReportCard: React.FC<{ report: ReportDocument }> = ({ report }) => {
  return (
    <div className="w-[240px] bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center flex-shrink-0 relative group hover:shadow-md transition-shadow cursor-pointer">
      {/* Status Badge */}
      <div 
        className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] text-white rounded shadow-sm ${
          report.status === 'editing' ? 'bg-green-500' : 'bg-blue-600'
        }`}
      >
        {report.status === 'editing' ? '编辑中' : '已发布'}
      </div>

      <div className="my-4 transform group-hover:scale-105 transition-transform duration-200">
        <ReportIcon />
      </div>

      <h3 className="font-bold text-gray-700 text-center mb-6 line-clamp-2 h-12 flex items-center">
        {report.title}
      </h3>

      <div className="w-full text-[10px] text-gray-400 flex flex-col items-center gap-1 border-t border-gray-100 pt-3">
        <span>{report.date}</span>
        <span>{report.department}</span>
      </div>
    </div>
  );
};

const ReportSection: React.FC<{ title: string; type: 'annual' | 'quarterly' | 'monthly'; reports: ReportDocument[] }> = ({ title, type, reports }) => {
  // If no reports for this section, you might want to hide it or show empty state.
  // For now we keep it to maintain layout structure.
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg shadow-sm">
           <SectionIcon type={type} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 px-1 hide-scrollbar">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
          {/* Add placeholder card just to make scroll area feel right */}
          <div className="w-8 flex-shrink-0"></div>
          
          {reports.length === 0 && (
            <div className="w-full h-[200px] flex items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                暂无报告
            </div>
          )}
        </div>
        
        {/* Navigation Arrow (Only show if there are reports) */}
        {reports.length > 0 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden md:flex">
            <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-100 hover:bg-white text-gray-600 hover:text-blue-600 transition-colors">
                <ChevronRight size={32} />
            </button>
            </div>
        )}
        
        {/* Fade mask for scroll */}
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-100/50 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

const ReportCenter: React.FC = () => {
  const [reports, setReports] = useState<ReportDocument[]>(MOCK_REPORTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const annualReports = reports.filter(r => r.type === 'annual');
  const quarterlyReports = reports.filter(r => r.type === 'quarterly');
  const monthlyReports = reports.filter(r => r.type === 'monthly');

  const handleCreateReport = (data: Partial<ReportDocument>) => {
    const newReport: ReportDocument = {
      id: `r${Date.now()}`,
      title: data.title || '新报告',
      type: data.type || 'annual',
      date: data.date || '',
      department: data.department || '',
      status: 'editing',
    };
    
    // Prepend new report
    setReports([newReport, ...reports]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f3f4f6] overflow-hidden">
       {/* Top Bar - Transparent/Minimal */}
       <div className="px-8 pt-6 pb-2">
         <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-md border border-gray-200 shadow-sm flex items-center gap-1 text-sm font-medium transition-colors"
         >
            <Plus size={14} />
            新建报告
         </button>
       </div>

       <div className="flex-1 overflow-y-auto px-8 pb-8">
          <ReportSection title="年度报告" type="annual" reports={annualReports} />
          <ReportSection title="季度报告" type="quarterly" reports={quarterlyReports} />
          <ReportSection title="月度报告" type="monthly" reports={monthlyReports} />
       </div>

       <CreateReportModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onConfirm={handleCreateReport}
       />
    </div>
  );
};

export default ReportCenter;
