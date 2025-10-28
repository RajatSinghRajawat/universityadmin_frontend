import apiService from './api';

class MessageService {
  // Create a new message
  async createMessage(messageData) {
    try {
      const response = await apiService.post('/messages/create', messageData);
      return response;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  // Get all messages (admin view)
  async getAllMessages(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      if (params.read !== undefined) queryParams.append('read', params.read);
      if (params.student_id) queryParams.append('student_id', params.student_id);
      if (params.universityCode) queryParams.append('universityCode', params.universityCode);

      const queryString = queryParams.toString();
      const endpoint = `/messages/all${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching all messages:', error);
      throw error;
    }
  }

  // Get messages for a specific student (admin view)
  async getStudentMessages(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      if (params.read !== undefined) queryParams.append('read', params.read);
      if (params.student_id) queryParams.append('student_id', params.student_id);
      if (params.universityCode) queryParams.append('universityCode', params.universityCode);

      const queryString = queryParams.toString();
      const endpoint = `/messages/student${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching student messages:', error);
      throw error;
    }
  }

  // Get current user's messages (student view)
  async getMyMessages(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      if (params.read !== undefined) queryParams.append('read', params.read);
      if (params.student_id) queryParams.append('student_id', params.student_id);
      if (params.universityCode) queryParams.append('universityCode', params.universityCode);

      const queryString = queryParams.toString();
      const endpoint = `/messages/student${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching my messages:', error);
      throw error;
    }
  }

  // Get a specific message by ID
  async getMessageById(messageId) {
    try {
      const response = await apiService.get(`/messages/${messageId}`);
      return response;
    } catch (error) {
      console.error('Error fetching message by ID:', error);
      throw error;
    }
  }

  // Reply to a message (admin only)
  async replyToMessage(messageId, replyData) {
    try {
      const response = await apiService.post(`/messages/${messageId}/reply`, replyData);
      return response;
    } catch (error) {
      console.error('Error replying to message:', error);
      throw error;
    }
  }

  // Mark message as read
  async markAsRead(messageId) {
    try {
      const response = await apiService.put(`/messages/${messageId}/read`);
      return response;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  // Update a message
  async updateMessage(messageId, updateData) {
    try {
      const response = await apiService.put(`/messages/${messageId}`, updateData);
      return response;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(messageId) {
    try {
      const response = await apiService.delete(`/messages/${messageId}`);
      return response;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Get message statistics (admin only)
  async getMessageStats(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.universityCode) queryParams.append('universityCode', params.universityCode);

      const queryString = queryParams.toString();
      const endpoint = `/messages/stats${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw error;
    }
  }

  // Helper method to format message data for display
  formatMessageForDisplay(message) {
    return {
      id: message._id,
      title: message.title,
      message: message.message,
      type: message.type,
      read: message.read,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      student: message.student_id ? {
        id: message.student_id._id,
        name: message.student_id.name,
        email: message.student_id.email,
        rollNumber: message.student_id.rollNumber
      } : null,
      replies: message.replies ? message.replies.map(reply => ({
        id: reply._id,
        message: reply.message,
        senderId: reply.sender_id,
        senderRole: reply.sender_role,
        senderName: reply.sender_name,
        timestamp: reply.timestamp
      })) : [],
      senderRole: message.sender_role,
      senderName: message.sender_name,
      universityCode: message.universityCode
    };
  }

  // Helper method to get message type display name
  getMessageTypeDisplay(type) {
    const typeMap = {
      general: 'General',
      complaint: 'Complaint',
      query: 'Query',
      feedback: 'Feedback',
      urgent: 'Urgent'
    };
    return typeMap[type] || type;
  }

  // Helper method to get message type color for UI
  getMessageTypeColor(type) {
    const colorMap = {
      general: 'blue',
      complaint: 'red',
      query: 'green',
      feedback: 'purple',
      urgent: 'orange'
    };
    return colorMap[type] || 'gray';
  }

  // Helper method to check if user can reply to message
  canReplyToMessage(userRole, message) {
    return userRole === 'admin' || userRole === 'superadmin';
  }

  // Helper method to check if user can edit message
  canEditMessage(userRole, userId, message) {
    if (userRole === 'superadmin') return true;
    if (userRole === 'admin') return true;
    if (userRole === 'student') return message.sender_id === userId;
    return false;
  }

  // Helper method to check if user can delete message
  canDeleteMessage(userRole, userId, message) {
    if (userRole === 'superadmin') return true;
    if (userRole === 'admin') return true;
    if (userRole === 'student') return message.sender_id === userId;
    return false;
  }
}

export default new MessageService();
