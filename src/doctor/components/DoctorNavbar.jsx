import React, { useState, useEffect } from 'react';
import { FiBell, FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import styles from './DoctorNavbar.module.css';
import { useDoctor } from './DoctorContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { doctor } = useDoctor();

  // Tashqariga bosilganda dropdownni yopish
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <header className={styles.navbar}>
      <div className={styles.navLeft}>
        <h2 className={styles.pageTitle}>Dashboard</h2>
      </div>

      <div className={styles.navRight}>
        {/* Bildirishnomalar */}
        <div className={styles.iconBox}>
          <FiBell className={styles.notifIcon} />
          <span className={styles.badge}>4</span>
        </div>

        {/* Profil Dropdown */}
        <div className={styles.profileWrapper} onClick={toggleDropdown}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{doctor?.full_name}</span>
              <span className={styles.userRole}>{doctor?.department_name}</span>
            </div>
            <div className={styles.avatarBox}>
              {doctor?.avatar ? (
                <img 
                  src={doctor.avatar} 
                  className={styles.avatarImg} 
                  alt="Profile"
                />) : (<FiUser className={styles.avatarIcon} />)}
              
              <FiChevronDown className={`${styles.chevron} ${showDropdown ? styles.rotate : ''}`} />
            </div>

          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <Link to="/doctor/doctor-profile" className={styles.dropdownItem} onClick={() => setShowDropdown(false)} >
                <FiSettings /> <span>Profil sozlamalari</span>
              </Link>
              <div className={`${styles.dropdownItem} ${styles.logout}`} onClick={() => { localStorage.clear(); window.location.href = '/auth/login';}} >
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
