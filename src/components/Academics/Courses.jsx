import React, { useEffect, useState } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdEdit, 
  MdDelete, 
  MdVisibility,
  MdTabletMac,
  MdCalendarToday,
  MdPeople,
  MdArrowBack,
  MdFilterList,
  MdMoreVert,
  MdClose,
  MdEdit as MdEditIcon,
  MdAdd as MdAddIcon
} from 'react-icons/md';
import { useTheme } from '../../contexts/ThemeContext';

const Courses = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  // removed course type filter
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get university code from localStorage
  const universityCode = localStorage.getItem('universityCode') || 'GYAN001';

  // Add Course form state (includes validation required fields)
  const [formValues, setFormValues] = useState({
    courseName: '',
    courseCode: '',
    description: '',
    duration: '',
    startDate: '',
    endDate: '',
    department: 'General',
    semester: '1st',
    year: new Date().getFullYear().toString(),
    price: '',
    discountPrice: '',
    universityCode: universityCode,
    // Required by backend validation
    credits: '3',
    instructor: 'TBD',
    courseType: 'Theory',
  });
  const coursesPerPage = 3;

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5001/api/courses/all?universityCode=GYAN001');
        const json = await res.json();
        if (!res.ok || json.success === false) {
          throw new Error(json.message || 'Failed to fetch courses');
        }
        setCourses(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        setError(e.message || 'Error fetching courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const name = (course.courseName || '').toLowerCase();
    const code = (course.courseCode || '').toLowerCase();
    const status = course.isActive ? 'active' : 'inactive';
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const handleDetailsClick = (course) => {
    setSelectedCourse(course);
    setIsEditing(false);
    setShowDetailsModal(true);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const handleAddCourseSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      // minimal client-side validation to avoid server zod errors
      if (!formValues.courseName || !formValues.courseCode || !formValues.department || !formValues.duration || !formValues.description || !formValues.semester || !formValues.universityCode || !formValues.startDate || !formValues.endDate || !formValues.courseType) {
        alert('Please fill all required fields.');
        return;
      }
      if (String(formValues.courseCode).trim().length < 3) {
        alert('Course code must be at least 3 characters');
        return;
      }
      if (String(formValues.description).trim().length < 10) {
        alert('Description must be at least 10 characters');
        return;
      }
      if (!formValues.price || Number(formValues.price) <= 0) {
        alert('Please enter a valid price');
        return;
      }
      const formdata = new FormData();
      // formValues now includes universityCode
      Object.entries(formValues).forEach(([key, value]) => {
        // Convert empty strings to proper values for numbers
        if (key === 'price') {
          formdata.append(key, String(value || 0));
        } else if (key === 'discountPrice') {
          formdata.append(key, value ? String(value) : '0');
        } else if (key === 'credits') {
          formdata.append(key, String(value || 3));
        } else {
          formdata.append(key, String(value ?? ''));
        }
      });
      const res = await fetch('http://localhost:5001/api/courses/create', {
        method: 'POST',
        body: formdata,
      });
      const json = await res.json();
      if (!res.ok || json.success === false) {
        const errors = Array.isArray(json.errors) ? `\n${json.errors.join('\n')}` : '';
        throw new Error((json.message || 'Failed to add course') + errors);
      }
      // Refresh list
      setCourses(prev => [json.data, ...prev]);
      setShowAddModal(false);
      setFormValues({
        courseName: '',
        courseCode: '',
        description: '',
        duration: '',
        startDate: '',
        endDate: '',
        department: 'General',
        semester: '1st',
        year: new Date().getFullYear().toString(),
        price: '',
        discountPrice: '',
        universityCode: universityCode,
        credits: '3',
        instructor: 'TBD',
        courseType: 'Theory',
      });
    } catch (err) {
      alert(err.message || 'Error adding course');
    }
  };

  const handleToggleStatus = async (courseId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await fetch(`http://localhost:5001/api/courses/update/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message || `Failed to ${newStatus ? 'activate' : 'deactivate'}`);
      }
      setCourses(prev => prev.map(c => (c._id === courseId ? { ...c, isActive: newStatus } : c)));
    } catch (err) {
      alert(err.message || 'Error updating course status');
    }
  };


  const getAllCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/courses/all?universityCode=GYAN001');
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || 'Failed to fetch');
      setCourses(Array.isArray(json.data) ? json.data : []);
    } catch (error) {
      setError(error.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  const getCourseById = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/courses/get/${id}`);
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || 'Failed to fetch course');
      return json.data;
    } catch (error) {
      alert(error.message || 'Error fetching course');
      return null;
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <MdArrowBack className="text-lg" />
            <span> Back to Academics</span>
          </button>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <MdAdd className="text-lg" />
          <span> Add Course</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="By Course Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {loading && (
          <div className="col-span-full text-center text-gray-600">Loading...</div>
        )}
        {error && !loading && (
          <div className="col-span-full text-center text-red-600">{error}</div>
        )}
        {!loading && !error && currentCourses.map((course) => (
          <div key={course._id} className=" rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="shadow-lg text-xs font-semibold px-2 py-1 rounded-full">
                  {course.department || 'General'}
                </span>
                <span className="shadow-lg text-xs font-medium px-2 py-1 rounded-full">
                  {course.courseCode}
                </span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {course.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
              {course.courseName}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <MdCalendarToday className="text-gray-400" />
                <span>{course.duration || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="font-semibold text-gray-900">₹{Number(course.price || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => handleDetailsClick(course)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <MdVisibility className="text-base" />
                <span>Details</span>
              </button>
              <button 
                onClick={() => handleToggleStatus(course._id, course.isActive)} 
                className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm ${
                  course.isActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {course.isActive ? (
                  <>
                    <MdDelete className="text-base" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <MdEdit className="text-base" />
                    <span>Activate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {currentCourses.length === 0 && (
        <div className="text-center py-12">
          <MdTabletMac className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or add a new course.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <MdAdd className="text-base" />
            Add Course
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt; Previous
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next &gt;
          </button>
        </div>
      )}

      {/* Course Details Modal */}
      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between">
                <button 
                  onClick={handleEditToggle}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
                >
                  <MdEditIcon className="text-base" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Course'}</span>
                </button>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleToggleStatus(selectedCourse._id, selectedCourse.isActive)}
                    className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm ${
                      selectedCourse.isActive 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {selectedCourse.isActive ? (
                      <>
                        <MdDelete className="text-base" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <MdEdit className="text-base" />
                        <span>Activate</span>
                      </>
                    )}
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm">
                    <MdAddIcon className="text-base" />
                    <span>Add Batch</span>
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MdClose className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
              {/* Course Information Section */}
              <div className="mb-6">
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Name
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedCourse.courseName}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedCourse.duration}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedCourse.price}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      <span className="font-bold">Course:</span> {selectedCourse.courseName}
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedCourse.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {selectedCourse.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Total Subject:</span>
                        <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{selectedCourse.totalSubjects ?? 0}</span>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg flex items-center space-x-1 text-xs transition-colors">
                            <MdVisibility className="text-xs" />
                            <span>View Subjects</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Duration:</span>
                        <span className="font-semibold text-gray-900">{selectedCourse.duration}</span>
                      </div>
                      
                      {/* Removed Course Type row per request */}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Price:</span>
                        <span className="font-semibold text-gray-900">₹{selectedCourse.price}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Batches:</span>
                        <span className="font-semibold text-gray-900">{selectedCourse.batches ?? 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Batches Table Section */}
              <div className=" rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className=" ">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(selectedCourse.batchesList || []).map((batch) => (
                        <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {batch.id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {batch.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {batch.startTime}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {batch.endTime}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg flex items-center space-x-1 text-xs transition-colors">
                              <MdVisibility className="text-xs" />
                              <span>Detail</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New Course</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <MdClose className="text-xl" />
                </button>
              </div>
            </div>
            
            <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <form className="space-y-6" onSubmit={handleAddCourseSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={formValues.courseName}
                      onChange={(e) => setFormValues(v => ({ ...v, courseName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      placeholder="Enter course name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Course Code
                    </label>
                    <input
                      type="text"
                      value={formValues.courseCode}
                      onChange={(e) => setFormValues(v => ({ ...v, courseCode: e.target.value.toUpperCase() }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      placeholder="Enter course code"
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formValues.description}
                    onChange={(e) => setFormValues(v => ({ ...v, description: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    placeholder="Enter course description"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Department</label>
                  <input
                    type="text"
                    value={formValues.department}
                    onChange={(e) => setFormValues(v => ({ ...v, department: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formValues.duration}
                      onChange={(e) => setFormValues(v => ({ ...v, duration: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      placeholder="e.g., 3 Years"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formValues.startDate}
                      onChange={(e) => setFormValues(v => ({ ...v, startDate: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formValues.endDate}
                      onChange={(e) => setFormValues(v => ({ ...v, endDate: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                  </div>
                </div>
                {/* Required fields group (course type removed from UI) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Price</label>
                    <input
                      type="number"
                      min={0}
                      value={formValues.price}
                      onChange={(e) => setFormValues(v => ({ ...v, price: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      placeholder="e.g., 15000"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Discount Price (Optional)</label>
                    <input
                      type="number"
                      min={0}
                      value={formValues.discountPrice}
                      onChange={(e) => setFormValues(v => ({ ...v, discountPrice: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      placeholder="e.g., 12000"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>University Code</label>
                    <input
                      type="text"
                      value={formValues.universityCode}
                      readOnly
                      className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'} cursor-not-allowed`}
                    />
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Auto-filled from your account</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Semester</label>
                    <select
                      value={formValues.semester}
                      onChange={(e) => setFormValues(v => ({ ...v, semester: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    >
                      <option value="1st">1st</option>
                      <option value="2nd">2nd</option>
                      <option value="3rd">3rd</option>
                      <option value="4th">4th</option>
                      <option value="5th">5th</option>
                      <option value="6th">6th</option>
                      <option value="7th">7th</option>
                      <option value="8th">8th</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Course Type</label>
                    <select
                      value={formValues.courseType}
                      onChange={(e) => setFormValues(v => ({ ...v, courseType: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    >
                      <option value="Theory">Theory</option>
                      <option value="Practical">Practical</option>
                      <option value="Theory+Practical">Theory+Practical</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className={`p-6 border-t flex justify-end space-x-3 ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <button
                onClick={() => setShowAddModal(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-200 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button onClick={handleAddCourseSubmit} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
