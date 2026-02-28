import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Komponentlar
import Welcome from './components/Welcome';
import NotFound from './components/NotFound';

// Auth
import Login from './auth/Login';
import Register from './auth/Register';
import VerifyEmail from './auth/VerifyEmail';
import ResetPassword from './auth/ResetPassword';
import PasswordConfirm from './auth/PasswordConfirm';

// Admin Layoutlar
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminRegions from './admin/pages/AdminRegions';
import AdminDepartments from './admin/pages/AdminDepartments';
import AdminListHospital from './admin/pages/AdminListHospital';
import AdminCreateHospital from './admin/pages/AdminCreateHospital';
import AdminDetailHospital from './admin/pages/AdminDetailHospital';
import AdminUpdateHospital from './admin/pages/AdminUpdateHospital';
import AdminProfile from './admin/pages/AdminProfile';

// Director Layoutlar
import DirectorLayout from './director/DirectorLayout';
import DirectorManageDoctors from './director/pages/DirectorManageDoctors';
import DirectorProfile from './director/pages/DirectorProfile';
import DirectorCreateDoctor from './director/pages/DirectorCreateDoctor';
import DirectorDoctorDetail from './director/pages/DirectorDoctorDetail';
import DirectorEditDoctor from './director/pages/DirectorEditDoctor';


// --- HIMOYALANGAN YO'L KOMPONENTI ---
const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('access');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Umumiy sahifalar */}
        <Route path="/" element={<Welcome />} />
        
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="password-confirm/:uidb64/:token" element={<PasswordConfirm />} />
          <Route path="verify-email/:uidb64/:token" element={<VerifyEmail />} />
        </Route>

        {/* ADMIN PANEL */}
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute allowedRole="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="regions" element={<AdminRegions />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="hospitals" element={<AdminListHospital />} />
          <Route path="hospitals/create-hospital" element={<AdminCreateHospital />} />
          <Route path="hospitals/detail-hospital/:id" element={<AdminDetailHospital />} />
          <Route path="hospitals/update-hospital/:id" element={<AdminUpdateHospital />} />
          <Route path="admin-profile" element={<AdminProfile />} />
          <Route path="users" element={<div>Admin Foydalanuvchilar</div>} />
          <Route path="profile" element={<div>Admin Profil</div>} />
        </Route>

        {/* DIRECTOR PANEL */}
        <Route 
          path="/director/*" 
          element={
            <PrivateRoute allowedRole="director">
              <DirectorLayout />
            </PrivateRoute>
          }
        >
          <Route path="manage-doctors" element={<DirectorManageDoctors />} />
          <Route path="director-profile" element={<DirectorProfile />} />
          <Route path="create-doctor" element={<DirectorCreateDoctor />} />
          <Route path="doctor-detail/:id" element={<DirectorDoctorDetail />} />
          <Route path="edit-doctor/:id" element={<DirectorEditDoctor />} />
        </Route>

        {/* DOCTOR PANEL */}
        <Route 
          path="/doctor/*" 
          element={
            <PrivateRoute allowedRole="doctor">
              <div>Doctor Layout</div>
            </PrivateRoute>
          }
        >
          <Route path="queues" element={<div>Doctor Navbatlar</div>} />
        </Route>

        {/* RECEPTION PANEL */}
        <Route 
          path="/reception/*" 
          element={
            <PrivateRoute allowedRole="reception">
              <div>Reception Layout</div>
            </PrivateRoute>
          }
        >
          <Route path="booking" element={<div>Reception Booking</div>} />
        </Route>

        {/* BEMOR PANEL */}
        <Route 
          path="/patient/*" 
          element={
            <PrivateRoute allowedRole="patient">
              <div>Bemor Layout</div>
            </PrivateRoute>
          }
        >
          <Route path="hospitals" element={<div>Bemor Shifoxonalar</div>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
