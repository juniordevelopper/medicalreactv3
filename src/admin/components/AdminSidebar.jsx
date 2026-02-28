import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MdOutlineMedicalServices, MdDashboard, MdLocalHospital, 
  MdPeople, MdMenuOpen, MdMenu, MdLocationOn, MdLayers, MdClose 
} from 'react-icons/md';
import styles from './adminsidebar.module.css';

const AdminSidebar = ({ isCollapsed, isMobileOpen, toggleSidebar, closeMobile }) => {
  
  const menuItems = [
    { path: "/admin/dashboard", icon: <MdDashboard />, label: "Dashboard" },
    { path: "/admin/hospitals", icon: <MdLocalHospital />, label: "Shifoxonalar" },
    { path: "/admin/regions", icon: <MdLocationOn />, label: "Hududlar" },
    { path: "/admin/departments", icon: <MdLayers />, label: "Bo'limlar" },
    { path: "/admin/users", icon: <MdPeople />, label: "Foydalanuvchilar" },
  ];

  return (
    <>
      {/* OVERLAY: Faqat telefonda sidebar ochiq bo'lganda chiqadi */}
      {isMobileOpen && <div className={styles.overlay} onClick={closeMobile}></div>}

      <aside className={`
        ${styles.sidebar} 
        ${isCollapsed ? styles.collapsed : ''} 
        ${isMobileOpen ? styles.mobileOpen : ''}
      `}>
        {/* SIDEBAR TOP */}
        <div className={styles.sidebarTop}>
          <div className={styles.logoSection}>
            <MdOutlineMedicalServices className={styles.logoIcon} />
            <span className={styles.logoText}>Medical Online</span>
          </div>
          
          {/* Kompyuter uchun toggle */}
          <div className={styles.desktopToggle} onClick={toggleSidebar}>
            {isCollapsed ? <MdMenu /> : <MdMenuOpen />}
          </div>

          {/* Telefon uchun yopish tugmasi */}
          <div className={styles.mobileClose} onClick={closeMobile}>
            <MdClose />
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className={styles.navMenu}>
          {menuItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
              onClick={closeMobile} // Telefonda bosilganda yopiladi
            >
              <div className={styles.iconBox}>{item.icon}</div>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        {!isCollapsed && (
          <div className={styles.sidebarFooter}>
            <p>© 2026 Admin Panel</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;
