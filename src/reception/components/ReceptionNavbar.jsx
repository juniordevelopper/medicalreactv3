import React, { useState } from 'react';
import { useReception } from './ReceptionContext';
import { FiBell, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './ReceptionNavbar.module.css';

const Navbar = () => {
  const { reception } = useReception();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.navLeft}>
        <h3>Registratura Paneli</h3>
      </div>

      <div className={styles.navRight}>
        <div className={styles.notifBox}>
          <FiBell />
          <span className={styles.badge}>5</span>
        </div>

        <div className={styles.profileArea} onClick={() => setShowDropdown(!showDropdown)}>
          <div className={styles.info}>
            <span className={styles.name}>{reception?.full_name || 'Yuklanmoqda...'}</span>
            <span className={styles.role}>Reception</span>
          </div>
          <div className={styles.avatar}>
            {reception?.avatar ? <img src={reception.avatar} alt="P" /> : <FiUser />}
            <FiChevronDown className={showDropdown ? styles.rotate : ''} />
          </div>

          {showDropdown && (
            <div className={styles.dropdown}>
              <Link to="/reception/reception-profile" className={styles.dropItem}><FiUser /> Profil</Link>
              <div className={styles.dropItem} onClick={() => { localStorage.clear(); window.location.href = '/auth/login';}}><FiLogOut /> Chiqish</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
