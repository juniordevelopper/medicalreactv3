import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdNotificationsNone, 
  MdKeyboardArrowDown, 
  MdPersonOutline, 
  MdLogout,
  MdSettings,
  MdMenu,
  MdAdminPanelSettings
} from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import styles from './adminnavbar.module.css';

const AdminNavbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Backenddan user ma'lumotlarini olish
    const fetchUser = async () => {
      try {
        const res = await axios.get('auth/me/');
        setUser(res.data);
      } catch (error) {
        console.error("User fetch error:", error);
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
    toast.success("Xavfsiz chiqildi!", { position: 'top-center' });
    localStorage.clear();
    navigate('/auth/login');
  };

  const getInitial = () => user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A';

  return (
    <header className={`${styles.navbar} ${isSidebarCollapsed ? styles.expandedNav : ''}`}>
      <div className={styles.left}>
        <button className={styles.mobileMenuBtn} onClick={toggleSidebar}>
          <MdMenu />
        </button>
        <div className={styles.pageIndicator}>
          <MdAdminPanelSettings className={styles.adminIcon} />
          <span>Admin Panel</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.notifBox}>
          <MdNotificationsNone className={styles.notifIcon} />
          <span className={styles.badge}>5</span>
        </div>

        <div 
          className={styles.profileWrapper} 
          onClick={() => setShowProfileMenu(!showProfileMenu)} 
          ref={dropdownRef}
        >
          <div className={styles.avatarBox}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Admin" />
            ) : (
              <div className={styles.letterAvatar}>{getInitial()}</div>
            )}
          </div>
          
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.full_name || "Admin"}</span>
            <span className={styles.userRole}>
              {user?.role === 'admin' ? 'Super Admin' : (user?.role || "Yuklanmoqda...")}
            </span>
          </div>

          <MdKeyboardArrowDown className={`${styles.arrow} ${showProfileMenu ? styles.rotate : ''}`} />

          {showProfileMenu && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}><p>Hisob boshqaruvi</p></div>
              <button onClick={() => navigate('/admin/admin-profile')} className={styles.dropdownItem}>
                <MdPersonOutline /> <span>Profil</span>
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

export default AdminNavbar;
