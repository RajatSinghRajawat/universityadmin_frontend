import React, { useState } from 'react';
import Sidebar from './Sidebar';

const SidebarTest = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Test Controls */}
        <div className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-bold mb-4">Sidebar Test Controls</h2>
          <div className="space-y-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Toggle Sidebar ({isOpen ? 'Open' : 'Closed'})
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Toggle Theme ({isDarkMode ? 'Dark' : 'Light'})
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          isDarkMode={isDarkMode}
        />

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">Sidebar Test Page</h1>
          <p className="text-gray-600">
            This is a test page to verify the sidebar functionality.
          </p>
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-white rounded shadow">
              <h3 className="font-semibold">Sidebar Status:</h3>
              <p>Open: {isOpen ? 'Yes' : 'No'}</p>
              <p>Dark Mode: {isDarkMode ? 'Yes' : 'No'}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h3 className="font-semibold">Instructions:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Click "Toggle Sidebar" to open/close the sidebar</li>
                <li>Click "Toggle Theme" to switch between light/dark mode</li>
                <li>Try clicking on sidebar menu items</li>
                <li>Check browser console for any errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarTest;
