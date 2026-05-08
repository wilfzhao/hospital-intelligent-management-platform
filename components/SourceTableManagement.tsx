import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface SourceTableItem {
  id: string;
  name: string;
  tableName: string;
  description: string;
  domain: string;
  volume: string;
  status: 'published' | 'draft';
  fields: {
    name: string;
    field: string;
    type: '直接关联' | '编码映射' | '内嵌分组';
    dimPrimaryKey?: string;
    dimDisplayField?: string;
    sourceSystem?: string;
  }[];
}

const MOCK_DATA: SourceTableItem[] = [
  {
    id: '1',
    name: '门诊事实表',
    tableName: 'fact_outpatient',
    description: '记录每次门诊就诊明细，含挂号、就诊、费用等信息',
    domain: '门诊域',
    volume: '约 1200万 / 月',
    status: 'published',
    fields: [
      { name: '科室', field: 'dept_code', type: '编码映射' },
      { name: '时间', field: 'visit_date', type: '直接关联' },
      { name: '医生', field: 'doctor_id', type: '直接关联' },
      { name: '支付方式', field: 'pay_type', type: '直接关联' },
      { name: '就诊类型', field: 'visit_type', type: '内嵌分组' },
      { name: '挂号来源', field: 'reg_source', type: '内嵌分组' }
    ]
  },
  {
    id: '2',
    name: '住院事实表',
    tableName: 'fact_inpatient',
    description: '记录住院患者的入院、出院、费用、床位等明细信息',
    domain: '住院域',
    volume: '约 80万 / 月',
    status: 'published',
    fields: [
      { name: '科室', field: 'dept_code', type: '编码映射' },
      { name: '时间', field: 'admit_date', type: '直接关联' },
      { name: '支付方式', field: 'pay_type', type: '直接关联' },
      { name: '入院方式', field: 'admit_type', type: '内嵌分组' },
      { name: '离院方式', field: 'discharge_type', type: '内嵌分组' }
    ]
  },
  {
    id: '3',
    name: '手术事实表',
    tableName: 'fact_surgery',
    description: '记录手术操作明细，含手术类型、术者、时长、科室等',
    domain: '手术域',
    volume: '约 15万 / 月',
    status: 'published',
    fields: [
      { name: '时间', field: 'surgery_date', type: '直接关联' },
      { name: '医生', field: 'surgeon_id', type: '直接关联' },
      { name: '手术科室分组', field: 'surgery_dept_code', type: '内嵌分组' },
      { name: '手术类型', field: 'surgery_type_code', type: '内嵌分组' }
    ]
  },
  {
    id: '4',
    name: '床位事实表',
    tableName: 'fact_bed',
    description: '记录每日床位占用快照，用于计算使用率等床位指标',
    domain: '住院域',
    volume: '约 3万 / 日',
    status: 'published',
    fields: [
      { name: '科室', field: 'dept_code', type: '编码映射' },
      { name: '时间', field: 'snap_date', type: '直接关联' },
      { name: '床位类型', field: 'bed_type', type: '内嵌分组' }
    ]
  }
];

const AVAILABLE_TABLES = [
  { tableName: 'fact_outpatient', name: '门诊事实表' },
  { tableName: 'fact_inpatient', name: '住院事实表' },
  { tableName: 'fact_surgery', name: '手术事实表' },
  { tableName: 'fact_bed', name: '床位事实表' },
  { tableName: 'fact_lab', name: '检验事实表' },
  { tableName: 'fact_exam', name: '检查事实表' },
];

const DIMENSIONS = ['科室维度', '人员维度', '时间维度', '诊断维度', '项目维度'];
const SOURCE_TABLE_FIELDS = ['dept_code', 'doctor_id', 'visit_date', 'patient_id', 'diag_code', 'item_code', 'admit_date', 'pay_type', 'visit_type', 'reg_source', 'surgeon_id', 'surgery_dept_code', 'surgery_type_code', 'snap_date', 'bed_type'];
const DIM_PRIMARY_KEYS = ['id', 'dept_id', 'user_id', 'code', 'doctor_id', 'patient_id', 'diag_code'];
const DIM_DISPLAY_FIELDS = ['name', 'dept_name', 'user_name', 'desc', 'diag_name', 'type_name'];

const FIELD_NAME_MAP: Record<string, string> = {
  'visit_type': '就诊类型',
  'reg_source': '挂号来源',
  'admit_type': '入院方式',
  'discharge_type': '离院方式',
  'surgery_dept_code': '手术科室分组',
  'surgery_type_code': '手术类型',
  'bed_type': '床位类型',
  'dept_code': '科室',
  'doctor_id': '医生',
  'visit_date': '时间',
  'patient_id': '患者',
  'diag_code': '诊断',
  'item_code': '项目',
  'admit_date': '时间',
  'pay_type': '支付方式',
  'surgeon_id': '医生',
  'snap_date': '时间',
};


export const SourceTableManagement: React.FC = () => {
  const [sourceTables, setSourceTables] = useState<SourceTableItem[]>(MOCK_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFields, setNewFields] = useState<{name: string, field: string, type: '直接关联' | '编码映射' | '内嵌分组', dimPrimaryKey: string, dimDisplayField: string, sourceSystem: string}[]>([{ name: '', field: '', type: '直接关联', dimPrimaryKey: '', dimDisplayField: '', sourceSystem: '' }]);
  const [formData, setFormData] = useState({
    name: '',
    tableName: '',
    domain: '通用域',
    volume: '',
    description: '',
  });

  const handleAddDimField = () => {
    setNewFields([...newFields, { name: '', field: '', type: '直接关联', dimPrimaryKey: '', dimDisplayField: '', sourceSystem: '' }]);
  };

  const handleAddEmbeddedField = () => {
    setNewFields([...newFields, { name: '', field: '', type: '内嵌分组', dimPrimaryKey: '', dimDisplayField: '', sourceSystem: '' }]);
  };

  const handleRemoveField = (index: number) => {
    setNewFields(newFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = [...newFields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setNewFields(updatedFields);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewFields([{ name: '', field: '', type: '直接关联', dimPrimaryKey: '', dimDisplayField: '', sourceSystem: '' }]);
    setFormData({
      name: '',
      tableName: '',
      domain: '通用域',
      volume: '',
      description: '',
    });
  };

  const handleSave = () => {
    const newTable: SourceTableItem = {
      id: Date.now().toString(),
      name: formData.name,
      tableName: formData.tableName,
      description: formData.description,
      domain: formData.domain,
      volume: formData.volume || '-',
      status: 'published',
      fields: newFields.filter(f => f.name && f.field) as SourceTableItem['fields'],
    };
    
    setSourceTables([newTable, ...sourceTables]);
    handleModalClose();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 text-gray-800 overflow-hidden font-sans">
      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-200 bg-white flex-shrink-0">
        <div>
          <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2 mb-1">
            来源表管理
          </h2>
          <p className="text-sm text-gray-500">
            预配置事实表与维度的字段映射，新建指标时一键复用，共 {sourceTables.length} 张
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
        >
          <Plus size={16} />
          注册来源表
        </button>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-72">
              <input 
                type="text" 
                placeholder="搜索来源表名称、表名..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-medium">
                  <tr>
                    <th className="py-3.5 px-6 w-1/4">来源表</th>
                    <th className="py-3.5 px-6">字段映射</th>
                    <th className="py-3.5 px-6 w-32 text-center">状态</th>
                    <th className="py-3.5 px-6 w-24 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sourceTables.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="py-4 px-6 align-top">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="font-mono text-[13px] text-gray-500">{item.tableName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top whitespace-normal">
                        <div className="flex flex-wrap gap-2">
                          {item.fields.map((field, idx) => {
                            let typeColorInfo = '';
                            if (field.type === '直接关联') {
                              typeColorInfo = 'text-emerald-600 bg-emerald-50 border-emerald-200';
                            } else if (field.type === '编码映射') {
                              typeColorInfo = 'text-amber-600 bg-amber-50 border-amber-200';
                            } else {
                              typeColorInfo = 'text-orange-500 bg-orange-50 border-orange-200';
                            }

                            return (
                              <div key={idx} className="flex items-center text-[12px] border border-gray-200 rounded-md px-2.5 py-1.5 bg-gray-50/50 group-hover:bg-white transition-colors">
                                <span className="text-gray-700 font-medium">{field.name}</span>
                                <span className="text-gray-300 mx-2">→</span>
                                <span className="text-blue-600 font-mono mr-2">{field.field}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] border ${typeColorInfo}`}>{field.type}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top text-center">
                        {item.status === 'published' && (
                          <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200 font-medium">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5"></span>
                            已注册
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors opacity-0 group-hover:opacity-100">
                          配置
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
              <h3 className="text-lg font-bold text-gray-800">注册来源表</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">物理表名 <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.tableName}
                      onChange={(e) => {
                        const selectedTable = e.target.value;
                        const matchingTable = AVAILABLE_TABLES.find(t => t.tableName === selectedTable);
                        setFormData({
                          ...formData, 
                          tableName: selectedTable,
                          name: matchingTable ? matchingTable.name : formData.name
                        });
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
                    >
                      <option value="" disabled>请选择物理表名</option>
                      {AVAILABLE_TABLES.map(t => (
                        <option key={t.tableName} value={t.tableName}>{t.tableName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">来源表名称 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="自动带出或手动输入..."
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-gray-100">
                  {/* 主维度映射 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                        主维度映射
                      </label>
                      <button 
                        onClick={handleAddDimField}
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Plus size={14} /> 添加维度映射
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {newFields.filter(f => f.type !== '内嵌分组').length === 0 && (
                        <div className="text-sm text-gray-400 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                          暂无维度映射，点击右上角添加
                        </div>
                      )}
                      {newFields.map((field, idx) => {
                        if (field.type === '内嵌分组') return null;
                        
                        const selectedDimensions = newFields.map(f => f.name).filter(Boolean);
                        
                        return (
                          <div key={idx} className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                            {/* Decorative accent */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                            
                            <div className="flex items-center gap-3 pl-2">
                              <div className="flex-1">
                                <label className="block text-[11px] font-medium text-gray-500 mb-1">主维度</label>
                                <select 
                                  value={field.name}
                                  onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                                  className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors"
                                >
                                  <option value="" disabled>选择主维度</option>
                                  {DIMENSIONS.map(dim => (
                                    <option key={dim} value={dim} disabled={selectedDimensions.includes(dim) && field.name !== dim}>
                                      {dim}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="text-gray-300 mt-5">→</div>
                              <div className="flex-[0.8]">
                                <label className="block text-[11px] font-medium text-gray-500 mb-1">来源表字段</label>
                                <select 
                                  value={field.field}
                                  onChange={(e) => handleFieldChange(idx, 'field', e.target.value)}
                                  className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors"
                                >
                                  <option value="" disabled>选择来源表字段</option>
                                  {SOURCE_TABLE_FIELDS.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-[0.8]">
                                <label className="block text-[11px] font-medium text-gray-500 mb-1">关联方式</label>
                                <select 
                                  value={field.type}
                                  onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                                  className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors"
                                >
                                  <option value="直接关联">直接关联</option>
                                  <option value="编码映射">编码映射</option>
                                </select>
                              </div>
                              <button 
                                onClick={() => handleRemoveField(idx)}
                                className="mt-5 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="删除"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            
                            {(field.type === '直接关联' || field.type === '编码映射') && (
                              <div className="flex items-center gap-3 pl-5 py-2 mt-1 rounded-lg bg-blue-50/50 border border-blue-50 ml-2">
                                {field.type === '编码映射' && (
                                  <div className="flex-[0.6]">
                                    <label className="block text-[11px] font-medium text-blue-600/70 mb-1">来源系统</label>
                                    <select
                                      value={field.sourceSystem || ''}
                                      onChange={(e) => handleFieldChange(idx, 'sourceSystem', e.target.value)}
                                      className="w-full px-2.5 py-1.5 bg-white border border-blue-100 rounded-md text-xs focus:outline-none focus:border-blue-400 text-gray-700"
                                    >
                                      <option value="" disabled>选择来源系统</option>
                                      <option value="HIS系统">HIS系统</option>
                                      <option value="LIS系统">LIS系统</option>
                                      <option value="PACS系统">PACS系统</option>
                                      <option value="EMR系统">EMR系统</option>
                                    </select>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <label className="block text-[11px] font-medium text-blue-600/70 mb-1">维度主键字段</label>
                                  <select 
                                    value={field.dimPrimaryKey || ''}
                                    onChange={(e) => handleFieldChange(idx, 'dimPrimaryKey', e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-white border border-blue-100 rounded-md text-xs font-mono focus:outline-none focus:border-blue-400 text-gray-700"
                                  >
                                    <option value="" disabled>选择主键字段 (如 id)</option>
                                    {DIM_PRIMARY_KEYS.map(k => (
                                      <option key={k} value={k}>{k}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex-1">
                                  <label className="block text-[11px] font-medium text-blue-600/70 mb-1">维度显示字段</label>
                                  <select 
                                    value={field.dimDisplayField || ''}
                                    onChange={(e) => handleFieldChange(idx, 'dimDisplayField', e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-white border border-blue-100 rounded-md text-xs font-mono focus:outline-none focus:border-blue-400 text-gray-700"
                                  >
                                    <option value="" disabled>选择显示字段 (如 name)</option>
                                    {DIM_DISPLAY_FIELDS.map(d => (
                                      <option key={d} value={d}>{d}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 内嵌维度字段 */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                        内嵌维度字段
                      </label>
                      <button 
                        onClick={handleAddEmbeddedField}
                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Plus size={14} /> 添加内嵌维度字段
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {newFields.filter(f => f.type === '内嵌分组').length === 0 && (
                        <div className="col-span-2 text-sm text-gray-400 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                          暂无内嵌维度字段，点击右上角添加
                        </div>
                      )}
                      {newFields.map((field, idx) => {
                        if (field.type !== '内嵌分组') return null;
                        
                        return (
                          <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl"></div>
                            
                            <div className="flex-1 pl-2">
                              <label className="block text-[10px] font-medium text-emerald-600/70 mb-1">来源表字段</label>
                              <select 
                                value={field.field}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleFieldChange(idx, 'field', val);
                                  if (!field.name && FIELD_NAME_MAP[val]) {
                                    handleFieldChange(idx, 'name', FIELD_NAME_MAP[val]);
                                  }
                                }}
                                className="w-full px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-xs font-mono focus:outline-none focus:border-emerald-400 focus:bg-white text-gray-800 transition-colors"
                              >
                                <option value="" disabled>选择字段</option>
                                {SOURCE_TABLE_FIELDS.map(f => (
                                  <option key={f} value={f}>{f}</option>
                                ))}
                              </select>
                            </div>
                            <div className="text-gray-300 mt-4">→</div>
                            <div className="flex-1">
                              <label className="block text-[10px] font-medium text-emerald-600/70 mb-1">展示名称</label>
                              <input 
                                type="text"
                                value={field.name}
                                onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                                placeholder="展示名称"
                                className="w-full px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-emerald-400 focus:bg-white text-gray-800 transition-colors"
                              />
                            </div>
                            <button 
                              onClick={() => handleRemoveField(idx)}
                              className="mt-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                              title="删除"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={handleModalClose}
                className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm shadow-blue-600/20"
              >
                确定保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
