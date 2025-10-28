import apiService from './api.js';
import { validateForm, validatePartialForm, validationSchemas } from '../utils/validationSchemas.js';

class SessionService {
  // Create a new session
  async createSession(sessionData) {
    const validation = validateForm(sessionData, validationSchemas.session);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    return apiService.post('/sessions/create', sessionData);
  }

  // Get all sessions
  async getAllSessions(params = {}) {
    const validParams = {};
    
    if (params.is_default !== undefined) {
      validParams.is_default = params.is_default;
    }
    
    if (params.page) {
      validParams.page = params.page;
    }
    
    if (params.limit) {
      validParams.limit = params.limit;
    }

    return apiService.get('/sessions/all', validParams);
  }

  // Get session by ID
  async getSessionById(id) {
    if (!id) {
      throw new Error('Session ID is required');
    }
    
    return apiService.get(`/sessions/get/${id}`);
  }

  // Update session
  async updateSession(id, updateData) {
    if (!id) {
      throw new Error('Session ID is required');
    }

    // Validate only provided fields
    const fieldsToValidate = Object.keys(updateData);
    const validation = validatePartialForm(updateData, validationSchemas.session, fieldsToValidate);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    return apiService.put(`/sessions/update/${id}`, updateData);
  }

  // Delete session
  async deleteSession(id) {
    if (!id) {
      throw new Error('Session ID is required');
    }
    
    return apiService.delete(`/sessions/delete/${id}`);
  }

  // Get default session
  async getDefaultSession() {
    return apiService.get('/sessions/default');
  }

  // Set default session
  async setDefaultSession(id) {
    if (!id) {
      throw new Error('Session ID is required');
    }
    
    return apiService.put(`/sessions/set-default/${id}`);
  }

  // Get session by year
  async getSessionByYear(year) {
    if (!year) {
      throw new Error('Session year is required');
    }

    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 5) {
      throw new Error(`Session year must be between 2000 and ${currentYear + 5}`);
    }
    
    return apiService.get(`/sessions/year/${year}`);
  }

  // Get recent sessions
  async getRecentSessions(limit = 5) {
    if (limit < 1 || limit > 50) {
      throw new Error('Limit must be between 1 and 50');
    }

    return apiService.get('/sessions/recent', { limit });
  }

  // Get session statistics
  async getSessionStatistics() {
    return apiService.get('/sessions/statistics');
  }

  // Get sessions by year range
  async getSessionsByYearRange(startYear, endYear) {
    if (!startYear || !endYear) {
      throw new Error('Start year and end year are required');
    }

    if (startYear > endYear) {
      throw new Error('Start year cannot be greater than end year');
    }

    const currentYear = new Date().getFullYear();
    if (startYear < 2000 || endYear > currentYear + 5) {
      throw new Error(`Year range must be between 2000 and ${currentYear + 5}`);
    }

    return apiService.get('/sessions/year-range', { startYear, endYear });
  }

  // Get active sessions (non-default sessions)
  async getActiveSessions(params = {}) {
    return this.getAllSessions({ ...params, is_default: false });
  }

  // Archive session (set as inactive)
  async archiveSession(id) {
    if (!id) {
      throw new Error('Session ID is required');
    }
    
    return apiService.patch(`/sessions/${id}/archive`);
  }

  // Activate session
  async activateSession(id) {
    if (!id) {
      throw new Error('Session ID is required');
    }
    
    return apiService.patch(`/sessions/${id}/activate`);
  }

  // Get current academic year
  async getCurrentAcademicYear() {
    const defaultSession = await this.getDefaultSession();
    return defaultSession?.data?.session_year;
  }

  // Set current academic year
  async setCurrentAcademicYear(year) {
    if (!year) {
      throw new Error('Academic year is required');
    }

    // First, get all sessions for this year
    const sessions = await this.getSessionByYear(year);
    
    if (!sessions || sessions.length === 0) {
      throw new Error(`No session found for year ${year}`);
    }

    // Set the first session as default
    const sessionId = sessions.data._id;
    return this.setDefaultSession(sessionId);
  }

  // Get session summary
  async getSessionSummary(id) {
    if (!id) {
      throw new Error('Session ID is required');
    }
    
    return apiService.get(`/sessions/${id}/summary`);
  }

  // Clone session
  async cloneSession(id, newYear) {
    if (!id) {
      throw new Error('Source session ID is required');
    }

    if (!newYear) {
      throw new Error('New session year is required');
    }

    // Get the source session
    const sourceSession = await this.getSessionById(id);
    
    // Create new session with updated year
    const newSessionData = {
      session_year: newYear,
      is_default: false,
      description: `${sourceSession.data.description || ''} (Cloned from ${sourceSession.data.session_year})`
    };

    return this.createSession(newSessionData);
  }

  // Bulk operations
  async bulkCreateSessions(sessionsData) {
    if (!Array.isArray(sessionsData) || sessionsData.length === 0) {
      throw new Error('Sessions data array is required');
    }

    // Validate each session
    for (const session of sessionsData) {
      const validation = validateForm(session, validationSchemas.session);
      if (!validation.isValid) {
        throw new Error(`Validation failed for session ${session.session_year}: ${Object.values(validation.errors).join(', ')}`);
      }
    }

    return apiService.post('/sessions/bulk-create', { sessions: sessionsData });
  }

  // Export sessions
  async exportSessions(format = 'excel', params = {}) {
    const exportParams = {
      format,
      ...params
    };

    return apiService.get('/sessions/export', exportParams);
  }
}

const sessionService = new SessionService();
export default sessionService;
