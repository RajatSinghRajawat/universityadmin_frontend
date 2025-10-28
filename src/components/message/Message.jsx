import React, { useState, useEffect } from 'react';
import { messageService } from '../../services';
import { getCurrentUser, isAdmin } from '../../utils/mockAuth';
import { useTheme } from '../../contexts/ThemeContext';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import MessageStats from './MessageStats';
import MessageFilters from './MessageFilters';
import MessageDetail from './MessageDetail';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  PlusIcon, 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  FunnelIcon
} from '../common/Icons';

const Message = () => {
  // Get current user from mock auth
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();
  const { isDarkMode } = useTheme();
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: '',
    read: '',
    student_id: ''
  });
  const [pagination, setPagination] = useState({});
  const [activeTab, setActiveTab] = useState('messages');

  // Fetch messages based on user role
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (userIsAdmin) {
        response = await messageService.getAllMessages(filters);
      } else {
        response = await messageService.getMyMessages(filters);
      }
      
      if (response.success) {
        setMessages(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to fetch messages');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching messages');
    } finally {
      setLoading(false);
    }
  };

  // Fetch message statistics (admin only)
  const fetchStats = async () => {
    if (userIsAdmin) {
      try {
        const response = await messageService.getMessageStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  const handleCreateMessage = async (messageData) => {
    try {
      const response = await messageService.createMessage(messageData);
      if (response.success) {
        setShowForm(false);
        fetchMessages();
        // Show success message
        return { success: true, message: 'Message created successfully' };
      } else {
        return { success: false, message: response.message || 'Failed to create message' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'An error occurred while creating message' };
    }
  };

  const handleReply = async (messageId, replyData) => {
    try {
      const response = await messageService.replyToMessage(messageId, replyData);
      if (response.success) {
        fetchMessages();
        setSelectedMessage(null);
        return { success: true, message: 'Reply sent successfully' };
      } else {
        return { success: false, message: response.message || 'Failed to send reply' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'An error occurred while sending reply' };
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await messageService.markAsRead(messageId);
      if (response.success) {
        fetchMessages();
        return { success: true, message: 'Message marked as read' };
      } else {
        return { success: false, message: response.message || 'Failed to mark message as read' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'An error occurred' };
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await messageService.deleteMessage(messageId);
      if (response.success) {
        fetchMessages();
        return { success: true, message: 'Message deleted successfully' };
      } else {
        return { success: false, message: response.message || 'Failed to delete message' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'An error occurred while deleting message' };
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const isAdminUser = userIsAdmin;

  const tabs = [
    { id: 'messages', name: 'Messages', icon: ChatBubbleLeftRightIcon },
    ...(isAdminUser ? [{ id: 'stats', name: 'Statistics', icon: ChartBarIcon }] : []),
  ];

  if (loading && messages.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`p-6 max-w-7xl mx-auto ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Message Center
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isAdminUser 
                ? 'Manage all messages and communicate with students'
                : 'View and send messages to administration'
              }
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Message
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? isDarkMode
                        ? 'border-blue-400 text-blue-400'
                        : 'border-blue-500 text-blue-600'
                      : isDarkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          {/* Filters */}
          <MessageFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            isAdmin={isAdminUser}
          />

          {/* Messages List */}
          {error && (
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
                    Error loading messages
                  </h3>
                  <div className={`mt-2 text-sm ${
                    isDarkMode ? 'text-red-300' : 'text-red-700'
                  }`}>
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <MessageList
            messages={messages}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onMessageSelect={setSelectedMessage}
            onMarkAsRead={handleMarkAsRead}
            onDeleteMessage={handleDeleteMessage}
            userRole={user?.role}
            userId={user?.id}
          />
        </div>
      )}

      {activeTab === 'stats' && isAdminUser && (
        <MessageStats stats={stats} loading={loading} />
      )}

      {/* Message Form Modal */}
      {showForm && (
        <MessageForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateMessage}
          isAdmin={isAdminUser}
        />
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetail
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onReply={handleReply}
          onMarkAsRead={handleMarkAsRead}
          onDeleteMessage={handleDeleteMessage}
          userRole={user?.role}
          userId={user?.id}
        />
      )}
    </div>
  );
};

export default Message;