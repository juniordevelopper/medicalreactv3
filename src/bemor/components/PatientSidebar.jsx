import { NavLink } from 'react-router-dom';
import { FiHome, FiCalendar, FiClock, FiMessageSquare, FiUser } from 'react-icons/fi';
import { MdOutlineMedicalServices } from 'react-icons/md';
import styles from './PatientSidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <MdOutlineMedicalServices className={styles.logoIcon} />
        <span className={styles.logoText}>Medical Patient</span>
      </div>
      
      <nav className={styles.menu}>
        <NavLink to="/patient/dashboard" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
          <FiHome className={styles.icon} /> <span className={styles.text}>Asosiy panel</span>
        </NavLink>
        <NavLink to="/patient/booking" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
          <FiCalendar className={styles.icon} /> <span className={styles.text}>Navbatga yozilish</span>
        </NavLink>
        <NavLink to="/patient/my-bookings" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
          <FiClock className={styles.icon} /> <span className={styles.text}>Mening navbatlarim</span>
        </NavLink>
        <NavLink to="/patient/profile" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
          <FiUser className={styles.icon} /> <span className={styles.text}>Profil sozlamalari</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
