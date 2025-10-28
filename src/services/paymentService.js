import apiService from './api.js';
import { validateForm, validatePartialForm, validationSchemas } from '../utils/validationSchemas.js';

class PaymentService {
  // Create payment
  async createPayment(paymentData) {
    const validation = validateForm(paymentData, validationSchemas.payment);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    return apiService.post('/payments/create', paymentData);
  }

  // Add multiple EMIs
  async addPayments(paymentData) {
    const requiredFields = ['student_id', 'amount', 'emi_number', 'start_date', 'end_date'];
    const missingFields = requiredFields.filter(field => !paymentData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return apiService.post('/accounts/add-payments', paymentData);
  }

  // Add one shot payment
  async addOneShotPayment(paymentData) {
    const requiredFields = ['student_id', 'amount', 'emi_duedate'];
    const missingFields = requiredFields.filter(field => !paymentData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return apiService.post('/accounts/add-one-shot', paymentData);
  }

  // Get all payments
  async getAllPayments(params = {}) {
    return apiService.get('/payments', params);
  }

  // Get payments by month/year
  async getPayments(month, year, filter = null) {
    if (!month || !year) {
      throw new Error('Month and year are required');
    }

    const searchParams = {
      month: parseInt(month),
      year: parseInt(year)
    };

    if (filter && ['paid', 'missed', 'upcoming'].includes(filter)) {
      searchParams.filter = filter;
    }

    return apiService.get('/accounts/payments', searchParams);
  }

  // Get payment by ID
  async getPaymentById(id) {
    if (!id) {
      throw new Error('Payment ID is required');
    }
    
    return apiService.get(`/payments/${id}`);
  }

  // Update payment
  async updatePayment(id, updateData) {
    if (!id) {
      throw new Error('Payment ID is required');
    }

    const fieldsToValidate = Object.keys(updateData);
    const validation = validatePartialForm(updateData, validationSchemas.payment, fieldsToValidate);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    return apiService.put(`/payments/${id}`, updateData);
  }

  // Delete payment
  async deletePayment(id) {
    if (!id) {
      throw new Error('Payment ID is required');
    }
    
    return apiService.delete(`/payments/${id}`);
  }

  // Get payments by student
  async getPaymentsByStudent(studentId, params = {}) {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    return apiService.get(`/payments/student/${studentId}`, params);
  }

  // Get one student payment history
  async getOneStudentPaymentHistory(studentId) {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    return apiService.get(`/accounts/student-payment-history/${studentId}`);
  }

  // Mark payment as paid
  async markPaymentAsPaid(emiId, isPaid) {
    if (!emiId) {
      throw new Error('EMI ID is required');
    }

    if (typeof isPaid !== 'boolean') {
      throw new Error('isPaid must be a boolean value');
    }

    return apiService.post('/accounts/mark-paid', { emiId, isPaid });
  }

  // Update payment status
  async updatePaymentStatus(id, isPaid, txnId = null) {
    if (!id) {
      throw new Error('Payment ID is required');
    }

    if (typeof isPaid !== 'boolean') {
      throw new Error('isPaid must be a boolean value');
    }

    const updateData = { is_paid: isPaid };
    if (txnId) {
      updateData.txn_id = txnId;
    }

    return apiService.patch(`/payments/${id}/status`, updateData);
  }

  // Get payment statistics
  async getPaymentStatistics(params = {}) {
    return apiService.get('/payments/statistics', params);
  }

  // Bulk mark payments as paid
  async bulkMarkPaymentsAsPaid(paymentIds, txnId = null) {
    if (!Array.isArray(paymentIds) || paymentIds.length === 0) {
      throw new Error('Payment IDs array is required');
    }

    const updateData = { paymentIds };
    if (txnId) {
      updateData.txn_id = txnId;
    }

    return apiService.post('/payments/bulk-mark-paid', updateData);
  }

  // Get payments by date range
  async getPaymentsByDateRange(startDate, endDate, params = {}) {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    const searchParams = {
      startDate,
      endDate,
      ...params
    };

    return apiService.get('/payments/date-range', searchParams);
  }

  // Get pending payments
  async getPendingPayments(params = {}) {
    return this.getAllPayments({ ...params, is_paid: false });
  }

  // Get paid payments
  async getPaidPayments(params = {}) {
    return this.getAllPayments({ ...params, is_paid: true });
  }

  // Get overdue payments
  async getOverduePayments(params = {}) {
    const today = new Date().toISOString().split('T')[0];
    return this.getPaymentsByDateRange('1900-01-01', today, { ...params, is_paid: false });
  }

  // Get upcoming payments
  async getUpcomingPayments(params = {}) {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    return this.getPaymentsByDateRange(today, futureDateStr, { ...params, is_paid: false });
  }

  // Export payments
  async exportPayments(format = 'excel', params = {}) {
    const exportParams = {
      format,
      ...params
    };

    return apiService.get('/payments/export', exportParams);
  }

  // Generate payment receipt
  async generatePaymentReceipt(paymentId) {
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }
    
    return apiService.get(`/payments/${paymentId}/receipt`);
  }

  // Get payment analytics
  async getPaymentAnalytics(params = {}) {
    return apiService.get('/payments/analytics', params);
  }

  // Get fee collection report
  async getFeeCollectionReport(startDate, endDate, params = {}) {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    const searchParams = {
      startDate,
      endDate,
      ...params
    };

    return apiService.get('/payments/fee-collection-report', searchParams);
  }
}

const paymentService = new PaymentService();
export default paymentService;
