import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaCalendar, FaChartPie, FaCheckCircle, FaClock, FaTimesCircle, FaEye, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import attendanceService from '../../services/attendanceService';

const SingleStudentAttendece = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState({
    present: 0,
    halfDays: 0,
    absent: 0,
    totalDays: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const student = location.state?.student;

  // Redirect if no student data
  useEffect(() => {
    if (!student) {
      navigate('/students');
    }
  }, [student, navigate]);

  const handleViewAttendance = async () => {
    if (!selectedMonth || !selectedYear) {
      setError('Please select both month and year');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Parse month and year
      const month = parseInt(selectedMonth);
      const year = parseInt(selectedYear);

      if (month < 1 || month > 12) {
        throw new Error('Invalid month. Please enter a month between 1 and 12');
      }

      // Calculate start and end dates for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Fetch attendance records
      const attendanceResponse = await attendanceService.getAttendanceByStudent(
        student.enrollmentId,
        {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          limit: 100
        }
      );

      // Fetch attendance summary
      const summaryResponse = await attendanceService.getStudentAttendanceSummary(
        student.enrollmentId,
        {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      );

      // Update state with fetched data
      setAttendanceRecords(attendanceResponse.data.data || []);
      
      if (summaryResponse.data.attendance) {
        setStats({
          present: summaryResponse.data.attendance.presentDays || 0,
          halfDays: summaryResponse.data.attendance.halfDays || 0,
          absent: summaryResponse.data.attendance.absentDays || 0,
          totalDays: summaryResponse.data.attendance.totalDays || 0
        });
      }

    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Format time from database
  const formatTime = (time) => {
    if (!time) return '--';
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format date from database
  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Format status for display
  const formatStatus = (status) => {
    const statusMap = {
      'present': 'Present',
      'absent': 'Absent',
      'half day': 'Half Day'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/students')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-100"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Student Attendance</h1>
            <p className="text-sm opacity-70">View detailed attendance records</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        {/* Student Info Card */}
        <div className="rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <FaUser className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{student.name}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                <div>
                  <span className="opacity-70">Enrollment ID:</span>
                  <span className="ml-2 font-semibold">{student.enrollmentId}</span>
                </div>
                <div>
                  <span className="opacity-70">Course:</span>
                  <span className="ml-2 font-semibold">{student.course}</span>
                </div>
                <div>
                  <span className="opacity-70">Batch:</span>
                  <span className="ml-2 font-semibold">{student.batch}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold mb-4">Select Date Range</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Month (1-12)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      placeholder="e.g., 1 for January"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <FaCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="2020"
                      max="2099"
                      placeholder="e.g., 2024"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <FaCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  </div>
                </div>
                
                <button
                  onClick={handleViewAttendance}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <FaEye className="w-4 h-4" />
                      View Attendance
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Attendance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl shadow-lg p-6 border-2 border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <FaCheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium opacity-70">Present Days</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl shadow-lg p-6 border-2 border-yellow-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                    <FaClock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium opacity-70">Half Days</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.halfDays}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl shadow-lg p-6 border-2 border-red-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                    <FaTimesCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium opacity-70">Absent Days</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FaChartPie className="w-5 h-5 text-blue-600" />
                  Attendance
                </h3>
                <div className="w-16 h-1 bg-blue-600 rounded-full mt-2"></div>
              </div>
              
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : attendanceRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl opacity-30 mb-4">
                      <FaCalendar />
                    </div>
                    <h3 className="text-xl font-bold opacity-70 mb-2">No attendance records found</h3>
                    <p className="opacity-50">Select a month and year to view attendance records</p>
                  </div>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold opacity-70 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold opacity-70 uppercase tracking-wider">Punch-In</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold opacity-70 uppercase tracking-wider">Punch-Out</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold opacity-70 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {attendanceRecords.map((record, index) => (
                        <tr key={record._id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{formatDate(record.attendance_date)}</td>
                          <td className="px-6 py-4 text-sm">{formatTime(record.in_time)}</td>
                          <td className="px-6 py-4 text-sm">{formatTime(record.out_time)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'half day' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {formatStatus(record.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SingleStudentAttendece;