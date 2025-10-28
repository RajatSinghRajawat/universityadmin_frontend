import apiService from './api.js';
import { validateForm, validatePartialForm, validationSchemas } from '../utils/validationSchemas.js';

class AttendanceService {
  // Create attendance record
  async createAttendance(attendanceData) {
    const validation = validateForm(attendanceData, validationSchemas.attendance);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    return apiService.post('/attendance/create', attendanceData);
  }

  // Get all attendance records
  async getAllAttendance(params = {}) {
    const validParams = {};
    
    if (params.enrollment_id) {
      validParams.enrollment_id = params.enrollment_id;
    }
    
    if (params.status) {
      validParams.status = params.status;
    }
    
    if (params.universityCode) {
      validParams.universityCode = params.universityCode;
    }
    
    if (params.startDate) {
      validParams.startDate = params.startDate;
    }
    
    if (params.endDate) {
      validParams.endDate = params.endDate;
    }
    
    if (params.page) {
      validParams.page = params.page;
    }
    
    if (params.limit) {
      validParams.limit = params.limit;
    }

    return apiService.get('/attendance', validParams);
  }

  // Get attendance by ID
  async getAttendanceById(id) {
    if (!id) {
      throw new Error('Attendance ID is required');
    }
    
    return apiService.get(`/attendance/${id}`);
  }

  // Update attendance
  async updateAttendance(id, updateData) {
    if (!id) {
      throw new Error('Attendance ID is required');
    }

    // Validate only provided fields
    const fieldsToValidate = Object.keys(updateData);
    const validation = validatePartialForm(updateData, validationSchemas.attendance, fieldsToValidate);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    return apiService.put(`/attendance/${id}`, updateData);
  }

  // Delete attendance
  async deleteAttendance(id) {
    if (!id) {
      throw new Error('Attendance ID is required');
    }
    
    return apiService.delete(`/attendance/${id}`);
  }

  // Get attendance by student (enrollment ID)
  async getAttendanceByStudent(enrollmentId, params = {}) {
    if (!enrollmentId) {
      throw new Error('Enrollment ID is required');
    }

    const validParams = {};
    
    if (params.status) {
      validParams.status = params.status;
    }
    
    if (params.startDate) {
      validParams.startDate = params.startDate;
    }
    
    if (params.endDate) {
      validParams.endDate = params.endDate;
    }
    
    if (params.page) {
      validParams.page = params.page;
    }
    
    if (params.limit) {
      validParams.limit = params.limit;
    }

    return apiService.get(`/attendance/student/${enrollmentId}`, validParams);
  }

  // Get attendance statistics
  async getAttendanceStatistics(params = {}) {
    const validParams = {};
    
    if (params.universityCode) {
      validParams.universityCode = params.universityCode;
    }
    
    if (params.startDate) {
      validParams.startDate = params.startDate;
    }
    
    if (params.endDate) {
      validParams.endDate = params.endDate;
    }

    return apiService.get('/attendance/statistics', validParams);
  }

  // Get student attendance summary
  async getStudentAttendanceSummary(enrollmentId, params = {}) {
    if (!enrollmentId) {
      throw new Error('Enrollment ID is required');
    }

    const validParams = {};
    
    if (params.startDate) {
      validParams.startDate = params.startDate;
    }
    
    if (params.endDate) {
      validParams.endDate = params.endDate;
    }

    return apiService.get(`/attendance/student/${enrollmentId}/summary`, validParams);
  }

  // Bulk mark attendance
  async bulkMarkAttendance(attendanceRecords, attendanceDate) {
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      throw new Error('Attendance records array is required');
    }

    if (!attendanceDate) {
      throw new Error('Attendance date is required');
    }

    // Validate attendance date
    if (isNaN(Date.parse(attendanceDate))) {
      throw new Error('Valid attendance date is required');
    }

    // Validate each attendance record
    for (const record of attendanceRecords) {
      if (!record.enrollment_id) {
        throw new Error('Enrollment ID is required for all records');
      }
      if (!record.status || !['present', 'absent', 'half day'].includes(record.status)) {
        throw new Error('Valid status is required for all records');
      }
    }

    return apiService.post('/attendance/bulk', {
      attendanceRecords,
      attendance_date: attendanceDate
    });
  }

  // Get attendance by date range
  async getAttendanceByDateRange(startDate, endDate, params = {}) {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      throw new Error('Valid dates are required');
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('Start date cannot be after end date');
    }

    const searchParams = {
      startDate,
      endDate,
      ...params
    };

    return apiService.get('/attendance/date-range', searchParams);
  }

  // Get attendance by status
  async getAttendanceByStatus(status, params = {}) {
    if (!status || !['present', 'absent', 'half day'].includes(status)) {
      throw new Error('Valid attendance status is required');
    }

    const searchParams = {
      status,
      ...params
    };

    return apiService.get('/attendance/by-status', searchParams);
  }

  // Get attendance by university
  async getAttendanceByUniversity(universityCode, params = {}) {
    if (!universityCode) {
      throw new Error('University code is required');
    }

    const searchParams = {
      universityCode,
      ...params
    };

    return apiService.get('/attendance/by-university', searchParams);
  }

  // Get monthly attendance report
  async getMonthlyAttendanceReport(year, month, params = {}) {
    if (!year || !month) {
      throw new Error('Year and month are required');
    }

    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12');
    }

    const searchParams = {
      year,
      month,
      ...params
    };

    return apiService.get('/attendance/monthly-report', searchParams);
  }

  // Get daily attendance report
  async getDailyAttendanceReport(date, params = {}) {
    if (!date) {
      throw new Error('Date is required');
    }

    if (isNaN(Date.parse(date))) {
      throw new Error('Valid date is required');
    }

    const searchParams = {
      date,
      ...params
    };

    return apiService.get('/attendance/daily-report', searchParams);
  }

  // Mark student present
  async markPresent(enrollmentId, attendanceDate, inTime = null, outTime = null) {
    if (!enrollmentId) {
      throw new Error('Enrollment ID is required');
    }

    if (!attendanceDate) {
      throw new Error('Attendance date is required');
    }

    const attendanceData = {
      enrollment_id: enrollmentId,
      status: 'present',
      attendance_date: attendanceDate,
      in_time: inTime,
      out_time: outTime
    };

    return this.createAttendance(attendanceData);
  }

  // Mark student absent
  async markAbsent(enrollmentId, attendanceDate) {
    if (!enrollmentId) {
      throw new Error('Enrollment ID is required');
    }

    if (!attendanceDate) {
      throw new Error('Attendance date is required');
    }

    const attendanceData = {
      enrollment_id: enrollmentId,
      status: 'absent',
      attendance_date: attendanceDate
    };

    return this.createAttendance(attendanceData);
  }

  // Mark student half day
  async markHalfDay(enrollmentId, attendanceDate, inTime = null, outTime = null) {
    if (!enrollmentId) {
      throw new Error('Enrollment ID is required');
    }

    if (!attendanceDate) {
      throw new Error('Attendance date is required');
    }

    const attendanceData = {
      enrollment_id: enrollmentId,
      status: 'half day',
      attendance_date: attendanceDate,
      in_time: inTime,
      out_time: outTime
    };

    return this.createAttendance(attendanceData);
  }

  // Export attendance data
  async exportAttendance(format = 'excel', params = {}) {
    const exportParams = {
      format,
      ...params
    };

    return apiService.get('/attendance/export', exportParams);
  }

  // Get attendance trends
  async getAttendanceTrends(params = {}) {
    return apiService.get('/attendance/trends', params);
  }

  // Get low attendance students
  async getLowAttendanceStudents(threshold = 75, params = {}) {
    if (threshold < 0 || threshold > 100) {
      throw new Error('Threshold must be between 0 and 100');
    }

    const searchParams = {
      threshold,
      ...params
    };

    return apiService.get('/attendance/low-attendance', searchParams);
  }
}

const attendanceService = new AttendanceService();
export default attendanceService;
