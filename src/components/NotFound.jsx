import { useNavigate } from 'react-router-dom';
import { MdHome, MdErrorOutline, MdArrowBack } from 'react-icons/md';
import styles from './notfound.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorWrapper}>
          <h1 className={styles.errorCode}>404</h1>
          <div className={styles.medicalIcon}>
            <MdErrorOutline />
          </div>
        </div>
        
        <h2 className={styles.title}>Sahifa topilmadi!</h2>
        <p className={styles.description}>
          Afsuski, siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan. 
          Iltimos, kiritilgan manzilni tekshirib ko'ring.
        </p>

        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.secondaryBtn}>
            <MdArrowBack /> Orqaga qaytish
          </button>
          <button onClick={() => navigate('/')} className={styles.primaryBtn}>
            <MdHome /> Bosh sahifaga
          </button>
        </div>
      </div>

      {/* Orqa fondagi suzuvchi elementlar */}
      <div className={styles.floatingElements}>
        <div className={styles.plus}>+</div>
        <div className={styles.plus}>+</div>
        <div className={styles.plus}>+</div>
      </div>
    </div>
  );
};

export default NotFound;
