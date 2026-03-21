import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdSchool, 
  MdPeople, 
  MdPersonAdd, 
  MdUpload, 
  MdPerson, 
  MdPayment,
  MdAssignment,
  MdEventAvailable,
  MdCardMembership,
  MdAccountBalance,
  MdLogin,
  MdChevronRight,
  MdClose
} from 'react-icons/md';
import { 
  FaUsers, 
  FaUserGraduate, 
  FaChalkboardTeacher,
  FaFileExcel,
  FaUserCog,
  FaCalendarCheck,
  FaIdCard,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaGraduationCap,
  FaEnvelope
} from 'react-icons/fa';
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';

const Sidebar = ({ isOpen, onClose, isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('universityCode');
    localStorage.removeItem('authToken'); // Remove old token key if exists
    // Navigate to login
    navigate('/auth/login');
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <MdDashboard className="text-xl" />,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      key: 'academics',
      icon: <FaGraduationCap className="text-lg" />,
      label: 'Academics',
      path: '/academics'
    },
    {
      key: 'students',
      icon: <FaUserGraduate className="text-lg" />,
      label: 'Students',
      path: '/students'
    },
    {
      key: 'employees',
      icon: <FaChalkboardTeacher className="text-lg" />,
      label: 'Employees',
      path: '/employees'
    },
    {
      key: 'attendance',
      icon: <FaCalendarCheck className="text-lg" />,
      label: 'Attendance',
      path: '/attendance'
    },
    {
      key: 'admit-cards',
      icon: <FaIdCard className="text-lg" />,
      label: 'Admit Cards',
      path: '/admit-cards/all'
    },
    {
      key: 'accounts',
      icon: <FaMoneyBillWave className="text-lg" />,
      label: 'Accounts',
      path: '/accounts'
    },
    {
      key: 'message',
      icon: <MdAssignment className="text-lg" />,
      label: 'Messages',
      path: '/message'
    },
    {
      key: 'settings',
      icon: <FaUserCog className="text-lg" />,
      label: 'Settings',
      path: '/admin/profile'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const hasActiveSubmenu = (submenu) => {
    return submenu?.some(item => isActive(item.path));
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-xl border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        
        {/* Logo Area */}
        <div className={`flex items-center justify-between h-16 px-4 border-b flex-shrink-0 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div className="hidden lg:block">
              <h1 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Kishangarh College
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                University Management
              </p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className={`lg:hidden p-1 rounded-md transition-colors ${
              isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 px-3 flex-1 overflow-y-auto">
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.key}>
                {/* Main menu item */}
                <div
                  className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive(item.path) || hasActiveSubmenu(item.submenu)
                      ? isDarkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-100 text-blue-700'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    if (item.submenu) {
                      toggleSubmenu(item.key);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  
                  {item.submenu && (
                    <span className={`transform transition-transform duration-200 flex-shrink-0 ${
                      expandedMenus[item.key] ? 'rotate-90' : ''
                    }`}>
                      <IoMdArrowDropright className="text-lg" />
                    </span>
                  )}
                </div>

                {/* Submenu */}
                {item.submenu && (
                  <ul className={`mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-200 ${
                    expandedMenus[item.key] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {item.submenu.map((subItem) => (
                      <li key={subItem.key}>
                        <div
                          className={`flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                            isActive(subItem.path)
                              ? isDarkMode
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-700'
                              : isDarkMode
                                ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          onClick={() => handleNavigation(subItem.path)}
                        >
                          <span className="flex-shrink-0 mr-3">
                            {subItem.icon || <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>}
                          </span>
                          <span className="truncate">{subItem.label}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section - Logout */}
        <div className={`border-t flex-shrink-0 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-3`}>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              isDarkMode
                ? 'text-red-400 hover:bg-red-900/30'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

    </>
  );
};

export default Sidebar;
