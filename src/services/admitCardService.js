import apiService from './api.js';
import { validateForm, validatePartialForm, validationSchemas } from '../utils/validationSchemas.js';

class AdmitCardService {
  // Create admit card
  async createAdmitCard(admitCardData) {
    const validation = validateForm(admitCardData, validationSchemas.admitCard);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    return apiService.post('/admitcards/create', admitCardData);
  }
 

  // Get all admit cards
  async getAllAdmitCards(params = {}) {
    return apiService.get('/admitcards', params);
  }





  // Get admit card by ID
  async getAdmitCardById(id) {
    if (!id) {
      throw new Error('Admit card ID is required');
    }
    
    return apiService.get(`/admitcards/${id}`);
  }

  // Update admit card
  async updateAdmitCard(id, updateData) {
    if (!id) {
      throw new Error('Admit card ID is required');
    }

    const fieldsToValidate = Object.keys(updateData);
    const validation = validatePartialForm(updateData, validationSchemas.admitCard, fieldsToValidate);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    return apiService.put(`/admitcards/${id}`, updateData);
  }

  // Delete admit card
  async deleteAdmitCard(id) {
    if (!id) {
      throw new Error('Admit card ID is required');
    }
    
    return apiService.delete(`/admitcards/${id}`);
  }

  // Get admit cards by student
  async getAdmitCardsByStudent(studentId, params = {}) {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    return apiService.get(`/admitcards/student/${studentId}`, params);
  }

  // Get admit cards by course
  async getAdmitCardsByCourse(courseId, params = {}) {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    return apiService.get(`/admitcards/course/${courseId}`, params);
  }

  // Search admit cards
  async searchAdmitCards(query, params = {}) {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    const searchParams = {
      query: query.trim(),
      ...params
    };

    return apiService.get('/admitcards/search', searchParams);
  }

  // Get upcoming exams
  async getUpcomingExams(params = {}) {
    return apiService.get('/admitcards/upcoming', params);
  }

  // Get admit cards by exam type
  async getAdmitCardsByExamType(examType, params = {}) {
    if (!examType) {
      throw new Error('Exam type is required');
    }

    const searchParams = {
      exam_type: examType,
      ...params
    };

    return apiService.get('/admitcards/by-exam-type', searchParams);
  }

  // Get admit cards by semester
  async getAdmitCardsBySemester(semester, params = {}) {
    if (!semester) {
      throw new Error('Semester is required');
    }

    const searchParams = {
      semester,
      ...params
    };

    return apiService.get('/admitcards/by-semester', searchParams);
  }

  // Get admit cards by exam date range
  async getAdmitCardsByDateRange(startDate, endDate, params = {}) {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    const searchParams = {
      startDate,
      endDate,
      ...params
    };

    return apiService.get('/admitcards/date-range', searchParams);
  }

  // Bulk create admit cards
  async bulkCreateAdmitCards(admitCardsData) {
    if (!Array.isArray(admitCardsData) || admitCardsData.length === 0) {
      throw new Error('Admit cards data array is required');
    }

    return apiService.post('/admitcards/bulk-create', { admitCards: admitCardsData });
  }

  // Export admit cards
  async exportAdmitCards(format = 'excel', params = {}) {
    const exportParams = {
      format,
      ...params
    };

    return apiService.get('/admitcards/export', exportParams);
  }

  // Print admit card
  async printAdmitCard(id) {
    if (!id) {
      throw new Error('Admit card ID is required');
    }
    
    return apiService.get(`/admitcards/${id}/print`);
  }

  // Get exam statistics
  async getExamStatistics(params = {}) {
    return apiService.get('/admitcards/statistics', params);
  }
}

const admitCardService = new AdmitCardService();
export default admitCardService;
