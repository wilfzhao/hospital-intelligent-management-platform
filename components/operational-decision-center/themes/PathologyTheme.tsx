import React from 'react';
import { 
  FlaskConical, Activity, TrendingUp, BarChart3, Clock, 
  CheckCircle, AlertCircle, FileText, Search, RotateCcw
} from 'lucide-react';

interface PathologyThemeProps {
  pathologyCampus: string;
  setPathologyCampus: (campus: string) => void;
  pathologyDateRange: string;
  setPathologyDateRange: (range: string) => void;
}

const PathologyTheme: React.FC<PathologyThemeProps> = ({
  pathologyCampus,
  setPathologyCampus,
  pathologyDateRange,
  setPathologyDateRange,
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. 顶部：全局筛选区 */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">院区:</span>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['全部', '天河', '同德', '珠玑'].map(campus => (
              <button
                key={campus}
                onClick={() => setPathologyCampus(campus)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  pathologyCampus === campus
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {campus}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">时间范围:</span>
          <select 
            value={pathologyDateRange}
            onChange={(e) => setPathologyDateRange(e.target.value)}
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option>本月</option>
            <option>本周</option>
            <option>今日</option>
            <option>本年</option>
          </select>
        </div>
        
        <div className="ml-auto flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <RotateCcw size={16} />
            重置
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Search size={16} />
            查询
          </button>
        </div>
      </div>

      {/* 2. 核心指标卡区（KPI） */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-500">病理检查总量</div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FlaskConical size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-gray-900">4,250</div>
            <div className="text-xs text-gray-500">例</div>
          </div>
          <div className="text-xs font-medium mt-3 text-emerald-600 flex items-center gap-1">
            <TrendingUp size={14}/> 同比 +12.4%
          </div>
        </div>

        <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-500">平均报告周期 (TAT)</div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-gray-900">3.2</div>
            <div className="text-xs text-gray-500">个工作日</div>
          </div>
          <div className="text-xs font-medium mt-3 text-emerald-600 flex items-center gap-1">
            <TrendingUp size={14} className="rotate-180"/> 较上月缩短 0.4 天
          </div>
        </div>

        <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-500">冰冻切片及时率</div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Activity size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-gray-900">98.5</div>
            <div className="text-xs text-gray-500">%</div>
          </div>
          <div className="text-xs font-medium mt-3 text-emerald-600 flex items-center gap-1">
            <CheckCircle size={14}/> 优于目标值 (95%)
          </div>
        </div>

        <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-500">疑难病例占比</div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-gray-900">15.2</div>
            <div className="text-xs text-gray-500">%</div>
          </div>
          <div className="text-xs font-medium mt-3 text-blue-600 flex items-center gap-1">
            <BarChart3 size={14}/> 环比持平
          </div>
        </div>
      </div>

      {/* 3. 详细分析区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              病理检查量与收入趋势
            </h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">检查量</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600">收入 (万元)</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 size={48} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">病理趋势分析图表加载中...</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText size={20} className="text-purple-600" />
            病理类型分布
          </h3>
          <div className="space-y-6">
            {[
              { label: '常规活检', value: 2450, percent: 58, color: 'bg-blue-500' },
              { label: '细胞学检查', value: 850, percent: 20, color: 'bg-emerald-500' },
              { label: '冰冻切片', value: 450, percent: 11, color: 'bg-purple-500' },
              { label: '分子病理', value: 320, percent: 7, color: 'bg-orange-500' },
              { label: '其他', value: 180, percent: 4, color: 'bg-gray-400' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-500">{item.value} 例 ({item.percent}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`h-full rounded-full ${item.color}`} 
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 底部提示 */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle size={20} className="text-blue-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">病理主题分析说明</h4>
          <p className="text-sm text-blue-700 mt-1">
            当前展示为病理科核心运营指标。TAT（Turnaround Time）计算从标本接收到报告发布的时间。分子病理及疑难病例分析模块正在开发中，敬请期待。
          </p>
        </div>
      </div>
    </div>
  );
};

export default PathologyTheme;
