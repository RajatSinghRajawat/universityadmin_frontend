import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaBriefcase, FaIdCard, FaArrowLeft, FaEdit } from 'react-icons/fa';
import { getMediaUrl } from '../../utils/mediaUrl';

const EmployessProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get employee data from navigation state
  const employee = location.state?.employee;
  
  // Sample data if no employee passed
  const profileData = employee ? {
    name: employee.name,
    subtitle: `${employee.designation} - ${employee.department}`,
    employeeId: employee.employeeId,
    joiningDate: 'September 1, 2020',
    dateOfBirth: 'June 15, 1980',
    gender: 'Male',
    email: employee.email,
    contactNumber: employee.phone,
    status: employee.status,
    address: {
      state: 'Gujarat',
      permanentAddress: 'Sector 15, Gandhi Nagar, Gujarat, India'
    },
    professionalDetails: {
      department: employee.department,
      designation: employee.designation,
      salary: employee.salary,
      qualification: 'Ph.D in Computer Science',
      experience: '15 years',
      joiningDate: 'September 1, 2020'
    },
    personalDetails: {
      maritalStatus: 'Married',
      nationality: 'Indian',
      religion: 'Hindu',
      emergencyContact: '9876543214',
      bloodGroup: 'O+',
      aadharNo: '1234 5678 9012'
    }
  } : {
    name: 'Dr. Rajesh Kumar',
    subtitle: 'Professor - Computer Science',
    employeeId: 'EMP001',
    joiningDate: 'September 1, 2020',
    dateOfBirth: 'June 15, 1980',
    gender: 'Male',
    email: 'rajesh.kumar@university.com',
    contactNumber: '9876543210',
    status: 'Active',
    address: {
      state: 'Gujarat',
      permanentAddress: 'Sector 15, Gandhi Nagar, Gujarat, India'
    },
    professionalDetails: {
      department: 'Computer Science',
      designation: 'Professor',
      salary: '75000',
      qualification: 'Ph.D in Computer Science',
      experience: '15 years',
      joiningDate: 'September 1, 2020'
    },
    personalDetails: {
      maritalStatus: 'Married',
      nationality: 'Indian',
      religion: 'Hindu',
      emergencyContact: '9876543214',
      bloodGroup: 'O+',
      aadharNo: '1234 5678 9012'
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/employees/all')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Employees</span>
            </button>
            <h1 className="text-2xl font-bold">Employee Profile</h1>
          </div>
          <button
            onClick={() => navigate('/employees/edit-profile', { state: { employee } })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <FaEdit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          {/* Purple Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              {employee?.image ? (
                <img 
                  src={getMediaUrl(employee.image)} 
                  alt={profileData.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white border-opacity-30"
                />
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white border-opacity-30">
                  <FaUser className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{profileData.name}</h1>
                <p className="text-purple-100 opacity-90">{profileData.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Employee Details Section */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaIdCard className="text-blue-600" />
              <h2 className="text-lg font-semibold">Employee Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium opacity-70">Employee ID</label>
                <p className="text-sm font-medium mt-1">{profileData.employeeId}</p>
              </div>
              <div>
                <label className="text-sm font-medium opacity-70">Joining Date</label>
                <p className="text-sm font-medium mt-1">{profileData.joiningDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium opacity-70">Date of Birth</label>
                <p className="text-sm font-medium mt-1">{profileData.dateOfBirth}</p>
              </div>
              <div>
                <label className="text-sm font-medium opacity-70">Gender</label>
                <p className="text-sm font-medium mt-1">{profileData.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium opacity-70">Email</label>
                <p className="text-sm font-medium mt-1 text-blue-600">{profileData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium opacity-70">Contact Number</label>
                <p className="text-sm font-medium mt-1 text-blue-600">{profileData.contactNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium opacity-70">Status</label>
                <p className="text-sm font-medium mt-1">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {profileData.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaBriefcase className="text-blue-600" />
            <h2 className="text-lg font-semibold">Professional Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium opacity-70">Department</label>
              <p className="text-sm font-medium mt-1">{profileData.professionalDetails.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Designation</label>
              <p className="text-sm font-medium mt-1">{profileData.professionalDetails.designation}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Salary</label>
              <p className="text-sm font-medium mt-1">₹{profileData.professionalDetails.salary}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Qualification</label>
              <p className="text-sm font-medium mt-1">{profileData.professionalDetails.qualification}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Experience</label>
              <p className="text-sm font-medium mt-1">{profileData.professionalDetails.experience}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Joining Date</label>
              <p className="text-sm font-medium mt-1">{profileData.professionalDetails.joiningDate}</p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-blue-600" />
            <h2 className="text-lg font-semibold">Address</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium opacity-70">State</label>
              <p className="text-sm font-medium mt-1">{profileData.address.state}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium opacity-70">Permanent Address</label>
              <p className="text-sm font-medium mt-1">{profileData.address.permanentAddress}</p>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaUser className="text-blue-600" />
            <h2 className="text-lg font-semibold">Personal Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium opacity-70">Marital Status</label>
              <p className="text-sm font-medium mt-1">{profileData.personalDetails.maritalStatus}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Nationality</label>
              <p className="text-sm font-medium mt-1">{profileData.personalDetails.nationality}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Religion</label>
              <p className="text-sm font-medium mt-1">{profileData.personalDetails.religion}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Emergency Contact</label>
              <p className="text-sm font-medium mt-1">{profileData.personalDetails.emergencyContact}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Blood Group</label>
              <p className="text-sm font-medium mt-1">{profileData.personalDetails.bloodGroup}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Aadhar Number</label>
              <p className="text-sm font-medium mt-1">{profileData.personalDetails.aadharNo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployessProfile;