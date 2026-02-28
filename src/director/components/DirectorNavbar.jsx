import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdNotificationsNone, MdKeyboardArrowDown, MdPersonOutline, 
  MdLogout, MdMenu, MdBusiness 
} from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import styles from './directornavbar.module.css';

const DirectorNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Siz ko'rsatgan profil endpointidan ma'lumot olish
        const res = await axios.get('director/profile/');
        setUser(res.data);
      } catch (error) { 
        console.error("User yuklashda xatolik:", error); 
      }
    };
    fetchUser();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Xavfsiz chiqildi!");
    navigate('/auth/login');
  };

  const getInitial = () => user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'D';

  return (
    <header className={`${styles.navbar} ${!isSidebarOpen ? styles.expandedNav : ''}`}>
      <div className={styles.left}>
        <button className={styles.mobileMenuBtn} onClick={toggleSidebar}>
          <MdMenu />
        </button>
        <div className={styles.hospBadge}>
          <MdBusiness /> <span>{user?.hospital_name || "Medical Center"}</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.notifBox}>
          <MdNotificationsNone className={styles.notifIcon} />
          <span className={styles.badge}>2</span>
        </div>

        <div 
          className={styles.profileWrapper} 
          onClick={() => setShowProfileMenu(!showProfileMenu)} 
          ref={dropdownRef}
        >
          <div className={styles.avatarBox}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Director" />
            ) : (
              <div className={styles.letterAvatar}>{getInitial()}</div>
            )}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.full_name || "Yuklanmoqda..."}</span>
            <span className={styles.userRole}>Direktor</span>
          </div>
          <MdKeyboardArrowDown className={`${styles.arrow} ${showProfileMenu ? styles.rotate : ''}`} />

          {showProfileMenu && (
            <div className={styles.dropdown}>
              <button 
                onClick={() => navigate('/director/director-profile')} 
                className={styles.dropdownItem}
              >
                <MdPersonOutline /> <span>Profil Sozlamalari</span>
              </button>
              <div className={styles.divider}></div>
              <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>
                <MdLogout /> <span>Chiqish</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DirectorNavbar;
