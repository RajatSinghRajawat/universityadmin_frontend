import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaReceipt, 
  FaDownload, 
  FaSearch, 
  FaFilter, 
  FaCalendar, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaClock, 
  FaPlus, 
  FaEye, 
  FaEdit,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const OptimizedAccounts = () => {
  const navigate = useNavigate();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const itemsPerPage = 8;
  const universityCode = localStorage.getItem('universityCode');

  // API base URL
  const API_BASE_URL = 'http://localhost:5001/api/payments';

  // Memoized filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = !searchTerm || 
        payment.student_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.student_id?.enrollmentId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = !filterType || 
        (filterType === 'Paid' && payment.is_paid) ||
        (filterType === 'Unpaid' && !payment.is_paid);
      
      return matchesSearch && matchesFilter;
    });
  }, [payments, searchTerm, filterType]);

  // Fetch payments data with error handling
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(universityCode && { universityCode }),
        ...(searchTerm && { searchTerm }),
        ...(filterType && { is_paid: filterType === 'Paid' ? 'true' : 'false' })
      });

      const response = await fetch(`${API_BASE_URL}/all?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setPayments(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError(error.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage, universityCode, searchTerm, filterType, itemsPerPage]);

  // Fetch payment statistics
  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (universityCode) params.append('universityCode', universityCode);

      const response = await fetch(`${API_BASE_URL}/statistics?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data || {});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [universityCode]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [fetchPayments, fetchStats]);

  // Mark payment as paid with confirmation
  const markAsPaid = useCallback(async (paymentId) => {
    try {
      const result = await Swal.fire({
        title: 'Mark Payment as Paid',
        input: 'text',
        inputLabel: 'Transaction ID (optional)',
        inputPlaceholder: 'Enter transaction ID',
        showCancelButton: true,
        confirmButtonText: 'Mark as Paid',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          // Optional validation
          return null;
        }
      });

      if (result.isConfirmed) {
        const response = await fetch(`${API_BASE_URL}/status/${paymentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            is_paid: true,
            txn_id: result.value || null
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        
        if (responseData.success) {
          await Swal.fire({
            title: 'Success!',
            text: 'Payment marked as paid successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          
          // Refresh data
          await fetchPayments();
          await fetchStats();
        } else {
          throw new Error(responseData.message || 'Failed to mark payment as paid');
        }
      }
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      await Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to mark payment as paid',
        icon: 'error'
      });
    }
  }, [fetchPayments, fetchStats]);

  // Handle search with debouncing
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((e) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Memoized pagination info
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil((stats.total || 0) / itemsPerPage);
    const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    const endItem = Math.min(currentPage * itemsPerPage, stats.total || 0);
    
    return { totalPages, startItem, endItem };
  }, [stats.total, currentPage, itemsPerPage]);

  // Memoized status helpers
  const getStatusColor = useCallback((isPaid) => {
    return isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  }, []);

  const getStatusIcon = useCallback((isPaid) => {
    return isPaid ? 
      <FaCheckCircle className="w-4 h-4 text-green-600" /> : 
      <FaClock className="w-4 h-4 text-yellow-600" />;
  }, []);

  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="text-red-600 text-6xl mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchPayments}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Accounts & Finance</h1>
              <p className="text-gray-600 mt-1">Financial management and fee tracking</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/accounts/add-payment')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <FaPlus className="w-4 h-4" />
                Add Payment
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg">
                <FaDownload className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Financial Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <h3 className="text-2xl font-bold text-green-600">₹{stats.totalAmount?.toLocaleString() || 0}</h3>
                <p className="text-xs text-gray-500 mt-1">All Payments</p>
              </div>
              <FaMoneyBillWave className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
                <h3 className="text-2xl font-bold text-blue-600">₹{stats.paidAmount?.toLocaleString() || 0}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalAmount ? ((stats.paidAmount/stats.totalAmount)*100).toFixed(1) : 0}% of total
                </p>
              </div>
              <FaCheckCircle className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unpaid Amount</p>
                <h3 className="text-2xl font-bold text-yellow-600">₹{stats.unpaidAmount?.toLocaleString() || 0}</h3>
                <p className="text-xs text-gray-500 mt-1">To be collected</p>
              </div>
              <FaClock className="w-10 h-10 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Rate</p>
                <h3 className="text-2xl font-bold text-purple-600">{stats.paymentRate || 0}%</h3>
                <p className="text-xs text-gray-500 mt-1">Success rate</p>
              </div>
              <FaChartLine className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-500">
            <div className="flex items-center gap-3">
              <FaReceipt className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <h4 className="text-xl font-bold text-indigo-600">{stats.totalPayments || 0}</h4>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Paid Payments</p>
                <h4 className="text-xl font-bold text-green-600">{stats.paidPayments || 0}</h4>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
            <div className="flex items-center gap-3">
              <FaClock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Unpaid Payments</p>
                <h4 className="text-xl font-bold text-yellow-600">{stats.unpaidPayments || 0}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name or enrollment ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={filterType}
                onChange={handleFilterChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Txn ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{payment._id.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.student_id?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{payment.student_id?.enrollmentId || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">EMI Payment</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">₹{payment.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(payment.emi_duedate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.txn_id || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.is_paid)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.is_paid)}`}>
                          {payment.is_paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!payment.is_paid && (
                          <button 
                            onClick={() => markAsPaid(payment._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button 
                          onClick={() => navigate('/accounts/details', { state: { payment } })}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {paginationInfo.totalPages > 1 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {paginationInfo.startItem} to {paginationInfo.endItem} of {stats.total || 0} payments
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                >
                  <FaArrowLeft className="w-3 h-3" />
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(paginationInfo.totalPages, 5) }, (_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 rounded-lg transition-all ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationInfo.totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                    currentPage === paginationInfo.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                >
                  Next
                  <FaArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* No Results */}
        {filteredPayments.length === 0 && !loading && (
          <div className="bg-white text-center py-12 rounded-xl shadow-lg">
            <FaReceipt className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default OptimizedAccounts;
