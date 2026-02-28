import { Outlet } from 'react-router-dom';
import { PatientProvider } from './components/PatientContext';
import Sidebar from './components/PatientSidebar';
import Navbar from './components/PatientNavbar';
import styles from './PatientLayout.module.css';

const PatientLayout = () => {
  return (
    <PatientProvider>
      <div className={styles.layoutContainer}>
        <Sidebar />
        <div className={styles.mainWrapper}>
          <Navbar />
          <main className={styles.contentArea}>
            <Outlet />
          </main>
        </div>
      </div>
    </PatientProvider>
  );
};

export default PatientLayout;
