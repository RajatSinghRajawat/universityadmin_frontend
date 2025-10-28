import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaChartLine, FaReceipt, FaDownload, FaSearch, FaFilter, FaCalendar, FaCheckCircle, FaExclamationCircle, FaClock, FaPlus, FaEye, FaEdit, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { validateUniversityCode, getUniversityInfo } from '../../utils/universityUtils';

const Accounts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 8;

  // Get university code with validation
  const [universityCode, setUniversityCode] = useState(() => {
    try {
      return validateUniversityCode();
    } catch (error) {
      return localStorage.getItem('universityCode');
    }
  });
  const universityCodes = localStorage.getItem('universityCode');
  const [universityInfo, setUniversityInfo] = useState(() => {
    try {
      return getUniversityInfo();
    } catch (error) {
      return null;
    }
  });

  // Fetch payments data
  const fetchPayments = async () => {
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
      
      // Get current month and year for the API
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      
      const params = new URLSearchParams({
        month: month.toString(),
        year: year.toString(),
        ...(filterType && { filter: filterType.toLowerCase() }),
        ...(universityCode && { universityCode: universityCode })
      });

      const response = await fetch(`http://localhost:5001/api/accounts/all?${params}`);
      const result = await response.json();
      console.log('Payments API response:', result);
      
      if (result.success) {
        // Filter by search term on frontend since backend doesn't support it
        let filteredData = result.data.details || [];
        if (searchTerm) {
          filteredData = filteredData.filter(payment => 
            payment.student_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.student_id?.enrollmentId?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setPayments(filteredData);
        setStats(result.data.summary || {});
      } else {
        setError(result.message || 'Failed to fetch payments');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment statistics - now handled in fetchPayments
  const fetchStats = async () => {
    // Statistics are now returned with the payments data
    // This function is kept for compatibility but stats are set in fetchPayments
  };

  console.log(payments , "payments");

  useEffect(() => {
    // Debug: Check what's in localStorage
    console.log('LocalStorage universityCode:', localStorage.getItem('universityCode'));
    console.log('Current universityCode:', universityCode);
    
    fetchPayments();
    fetchStats();
  }, [searchTerm, filterType, universityCode]);

  // Pagination calculations
  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const paginatedPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  // Mark payment as paid
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
          isPaid: true,
          payment_date: paymentDate,
          txn_id: transactionId || null
        };
        
        console.log('Marking payment as paid:', requestBody);
        
        const response = await fetch(`http://localhost:5001/api/accounts/mark-paid/${paymentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log('Mark payment response:', responseData);
        
        if (responseData.success) {
          Swal.fire({
            title: 'Success!',
            text: responseData.message || `Payment marked as paid on ${new Date(paymentDate).toLocaleDateString()}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          fetchPayments();
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

  const getStatusColor = (isPaid) => {
    return isPaid ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
  };

  const getStatusIcon = (isPaid) => {
    return isPaid ? <FaCheckCircle className="w-4 h-4 text-foreground" /> : <FaClock className="w-4 h-4 text-foreground" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading payment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchPayments}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg"
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
        
        {/* Header with Account Type Selection */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Accounts & Finance</h1>
              <p className="opacity-70 mt-1 text-muted-foreground">Financial management and fee tracking</p>
              {universityInfo && (
                <p className="text-sm text-muted-foreground mt-1">
                  University: {universityInfo.name} ({universityCode})
                </p>
              )}
            </div>
            
            {/* Account Type Selection */}
            <div className="flex gap-2">
              <button 
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all shadow-lg"
              >
                <FaUser className="w-4 h-4" />
                Students Account
              </button>
              <button 
                className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-all"
              >
                <FaUser className="w-4 h-4" />
                Employee Account
              </button>
            </div>
          </div>
          
          {/* Date Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <select 
                value={new Date().getMonth()}
                className="px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
              >
                <option value={0}>January</option>
                <option value={1}>February</option>
                <option value={2}>March</option>
                <option value={3}>April</option>
                <option value={4}>May</option>
                <option value={5}>June</option>
                <option value={6}>July</option>
                <option value={7}>August</option>
                <option value={8}>September</option>
                <option value={9}>October</option>
                <option value={10}>November</option>
                <option value={11}>December</option>
              </select>
              <select 
                value={new Date().getFullYear()}
                className="px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              {/* <button 
                onClick={() => navigate('/accounts/add-payment')}
                className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium"
              >
                <FaPlus className="w-4 h-4" />
                Add Payment
              </button> */}
              <button className="flex items-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium">
                <FaDownload className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="rounded-lg shadow-lg p-6 bg-card border border-border">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Total Amount</h2>
            <div className="mb-6">
              <FaMoneyBillWave className="w-12 h-12 text-foreground mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-foreground">₹{(stats.totalCollectedFees + stats.totalMissedFees + stats.totalUpcomingFees)?.toLocaleString() || 0}</h3>
            </div>
            <p className="text-muted-foreground text-sm">Updated Amount for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Received Card */}
          <div className="rounded-lg shadow-lg p-6 bg-card border border-border">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">Received</h3>
              <div className="mb-4">
                <FaCheckCircle className="w-10 h-10 text-foreground mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-foreground">₹{stats.totalCollectedFees?.toLocaleString() || 0}</h4>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Updated Amount</p>
              <button 
                onClick={() => navigate('/accounts/received')}
                className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all"
              >
                More Details
              </button>
            </div>
          </div>

          {/* Upcoming Card */}
          <div className="rounded-lg shadow-lg p-6 bg-card border border-border">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">Upcoming</h3>
              <div className="mb-4">
                <FaClock className="w-10 h-10 text-foreground mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-foreground">₹{stats.totalUpcomingFees?.toLocaleString() || 0}</h4>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Updated Amount</p>
              <button 
                onClick={() => navigate('/accounts/upcoming')}
                className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all"
              >
                More Details
              </button>
            </div>
          </div>

          {/* Missed Card */}
          <div className="rounded-lg shadow-lg p-6 bg-card border border-border">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">Missed</h3>
              <div className="mb-4">
                <FaExclamationCircle className="w-10 h-10 text-foreground mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-foreground">₹{stats.totalMissedFees?.toLocaleString() || 0}</h4>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Updated Amount</p>
              <button 
                onClick={() => navigate('/accounts/missed')}
                className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all"
              >
                More Details
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions Summary */}
        <div className="rounded-lg shadow-lg p-6 bg-card border border-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-foreground">Recent Transactions</h3>
            <button 
              onClick={() => navigate('/accounts/all-transactions')}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all"
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <FaReceipt className="w-8 h-8 text-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <h4 className="text-xl font-bold text-foreground">{stats.totalPayments || 0}</h4>
            </div>
            
            <div className="text-center p-4 bg-secondary rounded-lg">
              <FaCheckCircle className="w-8 h-8 text-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Paid</p>
              <h4 className="text-xl font-bold text-foreground">{payments.filter(p => p.is_paid).length}</h4>
            </div>
            
            <div className="text-center p-4 bg-secondary rounded-lg">
              <FaClock className="w-8 h-8 text-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Pending</p>
              <h4 className="text-xl font-bold text-foreground">{payments.filter(p => !p.is_paid).length}</h4>
            </div>
            
            <div className="text-center p-4 bg-secondary rounded-lg">
              <FaExclamationCircle className="w-8 h-8 text-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Overdue</p>
              <h4 className="text-xl font-bold text-foreground">{payments.filter(p => new Date(p.emi_duedate) < new Date() && !p.is_paid).length}</h4>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Accounts;