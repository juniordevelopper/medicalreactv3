import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdAccountCircle, MdLock, MdAppRegistration, MdArrowBack } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import styles from './register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      return toast.error("Parollar mos kelmadi!", { position: 'top-center' });
    }

    setLoading(true);
    try {
      const res = await axios.post('auth/register/', {
        full_name: formData.full_name,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      if (res.status === 201) {
        toast.success("Ro'yxatdan o'tdingiz! Emailingizni tasdiqlang.", { duration: 5000 });
        navigate('/auth/login');
      }
    } catch (error) {
      const msg = error.response?.data?.username || error.response?.data?.email || "Xatolik yuz berdi!";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Link to="/" className={styles.backHome}><MdArrowBack /> Asosiyga</Link>
      
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h2>Hisob yaratish</h2>
          <p>Tizimning barcha imkoniyatlaridan foydalanish uchun ma'lumotlaringizni kiriting</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <MdPerson className={styles.icon} />
              <input 
                type="text" placeholder="To'liq ismingiz" required
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>

            <div className={styles.inputGroup}>
              <MdEmail className={styles.icon} />
              <input 
                type="email" placeholder="Email manzilingiz" required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className={styles.inputGroup}>
              <MdAccountCircle className={styles.icon} />
              <input 
                type="text" placeholder="Username" required
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className={styles.inputGroup}>
              <MdLock className={styles.icon} />
              <input 
                type="password" placeholder="Parol" required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <MdLock className={styles.icon} />
              <input 
                type="password" placeholder="Parolni tasdiqlang" required
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <div className={styles.loader}></div> : <><MdAppRegistration /> Ro'yxatdan o'tish</>}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Profilingiz bormi?</span>
          <Link to="/auth/login">Kirish</Link>
        </div>
      </div>

      <div className={styles.bgCircles}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>
    </div>
  );
};

export default Register;
