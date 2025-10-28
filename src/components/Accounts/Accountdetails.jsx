import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaMoneyBillWave, FaCalendar, FaCreditCard, FaCheckCircle, FaReceipt, FaDownload, FaPrint } from 'react-icons/fa';

const Accountdetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = location.state?.transaction;

  // Sample data if no transaction passed
  const defaultTransaction = {
    id: 1,
    studentName: 'Sneha Patel',
    enrollmentId: '1234007',
    type: 'Tuition Fee',
    amount: 50000,
    date: '2024-01-15',
    status: 'Paid',
    paymentMethod: 'Online',
    transactionId: 'TXN123456789',
    paymentDate: '2024-01-15',
    semester: '5th Semester',
    course: 'Computer Science',
    academicYear: '2023-2024',
    receiptNo: 'RCPT001234',
  };

  const details = transaction || defaultTransaction;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleDownloadReceipt = () => {
    console.log('Downloading receipt for:', details.studentName);
    // Add download logic here
  };

  const handlePrintReceipt = () => {
    console.log('Printing receipt for:', details.studentName);
    window.print();
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/accounts')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Accounts</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold">Transaction Details</h1>
              <p className="opacity-70 text-sm">Transaction ID: {details.transactionId}</p>
            </div>
          </div>
          {details.status === 'Paid' && (
            <div className="flex gap-2">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
              >
                <FaDownload className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                <FaPrint className="w-4 h-4" />
                Print
              </button>
            </div>
          )}
        </div>

        {/* Status Banner */}
        <div className={`rounded-xl p-6 border-2 ${getStatusColor(details.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FaCheckCircle className="w-12 h-12" />
              <div>
                <h2 className="text-2xl font-bold">Payment {details.status}</h2>
                <p className="text-sm mt-1">
                  {details.status === 'Paid' 
                    ? `Payment successfully received on ${details.paymentDate}` 
                    : details.status === 'Pending'
                    ? 'Awaiting payment confirmation'
                    : 'Payment is overdue, please clear the dues'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-70">Amount</p>
              <h3 className="text-3xl font-bold">₹{details.amount.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Student Information */}
            <div className="rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-blue-600" />
                <h2 className="text-xl font-semibold">Student Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-70">Student Name</p>
                  <p className="font-semibold">{details.studentName}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Enrollment ID</p>
                  <p className="font-semibold">{details.enrollmentId}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Course</p>
                  <p className="font-semibold">{details.course}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Semester</p>
                  <p className="font-semibold">{details.semester}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Academic Year</p>
                  <p className="font-semibold">{details.academicYear}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaMoneyBillWave className="text-blue-600" />
                <h2 className="text-xl font-semibold">Payment Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-70">Fee Type</p>
                  <p className="font-semibold">{details.type}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Amount</p>
                  <p className="font-semibold text-green-600 text-xl">₹{details.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Payment Method</p>
                  <p className="font-semibold">{details.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Payment Date</p>
                  <p className="font-semibold">{details.paymentDate}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Transaction ID</p>
                  <p className="font-semibold text-blue-600">{details.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Receipt Number</p>
                  <p className="font-semibold">{details.receiptNo}</p>
                </div>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaReceipt className="text-blue-600" />
                <h2 className="text-xl font-semibold">Fee Breakdown</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="opacity-70">Base Fee</span>
                  <span className="font-semibold">₹{(details.amount * 0.9).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="opacity-70">Additional Charges</span>
                  <span className="font-semibold">₹{(details.amount * 0.08).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="opacity-70">Processing Fee</span>
                  <span className="font-semibold">₹{(details.amount * 0.02).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-xl font-bold text-green-600">₹{details.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Receipt Preview */}
            {details.status === 'Paid' && (
              <div className="rounded-xl shadow-lg p-6 border-2 border-blue-200">
                <div className="text-center mb-4">
                  <FaReceipt className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                  <h3 className="font-bold text-lg">Official Receipt</h3>
                  <p className="text-sm opacity-70">Payment Confirmation</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-70">Receipt No:</span>
                    <span className="font-semibold">{details.receiptNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Date:</span>
                    <span className="font-semibold">{details.paymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Status:</span>
                    <span className="font-semibold text-green-600">Verified</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="rounded-xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 rounded-lg border hover:bg-blue-50 transition-all text-left">
                  View Payment History
                </button>
                <button className="w-full px-4 py-2 rounded-lg border hover:bg-blue-50 transition-all text-left">
                  Send Receipt via Email
                </button>
                <button className="w-full px-4 py-2 rounded-lg border hover:bg-blue-50 transition-all text-left">
                  Report Issue
                </button>
              </div>
            </div>

            {/* Important Note */}
            <div className="rounded-lg p-4 border-l-4 border-blue-500 bg-blue-50">
              <p className="text-sm font-semibold text-blue-800">Note:</p>
              <p className="text-sm text-blue-700 mt-1">
                Please keep this receipt for your records. It may be required for future reference.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Accountdetails;