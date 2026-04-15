import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Info } from 'lucide-react';

interface ScoringRule {
  id: string;
  name: string;
  application: string;
  description: string;
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface RuleSetting {
  id: string;
  conditions: Condition[];
  scoreValue: string;
  customScoreValue: string;
  scoreOperator1: string;
  scoreOperand1: string;
  customScoreOperand1: string;
  scoreOperator2: string;
  scoreOperand2: string;
  customScoreOperand2: string;
  maxScore: string;
  minScore: string;
}

const MOCK_RULES: ScoringRule[] = [
  { id: '1', name: '达成率评分', application: '通用', description: '指标实际值 / 指标目标值 * 指标权重 (支持上限控制)' },
  { id: '2', name: '区间赋分法', application: '通用', description: '院内新技术开展数：≥5项得25分；≥3项得18分；≥1项得8分；0项得0分' },
];

const FIELDS = ['指标实际值', '指标目标值', '指标权重', '指标分值', '自定义数值'];
const OPERATORS = ['等于 (=)', '大于 (>)', '小于 (<)', '大于等于 (>=)', '小于等于 (<=)', '不为空'];
const MATH_OPERATORS = ['无', '加 (+)', '减 (-)', '乘 (×)', '除 (÷)'];

export const ScoringRules: React.FC = () => {
  const [rules] = useState<ScoringRule[]>(MOCK_RULES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal State
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState('通用');
  const [ruleDescription, setRuleDescription] = useState('');
  const [ruleSettings, setRuleSettings] = useState<RuleSetting[]>([
    {
      id: '1',
      conditions: [{ id: '1', field: '指标实际值', operator: '不为空', value: '' }],
      scoreValue: '指标实际值',
      customScoreValue: '',
      scoreOperator1: '无',
      scoreOperand1: '',
      customScoreOperand1: '',
      scoreOperator2: '无',
      scoreOperand2: '',
      customScoreOperand2: '',
      maxScore: '',
      minScore: '0'
    }
  ]);

  const handleAddRuleSetting = () => {
    setRuleSettings([
      ...ruleSettings,
      {
        id: Date.now().toString(),
        conditions: [{ id: Date.now().toString(), field: '指标实际值', operator: '不为空', value: '' }],
        scoreValue: '自定义数值',
        customScoreValue: '',
        scoreOperator1: '无',
        scoreOperand1: '',
        customScoreOperand1: '',
        scoreOperator2: '无',
        scoreOperand2: '',
        customScoreOperand2: '',
        maxScore: '',
        minScore: ''
      }
    ]);
  };

  const handleRemoveRuleSetting = (id: string) => {
    setRuleSettings(ruleSettings.filter(s => s.id !== id));
  };

  const handleAddCondition = (settingId: string) => {
    setRuleSettings(ruleSettings.map(s => {
      if (s.id === settingId) {
        return {
          ...s,
          conditions: [...s.conditions, { id: Date.now().toString(), field: '指标实际值', operator: '不为空', value: '' }]
        };
      }
      return s;
    }));
  };

  const handleUpdateCondition = (settingId: string, conditionId: string, updates: Partial<Condition>) => {
    setRuleSettings(ruleSettings.map(s => {
      if (s.id === settingId) {
        return {
          ...s,
          conditions: s.conditions.map(c => c.id === conditionId ? { ...c, ...updates } : c)
        };
      }
      return s;
    }));
  };

  const handleUpdateScore = (settingId: string, updates: Partial<RuleSetting>) => {
    setRuleSettings(ruleSettings.map(s => {
      if (s.id === settingId) {
        const newSetting = { ...s, ...updates };
        // If Op 1 is set to '无', reset Op 2 and followings
        if (updates.scoreOperator1 === '无') {
          newSetting.scoreOperator2 = '无';
          newSetting.scoreOperand1 = '';
          newSetting.scoreOperand2 = '';
        }
        // If Op 2 is set to '无', reset Part 3
        if (updates.scoreOperator2 === '无') {
          newSetting.scoreOperand2 = '';
        }
        return newSetting;
      }
      return s;
    }));
  };

  const handleRemoveCondition = (settingId: string, conditionId: string) => {
    setRuleSettings(ruleSettings.map(s => {
      if (s.id === settingId) {
        return {
          ...s,
          conditions: s.conditions.filter(c => c.id !== conditionId)
        };
      }
      return s;
    }));
  };

  const getLogicPreview = (setting: RuleSetting) => {
    const condStr = setting.conditions.map(c => {
      if (c.operator === '不为空') return `${c.field} 不为空`;
      return `${c.field} ${c.operator.split(' ')[1]} ${c.value || '?'}`;
    }).join(' 且 ');
    
    const getVal = (type: string, custom: string) => type === '自定义数值' ? (custom || '0') : type;
    
    let formula = getVal(setting.scoreValue, setting.customScoreValue);
    if (setting.scoreOperator1 !== '无') {
      formula += ` ${setting.scoreOperator1.split(' ')[1]} ${getVal(setting.scoreOperand1, setting.customScoreOperand1)}`;
      if (setting.scoreOperator2 !== '无') {
        formula += ` ${setting.scoreOperator2.split(' ')[1]} ${getVal(setting.scoreOperand2, setting.customScoreOperand2)}`;
      }
    }
    
    let limit = '';
    if (setting.maxScore || setting.minScore) {
      limit = ` (范围: ${setting.minScore || '0'} ~ ${setting.maxScore || '无'})`;
    }

    return `当 [${condStr}] 时，结果为 ${formula}${limit}`;
  };

  const filteredRules = rules.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.application.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-gray-50 p-6 h-full overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="搜索规则..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
        <button 
          onClick={() => {
            setRuleName('');
            setRuleDescription('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus size={16} />
          <span>新增规则</span>
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 border-b border-gray-200 w-16 text-center">序号</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 border-b border-gray-200 w-48">规则名称</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 border-b border-gray-200 w-32">应用</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 border-b border-gray-200">规则说明</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 border-b border-gray-200 w-32 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRules.length > 0 ? (
                filteredRules.map((rule, index) => (
                  <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{rule.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                        {rule.application}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{rule.description}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="text-blue-600 hover:text-blue-800 transition-colors" 
                          title="编辑"
                          onClick={() => {
                            setRuleName(rule.name);
                            setRuleDescription(rule.description);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="text-red-500 hover:text-red-700 transition-colors" title="删除">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                    没有找到匹配的规则
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[950px] max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">新增评分规则</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="w-20 text-right text-sm font-medium text-gray-700">
                      <span className="text-red-500 mr-1">*</span>规则名称:
                    </label>
                    <input 
                      type="text" 
                      placeholder="请输入规则名称" 
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-20 text-right text-sm font-medium text-gray-700">
                      规则类型:
                    </label>
                    <select 
                      value={ruleType}
                      onChange={(e) => setRuleType(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="通用">通用</option>
                      <option value="特定">特定</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <label className="w-20 text-right text-sm font-medium text-gray-700 mt-2">
                    规则说明:
                  </label>
                  <textarea 
                    placeholder="请输入规则说明" 
                    value={ruleDescription}
                    onChange={(e) => setRuleDescription(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 h-[88px] resize-none" 
                  />
                </div>
              </div>

              {/* Rule Settings */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                    规则设定
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {ruleSettings.map((setting, index) => (
                    <div key={setting.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600">区块 {index + 1}</span>
                        <button 
                          onClick={() => handleRemoveRuleSetting(setting.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="p-4 space-y-6 bg-white">
                        {/* Conditions */}
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">条件</label>
                          <div className="space-y-3">
                            {setting.conditions.map((cond) => (
                              <div key={cond.id} className="flex items-center gap-3">
                                <select 
                                  value={cond.field}
                                  onChange={(e) => handleUpdateCondition(setting.id, cond.id, { field: e.target.value })}
                                  className="w-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                                <select 
                                  value={cond.operator}
                                  onChange={(e) => handleUpdateCondition(setting.id, cond.id, { operator: e.target.value })}
                                  className="w-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                                <input 
                                  type="text" 
                                  placeholder={cond.operator === '不为空' ? "无需填写" : "数值"}
                                  value={cond.operator === '不为空' ? "" : cond.value}
                                  disabled={cond.operator === '不为空'}
                                  onChange={(e) => handleUpdateCondition(setting.id, cond.id, { value: e.target.value })}
                                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400" 
                                />
                                {setting.conditions.length > 1 && (
                                  <button 
                                    onClick={() => handleRemoveCondition(setting.id, cond.id)}
                                    className="text-gray-300 hover:text-red-500"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <button 
                            onClick={() => handleAddCondition(setting.id)}
                            className="mt-3 flex items-center gap-1 text-blue-600 text-xs font-bold hover:text-blue-700"
                          >
                            <Plus size={14} /> 添加并行条件
                          </button>
                        </div>

                        {/* Score Formula */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-50">
                          <div className="lg:col-span-3">
                            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">结果</label>
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Part 1 */}
                              <div className="flex flex-col gap-1">
                                <select 
                                  value={setting.scoreValue}
                                  onChange={(e) => handleUpdateScore(setting.id, { scoreValue: e.target.value })}
                                  className="min-w-[120px] border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-blue-50/50 text-blue-700 font-medium"
                                >
                                  {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                                {setting.scoreValue === '自定义数值' && (
                                  <input 
                                    type="text" 
                                    placeholder="输入数值"
                                    value={setting.customScoreValue}
                                    onChange={(e) => handleUpdateScore(setting.id, { customScoreValue: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs"
                                  />
                                )}
                              </div>

                              {/* Op 1 */}
                              <select 
                                value={setting.scoreOperator1}
                                onChange={(e) => handleUpdateScore(setting.id, { scoreOperator1: e.target.value })}
                                className="w-20 border border-gray-300 rounded-md px-1 py-1.5 text-sm font-bold text-center"
                              >
                                {MATH_OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>

                              {/* Part 2 */}
                              {setting.scoreOperator1 !== '无' && (
                                <div className="flex flex-col gap-1">
                                  <select 
                                    value={setting.scoreOperand1}
                                    onChange={(e) => handleUpdateScore(setting.id, { scoreOperand1: e.target.value })}
                                    className="min-w-[120px] border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-blue-50/50 text-blue-700 font-medium"
                                  >
                                    <option value="">请选择</option>
                                    {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                                  </select>
                                  {setting.scoreOperand1 === '自定义数值' && (
                                    <input 
                                      type="text" 
                                      placeholder="输入数值"
                                      value={setting.customScoreOperand1}
                                      onChange={(e) => handleUpdateScore(setting.id, { customScoreOperand1: e.target.value })}
                                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs"
                                    />
                                  )}
                                </div>
                              )}

                              {/* Op 2 */}
                              {setting.scoreOperator1 !== '无' && (
                                <select 
                                  value={setting.scoreOperator2}
                                  onChange={(e) => handleUpdateScore(setting.id, { scoreOperator2: e.target.value })}
                                  className="w-20 border border-gray-300 rounded-md px-1 py-1.5 text-sm font-bold text-center"
                                >
                                  {MATH_OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                              )}

                              {/* Part 3 */}
                              {setting.scoreOperator1 !== '无' && setting.scoreOperator2 !== '无' && (
                                <div className="flex flex-col gap-1">
                                  <select 
                                    value={setting.scoreOperand2}
                                    onChange={(e) => handleUpdateScore(setting.id, { scoreOperand2: e.target.value })}
                                    className="min-w-[120px] border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-blue-50/50 text-blue-700 font-medium"
                                  >
                                    <option value="">请选择</option>
                                    {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                                  </select>
                                  {setting.scoreOperand2 === '自定义数值' && (
                                    <input 
                                      type="text" 
                                      placeholder="输入数值"
                                      value={setting.customScoreOperand2}
                                      onChange={(e) => handleUpdateScore(setting.id, { customScoreOperand2: e.target.value })}
                                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">分值边界控制</label>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-1 mb-1">
                                  <span className="text-[10px] text-gray-500 font-bold">上限</span>
                                </div>
                                <input 
                                  type="text"
                                  placeholder="无"
                                  value={setting.maxScore}
                                  onChange={(e) => handleUpdateScore(setting.id, { maxScore: e.target.value })}
                                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-1 mb-1">
                                  <span className="text-[10px] text-gray-500 font-bold">下限</span>
                                </div>
                                <input 
                                  type="text"
                                  placeholder="无"
                                  value={setting.minScore}
                                  onChange={(e) => handleUpdateScore(setting.id, { minScore: e.target.value })}
                                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Logic Preview */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                          <Info size={16} className="text-blue-500 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-xs font-bold text-blue-800 block mb-1">逻辑预览:</span>
                            <p className="text-xs text-blue-700 leading-relaxed font-medium">
                              {getLogicPreview(setting)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={handleAddRuleSetting}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-bold hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Plus size={18} className="group-hover:scale-110 transition-transform" />
                    <span>添加新的规则条件区块</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-4 px-6 py-5 border-t border-gray-100 bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-12 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm"
              >
                取消
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-12 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-bold shadow-md"
              >
                确认并保存规则
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
