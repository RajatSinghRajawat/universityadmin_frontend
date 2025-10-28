import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { employeeService, authService } from '../../services';

const AddEmployess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit');
  const employeeData = location.state?.employee;
  
  const [formData, setFormData] = useState({
    firstName: employeeData?.name?.split(' ')[0] || '',
    lastName: employeeData?.name?.split(' ')[1] || '',
    email: employeeData?.email || '',
    phone: employeeData?.phone || '',
    dateOfBirth: employeeData?.dateOfBirth || '',
    // Address fields (backend expects array with these fields)
    state: employeeData?.address?.[0]?.state || '',
    permanentAddress: employeeData?.address?.[0]?.permanentAddress || '',
    city: employeeData?.address?.[0]?.city || '',
    pincode: employeeData?.address?.[0]?.pincode || '',
    department: employeeData?.department || '',
    designation: employeeData?.designation || '',
    salary: employeeData?.salary || '',
    joiningDate: employeeData?.joiningDate || '',
    qualification: employeeData?.qualification || '',
    experience: employeeData?.experience || '',
    emergencyContact: employeeData?.emergencyContact || '',
    universityCode: employeeData?.universityCode || '',
    employeeId: employeeData?.employeeId || '',
    gender: employeeData?.gender || '',
    aadharNo: employeeData?.aadharNo || '',
    accountStatus: employeeData?.accountStatus || 'active',
    accountType: employeeData?.accountType || 'savings',
    accountNumber: employeeData?.accountNumber || '',
    accountHolderName: employeeData?.accountHolderName || '',
    accountBankName: employeeData?.accountBankName || '',
    accountIFSCCode: employeeData?.accountIFSCCode || '',
    image: null
  });
  const [universities, setUniversities] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load universities on component mount
  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    try {
      const response = await authService.getUniversityCodes();
      console.log('University codes response:', response);
      
      // Handle different response formats
      if (response.universities && Array.isArray(response.universities)) {
        // Backend returns { id, name }, frontend expects { code, name }
        const formattedUniversities = response.universities.map(uni => ({
          code: uni.id,
          name: uni.name
        }));
        setUniversities(formattedUniversities);
      } else if (Array.isArray(response)) {
        // Direct array response
        const formattedUniversities = response.map(uni => ({
          code: uni.id || uni.code,
          name: uni.name
        }));
        setUniversities(formattedUniversities);
      } else {
        // Fallback to hardcoded values from backend error message
        setUniversities([
          { code: 'GYAN001', name: 'Kishangarh girls college' },
          { code: 'GYAN002', name: 'Kishangarh law college' }
        ]);
      }
    } catch (error) {
      console.error('Error loading universities:', error);
      // Fallback to hardcoded values if API fails
      setUniversities([
        { code: 'GYAN001', name: 'Kishangarh girls college' },
        { code: 'GYAN002', name: 'Kishangarh law college' }
      ]);
      console.log('Using fallback university codes');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      console.log('Image file selected:', file);
      setFormData({
        ...formData,
        image: file
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.aadharNo.trim()) errors.aadharNo = 'Aadhar number is required';
    
    // Address validation
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.permanentAddress.trim()) errors.permanentAddress = 'Permanent address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pincode.trim()) errors.pincode = 'Pincode is required';
    
    // Professional fields
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.designation) errors.designation = 'Designation is required';
    if (!formData.salary) errors.salary = 'Salary is required';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';
    if (!formData.qualification.trim()) errors.qualification = 'Qualification is required';
    if (!formData.experience) errors.experience = 'Experience is required';
    if (!formData.emergencyContact.trim()) errors.emergencyContact = 'Emergency contact is required';
    
    // Administrative fields
    if (!formData.universityCode) errors.universityCode = 'University code is required';
    if (!formData.employeeId.trim()) errors.employeeId = 'Employee ID is required';
    
    // Account fields
    if (!formData.accountNumber.trim()) errors.accountNumber = 'Account number is required';
    if (!formData.accountHolderName.trim()) errors.accountHolderName = 'Account holder name is required';
    if (!formData.accountBankName.trim()) errors.accountBankName = 'Bank name is required';
    if (!formData.accountIFSCCode.trim()) errors.accountIFSCCode = 'IFSC code is required';
    
    // Image validation - optional field
    // No validation needed for image as it's optional
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix validation errors', 'error');
      return;
    }

    setLoading(true);
    setValidationErrors({});

    try {
      // Debug: Check form data
      console.log('Form data before submit:', formData);
      console.log('Image file:', formData.image);
      
      // Create FormData for file upload
      const submitData = new FormData();

      // Add all form fields
      submitData.append('name', `${formData.firstName} ${formData.lastName}`.trim());
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('dateOfBirth', formData.dateOfBirth);
      submitData.append('gender', formData.gender);
      submitData.append('aadharNo', formData.aadharNo);
      
      // Create address array and send as JSON string (backend needs to parse this)
      const addressArray = [{
        state: formData.state,
        permanentAddress: formData.permanentAddress,
        city: formData.city,
        pincode: formData.pincode
      }];
      submitData.append('address', JSON.stringify(addressArray));
      
      submitData.append('department', formData.department);
      submitData.append('designation', formData.designation);
      submitData.append('salary', formData.salary);
      submitData.append('joiningDate', formData.joiningDate);
      submitData.append('qualification', formData.qualification);
      submitData.append('experience', formData.experience);
      submitData.append('emergencyContact', formData.emergencyContact);
      submitData.append('universityCode', formData.universityCode);
      submitData.append('employeeId', formData.employeeId);
      submitData.append('accountStatus', formData.accountStatus);
      submitData.append('accountType', formData.accountType);
      submitData.append('accountNumber', formData.accountNumber);
      submitData.append('accountHolderName', formData.accountHolderName);
      submitData.append('accountBankName', formData.accountBankName);
      submitData.append('accountIFSCCode', formData.accountIFSCCode);
      submitData.append('status', 'active');

      // Add image (optional field)
      if (formData.image) {
        submitData.append('image', formData.image);
        console.log('Adding new image file:', formData.image.name);
      } else if (isEditMode && employeeData?.image) {
        // In edit mode, if no new image selected, keep existing image
        submitData.append('image', employeeData.image);
        console.log('Keeping existing image:', employeeData.image);
      }
      // No error if no image provided as it's optional

      let result;
      if (isEditMode) {
        result = await employeeService.updateEmployee(employeeData._id, submitData, true);
      } else {
        result = await employeeService.createEmployee(submitData, true);
      }

      if (result.success) {
        showToast(isEditMode ? 'Employee updated successfully!' : 'Employee created successfully!', 'success');
        setTimeout(() => {
          navigate('/employees/all');
        }, 1500);
      } else {
        showToast(result.message || `Failed to ${isEditMode ? 'update' : 'create'} employee`, 'error');
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} employee:`, error);
      showToast(error.message || 'Network error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };



  

  return (
    <div className="min-h-screen p-4 md:p-6">
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
            onClick={() => navigate('/employees/all')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back to Employees</span>
          </button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Employee' : 'Add New Employee'}
          </h1>
        </div>

        <div className="rounded-lg shadow-lg p-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">{isEditMode ? 'Edit Employee Details' : 'Add New Employee'}</h2>
            <p className="mt-2">Fill in the employee details below</p>
      </div>
      
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-6 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      validationErrors.firstName ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter first name"
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter email address"
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
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Aadhar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadharNo"
                    value={formData.aadharNo}
                    onChange={handleChange}
                    required
                    maxLength="12"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter 12-digit Aadhar number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {validationErrors.image && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.image}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-6 border-b pb-2">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    maxLength="6"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter pincode"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Permanent Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    rows={3}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter permanent address"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-6 border-b pb-2">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Administration">Administration</option>
                    <option value="Library">Library</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Designation</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Office Manager">Office Manager</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Accountant">Accountant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Salary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter salary amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter qualification"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Years of experience"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Emergency Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter emergency contact number"
                  />
                </div>
              </div>
            </div>

            {/* Administrative Information */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-6 border-b pb-2">Administrative Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    University Code <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="universityCode"
                    value={formData.universityCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select University Code</option>
                    {universities.map((university) => (
                      <option key={university.code} value={university.code}>
                        {university.code} - {university.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter employee ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="accountStatus"
                    value={formData.accountStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="salary">Salary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bank Account Information */}
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-6 border-b pb-2">Bank Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter account holder name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountBankName"
                    value={formData.accountBankName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter bank name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountIFSCCode"
                    value={formData.accountIFSCCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter IFSC code"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center space-x-6 pt-6">
              <button
                type="button"
                onClick={() => navigate('/employees/all')}
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
                  isEditMode ? 'Update Employee' : 'Add Employee'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployess;