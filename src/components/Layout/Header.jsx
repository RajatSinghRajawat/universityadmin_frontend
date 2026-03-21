import React from 'react';
import { 
  HiMenuAlt3, 
  HiSearch, 
  HiBell, 
  HiSun, 
  HiMoon,
  HiChevronDown,
  HiUser
} from 'react-icons/hi';
import { MdNotifications } from 'react-icons/md';

const Header = ({ onToggleSidebar, onToggleTheme, isDarkMode, sidebarOpen }) => {
  return (
    <header className={`${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-b shadow-sm sticky top-0 z-10`}>
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
        
        {/* Left side - Menu toggle and page title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HiMenuAlt3 className="w-6 h-6" />
          </button>
          
          <div className="hidden sm:block">
            <h2 className={`text-lg lg:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Kishangarh College
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Welcome back, Administrator
            </p>
          </div>
        </div>

        {/* Right side - Theme toggle, notifications, and user profile */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          
          {/* Search Bar */}
          <div className="hidden lg:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className={`w-48 xl:w-64 pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              />
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <HiSearch className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-yellow-400 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <HiSun className="w-6 h-6" />
            ) : (
              <HiMoon className="w-6 h-6" />
            )}
          </button>

          {/* Notifications */}
          <button className={`relative p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}>
            <MdNotifications className="w-6 h-6" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              3
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
              <div className="hidden lg:block text-left">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Administrator
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  admin@university.edu
                </p>
              </div>
              <HiChevronDown className={`w-4 h-4 hidden lg:block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
