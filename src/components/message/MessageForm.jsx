import React, { useState } from 'react';
import { XMarkIcon } from '../common/Icons';
// studentService import removed - not needed
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../common/LoadingSpinner';

const MessageForm = ({ onClose, onSubmit, isAdmin = true }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    // student_id removed - not needed
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const messageTypes = [
    { value: 'general', label: 'General', color: 'blue' },
    { value: 'query', label: 'Query', color: 'green' },
    { value: 'complaint', label: 'Complaint', color: 'red' },
    { value: 'feedback', label: 'Feedback', color: 'purple' },
    { value: 'urgent', label: 'Urgent', color: 'orange' }
  ];

  // Removed student fetching - not needed

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message cannot exceed 1000 characters';
    }

    if (!formData.type) {
      newErrors.type = 'Message type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await onSubmit(formData);
      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getTypeColor = (type) => {
    const typeObj = messageTypes.find(t => t.value === type);
    return typeObj ? typeObj.color : 'gray';
  };

  return (
    <div className={`fixed inset-0 overflow-y-auto h-full w-full z-50 backdrop-blur-md ${
      isDarkMode ? 'bg-black/30' : 'bg-white/30'
    }`}>
      <div className={`relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md backdrop-blur-sm ${
        isDarkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isAdmin ? 'Send Message to Student (Admin Only)' : 'Send Message to Admin'}
            </h3>
            <button
              onClick={onClose}
              className={`transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message Type */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Message Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {messageTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.type === type.value
                        ? isDarkMode
                          ? `border-${type.color}-500 bg-${type.color}-900/20`
                          : `border-${type.color}-500 bg-${type.color}-50`
                        : isDarkMode
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      formData.type === type.value 
                        ? `bg-${type.color}-500` 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
              )}
            </div>

            {/* Removed student selection - not needed */}

            {/* Title */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter message title..."
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                maxLength={200}
              />
              <div className="mt-1 flex justify-between">
                {errors.title && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
                <p className={`text-sm ml-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.title.length}/200 characters
                </p>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Enter your message..."
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.message ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                maxLength={1000}
              />
              <div className="mt-1 flex justify-between">
                {errors.message && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                )}
                <p className={`text-sm ml-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.message.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className={`border rounded-md p-4 ${
                isDarkMode 
                  ? 'bg-red-900/20 border-red-800' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex">
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      isDarkMode ? 'text-red-400' : 'text-red-800'
                    }`}>
                      Error
                    </h3>
                    <div className={`mt-2 text-sm ${
                      isDarkMode ? 'text-red-300' : 'text-red-700'
                    }`}>
                      {errors.submit}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className={`flex justify-end space-x-3 pt-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Sending...</span>
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
