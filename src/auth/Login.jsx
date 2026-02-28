import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MdEmail, MdLock, MdLogin, MdVisibility, 
  MdVisibilityOff, MdArrowBack 
} from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import styles from './login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Login so'rovi (Tokenlarni olish)
      const loginRes = await axios.post('auth/login/', {
        email: formData.email, // Backend username/email sifatida qabul qiladi
        password: formData.password
      });
      if (loginRes.status === 200) {
          localStorage.setItem('access', loginRes.data.access);
          localStorage.setItem('refresh', loginRes.data.refresh);

          // Umumiy API'ga murojaat (Token avtomatik axios interceptor orqali ketadi)
          const profileRes = await axios.get('auth/me/');
          const userData = profileRes.data;

          localStorage.setItem('user', JSON.stringify(userData));
          toast.success(`Xush kelibsiz, ${userData.full_name}!`);

          // Endi userData.role aniq keladi (Admin, Doctor yoki Patient)
          const role = userData.role;
          if (role === 'admin') navigate('/admin/dashboard');
          else if (role === 'director') navigate('/director/dashboard');
          else if (role === 'doctor') navigate('/doctor/queues');
          else if (role === 'reception') navigate('/reception/booking');
          else if (role === 'patient') navigate('/reception/booking');
          else navigate('/patient/hospitals');
      }
    } catch (error) {
      console.error("Login xatoligi:", error);
      const errorMsg = error.response?.data?.detail || "Login yoki parol xato!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* Asosiy sahifaga qaytish */}
      <Link to="/" className={styles.backHome}>
        <MdArrowBack /> Asosiy sahifaga
      </Link>

      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2>Tizimga kirish</h2>
          <p>Davom etish uchun ma'lumotlaringizni kiriting</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email / Username Input */}
          <div className={styles.inputGroup}>
            <MdEmail className={styles.icon} />
            <input 
              type="text" 
              placeholder="Email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Parol Input */}
          <div className={styles.inputGroup}>
            <MdLock className={styles.icon} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Parol" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <div className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </div>
          </div>

          {/* Parolni tiklash linki */}
          <div className={styles.forgotPass}>
            <Link to="/auth/reset-password">Parolni unutdingizmi?</Link>
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <div className={styles.loader}></div>
            ) : (
              <>
                <MdLogin /> Kirish
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Hisobingiz yo'qmi?</span>
          <Link to="/auth/register">Ro'yxatdan o'ting</Link>
        </div>
      </div>

      {/* Orqa fondagi animatsiyali doiralar */}
      <div className={styles.bgCircles}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>
    </div>
  );
};

export default Login;
