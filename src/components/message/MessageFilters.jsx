import React from 'react';
import { FunnelIcon, XMarkIcon } from '../common/Icons';
import { useTheme } from '../../contexts/ThemeContext';

const MessageFilters = ({ filters, onFilterChange, isAdmin }) => {
  const { isDarkMode } = useTheme();
  const messageTypes = [
    { value: '', label: 'All Types' },
    { value: 'general', label: 'General' },
    { value: 'query', label: 'Query' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const readStatusOptions = [
    { value: '', label: 'All Messages' },
    { value: 'false', label: 'Unread Only' },
    { value: 'true', label: 'Read Only' }
  ];

  const limitOptions = [
    { value: '5', label: '5 per page' },
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' }
  ];

  const hasActiveFilters = filters.type || filters.read;

  const clearFilters = () => {
    onFilterChange({
      type: '',
      read: '',
      page: 1
    });
  };

  return (
    <div className={`shadow rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FunnelIcon className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Filters
          </h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={`inline-flex items-center text-sm transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Message Type Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Message Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value, page: 1 })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            {messageTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Read Status Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Read Status
          </label>
          <select
            value={filters.read}
            onChange={(e) => onFilterChange({ read: e.target.value, page: 1 })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            {readStatusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Items Per Page */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Items Per Page
          </label>
          <select
            value={filters.limit}
            onChange={(e) => onFilterChange({ limit: parseInt(e.target.value), page: 1 })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            {limitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {filters.type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  Type: {messageTypes.find(t => t.value === filters.type)?.label}
                </span>
              )}
              {filters.read && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Status: {readStatusOptions.find(s => s.value === filters.read)?.label}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageFilters;
