import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdLock, MdCheckCircle } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import styles from './login.module.css';

const PasswordConfirm = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.patch('auth/password-reset-confirm/', {
        password,
        uidb64,
        token
      });

      if (res.status === 200) {
        toast.success("Parol muvaffaqiyatli yangilandi!");
        navigate('/auth/login');
      }
    } catch (error) {
      toast.error("Link muddati o'tgan yoki yaroqsiz!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2>Yangi parol</h2>
          <p>Profilingiz uchun yangi xavfsiz parol o'rnating</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <MdLock className={styles.icon} />
            <input 
              type="password" placeholder="Yangi parol" required 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Yangilanmoqda..." : "Parolni saqlash"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordConfirm;
