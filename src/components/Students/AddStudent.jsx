import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { studentService, authService, courseService } from '../../services';

const AddStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit');
  const studentData = location.state?.student;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    department: '',
    year: '',
    guardianName: '',
    guardianPhone: '',
    emergencyContact: '',
    universityCode: '',
    enrollmentId: '',
    joiningDate: '',
    gender: '',
    aadharNo: '',
    course_id: '',
    password: '',
    image: null
  });
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Get university code from localStorage
  const universityCode = localStorage.getItem('universityCode');



  // Load universities and courses on component mount
  useEffect(() => {
    loadUniversities();
    
    // Set initial university code from localStorage if not in edit mode
    if (!isEditMode && universityCode) {
      setFormData(prev => ({
        ...prev,
        universityCode: universityCode
      }));
    }
    
    if (isEditMode && studentData) {
      populateFormData();
    }
  }, [isEditMode, studentData, universityCode]);

  // Reload courses when university code changes
  useEffect(() => {
    if (formData.universityCode) {
      console.log('University code changed, loading courses:', formData.universityCode);
      loadCourses();
    }
  }, [formData.universityCode]);

  // Clear course selection when university changes (separate effect to avoid conflicts)
  useEffect(() => {
    if (formData.universityCode) {
      setFormData(prev => ({
        ...prev,
        course_id: '',
        department: ''
      }));
    }
  }, [formData.universityCode]);

  const loadUniversities = async () => {
    try {
      const response = await authService.getUniversityCodes();
      setUniversities(response.universities || []);
    } catch (error) {
      console.error('Error loading universities:', error);
      showToast('Failed to load universities', 'error');
    }
  };

  const loadCourses = async () => {
    try {
      setCoursesLoading(true);
      setError(null);
      
      // Get university code from form or localStorage variable
      const currentUniversityCode = formData.universityCode || universityCode;
      
      if (!currentUniversityCode) {
        console.log('No university code found, skipping course load');
        setCourses([]);
        return;
      }

      console.log('Loading courses for university:', currentUniversityCode);

      // Use direct fetch for better error handling
      const response = await fetch(`http://localhost:5001/api/courses/all?universityCode=${currentUniversityCode}&isActive=true`);
      const result = await response.json();
      
      if (result.success) {
        setCourses(Array.isArray(result.data) ? result.data : []);
        console.log('Courses loaded successfully:', result.data?.length || 0);
      } else {
        throw new Error(result.message || 'Failed to load courses');
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      showToast(`Failed to load courses: ${error.message}`, 'error');
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const populateFormData = () => {
    if (studentData) {
      setFormData({
        firstName: studentData.name?.split(' ')[0] || '',
        lastName: studentData.name?.split(' ').slice(1).join(' ') || '',
        email: studentData.email || '',
        phone: studentData.phone || '',
        dateOfBirth: studentData.dateOfBirth || '',
        address: studentData.address || '',
        department: studentData.department || '',
        year: studentData.year || '',
        guardianName: studentData.guardianName || '',
        guardianPhone: studentData.guardianPhone || '',
        emergencyContact: studentData.emergencyContact || '',
        universityCode: studentData.universityCode || '',
        enrollmentId: studentData.enrollmentId || '',
        joiningDate: studentData.joiningDate || '',
        gender: studentData.gender || '',
        aadharNo: studentData.aadharNo || '',
        course_id: studentData.course_id || '',
        password: '',
        image: null
      });
    }
  };





  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file
      });

      // Create preview URL
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else if (e.target.name === 'course_id') {
      // When course is selected, auto-update department
      const selectedCourse = courses.find(course => course._id === e.target.value);
      console.log('Course selected:', {
        courseId: e.target.value,
        selectedCourse: selectedCourse,
        department: selectedCourse?.department
      });
      
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        department: selectedCourse ? selectedCourse.department : formData.department
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.year) errors.year = 'Academic year is required';
    if (!formData.universityCode) errors.universityCode = 'University code is required';
    if (!formData.enrollmentId.trim()) errors.enrollmentId = 'Enrollment ID is required';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.aadharNo.trim()) errors.aadharNo = 'Aadhar number is required';
    if (!formData.course_id) errors.course_id = 'Course selection is required';
    
    // Password validation - required only in create mode
    if (!isEditMode && !formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Additional validation to ensure course exists
    if (formData.course_id && !courses.find(course => course._id === formData.course_id)) {
      errors.course_id = 'Selected course is not valid';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix validation errors', 'error');
      return;
    }

    // Additional check for course_id
    if (!formData.course_id) {
      showToast('Please select a course', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add all form fields
      submitData.append('name', `${formData.firstName} ${formData.lastName}`.trim());
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('address', formData.address);
      submitData.append('department', formData.department);
      submitData.append('year', formData.year);
      submitData.append('guardianName', formData.guardianName);
      submitData.append('guardianPhone', formData.guardianPhone);
      submitData.append('emergencyContact', formData.emergencyContact);
      submitData.append('universityCode', formData.universityCode || universityCode);
      submitData.append('enrollmentId', formData.enrollmentId);
      submitData.append('JoiningDate', formData.joiningDate);
      submitData.append('DateOfBirth', formData.dateOfBirth);
      submitData.append('Gender', formData.gender);
      submitData.append('aadharNo', formData.aadharNo);
      submitData.append('course_id', formData.course_id);
      
      // Add password only if provided (required for create, optional for edit)
      if (formData.password) {
        submitData.append('password', formData.password);
      }

      // Debug: Log form data before submission
      console.log('Form data being submitted:', {
        course_id: formData.course_id,
        universityCode: formData.universityCode || universityCode,
        department: formData.department,
        courses: courses.length
      });

      // Add image if selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      let result;
      if (isEditMode) {
        result = await studentService.updateStudent(studentData._id, submitData, true);
      } else {
        result = await studentService.createStudent(submitData, true);
      }

      if (result.success) {
        showToast(isEditMode ? 'Student updated successfully!' : 'Student created successfully!', 'success');
        setTimeout(() => {
          navigate('/students');
        }, 1500);
      } else {
        showToast(result.message || `Failed to ${isEditMode ? 'update' : 'create'} student`, 'error');
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} student:`, error);
      setError(error.message || 'Network error occurred');
      showToast(error.message || 'Network error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        } px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md`}>
          <div className="flex-shrink-0">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="flex-shrink-0 ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/students')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back to Students</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {isEditMode ? 'Edit Student' : 'Add New Student'}
            </h1>
            {universityCode && (
              <p className="text-sm text-blue-600 mt-1">
                University: {universityCode}
              </p>
            )}
          </div>
        </div>

        <div className="form-section rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300 p-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">{isEditMode ? 'Edit Student Details' : 'Add New Student'}</h2>
            <p className="mt-2">Fill in the student details below</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="form-section p-6 rounded-lg transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors "
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Password {!isEditMode && <span className="text-red-500">*</span>}
                    {isEditMode && <span className="text-xs text-gray-500 ml-2">(Leave blank to keep current password)</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditMode}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
                  />
                  {validationErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors "
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors "
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium  mb-2">
                    Profile Image
                  </label>
                  <div className="flex flex-col items-center space-y-4">
                    {imagePreview && (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600">
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
                      onChange={handleChange}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Supported formats: JPEG, JPG, PNG, WebP, GIF, AVIF
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium  mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="form-section p-6 rounded-lg transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    required
                    disabled={coursesLoading || !formData.universityCode}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.course_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } ${(coursesLoading || !formData.universityCode) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">
                      {coursesLoading 
                        ? 'Loading courses...' 
                        : courses.length === 0 
                          ? formData.universityCode 
                            ? 'No courses available for this university' 
                            : 'Select university first'
                          : 'Select Course'
                      }
                    </option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseCode} - {course.courseName} ({course.department}) - ₹{course.discountPrice > 0 ? course.discountPrice?.toLocaleString() : course.price?.toLocaleString()}{course.discountPrice > 0 ? ` (Discounted from ₹${course.price?.toLocaleString()})` : ''}
                      </option>
                    ))}
                  </select>
                  {validationErrors.course_id && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.course_id}</p>
                  )}
                  {coursesLoading && (
                    <p className="text-blue-500 text-sm mt-1">Loading courses for {formData.universityCode}...</p>
                  )}
                  {!formData.universityCode && !coursesLoading && (
                    <p className="text-gray-500 text-sm mt-1">Please select a university first</p>
                  )}
                  
                  {/* Course Details Display
                  {formData.course_id && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Selected Course Details:</h4>
                      {(() => {
                        const selectedCourse = courses.find(course => course._id === formData.course_id);
                        return selectedCourse ? (
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Course Code:</span> {selectedCourse.courseCode}</p>
                            <p><span className="font-medium">Course Name:</span> {selectedCourse.courseName}</p>
                            <p><span className="font-medium">Department:</span> {selectedCourse.department}</p>
                            <p><span className="font-medium">Duration:</span> {selectedCourse.duration}</p>
                            <p><span className="font-medium">Semester:</span> {selectedCourse.semester}</p>
                            <p><span className="font-medium">Year:</span> {selectedCourse.year}</p>
                            <p><span className="font-medium">Price:</span> ₹{selectedCourse.price?.toLocaleString()}</p>
                            {selectedCourse.discountPrice > 0 && (
                              <p><span className="font-medium">Discounted Price:</span> ₹{selectedCourse.discountPrice?.toLocaleString()}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500">Course details not found</p>
                        );
                      })()}
                    </div>
                  )} */}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(Auto-filled from course selection)</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    placeholder="Select a course to auto-fill department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            <div className="form-section p-6 rounded-lg transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                Administrative Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    University Code <span className="text-red-500">*</span>
                  </label>
                <input type="text" name="universityCode" value={formData.universityCode} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  {validationErrors.universityCode && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.universityCode}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Enrollment ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="enrollmentId"
                    value={formData.enrollmentId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter enrollment ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Aadhar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadharNo"
                    value={formData.aadharNo}
                    onChange={handleChange}
                    required
                    maxLength="12"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter 12-digit Aadhar number"
                  />
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="form-section p-6 rounded-lg transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                Guardian Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors "
                    placeholder="Enter guardian name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Guardian Phone
                  </label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors "
                    placeholder="Enter guardian phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors "
                    placeholder="Enter emergency contact number"
                  />
                </div>
              </div>
            </div>

             {/* Submit Buttons */}
             <div className="flex justify-center space-x-6 pt-6">
               <button
                 type="button"
                 onClick={() => navigate('/students')}
                 disabled={loading}
                 className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Cancel
               </button>
               
               <button
                 type="submit"
                 disabled={loading}
                 className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
               >
                 {loading ? (
                   <>
                     <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                     </svg>
                     {isEditMode ? 'Updating...' : 'Creating...'}
                   </>
                 ) : (
                   isEditMode ? 'Update Student' : 'Add Student'
                 )}
               </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
