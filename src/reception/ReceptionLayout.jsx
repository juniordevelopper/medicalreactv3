import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/ReceptionSidebar';
import Navbar from './components/ReceptionNavbar'; // Navbarni shifokornikiga o'xshatib Reception uchun moslaymiz
import { ReceptionProvider } from './components/ReceptionContext';
import styles from './ReceptionLayout.module.css';

const ReceptionLayout = () => {
  return (
    <ReceptionProvider>
      <div className={styles.layoutContainer}>
        <Sidebar />
        <div className={styles.mainWrapper}>
          <Navbar />
          <main className={styles.contentArea}>
            <Outlet />
          </main>
        </div>
      </div>
    </ReceptionProvider>
  );
};

export default ReceptionLayout;
