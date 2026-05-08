import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Filter, ChevronDown } from 'lucide-react';
import { CreateBaseIndicator } from './CreateBaseIndicator';
import { CreateCompositeIndicator } from './CreateCompositeIndicator';

// Mock Data Types
interface IndicatorItem {
  id: string;
  name: string;
  type: string;
  collectionMethod: string;
}

const MOCK_INDICATORS: IndicatorItem[] = [
  { id: 'ind-1', name: '出院患者微创手术占比', type: '复合指标', collectionMethod: '自动采集' },
  { id: 'ind-2', name: 'CMI指数', type: '基础指标', collectionMethod: '自动采集' },
  { id: 'ind-3', name: '抗菌药物使用强度(DDDs)', type: '复合指标', collectionMethod: '自动采集' },
  { id: 'ind-4', name: '科研成果转化金额', type: '基础指标', collectionMethod: '手动采集' },
  { id: 'ind-5', name: '门诊患者满意度', type: '基础指标', collectionMethod: '手动采集' },
  { id: 'ind-6', name: '百床位科研经费', type: '复合指标', collectionMethod: '手动采集' },
  { id: 'ind-7', name: '四级手术占比', type: '复合指标', collectionMethod: '自动采集' },
  { id: 'ind-8', name: '平均住院日', type: '基础指标', collectionMethod: '自动采集' },
];

export const IndicatorManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('全部');
    const [methodFilter, setMethodFilter] = useState('全部');
    const [isCreatingBase, setIsCreatingBase] = useState(false);
    const [isCreatingComposite, setIsCreatingComposite] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredData = MOCK_INDICATORS.filter(ind => {
        const matchSearch = ind.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = typeFilter === '全部' || ind.type === typeFilter;
        const matchMethod = methodFilter === '全部' || ind.collectionMethod === methodFilter;
        return matchSearch && matchType && matchMethod;
    });

    const types = ['全部', ...Array.from(new Set(MOCK_INDICATORS.map(i => i.type)))];
    const methods = ['全部', '手动采集', '自动采集'];

    if (isCreatingBase) {
      return <CreateBaseIndicator onBack={() => setIsCreatingBase(false)} />;
    }

    if (isCreatingComposite) {
      return <CreateCompositeIndicator onBack={() => setIsCreatingComposite(false)} />;
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white rounded-lg shadow-sm font-sans animate-in fade-in zoom-in-95 duration-300">
            {/* Header & Filters */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="搜索指标名称..." 
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">指标类型:</span>
                        <select 
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white min-w-[130px] appearance-none"
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value)}
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                        >
                            {types.map(t => <option key={t} value={t}>{t === '全部' ? '全部类型' : t}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">采集方式:</span>
                        <select 
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white min-w-[130px] appearance-none"
                            value={methodFilter}
                            onChange={e => setMethodFilter(e.target.value)}
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                        >
                            {methods.map(m => <option key={m} value={m}>{m === '全部' ? '全部方式' : m}</option>)}
                        </select>
                    </div>

                    <div className="relative ml-2" ref={menuRef}>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-600/20"
                        >
                            <Plus size={16} />
                            新建指标
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button 
                                    onClick={() => {
                                        setIsCreatingBase(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50/80 hover:text-blue-700 transition-colors font-medium border-l-2 border-transparent hover:border-blue-500"
                                >
                                    基础指标
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsCreatingComposite(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50/80 hover:text-blue-700 transition-colors font-medium border-l-2 border-transparent hover:border-blue-500"
                                >
                                    复合指标
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto bg-gray-50/30 p-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3.5 text-sm font-semibold text-gray-700 w-[50%]">指标名称</th>
                                <th className="px-6 py-3.5 text-sm font-semibold text-gray-700 w-[30%]">指标类型</th>
                                <th className="px-6 py-3.5 text-sm font-semibold text-gray-700 text-right w-[20%]">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.length > 0 ? filteredData.map(ind => (
                                <tr key={ind.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-800">{ind.name}</span>
                                            {ind.collectionMethod === '手动采集' && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-100/50">手动</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            {ind.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-100">
                                                编辑
                                            </button>
                                            <button className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-100">
                                                复制
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-20 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Filter size={24} className="text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-medium text-sm">未能找到匹配的指标数据</p>
                                        <p className="text-gray-400 text-xs mt-1">请尝试调整搜索关键词或清空筛选条件</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IndicatorManagement;
