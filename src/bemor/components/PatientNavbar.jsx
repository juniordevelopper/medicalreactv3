import { useState } from 'react';
import { usePatient } from './PatientContext';
import { FiBell, FiUser, FiLogOut, FiChevronDown, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './PatientNavbar.module.css';

const Navbar = () => {
  const { patient } = usePatient();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.navLeft}>
        <h3>Salom, <span className={styles.blue}>{patient?.full_name?.split(' ')[0]}</span>!</h3>
      </div>

      <div className={styles.navRight}>
        <div className={styles.notifBox}>
          <FiBell />
          <span className={styles.badge}>3</span>
        </div>

        <div className={styles.profileWrapper} onClick={() => setShowDropdown(!showDropdown)}>
          <div className={styles.avatarBox}>
            {patient?.avatar ? <img src={patient.avatar} alt="P" /> : <FiUser />}
          </div>
          <FiChevronDown className={showDropdown ? styles.rotate : ''} />

          {showDropdown && (
            <div className={styles.dropdown}>
              <div className={styles.dropHeader}>
                <strong>{patient?.full_name}</strong>
                <span>Bemor</span>
              </div>
              <hr />
              <Link to="/patient/patient-profile" className={styles.dropItem} onClick={() => setShowDropdown(false)}>
                <FiSettings /> <span>Profil sozlamalari</span>
              </Link>
              <div className={styles.dropItemLogout} onClick={() => { localStorage.clear(); window.location.href = '/auth/login'; }}>
                <FiLogOut /> <span>Tizimdan chiqish</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
