import { NavLink } from 'react-router-dom';
import { FiUsers, FiPlusCircle, FiCalendar, FiMessageSquare, FiUser, FiHome } from 'react-icons/fi';
import { MdOutlineMedicalServices } from 'react-icons/md';
import styles from './ReceptionSidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <MdOutlineMedicalServices className={styles.logoIcon} />
        <span className={styles.logoText}>Med Reception</span>
      </div>
      
      <nav className={styles.menu}>
        <NavLink to="/reception/dashboard" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
          <FiHome className={styles.icon} /> <span className={styles.text}>Asosiy</span>
        </NavLink>
        <NavLink to="/reception/add-patient" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
          <FiPlusCircle className={styles.icon} /> <span className={styles.text}>Navbatga qo'shish</span>
        </NavLink>
        <NavLink to="/reception/patients" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
          <FiUsers className={styles.icon} /> <span className={styles.text}>Bemorlar</span>
        </NavLink>
        <NavLink to="/reception/doctors" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
          <FiCalendar className={styles.icon} /> <span className={styles.text}>Shifokorlar</span>
        </NavLink>
        <NavLink to="/reception/profile" className={({isActive}) => isActive ? styles.activeLink : styles.link}>
          <FiUser className={styles.icon} /> <span className={styles.text}>Profil</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
