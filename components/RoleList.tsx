
import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import { ROLES } from '../constants';
import { Role } from '../types';

interface RoleListProps {
  activeRoleId: string;
  onSelectRole: (id: string) => void;
}

const RoleList: React.FC<RoleListProps> = ({ activeRoleId, onSelectRole }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-[260px] bg-white rounded-lg shadow-sm flex flex-col h-full overflow-hidden flex-shrink-0">
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="请输入关键字进行检索"
            className="w-full bg-gray-50 text-xs py-2 pl-3 pr-8 rounded border-none focus:ring-1 focus:ring-blue-500 outline-none text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-2 top-2 text-gray-400" size={14} />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {ROLES.map((role: Role) => (
          <div
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`
              flex items-center gap-2 px-3 py-2.5 rounded mb-1 cursor-pointer text-sm transition-colors
              ${activeRoleId === role.id 
                ? 'bg-blue-50 text-blue-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            <div className={`p-1 rounded ${activeRoleId === role.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <User size={14} className={activeRoleId === role.id ? 'text-blue-600' : 'text-gray-500'} />
            </div>
            <span className="truncate">{role.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleList;
