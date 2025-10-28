import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdEdit, 
  MdDelete, 
  MdVisibility,
  MdCalendarToday,
  MdArrowBack,
  MdFilterList,
  MdEvent,
  MdSchedule,
  MdCheckCircle,
  MdCancel,
  MdStar,
  MdStarBorder,
  MdClose
} from 'react-icons/md';
import Swal from 'sweetalert2';
import { sessionService } from '../../services';
import { useTheme } from '../../contexts/ThemeContext';

const Sessions = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Get university code from localStorage
  const universityCode = localStorage.getItem('universityCode') || 'GYAN001';

  // Fetch sessions data
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await sessionService.getAllSessions();
      
      if (result.success) {
        setSessions(result.data);
      } else {
        setError(result.message || 'Failed to fetch sessions');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Create new session
  const createSession = async (sessionData) => {
    try {
      setSubmitting(true);
      
      const result = await sessionService.createSession(sessionData);

      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Session created successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        fetchSessions();
        setShowAddModal(false);
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Failed to create session',
          icon: 'error'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Network Error!',
        text: 'Failed to create session',
        icon: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Set default session
  const setDefaultSession = async (sessionId) => {
    try {
      const result = await sessionService.setDefaultSession(sessionId);

      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Default session updated successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        fetchSessions();
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Failed to set default session',
          icon: 'error'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Network Error!',
        text: 'Failed to set default session',
        icon: 'error'
      });
    }
  };

  // Delete session
  const deleteSession = async (sessionId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const responseData = await sessionService.deleteSession(sessionId);
        
        if (responseData.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Session has been deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          fetchSessions();
        } else {
          Swal.fire({
            title: 'Error!',
            text: responseData.message || 'Failed to delete session',
            icon: 'error'
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Network Error!',
        text: 'Network error occurred',
        icon: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
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
            onClick={fetchSessions}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.session_year.toString().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || (filterStatus === 'default' ? session.is_default : !session.is_default);
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (isDefault) => {
    return isDefault ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (isDefault) => {
    return isDefault ? <MdStar className="text-yellow-600" /> : <MdStarBorder className="text-gray-600" />;
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className=" mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
            >
              <MdArrowBack className="w-4 h-4" />
              Back to Academics
            </button>
            <div>
              <h1 className="text-3xl font-bold">Academic Sessions</h1>
              <p className="opacity-70 mt-1">Manage academic years and sessions</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            <MdAdd className="w-4 h-4" />
            Add Sessions
          </button>
        </div>

        {/* Search Section */}
        <div className="rounded-xl shadow-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sessions</option>
                <option value="default">Default Session</option>
                <option value="regular">Regular Sessions</option>
              </select>
            </div>
          </div>
        </div>


        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div key={session._id} className="rounded-xl shadow-lg p-6  border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">
                      {session.session_year}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ({session.totalStudents || 0} Batches)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Set this session as the default for batch operations.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="defaultSession"
                      checked={session.is_default}
                      onChange={() => !session.is_default && setDefaultSession(session._id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-600">
                      {session.is_default ? 'Default' : 'Set as Default'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      
        {filteredSessions.length === 0 && (
          <div className="rounded-xl shadow-lg p-12 text-center bg-white border border-gray-200">
            <MdCalendarToday className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New Session</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <MdClose className="text-xl" />
                </button>
              </div>
            </div>
            
            <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const sessionData = {
                  session_year: parseInt(formData.get('session_year')),
                  is_default: formData.get('is_default') === 'on',
                  startDate: formData.get('startDate'),
                  endDate: formData.get('endDate'),
                  description: formData.get('description') || '',
                  universityCode: universityCode
                };
                await createSession(sessionData);
              }} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Session Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="session_year"
                    min="2000"
                    max="2100"
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    placeholder="Enter session year (e.g., 2024)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    placeholder="Enter session description (optional)"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      University Code
                    </label>
                    <input
                      type="text"
                      value={universityCode}
                      readOnly
                      className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'} cursor-not-allowed`}
                    />
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Auto-filled from your account</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_default"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Set as default session
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-200 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-2 text-white rounded-lg transition-colors ${
                      submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {submitting ? 'Creating...' : 'Add Session'}
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

export default Sessions;
