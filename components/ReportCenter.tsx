
import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronRight, ChevronLeft, PieChart, Layers, FileBarChart, Sparkles } from 'lucide-react';
import { MOCK_REPORTS } from '../constants';
import { ReportDocument } from '../types';
import CreateReportModal from './CreateReportModal';

const ReportIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
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
  if (type === 'annual') return <Layers size={24} className="text-blue-500" />;
  if (type === 'quarterly') return <PieChart size={24} className="text-purple-500" />;
  return <FileBarChart size={24} className="text-orange-500" />;
};

const ReportCard: React.FC<{ report: ReportDocument; onClick?: () => void }> = ({ report, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="w-[260px] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] border border-gray-100 p-5 flex flex-col items-center flex-shrink-0 relative group transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Status Badge */}
      <div 
        className={`absolute top-4 right-4 px-2 py-0.5 text-[10px] font-medium text-white rounded-full shadow-sm ${
          report.status === 'editing' ? 'bg-amber-500' : 'bg-green-600'
        }`}
      >
        {report.status === 'editing' ? '编辑中' : '已发布'}
      </div>

      <div className="my-5">
        <ReportIcon />
      </div>

      <h3 className="font-bold text-gray-700 text-center mb-6 line-clamp-2 h-12 flex items-center text-sm leading-relaxed px-2">
        {report.title}
      </h3>

      <div className="w-full text-[11px] text-gray-400 flex flex-col items-center gap-1.5 border-t border-gray-50 pt-4 mt-auto">
        <span className="font-medium text-gray-500">{report.date}</span>
        <span className="bg-gray-50 px-2 py-0.5 rounded text-gray-400">{report.department}</span>
      </div>
    </div>
  );
};

const ReportSection: React.FC<{ 
  title: string; 
  type: 'annual' | 'quarterly' | 'monthly'; 
  reports: ReportDocument[];
  onReportClick: (report: ReportDocument) => void;
}> = ({ title, type, reports, onReportClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 5); // Small buffer
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [reports]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 300; // Approx one card width + gap
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-10 group/section">
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
           <SectionIcon type={type} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">{reports.length}</span>
      </div>

      <div className="relative -mx-4 px-4"> {/* Negative margin to allow full-width scroll effect within padding */}
        
        {/* Left Arrow */}
        <div className={`absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-[#f3f4f6] via-[#f3f4f6]/80 to-transparent z-10 flex items-center justify-start pl-4 transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <button 
                onClick={() => scroll('left')}
                className="bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 p-2 rounded-full shadow-md border border-gray-100 transition-all transform hover:scale-110 active:scale-95"
             >
                <ChevronLeft size={20} />
            </button>
        </div>

        {/* Container */}
        <div 
            ref={containerRef}
            onScroll={checkScroll}
            className="flex gap-5 overflow-x-auto pb-4 px-1 hide-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Ensure scrollbar is hidden
        >
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onClick={() => onReportClick(report)} />
          ))}
          
          {reports.length === 0 && (
            <div className="w-full h-[220px] flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <FileBarChart className="text-gray-300 mb-2" size={32} />
                <span className="text-sm">暂无{title}</span>
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <div className={`absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#f3f4f6] via-[#f3f4f6]/80 to-transparent z-10 flex items-center justify-end pr-4 transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button 
                onClick={() => scroll('right')}
                className="bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 p-2 rounded-full shadow-md border border-gray-100 transition-all transform hover:scale-110 active:scale-95"
            >
                <ChevronRight size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

interface ReportCenterProps {
  onOpenEditor?: () => void;
}

const ReportCenter: React.FC<ReportCenterProps> = ({ onOpenEditor }) => {
  const [reports, setReports] = useState<ReportDocument[]>(MOCK_REPORTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Duplicate data to demonstrate scrolling if needed (Optional, just using Mock directly)
  // const demoReports = [...reports, ...reports.map(r => ({...r, id: r.id + '_copy'}))]; 
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
    setReports([newReport, ...reports]);
    if (onOpenEditor) {
      onOpenEditor();
    }
  };

  const handleReportClick = (report: ReportDocument) => {
    if (report.status === 'editing' && onOpenEditor) {
      onOpenEditor();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f3f4f6] overflow-hidden">
       {/* Top Bar */}
       <div className="px-8 py-6 flex justify-between items-center flex-shrink-0">
         <div>
            <h1 className="text-2xl font-bold text-gray-800">报告中心</h1>
            <p className="text-sm text-gray-500 mt-1">管理和查看所有质量控制与评审报告</p>
         </div>
         <div className="flex items-center gap-3">
             <button 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium transition-all transform hover:-translate-y-0.5 border border-white/20 group"
             >
                <Sparkles size={18} className="text-white/90 group-hover:scale-110 transition-transform" />
                <span>智能创建</span>
             </button>

             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium transition-all transform hover:-translate-y-0.5"
             >
                <Plus size={18} />
                新建报告
             </button>
         </div>
       </div>

       {/* Content Area */}
       <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          <ReportSection title="年度质量简报" type="annual" reports={annualReports} onReportClick={handleReportClick} />
          <ReportSection title="季度质量监测" type="quarterly" reports={quarterlyReports} onReportClick={handleReportClick} />
          <ReportSection title="月度数据分析" type="monthly" reports={monthlyReports} onReportClick={handleReportClick} />
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
