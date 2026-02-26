import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdLogin, MdVisibility, MdVisibilityOff } from 'react-icons/md';
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
      const res = await axios.post('auth/login/', formData);
      
      if (res.status === 200) {
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        
        toast.success('Xush kelibsiz!');
        
        // Rolga qarab yo'naltirish (Bu yerda tokendan rolni olish mantiqi bo'ladi)
        navigate('/admin/dashboard'); 
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Login yoki parol xato!";
      toast.error(errorMsg, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2>Tizimga kirish</h2>
          <p>Davom etish uchun ma'lumotlaringizni kiriting</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <MdEmail className={styles.icon} />
            <input 
              type="text" 
              placeholder="Email" 
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <MdLock className={styles.icon} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Parol" 
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <div className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </div>
          </div>

          <div className={styles.forgotPass}>
            <Link to="/auth/reset-password">Parolni unutdingizmi?</Link>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <div className={styles.loader}></div> : <><MdLogin /> Kirish</>}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Hisobingiz yo'qmi?</span>
          <Link to="/auth/register">Ro'yxatdan o'ting</Link>
        </div>
      </div>
      
      {/* Orqa fondagi harakatlanuvchi animatsiya */}
      <div className={styles.bgCircles}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>
    </div>
  );
};

export default Login;
