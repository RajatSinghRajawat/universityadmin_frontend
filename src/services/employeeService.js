import apiService from './api.js';
import { validateForm, validatePartialForm, validationSchemas } from '../utils/validationSchemas.js';

class EmployeeService {
  // Create a new employee
  async createEmployee(employeeData, isFormData = false) {
    if (!isFormData) {
      const validation = validateForm(employeeData, validationSchemas.employee);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
      }
    }

    return apiService.post('/employees/create', employeeData, isFormData);
  }

  // Get all employees
  async getAllEmployees(params = {}) {
    const validParams = {};
    
    if (params.universityCode) {
      validParams.universityCode = params.universityCode;
    }
    
    if (params.department) {
      validParams.department = params.department;
    }
    
    if (params.designation) {
      validParams.designation = params.designation;
    }
    
    if (params.status) {
      validParams.status = params.status;
    }
    
    if (params.accountStatus) {
      validParams.accountStatus = params.accountStatus;
    }
    
    if (params.isActive !== undefined) {
      validParams.isActive = params.isActive;
    }
    
    if (params.page) {
      validParams.page = params.page;
    }
    
    if (params.limit) {
      validParams.limit = params.limit;
    }

    return apiService.get('/employees/all', validParams);
  }

  // Get employee by ID
  async getEmployeeById(id) {
    if (!id) {
      throw new Error('Employee ID is required');
    }
    
    return apiService.get(`/employees/get/${id}`);
  }

  // Get employee by employee ID
  async getEmployeeByEmployeeId(employeeId) {
    if (!employeeId) {
      throw new Error('Employee ID is required');
    }
    
    return apiService.get(`/employees/employee-id/${employeeId}`);
  }

  // Update employee
  async updateEmployee(id, updateData, isFormData = false) {
    if (!id) {
      throw new Error('Employee ID is required');
    }

    if (!isFormData) {
      // Validate only provided fields
      const fieldsToValidate = Object.keys(updateData);
      const validation = validatePartialForm(updateData, validationSchemas.employee, fieldsToValidate);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
      }
    }

    return apiService.put(`/employees/update/${id}`, updateData, isFormData);
  }

  // Delete employee (soft delete - set isActive to false)
  async deleteEmployee(id) {
    if (!id) {
      throw new Error('Employee ID is required');
    }
    
    return apiService.delete(`/employees/delete/${id}`);
  }

  // Reactivate employee
  async reactivateEmployee(id) {
    if (!id) {
      throw new Error('Employee ID is required');
    }
    
    return apiService.put(`/employees/reactivate/${id}`);
  }

  // Search employees
  async searchEmployees(query, params = {}) {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    const searchParams = {
      query: query.trim(),
      ...params
    };

    return apiService.get('/employees/search', searchParams);
  }

  // Get employees by department
  async getEmployeesByDepartment(department, params = {}) {
    if (!department) {
      throw new Error('Department is required');
    }

    const searchParams = {
      department,
      ...params
    };

    return apiService.get('/employees/by-department', searchParams);
  }

  // Get employee statistics
  async getEmployeeStatistics(params = {}) {
    const validParams = {};
    
    if (params.universityCode) {
      validParams.universityCode = params.universityCode;
    }
    
    if (params.department) {
      validParams.department = params.department;
    }

    return apiService.get('/employees/statistics', validParams);
  }

  // Upload employees from Excel
  async uploadEmployeesFromExcel(excelFile) {
    if (!excelFile) {
      throw new Error('Excel file is required');
    }

    const formData = new FormData();
    formData.append('file', excelFile);

    return apiService.post('/employees/upload-excel', formData, true);
  }

  // Bulk update employees
  async bulkUpdateEmployees(updates) {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Updates array is required');
    }

    return apiService.post('/employees/bulk-update', { updates });
  }

  // Export employees data
  async exportEmployees(format = 'excel', params = {}) {
    const exportParams = {
      format,
      ...params
    };

    return apiService.get('/employees/export', exportParams);
  }

  // Get employees by designation
  async getEmployeesByDesignation(designation, params = {}) {
    if (!designation) {
      throw new Error('Designation is required');
    }

    const searchParams = {
      designation,
      ...params
    };

    return apiService.get('/employees/by-designation', searchParams);
  }

  // Get active employees
  async getActiveEmployees(params = {}) {
    return this.getAllEmployees({ ...params, isActive: true });
  }

  // Get inactive employees
  async getInactiveEmployees(params = {}) {
    return this.getAllEmployees({ ...params, isActive: false });
  }

  // Update employee status
  async updateEmployeeStatus(id, status) {
    if (!id) {
      throw new Error('Employee ID is required');
    }

    if (!['active', 'inactive'].includes(status)) {
      throw new Error('Status must be active or inactive');
    }

    return apiService.patch(`/employees/${id}/status`, { status });
  }

  // Update employee salary
  async updateEmployeeSalary(id, salary) {
    if (!id) {
      throw new Error('Employee ID is required');
    }

    if (typeof salary !== 'number' || salary < 0) {
      throw new Error('Valid salary amount is required');
    }

    return apiService.patch(`/employees/${id}/salary`, { salary });
  }
}

const employeeService = new EmployeeService();
export default employeeService;
