import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUser, FaCalendar, FaMoneyBillWave, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { validateUniversityCode, getUniversityInfo } from '../../utils/universityUtils';

const OptimizedAddPayment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    emi_discount: 0,
    emi_number: 1,
    start_date: '',
    end_date: '',
    paymentType: 'one-shot' // 'one-shot' or 'multiple'
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);

  // Get university code with validation
  let universityCode, universityInfo;
  try {
    universityCode = validateUniversityCode();
    universityInfo = getUniversityInfo();
  } catch (error) {
    universityCode = null;
    universityInfo = null;
  }

  // Fetch students for dropdown
  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      
      if (!universityCode) {
        Swal.fire({
          title: 'Authentication Error!',
          text: 'University code not found. Please login again.',
          icon: 'error'
        }).then(() => {
          navigate('/auth/login');
        });
        return;
      }

      const response = await fetch(`http://localhost:5001/api/students/all?universityCode=${universityCode}`);
      const result = await response.json();
      
      if (result.success) {
        setStudents(result.data);
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Failed to fetch students',
          icon: 'error'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Network Error!',
        text: 'Failed to fetch students',
        icon: 'error'
      });
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateEMIDetails = () => {
    if (!formData.amount || !formData.emi_number) return null;
    
    const netAmount = parseFloat(formData.amount) - parseFloat(formData.emi_discount || 0);
    const emiAmount = Math.ceil(netAmount / formData.emi_number);
    
    return {
      netAmount,
      emiAmount,
      totalDiscount: parseFloat(formData.emi_discount || 0)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.student_id || !formData.amount) {
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please fill in all required fields',
        icon: 'warning'
      });
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      Swal.fire({
        title: 'Validation Error!',
        text: 'Amount must be greater than 0',
        icon: 'warning'
      });
      return;
    }

    if (formData.paymentType === 'one-shot' && !formData.start_date) {
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please select due date for one-time payment',
        icon: 'warning'
      });
      return;
    }

    if (formData.paymentType === 'multiple' && (!formData.start_date || !formData.end_date)) {
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please select start and end dates for EMI payments',
        icon: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      
      let paymentData;
      let endpoint;

      if (formData.paymentType === 'one-shot') {
        paymentData = {
          student_id: formData.student_id,
          amount: parseFloat(formData.amount),
          emi_discount: parseFloat(formData.emi_discount) || 0,
          emi_duedate: formData.start_date,
          universityCode: universityCode
        };
        endpoint = 'http://localhost:5001/api/accounts/add-one-shot-payment';
      } else {
        paymentData = {
          student_id: formData.student_id,
          amount: parseFloat(formData.amount),
          emi_discount: parseFloat(formData.emi_discount) || 0,
          emi_number: parseInt(formData.emi_number),
          start_date: formData.start_date,
          end_date: formData.end_date,
          universityCode: universityCode
        };
        endpoint = 'http://localhost:5001/api/accounts/add-payment';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: result.message || 'Payment record created successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/accounts');
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Failed to create payment record',
          icon: 'error'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Network Error!',
        text: 'Failed to create payment record',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const emiDetails = calculateEMIDetails();

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/accounts')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Accounts
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Payment Record</h1>
              <p className="text-gray-600 mt-1">Create a new payment record for a student</p>
              {universityInfo && (
                <p className="text-sm text-blue-600 mt-1">
                  University: {universityInfo.name} ({universityInfo.code})
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Payment Type Selection */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <FaMoneyBillWave className="w-4 h-4 text-blue-600" />
                Payment Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentType"
                    value="one-shot"
                    checked={formData.paymentType === 'one-shot'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">One-time Payment</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentType"
                    value="multiple"
                    checked={formData.paymentType === 'multiple'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">EMI Payment (Multiple installments)</span>
                </label>
              </div>
            </div>

            {/* Student Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FaUser className="w-4 h-4 text-blue-600" />
                  Student *
                </label>
                {studentsLoading ? (
                  <div className="w-full p-3 border rounded-lg bg-gray-50">
                    <div className="animate-pulse text-gray-500">Loading students...</div>
                  </div>
                ) : (
                  <select
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select a student</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.enrollmentId}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FaMoneyBillWave className="w-4 h-4 text-green-600" />
                  Total Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter total amount"
                  min="0"
                  step="0.01"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* EMI Discount */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FaMoneyBillWave className="w-4 h-4 text-purple-600" />
                EMI Discount (₹)
              </label>
              <input
                type="number"
                name="emi_discount"
                value={formData.emi_discount}
                onChange={handleInputChange}
                placeholder="Enter discount amount"
                min="0"
                step="0.01"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Optional discount amount to be deducted from total</p>
            </div>

            {/* EMI Number (for multiple payments) */}
            {formData.paymentType === 'multiple' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FaMoneyBillWave className="w-4 h-4 text-orange-600" />
                  Number of EMIs *
                </label>
                <input
                  type="number"
                  name="emi_number"
                  value={formData.emi_number}
                  onChange={handleInputChange}
                  placeholder="Enter number of EMIs"
                  min="1"
                  max="12"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            )}

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FaCalendar className="w-4 h-4 text-purple-600" />
                  {formData.paymentType === 'one-shot' ? 'Due Date *' : 'Start Date *'}
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {formData.paymentType === 'multiple' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FaCalendar className="w-4 h-4 text-purple-600" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              )}
            </div>

            {/* EMI Calculation Preview */}
            {emiDetails && formData.paymentType === 'multiple' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-3">EMI Calculation Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Amount:</span> ₹{parseFloat(formData.amount).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Discount:</span> ₹{emiDetails.totalDiscount.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Net Amount:</span> ₹{emiDetails.netAmount.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">EMI Amount:</span> ₹{emiDetails.emiAmount.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Number of EMIs:</span> {formData.emi_number}
                  </div>
                  <div>
                    <span className="font-medium">Total EMI Amount:</span> ₹{(emiDetails.emiAmount * formData.emi_number).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Selected Student Info */}
            {formData.student_id && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Selected Student Information</h3>
                {(() => {
                  const selectedStudent = students.find(s => s._id === formData.student_id);
                  return selectedStudent ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {selectedStudent.name}
                      </div>
                      <div>
                        <span className="font-medium">Enrollment ID:</span> {selectedStudent.enrollmentId}
                      </div>
                      <div>
                        <span className="font-medium">Department:</span> {selectedStudent.department}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/accounts')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Create Payment Record
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Instructions</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Select a student from the dropdown list</li>
            <li>• Choose between one-time payment or EMI payment</li>
            <li>• Enter the total amount (discount will be deducted automatically)</li>
            <li>• For EMI payments, set the number of installments and date range</li>
            <li>• EMI amounts are calculated automatically and rounded up</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default OptimizedAddPayment;