import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaFileExcel, FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AddExcelEmployess = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

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
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select an Excel file (.xlsx or .xls)'
        });
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/employees/download-template`);
      
      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employee_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Template downloaded successfully',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to download template'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select an Excel file to upload'
      });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('excel', selectedFile);

      const response = await fetch(`${backendUrl}/api/employees/upload-excel`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result.data);
        
        // Clear the selected file
        setSelectedFile(null);
        
        Swal.fire({
          icon: 'success',
          title: 'Upload Successful! ✅',
          html: `
            <div class="text-left" style="padding: 10px;">
              <p style="margin: 8px 0;"><strong>📊 Total Records:</strong> ${result.data.total}</p>
              <p style="margin: 8px 0;"><strong>✅ Successfully Added:</strong> <span style="color: green; font-weight: bold;">${result.data.successful}</span></p>
              <p style="margin: 8px 0;"><strong>❌ Failed:</strong> <span style="color: red; font-weight: bold;">${result.data.failed}</span></p>
              ${result.data.successful > 0 ? '<p style="margin-top: 12px; color: green;">✨ Employees have been saved to database!</p>' : ''}
            </div>
          `,
          confirmButtonText: 'View Employee List'
        }).then((res) => {
          if (res.isConfirmed && result.data.successful > 0) {
            navigate('/employees/all', { replace: true });
          }
        });

        // Auto-redirect after 3 seconds if all successful
        if (result.data.successful > 0 && result.data.failed === 0) {
          setTimeout(() => {
            navigate('/employees/all', { replace: true });
          }, 3000);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: result.message || 'Failed to upload employees'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to connect to server'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
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
          <h1 className="text-2xl font-bold">Upload Employee Excel File</h1>
        </div>

        {/* Instructions */}
        <div className="rounded-lg shadow-lg p-6 border border-blue-200 bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Upload Instructions</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>• Download the sample template below and fill in employee details</p>
            <p>• Ensure all required fields are filled correctly</p>
            <p>• <strong>Note:</strong> Profile images are optional for Excel uploads</p>
            <p>• Supported format: .xlsx, .xls</p>
            <p>• Maximum file size: 10MB</p>
          </div>
        </div>

        {/* Sample Template Download */}
        <div className="rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">📥 Download Sample Template</h3>
              <p className="opacity-70">Download the Excel template with the correct format</p>
            </div>
            <button 
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium"
            >
              <FaDownload className="w-4 h-4" />
              Download Template
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-6">📤 Upload Employee Data</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FaFileExcel className="mx-auto text-4xl text-green-500 mb-4" />
              
              {selectedFile ? (
                <div>
                  <h3 className="text-lg font-medium mb-2">📄 {selectedFile.name}</h3>
                  <p className="opacity-70 mb-4">File size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2">Drop your Excel file here</h3>
                  <p className="opacity-70 mb-4">or click to browse files</p>
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-all font-medium">
                    <FaUpload className="w-4 h-4" />
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* File Validation Info */}
            {selectedFile && (
              <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                <div className="flex items-center gap-2 text-green-800">
                  <FaFileExcel className="w-5 h-5" />
                  <span className="font-medium">File Ready for Upload</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your file has been selected and is ready to be processed.
                </p>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex justify-center space-x-6 pt-6">
              <button
                type="button"
                onClick={() => navigate('/employees/all')}
                className="px-8 py-3 border rounded-lg transition-all font-medium"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className={`px-8 py-3 rounded-lg transition-all font-medium flex items-center gap-2 ${
                  selectedFile && !uploading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FaUpload className="w-4 h-4" />
                    <span>Upload Employees</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <div className="rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📊 Upload Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="text-sm opacity-70 mb-1">Total Records</div>
                <div className="text-2xl font-bold text-blue-600">{uploadResult.total}</div>
              </div>
              
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="text-sm opacity-70 mb-1">Successfully Added</div>
                <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
                  <FaCheckCircle />
                  {uploadResult.successful}
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-red-50">
                <div className="text-sm opacity-70 mb-1">Failed</div>
                <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
                  <FaTimesCircle />
                  {uploadResult.failed}
                </div>
              </div>
            </div>

            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-red-600">❌ Error Details:</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {uploadResult.errors.map((error, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                      <span className="font-semibold">Row {error.row}:</span> {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadResult.successful > 0 && uploadResult.failed === 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-center">
                <p className="text-green-700 font-medium">
                  ✅ All employees uploaded successfully! Redirecting to employee list...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sample Data Preview */}
        <div className="rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Expected Data Format (Preview)</h3>
          <p className="text-sm opacity-70 mb-4">
            Note: The template contains all required fields. This is just a preview of some key fields.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  {['Name', 'Email', 'Phone', 'Department', 'Designation', 'Employee ID', 'University Code'].map(header => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm">Dr. John Doe</td>
                  <td className="px-4 py-3 text-sm">john.doe@university.com</td>
                  <td className="px-4 py-3 text-sm">9876543210</td>
                  <td className="px-4 py-3 text-sm">Computer Science</td>
                  <td className="px-4 py-3 text-sm">Professor</td>
                  <td className="px-4 py-3 text-sm">EMP001</td>
                  <td className="px-4 py-3 text-sm">GYAN001</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm">Ms. Jane Smith</td>
                  <td className="px-4 py-3 text-sm">jane.smith@university.com</td>
                  <td className="px-4 py-3 text-sm">9876543212</td>
                  <td className="px-4 py-3 text-sm">Mathematics</td>
                  <td className="px-4 py-3 text-sm">Associate Professor</td>
                  <td className="px-4 py-3 text-sm">EMP002</td>
                  <td className="px-4 py-3 text-sm">GYAN001</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> The complete template includes additional required fields like Salary, 
              Joining Date, Qualification, Experience, Date of Birth, Gender, Aadhar No, Address fields, and Bank Account details. 
              Profile images are optional. Please download the template to see all required columns.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddExcelEmployess;