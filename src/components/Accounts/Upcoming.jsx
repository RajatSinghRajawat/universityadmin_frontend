import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaDownload, FaSearch, FaFilter, FaCalendar, FaReceipt, FaUser, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import { validateUniversityCode, getUniversityInfo } from '../../utils/universityUtils';
import Swal from 'sweetalert2';

const Upcoming = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const itemsPerPage = 10;

  // Get university code with validation
  const [universityCode, setUniversityCode] = useState(() => {
    try {
      return validateUniversityCode();
    } catch (error) {
      return localStorage.getItem('universityCode');
    }
  });

  const [universityInfo, setUniversityInfo] = useState(() => {
    try {
      return getUniversityInfo();
    } catch (error) {
      return null;
    }
  });

  // Fetch upcoming payments data
  const fetchUpcomingPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!universityCode) {
        const fallbackCode = localStorage.getItem('universityCode');
        if (!fallbackCode) {
          setError('University code not found. Please login again.');
          return;
        }
        setUniversityCode(fallbackCode);
      }
      
      const params = new URLSearchParams({
        month: selectedMonth.toString(),
        year: selectedYear.toString(),
        filter: 'upcoming',
        ...(universityCode && { universityCode: universityCode })
      });

      console.log('Fetching upcoming payments with params:', params.toString());
      const response = await fetch(`http://localhost:5001/api/accounts/all?${params}`);
      const result = await response.json();
      console.log('Upcoming payments API response:', result);
      
      if (result.success) {
        let filteredData = result.data.details || [];
        if (searchTerm) {
          filteredData = filteredData.filter(payment => 
            payment.student_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.student_id?.enrollmentId?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setPayments(filteredData);
      } else {
        setError(result.message || 'Failed to fetch upcoming payments');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching upcoming payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingPayments();
  }, [searchTerm, selectedMonth, selectedYear, universityCode]);

  // Pagination calculations
  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const paginatedPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Mark payment as paid (for early payments)
  const markAsPaid = async (paymentId) => {
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
          emiId: paymentId,
          isPaid: true,
          payment_date: paymentDate,
          txn_id: transactionId || null
        };
        
        // Add university code if available
        if (universityCode) {
          requestBody.universityCode = universityCode;
        }
        
        const response = await fetch(`http://localhost:5001/api/accounts/mark-paid/${paymentId}`, {
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
          fetchUpcomingPayments();
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
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading upcoming payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchUpcomingPayments}
            className="bg-primary hover:bg-primary/90 text-foreground px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/accounts')}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 text-foreground rounded-lg transition-all"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Accounts
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Upcoming Payments</h1>
              <p className="opacity-70 mt-1 text-muted-foreground">Future payments and pending transactions</p>
              {universityInfo && (
                <p className="text-sm text-muted-foreground mt-1">
                  University: {universityInfo.name} ({universityCode})
                </p>
              )}
            </div>
          </div>
          
          {/* Date Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-3 bg-secondary hover:bg-secondary/90 text-foreground rounded-lg transition-all font-medium">
              <FaDownload className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="rounded-lg shadow-lg p-6 bg-card border border-border">
          <div className="text-center">
            <div className="mb-4">
              <FaClock className="w-12 h-12 text-foreground mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Total Upcoming Amount</h2>
              <h3 className="text-3xl font-bold text-foreground">₹{totalAmount.toLocaleString()}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary rounded-lg p-4">
                <FaReceipt className="w-6 h-6 text-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Upcoming Payments</p>
                <h4 className="text-xl font-bold text-foreground">{payments.length}</h4>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <FaUser className="w-6 h-6 text-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Students with Upcoming</p>
                <h4 className="text-xl font-bold text-foreground">{new Set(payments.map(p => p.student_id?._id)).size}</h4>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <FaMoneyBillWave className="w-6 h-6 text-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Average Amount</p>
                <h4 className="text-xl font-bold text-foreground">₹{payments.length > 0 ? Math.round(totalAmount / payments.length).toLocaleString() : 0}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-xl shadow-lg p-4 bg-card border border-border">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by student name or enrollment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-gray-400 focus:ring-2 focus:ring-ring focus:border-ring transition-all"
            />
          </div>
        </div>

        {/* Payments Table */}
        <div className="rounded-xl shadow-lg overflow-hidden bg-card border border-border">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-secondary">
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Days Until Due</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {paginatedPayments.map((payment) => {
                  const daysUntilDue = Math.ceil((new Date(payment.emi_duedate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={payment._id} className="hover:bg-secondary transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{payment._id.slice(-6)}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{payment.student_id?.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{payment.student_id?.enrollmentId || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">₹{payment.amount?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(payment.emi_duedate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{daysUntilDue > 0 ? `${daysUntilDue} days` : 'Due today'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaClock className="w-4 h-4 text-foreground" />
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-primary text-foreground">
                            Upcoming
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => markAsPaid(payment._id)}
                            className="bg-green-600 hover:bg-green-700 text-foreground px-3 py-1 rounded text-sm font-medium transition-all"
                          >
                            <FaCheckCircle className="w-3 h-3 inline mr-1" />
                            Mark Paid
                          </button>
                          <button 
                            onClick={() => navigate('/accounts/details', { state: { payment } })}
                            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstPayment + 1} to {Math.min(indexOfLastPayment, payments.length)} of {payments.length} payments
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-secondary text-gray-500' : 'hover:bg-secondary/90 bg-secondary text-foreground'
                  }`}
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === index + 1
                          ? 'bg-primary text-foreground'
                          : 'hover:bg-secondary/90 bg-secondary text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-secondary text-gray-500' : 'hover:bg-secondary/90 bg-secondary text-foreground'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* No Results */}
        {payments.length === 0 && !loading && (
          <div className="text-center py-12 rounded-xl shadow-lg bg-card border border-border">
            <FaClock className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-xl text-muted-foreground">No upcoming payments found</p>
            <p className="text-sm text-gray-500 mt-2">All payments for this period have been processed</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Upcoming;
