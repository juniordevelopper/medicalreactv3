import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdVpnKey, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import styles from './resetPassword.module.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backendda yozgan 'auth/password-reset/' endpointiga so'rov
      const res = await axios.post('auth/password-reset/', { email });
      
      if (res.status === 200) {
        setIsSent(true);
        toast.success("Tiklash linki emailga yuborildi!", { duration: 6000 });
      }
    } catch (error) {
      const msg = error.response?.data?.email || "Xatolik yuz berdi!";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Link to="/auth/login" className={styles.backBtn}><MdArrowBack /> Orqaga</Link>
      
      <div className={styles.card}>
        {!isSent ? (
          <>
            <div className={styles.header}>
              <div className={styles.iconCircle}><MdVpnKey /></div>
              <h2>Parolni tiklash</h2>
              <p>Profilingizga biriktirilgan email manzilingizni kiriting. Biz sizga parolni yangilash havolasini yuboramiz.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <MdEmail className={styles.icon} />
                <input 
                  type="email" 
                  placeholder="Email manzilingiz" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? <div className={styles.loader}></div> : "Havolani yuborish"}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successWrapper}>
            <MdCheckCircle className={styles.successIcon} />
            <h2>Xat yuborildi!</h2>
            <p><b>{email}</b> manzilini tekshiring. Havola orqali o'tib yangi parol o'rnatishingiz mumkin.</p>
            <Link to="/auth/login" className={styles.loginLink}>Login sahifasiga qaytish</Link>
          </div>
        )}
      </div>

      <div className={styles.bgDecoration}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
      </div>
    </div>
  );
};

export default ResetPassword;
