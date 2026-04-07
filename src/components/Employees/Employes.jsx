import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaEye, FaEdit, FaTrash, FaUser, FaPlus, FaChartBar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getMediaUrl } from '../../utils/mediaUrl';

const Employes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  const universityCode = localStorage.getItem('universityCode');

  // Fetch employees data
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!universityCode) {
        setError('University code not found. Please login again.');
        setLoading(false);
        return;
      }
      
      // Try simple API first (without pagination)
      const params = new URLSearchParams({
        universityCode
      });

      console.log('🔄 Fetching employees with universityCode:', universityCode);
      
      const response = await fetch(`${backendUrl}/api/employees/all-simple?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setEmployees(result.data);
        console.log(`✅ Fetched ${result.data.length} employees from database (Simple API)`);
      } else {
        // Fallback to paginated API
        console.log('⚠️ Simple API failed, trying paginated API...');
        const paginatedParams = new URLSearchParams({
          universityCode,
          page: '1',
          limit: '1000'
        });
        
        const paginatedResponse = await fetch(`${backendUrl}/api/employees/all?${paginatedParams}`);
        const paginatedResult = await paginatedResponse.json();
        
        if (paginatedResult.success) {
          setEmployees(paginatedResult.data);
          console.log(`✅ Fetched ${paginatedResult.data.length} employees from database (Paginated API, Total: ${paginatedResult.total})`);
        } else {
          setError(paginatedResult.message || 'Failed to fetch employees');
          console.error('❌ Failed to fetch employees:', paginatedResult.message);
        }
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('❌ Network error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employee statistics
  const fetchStats = async () => {
    try {
      const params = new URLSearchParams({ universityCode });
      const response = await fetch(`${backendUrl}/api/employees/statistics?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch data on mount and when location changes (e.g., after navigation)
  useEffect(() => {
    if (universityCode) {
      fetchEmployees();
      fetchStats();
    }
  }, [location.pathname, universityCode]);

  // Search employees
  const searchEmployees = async () => {
    if (!searchTerm.trim()) {
      fetchEmployees();
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/employees/search?query=${searchTerm}&universityCode=${universityCode}`);
      const result = await response.json();
      
      if (result.success) {
        setEmployees(result.data);
      } else {
        setError(result.message || 'Search failed');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error searching employees:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchEmployees();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Delete employee
  const deleteEmployee = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(`${backendUrl}/api/employees/delete/${id}`, {
          method: 'DELETE'
        });

        const responseData = await response.json();
        
        if (responseData.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Employee has been deactivated successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          fetchEmployees();
          fetchStats();
        } else {
          Swal.fire({
            title: 'Error!',
            text: responseData.message || 'Failed to delete employee',
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
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
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
            onClick={fetchEmployees}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Server-side search handles filtering, so we use employees directly
  const filteredEmployees = employees;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* Employee Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70 mb-1">Total Employees</p>
                <h3 className="text-2xl font-bold text-blue-600">{stats.overview?.totalEmployees || 0}</h3>
              </div>
              <FaUser className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70 mb-1">Active Employees</p>
                <h3 className="text-2xl font-bold text-green-600">{stats.overview?.activeEmployees || 0}</h3>
              </div>
              <FaUser className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70 mb-1">Inactive Employees</p>
                <h3 className="text-2xl font-bold text-yellow-600">{stats.overview?.inactiveEmployees || 0}</h3>
              </div>
              <FaUser className="w-10 h-10 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70 mb-1">Departments</p>
                <h3 className="text-2xl font-bold text-purple-600">{stats.departmentBreakdown?.length || 0}</h3>
              </div>
              <FaChartBar className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Top Section */}
        <div className="rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-50" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Selectors */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]">
                <option>Select Department</option>
                <option>Computer Science</option>
                <option>Mathematics</option>
                <option>Engineering</option>
                <option>Administration</option>
              </select>
              <select className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]">
                <option>Select Designation</option>
                <option>Professor</option>
                <option>Associate Professor</option>
                <option>Assistant Professor</option>
                <option>Office Manager</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/employees/add-excel')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                <span>+</span> Add Excel
              </button>
              <button
                onClick={() => navigate('/employees/add')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                <FaPlus className="w-4 h-4" />
                Add Employee
              </button>
            </div>
          </div>
        </div>

        {/* Employee Count Display */}
        {filteredEmployees.length > 0 && (
          <div className="rounded-lg shadow-lg p-4 bg-blue-50 border border-blue-200">
            <p className="text-center text-blue-800 font-medium">
              📋 Showing {filteredEmployees.length} employees
            </p>
          </div>
        )}

        {/* No Employees Message */}
        {filteredEmployees.length === 0 && !loading && (
          <div className="rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">No Employees Found</h3>
            <p className="text-gray-600 mb-4">No employees have been added yet.</p>
            <button
              onClick={() => navigate('/employees/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Add First Employee
            </button>
          </div>
        )}

        {/* Employees Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredEmployees.map((employee, index) => (
            <div key={employee._id} className="rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 md:p-6 flex items-center space-x-4">
                {employee.image ? (
                  <img 
                    src={getMediaUrl(employee.image)} 
                    alt={employee.name}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`bg-blue-600 rounded-full h-10 w-10 md:h-12 md:w-12 flex items-center justify-center text-white font-bold text-lg md:text-xl ${employee.image ? 'hidden' : ''}`}
                >
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold">{employee.name}</h3>
                  <p className="text-sm">{employee.designation}</p>
                </div>
              </div>
              
              <div className="px-4 md:px-6 pb-4 space-y-2 md:space-y-3">
                <div className="flex items-center">
                  <span className="w-24 md:w-28 text-xs md:text-sm">Employee ID:</span>
                  <span className="text-xs md:text-sm font-medium">{employee.employeeId}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 md:w-28 text-xs md:text-sm">Department:</span>
                  <span className="text-xs md:text-sm">{employee.department}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 md:w-28 text-xs md:text-sm">Email:</span>
                  <span className="text-xs md:text-sm text-blue-600">{employee.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 md:w-28 text-xs md:text-sm">Phone:</span>
                  <span className="text-xs md:text-sm">{employee.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 md:w-28 text-xs md:text-sm">Salary:</span>
                  <span className="text-xs md:text-sm">₹{employee.salary}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 md:w-28 text-xs md:text-sm">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="px-4 md:px-6 pb-4 md:pb-6 flex items-center justify-between">
                <button
                  onClick={() => navigate('/employees/profile', { state: { employee } })}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-all"
                >
                  <FaEye className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => deleteEmployee(employee._id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-all"
                >
                  <FaTrash className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="rounded-xl shadow-lg p-6">
          <div className="flex justify-center">
            <div className="flex gap-3">
              <button className="px-6 py-3 text-sm rounded-lg transition-all font-medium">Previous</button>
              <button className="px-6 py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">1</button>
              <button className="px-6 py-3 text-sm rounded-lg transition-all font-medium">Next</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


export default Employes;

