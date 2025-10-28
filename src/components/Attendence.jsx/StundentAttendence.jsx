import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaUser, FaCheckCircle, FaTimesCircle, FaClock, FaSearch, FaPlus, FaChartBar, FaHistory } from 'react-icons/fa';
import Swal from 'sweetalert2';

const StundentAttendence = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const universityCode = localStorage.getItem('universityCode');

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5001/api/students/all?universityCode=${universityCode}`);
      const result = await response.json();
      
      if (result.success) {
        setStudents(result.data);
      } else {
        setError(result.message || 'Failed to fetch students');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const classes = [
    'Computer Science - CS101',
    'Computer Science - CS102', 
    'Mathematics - MATH101',
    'Physics - PHY101',
    'English - ENG101'
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAttendance = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const getAttendanceStatus = (studentId) => {
    return attendanceData[studentId] || 'unmarked';
  };

  // Submit attendance for all students
  const submitAttendance = async () => {
    if (Object.keys(attendanceData).length === 0) {
      Swal.fire({
        title: 'No Data!',
        text: 'Please mark attendance for at least one student',
        icon: 'warning'
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const attendanceRecords = Object.entries(attendanceData).map(([studentId, status]) => {
        const student = students.find(s => s._id === studentId);
        return {
          enrollment_id: student?.enrollmentId,
          status: status
        };
      }).filter(record => record.enrollment_id);

      const bulkData = {
        attendanceRecords,
        attendance_date: selectedDate
      };

      const response = await fetch('http://localhost:5001/api/attendance/bulk-mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bulkData)
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: `Attendance marked for ${result.data.successful} students successfully`,
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        });
        setAttendanceData({});
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Failed to mark attendance',
          icon: 'error'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Network Error!',
        text: 'Failed to mark attendance',
        icon: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
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
            onClick={fetchStudents}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getAttendanceStats = () => {
    const total = filteredStudents.length;
    const present = Object.values(attendanceData).filter(status => status === 'present').length;
    const absent = Object.values(attendanceData).filter(status => status === 'absent').length;
    const late = Object.values(attendanceData).filter(status => status === 'late').length;
    const unmarked = total - present - absent - late;
    
    return { total, present, absent, late, unmarked };
  };

  const stats = getAttendanceStats();

  const markAllPresent = () => {
    const newData = {};
    filteredStudents.forEach(student => {
      newData[student._id] = 'present';
    });
    setAttendanceData(newData);
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <FaCalendarCheck className="text-3xl text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Student Attendance</h1>
              <p className="opacity-70">Mark and track daily student attendance</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/attendance/bulk')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
            >
              <FaPlus className="w-4 h-4" />
              Bulk Attendance
            </button>
            <button
              onClick={() => navigate('/attendance/statistics')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
            >
              <FaChartBar className="w-4 h-4" />
              Statistics
            </button>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="rounded-lg shadow p-4 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium opacity-70">Total Students</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="rounded-lg shadow p-4 border-l-4 border-green-500">
            <h3 className="text-sm font-medium opacity-70">Present</h3>
            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
          </div>
          <div className="rounded-lg shadow p-4 border-l-4 border-red-500">
            <h3 className="text-sm font-medium opacity-70">Absent</h3>
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          </div>
          <div className="rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium opacity-70">Late</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
          </div>
          <div className="rounded-lg shadow p-4 border-l-4 border-gray-500">
            <h3 className="text-sm font-medium opacity-70">Unmarked</h3>
            <p className="text-2xl font-bold text-gray-600">{stats.unmarked}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            
            {/* Date and Class Selection */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class/Subject</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
                >
                  <option value="">Select Class</option>
                  {classes.map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-50" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button
                onClick={markAllPresent}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
              >
                Mark All Present
              </button>
              <button
                onClick={submitAttendance}
                disabled={!selectedClass || Object.keys(attendanceData).length === 0 || submitting}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedClass && Object.keys(attendanceData).length > 0 && !submitting
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Attendance'}
              </button>
            </div>
          </div>
        </div>

        {/* Student Attendance List */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Student List</h3>
            <p className="text-sm opacity-70">Mark attendance for each student</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Year</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.map((student) => {
                  const status = getAttendanceStatus(student._id);
                  return (
                    <tr key={student._id} className="transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {student.image ? (
                            <img 
                              src={`http://localhost:5001/${student.image}`} 
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2">
                              <FaUser className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-gray-600">{student.enrollmentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{student.department}</td>
                      <td className="px-6 py-4 text-sm">{student.year}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => markAttendance(student._id, 'present')}
                            className={`p-2 rounded-lg transition-all ${
                              status === 'present' 
                                ? 'bg-green-100 text-green-600 shadow-md' 
                                : 'hover:bg-green-50 text-green-600'
                            }`}
                            title="Present"
                          >
                            <FaCheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'absent')}
                            className={`p-2 rounded-lg transition-all ${
                              status === 'absent' 
                                ? 'bg-red-100 text-red-600 shadow-md' 
                                : 'hover:bg-red-50 text-red-600'
                            }`}
                            title="Absent"
                          >
                            <FaTimesCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'half day')}
                            className={`p-2 rounded-lg transition-all ${
                              status === 'half day' 
                                ? 'bg-yellow-100 text-yellow-600 shadow-md' 
                                : 'hover:bg-yellow-50 text-yellow-600'
                            }`}
                            title="Half Day"
                          >
                            <FaClock className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Attendance History */}
        <div className="rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Attendance History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Present</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Absent</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 text-sm">2024-01-19</td>
                  <td className="px-4 py-3 text-sm">Computer Science - CS101</td>
                  <td className="px-4 py-3 text-sm text-green-600 font-medium">4</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium">1</td>
                  <td className="px-4 py-3 text-sm">80%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">2024-01-18</td>
                  <td className="px-4 py-3 text-sm">Mathematics - MATH101</td>
                  <td className="px-4 py-3 text-sm text-green-600 font-medium">5</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium">0</td>
                  <td className="px-4 py-3 text-sm">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StundentAttendence;