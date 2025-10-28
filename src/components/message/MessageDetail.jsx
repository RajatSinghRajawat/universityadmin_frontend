import React, { useState } from 'react';
import { 
  XMarkIcon, 
  ReplyIcon, 
  TrashIcon, 
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon,
  LightBulbIcon,
  UserIcon
} from '../common/Icons';
import { messageService } from '../../services';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../common/LoadingSpinner';

const MessageDetail = ({
  message,
  onClose,
  onReply,
  onMarkAsRead,
  onDeleteMessage,
  userRole,
  userId
}) => {
  const { isDarkMode } = useTheme();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReply = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      setErrors({ reply: 'Reply message is required' });
      return;
    }

    if (replyText.length > 1000) {
      setErrors({ reply: 'Reply cannot exceed 1000 characters' });
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const result = await onReply(message._id, { reply: replyText });
      if (result.success) {
        setReplyText('');
        setShowReplyForm(false);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await onDeleteMessage(message._id);
      onClose();
    }
  };

  const handleMarkAsRead = async () => {
    if (!message.read) {
      await onMarkAsRead(message._id);
    }
  };

  const canReply = messageService.canReplyToMessage(userRole, message);
  const canDelete = messageService.canDeleteMessage(userRole, userId, message);

  const TypeIcon = getTypeIcon(message.type);
  const typeColor = getTypeColor(message.type);

  return (
    <div className={`fixed inset-0 overflow-y-auto h-full w-full z-50 backdrop-blur-md ${
      isDarkMode ? 'bg-black/30' : 'bg-white/30'
    }`}>
      <div className={`relative top-4 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md max-h-[95vh] overflow-y-auto backdrop-blur-sm ${
        isDarkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeColor}`}>
                <TypeIcon className="h-4 w-4 mr-2" />
                {messageService.getMessageTypeDisplay(message.type)}
              </div>
              {!message.read && (
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  <span className="ml-2 text-sm font-medium">Unread</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {!message.read && (
                <button
                  onClick={handleMarkAsRead}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  title="Mark as read"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              )}
              
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete message"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-6">
            {/* Title and Meta Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {message.title}
              </h1>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {message.student_id ? (
                      <span>
                        {message.student_id.name}
                        {message.student_id.rollNumber && ` (${message.student_id.rollNumber})`}
                      </span>
                    ) : (
                      <span>Admin</span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <span>Sent on {formatDate(message.createdAt)}</span>
                  </div>
                </div>
                
                {message.replies && message.replies.length > 0 && (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    <span>{message.replies.length} repl{message.replies.length === 1 ? 'y' : 'ies'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {message.message}
              </p>
            </div>

            {/* Replies */}
            {message.replies && message.replies.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Replies ({message.replies.length})
                </h3>
                
                <div className="space-y-3">
                  {message.replies.map((reply, index) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {reply.sender_role === 'admin' ? 'Admin' : 'Student'}
                          </span>
                          <span className="text-xs text-blue-700 dark:text-blue-300">
                            {formatDate(reply.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                        {reply.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Form */}
            {canReply && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                {!showReplyForm ? (
                  <button
                    onClick={() => setShowReplyForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ReplyIcon className="h-4 w-4 mr-2" />
                    Reply to Message
                  </button>
                ) : (
                  <form onSubmit={handleReply} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Reply
                      </label>
                      <textarea
                        value={replyText}
                        onChange={(e) => {
                          setReplyText(e.target.value);
                          if (errors.reply) setErrors({ ...errors, reply: '' });
                        }}
                        rows={4}
                        placeholder="Type your reply..."
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                          errors.reply ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={1000}
                      />
                      <div className="mt-1 flex justify-between">
                        {errors.reply && (
                          <p className="text-sm text-red-600 dark:text-red-400">{errors.reply}</p>
                        )}
                        <p className="text-sm text-gray-500 ml-auto">
                          {replyText.length}/1000 characters
                        </p>
                      </div>
                    </div>

                    {errors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-700">{errors.submit}</p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowReplyForm(false);
                          setReplyText('');
                          setErrors({});
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <LoadingSpinner size="small" />
                            <span className="ml-2">Sending...</span>
                          </>
                        ) : (
                          'Send Reply'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;
