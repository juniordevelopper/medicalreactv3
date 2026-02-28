import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiUser, FiCalendar } from 'react-icons/fi';
import { MdOutlineMedicalServices } from 'react-icons/md';
import styles from './DoctorSidebar.module.css';
import { BsChatSquareText } from "react-icons/bs";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <MdOutlineMedicalServices className={styles.logoIcon} />
        <span className={styles.logoText}>Medical Online</span>
      </div>
      
      <nav className={styles.menu}>
          <NavLink
            to='/doctor/doctor-queue' 
            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
          >
            <span className={styles.icon}><FiUsers /></span>
            <span className={styles.text}>Navbatlar</span>
          </NavLink>
          <NavLink
            to='/doctor/doctor-chats' 
            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
          >
            <span className={styles.icon}><BsChatSquareText /></span>
            <span className={styles.text}>Chatlar</span>
          </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
