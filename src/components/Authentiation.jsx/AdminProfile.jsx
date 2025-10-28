import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('View Profile');

  // Sample admin data
  const adminData = {
    name: 'admin',
    email: 'admin@gmail.com',
    phone: '8210718928',
    role: 'Admin',
    plan: 'active',
    status: 'active',
    createdAt: '9/25/2025, 12:26:06 PM',
    avatar: 'a'
  };

  const tabs = ['View Profile', 'Change Password', 'Update Profile'];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* Tabs */}
        <div className="grid grid-cols-3 gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm shadow-lg ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 shadow-md'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'View Profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left Card - Profile */}
            <div className="rounded-lg shadow-xl p-6">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="w-28 h-28 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-4xl font-bold opacity-70">{adminData.avatar}</span>
                </div>
                
                {/* Name */}
                <h2 className="text-xl font-bold mb-1">{adminData.name}</h2>
                <p className="opacity-70 text-sm mb-4">{adminData.role}</p>
                
                {/* Plan Status */}
                <div className="flex items-center justify-between w-full max-w-xs mb-6">
                  <span className="opacity-70 text-sm">Plan</span>
                  <span className="text-green-600 font-semibold text-sm">{adminData.plan}</span>
                </div>
                
                {/* Portfolio */}
                <div className="w-full text-center">
                  <h3 className="text-lg font-bold mb-2">PORTFOLIO</h3>
                  <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full shadow-md"></div>
                </div>
              </div>
            </div>

            {/* Right Card - Admin Details */}
            <div className="rounded-lg shadow-xl p-6">
              <h2 className="text-lg font-bold text-center mb-4 pb-3 border-b">
                Admin Details
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="opacity-70 text-sm">Full Name</span>
                  <span className="font-semibold text-sm">{adminData.name}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="opacity-70 text-sm">Email</span>
                  <span className="font-semibold text-sm">{adminData.email}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="opacity-70 text-sm">Phone Number</span>
                  <span className="font-semibold text-sm">{adminData.phone}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="opacity-70 text-sm">Status</span>
                  <span className="font-semibold text-green-600 text-sm">{adminData.status}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2">
                  <span className="opacity-70 text-sm">Created At</span>
                  <span className="font-semibold text-xs">{adminData.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Change Password' && (
          <div className="rounded-lg shadow-xl p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-lg"
              >
                Update Password
              </button>
            </form>
          </div>
        )}

        {activeTab === 'Update Profile' && (
          <div className="rounded-lg shadow-xl p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={adminData.name}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={adminData.email}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  defaultValue={adminData.phone}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-lg"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminProfile;

