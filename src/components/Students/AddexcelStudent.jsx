import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaFileExcel, FaDownload, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const AddexcelStudent = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const fileInputRef = useRef(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload only Excel files (.xlsx or .xls)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setError('');
    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('excel', selectedFile);

      const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow'
      };

      const response = await fetch(`${backendUrl}/api/students/upload-excel`, requestOptions);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setUploadResult(result);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a simple CSV template for download
    const templateData = [
      'name,email,phone,address,department,year,guardianName,guardianPhone,emergencyContact,universityCode,enrollmentId,JoiningDate,DateOfBirth,Gender,aadharNo,image',
      'John Doe,john@example.com,1234567890,123 Main St,Computer Science,2024,Parent Name,9876543210,9876543211,GYAN001,ENR001,2024-01-15,2000-05-15,Male,123456789012,profile.jpg',
      'Jane Smith,jane@example.com,1234567891,456 Oak Ave,Information Technology,2024,Guardian Name,9876543212,9876543213,GYAN001,ENR002,2024-01-16,2000-06-20,Female,123456789013,profile2.jpg'
    ].join('\n');

    const blob = new Blob([templateData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-6  transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/students')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Students</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Bulk Upload Students
            </h1>
          </div>
          
          <button
            onClick={downloadTemplate}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isDarkMode
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <FaDownload className="w-4 h-4" />
            <span>Download Template</span>
          </button>
        </div>

        {/* Course and Batch Selection */}
        <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="space-y-6">
            {/* Select Course */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>
                Select Course <span className="text-red-500">*</span>
              </label>
              <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}>
                <option>--Select Course--</option>
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Electronics</option>
                <option>Mechanical</option>
              </select>
            </div>

            {/* Select Batch */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>
                Select Batch <span className="text-red-500">*</span>
              </label>
              <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}>
                <option>--Select Batch--</option>
                <option>2024-2028</option>
                <option>2023-2027</option>
                <option>2022-2026</option>
                <option>2021-2025</option>
              </select>
            </div>

            {/* Upload Excel */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>
                Upload Excel <span className="text-red-500">*</span>
              </label>
              
              {/* Download Sample Link */}
              <div className="mb-3">
                <button
                  onClick={downloadTemplate}
                  className="text-blue-600 hover:text-blue-800 underline text-sm flex items-center gap-1"
                >
                  Download Sample.xlsx
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </button>
              </div>

              {/* File Input */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileInput}
                  className={`w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              {selectedFile && (
                <div className="mt-2 text-sm text-green-600">
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>

            {/* Add Students Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                  selectedFile && !uploading
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {uploading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin inline mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Add Students'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error and Result Display */}
        <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="space-y-4">

            {/* Error Display */}
            {error && (
              <div className={`flex items-center gap-2 p-4 rounded-lg ${
                isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
              }`}>
                <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

        
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default AddexcelStudent;
