import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaDownload, FaPrint, FaQrcode, FaUniversity, FaCalendar, FaClock, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaGraduationCap, FaBuilding, FaBook, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Admitcards = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [admitcards, setAdmitcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsPerPage = 6;

  const universityCode = localStorage.getItem('universityCode');

  // University data
  const universities = [
    { id: 'all', name: 'All Universities', icon: FaUniversity, color: 'from-blue-600 to-purple-600' },
    { id: 'GYAN001', name: 'Kishangarh Girls College', icon: FaGraduationCap, color: 'from-pink-600 to-rose-600' },
    { id: 'GYAN002', name: 'Kishangarh Law College', icon: FaBuilding, color: 'from-indigo-600 to-blue-600' }
  ];

  // Fetch admitcards data
  const fetchAdmitcards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: cardsPerPage.toString(),
        universityCode: universityCode
      });
      
      if (searchTerm) {
        params.append('searchTerm', searchTerm);
      }
      if (examFilter) {
        params.append('exam_type', examFilter);
      }

      const response = await fetch(`http://localhost:5001/api/admitcards/all?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setAdmitcards(result.data);
      } else {
        setError(result.message || 'Failed to fetch admitcards');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching admitcards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmitcards();
  }, [currentPage, searchTerm, examFilter, universityCode]);

  // Delete admitcard
  const deleteAdmitcard = async (id) => {
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
        const response = await fetch(`http://localhost:5001/api/admitcards/delete/${id}`, {
          method: 'DELETE'
        });

        const responseData = await response.json();
        
        if (responseData.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Admitcard has been deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          fetchAdmitcards();
        } else {
          Swal.fire({
            title: 'Error!',
            text: responseData.message || 'Failed to delete admitcard',
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

  // Calculate pagination info
  const totalPages = Math.ceil(admitcards.length / cardsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admitcards...</p>
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
            onClick={fetchAdmitcards}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = (card) => {
    console.log('Downloading admit card for:', card.studentName);
  };

  const handlePrint = (card) => {
    console.log('Printing admit card for:', card.studentName);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admit Cards Management
            </h1>
            <p className="opacity-70 mt-1">Manage and download examination admit cards across universities</p>
          </div>
          <button
            onClick={() => navigate('/admit-cards/add')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
          >
            <span className="text-lg">+</span> Generate New Card
          </button>
        </div>

        {/* Current University Info */}
        <div className="rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
              {universityCode === 'GYAN001' ? <FaGraduationCap className="w-6 h-6" /> : <FaBuilding className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {universities.find(uni => uni.id === universityCode)?.name}
              </h3>
              <p className="text-sm text-gray-600">
                University Code: {universityCode} | Total Admit Cards: {admitcards.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-50" />
              <input
                type="text"
                placeholder="Search by student name or enrollment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <select 
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
            >
              <option value="">All Examinations</option>
              <option value="Mid Term">Mid Term</option>
              <option value="Final Term">Final Term</option>
            </select>
          </div>
        </div>

        {/* Admit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {admitcards.map((card) => {
            const universityData = universities.find(uni => uni.id === card.universityCode);
            const IconComponent = universityData?.icon || FaUniversity;
            const gradientColor = universityData?.color || 'from-blue-600 to-purple-600';
            
            return (
              <div key={card._id} className="rounded-xl shadow-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                {/* Card Header - Enhanced */}
                <div className={`bg-gradient-to-r ${gradientColor} text-white p-4 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full translate-y-8 -translate-x-8"></div>
                  <div className="relative z-10">
                <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                          <IconComponent className="w-6 h-6" />
                        </div>
                    <div>
                          <h2 className="text-sm font-bold">{universityData?.name || 'University'}</h2>
                          <p className="text-xs opacity-90">Admit Card 2023-2024</p>
                    </div>
                  </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                    card.status === 'Active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {card.status}
                      </div>
                  </div>
                </div>
              </div>

                {/* Card Body - Enhanced */}
                <div className="p-4">
                  <div className="flex gap-4">
                  {/* Student Photo */}
                  <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl flex items-center justify-center border-2 border-blue-200 shadow-lg">
                        <FaUser className="w-10 h-10 text-blue-500" />
                      </div>
                  </div>

                  {/* Student Details */}
                  <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{card.student_id?.name || 'N/A'}</h3>
                      <p className="text-sm text-gray-600 mb-2">ID: {card.student_id?.enrollmentId || 'N/A'}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-2 rounded-lg shadow-sm">
                          <p className="text-gray-500 text-xs font-medium">Course</p>
                          <p className="font-semibold text-gray-800">{card.course_id?.courseName || 'N/A'}</p>
                        </div>
                        <div className="p-2 rounded-lg shadow-sm">
                          <p className="text-gray-500 text-xs font-medium">Semester</p>
                          <p className="font-semibold text-gray-800">{card.semester}</p>
                        </div>
                      </div>
                  </div>
                </div>

                  {/* Exam Details - Enhanced */}
                  <div className="mt-4 p-3 rounded-xl border-2 border-dashed border-blue-300">
                    <h4 className="font-bold text-blue-700 text-sm mb-3 flex items-center gap-2">
                      <FaCalendar className="w-4 h-4" />
                      {card.exam_type}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-blue-600 w-4 h-4" />
                        <div>
                          <p className="text-gray-600 text-xs font-medium">Date</p>
                          <p className="font-bold text-gray-800">{new Date(card.exam_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-blue-600 w-4 h-4" />
                      <div>
                          <p className="text-gray-600 text-xs font-medium">Time</p>
                          <p className="font-bold text-gray-800 text-xs">{card.exam_time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mt-3">
                      <FaMapMarkerAlt className="text-blue-600 w-4 h-4 mt-1" />
                      <div>
                        <p className="text-gray-600 text-xs font-medium">Center</p>
                        <p className="font-bold text-gray-800 text-sm">{card.exam_center} - {card.room_no}</p>
                    </div>
                  </div>
                </div>

                  {/* Subjects - Enhanced */}
                  <div className="mt-4">
                    <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <FaBook className="w-4 h-4 text-blue-600" />
                      SUBJECTS:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {card.subjects?.slice(0, 2).map((subject, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 text-blue-800 rounded-full text-xs font-semibold shadow-sm"
                        >
                          {typeof subject === 'string' ? subject : subject.subjectName}
                        </span>
                      ))}
                      {card.subjects?.length > 2 && (
                        <span className="px-3 py-1 text-gray-700 rounded-full text-xs font-semibold shadow-sm">
                          +{card.subjects.length - 2} more
                        </span>
                      )}
                    </div>
                </div>

                  {/* Action Buttons - Enhanced */}
                    <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleDownload(card)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                    >
                        <FaDownload className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handlePrint(card)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                    >
                        <FaPrint className="w-4 h-4" />
                      Print
                    </button>
                    <button
                      onClick={() => deleteAdmitcard(card._id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                    >
                        <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-50'
              }`}
            >
              <FaChevronLeft className="w-3 h-3" />
              Previous
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-blue-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                currentPage === totalPages 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-50'
              }`}
            >
              Next
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* No Results */}
        {admitcards.length === 0 && !loading && (
          <div className="text-center py-12 rounded-xl shadow-lg">
            <p className="text-xl opacity-50">No admit cards found</p>
            <p className="text-sm opacity-70 mt-2">Try adjusting your search filters</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admitcards;

