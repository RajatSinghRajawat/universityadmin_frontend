import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaCalendar, FaUsers, FaCheck, FaTimes, FaClock, FaPlus, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const BulkAttendance = () => {
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const universityCode = localStorage.getItem('universityCode');

  // Fetch students for attendance marking
  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
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

  // Add student to attendance list
  const addStudentToAttendance = (student) => {
    const existingRecord = attendanceRecords.find(record => record.enrollment_id === student.enrollmentId);
    if (!existingRecord) {
      setAttendanceRecords(prev => [...prev, {
        enrollment_id: student.enrollmentId,
        status: 'present',
        in_time: '',
        out_time: ''
      }]);
    }
  };

  // Remove student from attendance list
  const removeStudentFromAttendance = (enrollmentId) => {
    setAttendanceRecords(prev => prev.filter(record => record.enrollmentId !== enrollmentId));
  };

  // Update attendance status
  const updateAttendanceStatus = (enrollmentId, status) => {
    setAttendanceRecords(prev => prev.map(record => 
      record.enrollment_id === enrollmentId 
        ? { ...record, status }
        : record
    ));
  };

  // Update time fields
  const updateTime = (enrollmentId, field, value) => {
    setAttendanceRecords(prev => prev.map(record => 
      record.enrollment_id === enrollmentId 
        ? { ...record, [field]: value }
        : record
    ));
  };

  // Submit bulk attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (attendanceRecords.length === 0) {
      Swal.fire({
        title: 'No Records!',
        text: 'Please add at least one student to mark attendance',
        icon: 'warning'
      });
      return;
    }

    if (!attendanceDate) {
      Swal.fire({
        title: 'Date Required!',
        text: 'Please select an attendance date',
        icon: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      
      const bulkData = {
        attendanceRecords,
        attendance_date: attendanceDate
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
        }).then(() => {
          navigate('/attendance');
        });
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
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'half day': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <FaCheck className="w-4 h-4" />;
      case 'absent': return <FaTimes className="w-4 h-4" />;
      case 'half day': return <FaClock className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Attendance
          </button>
          <div>
            <h1 className="text-3xl font-bold">Bulk Attendance Marking</h1>
            <p className="opacity-70 mt-1">Mark attendance for multiple students at once</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Student Selection */}
          <div className="lg:col-span-1">
            <div className="rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaUsers className="w-5 h-5 text-blue-600" />
                Select Students
              </h2>
              
              {studentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading students...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map(student => (
                    <div
                      key={student._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.enrollmentId}</p>
                      </div>
                      <button
                        onClick={() => addStudentToAttendance(student)}
                        disabled={attendanceRecords.some(record => record.enrollment_id === student.enrollmentId)}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Attendance Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Date Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FaCalendar className="w-4 h-4 text-blue-600" />
                    Attendance Date *
                  </label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Attendance Records */}
                <div>
                  <h3 className="text-lg font-bold mb-4">
                    Attendance Records ({attendanceRecords.length} students)
                  </h3>
                  
                  {attendanceRecords.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FaUsers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No students selected for attendance</p>
                      <p className="text-sm">Select students from the left panel</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {attendanceRecords.map((record) => {
                        const student = students.find(s => s.enrollmentId === record.enrollment_id);
                        return (
                          <div key={record.enrollment_id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-medium">{student?.name || 'Unknown Student'}</p>
                                <p className="text-sm text-gray-600">{record.enrollment_id}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeStudentFromAttendance(record.enrollment_id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Status Selection */}
                              <div>
                                <label className="text-sm font-medium mb-2 block">Status *</label>
                                <div className="flex gap-2">
                                  {['present', 'absent', 'half day'].map(status => (
                                    <button
                                      key={status}
                                      type="button"
                                      onClick={() => updateAttendanceStatus(record.enrollment_id, status)}
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                                        record.status === status
                                          ? getStatusColor(status)
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                      }`}
                                    >
                                      {getStatusIcon(status)}
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              {/* In Time */}
                              <div>
                                <label className="text-sm font-medium mb-2 block">In Time</label>
                                <input
                                  type="time"
                                  value={record.in_time}
                                  onChange={(e) => updateTime(record.enrollment_id, 'in_time', e.target.value)}
                                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                              </div>
                              
                              {/* Out Time */}
                              <div>
                                <label className="text-sm font-medium mb-2 block">Out Time</label>
                                <input
                                  type="time"
                                  value={record.out_time}
                                  onChange={(e) => updateTime(record.enrollment_id, 'out_time', e.target.value)}
                                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => navigate('/attendance')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || attendanceRecords.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave className="w-4 h-4" />
                    {loading ? 'Marking Attendance...' : `Mark Attendance (${attendanceRecords.length})`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Instructions</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Select students from the left panel to add them to attendance list</li>
            <li>• Choose attendance status for each student (Present, Absent, Half Day)</li>
            <li>• Optionally set in-time and out-time for each student</li>
            <li>• All students must have a status selected before submitting</li>
            <li>• Attendance date cannot be in the future</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default BulkAttendance;
