import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaCalendar, FaClock, FaMapMarkerAlt, FaBook, FaIdCard, FaUniversity, FaGraduationCap, FaBuilding, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Addadmitcard = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const universityCode = localStorage.getItem('universityCode');
  
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    semester: '',
    exam_type: '',
    exam_center: '',
    room_no: '',
    status: 'Active',
  });

  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);


  // University data
  const universities = [
    { id: 'GYAN001', name: 'Kishangarh Girls College', icon: FaGraduationCap, color: 'from-pink-600 to-rose-600' },
    { id: 'GYAN002', name: 'Kishangarh Law College', icon: FaBuilding, color: 'from-indigo-600 to-blue-600' }
  ];

  // Fetch students and courses
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [universityCode]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/students/all?universityCode=${universityCode}`);
      const result = await response.json();
      if (result.success) {
        setStudents(result.data || []);
      } else {
        console.error('Students API Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/courses/all?universityCode=${universityCode}`);
      const result = await response.json();
      if (result.success) {
        setCourses(result.data || []);
      } else {
        console.error('Courses API Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Subject management functions
  const addSubject = () => {
    const newSubject = {
      id: Date.now(),
      subjectName: '',
      examDate: '',
      examStartTime: '',
      examEndTime: '',
      roomNo: '',
      isEditing: true
    };
    setSubjects(prev => [...prev, newSubject]);
    setEditingSubject(newSubject.id);
  };

  const updateSubject = (subjectId, field, value) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId 
        ? { ...subject, [field]: value }
        : subject
    ));
  };

  const saveSubject = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject.subjectName || !subject.examDate || !subject.examStartTime || !subject.examEndTime) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields for the subject!'
      });
      return;
    }
    
    setSubjects(prev => prev.map(s => 
      s.id === subjectId 
        ? { ...s, isEditing: false }
        : s
    ));
    setEditingSubject(null);
  };

  const editSubject = (subjectId) => {
    setSubjects(prev => prev.map(s => 
      s.id === subjectId 
        ? { ...s, isEditing: true }
        : s
    ));
    setEditingSubject(subjectId);
  };

  const deleteSubject = (subjectId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This subject will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSubjects(prev => prev.filter(s => s.id !== subjectId));
        if (editingSubject === subjectId) {
          setEditingSubject(null);
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.student_id || !formData.course_id || !formData.semester || !formData.exam_type || !formData.exam_center || !formData.room_no) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields!'
      });
      return;
    }

    if (subjects.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please add at least one subject!'
      });
      return;
    }

    // Check if any subject is incomplete
    const incompleteSubjects = subjects.filter(s => !s.subjectName || !s.examDate || !s.examStartTime || !s.examEndTime);
    if (incompleteSubjects.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please complete all subject details!'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const admitCardData = {
        student_id: formData.student_id,
        course_id: formData.course_id,
        semester: formData.semester,
        exam_type: formData.exam_type,
        exam_center: formData.exam_center,
        room_no: formData.room_no,
        status: formData.status,
        subjects: subjects,
        universityCode: universityCode
      };
      
      const response = await fetch(`${backendUrl}/api/admitcards/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(admitCardData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Admit card generated successfully!',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/admit-cards/all');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.message || 'Failed to create admit card'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error!',
        text: 'Failed to create admit card. Please try again.'
      });
      console.error('Error creating admit card:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admit-cards/all')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-100"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generate Admit Card
            </h1>
            <p className="opacity-70 text-sm">Create new examination admit card for selected university</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* University Selection Section */}
          <div className="rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <FaUniversity className="text-blue-600" />
              <h2 className="text-xl font-semibold">Selected University</h2>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  {universityCode === 'GYAN001' ? <FaGraduationCap className="w-6 h-6" /> : <FaBuilding className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {universities.find(uni => uni.id === universityCode)?.name}
                  </h3>
                  <p className="text-sm text-white text-opacity-80">
                    University Code: {universityCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaUser className="text-blue-600" />
              <h2 className="text-xl font-semibold">Student Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Student <span className="text-red-500">*</span>
                </label>
                <select
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">
                    {students.length === 0 ? 'Loading students...' : 'Select Student'}
                  </option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} - {student.enrollmentId}
                    </option>
                  ))}
                </select>
                {students.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No students found for this university
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">
                    {courses.length === 0 ? 'Loading courses...' : 'Select Course'}
                  </option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseName} ({course.courseCode})
                    </option>
                  ))}
                </select>
                {courses.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No courses found for this university
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="3rd">3rd Semester</option>
                  <option value="4th">4th Semester</option>
                  <option value="5th">5th Semester</option>
                  <option value="6th">6th Semester</option>
                  <option value="7th">7th Semester</option>
                  <option value="8th">8th Semester</option>
                </select>
              </div>
            </div>
          </div>

          {/* Examination Details Section */}
          <div className="rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaIdCard className="text-blue-600" />
              <h2 className="text-xl font-semibold">Examination Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="exam_type"
                  value={formData.exam_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Exam Type</option>
                  <option value="Mid Term Examination">Mid Term Examination</option>
                  <option value="Final Term Examination">Final Term Examination</option>
                  <option value="Semester Examination">Semester Examination</option>
                  <option value="Annual Examination">Annual Examination</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <FaMapMarkerAlt className="inline w-3 h-3 mr-1" />
                  Exam Center <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="exam_center"
                  value={formData.exam_center}
                  onChange={handleChange}
                  placeholder="Enter exam center"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="room_no"
                  value={formData.room_no}
                  onChange={handleChange}
                  placeholder="Enter room number"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dynamic Subjects Section */}
          <div className="rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaBook className="text-blue-600" />
                <h2 className="text-xl font-semibold">Subjects & Exam Schedule</h2>
              </div>
              <button
                type="button"
                onClick={addSubject}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
              >
                <FaPlus className="w-4 h-4" />
                Add Subject
              </button>
            </div>

            {subjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaBook className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No subjects added yet. Click "Add Subject" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="border rounded-lg p-4 bg-gray-50">
                    {subject.isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-700">Subject {index + 1}</h3>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => saveSubject(subject.id)}
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSubject(subject.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Subject Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={subject.subjectName}
                              onChange={(e) => updateSubject(subject.id, 'subjectName', e.target.value)}
                              placeholder="Enter subject name"
                              className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              <FaCalendar className="inline w-3 h-3 mr-1" />
                              Exam Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={subject.examDate}
                              onChange={(e) => updateSubject(subject.id, 'examDate', e.target.value)}
                              className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              <FaClock className="inline w-3 h-3 mr-1" />
                              Start Time <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="time"
                              value={subject.examStartTime}
                              onChange={(e) => updateSubject(subject.id, 'examStartTime', e.target.value)}
                              className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              <FaClock className="inline w-3 h-3 mr-1" />
                              End Time <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="time"
                              value={subject.examEndTime}
                              onChange={(e) => updateSubject(subject.id, 'examEndTime', e.target.value)}
                              className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Room Number
                            </label>
                            <input
                              type="text"
                              value={subject.roomNo}
                              onChange={(e) => updateSubject(subject.id, 'roomNo', e.target.value)}
                              placeholder="Optional - specific room for this subject"
                              className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Subject</p>
                              <p className="font-semibold">{subject.subjectName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Date</p>
                              <p className="font-semibold">{new Date(subject.examDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Time</p>
                              <p className="font-semibold">{subject.examStartTime} - {subject.examEndTime}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Room</p>
                              <p className="font-semibold">{subject.roomNo || 'Main Hall'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            type="button"
                            onClick={() => editSubject(subject.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            title="Edit Subject"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSubject(subject.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                            title="Delete Subject"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Important Note */}
          <div className="rounded-lg p-4 border-l-4 border-yellow-500">
            <p className="text-sm font-semibold text-yellow-800">Important Note:</p>
            <p className="text-sm text-yellow-700 mt-1">
              Please verify all the information carefully before generating the admit card. 
              Once generated, the admit card will be available for download and print.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/admit-cards/all')}
              className="px-6 py-3 rounded-lg border border-gray-300 font-medium transition-all hover:bg-gray-50 hover:border-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.student_id || !formData.course_id || !formData.semester || !formData.exam_type || !formData.exam_center || !formData.room_no || subjects.length === 0 || students.length === 0 || courses.length === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg ${
                !loading && formData.student_id && formData.course_id && formData.semester && formData.exam_type && formData.exam_center && formData.room_no && subjects.length > 0 && students.length > 0 && courses.length > 0
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Admit Card'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Addadmitcard;


