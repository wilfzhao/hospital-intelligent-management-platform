import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import IndicatorSelectModal from './IndicatorSelectModal';
import { INDICATORS } from '../constants';
import { Indicator } from '../types';

type DimensionType = '主维度' | '内嵌维度';
interface DimensionDetail {
  name: string;
  dimType: DimensionType;
  factField: string;
  dimKey?: string;
  displayField?: string;
  sourceTable?: string;
  combinedFactFields?: string;
}

interface CreateCompositeIndicatorProps {
  onBack: () => void;
}

const getIndicatorById = (id: string, nodes: Indicator[] = INDICATORS): Indicator | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = getIndicatorById(id, node.children);
      if (found) return found;
    }
  }
  return null;
};

// Mock dimensions mapping for selected indicators to demonstrate intersection
const getMockDimensions = (id: string): DimensionDetail[] => {
  const base: DimensionDetail[] = [
    { name: '科室', dimType: '主维度', factField: 'f.dept_code', dimKey: 'dept_id', displayField: 'dept_name', sourceTable: 'dim_department' },
    { name: '时间', dimType: '主维度', factField: 'f.visit_date', dimKey: 'date_id', displayField: 'date_name', sourceTable: 'dim_date' },
  ];
  
  // Deterministic mock differences based on ID parity
  const isEven = parseInt(id.replace(/\D/g, '') || '0') % 2 === 0;
  if (isEven) {
    base.push({ name: '门诊就诊类型', dimType: '内嵌维度', factField: 'f.visit_type' });
    base.push({ name: '医生', dimType: '主维度', factField: 'f.doctor_id', dimKey: 'doctor_id', displayField: 'doctor_name', sourceTable: 'dim_doctor' });
  } else {
    base.push({ name: '住院病情等级', dimType: '内嵌维度', factField: 'f.disease_level' });
    base.push({ name: '医生', dimType: '主维度', factField: 'f.doctor_id', dimKey: 'doctor_id', displayField: 'doctor_name', sourceTable: 'dim_doctor' });
  }
  return base;
};

export const CreateCompositeIndicator: React.FC<CreateCompositeIndicatorProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
  const [selectedIndicatorIds, setSelectedIndicatorIds] = useState<string[]>([]);
  const [formulaText, setFormulaText] = useState('');
  const [selectedDims, setSelectedDims] = useState<string[]>([]);

  // Derived indicators from IDs
  const associatedIndicators = selectedIndicatorIds
    .map(id => getIndicatorById(id))
    .filter((ind): ind is Indicator => ind !== null);

  // Indicators currently present in the calculation panel
  const activeIndicatorsInPanel = associatedIndicators.filter(ind => formulaText.includes(`[${ind.name}]`));

  const activeIndicatorIdsHash = activeIndicatorsInPanel.map(i => i.id).sort().join(',');

  // Compute intersection of available dimensions
  let availableDims: DimensionDetail[] = [];
  if (activeIndicatorIdsHash) {
    const ids = activeIndicatorIdsHash.split(',');
    const allDimsSets = ids.map(id => getMockDimensions(id));
    const aliases = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    availableDims = allDimsSets[0].filter(d1 => 
      allDimsSets.every(set => set.some(d2 => d2.name === d1.name))
    ).map(d => {
      const factFields = allDimsSets.map((set, index) => {
        const matchingDim = set.find(d2 => d2.name === d.name);
        const colName = matchingDim ? matchingDim.factField.replace(/^f\./, '') : d.factField.replace(/^f\./, '');
        return `${aliases[index]}.${colName}`;
      });
      
      return {
        ...d,
        combinedFactFields: factFields.join(', ')
      };
    });
  }

  useEffect(() => {
    setSelectedDims(availableDims.map(d => d.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndicatorIdsHash]); // Update when active indicators change


  const appendToFormula = (text: string) => {
    setFormulaText(prev => prev + text);
  };


  const scrollToSection = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 absolute inset-0 z-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex border-b border-gray-200 bg-white px-6 py-4 items-center shrink-0 shadow-sm z-10">
        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">新建复合指标</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Form Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-3xl mx-auto space-y-12 pb-24">
            
            {/* 基本信息 */}
            <section id="basic" className="scroll-mt-8 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                <h2 className="text-base font-bold text-gray-900">基本信息</h2>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500 mr-1">*</span>指标中文名</label>
                  <input type="text" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">指标编码</label>
                  <input type="text" placeholder="例: AD012" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500 mr-1">*</span>指标所属目录</label>
                  <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow bg-white pb-2 appearance-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' fill=\\\'none\\\' viewBox=\\\'0 0 20 20\\\'%3e%3cpath stroke=\\\'%236b7280\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\' stroke-width=\\\'1.5\\\' d=\\\'M6 8l4 4 4-4\\\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}>
                    <option value="" disabled>请选择</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">指标ID</label>
                  <input type="text" disabled placeholder="自动生成,标识指标唯一性" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
              </div>
            </section>

            {/* 业务信息 */}
            <section id="business" className="scroll-mt-8 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                <h2 className="text-base font-bold text-gray-900">业务信息</h2>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><span className="text-red-500 mr-1">*</span>指标属性</label>
                  <div className="flex gap-6 items-center pt-1 text-sm text-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="indicatorAttr" value="定量指标" className="text-blue-600 focus:ring-blue-500 w-4 h-4" defaultChecked />
                      定量指标
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="indicatorAttr" value="定性指标" className="text-blue-600 focus:ring-blue-500 w-4 h-4" />
                      定性指标
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><span className="text-red-500 mr-1">*</span>采集方式</label>
                  <div className="flex gap-6 items-center pt-1 text-sm text-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="collectionMethod" value="自动采集" className="text-blue-600 focus:ring-blue-500 w-4 h-4" defaultChecked />
                      自动采集
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="collectionMethod" value="手动采集" className="text-blue-600 focus:ring-blue-500 w-4 h-4" />
                      手动采集
                    </label>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2"><span className="text-red-500 mr-1">*</span>关联指标</label>
                  <button 
                    onClick={() => setIsIndicatorModalOpen(true)}
                    className="px-4 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors bg-white shadow-sm flex items-center gap-1.5"
                  >
                     <Plus size={14} /> 添加
                  </button>
                  {associatedIndicators.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {associatedIndicators.map(ind => (
                        <div key={ind.id} onClick={() => appendToFormula(`[${ind.name}]`)} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full text-sm shadow-sm cursor-pointer hover:bg-blue-100 transition-colors">
                            <span>{ind.name}</span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedIndicatorIds(prev => prev.filter(id => id !== ind.id)); }}
                                className="text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">提示：点击已选指标名称将其插入到计算面板中</p>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">计算面板</label>
                  <div className="border border-gray-200 rounded-md overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-shadow">
                    <textarea 
                      rows={6} 
                      value={formulaText}
                      onChange={e => setFormulaText(e.target.value)}
                      className="w-full px-3 py-2 text-sm focus:outline-none resize-none border-b border-gray-100 font-mono"
                      placeholder="请点击上方关联指标或输入计算公式"
                    ></textarea>
                    <div className="px-3 py-2 bg-gray-50 flex items-center gap-2 border-t border-gray-200">
                      <button onClick={() => appendToFormula(' + ')} className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">+</button>
                      <button onClick={() => appendToFormula(' - ')} className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">-</button>
                      <button onClick={() => appendToFormula(' * ')} className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">×</button>
                      <button onClick={() => appendToFormula(' / ')} className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">÷</button>
                      <button onClick={() => appendToFormula('()')} className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">()</button>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">统计维度</label>
                    {availableDims.length > 0 && (
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors -ml-2">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            checked={selectedDims.length === availableDims.length && availableDims.length > 0}
                            onChange={(e) => setSelectedDims(e.target.checked ? availableDims.map(d => d.name) : [])}
                          />
                          <span className="text-sm text-gray-600 font-medium">全选</span>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="border border-gray-200 rounded-lg p-2.5 bg-gray-50 flex flex-col gap-2 max-h-[400px] overflow-y-auto shadow-inner">
                    {availableDims.length === 0 ? (
                      <div className="text-sm text-gray-500 py-6 text-center">请先在计算面板中加入指标以计算可用维度的交集...</div>
                    ) : (
                      availableDims.map(dim => {
                        const isSelected = selectedDims.includes(dim.name);
                        return (
                          <div 
                            key={dim.name} 
                            className={`flex items-start gap-4 p-3.5 border rounded-md transition-all cursor-pointer select-none group ${
                              isSelected 
                                ? 'bg-white border-blue-200 shadow-sm' 
                                : 'bg-transparent border-transparent hover:bg-gray-200/50 opacity-60 hover:opacity-100'
                            }`}
                            onClick={() => {
                              setSelectedDims(prev => 
                                isSelected ? prev.filter(d => d !== dim.name) : [...prev, dim.name]
                              );
                            }}
                          >
                            <div className="flex items-center h-6 pt-0.5">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                                checked={isSelected}
                                readOnly
                              />
                            </div>
                            <div className="flex-1 flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-2 min-w-[100px]">
                                <span className={`font-semibold text-[15px] ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>{dim.name}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${dim.dimType === '主维度' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                                  {dim.dimType}
                                </span>
                              </div>
                              <div className="flex items-center gap-x-6 gap-y-2 text-[13px] text-gray-500 flex-1 flex-wrap">
                                {dim.dimType === '内嵌维度' && (
                                  <div className="flex items-center gap-1.5">
                                    <span>事实表字段:</span>
                                    <span className="font-mono text-gray-800">{dim.combinedFactFields || dim.factField.replace(/^f\./, '')}</span>
                                  </div>
                                )}
                                {dim.dimType === '主维度' && (
                                  <div className="flex items-center gap-1.5">
                                    <span>维度来源表:</span>
                                    <span className="font-mono text-gray-800">{dim.sourceTable || `dim_${dim.dimKey}`}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500 mr-1">*</span>指标导向</label>
                  <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                    <option value="" disabled>请选择</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">来源系统</label>
                  <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                    <option value="" disabled>请选择</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">业务文件</label>
                  <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                    <option value="" disabled>请选择</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500 mr-1">*</span>统计周期</label>
                  <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                    <option value="" disabled>请选择</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">计量单位</label>
                  <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                    <option value="" disabled>请选择</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">转换因子</label>
                  <select defaultValue="-" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                    <option value="-">-</option>
                    <option value="10">10</option>
                    <option value="100">100</option>
                    <option value="1000">1000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">小数位数</label>
                  <select defaultValue="2" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">责任科室</label>
                  <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                    <option value="" disabled>请选择</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">统计时效</label>
                  <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                    <option value="" disabled>请选择</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">下钻类型</label>
                  <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                    <option value="" disabled>请选择</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500 mr-1">*</span>业务口径</label>
                  <textarea rows={3} placeholder="请输入" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">业务限定</label>
                  <textarea rows={3} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"></textarea>
                </div>
              </div>
            </section>

            {/* 技术口径 */}
            <section id="technical" className="scroll-mt-8 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                <h2 className="text-base font-bold text-gray-900">技术口径</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">技术口径</label>
                  <textarea rows={4} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">技术溯源</label>
                  <button className="w-16 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-400 transition-colors bg-white">
                    <Plus size={24} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">结果表</label>
                    <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                      <option value="" disabled>请选择</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">明细表</label>
                    <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                      <option value="" disabled>请选择</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">统计时间索引</label>
                    <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                      <option value="" disabled>请选择</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">统计科室索引</label>
                    <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                      <option value="" disabled>请选择</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">统计字段</label>
                    <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                      <option value="" disabled>请选择</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">统计方式</label>
                    <select defaultValue="" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                      <option value="" disabled>请选择</option>
                    </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">指标结果为空返回值</label>
                     <select defaultValue="-" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                       <option value="-">-</option>
                       <option value="0">0</option>
                       <option value="null">null</option>
                     </select>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">查询视图</label>
                  <textarea rows={4} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none font-mono text-gray-600 bg-gray-50"></textarea>
                  <div className="flex gap-4 mt-2">
                    <button className="text-blue-600 text-sm hover:text-blue-800 transition-colors">脚本生成</button>
                    <button className="text-blue-600 text-sm hover:text-blue-800 transition-colors">视图生成</button>
                  </div>
                </div>
              </div>
            </section>

            {/* 其他信息 */}
            <section id="other" className="scroll-mt-8 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                <h2 className="text-base font-bold text-gray-900">其他信息</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">稽核规则</label>
                  <input type="text" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <textarea rows={4} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"></textarea>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Right Sidebar Nav */}
        <div className="w-48 bg-gray-50 border-l border-gray-200 p-6 hidden md:block shrink-0">
          <div className="sticky top-6">
             <div className="relative pl-3 border-l border-gray-200 space-y-6 text-sm">
                {[
                  { id: 'basic', label: '基本信息' },
                  { id: 'business', label: '业务信息' },
                  { id: 'technical', label: '技术口径' },
                  { id: 'other', label: '其他信息' }
                ].map(item => (
                  <div key={item.id} className="relative group cursor-pointer" onClick={() => scrollToSection(item.id)}>
                    <div className={`absolute -left-3.5 top-1.5 w-2 h-2 rounded-full border-2 bg-white transition-colors ${activeTab === item.id ? 'border-blue-600' : 'border-gray-300'}`}></div>
                    <span className={`transition-colors ${activeTab === item.id ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer sticky */}
      <div className="flex bg-white border-t border-gray-200 p-4 justify-start items-center gap-4 px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 shrink-0">
        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm">
          保存
        </button>
        <button onClick={onBack} className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors">
          取消
        </button>
      </div>

      <IndicatorSelectModal
        isOpen={isIndicatorModalOpen}
        onClose={() => setIsIndicatorModalOpen(false)}
        initialSelection={selectedIndicatorIds}
        onConfirm={(ids) => {
            setSelectedIndicatorIds(ids);
            setIsIndicatorModalOpen(false);
        }}
      />

    </div>
  );
};

export default CreateCompositeIndicator;
