import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MdOutlineMedicalServices, MdDashboard, MdPeople, 
  MdSupportAgent, MdPersonSearch, MdClose, MdSettings 
} from 'react-icons/md';
import styles from './directorsidebar.module.css';

const DirectorSidebar = ({ isOpen, closeSidebar }) => {
  const menuItems = [
    { path: "/director/dashboard", icon: <MdDashboard />, label: "Asosiy Panel" },
    { path: "/director/manage-doctors", icon: <MdPeople />, label: "Shifokorlar" },
    { path: "/director/manage-receptions", icon: <MdSupportAgent />, label: "Reception" },
    // Profil yo'li to'g'irlandi
  ];

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.hiddenSidebar : ''}`}>
      <div className={styles.sidebarTop}>
        <div className={styles.logoSection}>
          <MdOutlineMedicalServices className={styles.logoIcon} />
          <span className={styles.logoText}>Medical Online</span>
        </div>
        <button className={styles.closeBtn} onClick={closeSidebar}>
          <MdClose />
        </button>
      </div>

      <nav className={styles.navMenu}>
        {menuItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path} 
            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            // 1080px gacha bo'lgan ekranlarda bosilganda yopish
            onClick={() => window.innerWidth <= 1080 && closeSidebar()}
          >
            <div className={styles.iconBox}>{item.icon}</div>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DirectorSidebar;
