
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RoleList from './components/RoleList';
import PermissionTable from './components/PermissionTable';
import PlanManagement from './components/PlanManagement';
import ReportTemplates from './components/ReportTemplates';
import ReportEditor from './components/ReportEditor';
import ReportCenter from './components/ReportCenter';
import { SIDEBAR_ITEMS, HOSPITAL_REVIEW_SIDEBAR_ITEMS } from './constants';

const App: React.FC = () => {
  // Global Navigation State
  const [activeModule, setActiveModule] = useState('指标管理中心');
  const [currentView, setCurrentView] = useState('indicator_auth');

  // Header Items State
  const [headerItems, setHeaderItems] = useState<string[]>([
    '医院等级评审', 
    '公立医院绩效考核', 
    '指标管理中心', 
    '管理配置', 
    '运营决策中心'
  ]);

  // Derive sidebar items based on active module
  const currentSidebarItems = useMemo(() => {
    if (activeModule === '医院等级评审') {
      return HOSPITAL_REVIEW_SIDEBAR_ITEMS;
    }
    // Default to Indicator Management Center for '指标管理中心' and others for now
    return SIDEBAR_ITEMS;
  }, [activeModule]);

  const handleModuleChange = (moduleName: string) => {
    setActiveModule(moduleName);
    
    // Reset view to the first item of the new module's sidebar
    if (moduleName === '医院等级评审') {
      setCurrentView(HOSPITAL_REVIEW_SIDEBAR_ITEMS[0].id);
    } else if (moduleName === '指标管理中心') {
      setCurrentView('indicator_auth'); // Default for this module
    } else {
        // Fallback for modules not yet implemented
        setCurrentView('default_view');
    }
  };

  const handleAddHeaderItem = (name: string) => {
    // Avoid duplicates
    if (!headerItems.includes(name)) {
      setHeaderItems([...headerItems, name]);
    }
  };

  const handleEditReport = (id: string) => {
    setCurrentView('report_editor');
  };

  const renderContent = () => {
    switch (currentView) {
      // --- Indicator Management Center Views ---
      case 'plan_mgmt':
        return <PlanManagement onAddPlan={handleAddHeaderItem} />;
      case 'report_template':
        return <ReportTemplates onEdit={handleEditReport} />;
      case 'report_editor':
        return <ReportEditor onBack={() => setCurrentView('report_template')} />;
      case 'indicator_auth':
        return (
          <>
            <RoleList />
            <PermissionTable />
          </>
        );

      // --- Hospital Review Views ---
      case 'report_center':
        return <ReportCenter />;

      case 'review_overview':
      case 'resource_config':
      case 'medical_quality':
      case 'key_specialty':
      case 'single_disease':
      case 'key_tech':
      case 'self_assessment':
      case 'issue_list':
      case 'continuous_improvement':
         // Placeholder for new pages
         const activeItem = HOSPITAL_REVIEW_SIDEBAR_ITEMS.find(i => i.id === currentView);
         return (
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm h-full p-8 items-center justify-center text-gray-500">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                    {activeItem?.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{activeItem?.label}</h2>
                <p>该功能模块正在开发中...</p>
            </div>
         );

      default:
        return (
           <div className="flex-1 flex items-center justify-center text-gray-400 bg-white rounded-lg shadow-sm">
             <div className="text-center">
               <h2 className="text-xl font-medium mb-2">功能开发中</h2>
               <p className="text-sm">Current View ID: {currentView}</p>
               <p className="text-xs mt-2 text-gray-300">Module: {activeModule}</p>
             </div>
           </div>
        );
    }
  };

  // If in editor mode, render full screen without standard layout
  if (currentView === 'report_editor') {
    return (
      <div className="h-screen overflow-hidden font-sans">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
      <Header 
        items={headerItems} 
        activeItem={activeModule}
        onSelectItem={handleModuleChange}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
            items={currentSidebarItems}
            activeId={currentView} 
            onNavigate={setCurrentView} 
        />
        <main className="flex-1 p-4 flex gap-4 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;