import React from 'react';
import { Activity, Pill, Home, Users, Layers } from 'lucide-react';
import EmergencyTheme from './themes/EmergencyTheme';
import PharmacyTheme from './themes/PharmacyTheme';
import UltrasoundTheme from './themes/UltrasoundTheme';
import EndoscopyTheme from './themes/EndoscopyTheme';
import PathologyTheme from './themes/PathologyTheme';

interface ThemeAnalysisProps {
  activeThemeId: string;
  setActiveThemeId: (id: string) => void;
  activeEmergencyTab: 'realtime' | 'history';
  setActiveEmergencyTab: (tab: 'realtime' | 'history') => void;
  activePharmacyTab: 'antibacterial' | 'prescription' | 'monitoring';
  setActivePharmacyTab: (tab: 'antibacterial' | 'prescription' | 'monitoring') => void;
  ultrasoundCampus: string;
  setUltrasoundCampus: (campus: string) => void;
  endoscopyCampus: string;
  setEndoscopyCampus: (campus: string) => void;
  endoscopyDateRange: string;
  setEndoscopyDateRange: (range: string) => void;
  pathologyCampus: string;
  setPathologyCampus: (campus: string) => void;
  pathologyDateRange: string;
  setPathologyDateRange: (range: string) => void;
  setDrillDownConfig: (config: { isOpen: boolean; title: string; type: 'kpi' | 'module' }) => void;
}

const ThemeAnalysis: React.FC<ThemeAnalysisProps> = ({
  activeThemeId,
  setActiveThemeId,
  activeEmergencyTab,
  setActiveEmergencyTab,
  activePharmacyTab,
  setActivePharmacyTab,
  ultrasoundCampus,
  setUltrasoundCampus,
  endoscopyCampus,
  setEndoscopyCampus,
  endoscopyDateRange,
  setEndoscopyDateRange,
  pathologyCampus,
  setPathologyCampus,
  pathologyDateRange,
  setPathologyDateRange,
  setDrillDownConfig,
}) => {
  const THEMES = [
    { id: 'emergency', name: '急诊主题分析', icon: Activity },
    { id: 'pharmacy', name: '药学主题分析', icon: Pill },
    { id: 'surgery', name: '手术主题分析', icon: Activity },
    { id: 'outpatient', name: '门诊主题分析', icon: Users },
    { id: 'inpatient', name: '住院主题分析', icon: Home },
    { id: 'ultrasound', name: '超声科主题分析', icon: Activity },
    { id: 'endoscopy', name: '内镜中心主题分析', icon: Activity },
    { id: 'pathology', name: '病理科主题分析', icon: Activity },
  ];

  return (
    <div className="flex h-full overflow-hidden bg-gray-50/30">
      {/* Left Sidebar - Theme Catalog */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Layers size={20} className="text-blue-600" />
            主题目录
          </h2>
        </div>
        <div className="p-2 space-y-1">
          {THEMES.map(theme => {
            const Icon = theme.icon;
            const isActive = activeThemeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setActiveThemeId(theme.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                {theme.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeThemeId === 'emergency' && (
          <EmergencyTheme 
            activeEmergencyTab={activeEmergencyTab}
            setActiveEmergencyTab={setActiveEmergencyTab}
          />
        )}
        {activeThemeId === 'pharmacy' && (
          <PharmacyTheme 
            activePharmacyTab={activePharmacyTab}
            setActivePharmacyTab={setActivePharmacyTab}
          />
        )}
        {activeThemeId === 'ultrasound' && (
          <UltrasoundTheme 
            ultrasoundCampus={ultrasoundCampus}
            setUltrasoundCampus={setUltrasoundCampus}
            setDrillDownConfig={setDrillDownConfig}
          />
        )}
        {activeThemeId === 'endoscopy' && (
          <EndoscopyTheme 
            endoscopyCampus={endoscopyCampus}
            setEndoscopyCampus={setEndoscopyCampus}
            endoscopyDateRange={endoscopyDateRange}
            setEndoscopyDateRange={setEndoscopyDateRange}
            setDrillDownConfig={setDrillDownConfig}
          />
        )}
        {activeThemeId === 'pathology' && (
          <PathologyTheme 
            pathologyCampus={pathologyCampus}
            setPathologyCampus={setPathologyCampus}
            pathologyDateRange={pathologyDateRange}
            setPathologyDateRange={setPathologyDateRange}
          />
        )}
        {!['emergency', 'pharmacy', 'ultrasound', 'endoscopy', 'pathology'].includes(activeThemeId) && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
            <div className="p-6 bg-gray-100 rounded-full">
              <Layers size={48} />
            </div>
            <p className="text-lg">请选择左侧主题目录查看详情</p>
            <p className="text-sm">部分主题模块正在建设中...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeAnalysis;
