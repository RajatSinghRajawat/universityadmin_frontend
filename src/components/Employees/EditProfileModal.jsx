import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { employeeService } from '../../services';

const EditProfileModal = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    designation: '',
    phone: '',
    email: '',
    salary: '',
    status: 'Active',
    dateOfBirth: '',
    gender: '',
    aadharNo: '',
    qualification: '',
    experience: '',
    emergencyContact: '',
    universityCode: '',
    accountStatus: 'active',
    accountType: 'savings',
    accountNumber: '',
    accountHolderName: '',
    accountBankName: '',
    accountIFSCCode: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        employeeId: employee.employeeId || '',
        department: employee.department || '',
        designation: employee.designation || '',
        phone: employee.phone || '',
        email: employee.email || '',
        salary: employee.salary || '',
        status: employee.status || 'Active',
        dateOfBirth: employee.dateOfBirth || '',
        gender: employee.gender || '',
        aadharNo: employee.aadharNo || '',
        qualification: employee.qualification || '',
        experience: employee.experience || '',
        emergencyContact: employee.emergencyContact || '',
        universityCode: employee.universityCode || '',
        accountStatus: employee.accountStatus || 'active',
        accountType: employee.accountType || 'savings',
        accountNumber: employee.accountNumber || '',
        accountHolderName: employee.accountHolderName || '',
        accountBankName: employee.accountBankName || '',
        accountIFSCCode: employee.accountIFSCCode || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    } else {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      // Don't update employeeId - it should remain unchanged
      submitData.append('department', formData.department);
      submitData.append('designation', formData.designation);
      submitData.append('phone', formData.phone);
      // Don't update email - it should remain unchanged
      submitData.append('salary', formData.salary);
      submitData.append('status', formData.status);
      // Don't update dateOfBirth - it should remain unchanged
      submitData.append('gender', formData.gender);
      submitData.append('aadharNo', formData.aadharNo);
      submitData.append('qualification', formData.qualification);
      submitData.append('experience', formData.experience);
      submitData.append('emergencyContact', formData.emergencyContact);
      // Don't update universityCode - it should remain unchanged
      submitData.append('accountStatus', formData.accountStatus);
      submitData.append('accountType', formData.accountType);
      submitData.append('accountNumber', formData.accountNumber);
      submitData.append('accountHolderName', formData.accountHolderName);
      submitData.append('accountBankName', formData.accountBankName);
      submitData.append('accountIFSCCode', formData.accountIFSCCode);

      // Handle address - keep existing address structure
      if (employee?.address && employee.address.length > 0) {
        submitData.append('address', JSON.stringify(employee.address));
      }

      // Handle image upload
      if (formData.image) {
        submitData.append('image', formData.image);
      } else if (employee?.image) {
        submitData.append('image', employee.image);
      }

      console.log('Submitting employee update:', {
        id: employee._id,
        name: formData.name,
        department: formData.department,
        designation: formData.designation
      });

      const result = await employeeService.updateEmployee(employee._id, submitData, true);

      if (result.success) {
        showToast('Employee updated successfully!', 'success');
        setTimeout(() => {
          navigate('/employees/profile', { state: { employee: result.data } });
        }, 1500);
      } else {
        showToast(result.message || 'Failed to update employee', 'error');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
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

      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/employees/profile', { state: { employee } })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </button>
          <h1 className="text-2xl font-bold">Edit Employee Profile</h1>
        </div>

        {/* Form Card */}
        <div className={`rounded-xl shadow-lg `}>
          <div className={`p-4 md:p-6 border-b ${isDarkMode ? 'border-gray-200' : 'border-gray-700'}`}>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-900' : 'text-white'}`}>Employee Information</h2>
          </div>

          <form onSubmit={handleSubmit} className={`p-4 md:p-6 space-y-4 `}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                required
              />
            </div>
            

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Engineering">Engineering</option>
                <option value="Administration">Administration</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                required
              >
                <option value="">Select Designation</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Office Manager">Office Manager</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                required
              />
            </div>


            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Salary (₹)</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>


            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Aadhar Number</label>
              <input
                type="text"
                name="aadharNo"
                value={formData.aadharNo}
                onChange={handleChange}
                maxLength="12"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Emergency Contact</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              />
            </div>


            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Account Status</label>
              <select
                name="accountStatus"
                value={formData.accountStatus}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Account Type</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              >
                <option value="savings">Savings</option>
                <option value="current">Current</option>
                <option value="salary">Salary</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Account Holder Name</label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Bank Name</label>
              <input
                type="text"
                name="accountBankName"
                value={formData.accountBankName}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>IFSC Code</label>
              <input
                type="text"
                name="accountIFSCCode"
                value={formData.accountIFSCCode}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}>Profile Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}
              />
              {employee?.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Current image:</p>
                  <img 
                    src={`http://localhost:5001/${employee.image}`} 
                    alt="Current profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className={`flex justify-end gap-3 pt-4 border-t ${isDarkMode ? 'border-gray-200' : 'border-gray-700'}`}>
            <button
              type="button"
              onClick={() => navigate('/employees/profile', { state: { employee } })}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;