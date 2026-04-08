import React from 'react';
import { BarChart3, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';

interface GenericDetailProps {
  activeModuleId: string;
  modules: Array<{ id: string; title: string; desc: string; icon: any }>;
}

const GenericDetail: React.FC<GenericDetailProps> = ({
  activeModuleId,
  modules,
}) => {
  const activeModule = modules.find(m => m.id === activeModuleId);
  
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Top KPIs */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
            <div className="text-gray-500 text-xs font-medium mb-1">关键指标 {i}</div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-gray-800 tracking-tight">1,2{i}4.00</div>
              <div className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium mb-1">
                <TrendingUp size={10} />
                <span>+5.{i}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="col-span-12 lg:col-span-9 bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] min-h-[500px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{activeModule?.title} - 核心趋势</h3>
            <p className="text-xs text-gray-400 mt-1">数据来源：全院集成平台 (T+1)</p>
          </div>
          <div className="flex bg-gray-100/50 p-1 rounded-lg">
            <button className="px-3 py-1 text-xs font-medium bg-white text-gray-800 shadow-sm rounded-md">趋势图</button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">分布图</button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">明细表</button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center border border-dashed border-gray-100 rounded-lg bg-gray-50/30 text-gray-400 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="text-center">
            <BarChart3 size={64} className="mx-auto mb-3 text-gray-200" />
            <span className="text-gray-400">交互式数据可视化区域</span>
            <div className="mt-4 flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              <button className="px-3 py-1.5 border border-gray-200 bg-white rounded text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600">下钻分析</button>
              <button className="px-3 py-1.5 border border-gray-200 bg-white rounded text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600">查看SQL</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Cards */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
        {/* Alert Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
            异常监控
            <span className="text-xs font-normal text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">3条告警</span>
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-rose-200 transition-colors cursor-pointer group">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-rose-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-800">指标异常波动 - {i}</div>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">检测到该模块核心指标在过去24小时内出现非预期波动，建议立即排查...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-xs text-blue-600 font-medium flex items-center justify-center gap-1 hover:text-blue-700">
            查看全部监控 <ChevronRight size={12} />
          </button>
        </div>

        {/* Action Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-xl text-white shadow-lg shadow-blue-200">
          <h3 className="font-bold mb-2">智能分析建议</h3>
          <p className="text-xs text-blue-100 leading-relaxed mb-4">基于AI模型预测，该业务模块在下周可能面临资源缺口，建议提前进行排班优化。</p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-xs font-bold transition-colors">
            立即生成详细建议
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenericDetail;
