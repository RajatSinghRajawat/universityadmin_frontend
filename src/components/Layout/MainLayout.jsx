import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isDarkMode={isDarkMode}
      />
      
      {/* Main Content Area */}
      <div className="content-with-sidebar min-h-screen">
        {/* Header */}
        <Header 
          onToggleSidebar={toggleSidebar}
          onToggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          sidebarOpen={sidebarOpen}
        />
        
        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-sidebar-overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
