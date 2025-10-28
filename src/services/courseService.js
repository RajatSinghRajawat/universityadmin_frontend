import apiService from './api.js';
import { validateForm, validatePartialForm, validationSchemas } from '../utils/validationSchemas.js';

class CourseService {
  // Create a new course
  async createCourse(courseData, isFormData = false) {
    if (!isFormData) {
      const validation = validateForm(courseData, validationSchemas.course);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
      }
    }

    return apiService.post('/courses/create', courseData, isFormData);
  }

  // Get all courses
  async getAllCourses(params = {}) {
    const validParams = {};
    
    if (params.universityCode) {
      validParams.universityCode = params.universityCode;
    }
    
    if (params.department) {
      validParams.department = params.department;
    }
    
    if (params.semester) {
      validParams.semester = params.semester;
    }
    
    if (params.isActive !== undefined) {
      validParams.isActive = params.isActive;
    }

    return apiService.get('/courses', validParams);
  }

  // Get course by ID
  async getCourseById(id) {
    if (!id) {
      throw new Error('Course ID is required');
    }
    
    return apiService.get(`/courses/${id}`);
  }

  // Update course
  async updateCourse(id, updateData, isFormData = false) {
    if (!id) {
      throw new Error('Course ID is required');
    }

    if (!isFormData) {
      // Validate only provided fields
      const fieldsToValidate = Object.keys(updateData);
      const validation = validatePartialForm(updateData, validationSchemas.course, fieldsToValidate);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
      }
    }

    return apiService.put(`/courses/${id}`, updateData, isFormData);
  }

  // Delete course
  async deleteCourse(id) {
    if (!id) {
      throw new Error('Course ID is required');
    }
    
    return apiService.delete(`/courses/${id}`);
  }

  // Search courses
  async searchCourses(query, params = {}) {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    const searchParams = {
      query: query.trim(),
      ...params
    };

    return apiService.get('/courses/search', searchParams);
  }

  // Get courses by department
  async getCoursesByDepartment(department, params = {}) {
    if (!department) {
      throw new Error('Department is required');
    }

    const searchParams = {
      department,
      ...params
    };

    return apiService.get('/courses/by-department', searchParams);
  }

  // Get courses by semester
  async getCoursesBySemester(semester, params = {}) {
    if (!semester) {
      throw new Error('Semester is required');
    }

    const searchParams = {
      semester,
      ...params
    };

    return apiService.get('/courses/by-semester', searchParams);
  }

  // Get courses by instructor
  async getCoursesByInstructor(instructor, params = {}) {
    if (!instructor) {
      throw new Error('Instructor name is required');
    }

    const searchParams = {
      instructor,
      ...params
    };

    return apiService.get('/courses/by-instructor', searchParams);
  }

  // Get active courses
  async getActiveCourses(params = {}) {
    return this.getAllCourses({ ...params, isActive: true });
  }

  // Get inactive courses
  async getInactiveCourses(params = {}) {
    return this.getAllCourses({ ...params, isActive: false });
  }

  // Update course status
  async updateCourseStatus(id, isActive) {
    if (!id) {
      throw new Error('Course ID is required');
    }

    if (typeof isActive !== 'boolean') {
      throw new Error('isActive must be a boolean value');
    }

    return apiService.patch(`/courses/${id}/status`, { isActive });
  }

  // Get course statistics
  async getCourseStatistics(params = {}) {
    const validParams = {};
    
    if (params.universityCode) {
      validParams.universityCode = params.universityCode;
    }
    
    if (params.department) {
      validParams.department = params.department;
    }

    return apiService.get('/courses/statistics', validParams);
  }

  // Bulk update courses
  async bulkUpdateCourses(updates) {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Updates array is required');
    }

    return apiService.post('/courses/bulk-update', { updates });
  }

  // Export courses data
  async exportCourses(format = 'excel', params = {}) {
    const exportParams = {
      format,
      ...params
    };

    return apiService.get('/courses/export', exportParams);
  }

  // Get course prerequisites
  async getCoursePrerequisites(courseId) {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    return apiService.get(`/courses/${courseId}/prerequisites`);
  }

  // Update course prerequisites
  async updateCoursePrerequisites(courseId, prerequisites) {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    if (!Array.isArray(prerequisites)) {
      throw new Error('Prerequisites must be an array');
    }

    return apiService.put(`/courses/${courseId}/prerequisites`, { prerequisites });
  }

  // Get courses by credit hours
  async getCoursesByCredits(credits, params = {}) {
    if (!credits) {
      throw new Error('Credit hours is required');
    }

    const searchParams = {
      credits,
      ...params
    };

    return apiService.get('/courses/by-credits', searchParams);
  }
}

const courseService = new CourseService();
export default courseService;
