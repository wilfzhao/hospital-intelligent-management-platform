import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RoleList from './components/RoleList';
import PermissionTable from './components/PermissionTable';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 flex gap-4 overflow-hidden">
          <RoleList />
          <PermissionTable />
        </main>
      </div>
    </div>
  );
};

export default App;