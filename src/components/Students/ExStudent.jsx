import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaEdit, FaTrash, FaUser, FaEllipsisV, FaUndo, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ExStudent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [exStudents, setExStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleDropdown = (studentId) => {
    setDropdownOpen(dropdownOpen === studentId ? null : studentId);
  };

  const universityCode = localStorage.getItem('universityCode');

  const getExStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      const response = await fetch(`http://localhost:5001/api/students/ex-students?universityCode=${universityCode}`, requestOptions);
      const result = await response.json();
      
      if (result.success) {
        setExStudents(result.data);
      } else {
        setError(result.message || 'Failed to fetch ex-students');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching ex-students:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchExStudents = async () => {
    if (!searchTerm.trim()) {
      getExStudents();
      return;
    }

    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      const response = await fetch(`http://localhost:5001/api/students/search?query=${searchTerm}&universityCode=${universityCode}`, requestOptions);
      const result = await response.json();
      
      if (result.success) {
        // Filter only ex-students from search results
        const filteredExStudents = result.data.filter(student => student.status === 'deactive');
        setExStudents(filteredExStudents);
      } else {
        setError(result.message || 'Search failed');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error searching ex-students:', error);
    }
  };

  const reactivateStudent = async (id) => {
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'active' }),
        redirect: "follow"
      };
      
      const response = await fetch(`http://localhost:5001/api/students/reactivate/${id}`, requestOptions);
      const result = await response.json();
      
      if (result.success) {
        // Remove the reactivated student from ex-students list
        setExStudents(prevStudents => prevStudents.filter(student => student._id !== id));
        
        // Show success message
        Swal.fire({
          title: "Reactivated!",
          text: "Student has been reactivated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Show error message
        Swal.fire({
          title: "Error!",
          text: result.message || 'Failed to reactivate student',
          icon: "error"
        });
      }
    } catch (error) {
      // Show network error message
      Swal.fire({
        title: "Network Error!",
        text: "Network error occurred while reactivating student",
        icon: "error"
      });
    }
  };

  const permanentlyDeleteStudent = async (id) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };
      
      const response = await fetch(`http://localhost:5001/api/students/delete/${id}`, requestOptions);
      const result = await response.json();
      
      if (result.success) {
        // Remove the deleted student from the local state
        setExStudents(prevStudents => prevStudents.filter(student => student._id !== id));
        
        // Show success message
        Swal.fire({
          title: "Permanently Deleted!",
          text: "Student has been permanently deleted from the system.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Show error message
        Swal.fire({
          title: "Error!",
          text: result.message || 'Failed to permanently delete student',
          icon: "error"
        });
      }
    } catch (error) {
      // Show network error message
      Swal.fire({
        title: "Network Error!",
        text: "Network error occurred while permanently deleting student",
        icon: "error"
      });
    }
  };

  useEffect(() => {
    getExStudents();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchExStudents();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ex-students...</p>
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
            onClick={getExStudents}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
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
        
        {/* Header Section */}
        <div className="rounded-xl shadow-lg p-4 md:p-6 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/students')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
                <span>Back to All Students</span>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ex-Students</h1>
                <p className="text-gray-600">Manage deactivated students</p>
              </div>
            </div>
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-medium">
              Total: {exStudents.length} Ex-Students
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
                placeholder="Search ex-students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>

            {/* Selectors */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 min-w-[160px]">
                <option>Select Course</option>
                <option>Computer Science</option>
                <option>Business Administration</option>
                <option>Engineering</option>
                <option>Liberal Arts</option>
              </select>
              <select className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 min-w-[140px]">
                <option>Select Batch</option>
                <option>2023-24</option>
                <option>2024-25</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/students')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                View Active Students
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="rounded-xl shadow-lg p-4 bg-red-50">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
              <span className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800">Deactivated</span>
            </label>
            <div className="text-sm text-gray-600">
              Showing {exStudents.length} deactivated students
            </div>
          </div>
        </div>

        {/* Ex-Students Table */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-red-50">
                <tr>
                  {['ID', 'Enrollment ID', 'Image', 'Name', 'Email', 'Department', 'Year', 'Status', 'Action'].map(header => (
                    <th key={header} className="px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-red-800">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {exStudents.map((student, index) => (
                  <tr key={student._id} className="transition-colors hover:bg-red-50">
                    <td className="px-4 md:px-6 py-4 text-sm text-red-600 font-semibold">{index + 1}</td>
                    <td className="px-4 md:px-6 py-4 text-sm font-medium">{student.enrollmentId || 'N/A'}</td>
                    <td className="px-4 md:px-6 py-4">
                      {student.image ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-200">
                          <img 
                            src={`http://localhost:5001/${student.image}`} 
                            alt={student.name}
                            className="w-full h-full object-cover grayscale"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-red-200 bg-red-100">
                          <FaUser className="w-5 h-5 text-red-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-600">{student.name}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-500">{student.email}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-500">{student.department}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-500">{student.year}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Deactivated
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/accounts/add-payment/${student._id}`, { state: { student } })}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all opacity-50 cursor-not-allowed"
                          disabled
                          title="Payment disabled for ex-students"
                        >
                          Add Payment
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(student._id);
                            }}
                            className="p-2 rounded-lg transition-all hover:bg-red-100"
                          >
                            <FaEllipsisV className="w-4 h-4 text-red-600" />
                          </button>

                          {dropdownOpen === student._id && (
                            <div className="absolute bg-white right-0 mt-2 w-48 rounded-xl shadow-xl z-20 overflow-hidden border border-red-200" onClick={(e) => e.stopPropagation()}>
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
                                  Swal.fire({
                                    title: "Reactivate Student?",
                                    text: "This will make the student active again!",
                                    icon: "question",
                                    showCancelButton: true,
                                    confirmButtonColor: "#10b981",
                                    cancelButtonColor: "#6b7280",
                                    confirmButtonText: "Yes, reactivate!"
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      reactivateStudent(student._id);
                                    }
                                  });
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors"
                              >
                                <FaUndo className="w-4 h-4" />
                                <span>Reactivate</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  Swal.fire({
                                    title: "Permanently Delete?",
                                    text: "This action cannot be undone! Student will be permanently removed from the system.",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#dc2626",
                                    cancelButtonColor: "#6b7280",
                                    confirmButtonText: "Yes, delete permanently!"
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      permanentlyDeleteStudent(student._id);
                                    }
                                  });
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <FaTrash className="w-4 h-4" />
                                <span>Delete Permanently</span>
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

        {/* Empty State */}
        {exStudents.length === 0 && (
          <div className="rounded-xl shadow-lg p-12 text-center">
            <div className="text-red-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Ex-Students Found</h3>
            <p className="text-gray-600 mb-6">There are currently no deactivated students in the system.</p>
            <button
              onClick={() => navigate('/students')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              View Active Students
            </button>
          </div>
        )}

        {/* Pagination */}
        {exStudents.length > 0 && (
          <div className="rounded-xl shadow-lg p-6">
            <div className="flex justify-center">
              <div className="flex gap-3">
                <button className="px-6 py-3 text-sm rounded-lg transition-all font-medium">Previous</button>
                <button className="px-6 py-3 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium">1</button>
                <button className="px-6 py-3 text-sm rounded-lg transition-all font-medium">Next</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExStudent;