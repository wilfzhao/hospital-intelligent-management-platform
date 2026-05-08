import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

type DimensionType = '主维度' | '内嵌维度';
type MappingType = '编码映射' | '直接关联' | null;

interface DimensionDetail {
  name: string;
  dimType: DimensionType;
  mappingType?: MappingType;
  sourceSystem?: string;
  factField: string;
  dimKey?: string;
  displayField?: string;
}

const MOCK_TABLES: { name: string, dimensions: DimensionDetail[] }[] = [
  { 
    name: '门诊事实表', 
    dimensions: [
      { name: '科室', dimType: '主维度', mappingType: '编码映射', sourceSystem: 'HIS', factField: 'f.dept_code', dimKey: 'dept_id', displayField: 'dept_name' },
      { name: '时间', dimType: '主维度', mappingType: '直接关联', factField: 'f.visit_date', dimKey: 'date_id', displayField: 'date_name' },
      { name: '医生', dimType: '主维度', mappingType: '直接关联', factField: 'f.doctor_id', dimKey: 'doctor_id', displayField: 'doctor_name' },
      { name: '支付方式', dimType: '主维度', mappingType: '直接关联', factField: 'f.pay_type', dimKey: 'pay_type_id', displayField: 'pay_type_name' },
      { name: '就诊类型', dimType: '内嵌维度', factField: 'f.visit_type' },
      { name: '挂号来源', dimType: '内嵌维度', factField: 'f.reg_source' },
    ] 
  },
  { 
    name: '住院事实表', 
    dimensions: [
      { name: '科室', dimType: '主维度', mappingType: '编码映射', sourceSystem: 'HIS', factField: 'f.dept_code', dimKey: 'dept_id', displayField: 'dept_name' },
      { name: '时间', dimType: '主维度', mappingType: '直接关联', factField: 'f.visit_date', dimKey: 'date_id', displayField: 'date_name' },
      { name: '医生', dimType: '主维度', mappingType: '直接关联', factField: 'f.doctor_id', dimKey: 'doctor_id', displayField: 'doctor_name' },
      { name: '病情等级', dimType: '内嵌维度', factField: 'f.disease_level' },
      { name: '床位类别', dimType: '内嵌维度', factField: 'f.bed_type' },
    ] 
  },
];

interface CreateBaseIndicatorProps {
  onBack: () => void;
}

export const CreateBaseIndicator: React.FC<CreateBaseIndicatorProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [resultTable, setResultTable] = useState('');
  const [detailTable, setDetailTable] = useState('');
  const [selectedDims, setSelectedDims] = useState<string[]>([]);

  const activeTableName = resultTable || detailTable;
  const availableDims = activeTableName ? (MOCK_TABLES.find(t => t.name === activeTableName)?.dimensions || []) : [];

  const handleResultTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setResultTable(val);
    const tableName = val || detailTable;
    const dims = MOCK_TABLES.find(t => t.name === tableName)?.dimensions || [];
    setSelectedDims([...dims.map(d => d.name)]);
  };

  const handleDetailTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDetailTable(val);
    const tableName = resultTable || val;
    const dims = MOCK_TABLES.find(t => t.name === tableName)?.dimensions || [];
    setSelectedDims([...dims.map(d => d.name)]);
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
        <h1 className="text-lg font-semibold text-gray-800">新建基础指标</h1>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">指标导向</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">小数位数</label>
                  <select defaultValue="0" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">下钻类型</label>
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
                <div className="hidden"></div> {/* empty grid cell for alignment if needed, but not on design */}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500 mr-1">*</span>业务口径</label>
                  <textarea rows={3} placeholder="请输入" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">业务限定</label>
                  <textarea rows={2} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"></textarea>
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
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">结果表</label>
                    <select 
                      value={resultTable}
                      onChange={handleResultTableChange}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                    >
                      <option value="" disabled>请选择</option>
                      {MOCK_TABLES.map(t => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">明细表</label>
                    <select 
                      value={detailTable}
                      onChange={handleDetailTableChange}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                    >
                      <option value="" disabled>请选择</option>
                      {MOCK_TABLES.map(t => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                      ))}
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
                      <div className="text-sm text-gray-500 py-6 text-center">请先选择结果表或明细表来关联可用维度...</div>
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
                                <div className="flex items-center gap-1.5">
                                  <span>事实表字段:</span>
                                  <span className="font-mono text-gray-800">{dim.factField}</span>
                                </div>
                                {dim.dimType === '主维度' && (
                                  <>
                                    <div className="flex items-center gap-1.5">
                                      <span>维度主键:</span>
                                      <span className="font-mono text-gray-800">{dim.dimKey}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span>显示字段:</span>
                                      <span className="font-mono text-gray-800">{dim.displayField}</span>
                                    </div>
                                  </>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">技术口径</label>
                  <textarea rows={3} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">技术溯源</label>
                  <button className="w-16 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-400 transition-colors bg-white">
                    <Plus size={24} strokeWidth={1.5} />
                  </button>
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

    </div>
  );
};

export default CreateBaseIndicator;
