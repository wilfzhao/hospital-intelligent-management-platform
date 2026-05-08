import React, { useState } from 'react';
import { 
  Search, Plus, Filter, Layers, X
} from 'lucide-react';

interface DimensionItem {
  id: string;
  name: string;
  nameEn: string;
  status: 'published' | 'draft';
  domain: string;
  dimensionType: string;
  level?: string;
  tablePath: string;
  primaryKeyField?: string;
  displayField?: string;
  usageCount: number;
}

const INITIAL_MOCK_DIMENSIONS: DimensionItem[] = [
  {
    id: 'dim-1',
    name: '科室',
    nameEn: 'department',
    status: 'published',
    domain: '组织域',
    dimensionType: '主维度',
    level: '3级层级',
    tablePath: 'dw.dim_department',
    usageCount: 28,
  },
  {
    id: 'dim-2',
    name: '时间',
    nameEn: 'date',
    status: 'published',
    domain: '时间域',
    dimensionType: '主维度',
    level: '5级层级',
    tablePath: 'dw.dim_date',
    usageCount: 64,
  },
  {
    id: 'dim-3',
    name: '医生',
    nameEn: 'doctor',
    status: 'published',
    domain: '人员域',
    dimensionType: '主维度',
    level: '2级层级',
    tablePath: 'dw.dim_doctor',
    usageCount: 19,
  },
  {
    id: 'dim-4',
    name: '病种',
    nameEn: 'disease',
    status: 'draft',
    domain: '医疗域',
    dimensionType: '主维度',
    level: '2级层级',
    tablePath: 'dw.dim_disease',
    usageCount: 11,
  },
  {
    id: 'dim-5',
    name: '支付方式',
    nameEn: 'pay_type',
    status: 'published',
    domain: '财务域',
    dimensionType: '主维度',
    tablePath: 'dw.dim_pay_type',
    usageCount: 8,
  },
];

const TABLE_FIELDS_CONFIG: Record<string, { primaryKeys: string[], displayFields: string[] }> = {
  'dw.dim_department': { primaryKeys: ['dept_code', 'id'], displayFields: ['dept_name', 'name'] },
  'dw.dim_doctor': { primaryKeys: ['doctor_id', 'id'], displayFields: ['doctor_name', 'name'] },
  'dw.dim_disease': { primaryKeys: ['disease_code', 'id'], displayFields: ['disease_name', 'name'] },
  'dw.dim_date': { primaryKeys: ['date_key', 'id'], displayFields: ['date_name', 'name'] },
  'dw.dim_pay_type': { primaryKeys: ['pay_type_code', 'id'], displayFields: ['pay_type_name', 'name'] },
};

export const DimensionManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dimensions, setDimensions] = useState<DimensionItem[]>(INITIAL_MOCK_DIMENSIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<Partial<DimensionItem>>({
        name: '',
        nameEn: '',
        status: 'draft',
        domain: '通用域',
        dimensionType: '主维度',
        tablePath: '',
        primaryKeyField: '',
        displayField: '',
        level: '',
    });

    const filteredDims = dimensions.filter(dim => 
        dim.name.includes(searchTerm) || dim.nameEn.includes(searchTerm) || dim.tablePath.includes(searchTerm)
    );

    const handleCreate = () => {
        if (!formData.name || !formData.nameEn || !formData.tablePath || !formData.primaryKeyField || !formData.displayField) {
            alert('请填写完整必填项');
            return;
        }

        const newDim: DimensionItem = {
            id: `dim-${Date.now()}`,
            name: formData.name!,
            nameEn: formData.nameEn!,
            status: formData.status as 'published' | 'draft',
            domain: formData.domain!,
            dimensionType: formData.dimensionType!,
            level: formData.level,
            tablePath: formData.tablePath!,
            primaryKeyField: formData.primaryKeyField,
            displayField: formData.displayField,
            usageCount: 0,
        };

        setDimensions([newDim, ...dimensions]);
        setIsModalOpen(false);
        setFormData({
            name: '',
            nameEn: '',
            status: 'draft',
            domain: '通用域',
            dimensionType: '主维度',
            tablePath: '',
            primaryKeyField: '',
            displayField: '',
            level: '',
        });
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white rounded-lg shadow-sm font-sans animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Layers size={20} className="text-blue-600" />
                        指标维度管理
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">负责建立和管理全院统一的指标维度层级，为指标库提供标准化分类标签支撑。</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="搜索维度名称或表名..." 
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-sm font-medium transition-colors">
                        <Filter size={16} />
                        筛选
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-600/20"
                    >
                        <Plus size={16} />
                        新建维度
                    </button>
                </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDims.length > 0 ? filteredDims.map(dim => (
                        <div key={dim.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col cursor-pointer">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{dim.name}</h3>
                                    <p className="text-sm text-gray-500 font-mono mt-1">{dim.nameEn}</p>
                                </div>
                            </div>

                            <div className="mt-5 bg-gray-50 border border-gray-100/80 rounded-lg p-3 group-hover:bg-blue-50/30 transition-colors">
                                <p className="text-sm font-mono text-gray-600">{dim.tablePath}</p>
                            </div>

                            <div className="mt-auto pt-5 flex items-center justify-between text-sm text-gray-500">
                                <span>被引用 <span className="text-blue-600 font-semibold">{dim.usageCount}</span> 次</span>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full pt-16 flex flex-col items-center justify-center">
                            <Layers size={40} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">未能找到匹配的维度数据</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Modal and Rest of UI */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                            <h3 className="text-lg font-bold text-gray-800">新建维度</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* 基本信息 */}
                            <div className="space-y-4">
                                <h4 className="text-sm border-b border-gray-100 pb-2 font-bold text-gray-800">维度基本信息</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">维度展示名 <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            placeholder="如：科室"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">维度英文名 <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            placeholder="如：department"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono shadow-sm"
                                            value={formData.nameEn}
                                            onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* 数据来源 */}
                            <div className="space-y-4">
                                <h4 className="text-sm border-b border-gray-100 pb-2 font-bold text-gray-800">数据来源</h4>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">来源表 <span className="text-red-500">*</span></label>
                                    <select 
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono shadow-sm bg-white"
                                        value={formData.tablePath}
                                        onChange={e => {
                                            const tablePath = e.target.value;
                                            setFormData({ 
                                                ...formData, 
                                                tablePath,
                                                primaryKeyField: '',
                                                displayField: ''
                                            });
                                        }}
                                    >
                                        <option value="">请选择来源表</option>
                                        <option value="dw.dim_department">dw.dim_department (科室维度表)</option>
                                        <option value="dw.dim_doctor">dw.dim_doctor (医生维度表)</option>
                                        <option value="dw.dim_disease">dw.dim_disease (病种维度表)</option>
                                        <option value="dw.dim_date">dw.dim_date (时间维度表)</option>
                                        <option value="dw.dim_pay_type">dw.dim_pay_type (支付方式维度表)</option>
                                    </select>
                                    <p className="text-[11px] text-gray-400">请指定对应的大数据平台物理维度表名称</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">主键字段 <span className="text-red-500">*</span></label>
                                        <select 
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono shadow-sm bg-white"
                                            value={formData.primaryKeyField}
                                            onChange={e => setFormData({ ...formData, primaryKeyField: e.target.value })}
                                        >
                                            <option value="">请选择主键字段</option>
                                            {formData.tablePath && TABLE_FIELDS_CONFIG[formData.tablePath]?.primaryKeys.map(key => (
                                                <option key={key} value={key}>{key}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">显示字段 <span className="text-red-500">*</span></label>
                                        <select 
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono shadow-sm bg-white"
                                            value={formData.displayField}
                                            onChange={e => setFormData({ ...formData, displayField: e.target.value })}
                                        >
                                            <option value="">请选择显示字段</option>
                                            {formData.tablePath && TABLE_FIELDS_CONFIG[formData.tablePath]?.displayFields.map(key => (
                                                <option key={key} value={key}>{key}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleCreate}
                                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default DimensionManagement;
