import React from 'react';
import LabCockpit from './cockpits/LabCockpit';
import ExamCockpit from './cockpits/ExamCockpit';
import SurgeryCockpit from './cockpits/SurgeryCockpit';
import SurgeryAnalysisCockpit from './cockpits/SurgeryAnalysisCockpit';
import BloodCockpit from './cockpits/BloodCockpit';

interface OperationalCockpitProps {
  activeCockpitId: string | null;
  onBack: () => void;
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  activeLabTab: 'lab' | 'blood';
  setActiveLabTab: (tab: 'lab' | 'blood') => void;
  workloadDrillDown: string | null;
  setWorkloadDrillDown: (drillDown: string | null) => void;
  onNavigateToAnalysis: () => void;
  onSelectCockpit: (id: string) => void;
}

const OperationalCockpit: React.FC<OperationalCockpitProps> = ({
  activeCockpitId,
  onBack,
  selectedCampus,
  setSelectedCampus,
  activeLabTab,
  setActiveLabTab,
  workloadDrillDown,
  setWorkloadDrillDown,
  onNavigateToAnalysis,
  onSelectCockpit
}) => {
  const renderBloodCockpitContent = () => {
    return <BloodCockpit selectedCampus={selectedCampus} />;
  };

  if (!activeCockpitId) {
    const COCKPITS = [
      { id: 'lab', title: '检验科驾驶舱', desc: '检验科运营数据全景展示', icon: 'FlaskConical', gradient: 'from-blue-500 to-indigo-600' },
      { id: 'exam', title: '检查科驾驶舱', desc: '检查科运营数据全景展示', icon: 'Activity', gradient: 'from-emerald-500 to-teal-600' },
      { id: 'surgery', title: '手术室驾驶舱', desc: '手术室运营数据全景展示', icon: 'Activity', gradient: 'from-violet-500 to-purple-600' },
      { id: 'surgery-operation-analysis', title: '手术运营分析', desc: '手术运营深度分析', icon: 'PieChart', gradient: 'from-orange-500 to-red-600' },
    ];

    return (
      <div className="p-6 h-full overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">驾驶舱目录</h2>
          <p className="text-sm text-gray-500 mt-1">请选择需要查看的科室驾驶舱</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {COCKPITS.map(cockpit => (
            <div 
              key={cockpit.id}
              onClick={() => onSelectCockpit(cockpit.id)}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cockpit.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cockpit.gradient} text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  {/* Using a generic icon placeholder since we can't easily import dynamic icons here without adding them to imports */}
                  <div className="w-6 h-6 border-2 border-white rounded-full opacity-80"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{cockpit.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cockpit.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  switch (activeCockpitId) {
    case 'lab':
      return (
        <LabCockpit 
          onBack={onBack}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
          activeLabTab={activeLabTab}
          setActiveLabTab={setActiveLabTab}
          renderBloodCockpitContent={renderBloodCockpitContent}
        />
      );
    case 'exam':
      return (
        <ExamCockpit 
          onBack={onBack}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
          workloadDrillDown={workloadDrillDown}
          setWorkloadDrillDown={setWorkloadDrillDown}
        />
      );
    case 'surgery':
      return (
        <SurgeryCockpit 
          onBack={onBack}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
          onNavigateToAnalysis={onNavigateToAnalysis}
        />
      );
    case 'surgery-operation-analysis':
      return (
        <SurgeryAnalysisCockpit 
          onBack={onBack}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      );
    default:
      return null;
  }
};

export default OperationalCockpit;
