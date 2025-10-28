import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaEdit, FaTrash, FaUser, FaEllipsisV, FaCheck, FaTimes } from 'react-icons/fa';

const Admissions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const toggleDropdown = (applicationId) => {
    setDropdownOpen(dropdownOpen === applicationId ? null : applicationId);
  };

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const applications = [
    { id: 1, applicationId: 'APP001', name: 'Rahul Sharma', course: 'Computer Science', batch: '2024-25', email: 'rahul.sharma@gmail.com', phone: '9876543210', applicationDate: '2024-01-15', status: 'Pending', documents: 'Complete' },
    { id: 2, applicationId: 'APP002', name: 'Priya Patel', course: 'Business Administration', batch: '2024-25', email: 'priya.patel@gmail.com', phone: '9876543211', applicationDate: '2024-01-16', status: 'Approved', documents: 'Complete' },
    { id: 3, applicationId: 'APP003', name: 'Arjun Kumar', course: 'Engineering', batch: '2024-25', email: 'arjun.kumar@gmail.com', phone: '9876543212', applicationDate: '2024-01-17', status: 'Rejected', documents: 'Incomplete' },
    { id: 4, applicationId: 'APP004', name: 'Sneha Singh', course: 'Liberal Arts', batch: '2024-25', email: 'sneha.singh@gmail.com', phone: '9876543213', applicationDate: '2024-01-18', status: 'Under Review', documents: 'Complete' }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      default: return 'opacity-70';
    }
  };

  const updateStatus = (applicationId, newStatus) => {
    console.log(`Updating application ${applicationId} to ${newStatus}`);
    // Handle status update
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg shadow p-4 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium opacity-70">Total Applications</h3>
            <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
          </div>
          <div className="rounded-lg shadow p-4 border-l-4 border-green-500">
            <h3 className="text-sm font-medium opacity-70">Approved</h3>
            <p className="text-2xl font-bold text-green-600">{applications.filter(app => app.status === 'Approved').length}</p>
          </div>
          <div className="rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium opacity-70">Under Review</h3>
            <p className="text-2xl font-bold text-yellow-600">{applications.filter(app => app.status === 'Under Review').length}</p>
          </div>
          <div className="rounded-lg shadow p-4 border-l-4 border-red-500">
            <h3 className="text-sm font-medium opacity-70">Rejected</h3>
            <p className="text-2xl font-bold text-red-600">{applications.filter(app => app.status === 'Rejected').length}</p>
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
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]">
                <option>All Courses</option>
                <option>Computer Science</option>
                <option>Business Administration</option>
                <option>Engineering</option>
                <option>Liberal Arts</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all">
                <span>📊</span> Export Data
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all">
                <span>+</span> New Application
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {['ID', 'Application ID', 'Applicant Name', 'Course', 'Batch', 'Email', 'Phone', 'Application Date', 'Documents', 'Status', 'Actions'].map(header => (
                    <th key={header} className="px-4 md:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredApplications.map((application, index) => (
                  <tr key={application.id} className="transition-colors">
                    <td className="px-4 md:px-6 py-4 text-sm text-blue-600 font-semibold">{index + 1}</td>
                    <td className="px-4 md:px-6 py-4 text-sm font-medium">{application.applicationId}</td>
                    <td className="px-4 md:px-6 py-4 text-sm font-medium">{application.name}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">{application.course}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">{application.batch}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-blue-600">{application.email}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">{application.phone}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">{application.applicationDate}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        application.documents === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {application.documents}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {/* Quick Action Buttons */}
                        {application.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(application.id, 'Approved')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Approve"
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(application.id, 'Rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Reject"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {/* Dropdown Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(application.id);
                            }}
                            className="p-2 rounded-lg transition-all"
                          >
                            <FaEllipsisV className="w-4 h-4" />
                          </button>

                          {dropdownOpen === application.id && (
                            <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-xl z-20 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  navigate(`/admissions/view/${application.id}`, { state: { application } });
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <FaEye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  navigate('/admissions/edit', { state: { application } });
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors"
                              >
                                <FaEdit className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDropdownOpen(null);
                                  console.log('Delete application:', application.id);
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

export default Admissions;