import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MdVerified, MdError, MdHourglassEmpty } from 'react-icons/md';
import axios from '../api/axios';
import styles from './login.module.css'; // Mavjud uslubdan foydalanamiz

const VerifyEmail = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        // Backenddagi verify-email endpointiga so'rov
        const res = await axios.get(`auth/verify-email/${uidb64}/${token}/`);
        if (res.status === 200) {
          setStatus('success');
          setTimeout(() => navigate('/auth/login'), 3000); // 3 soniyadan keyin loginga
        }
      } catch (error) {
        setStatus('error');
      }
    };
    verify();
  }, [uidb64, token, navigate]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.loginCard} style={{ textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <MdHourglassEmpty className={styles.icon} style={{ fontSize: '4rem', position: 'static', color: '#64748b' }} />
            <h2>Tasdiqlanmoqda...</h2>
            <p>Iltimos, kuting, ma'lumotlar tekshirilmoqda.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <MdVerified style={{ fontSize: '5rem', color: '#22c55e', marginBottom: '20px' }} />
            <h2 style={{ color: '#22c55e' }}>Tasdiqlandi!</h2>
            <p>Email manzilingiz muvaffaqiyatli tasdiqlandi. Yo'naltirilmoqda...</p>
            <Link to="/auth/login" className={styles.submitBtn} style={{ marginTop: '20px', textDecoration: 'none' }}>Kirish</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <MdError style={{ fontSize: '5rem', color: '#ef4444', marginBottom: '20px' }} />
            <h2 style={{ color: '#ef4444' }}>Xatolik!</h2>
            <p>Link yaroqsiz yoki muddati o'tgan. Iltimos, qaytadan urinib ko'ring.</p>
            <Link to="/auth/register" className={styles.submitBtn} style={{ marginTop: '20px', textDecoration: 'none', background: '#64748b' }}>Qayta ro'yxatdan o'tish</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
