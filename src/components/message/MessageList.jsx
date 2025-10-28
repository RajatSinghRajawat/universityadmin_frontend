import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  EyeIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon,
  LightBulbIcon
} from '../common/Icons';
import { messageService } from '../../services';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../common/LoadingSpinner';

const MessageList = ({
  messages,
  loading,
  pagination,
  onPageChange,
  onMessageSelect,
  onMarkAsRead,
  onDeleteMessage,
  userRole,
  userId
}) => {
  const [deletingId, setDeletingId] = useState(null);
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

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setDeletingId(messageId);
      try {
        await onDeleteMessage(messageId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const canDelete = (message) => {
    return messageService.canDeleteMessage(userRole, userId, message);
  };

  const canReply = (message) => {
    return messageService.canReplyToMessage(userRole, message);
  };

  if (loading && messages.length === 0) {
    return <LoadingSpinner />;
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <ChatBubbleLeftRightIcon className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        <h3 className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No messages</h3>
        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {userRole === 'admin' || userRole === 'superadmin' 
            ? 'No messages have been sent yet.' 
            : 'You haven\'t sent any messages yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Messages */}
      <div className={`shadow rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {messages.map((message) => {
            const TypeIcon = getTypeIcon(message.type);
            const typeColor = getTypeColor(message.type);
            const hasReplies = message.replies && message.replies.length > 0;
            
            return (
              <div
                key={message._id}
                className={`p-6 cursor-pointer transition-colors ${
                  !message.read 
                    ? isDarkMode 
                      ? 'bg-blue-900/20 hover:bg-blue-900/30' 
                      : 'bg-blue-50 hover:bg-blue-100'
                    : isDarkMode
                      ? 'hover:bg-gray-700/50'
                      : 'hover:bg-gray-50'
                }`}
                onClick={() => onMessageSelect(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
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
                      
                      {hasReplies && (
                        <div className={`flex items-center ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">Replied</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <h3 className={`text-lg font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {message.title}
                      </h3>
                      <p className={`mt-1 text-sm line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {message.message}
                      </p>
                    </div>
                    
                    <div className={`mt-3 flex items-center space-x-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
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
                      
                      {hasReplies && (
                        <div className="flex items-center">
                          <span>{message.replies.length} repl{message.replies.length === 1 ? 'y' : 'ies'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!message.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(message._id);
                        }}
                        className={`p-2 transition-colors ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-gray-300' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title="Mark as read"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    )}
                    
                    {canDelete(message) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message._id);
                        }}
                        disabled={deletingId === message._id}
                        className={`p-2 transition-colors disabled:opacity-50 ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-red-400' 
                            : 'text-gray-400 hover:text-red-600'
                        }`}
                        title="Delete message"
                      >
                        {deletingId === message._id ? (
                          <LoadingSpinner size="small" />
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className={`flex items-center justify-between border-t px-4 py-3 sm:px-6 rounded-lg ${
          isDarkMode 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-gray-200 bg-white'
        }`}>
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                <span className="font-medium">{pagination.totalPages}</span> ({pagination.totalMessages} total messages)
              </p>
            </div>
            
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  const isCurrentPage = page === pagination.currentPage;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        isCurrentPage
                          ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
