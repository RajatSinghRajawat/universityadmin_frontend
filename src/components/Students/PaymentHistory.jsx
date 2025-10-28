import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaCalendar, FaIdCard, FaDownload, FaReceipt, FaSpinner, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const PaymentHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;
  const [activeTab, setActiveTab] = useState('All');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get university code from localStorage or location state
  const universityCode = location.state?.universityCode || localStorage.getItem('universityCode');

  // Sample student data
  const studentData = student || {
    id: 3,
    enrollmentId: '1234002',
    name: 'krish',
    joiningDate: '2025-09-25',
    course: 'Computer Science',
    batch: '2024-25'
  };

  // Fetch payment history from API
  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!studentData._id && !studentData.id) {
        setError('Student ID not found. Please go back and try again.');
        return;
      }

      if (!universityCode) {
        setError('University code not found. Please login again.');
        return;
      }

      const studentId = studentData._id || studentData.id;
      const url = universityCode 
        ? `http://localhost:5001/api/accounts/student/${studentId}?universityCode=${universityCode}`
        : `http://localhost:5001/api/accounts/student/${studentId}`;
        
      console.log('Fetching payment history for:', { studentId, universityCode, url });
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        // Transform the data to match the expected format with proper status calculation
        const transformedData = result.data.map((payment, index) => {
          let status = 'Upcoming';
          const today = new Date();
          const dueDate = new Date(payment.emi_duedate);
          
          if (payment.is_paid) {
            status = 'Paid';
          } else if (dueDate < today) {
            status = 'Missed';
          } else {
            status = 'Upcoming';
          }
          
          return {
            id: payment._id,
            amount: payment.amount,
            dueAmount: payment.is_paid ? 0 : payment.amount,
            paymentDate: payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-',
            dueDate: dueDate.toLocaleDateString(),
            status: status,
            receiptNo: payment.txn_id || '-',
            paymentMethod: payment.is_paid ? 'Online' : '-',
            description: `EMI Payment - ${dueDate.toLocaleDateString()}`,
            is_paid: payment.is_paid,
            emi_duedate: payment.emi_duedate,
            payment_date: payment.payment_date
          };
        });
        
        // Sort by date (paid payments by payment date, others by due date)
        transformedData.sort((a, b) => {
          if (a.is_paid && b.is_paid) {
            // Both paid - sort by payment date (newest first)
            return new Date(b.payment_date || 0) - new Date(a.payment_date || 0);
          } else if (a.is_paid && !b.is_paid) {
            // A is paid, B is not - paid payments come first
            return -1;
          } else if (!a.is_paid && b.is_paid) {
            // B is paid, A is not - paid payments come first
            return 1;
          } else {
            // Both unpaid - sort by due date (earliest first)
            return new Date(a.emi_duedate) - new Date(b.emi_duedate);
          }
        });
        
        setPaymentHistory(transformedData);
      } else {
        setError(result.message || 'Failed to fetch payment history');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [studentData._id, studentData.id, universityCode]);

  const tabs = ['All', 'Missed', 'Upcoming', 'Paid', 'Receipt'];

  const filteredPayments = paymentHistory.filter(payment => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Paid') return payment.status === 'Paid';
    if (activeTab === 'Missed') return payment.status === 'Missed';
    if (activeTab === 'Upcoming') return payment.status === 'Upcoming';
    if (activeTab === 'Receipt') return payment.status === 'Paid';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-orange-100 text-orange-800';
      case 'Missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalDueAmount = paymentHistory.reduce((sum, payment) => sum + payment.dueAmount, 0);

  const handlePayAll = () => {
    console.log('Pay all remaining amount:', totalDueAmount);
    // Add payment logic here
  };

  const handlePayNow = async (payment) => {
    try {
      // First, show date selection modal
      const dateResult = await Swal.fire({
        title: 'Select payment date',
        html: `
          <div class="text-left">
            <label class="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
            <input 
              type="date" 
              id="paymentDate" 
              class="swal2-input" 
              value="${new Date().toISOString().split('T')[0]}"
              style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;"
            />
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Transaction ID (optional)</label>
            <input 
              type="text" 
              id="transactionId" 
              class="swal2-input" 
              placeholder="Enter transaction ID"
              style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;"
            />
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#8b5cf6',
        cancelButtonColor: '#6b7280',
        preConfirm: () => {
          const paymentDate = document.getElementById('paymentDate').value;
          const transactionId = document.getElementById('transactionId').value;
          
          if (!paymentDate) {
            Swal.showValidationMessage('Please select a payment date');
            return false;
          }
          
          return { paymentDate, transactionId };
        }
      });

      if (dateResult.isConfirmed) {
        const { paymentDate, transactionId } = dateResult.value;
        
        const requestBody = {
          emiId: payment.id,
          isPaid: true,
          payment_date: paymentDate,
          txn_id: transactionId || null
        };
        
        // Add university code if available
        if (universityCode) {
          requestBody.universityCode = universityCode;
        }
        
        const response = await fetch(`http://localhost:5001/api/accounts/mark-paid/${payment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        
        if (responseData.success) {
          Swal.fire({
            title: 'Success!',
            text: `Payment marked as paid on ${new Date(paymentDate).toLocaleDateString()}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          // Refresh payment history
          fetchPaymentHistory();
        } else {
          Swal.fire({
            title: 'Error!',
            text: responseData.message || 'Failed to mark payment as paid',
            icon: 'error'
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Network Error!',
        text: 'Network error occurred',
        icon: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center ">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchPaymentHistory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 ">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/students')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            Back from Payment Details
          </button>
          {totalDueAmount > 0 && (
            <button
              onClick={handlePayAll}
              className="px-5 py-2.5  rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              Pay All Remaining
            </button>
          )}
        </div>

        {/* Student Information Card */}
        <div className="rounded-xl shadow-lg p-6 ">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <FaUser className="w-6 h-6 text-purple-400" />
              <div>
                <span className="text-sm text-purple-200">Student</span>
                <h2 className="text-xl font-bold text-white">{studentData.name}</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <FaIdCard className="w-6 h-6 text-purple-400" />
              <div>
                <span className="text-sm text-purple-200">Enrollment Id</span>
                <p className="text-lg font-semibold text-white">{studentData.enrollmentId}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <FaCalendar className="w-6 h-6 text-purple-400" />
              <div>
                <span className="text-sm text-purple-200">Joining Date</span>
                <p className="text-lg font-semibold text-white">{studentData.joiningDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-xl shadow-lg p-2 ">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'shadow-md'
                    : ''
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Payment History Table */}
        <div className="rounded-xl shadow-lg overflow-hidden  border border-gray-400">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="">
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold">Sr.no</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Amount (₹)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Due Amount (₹)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Payment Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPayments.map((payment, index) => (
                  <tr key={payment.id} className=" transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-400">₹{payment.amount}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-400">₹{payment.dueAmount}</td>
                    <td className="px-4 py-3 text-sm ">{payment.paymentDate}</td>
                    <td className="px-4 py-3 text-sm ">{payment.dueDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {payment.status === 'Paid' && <FaCheckCircle className="w-4 h-4 text-green-500" />}
                        {payment.status === 'Upcoming' && <FaClock className="w-4 h-4 text-orange-500" />}
                        {payment.status === 'Missed' && <FaExclamationCircle className="w-4 h-4 text-red-500" />}
                        <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {payment.status === 'Paid' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 font-medium text-sm">Already Paid</span>
                          <button
                            className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-sm"
                            title="Download Receipt"
                          >
                            <FaDownload className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : payment.status === 'Upcoming' ? (
                        <span className="text-orange-400 font-medium text-sm">Upcoming</span>
                      ) : payment.status === 'Missed' ? (
                        <button
                          onClick={() => handlePayNow(payment)}
                          className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-xs font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          Pay Now
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl shadow-lg p-6 bg-gradient-to-br from-green-900 to-green-800 border border-green-700">
            <div className="flex items-center gap-3 mb-3">
              <FaCheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-green-200">Total Paid</p>
                <h3 className="text-2xl font-bold text-white">
                  ₹{paymentHistory.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl shadow-lg p-6 bg-gradient-to-br from-red-900 to-red-800 border border-red-700">
            <div className="flex items-center gap-3 mb-3">
              <FaExclamationCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-sm text-red-200">Total Due</p>
                <h3 className="text-2xl font-bold text-white">₹{totalDueAmount}</h3>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl shadow-lg p-6 bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700">
            <div className="flex items-center gap-3 mb-3">
              <FaReceipt className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-blue-200">Total Amount</p>
                <h3 className="text-2xl font-bold text-white">
                  ₹{paymentHistory.reduce((sum, p) => sum + p.amount, 0)}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* No Data */}
        {filteredPayments.length === 0 && (
          <div className="text-center py-12 rounded-xl shadow-lg ">
            <FaReceipt className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-xl text-gray-400">No payment records found</p>
            <p className="text-sm text-gray-500 mt-2">No {activeTab.toLowerCase()} payments available</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentHistory;