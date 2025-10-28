import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUser, FaCalendar, FaMoneyBillWave, FaReceipt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { validateUniversityCode, getUniversityInfo } from '../../utils/universityUtils';

const AddPayment = () => {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    discount_percentage: 0,
    emi_duedate: '',
    paymentType: 'multiple', // 'one-shot' or 'multiple'
    emi_frequency: 'monthly'
  });
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [emiPreview, setEmiPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [manualJoiningDate, setManualJoiningDate] = useState('');
  const [useManualDate, setUseManualDate] = useState(false);

  const universityCodes = localStorage.getItem('universityCode');
  console.log(universityCodes);

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
      const params = new URLSearchParams();
      if (universityCode) {
        params.append('universityCode', universityCode);
      }
      
      const response = await fetch(`http://localhost:5001/api/students/get?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setAllStudents(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch students list',
        icon: 'error'
      });
    } finally {
      setStudentsLoading(false);
    }
  };

  // Fetch single student if ID is provided in URL
  const fetchSingleStudent = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/students/get/${studentId}`);
      const result = await response.json();
      
      if (result.success) {
        setStudents(result.data);
        // Pre-populate the form with student ID and amount
        setFormData(prev => ({
          ...prev,
          student_id: studentId,
          amount: result.data?.course_id?.discountPrice || result.data?.course_id?.price || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  };

  const price = students?.course_id?.price;
  const discountPrice = students?.course_id?.discountPrice;

  useEffect(() => {
    if (id) {
      // If ID is provided in URL, fetch that specific student
      fetchSingleStudent(id);
    } else {
      // Otherwise fetch all students for dropdown
      fetchStudents();
    }
  }, [id, universityCode]);

  // Calculate EMI preview when student is selected or form data changes
  useEffect(() => {
    if (formData.student_id && formData.amount && formData.paymentType === 'multiple') {
      calculateEmiPreview();
    }
  }, [formData.student_id, formData.amount, formData.discount_percentage, formData.emi_frequency, formData.paymentType, students, allStudents, useManualDate, manualJoiningDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Calculate EMI preview when relevant fields change
    if (name === 'amount' || name === 'discount_percentage' || name === 'emi_frequency' || name === 'paymentType') {
      calculateEmiPreview();
    }
  };

  // Function to calculate EMI preview
  const calculateEmiPreview = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0 || formData.paymentType === 'one-shot') {
      setEmiPreview(null);
      setShowPreview(false);
      return;
    }

    const selectedStudent = id ? students : allStudents.find(s => s._id === formData.student_id);
    if (!selectedStudent) {
      setEmiPreview(null);
      setShowPreview(false);
      return;
    }

    // Check multiple possible field names for joining date
    let joiningDate = selectedStudent.joiningDate || selectedStudent.joining_date || selectedStudent.JoiningDate || selectedStudent.dateOfJoining || selectedStudent.admissionDate;
    
    // Use manual date if selected
    if (useManualDate && manualJoiningDate) {
      joiningDate = manualJoiningDate;
    }
    
    if (!joiningDate) {
      console.log('No joining date found for student:', selectedStudent);
      setEmiPreview(null);
      setShowPreview(false);
      return;
    }

    const amount = parseFloat(formData.amount);
    const discount = parseFloat(formData.discount_percentage) || 0;
    const netAmount = amount - discount;
    
    // Get course duration
    const courseDuration = selectedStudent.course_id?.duration || 12;
    
    // Calculate number of EMIs based on frequency
    let emiNumber;
    switch (formData.emi_frequency) {
      case 'monthly':
        emiNumber = courseDuration;
        break;
      case 'quarterly':
        emiNumber = Math.ceil(courseDuration / 3);
        break;
      case 'semester':
        emiNumber = Math.ceil(courseDuration / 6);
        break;
      case 'yearly':
        emiNumber = Math.ceil(courseDuration / 12);
        break;
      default:
        emiNumber = courseDuration;
    }

    const emiAmount = Math.ceil(netAmount / emiNumber);
    
    // Calculate EMI schedule
    const startDate = new Date(joiningDate);
    const emiSchedule = [];
    const isFutureJoining = startDate > new Date();
    
    for (let i = 0; i < emiNumber; i++) {
      const dueDate = new Date(startDate);
      
      switch (formData.emi_frequency) {
        case 'monthly':
          if (isFutureJoining) {
            // If joining date is in future, first EMI due from joining date
            dueDate.setMonth(startDate.getMonth() + i);
          } else {
            // If joining date is past, first EMI due next month
            dueDate.setMonth(startDate.getMonth() + i + 1);
          }
          break;
        case 'quarterly':
          if (isFutureJoining) {
            dueDate.setMonth(startDate.getMonth() + (i * 3));
          } else {
            dueDate.setMonth(startDate.getMonth() + ((i + 1) * 3));
          }
          break;
        case 'semester':
          if (isFutureJoining) {
            dueDate.setMonth(startDate.getMonth() + (i * 6));
          } else {
            dueDate.setMonth(startDate.getMonth() + ((i + 1) * 6));
          }
          break;
        case 'yearly':
          if (isFutureJoining) {
            dueDate.setFullYear(startDate.getFullYear() + i);
          } else {
            dueDate.setFullYear(startDate.getFullYear() + (i + 1));
          }
          break;
      }
      
      emiSchedule.push({
        installment: i + 1,
        dueDate: dueDate.toLocaleDateString('en-IN'),
        amount: emiAmount
      });
    }

    setEmiPreview({
      totalEMIs: emiNumber,
      emiAmount: emiAmount,
      totalAmount: amount,
      discount: discount,
      netAmount: netAmount,
      frequency: formData.emi_frequency,
      joiningDate: joiningDate,
      isFutureJoining: isFutureJoining,
      emiSchedule: emiSchedule
    });
    setShowPreview(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation based on payment type
    if (formData.paymentType === 'one-shot') {
      if (!formData.student_id || !formData.amount || !formData.emi_duedate) {
        Swal.fire({
          title: 'Validation Error!',
          text: 'Please fill in all required fields (Student, Amount, Due Date)',
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

      // Validate date format and future date
      const dueDate = new Date(formData.emi_duedate);
      if (isNaN(dueDate.getTime())) {
        Swal.fire({
          title: 'Validation Error!',
          text: 'Please enter a valid due date',
          icon: 'warning'
        });
        return;
      }

      if (dueDate <= new Date()) {
        Swal.fire({
          title: 'Validation Error!',
          text: 'Due date must be in the future',
          icon: 'warning'
        });
        return;
      }
    } else {
      // Multiple EMI validation
      if (!formData.student_id || !formData.amount || !formData.emi_frequency) {
        Swal.fire({
          title: 'Validation Error!',
          text: 'Please select a student, enter amount, and select EMI frequency',
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
    }

    try {
      setLoading(true);
      
      let paymentData;
      let endpoint;

      if (formData.paymentType === 'one-shot') {
        // Ensure date is properly formatted for one-shot payment
        const dueDate = new Date(formData.emi_duedate);
        if (isNaN(dueDate.getTime())) {
          throw new Error('Invalid date format');
        }
        
        paymentData = {
          student_id: formData.student_id,
          amount: parseFloat(formData.amount),
          emi_discount: parseFloat(formData.discount_percentage) || 0,
          emi_duedate: dueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          universityCode: universityCode
        };
        endpoint = 'http://localhost:5001/api/accounts/add-one-shot-payment';
      } else {
        // For multiple EMI payments, we don't send emi_duedate as it will be calculated automatically
        paymentData = {
          student_id: formData.student_id,
          amount: parseFloat(formData.amount),
          emi_discount: parseFloat(formData.discount_percentage) || 0,
          emi_frequency: formData.emi_frequency,
          universityCode: universityCode,
          // Add manual joining date if provided
          ...(useManualDate && manualJoiningDate && { manualJoiningDate: manualJoiningDate })
        };
        endpoint = 'http://localhost:5001/api/accounts/add-payment';
      }

      console.log('Sending payment data:', paymentData);
      console.log('Payment type:', formData.paymentType);
      console.log('Endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      console.log('Payment response:', result);

      if (result.success) {
        let successMessage = result.message || 'Payment record created successfully';
        
        // Add EMI details for multiple payments
        if (formData.paymentType === 'multiple' && result.emiDetails) {
          successMessage += `\n\nEMI Details:\n• Total EMIs: ${result.emiDetails.totalEMIs}\n• EMI Amount: ₹${result.emiDetails.emiAmount}\n• Frequency: ${result.emiDetails.frequency}`;
          
          // Show EMI schedule in a detailed alert
          if (result.emiDetails.emiSchedule && result.emiDetails.emiSchedule.length > 0) {
            let scheduleText = '\n\nEMI Schedule:\n';
            result.emiDetails.emiSchedule.forEach((emi, index) => {
              scheduleText += `• EMI ${emi.installment}: ₹${emi.amount} (Due: ${new Date(emi.dueDate).toLocaleDateString('en-IN')})\n`;
            });
            successMessage += scheduleText;
          }
        }
        
        Swal.fire({
          title: 'Success!',
          text: successMessage,
          icon: 'success',
          timer: 5000,
          showConfirmButton: true,
          width: '600px'
        }).then(() => {
          // Reset form data
          setFormData({
            student_id: '',
            amount: '',
            discount_percentage: 0,
            emi_duedate: '',
            paymentType: 'multiple',
            emi_frequency: 'monthly'
          });
          setEmiPreview(null);
          setShowPreview(false);
          setManualJoiningDate('');
          setUseManualDate(false);
          navigate('/students');
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Failed to create payment record',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to create payment record',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold">Add Payment Record</h1>
            <p className="opacity-70 mt-1">Create a new payment record for a student</p>
            {universityInfo && (
              <p className="text-sm text-blue-600 mt-1">
                University: {universityInfo.name} ({universityCode})
              </p>
            )}
            {id && students && (
              <p className="text-sm text-green-600 mt-1">
                Adding payment for: {students.name} ({students.enrollmentId})
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/accounts')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Accounts
          </button>
        </div>

        {/* Form */}
        <div className="rounded-xl shadow-lg p-6 bg-white">
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

            {/* Amount */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FaMoneyBillWave className="w-4 h-4 text-green-600" />
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* EMI Discount */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FaMoneyBillWave className="w-4 h-4 text-purple-600" />
                EMI Discount (₹)
              </label>
              <input
                type="number"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleInputChange}
                placeholder="Enter discount amount"
                min="0"
                step="0.01"
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Optional discount amount to be deducted from total</p>
            </div>

            {/* Student Selection */}
            {!id && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FaUser className="w-4 h-4 text-blue-600" />
                  Select Student *
                </label>
                <select
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  required
                  disabled={studentsLoading}
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">
                    {studentsLoading ? 'Loading students...' : 'Select a student'}
                  </option>
                  {allStudents.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} - {student.enrollmentId}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* EMI Frequency - Only for multiple payments */}
            {formData.paymentType === 'multiple' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FaCalendar className="w-4 h-4 text-orange-600" />
                  EMI Frequency *
                </label>
                <select
                  name="emi_frequency"
                  value={formData.emi_frequency}
                  onChange={handleInputChange}
                  required={formData.paymentType === 'multiple'}
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semester">Semester</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}

            {/* EMI Fields - Show conditionally based on payment type */}
            {formData.paymentType === 'one-shot' ? (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FaCalendar className="w-4 h-4 text-purple-600" />
                  Payment Due Date *
                </label>
                <input
                  type="date"
                  name="emi_duedate"
                  value={formData.emi_duedate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onBlur={(e) => {
                    // Additional validation on blur
                    if (e.target.value) {
                      const selectedDate = new Date(e.target.value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      if (selectedDate <= today) {
                        e.target.setCustomValidity('Due date must be in the future');
                      } else {
                        e.target.setCustomValidity('');
                      }
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Due date for the single payment</p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">EMI Payment Information</h3>
                <p className="text-sm text-blue-700">
                  EMIs will be automatically created based on the selected student's course duration and joining date.
                </p>
              </div>
            )}

            {/* EMI Preview Section */}
            {showPreview && emiPreview && formData.paymentType === 'multiple' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                  <FaReceipt className="w-4 h-4" />
                  EMI Preview
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">₹{emiPreview.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium">₹{emiPreview.discount}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="text-gray-600">Net Amount:</span>
                      <span className="font-medium">₹{emiPreview.netAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joining Date:</span>
                      <span className={`font-medium ${emiPreview.isFutureJoining ? 'text-blue-600' : 'text-gray-600'}`}>
                        {new Date(emiPreview.joiningDate).toLocaleDateString('en-IN')}
                        {emiPreview.isFutureJoining && ' (Future)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total EMIs:</span>
                      <span className="font-medium">{emiPreview.totalEMIs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">EMI Amount:</span>
                      <span className="font-medium text-green-600">₹{emiPreview.emiAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium capitalize">{emiPreview.frequency}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <h4 className="font-medium text-green-800 mb-2">EMI Schedule (First 5):</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {emiPreview.emiSchedule.slice(0, 5).map((emi, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span>EMI {emi.installment}:</span>
                          <span>₹{emi.amount} - {emi.dueDate}</span>
                        </div>
                      ))}
                      {emiPreview.emiSchedule.length > 5 && (
                        <div className="text-xs text-gray-500 italic">
                          ... and {emiPreview.emiSchedule.length - 5} more EMIs
                        </div>
                      )}
                    </div>
                    {emiPreview.isFutureJoining && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                        <strong>Note:</strong> First EMI will be due from the joining date since it's in the future.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Selected Student Info */}
            {formData.student_id && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Selected Student Information</h3>
                {(() => {
                  // If ID is from URL, use students object, otherwise find from allStudents
                  const selectedStudent = id ? students : allStudents.find(s => s._id === formData.student_id);
                  return selectedStudent ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Name:</span> {selectedStudent.name}
                        </div>
                        <div>
                          <span className="font-medium">Enrollment ID:</span> {selectedStudent.enrollmentId}
                        </div>
                        <div>
                          <span className="font-medium">Course:</span> {selectedStudent.course_id?.name || 'N/A'}
                        </div>
                        {selectedStudent.course_id?.price && (
                          <div>
                            <span className="font-medium">Course Price:</span> ₹{selectedStudent.course_id.discountPrice || selectedStudent.course_id.price}
                          </div>
                        )}
                      </div>
                      
                      {/* Debug Info for Joining Date */}
                      <div className="border-t pt-2 text-xs text-gray-600">
                        <div className="font-medium text-blue-800 mb-1">Joining Date Information:</div>
                        <div>Available fields: {Object.keys(selectedStudent).filter(key => key.toLowerCase().includes('join') || key.toLowerCase().includes('date')).join(', ') || 'None found'}</div>
                        <div>Joining Date: {selectedStudent.joiningDate || selectedStudent.joining_date || selectedStudent.JoiningDate || selectedStudent.dateOfJoining || selectedStudent.admissionDate || 'Not found'}</div>
                        {(!selectedStudent.joiningDate && !selectedStudent.joining_date && !selectedStudent.JoiningDate && !selectedStudent.dateOfJoining && !selectedStudent.admissionDate) && (
                          <div className="space-y-2">
                            <div className="text-red-600 font-medium">⚠️ No joining date field found in student data</div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="useManualDate"
                                checked={useManualDate}
                                onChange={(e) => setUseManualDate(e.target.checked)}
                                className="w-4 h-4"
                              />
                              <label htmlFor="useManualDate" className="text-sm">Use manual joining date</label>
                            </div>
                            {useManualDate && (
                              <input
                                type="date"
                                value={manualJoiningDate}
                                onChange={(e) => setManualJoiningDate(e.target.value)}
                                className="w-full p-2 border border-blue-300 rounded text-sm"
                                placeholder="Select joining date"
                              />
                            )}
                          </div>
                        )}
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
                <FaSave className="w-4 h-4" />
                {loading ? 'Creating...' : 'Create Payment Record'}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Instructions</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Choose payment type: One-time or Multiple EMI</li>
            <li>• Select a student from the dropdown list (or pre-selected if coming from student page)</li>
            <li>• Enter the payment amount (must be greater than 0)</li>
            <li>• Add discount amount if applicable</li>
            {formData.paymentType === 'one-shot' ? (
              <li>• Set the payment due date (must be in the future)</li>
            ) : (
              <li>• Select EMI frequency - EMIs will be automatically created based on course duration and joining date</li>
            )}
            <li>• Payment will be marked as unpaid by default</li>
            <li>• You can mark payments as paid later from the accounts page</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AddPayment;
