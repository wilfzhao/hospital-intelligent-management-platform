
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RoleList from './components/RoleList';
import PermissionTable from './components/PermissionTable';
import PlanManagement from './components/PlanManagement';
import ReportTemplates from './components/ReportTemplates';
import ReportEditor from './components/ReportEditor';
import ReportCenter from './components/ReportCenter';
import BaseConfig from './components/BaseConfig';
import OperationalDecisionCenter from './components/OperationalDecisionCenter';
import { AssociateIndicators } from './components/AssociateIndicators';
import { FeaturedPlanConfig } from './components/FeaturedPlanConfig';
import { SIDEBAR_ITEMS, HOSPITAL_REVIEW_SIDEBAR_ITEMS } from './constants';
import { Plan } from './types';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  // Global Navigation State
  const [activeModule, setActiveModule] = useState('管理配置');
  const [currentView, setCurrentView] = useState('plan_mgmt');

  // Role Management State
  const [activeRoleId, setActiveRoleId] = useState('r4');

  // Plan Association State
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Header Items State
  const [headerItems, setHeaderItems] = useState<string[]>([
    '医院等级评审', 
    '公立医院绩效考核', 
    '运营决策中心', 
    '指标管理中心', 
    '管理配置'
  ]);

  // Derive sidebar items based on active module
  const currentSidebarItems = useMemo(() => {
    if (activeModule === '医院等级评审') {
      return HOSPITAL_REVIEW_SIDEBAR_ITEMS;
    }
    if (activeModule === '指标管理中心') {
      return [];
    }
    // Default to SIDEBAR_ITEMS for '管理配置'
    return SIDEBAR_ITEMS;
  }, [activeModule]);

  const handleModuleChange = (moduleName: string) => {
    setActiveModule(moduleName);
    
    // Reset view to the first item of the new module's sidebar
    if (moduleName === '医院等级评审') {
      setCurrentView(HOSPITAL_REVIEW_SIDEBAR_ITEMS[0].id);
    } else if (moduleName === '指标管理中心') {
      setCurrentView('default_view'); 
    } else if (moduleName === '运营决策中心') {
      setCurrentView('odc_dashboard'); // Dashboard view for ODC
    } else if (moduleName === '管理配置') {
      setCurrentView('plan_mgmt');
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

  const handleAssociatePlan = (plan: Plan) => {
    setSelectedPlan(plan);
    if (plan.type === 'featured') {
      setCurrentView('featured_plan_config');
    } else {
      setCurrentView('associate_indicators');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      // --- Operational Decision Center ---
      case 'odc_dashboard':
        return <OperationalDecisionCenter />;

      // --- Indicator Management Center Views ---
      case 'plan_mgmt':
        return <PlanManagement onAddPlan={handleAddHeaderItem} onAssociate={handleAssociatePlan} />;
      case 'associate_indicators':
        return selectedPlan ? (
          <AssociateIndicators 
            planName={selectedPlan.name} 
            onBack={() => setCurrentView('plan_mgmt')} 
          />
        ) : null;
      case 'featured_plan_config':
        return selectedPlan ? (
          <FeaturedPlanConfig 
            planName={selectedPlan.name}
            onBack={() => setCurrentView('plan_mgmt')}
          />
        ) : null;
      case 'report_template':
        return <ReportTemplates onEdit={handleEditReport} />;
      case 'report_editor':
        return <ReportEditor onBack={() => setCurrentView('report_template')} />;
      case 'indicator_auth':
        return (
          <>
            <RoleList activeRoleId={activeRoleId} onSelectRole={setActiveRoleId} />
            <PermissionTable activeRoleId={activeRoleId} />
          </>
        );
      case 'base_config':
        return <BaseConfig />;

      // --- Hospital Review Views ---
      case 'report_center':
        return <ReportCenter onOpenEditor={() => setCurrentView('report_editor')} />;

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
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="text-gray-300" size={32} />
                </div>
               <h2 className="text-xl font-medium mb-2 text-gray-700">功能开发中</h2>
               <p className="text-sm text-gray-500">该模块即将上线，敬请期待</p>
               {/* Debug info if needed, can remove later */}
               {/* <p className="text-xs mt-4 text-gray-300">Module: {activeModule}</p> */}
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

  // Hide sidebar for full-page dashboards like ODC, or if sidebar items are empty
  const shouldShowSidebar = currentSidebarItems.length > 0 && currentView !== 'associate_indicators' && currentView !== 'featured_plan_config' && currentView !== 'odc_dashboard';

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
      <Header 
        items={headerItems} 
        activeItem={activeModule}
        onSelectItem={handleModuleChange}
      />
      <div className="flex flex-1 overflow-hidden">
        {shouldShowSidebar && (
            <Sidebar 
                items={currentSidebarItems}
                activeId={currentView} 
                onNavigate={setCurrentView} 
            />
        )}
        <main className={`flex-1 p-4 flex gap-4 overflow-hidden ${
            shouldShowSidebar 
                ? '' 
                : (currentView === 'odc_dashboard' || currentView === 'featured_plan_config')
                    ? 'w-full' // Remove max-width for full-screen views
                    : 'max-w-7xl mx-auto w-full'
        }`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
