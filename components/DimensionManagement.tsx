import React, { useState } from 'react';
import { 
  Search, Plus, Layers, X, Trash2, Pencil
} from 'lucide-react';

interface DimensionItem {
  id: string;
  name: string;
  nameEn: string;
  status: 'published' | 'draft';
  dimensionType: string;
  level?: string;
  tablePath: string;
  primaryKeyField?: string;
  displayField?: string;
  usageCount: number;
}

interface HierarchyConfig {
  id: number;
  name: string;
  field: string;
}

interface DimensionFormData {
  name: string;
  nameEn: string;
  status: 'published' | 'draft';
  dimensionType: string;
  tablePath: string;
  primaryKeyField: string;
  displayField: string;
  level: string;
  isHierarchical: boolean;
  hierarchies: HierarchyConfig[];
}

const INITIAL_MOCK_DIMENSIONS: DimensionItem[] = [
  {
    id: 'dim-1',
    name: '科室',
    nameEn: 'department',
    status: 'published',
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
    dimensionType: '主维度',
    tablePath: 'dw.dim_disease',
    usageCount: 11,
  },
  {
    id: 'dim-5',
    name: '支付方式',
    nameEn: 'pay_type',
    status: 'published',
    dimensionType: '主维度',
    tablePath: 'dw.dim_pay_type',
    usageCount: 0,
  },
];

const TABLE_FIELDS_CONFIG: Record<string, { primaryKeys: string[], displayFields: string[] }> = {
  'dw.dim_department': { primaryKeys: ['dept_code', 'id'], displayFields: ['dept_name', 'name'] },
  'dw.dim_doctor': { primaryKeys: ['doctor_id', 'id'], displayFields: ['doctor_name', 'name'] },
  'dw.dim_disease': { primaryKeys: ['disease_code', 'id'], displayFields: ['disease_name', 'name'] },
  'dw.dim_date': { primaryKeys: ['date_key', 'id'], displayFields: ['date_name', 'name'] },
  'dw.dim_pay_type': { primaryKeys: ['pay_type_code', 'id'], displayFields: ['pay_type_name', 'name'] },
};

const HIERARCHY_MAPPING: Record<string, string> = {
  'hospital_id': '医院',
  'area_id': '院区',
  'dept_type_id': '科室分类',
  'dept_id': '科室',
  'ward_id': '病区',
  'year': '年度',
  'quarter': '季度',
  'month': '月份',
  'week': '周',
  'day': '日期',
  'job_title_id': '职称',
  'doctor_id': '医生',
  'disease_cat_id': '病种分类',
  'disease_id': '病种',
};

// Helper for generating IDs safely outside of render
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
const generateNumericId = () => Date.now() + Math.floor(Math.random() * 1000);

export const DimensionManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dimensions, setDimensions] = useState<DimensionItem[]>(INITIAL_MOCK_DIMENSIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Form State
    const [formData, setFormData] = useState<DimensionFormData>({
        name: '',
        nameEn: '',
        status: 'draft',
        dimensionType: '主维度',
        tablePath: '',
        primaryKeyField: '',
        displayField: '',
        level: '',
        isHierarchical: false,
        hierarchies: [],
    });

    const filteredDims = dimensions.filter(dim => 
        dim.name.includes(searchTerm) || dim.nameEn.includes(searchTerm) || dim.tablePath.includes(searchTerm)
    );

    const handleSave = () => {
        if (!formData.name || !formData.nameEn || !formData.tablePath || !formData.primaryKeyField || !formData.displayField) {
            alert('请填写完整必填项');
            return;
        }

        if (editingId) {
            // Update mode
            setDimensions(prev => prev.map(dim => {
                if (dim.id === editingId) {
                    return {
                        ...dim,
                        name: formData.name,
                        status: formData.status as 'published' | 'draft',
                        dimensionType: formData.dimensionType,
                        level: formData.isHierarchical && formData.hierarchies.length > 0 
                            ? `${formData.hierarchies.length}级层级` 
                            : '无层级',
                        tablePath: formData.tablePath,
                        primaryKeyField: formData.primaryKeyField,
                        displayField: formData.displayField,
                    };
                }
                return dim;
            }));
        } else {
            // Create mode
            const newDim: DimensionItem = {
                id: generateId('dim'),
                name: formData.name!,
                nameEn: formData.nameEn!,
                status: formData.status as 'published' | 'draft',
                dimensionType: formData.dimensionType!,
                level: formData.isHierarchical && formData.hierarchies.length > 0 
                    ? `${formData.hierarchies.length}级层级` 
                    : '无层级',
                tablePath: formData.tablePath!,
                primaryKeyField: formData.primaryKeyField,
                displayField: formData.displayField,
                usageCount: 0,
            };

            setDimensions([newDim, ...dimensions]);
        }

        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            name: '',
            nameEn: '',
            status: 'draft',
            dimensionType: '主维度',
            tablePath: '',
            primaryKeyField: '',
            displayField: '',
            level: '',
            isHierarchical: false,
            hierarchies: [],
        });
    };

    const handleEdit = (dim: DimensionItem) => {
        setEditingId(dim.id);
        setFormData({
            name: dim.name,
            nameEn: dim.nameEn,
            status: dim.status,
            dimensionType: dim.dimensionType,
            tablePath: dim.tablePath,
            primaryKeyField: dim.primaryKeyField || '',
            displayField: dim.displayField || '',
            level: dim.level || '',
            isHierarchical: !!dim.level && dim.level !== '无层级',
            // Note: Hierarchies would normally be fetched from an API
            hierarchies: dim.level && dim.level !== '无层级' 
                ? [ { id: 1, name: '层级1', field: dim.primaryKeyField || '' } ] // Simplified for mock
                : [],
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, usageCount: number, name: string) => {
        if (usageCount > 0) {
            alert(`维度 "${name}" 已被引用 ${usageCount} 次，无法删除`);
            return;
        }
        
        if (window.confirm(`确定要删除维度 "${name}" 吗？`)) {
            setDimensions(prev => prev.filter(d => d.id !== id));
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white rounded-lg shadow-sm font-sans animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-end">
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
                        <div 
                            key={dim.id} 
                            onClick={() => handleEdit(dim)}
                            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{dim.name}</h3>
                                    <p className="text-sm text-gray-500 font-mono mt-1">{dim.nameEn}</p>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <div className="flex items-center gap-2">
                                        {dim.level && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">{dim.level}</span>
                                        )}
                                        <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(dim);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all"
                                                title="编辑维度"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(dim.id, dim.usageCount, dim.name);
                                                }}
                                                className={`p-1.5 rounded-md transition-all ${dim.usageCount > 0 
                                                    ? 'text-gray-200 cursor-not-allowed' 
                                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                                title={dim.usageCount > 0 ? "该维度已被引用，无法删除" : "删除维度"}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
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
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                            <h3 className="text-lg font-bold text-gray-800">{editingId ? '编辑维度' : '新建维度'}</h3>
                            <button 
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-left">
                            {/* 基本信息 */}
                            <div className="space-y-4">
                                <h4 className="text-sm border-b border-gray-100 pb-2 font-bold text-gray-800 flex items-center justify-between">
                                    维度基本信息
                                    {editingId && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${formData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {formData.status === 'published' ? '已发布' : '草稿'}
                                        </span>
                                    )}
                                </h4>
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
                                        <label className="text-sm font-semibold text-gray-700">
                                            维度英文名 <span className="text-red-500">*</span>
                                            {editingId && <span className="ml-1 text-[10px] text-amber-500 font-normal">(不可编辑)</span>}
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="如：department"
                                            disabled={!!editingId}
                                            className={`w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none transition-all font-mono shadow-sm ${editingId ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500'}`}
                                            value={formData.nameEn}
                                            onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-semibold text-gray-700">维度状态</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="status"
                                                className="w-4 h-4 text-blue-600"
                                                checked={formData.status === 'published'}
                                                onChange={() => setFormData({ ...formData, status: 'published' })}
                                            />
                                            <span className="text-xs text-gray-600">发布</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="status"
                                                className="w-4 h-4 text-blue-600"
                                                checked={formData.status === 'draft'}
                                                onChange={() => setFormData({ ...formData, status: 'draft' })}
                                            />
                                            <span className="text-xs text-gray-600">草稿</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 数据来源 */}
                            <div className="space-y-4">
                                <h4 className="text-sm border-b border-gray-100 pb-2 font-bold text-gray-800 flex items-center justify-between">
                                    数据来源
                                    {editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0 && (
                                        <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">
                                            已存在引用，来源配置已锁定
                                        </span>
                                    )}
                                </h4>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">来源表 <span className="text-red-500">*</span></label>
                                    <select 
                                        disabled={!!editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0}
                                        className={`w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none transition-all font-mono shadow-sm bg-white ${editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500'}`}
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
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">主键字段 <span className="text-red-500">*</span></label>
                                        <select 
                                            disabled={!!editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0}
                                            className={`w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none transition-all font-mono shadow-sm bg-white ${editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500'}`}
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
                                            disabled={!!editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0}
                                            className={`w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none transition-all font-mono shadow-sm bg-white ${editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500'}`}
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
                            {/* 维度层级配置 */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                    <h4 className="text-sm font-bold text-gray-800">维度层级配置</h4>
                                    <label className={`flex items-center gap-2 ${editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                        <input 
                                            type="checkbox" 
                                            disabled={!!editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0}
                                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 transition-all" 
                                            checked={formData.isHierarchical}
                                            onChange={e => {
                                                const checked = e.target.checked;
                                                let newHierarchies = [...formData.hierarchies];
                                                if (checked && newHierarchies.length === 0) {
                                                    newHierarchies = [{ id: generateNumericId(), name: '', field: '' }];
                                                }
                                                setFormData({ ...formData, isHierarchical: checked, hierarchies: newHierarchies });
                                            }}
                                        />
                                        <span className="text-sm text-gray-700 font-medium">启用分级维度</span>
                                    </label>
                                </div>
                                
                                {formData.isHierarchical && (
                                    <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                        {formData.hierarchies?.map((h, idx) => (
                                            <div key={h.id} className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
                                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    L{idx + 1}
                                                </span>
                                                <select 
                                                    disabled={!!editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0}
                                                    className={`flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono transition-all bg-white ${editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0 ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100' : 'focus:border-blue-500'}`}
                                                    value={h.field}
                                                    onChange={e => {
                                                        const field = e.target.value;
                                                        const newH = [...(formData.hierarchies || [])];
                                                        newH[idx].field = field;
                                                        newH[idx].name = HIERARCHY_MAPPING[field] || '';
                                                        setFormData({ ...formData, hierarchies: newH });
                                                    }}
                                                >
                                                    <option value="">选择字段</option>
                                                    {Object.keys(HIERARCHY_MAPPING).map(field => {
                                                        const isUsed = formData.hierarchies.some((item, i) => item.field === field && i !== idx);
                                                        return (
                                                            <option key={field} value={field} disabled={isUsed}>
                                                                {field} {isUsed ? '(已选择)' : ''}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <input 
                                                    type="text" 
                                                    placeholder="层级名称"
                                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-gray-50"
                                                    value={h.name}
                                                    readOnly
                                                />
                                                <button 
                                                    disabled={!!editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0}
                                                    onClick={() => {
                                                        const newH = formData.hierarchies?.filter((_, i) => i !== idx);
                                                        setFormData({ ...formData, hierarchies: newH });
                                                    }}
                                                    className={`p-1.5 transition-colors ${editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md'}`}
                                                    title="删除层级"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {(!formData.hierarchies || formData.hierarchies.length < 5) && (
                                            <button 
                                                disabled={!!editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0}
                                                onClick={() => {
                                                    const newH = [...(formData.hierarchies || []), { id: generateNumericId(), name: '', field: '' }];
                                                    setFormData({ ...formData, hierarchies: newH });
                                                }}
                                                className={`flex items-center justify-center gap-2 w-full py-2.5 border border-dashed rounded-lg text-sm transition-all font-medium ${editingId && (dimensions.find(d => d.id === editingId)?.usageCount || 0) > 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50'}`}
                                            >
                                                <Plus size={16} />
                                                配置维度层级 (最多5级)
                                            </button>
                                        )}
                                        {formData.hierarchies?.length >= 5 && (
                                            <p className="text-center text-[11px] text-amber-500 font-medium">已达到最大层级限制 (5级)</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                            <button 
                                onClick={closeModal}
                                className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95"
                            >
                                {editingId ? '更新' : '创建'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default DimensionManagement;
