
import React from 'react';
import { LayoutDashboard, Rocket, Construction } from 'lucide-react';

export const DisciplineOverview: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm h-full p-8 items-center justify-center text-gray-500 border border-gray-100">
      <div className="relative mb-6">
        <div className="bg-indigo-50 p-6 rounded-full relative z-10">
          <Construction className="text-indigo-600" size={48} />
        </div>
        <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-2 rounded-full animate-pulse z-20">
          <Rocket size={16} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-100/50 rounded-full animate-ping"></div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">综合概览</h2>
      <p className="text-sm text-gray-400 mb-8 max-w-sm text-center font-medium">
        学科建设全景看板功能正在极速建设中...
      </p>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="p-4 rounded-xl border border-dashed border-gray-200 flex flex-col items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">学科梯队图</span>
        </div>
        <div className="p-4 rounded-xl border border-dashed border-gray-200 flex flex-col items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">产出贡献榜</span>
        </div>
        <div className="p-4 rounded-xl border border-dashed border-gray-200 flex flex-col items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">资源效能墙</span>
        </div>
        <div className="p-4 rounded-xl border border-dashed border-gray-200 flex flex-col items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">预警透视镜</span>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-2 text-[10px] font-bold text-gray-300 tracking-widest uppercase py-1 px-4 border border-gray-100 rounded-full bg-gray-50/50">
        <LayoutDashboard size={10} />
        Module: Discipline Construction Special
      </div>
    </div>
  );
};
