import React from 'react';
import { 
  ChatBubbleLeftRightIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon,
  LightBulbIcon,
  ClockIcon
} from '../common/Icons';
import { messageService } from '../../services';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../common/LoadingSpinner';

const MessageStats = ({ stats, loading }) => {
  const { isDarkMode } = useTheme();
  const getTypeIcon = (type) => {
    const iconMap = {
      urgent: ExclamationTriangleIcon,
      query: QuestionMarkCircleIcon,
      complaint: ExclamationTriangleIcon,
      feedback: LightBulbIcon,
      general: ChatBubbleLeftIcon
    };
    return iconMap[type] || ChatBubbleLeftIcon;
  };

  const getTypeColor = (type) => {
    const colorMap = {
      urgent: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
      query: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
      complaint: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20',
      feedback: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
      general: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    };
    return colorMap[type] || 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <ChatBubbleLeftRightIcon className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        <h3 className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No statistics available</h3>
        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Statistics will appear once messages are created.
        </p>
      </div>
    );
  }

  const { totalMessages, unreadMessages, readMessages, messagesByType, recentMessages } = stats;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Messages */}
        <div className={`overflow-hidden shadow rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Messages
                  </dt>
                  <dd className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {totalMessages}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Unread Messages */}
        <div className={`overflow-hidden shadow rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className={`h-8 w-8 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Unread Messages
                  </dt>
                  <dd className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {unreadMessages}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Read Messages */}
        <div className={`overflow-hidden shadow rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Read Messages
                  </dt>
                  <dd className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {readMessages}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages by Type */}
      {messagesByType && messagesByType.length > 0 && (
        <div className={`shadow rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Messages by Type
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {messagesByType.map((type) => {
                const TypeIcon = getTypeIcon(type._id);
                const typeColor = getTypeColor(type._id);
                const percentage = totalMessages > 0 ? ((type.count / totalMessages) * 100).toFixed(1) : 0;
                
                return (
                  <div key={type._id} className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {messageService.getMessageTypeDisplay(type._id)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {type.count}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Messages */}
      {recentMessages && recentMessages.length > 0 && (
        <div className={`shadow rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Messages
            </h3>
          </div>
          <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {recentMessages.map((message) => {
              const TypeIcon = getTypeIcon(message.type);
              const typeColor = getTypeColor(message.type);
              
              return (
                <div key={message._id} className={`p-6 ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {messageService.getMessageTypeDisplay(message.type)}
                        </div>
                        
                        {!message.read && (
                          <div className={`flex items-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            <div className={`h-2 w-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
                            <span className="ml-1 text-xs font-medium">Unread</span>
                          </div>
                        )}
                      </div>
                      
                      <h4 className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {message.title}
                      </h4>
                      
                      <p className={`mt-1 text-sm line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {message.message}
                      </p>
                      
                      <div className={`mt-2 flex items-center space-x-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {formatDate(message.createdAt)}
                        </div>
                        
                        {message.student_id && (
                          <div className="flex items-center">
                            <span className="font-medium">
                              {message.student_id.name}
                            </span>
                            {message.student_id.rollNumber && (
                              <span className="ml-1">
                                ({message.student_id.rollNumber})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageStats;
