import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboards = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="opacity-70 mt-1">Analytics and system statistics</p>
        </div>
        
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/students')}
            className="rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all text-left"
          >
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Students</h3>
            <p className="text-sm opacity-70">Manage student records and data</p>
          </button>
          
          <button
            onClick={() => navigate('/employees')}
            className="rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all text-left"
          >
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Employees</h3>
            <p className="text-sm opacity-70">Manage staff and faculty</p>
          </button>
          
          <button
            onClick={() => navigate('/accounts')}
            className="rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-all text-left"
          >
            <h3 className="text-lg font-semibold text-green-600 mb-2">Accounts</h3>
            <p className="text-sm opacity-70">Financial management</p>
          </button>
          
          <button
            onClick={() => navigate('/attendance')}
            className="rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-all text-left"
          >
            <h3 className="text-lg font-semibold text-yellow-600 mb-2">Attendance</h3>
            <p className="text-sm opacity-70">Mark and track attendance</p>
          </button>
          
          <button
            onClick={() => navigate('/admit-cards/all')}
            className="rounded-lg shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-all text-left"
          >
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Admit Cards</h3>
            <p className="text-sm opacity-70">Generate admit cards</p>
          </button>
          
          <button
            onClick={() => navigate('/admin/profile')}
            className="rounded-lg shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-all text-left"
          >
            <h3 className="text-lg font-semibold text-red-600 mb-2">Settings</h3>
            <p className="text-sm opacity-70">Admin profile and settings</p>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboards;
