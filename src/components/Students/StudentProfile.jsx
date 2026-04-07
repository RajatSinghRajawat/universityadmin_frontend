import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaUsers, FaIdCard, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { getMediaUrl } from '../../utils/mediaUrl';

const StudentProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const getStudent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      const response = await fetch(`${backendUrl}/api/students/get/${id}`, requestOptions);
      const result = await response.json();
      
      if (result.success) {
        setStudent(result.data);
      } else {
        setError(result.message || 'Failed to fetch student details');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      setCoursesLoading(true);
      const universityCode = localStorage.getItem('universityCode');
      if (!universityCode) {
        console.log('No university code found, skipping course load');
        setCourses([]);
        return;
      }
      
      const response = await fetch(`${backendUrl}/api/courses/all?universityCode=${universityCode}&isActive=true`);
      const result = await response.json();
      
      if (result.success) {
        setCourses(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('Failed to load courses:', result.message);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Open edit modal and populate form data
  const openEditModal = () => {
    if (student) {
      setEditFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        address: student.address || '',
        department: student.department || '',
        year: student.year || '',
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || '',
        emergencyContact: student.emergencyContact || '',
        universityCode: student.universityCode || '',
        enrollmentId: student.enrollmentId || '',
        joiningDate: student.JoiningDate || '',
        dateOfBirth: student.DateOfBirth || '',
        gender: student.Gender || '',
        aadharNo: student.aadharNo || '',
        course_id: student.course_id?._id || '',
        image: null
      });
      setImagePreview(student.image ? getMediaUrl(student.image) : null);
      setShowEditModal(true);
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditFormData({});
    setImagePreview(null);
    setEditError(null);
  };

  // Handle form input changes
  const handleEditChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setEditFormData({
        ...editFormData,
        image: file
      });
      
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (e.target.name === 'course_id') {
      const selectedCourse = courses.find(course => course._id === e.target.value);
      setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value,
        department: selectedCourse ? selectedCourse.department : editFormData.department
      });
    } else {
      setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value
      });
    }
  };

  // Update student
  const updateStudent = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);

    try {
      const formdata = new FormData();
      
      // Add all form fields
      formdata.append('name', editFormData.name);
      formdata.append('email', editFormData.email);
      formdata.append('phone', editFormData.phone);
      formdata.append('address', editFormData.address);
      formdata.append('department', editFormData.department);
      formdata.append('year', editFormData.year);
      formdata.append('guardianName', editFormData.guardianName);
      formdata.append('guardianPhone', editFormData.guardianPhone);
      formdata.append('emergencyContact', editFormData.emergencyContact);
      formdata.append('universityCode', editFormData.universityCode);
      formdata.append('enrollmentId', editFormData.enrollmentId);
      formdata.append('JoiningDate', editFormData.joiningDate);
      formdata.append('DateOfBirth', editFormData.dateOfBirth);
      formdata.append('Gender', editFormData.gender);
      formdata.append('aadharNo', editFormData.aadharNo);
      formdata.append('course_id', editFormData.course_id);
      
      // Add image if selected
      if (editFormData.image) {
        formdata.append('image', editFormData.image);
      }

      const requestOptions = {
        method: "PUT",
        body: formdata,
        redirect: "follow"
      };

      const response = await fetch(`${backendUrl}/api/students/update/${id}`, requestOptions);
      const result = await response.json();
      
      if (result.success) {
        // Update the student data
        setStudent(result.data);
        closeEditModal();
        alert('Student updated successfully!');
      } else {
        setEditError(result.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      setEditError('Network error occurred');
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getStudent();
      loadCourses();
    }
  }, [id]);

  // Try to get student data from navigation state first
  useEffect(() => {
    if (location.state?.student) {
      setStudent(location.state.student);
      setLoading(false);
    } else if (id) {
      getStudent();
    }
  }, [location.state, id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading student profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={getStudent}
            className="bg-blue-600 mb-4  px-6 py-2 rounded-lg"
          >
            Retry
          </button>
          <button 
            onClick={() => navigate('/students')}
            className=" px-6 py-2 rounded-lg ml-2"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  // No student data
  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-600 dark:text-gray-400 text-xl mb-4">📝</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">No student data found</p>
          <button 
            onClick={() => navigate('/students')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header with Back Button and Edit Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/students')}
              className="flex items-center gap-2 px-4 py-2rounded-lg transition-all duration-200"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Students</span>
            </button>
            <h1 className="text-2xl font-bold ">Student Profile</h1>
          </div>
          
          {/* Edit Button */}
          <button
            onClick={openEditModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>

        {/* Header Section */}
        <div className="rounded-xl shadow-lg overflow-hidden">
        {/* Purple Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full border-2 border-white border-opacity-30 overflow-hidden">
              {student.image ? (
                <img 
                  src={getMediaUrl(student.image)} 
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-100">
                  <FaUser className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <p className="text-purple-100 opacity-90">{student.department} - {student.year}</p>
              {student.course_id && (
                <p className="text-purple-100 opacity-75 text-sm mt-1">
                  {student.course_id.courseName} ({student.course_id.courseCode})
                  {student.course_id.discountPrice > 0 && (
                    <span className="ml-2 text-green-300">
                      - ₹{student.course_id.discountPrice?.toLocaleString()} (Discounted)
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Student Details Section */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaIdCard className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">Student Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium ">Enrollment ID</label>
              <p className="text-sm font-medium mt-1 ">{student.enrollmentId || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium ">Joining Date</label>
              <p className="text-sm font-medium mt-1 ">{student.JoiningDate || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium ">Date of Birth</label>
              <p className="text-sm font-medium mt-1 ">{student.DateOfBirth || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium ">Gender</label>
              <p className="text-sm font-medium mt-1 ">{student.Gender || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium ">Email</label>
              <p className="text-sm font-medium mt-1.5 ">{student.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Contact Number</label>
              <p className="text-sm font-medium mt-1.5">{student.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium ">Department</label>
              <p className="text-sm font-medium mt-1">{student.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Year</label>
              <p className="text-sm font-medium mt-1 ">{student.year}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <p className="text-sm font-medium mt-1">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {student.status || 'Active'}
                </span>
              </p>
            </div>
            {student.course_id && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Course Information</label>
                <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-blue-700 dark:text-blue-300">Course Name:</span>
                      <p className="text-gray-700 dark:text-gray-300">{student.course_id.courseName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700 dark:text-blue-300">Course Code:</span>
                      <p className="text-gray-700 dark:text-gray-300">{student.course_id.courseCode}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700 dark:text-blue-300">Duration:</span>
                      <p className="text-gray-700 dark:text-gray-300">{student.course_id.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700 dark:text-blue-300">Semester:</span>
                      <p className="text-gray-700 dark:text-gray-300">{student.course_id.semester}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700 dark:text-blue-300">Course Fee:</span>
                      <p className="text-gray-700 dark:text-gray-300">
                        {student.course_id.discountPrice > 0 ? (
                          <>
                            <span className="text-green-600 font-semibold">₹{student.course_id.discountPrice?.toLocaleString()}</span>
                            <span className="text-gray-500 text-xs ml-2 line-through">₹{student.course_id.price?.toLocaleString()}</span>
                            <span className="text-xs text-green-600 ml-1">(Discounted)</span>
                          </>
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">₹{student.course_id.price?.toLocaleString()}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Address Section */}
        <div className="rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold ">Address</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-3 ">Address Information</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-sm font-medium">Full Address</label>
                <p className="text-sm font-medium mt-1 ">{student.address || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Guardian & Contact Details Section */}
        <div className="rounded-xl shadow-lg  p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaUsers className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold ">Guardian & Contact Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium">Guardian's Name</label>
            <p className="text-sm font-medium mt-1 ">{student.guardianName || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Guardian's Phone</label>
            <p className="text-sm font-medium mt-1 text-blue-600 dark:text-blue-400">{student.guardianPhone || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Emergency Contact</label>
            <p className="text-sm font-medium mt-1 text-blue-600 dark:text-blue-400">{student.emergencyContact || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Aadhar Number</label>
            <p className="text-sm font-medium mt-1 ">{student.aadharNo || 'N/A'}</p>
          </div>
        </div>
      </div>

        {/* Additional Information Section */}
        <div className="rounded-xl shadow-lg  p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaIdCard className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold ">Additional Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">University Code</label>
            <p className="text-sm font-medium mt-1 ">{student.universityCode || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Student ID</label>
            <p className="text-sm font-medium mt-1 ">{student._id || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Student Profile</h2>
                <button
                  onClick={closeEditModal}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Error Message */}
              {editError && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <p className="font-medium">Error:</p>
                  <p>{editError}</p>
                </div>
              )}

              {/* Edit Form */}
              <form onSubmit={updateStudent} className="space-y-6">
                {/* Personal Information */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editFormData.dateOfBirth || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Gender</label>
                      <select
                        name="gender"
                        value={editFormData.gender || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Address</label>
                      <textarea
                        name="address"
                        value={editFormData.address || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Course</label>
                      <select
                        name="course_id"
                        value={editFormData.course_id || ''}
                        onChange={handleEditChange}
                        disabled={coursesLoading}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      >
                        <option value="">
                          {coursesLoading 
                            ? 'Loading courses...' 
                            : courses.length === 0 
                              ? 'No courses available' 
                              : 'Select Course'
                          }
                        </option>
                        {courses.map((course) => (
                          <option key={course._id} value={course._id}>
                            {course.courseCode} - {course.courseName} ({course.department}) - ₹{course.discountPrice > 0 ? course.discountPrice?.toLocaleString() : course.price?.toLocaleString()}{course.discountPrice > 0 ? ` (Discounted)` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Department</label>
                      <input
                        type="text"
                        name="department"
                        value={editFormData.department || ''}
                        onChange={handleEditChange}
                        readOnly
                        className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-100 border-gray-300 text-gray-600' : 'bg-gray-700 border-gray-600 text-gray-400'}`}
                      />
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Auto-filled from course selection</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Year</label>
                      <select
                        name="year"
                        value={editFormData.year || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Administrative Information */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-50' : 'bg-gray-800'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>Administrative Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>University Code</label>
                      <input
                        type="text"
                        name="universityCode"
                        value={editFormData.universityCode || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Enrollment ID</label>
                      <input
                        type="text"
                        name="enrollmentId"
                        value={editFormData.enrollmentId || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Joining Date</label>
                      <input
                        type="date"
                        name="joiningDate"
                        value={editFormData.joiningDate || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Aadhar Number</label>
                      <input
                        type="text"
                        name="aadharNo"
                        value={editFormData.aadharNo || ''}
                        onChange={handleEditChange}
                        maxLength="12"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-50' : 'bg-gray-800'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>Guardian Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Guardian Name</label>
                      <input
                        type="text"
                        name="guardianName"
                        value={editFormData.guardianName || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Guardian Phone</label>
                      <input
                        type="tel"
                        name="guardianPhone"
                        value={editFormData.guardianPhone || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Emergency Contact</label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={editFormData.emergencyContact || ''}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Profile Image</label>
                      <div className="flex flex-col items-center space-y-2">
                        {imagePreview && (
                          <div className={`w-20 h-20 rounded-full overflow-hidden border-2 ${isDarkMode ? 'border-gray-300' : 'border-gray-600'}`}>
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          name="image"
                          onChange={handleEditChange}
                          accept="image/*"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={editLoading}
                    className={`px-6 py-2 border rounded-lg transition-colors font-medium disabled:opacity-50 ${isDarkMode ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-600 text-gray-200 hover:bg-gray-700'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                  >
                    {editLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Update Student'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;