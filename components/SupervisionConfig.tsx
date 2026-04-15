import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, CalendarDays } from 'lucide-react';

export const SupervisionConfig: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [deptSource, setDeptSource] = useState<'platform' | 'data_dev'>('platform');
  const [configMode, setConfigMode] = useState<'unified' | 'custom'>('unified');

  const [startDay, setStartDay] = useState<number>(20);
  const [endDay, setEndDay] = useState<number>(10);
  const [startRelativeMonth, setStartRelativeMonth] = useState<number>(3); // 3: 末月, 4: 下季首月
  const [endRelativeMonth, setEndRelativeMonth] = useState<number>(4); // 3: 本季末月, 4: 下季首月

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const [customDates, setCustomDates] = useState<Record<number, {start: string, end: string}>>({
    1: { start: `${currentYear}-03-20`, end: `${currentYear}-04-10` },
    2: { start: `${currentYear}-06-20`, end: `${currentYear}-07-10` },
    3: { start: `${currentYear}-09-20`, end: `${currentYear}-10-10` },
    4: { start: `${currentYear}-12-20`, end: `${currentYear + 1}-01-10` },
  });

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCustomDateChange = (q: number, field: 'start' | 'end', value: string) => {
    setCustomDates(prev => ({
      ...prev,
      [q]: { ...prev[q], [field]: value }
    }));
  };

  const previewDates = useMemo(() => {
    return [1, 2, 3, 4].map(q => {
      let sMonth = (q - 1) * 3 + startRelativeMonth;
      let eMonth = (q - 1) * 3 + endRelativeMonth;
      
      let sYear = selectedYear;
      let eYear = selectedYear;

      if (sMonth > 12) {
        sMonth -= 12;
        sYear += 1;
      }
      
      if (eMonth > 12) {
        eMonth -= 12;
        eYear += 1;
      }

      const formatMonth = (m: number) => m.toString().padStart(2, '0');
      const formatDay = (d: number) => d.toString().padStart(2, '0');

      return {
        quarter: q,
        quarterName: `第${q}季度 (${(q-1)*3+1}-${q*3}月)`,
        start: `${sYear}-${formatMonth(sMonth)}-${formatDay(startDay)}`,
        end: `${eYear}-${formatMonth(eMonth)}-${formatDay(endDay)}`
      };
    });
  }, [selectedYear, startDay, endDay, startRelativeMonth, endRelativeMonth]);

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {showSuccess && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-green-50 text-green-800 px-4 py-3 rounded-lg shadow-md border border-green-200 flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} className="text-green-600" />
          <span className="font-medium">配置已保存！</span>
        </div>
      )}

      <div className="flex-1 space-y-6 pb-10">
        {/* Department Source Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            科室取值配置
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <label className={`flex-1 flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${deptSource === 'platform' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
              <input
                type="radio"
                name="deptSource"
                value="platform"
                checked={deptSource === 'platform'}
                onChange={() => setDeptSource('platform')}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">取平台管理</div>
                <div className="text-sm text-gray-500 mt-0.5">使用本平台内部维护的科室组织架构数据</div>
              </div>
            </label>
            <label className={`flex-1 flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${deptSource === 'data_dev' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
              <input
                type="radio"
                name="deptSource"
                value="data_dev"
                checked={deptSource === 'data_dev'}
                onChange={() => setDeptSource('data_dev')}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">取数开提供的科室表</div>
                <div className="text-sm text-gray-500 mt-0.5">同步并使用数据开发部门提供的标准科室主数据</div>
              </div>
            </label>
          </div>
        </div>

        {/* Time Configuration Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              填报时间配置
            </h2>
            <p className="text-sm text-gray-500 mt-1">设置各季度任务填报的开启和结束时间控制</p>
          </div>
          
          {/* Mode Selection */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
              配置模式
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <label className={`flex-1 flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${configMode === 'unified' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                <input
                  type="radio"
                  name="configMode"
                  value="unified"
                  checked={configMode === 'unified'}
                  onChange={() => setConfigMode('unified')}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">统一规则配置</div>
                  <div className="text-sm text-gray-500 mt-0.5">所有季度应用相同的相对时间规则（推荐）</div>
                </div>
              </label>
              <label className={`flex-1 flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${configMode === 'custom' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                <input
                  type="radio"
                  name="configMode"
                  value="custom"
                checked={configMode === 'custom'}
                onChange={() => setConfigMode('custom')}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">按季度自定义</div>
                <div className="text-sm text-gray-500 mt-0.5">为每个季度单独设置具体的开启和结束日期</div>
              </div>
            </label>
          </div>
        </div>

        {/* Unified Rule Config */}
        {configMode === 'unified' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              统一规则设置
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">填报开启时间</label>
                <div className="flex items-center gap-3 text-gray-700">
                  <select
                    value={startRelativeMonth}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setStartRelativeMonth(val);
                      if (val > endRelativeMonth) {
                        setEndRelativeMonth(val);
                      }
                    }}
                    className="px-2 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-white"
                  >
                    <option value={3}>每季度末月</option>
                    <option value={4}>下季度首月</option>
                  </select>
                  <span>的</span>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={startDay}
                    onChange={(e) => setStartDay(Number(e.target.value))}
                    className="w-20 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center font-medium"
                  />
                  <span>日</span>
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <AlertCircle size={12} />
                  例如：Q1(1-3月)将在{startRelativeMonth > 3 ? startRelativeMonth - 3 : startRelativeMonth}月{startDay}日开启填报
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">填报结束时间</label>
                <div className="flex items-center gap-3 text-gray-700">
                  <select
                    value={endRelativeMonth}
                    onChange={(e) => setEndRelativeMonth(Number(e.target.value))}
                    className="px-2 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-white"
                  >
                    <option value={3} disabled={startRelativeMonth > 3}>每季度末月</option>
                    <option value={4}>下季度首月</option>
                  </select>
                  <span>的</span>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={endDay}
                    onChange={(e) => setEndDay(Number(e.target.value))}
                    className="w-20 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center font-medium"
                  />
                  <span>日</span>
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <AlertCircle size={12} />
                  例如：Q1(1-3月)将在{endRelativeMonth > 3 ? endRelativeMonth - 3 : endRelativeMonth}月{endDay}日结束填报
                </p>
              </div>
            </div>

            {/* Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                  规则预览
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">预览年份:</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-1 pl-2 pr-8 font-medium"
                  >
                    {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                      <option key={y} value={y}>{y}年</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">季度</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开启日期</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">结束日期</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewDates.map((item) => (
                      <tr key={item.quarter} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.quarterName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{item.start}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{item.end}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Custom Config */}
        {configMode === 'custom' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CalendarDays className="text-blue-600" size={20} />
                自定义季度时间
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">配置年份:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-1 pl-2 pr-8 font-medium"
                >
                  {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                    <option key={y} value={y}>{y}年</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4].map(q => (
                <div key={q} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="w-48">
                    <div className="font-medium text-gray-900">第{q}季度</div>
                    <div className="text-xs text-gray-500 mt-0.5">{(q-1)*3+1}-{q*3}月</div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">开启日期</label>
                      <input
                        type="date"
                        value={customDates[q].start}
                        onChange={(e) => handleCustomDateChange(q, 'start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">结束日期</label>
                      <input
                        type="date"
                        value={customDates[q].end}
                        onChange={(e) => handleCustomDateChange(q, 'end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
        
        {/* Bottom Action */}
        <div className="pt-4">
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-8 py-2.5 rounded-lg transition-colors shadow-sm active:scale-95 transform duration-100"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};
