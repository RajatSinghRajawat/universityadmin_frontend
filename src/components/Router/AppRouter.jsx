import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';

// Import your existing components
import SimpleDashboard from '../Dashboard/SimpleDashboard';

// Students components
import AllStudent from '../Students/AllStudent';
import AddStudent from '../Students/AddStudent';
import AddexcelStudent from '../Students/AddexcelStudent';
import StudentProfile from '../Students/StudentProfile';
// import AddPayemnt from '../Students/AddPayemnt'; // File deleted, using Accounts/AddPayment instead
import PaymentHistory from '../Students/PaymentHistory';

// Employees components
import Employes from '../Employees/Employes';
import AddEmployess from '../Employees/AddEmployess';
import AddExcelEmployess from '../Employees/AddExcelEmployess';
import EmployessProfile from '../Employees/EmployessProfile';

// Academics components
import Academics from '../Academics/Academics';
import Courses from '../Academics/Courses';
import Sessions from '../Academics/Sessions';

// Other components
import Admissions from '../Admissions/Admissions';
import StundentAttendence from '../Attendence.jsx/StundentAttendence';
import BulkAttendance from '../Attendence.jsx/BulkAttendance';
import Admitcards from '../AdmitCards/Admitcards';
import Addadmitcard from '../AdmitCards/Addadmitcard';
import Accounts from '../Accounts/Accounts';
import Accountdetails from '../Accounts/Accountdetails';
import AddPayment from '../Accounts/AddPayment';
import Received from '../Accounts/Received';
import Missed from '../Accounts/Missed';
import Upcoming from '../Accounts/Upcoming';
import AdminLogin from '../Authentiation.jsx/AdminLogin';
import AdminProfile from '../Authentiation.jsx/AdminProfile';
import Dashboards from '../Dashboards/Dashboards';
import EditProfileModal from '../Employees/EditProfileModal';
import SingleStudentAttendece from '../Attendence.jsx/SingleStudentAttendece';
import ExStudents from '../Students/ExStudent';
import Message from '../message/Message';
import SidebarTest from '../Layout/SidebarTest';


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Default route - Redirect to login page */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        
        {/* Authentication Routes (without sidebar) */}
        <Route path="/auth/login" element={<AdminLogin />} />
        
        {/* Admin Profile */}
        <Route path="/admin/profile" element={<MainLayout><AdminProfile /></MainLayout>} />
        
        {/* Main application routes with sidebar */}
        <Route path="/dashboard" element={<MainLayout><SimpleDashboard /></MainLayout>} />

        {/* Academics Routes */}
        <Route path="/academics" element={<MainLayout><Academics /></MainLayout>} />
        <Route path="/academics/courses" element={<MainLayout><Courses /></MainLayout>} />
        <Route path="/academics/sessions" element={<MainLayout><Sessions /></MainLayout>} />

        {/* Students Routes */}
        <Route path="/students" element={<MainLayout><AllStudent /></MainLayout>} />
        <Route path="/students/all" element={<MainLayout><AllStudent /></MainLayout>} />
        <Route path="/student-profile/:id" element={<MainLayout><StudentProfile /></MainLayout>} />
        <Route path="/students/add" element={<MainLayout><AddStudent /></MainLayout>} />
        <Route path="/students/edit" element={<MainLayout><AddStudent /></MainLayout>} />
        <Route path="/students/add-excel" element={<MainLayout><AddexcelStudent /></MainLayout>} />
        <Route path="/students/add-payment/:id" element={<MainLayout><AddPayment /></MainLayout>} />
        <Route path="/students/payment-history" element={<MainLayout><PaymentHistory /></MainLayout>} />
        <Route path="/students/ex-students" element={<MainLayout><ExStudents /></MainLayout>} />

        {/* Employees Routes */}
        <Route path="/employees" element={<MainLayout><Employes /></MainLayout>} />
        <Route path="/employees/all" element={<MainLayout><Employes /></MainLayout>} />
        <Route path="/employees/add" element={<MainLayout><AddEmployess /></MainLayout>} />
        <Route path="/employees/add-excel" element={<MainLayout><AddExcelEmployess /></MainLayout>} />
        <Route path="/employees/profile" element={<MainLayout><EmployessProfile /></MainLayout>} />
        <Route path="/employees/edit-profile" element={<MainLayout><EditProfileModal /></MainLayout>} />

        {/* Other Routes */}
        <Route path="/admissions" element={<MainLayout><Admissions /></MainLayout>} />
        <Route path="/attendance" element={<MainLayout><StundentAttendence /></MainLayout>} />
        <Route path="/attendance/bulk" element={<MainLayout><BulkAttendance /></MainLayout>} />
        <Route path="/attendance/single-student" element={<MainLayout><SingleStudentAttendece /></MainLayout>} />
        <Route path="/admit-cards/all" element={<MainLayout><Admitcards /></MainLayout>} />
        <Route path="/admit-cards/add" element={<MainLayout><Addadmitcard /></MainLayout>} />
        <Route path="/accounts" element={<MainLayout><Accounts /></MainLayout>} />
        <Route path="/accounts/add-payment" element={<MainLayout><AddPayment /></MainLayout>} />
        <Route path="/accounts/add-payment/:id" element={<MainLayout><AddPayment /></MainLayout>} />
        <Route path="/accounts/details" element={<MainLayout><Accountdetails /></MainLayout>} />
        <Route path="/accounts/received" element={<MainLayout><Received /></MainLayout>} />
        <Route path="/accounts/missed" element={<MainLayout><Missed /></MainLayout>} />
        <Route path="/accounts/upcoming" element={<MainLayout><Upcoming /></MainLayout>} />
        <Route path="/dashboards" element={<MainLayout><Dashboards /></MainLayout>} />

        {/* Message Routes */}
        <Route path="/message" element={<MainLayout><Message /></MainLayout>} />

        {/* Test Routes */}
        <Route path="/test/sidebar" element={<SidebarTest />} />

        {/* Catch all route */}
        <Route path="*" element={
          <MainLayout>
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-400 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;
