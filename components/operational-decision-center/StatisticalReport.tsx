/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { List, Calendar, Search, ArrowUpDown } from 'lucide-react';

const StatisticalReport = () => {
  const [activeReport, setActiveReport] = useState('quality');
  const [dateType, setDateType] = useState('month');
  const [selectedDate, setSelectedDate] = useState('2025-10');

  const MOCK_QUALITY_DATA = [
    { dept: "心血管内科", cmi: "1.25", bedUsage: "95.2%", avgStay: "7.5", discharge: 1250, surgeryRatio: "45.2%", minimallyInvasive: 350, miRatio: "61.9%", level4: 120, level4Ratio: "21.2%", tnm: "98.5%" },
    { dept: "神经内科", cmi: "1.18", bedUsage: "98.1%", avgStay: "8.2", discharge: 980, surgeryRatio: "32.1%", minimallyInvasive: 150, miRatio: "47.6%", level4: 80, level4Ratio: "25.4%", tnm: "95.2%" },
    { dept: "呼吸内科", cmi: "1.05", bedUsage: "102.5%", avgStay: "6.8", discharge: 1520, surgeryRatio: "15.5%", minimallyInvasive: 80, miRatio: "33.8%", level4: 20, level4Ratio: "8.4%", tnm: "99.1%" },
    { dept: "消化内科", cmi: "1.12", bedUsage: "92.4%", avgStay: "5.5", discharge: 1850, surgeryRatio: "55.8%", minimallyInvasive: 850, miRatio: "82.3%", level4: 210, level4Ratio: "20.3%", tnm: "97.8%" },
    { dept: "普通外科", cmi: "1.45", bedUsage: "88.5%", avgStay: "6.2", discharge: 1650, surgeryRatio: "85.2%", minimallyInvasive: 1150, miRatio: "81.8%", level4: 450, level4Ratio: "32.0%", tnm: "96.5%" },
    { dept: "骨科", cmi: "1.38", bedUsage: "94.2%", avgStay: "7.1", discharge: 1420, surgeryRatio: "92.5%", minimallyInvasive: 980, miRatio: "74.6%", level4: 380, level4Ratio: "28.9%", tnm: "94.8%" },
    { dept: "泌尿外科", cmi: "1.22", bedUsage: "85.6%", avgStay: "5.8", discharge: 1150, surgeryRatio: "88.4%", minimallyInvasive: 890, miRatio: "87.5%", level4: 290, level4Ratio: "28.5%", tnm: "98.2%" },
    { dept: "神经外科", cmi: "1.85", bedUsage: "91.5%", avgStay: "10.5", discharge: 650, surgeryRatio: "95.5%", minimallyInvasive: 420, miRatio: "67.6%", level4: 510, level4Ratio: "82.1%", tnm: "95.5%" },
    { dept: "胸外科", cmi: "1.75", bedUsage: "89.2%", avgStay: "8.5", discharge: 780, surgeryRatio: "96.2%", minimallyInvasive: 650, miRatio: "86.6%", level4: 480, level4Ratio: "63.9%", tnm: "99.5%" },
    { dept: "妇科", cmi: "1.15", bedUsage: "96.5%", avgStay: "4.5", discharge: 1950, surgeryRatio: "91.5%", minimallyInvasive: 1550, miRatio: "86.8%", level4: 350, level4Ratio: "19.6%", tnm: "97.2%" },
    { dept: "产科", cmi: "0.85", bedUsage: "105.2%", avgStay: "3.2", discharge: 2550, surgeryRatio: "45.5%", minimallyInvasive: 0, miRatio: "0.0%", level4: 50, level4Ratio: "4.3%", tnm: "-" },
    { dept: "儿科", cmi: "0.92", bedUsage: "110.5%", avgStay: "4.8", discharge: 2150, surgeryRatio: "12.5%", minimallyInvasive: 50, miRatio: "18.6%", level4: 10, level4Ratio: "3.7%", tnm: "-" },
    { dept: "眼科", cmi: "0.95", bedUsage: "75.5%", avgStay: "2.5", discharge: 1250, surgeryRatio: "98.5%", minimallyInvasive: 1150, miRatio: "93.4%", level4: 150, level4Ratio: "12.1%", tnm: "-" },
    { dept: "耳鼻喉科", cmi: "1.02", bedUsage: "82.5%", avgStay: "3.5", discharge: 1050, surgeryRatio: "95.2%", minimallyInvasive: 850, miRatio: "85.0%", level4: 220, level4Ratio: "22.0%", tnm: "96.5%" },
    { dept: "肿瘤科", cmi: "1.55", bedUsage: "108.5%", avgStay: "9.5", discharge: 1850, surgeryRatio: "25.5%", minimallyInvasive: 150, miRatio: "31.7%", level4: 80, level4Ratio: "16.9%", tnm: "100.0%" }
  ];

  return (
    <div className="flex h-full w-full bg-[#f8fafc] gap-4 p-6">
      {/* Left Directory */}
      <div className="w-64 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <List size={18} className="text-blue-600" />
            报表目录
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-2 text-sm font-medium text-gray-500">门诊业务报表</div>
          <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ml-2">门诊人次统计</div>
          <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ml-2">门诊收入统计</div>
          
          <div className="px-3 py-2 text-sm font-medium text-gray-500 mt-2">住院业务报表</div>
          <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ml-2">出院人次统计</div>
          <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ml-2">住院收入统计</div>
          
          <div className="px-3 py-2 text-sm font-medium text-gray-500 mt-2">医疗质量报表</div>
          <div 
            className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ml-2 font-medium ${activeReport === 'quality' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveReport('quality')}
          >
            医疗质量完成情况
          </div>
          <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ml-2">手术分级统计</div>
          <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ml-2">病案首页质量</div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col min-w-0 gap-4">
        {/* Top Operation Area */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Segmented Control for Date Type */}
            <div className="flex bg-white border border-gray-200 rounded-lg h-9 overflow-hidden">
              <button
                onClick={() => setDateType('year')}
                className={`w-16 flex items-center justify-center text-sm transition-colors ${
                  dateType === 'year' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                年
              </button>
              <div className={`w-[1px] h-full ${dateType === 'quarter' ? 'bg-blue-500' : 'bg-gray-200'}`} />
              <button
                onClick={() => setDateType('quarter')}
                className={`w-16 flex items-center justify-center text-sm transition-colors ${
                  dateType === 'quarter' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                季
              </button>
              <div className={`w-[1px] h-full ${dateType === 'month' ? 'bg-blue-500' : 'bg-gray-200'}`} />
              <button
                onClick={() => setDateType('month')}
                className={`w-16 flex items-center justify-center text-sm transition-colors ${
                  dateType === 'month' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                月
              </button>
            </div>

            {/* Date Input with Icon */}
            <div className="relative flex items-center h-9">
              <div className="absolute left-3 text-gray-400 pointer-events-none">
                <Calendar size={18} />
              </div>
              <input 
                type={dateType === 'month' ? 'month' : 'text'} 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder={dateType === 'year' ? '2025' : dateType === 'quarter' ? '2025-Q3' : ''}
                className="border border-gray-200 rounded-lg pl-10 pr-3 h-full text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-48 text-gray-700 tracking-wide"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4 h-9 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Search size={14} />
              查询
            </button>
            <button className="flex items-center gap-1.5 px-4 h-9 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <ArrowUpDown size={14} />
              下载
            </button>
          </div>
        </div>

        {/* Bottom Data Area */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
            <h3 className="font-bold text-gray-800">医疗质量完成情况</h3>
            <span className="text-xs text-gray-500">数据更新时间: 2025-10-31 23:59:59</span>
          </div>
          <div className="flex-1 overflow-auto p-4 custom-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1200px]">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">科室名称</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">CMI</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">病床使用率</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">平均住院日</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">出院人次</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">出院患者手术占比</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">微创人次</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">出院患者微创手术占比</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">四级手术人次</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">出院患者四级手术占比</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">肿瘤治疗前临床TNM分期评估率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_QUALITY_DATA.map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.dept}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.cmi}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.bedUsage}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.avgStay}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.discharge}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.surgeryRatio}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.minimallyInvasive}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.miRatio}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.level4}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.level4Ratio}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.tnm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalReport;
