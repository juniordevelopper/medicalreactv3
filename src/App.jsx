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

// Layoutlar (Hozircha faqat AdminLayout tayyor, qolganlari o'rniga vaqtincha bo'sh komponent)
import AdminLayout from './admin/AdminLayout';
// Boshqa rollar uchun ham Layoutlar import qilinadi...

const App = () => {
  // LocalStorage'dan foydalanuvchi ma'lumotlarini olish mantiqi
  const token = localStorage.getItem('access');
  const user = JSON.parse(localStorage.getItem('user')); // Role bu yerda bo'ladi

  return (
    <BrowserRouter>
      {/* Toast xabarlari uchun konteyner */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Umumiy ochiq sahifalar */}
        <Route path="/" element={<Welcome />} />
        
        {/* Auth sahifalari */}
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="password-confirm/:uidb64/:token" element={<PasswordConfirm />} />
          <Route path="verify-email/:uidb64/:token" element={<VerifyEmail />} />
        </Route>

        {/* ADMIN PANEL (Faqat admin uchun) */}
        <Route 
          path="/admin" 
          element={token && user?.role === 'admin' ? <AdminLayout user={user} /> : <Navigate to="/auth/login" />}
        >
          <Route path="dashboard" element={<div>Admin Panel: Dashboard</div>} />
          <Route path="hospitals" element={<div>Admin Panel: Shifoxonalar</div>} />
          <Route path="users" element={<div>Admin Panel: Foydalanuvchilar</div>} />
          <Route path="profile" element={<div>Admin Panel: Profil</div>} />
        </Route>

        {/* DIRECTOR PANEL */}
        <Route 
          path="/director" 
          element={token && user?.role === 'director' ? <div>Director Layout</div> : <Navigate to="/auth/login" />}
        >
          <Route path="dashboard" element={<div>Director Dashboard</div>} />
        </Route>

        {/* DOCTOR PANEL */}
        <Route 
          path="/doctor" 
          element={token && user?.role === 'doctor' ? <div>Doctor Layout</div> : <Navigate to="/auth/login" />}
        >
          <Route path="queues" element={<div>Doctor Navbatlar</div>} />
        </Route>

        {/* RECEPTION PANEL */}
        <Route 
          path="/reception" 
          element={token && user?.role === 'reception' ? <div>Reception Layout</div> : <Navigate to="/auth/login" />}
        >
          <Route path="booking" element={<div>Reception Navbatga qo'shish</div>} />
        </Route>

        {/* BEMOR PANEL */}
        <Route 
          path="/patient" 
          element={token && user?.role === 'patient' ? <div>Bemor Layout</div> : <Navigate to="/auth/login" />}
        >
          <Route path="hospitals" element={<div>Bemor: Shifoxonalar</div>} />
        </Route>

        {/* 404 SAHIFA */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
