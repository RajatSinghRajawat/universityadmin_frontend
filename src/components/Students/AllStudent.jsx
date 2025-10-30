import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaEdit, FaTrash, FaUser, FaEllipsisV } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AllStudent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentPaymentStatus, setStudentPaymentStatus] = useState({});
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(backendUrl);
  const toggleDropdown = (studentId) => {
    setDropdownOpen(dropdownOpen === studentId ? null : studentId);
  };

const universityCode = localStorage.getItem('universityCode');

  // Fetch courses for filter dropdown
  const getCourses = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/courses/get?universityCode=${universityCode}`);
      const result = await response.json();
      
      if (result.success) {
        setCourses(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const getStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      const response = await fetch(`${backendUrl}/api/students/all?universityCode=${universityCode}`, requestOptions);
      const result = await response.json();
      
      if (result.success) {
        setStudents(result.data);
        // Check payment status for each student
        checkPaymentStatusForAllStudents(result.data);
      } else {
        setError(result.message || 'Failed to fetch students');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }

  // Check payment status for all students
  const checkPaymentStatusForAllStudents = async (studentsList) => {
    const paymentStatusPromises = studentsList.map(async (student) => {
      try {
        const response = await fetch(`${backendUrl}/api/accounts/student/${student._id}?universityCode=${universityCode}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          // Check if student has any unpaid payments
          const hasUnpaidPayments = result.data.some(payment => !payment.is_paid);
          return { studentId: student._id, hasUnpaidPayments };
        }
        return { studentId: student._id, hasUnpaidPayments: false };
      } catch (error) {
        console.error(`Error checking payment status for student ${student._id}:`, error);
        return { studentId: student._id, hasUnpaidPayments: false };
      }
    });

    try {
      const paymentStatuses = await Promise.all(paymentStatusPromises);
      const statusMap = {};
      paymentStatuses.forEach(({ studentId, hasUnpaidPayments }) => {
        statusMap[studentId] = hasUnpaidPayments;
      });
      setStudentPaymentStatus(statusMap);
    } catch (error) {
      console.error('Error checking payment statuses:', error);
    }
  }


  const searchStudents = async () => {
    if (!searchTerm.trim()) {
      // If search term is empty, fetch all students
      getStudents();
      return;
    }

    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      const response = await fetch(`${backendUrl}/api/students/search?query=${searchTerm}`, requestOptions);
      const result = await response.json();
      
      if (result.success) {
        setStudents(result.data);
      } else {
        setError(result.message || 'Search failed');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error searching students:', error);
    }
  }

  const deleteStudent = async (id) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };
      
      const response = await fetch(`${backendUrl}/api/students/delete/${id}`, requestOptions);
      const result = await response.json();
      
      if (result.success) {
        // Remove the deleted student from the local state
        setStudents(prevStudents => prevStudents.filter(student => student._id !== id));
        
        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "Student has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Show error message
        Swal.fire({
          title: "Error!",
          text: result.message || 'Failed to delete student',
          icon: "error"
        });
      }
    } catch (error) {
      // Show network error message
      Swal.fire({
        title: "Network Error!",
        text: "Network error occurred while deleting student",
        icon: "error"
      });
    }
  }

  useEffect(() => {
    getStudents();
    getCourses();
  }, []);

  // Refresh payment status when component becomes visible (e.g., returning from payment page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && students.length > 0) {
        checkPaymentStatusForAllStudents(students);
      }
    };

    const handleFocus = () => {
      if (students.length > 0) {
        checkPaymentStatusForAllStudents(students);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [students]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchStudents();
      } else {
        getStudents(); // If search is empty, fetch all students
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  
  useEffect(() => {
  }, [selectedCourse, selectedBatch]);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);


 
  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = !selectedCourse || student.course_id?._id === selectedCourse;
    
    const matchesBatch = !selectedBatch || student.year === selectedBatch;
    
    return matchesSearch && matchesCourse && matchesBatch;
  });

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
            onClick={getStudents}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* Top Section */}
        <div className="rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-50" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Selectors */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
              <select 
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
              >
                <option value="">All Batches</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate('/students/ex-students')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                Ex-Student
              </button>
              <button
                onClick={() => navigate('/students/add-excel')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                <span>+</span> Add Excel
              </button>
              <button
                onClick={() => navigate('/students/add')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                <span>+</span> Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="rounded-xl shadow-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
            <span className="px-4 py-2 rounded-lg text-sm font-medium">Rt</span>
          </label>
        </div>

        {/* Students Table */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {['ID', 'Enrollment ID', 'Image', 'Name', 'Email', 'Course', 'Department', 'Year', 'Action'].map(header => (
                    <th key={header} className="px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.map((student, index) => (
                  <tr key={student._id} className="transition-colors">
                    <td className="px-4 md:px-6 py-4 text-sm text-blue-600 font-semibold">{index + 1}</td>
                    <td className="px-4 md:px-6 py-4 text-sm font-medium">{student.enrollmentId || 'N/A'}</td>
                    <td className="px-4 md:px-6 py-4">
                      {student.image ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2">
                          <img 
                            src={`${backendUrl}/${student.image}`} 
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-gray-100">
                          <FaUser className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm font-medium">{student.name}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">{student.email}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      {student.course_id ? (
                        <div className="text-xs">
                          <div className="font-medium">{student.course_id.courseName}</div>
                          <div className="text-gray-500">{student.course_id.courseCode}</div>
                          <div className="text-green-600 font-semibold">
                            ₹{student.course_id.discountPrice > 0 ? student.course_id.discountPrice?.toLocaleString() : student.course_id.price?.toLocaleString()}
                            {student.course_id.discountPrice > 0 && (
                              <span className="text-gray-400 text-xs ml-1">(Discounted)</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No Course</span>
                      )}
                    </td>
                    {/* <td className="px-4 md:px-6 py-4 text-sm">{student.phone}</td> */}
                    <td className="px-4 md:px-6 py-4 text-sm">{student.department}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">{student.year}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                       
                        <button 
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            student.final_amount === 0 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          }`}
                          onClick={() => student.final_amount === 0 && navigate(`/accounts/add-payment/${student._id}`, { state: { student } })}
                          disabled={student.final_amount !== 0}
                          title={student.final_amount === 0 ? 'Add payment for this student' : 'Payment already exists for this student'}
                        >
                          {student.final_amount === 0 ? 'Add Payment' : 'Payment Added'}
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(student._id);
                            }}
                            className="p-2 rounded-lg transition-all"
                          >
                            <FaEllipsisV className="w-4 h-4" />
                          </button>

                          {dropdownOpen === student._id && (
                            <div className="absolute bg-white right-0 mt-2 w-44 rounded-xl shadow-xl z-20 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  navigate(`/student-profile/${student._id}`, { state: { student } });
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <FaEye className="w-4 h-4" />
                                <span>View Profile</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  navigate('/attendance/single-student', { state: { student } });
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors"
                              >
                                <FaEdit className="w-4 h-4" />
                                <span>Attendence</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  navigate('/students/payment-history', { 
                                    state: { 
                                      student,
                                      universityCode: universityCode 
                                    } 
                                  });
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                              >
                                <FaEdit className="w-4 h-4" />
                                <span>Payment History</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  Swal.fire({
                                    title: "Are you sure?",
                                    text: "You won't be able to revert this!",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, delete it!"
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      deleteStudent(student._id);
                                    }
                                  });
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <FaTrash className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default AllStudent;