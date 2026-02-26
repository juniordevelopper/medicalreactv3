import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  MdOutlineMedicalServices, MdDashboard, MdLocalHospital, 
  MdPeople, MdMenu, MdNotificationsNone, MdKeyboardArrowDown, MdLogout, MdPerson 
} from 'react-icons/md';
import styles from './adminlayout.module.css';

const AdminLayout = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/login');
  };

  return (
    <div className={styles.wrapper}>
      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <MdOutlineMedicalServices className={styles.logoIcon} />
            {!isCollapsed && <span>Medical Online</span>}
          </div>
          <MdMenu className={styles.toggleBtn} onClick={() => setIsCollapsed(!isCollapsed)} />
        </div>

        <nav className={styles.navMenu}>
          <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? styles.active : ''}>
            <MdDashboard className={styles.icon} />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink to="/admin/hospitals" className={({isActive}) => isActive ? styles.active : ''}>
            <MdLocalHospital className={styles.icon} />
            {!isCollapsed && <span>Shifoxonalar</span>}
          </NavLink>
          <NavLink to="/admin/users" className={({isActive}) => isActive ? styles.active : ''}>
            <MdPeople className={styles.icon} />
            {!isCollapsed && <span>Foydalanuvchilar</span>}
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={styles.mainArea}>
        {/* NAVBAR */}
        <header className={styles.navbar}>
          <div className={styles.pageTitle}>Admin Panel</div>

          <div className={styles.navRight}>
            <div className={styles.notif}>
              <MdNotificationsNone />
              <span className={styles.badge}>3</span>
            </div>

            <div className={styles.profileWrapper} onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className={styles.avatar}>
                <img src={user?.avatar || "https://via.placeholder.com"} alt="User" />
              </div>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{user?.full_name || "Admin Name"}</p>
                <span className={styles.userRole}>{user?.role || "Admin"}</span>
              </div>
              <MdKeyboardArrowDown className={showProfileMenu ? styles.rotate : ''} />

              {showProfileMenu && (
                <div className={styles.dropdown}>
                  <button onClick={() => navigate('/admin/profile')}>
                    <MdPerson /> Profil
                  </button>
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    <MdLogout /> Chiqish
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className={styles.content}>
           <Outlet /> {/* Bu yerda AdminDashboard va boshqa sahifalar chiqadi */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
