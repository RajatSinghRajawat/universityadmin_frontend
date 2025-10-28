// Export all services from a single file for easy importing
export { default as apiService } from './api.js';
export { default as authService } from './authService.js';
export { default as studentService } from './studentService.js';
export { default as employeeService } from './employeeService.js';
export { default as courseService } from './courseService.js';
export { default as sessionService } from './sessionService.js';
export { default as attendanceService } from './attendanceService.js';
export { default as admitCardService } from './admitCardService.js';
export { default as paymentService } from './paymentService.js';
export { default as messageService } from './messageService.js';

// Export validation utilities
export { validationSchemas, validateField, validateForm, validatePartialForm } from '../utils/validationSchemas.js';
