import apiService from './api.js';
import { validateForm, validatePartialForm, validationSchemas } from '../utils/validationSchemas.js';

class StudentService {
  // Create a new student
  async createStudent(studentData, isFormData = false) {
    if (!isFormData) {
      const validation = validateForm(studentData, validationSchemas.student);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
      }
    }

    return apiService.post('/students/create', studentData, isFormData);
  }

  // Get all students
  async getAllStudents(params = {}) {
    const validParams = {};
    
    if (params.universityCode) {
      validParams.universityCode = params.universityCode;
    }
    
    if (params.department) {
      validParams.department = params.department;
    }
    
    if (params.year) {
      validParams.year = params.year;
    }
    
    if (params.status) {
      validParams.status = params.status;
    }
    
    if (params.page) {
      validParams.page = params.page;
    }
    
    if (params.limit) {
      validParams.limit = params.limit;
    }

    return apiService.get('/students', validParams);
  }

  // Get student by ID
  async getStudentById(id) {
    if (!id) {
      throw new Error('Student ID is required');
    }
    
    return apiService.get(`/students/${id}`);
  }

  // Update student
  async updateStudent(id, updateData, isFormData = false) {
    if (!id) {
      throw new Error('Student ID is required');
    }

    if (!isFormData) {
      // Validate only provided fields
      const fieldsToValidate = Object.keys(updateData);
      const validation = validatePartialForm(updateData, validationSchemas.student, fieldsToValidate);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
      }
    }

    return apiService.put(`/students/${id}`, updateData, isFormData);
  }

  // Delete student (soft delete - set status to deactive)
  async deleteStudent(id) {
    if (!id) {
      throw new Error('Student ID is required');
    }
    
    return apiService.delete(`/students/${id}`);
  }

  // Reactivate student
  async reactivateStudent(id) {
    if (!id) {
      throw new Error('Student ID is required');
    }
    
    return apiService.patch(`/students/${id}/reactivate`);
  }

  // Get ex-students (deactivated students)
  async getExStudents(params = {}) {
    const validParams = {};
    
    if (params.universityCode) {
      validParams.universityCode = params.universityCode;
    }
    
    if (params.department) {
      validParams.department = params.department;
    }
    
    if (params.page) {
      validParams.page = params.page;
    }
    
    if (params.limit) {
      validParams.limit = params.limit;
    }

    return apiService.get('/students/ex-students', validParams);
  }

  // Search students
  async searchStudents(query, params = {}) {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    const searchParams = {
      query: query.trim(),
      ...params
    };

    return apiService.get('/students/search', searchParams);
  }

  // Upload students from Excel
  async uploadStudentsFromExcel(excelFile) {
    if (!excelFile) {
      throw new Error('Excel file is required');
    }

    const formData = new FormData();
    formData.append('file', excelFile);

    return apiService.post('/students/upload-excel', formData, true);
  }

  // Get student statistics
  async getStudentStatistics(params = {}) {
    const validParams = {};
    
    if (params.universityCode) {
      validParams.universityCode = params.universityCode;
    }
    
    if (params.department) {
      validParams.department = params.department;
    }
    
    if (params.year) {
      validParams.year = params.year;
    }

    return apiService.get('/students/statistics', validParams);
  }

  // Get students by department
  async getStudentsByDepartment(department, params = {}) {
    if (!department) {
      throw new Error('Department is required');
    }

    const searchParams = {
      department,
      ...params
    };

    return apiService.get('/students/by-department', searchParams);
  }

  // Get students by year
  async getStudentsByYear(year, params = {}) {
    if (!year) {
      throw new Error('Academic year is required');
    }

    const searchParams = {
      year,
      ...params
    };

    return apiService.get('/students/by-year', searchParams);
  }

  // Get student payment history
  async getStudentPaymentHistory(studentId, params = {}) {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    return apiService.get(`/students/${studentId}/payments`, params);
  }

  // Get student attendance summary
  async getStudentAttendanceSummary(enrollmentId, params = {}) {
    if (!enrollmentId) {
      throw new Error('Enrollment ID is required');
    }

    return apiService.get(`/students/${enrollmentId}/attendance-summary`, params);
  }

  // Get student admit cards
  async getStudentAdmitCards(studentId, params = {}) {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    return apiService.get(`/students/${studentId}/admit-cards`, params);
  }

  // Bulk update students
  async bulkUpdateStudents(updates) {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Updates array is required');
    }

    return apiService.post('/students/bulk-update', { updates });
  }

  // Export students data
  async exportStudents(format = 'excel', params = {}) {
    const exportParams = {
      format,
      ...params
    };

    return apiService.get('/students/export', exportParams);
  }
}

const studentService = new StudentService();
export default studentService;
